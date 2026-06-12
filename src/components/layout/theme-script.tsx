import { DEFAULT_THEME, THEME_STORAGE_KEY } from "@/lib/theme"

export function ThemeScript() {
  const script = `
    (function () {
      try {
        var stored = localStorage.getItem("${THEME_STORAGE_KEY}");
        var theme = stored === "light" ? "light" : "${DEFAULT_THEME}";
        if (theme === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      } catch (e) {}
    })();
  `

  return <script dangerouslySetInnerHTML={{ __html: script }} />
}
