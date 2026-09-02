(() => {
  const DEFAULT_LANGUAGE = "en";
  const CHINESE_LANGUAGE = "zh-CN";
  const FALLBACK_FOOTER = "Habitgo · © 2026 XuWen";
  const locales = window.HABITGO_LOCALES || {};

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

  const systemLanguages = navigator.languages?.length
    ? navigator.languages
    : [navigator.language];
  const language =
    normalizeLanguage(new URLSearchParams(window.location.search).get("language")) ||
    normalizeLanguage(readStoredLanguage()) ||
    systemLanguages.map(normalizeLanguage).find(Boolean) ||
    DEFAULT_LANGUAGE;

  const translate = (key, fallback) =>
    locales[language]?.[key] ?? locales[DEFAULT_LANGUAGE]?.[key] ?? fallback;

  const resources = [
    {
      href: "./privacy.html",
      titleKey: "resources.privacy.title",
      title: "Privacy Policy →",
      descriptionKey: "resources.privacy.description",
      description: "What we collect, how we use it, and how we protect your information",
    },
    {
      href: "./terms.html",
      titleKey: "resources.terms.title",
      title: "Terms of Service →",
      descriptionKey: "resources.terms.description",
      description: "Service details, account deletion, conduct rules, and disclaimers",
    },
    {
      href: "./support.html",
      titleKey: "resources.support.title",
      title: "Support & Feedback →",
      descriptionKey: "resources.support.description",
      description: "Contact email · Frequently asked questions",
    },
  ];

  document.querySelectorAll("[data-habitgo-site-footer]").forEach((mount) => {
    const nav = document.createElement("nav");
    nav.className = "resources";
    nav.setAttribute(
      "aria-label",
      translate("aria.resources", "Legal terms and user support"),
    );

    resources.forEach((resource) => {
      const link = document.createElement("a");
      link.className = "resource-card";
      link.href = resource.href;

      const title = document.createElement("b");
      title.textContent = translate(resource.titleKey, resource.title);
      const description = document.createElement("span");
      description.textContent = translate(
        resource.descriptionKey,
        resource.description,
      );

      link.append(title, description);
      nav.append(link);
    });

    const footer = document.createElement("footer");
    footer.textContent = translate("footer.text", FALLBACK_FOOTER);
    mount.replaceChildren(nav, footer);
  });
})();
