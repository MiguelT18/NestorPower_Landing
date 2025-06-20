const $themeButton = document.getElementById("theme-button");
const $sun = document.getElementById("sun-icon");
const $moon = document.getElementById("moon-icon");

const root: HTMLElement = document.documentElement;

function resetSVGAnimation($el: HTMLElement | null) {
  if (!$el) return;
  const html = $el.innerHTML;
  $el.innerHTML = "";
  // Forzar reflow para asegurar el reinicio
  void $el.offsetWidth;
  $el.innerHTML = html;
}

if ($themeButton instanceof HTMLButtonElement) {
  $themeButton?.addEventListener("click", () => {
    const isNowDark: boolean = root.classList.toggle("dark");
    localStorage.theme = isNowDark ? "dark" : "light";

    // Reiniciar animación de los SVGs
    resetSVGAnimation($sun);
    resetSVGAnimation($moon);
  });
}

if (
  localStorage.theme === "dark" ||
  (!("theme" in localStorage) &&
    window.matchMedia("(prefers-color-scheme: dark)").matches)
) {
  document.documentElement.classList.add("dark");
}