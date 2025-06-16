const $themeButton = document.getElementById("theme-button");
const root: HTMLElement = document.documentElement;

if ($themeButton instanceof HTMLButtonElement) {
  $themeButton?.addEventListener("click", () => {
    const isNowDark: boolean = root.classList.toggle("dark");
    localStorage.theme = isNowDark ? "dark" : "light";

    const themeEvent = new CustomEvent("theme", {
      detail: localStorage.theme
    });

    document.dispatchEvent(themeEvent);
  });
}

if (
  localStorage.theme === "dark" ||
  (!("theme" in localStorage) &&
    window.matchMedia("(prefers-color-scheme: dark)").matches)
) {
  document.documentElement.classList.add("dark");
}