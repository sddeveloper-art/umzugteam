import { useI18n, languages } from "@/hooks/useI18n";

const LanguageSwitcher = () => {
  const { language, setLanguage } = useI18n();

  return (
    <div className="flex items-center gap-1">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          className={`text-lg leading-none px-1 py-0.5 rounded transition-opacity ${
            language === lang.code ? "opacity-100" : "opacity-40 hover:opacity-70"
          }`}
          aria-label={lang.label}
          title={lang.label}
        >
          {lang.flag}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
