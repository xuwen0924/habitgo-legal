(() => {
  const LIGHT_THEME_COLOR = "#F2F7FB";
  const DARK_THEME_COLOR = "#233355";
  const DEFAULT_LANGUAGE = "en";
  const CHINESE_LANGUAGE = "zh-CN";
  const STORAGE_KEY = "habitgo.language";
  const html = document.documentElement;
  const params = new URLSearchParams(window.location.search);
  const colorScheme = window.matchMedia("(prefers-color-scheme: dark)");
  const themeMeta = document.querySelector('meta[name="theme-color"]');

  const readThemeOverride = () => {
    const value = params.get("isDark");
    if (value === "true") return "dark";
    if (value === "false") return "light";
    return null;
  };

  const themeOverride = readThemeOverride();

  const applyTheme = () => {
    const theme = themeOverride || (colorScheme.matches ? "dark" : "light");
    if (themeOverride) {
      html.dataset.theme = theme;
    } else {
      delete html.dataset.theme;
    }
    html.style.colorScheme = theme;
    themeMeta?.setAttribute(
      "content",
      theme === "dark" ? DARK_THEME_COLOR : LIGHT_THEME_COLOR,
    );
  };

  applyTheme();
  if (!themeOverride) colorScheme.addEventListener?.("change", applyTheme);

  const normalizeLanguage = (value) => {
    if (typeof value !== "string") return null;
    const normalized = value.trim().replaceAll("_", "-").toLowerCase();
    if (normalized === "en" || normalized.startsWith("en-")) return DEFAULT_LANGUAGE;
    if (normalized === "zh" || normalized.startsWith("zh-")) return CHINESE_LANGUAGE;
    return null;
  };

  const readStoredLanguage = () => {
    try {
      return localStorage.getItem("habitgo.language");
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

  const language =
    normalizeLanguage(params.get("language")) ||
    normalizeLanguage(readStoredLanguage()) ||
    readSystemLanguage() ||
    DEFAULT_LANGUAGE;

  const locales = window.HABITGO_LEGAL_LOCALES || {};
  const page = html.dataset.page;

  const translate = (key) =>
    locales[language]?.[page]?.[key] ??
    locales[language]?.common?.[key] ??
    locales[DEFAULT_LANGUAGE]?.[page]?.[key] ??
    locales[DEFAULT_LANGUAGE]?.common?.[key] ??
    key;

  const setTranslatedAttribute = (selector, attribute) => {
    document.querySelectorAll(selector).forEach((element) => {
      const dataName = selector.slice(1, -1);
      element.setAttribute(attribute, translate(element.getAttribute(dataName)));
    });
  };

  html.lang = language;
  document.documentElement.lang = language;
  document.title = translate("meta.title");
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = translate(element.dataset.i18n);
  });
  setTranslatedAttribute("[data-i18n-aria-label]", "aria-label");
  setTranslatedAttribute("[data-i18n-alt]", "alt");
})();
