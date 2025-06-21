import AntesImg1 from "@assets/images/andre-antes.jpg";
import DespuesImg1 from "@assets/images/andre-despues.jpg";
import AntesImg2 from "@assets/images/dario-antes.png";
import DespuesImg2 from "@assets/images/dario-despues.png";
import AntesImg3 from "@assets/images/erlan-antes.png";
import DespuesImg3 from "@assets/images/erlan-despues.png";
import AntesImg4 from "@assets/images/esteban-antes.png";
import DespuesImg4 from "@assets/images/esteban-despues.png";
import AntesImg5 from "@assets/images/leandro-antes.jpg";
import DespuesImg5 from "@assets/images/leandro-despues.jpg";
import AntesImg6 from "@assets/images/alex-antes.png";
import DespuesImg6 from "@assets/images/alex-despues.png";

interface TestimonialImage {
  antes: ImageMetadata;
  despues: ImageMetadata;
}

export const loadTestimonialImages = (): TestimonialImage[] => {
  return [
    {
      antes: AntesImg1,
      despues: DespuesImg1,
    },
    {
      antes: AntesImg2,
      despues: DespuesImg2,
    },
    {
      antes: AntesImg3,
      despues: DespuesImg3,
    },
    {
      antes: AntesImg4,
      despues: DespuesImg4,
    },
    {
      antes: AntesImg5,
      despues: DespuesImg5
    },
    {
      antes: AntesImg6,
      despues: DespuesImg6
    }
  ];
};