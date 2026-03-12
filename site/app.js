(function () {
  const LANGS = ["en", "ru"];
  let currentLang = "en";
  const translations = {};

  function getFromPath(object, path) {
    if (!path) return object;
    return path
      .split(".")
      .reduce(
        (acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined),
        object,
      );
  }

  function format(template, data) {
    if (!template) return "";
    return template.replace(/\{(\w+)\}/g, (match, key) =>
      data && key in data ? data[key] : match,
    );
  }

  function applyTranslations(t) {
    document.documentElement.lang = currentLang;

    document.querySelectorAll("[data-i18n-key]").forEach((el) => {
      const key = el.getAttribute("data-i18n-key");
      const value = getFromPath(t, key);
      if (value !== undefined && value !== null) el.textContent = value;
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      const value = getFromPath(t, key);
      if (value !== undefined && value !== null)
        el.setAttribute("placeholder", value);
    });
  }

  function updateLangButtons() {
    const enBtn = document.getElementById("lang-en");
    const ruBtn = document.getElementById("lang-ru");
    if (!enBtn || !ruBtn) return;
    enBtn.classList.toggle("lang-btn-active", currentLang === "en");
    ruBtn.classList.toggle("lang-btn-active", currentLang === "ru");
  }

  function defaultSportOptions(lang) {
    if (lang === "ru") {
      return [
        { value: "football", label: "Футбол" },
        { value: "basketball", label: "Баскетбол" },
        { value: "volleyball", label: "Волейбол" },
        { value: "tennis", label: "Теннис" },
        { value: "swimming", label: "Плавание" },
        { value: "athletics", label: "Лёгкая атлетика" },
        { value: "martial_arts", label: "Единоборства" },
        { value: "other", label: "Другое" },
      ];
    }
    return [
      { value: "football", label: "Football" },
      { value: "basketball", label: "Basketball" },
      { value: "volleyball", label: "Volleyball" },
      { value: "tennis", label: "Tennis" },
      { value: "swimming", label: "Swimming" },
      { value: "athletics", label: "Athletics" },
      { value: "martial_arts", label: "Martial arts" },
      { value: "other", label: "Other" },
    ];
  }

  function showOrHideOther(prefix = "") {
    const sportSel = document.getElementById(`${prefix}sport`);
    const otherField = document.getElementById(`${prefix}other-field`);
    const otherDetails = document.getElementById(`${prefix}other-details`);
    if (!sportSel || !otherField || !otherDetails) return;

    const show = sportSel.value === "other";
    otherField.style.display = show ? "" : "none";
    otherDetails.required = show;
    if (!show) otherDetails.value = "";
  }

  function populateSportOptions(loaded, prefix = "") {
    const t = loaded ? loaded : translations[currentLang] || {};
    const sportSel = document.getElementById(`${prefix}sport`);
    if (!sportSel) return;

    const currentValue = sportSel.value;
    sportSel.innerHTML = "";

    const options =
      t.form && Array.isArray(t.form.sportOptions)
        ? t.form.sportOptions
        : defaultSportOptions(currentLang);

    options.forEach((o) => {
      const opt = document.createElement("option");
      opt.value = o.value;
      opt.textContent = o.label;
      sportSel.appendChild(opt);
    });

    if (currentValue && options.some((o) => o.value === currentValue)) {
      sportSel.value = currentValue;
    }

    showOrHideOther(prefix);
  }

  function loadLocale(lang) {
    if (!LANGS.includes(lang)) return;
    currentLang = lang;
    updateLangButtons();

    if (translations[lang]) {
      applyTranslations(translations[lang]);
      populateSportOptions(null, "athlete-");
      return;
    }

    fetch(`i18n/${lang}.json`)
      .then((r) => r.json())
      .then((obj) => {
        translations[lang] = obj;
        applyTranslations(obj);
        populateSportOptions(obj, "athlete-");
      })
      .catch(() => {
        console.error("Failed to load locale", lang);
      });
  }

  function preloadLocale(lang) {
    if (!LANGS.includes(lang)) return;
    if (translations[lang]) return;
    fetch(`i18n/${lang}.json`)
      .then((r) => r.json())
      .then((obj) => {
        translations[lang] = obj;
      })
      .catch(() => {
        console.error("Failed to preload locale", lang);
      });
  }

  function initFormBehavior() {
    const form = document.getElementById("contact-form");
    const athleteForm = document.getElementById("athlete-contact-form");
    const athleteSportSel = document.getElementById("athlete-sport");
    const athleteThankYouDiv = document.getElementById("athlete-thank-you");

    if (athleteForm && athleteSportSel && athleteThankYouDiv) {
      athleteSportSel.addEventListener("change", () => showOrHideOther("athlete-"));

      athleteForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name =
          document.getElementById("athlete-name").value.trim() ||
          (currentLang === "ru" ? "Гость" : "Guest");
        const t = translations[currentLang] || {};

        const template =
          (t.form && t.form.thankYou) ||
          t.thankYou ||
          "Thank you, {name}!";
        athleteThankYouDiv.textContent = format(template, { name });
        athleteThankYouDiv.classList.remove("hidden");
        athleteForm.classList.add("hidden");
        athleteThankYouDiv.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }

    const partnerForm = document.getElementById("partner-contact-form");
    const partnerThankYouDiv = document.getElementById("partner-thank-you");

    if (partnerForm && partnerThankYouDiv) {
      partnerForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name =
          document.getElementById("partner-name").value.trim() ||
          (currentLang === "ru" ? "Гость" : "Guest");
        const t = translations[currentLang] || {};

        const template =
          (t.partnerForm && t.partnerForm.thankYou) ||
          "Thank you, {name}!";
        partnerThankYouDiv.textContent = format(template, { name });
        partnerThankYouDiv.classList.remove("hidden");
        partnerForm.classList.add("hidden");
        partnerThankYouDiv.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    const enBtn = document.getElementById("lang-en");
    const ruBtn = document.getElementById("lang-ru");
    if (enBtn) enBtn.addEventListener("click", () => loadLocale("en"));
    if (ruBtn) ruBtn.addEventListener("click", () => loadLocale("ru"));

    initFormBehavior();

    // Populate athlete sports select once DOM is ready (locale may load async)
    populateSportOptions(null, "athlete-");

    loadLocale("en");
    preloadLocale("ru");
  });
})();
