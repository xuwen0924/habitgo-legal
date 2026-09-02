(() => {
  const DEFAULT_LANGUAGE = "en";
  const CHINESE_LANGUAGE = "zh-CN";
  const STORAGE_KEY = "habitgo.language";
  const locales = window.HABITGO_LOCALES || {};

  const normalizeLanguage = (value) => {
    if (typeof value !== "string") return null;
    const normalized = value.trim().replaceAll("_", "-").toLowerCase();
    if (normalized === "en" || normalized.startsWith("en-")) return DEFAULT_LANGUAGE;
    if (normalized === "zh" || normalized.startsWith("zh-")) return CHINESE_LANGUAGE;
    return null;
  };

  const readQueryLanguage = () =>
    new URLSearchParams(window.location.search).get("language");

  const readStoredLanguage = () => {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (_error) {
      return null;
    }
  };

  const readSystemLanguage = () => {
    const candidates = navigator.languages?.length
      ? navigator.languages
      : [navigator.language];
    return candidates.map(normalizeLanguage).find(Boolean) || null;
  };

  const resolveLanguage = () =>
    normalizeLanguage(readQueryLanguage()) ||
    normalizeLanguage(readStoredLanguage()) ||
    readSystemLanguage() ||
    DEFAULT_LANGUAGE;

  const translate = (language, key) =>
    locales[language]?.[key] ?? locales[DEFAULT_LANGUAGE]?.[key] ?? key;

  const setTranslatedAttribute = (selector, attribute, language) => {
    document.querySelectorAll(selector).forEach((element) => {
      const key = element.getAttribute(selector.slice(1, -1));
      element.setAttribute(attribute, translate(language, key));
    });
  };

  let currentLanguage = resolveLanguage();
  const dialog = document.querySelector("#language-dialog");
  const trigger = document.querySelector("#language-trigger");

  const applyLanguage = (language) => {
    const normalized = normalizeLanguage(language) || DEFAULT_LANGUAGE;
    currentLanguage = normalized;
    document.documentElement.lang = normalized;
    document.title = translate(normalized, "meta.title");

    document.querySelectorAll("[data-i18n]").forEach((element) => {
      element.textContent = translate(normalized, element.dataset.i18n);
    });
    setTranslatedAttribute("[data-i18n-aria-label]", "aria-label", normalized);
    setTranslatedAttribute("[data-i18n-aria-description]", "aria-description", normalized);
    setTranslatedAttribute("[data-i18n-alt]", "alt", normalized);

    document.querySelectorAll("[data-language]").forEach((option) => {
      option.setAttribute(
        "aria-pressed",
        String(option.dataset.language === normalized),
      );
    });
  };

  const saveLanguage = (language) => {
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch (_error) {
      // The current page still switches when storage is unavailable.
    }
  };

  const syncLanguageUrl = (language) => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("language", language);
      history.replaceState(history.state, "", url);
    } catch (_error) {
      // URL synchronization is an enhancement; rendering must keep working.
    }
  };

  const openDialog = () => {
    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }
  };

  const closeDialog = () => {
    if (typeof dialog.close === "function" && dialog.open) {
      dialog.close();
    } else {
      dialog.removeAttribute("open");
    }
    trigger.focus();
  };

  trigger.addEventListener("click", openDialog);
  dialog.querySelector("[data-dialog-close]").addEventListener("click", closeDialog);
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) closeDialog();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && dialog.hasAttribute("open")) closeDialog();
  });

  dialog.querySelectorAll("[data-language]").forEach((option) => {
    option.addEventListener("click", () => {
      const language = normalizeLanguage(option.dataset.language);
      if (!language) return;
      applyLanguage(language);
      saveLanguage(language);
      syncLanguageUrl(language);
      closeDialog();
    });
  });

  applyLanguage(currentLanguage);
})();
