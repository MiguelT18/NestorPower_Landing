import Swiper from "swiper";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import type { SwiperOptions } from "swiper/types";
import "swiper/css";
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/zoom';


Swiper.use([Navigation, Pagination, Autoplay]);

/**
 * Inicializa uno o múltiples carruseles Swiper.
 * @param selector - Selector de los contenedores Swiper
 * @param options - Configuración Swiper
 * @returns Instancias de Swiper
 */
export default function initSwiperCarousel(
  selector: string,
  options: SwiperOptions
): Swiper[] {
  const elements = document.querySelectorAll<HTMLElement>(selector);
  const swipers: Swiper[] = [];

  elements.forEach((el) => {
    const container = el.querySelector(".swiper"); // o el propio 'el', según markup
    if (!container) {
      console.warn(`[SwiperInit] No .swiper found inside ${selector}`);
      return;
    }

    // Prevenir múltiples inicializaciones
    if ((container as any)._swiper) return;

    const swiper = new Swiper(container as HTMLElement, options)
      ; (container as any)._swiper = swiper;
    swipers.push(swiper);
  });

  return swipers;
}