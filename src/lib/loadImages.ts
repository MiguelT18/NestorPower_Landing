import AntesImg1 from "@assets/images/antes_1.jpg";
import DespuesImg1 from "@assets/images/despues_1.jpg";
import AntesImg2 from "@assets/images/antes_2.jpg";
import DespuesImg2 from "@assets/images/despues_2.jpg";
import AntesImg3 from "@assets/images/antes_3.jpg";
import DespuesImg3 from "@assets/images/despues_3.jpg";
import AntesImg4 from "@assets/images/antes_4.jpg";
import DespuesImg4 from "@assets/images/despues_4.jpg";

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
  ];
};