import React, { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { ImageCarousel } from "../../../../components/Slider/ImageCarousel";
import { motion } from "framer-motion";


export const MainContentSection = (): JSX.Element => {
  // Data for action buttons


  // Изображения для слайдера
  const carouselImages = [
    "/1--1--3.png",
    "/1-201-11.png",
    "/1--1--2.png"
  ];

  return (
    <section className="relative w-full h-[450px] md:h-[550px] lg:h-[650px] bg-blue-4 overflow-hidden shadow-[0px_0px_30px_#0000001a]">
      <div className="absolute inset-0 overflow-hidden">
        {/* Волны фона */}
        <svg className="absolute w-full h-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <motion.path
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ duration: 1 }}
            fill="rgba(255,255,255,0.3)" 
            d="M0,320L48,277.3C96,235,192,149,288,128C384,107,480,149,576,165.3C672,181,768,171,864,186.7C960,203,1056,245,1152,240C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></motion.path>
        </svg>
        
        <svg className="absolute w-full h-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <motion.path 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            transition={{ duration: 1.5, delay: 0.3 }}
            fill="rgba(255,255,255,0.2)" 
            d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,112C672,128,768,192,864,192C960,192,1056,128,1152,96C1248,64,1344,64,1392,64L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></motion.path>
        </svg>
      </div>

      {/* Полноэкранный слайдер */}
      <div className="absolute inset-0 z-0 w-full h-full">
        <ImageCarousel images={carouselImages} />
      </div>


    </section>
  );
};