"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import React from "react";

export default function CaseStudies() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const caseStudies = [
    {
      quote:
        '"Generative AI will be the biggest game-changer for advisory services for a generation. We wanted to position ourselves to capitalize on this opportunity and lead in the tax, legal, and HR space."',
      author: "Bivek Sharma",
      title: "Chief AI Officer, PwC UK and AI Leader, EMEA, PwC UK",
      buttonText: "Read Case Study",
    },
    {
      quote:
        '"The legal industry is evolving rapidly with growing complexity. Harvey has transformed how we navigate challenges with precision, time efficiency, and delivering strategic value."',
      author: "Dr. Claudia Junker",
      title: "General Counsel, Deutsche Bank",
      buttonText: "Read Case Study",
    },
  ];

  const scrollToCard = (index: number) => {
    if (scrollContainerRef.current) {
      const cardWidth = 900 + 24; // full width + gap
      scrollContainerRef.current.scrollTo({
        left: cardWidth * index,
        behavior: "smooth",
      });
      setActiveIndex(index);
    }
  };

  return (
    <section className="py-32 px-6 bg-black text-white overflow-hidden">
      <div className="max-w-5xl mx-auto">
        {/* Desktop Carousel */}
        <div className="hidden lg:block relative">
          <div
            ref={scrollContainerRef}
            className="overflow-x-auto snap-x snap-mandatory scrollbar-hide"
          >
            <div className="flex">
              {caseStudies.map((study, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  onMouseEnter={() => setActiveIndex(index)}
                  className="flex-shrink-0 w-full snap-center px-8"
                >
                  {/* Quote */}
                  <p className="text-3xl md:text-4xl lg:text-5xl font-normal leading-relaxed mb-12 text-white">
                    {study.quote}
                  </p>

                  {/* Author & Button */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-base font-semibold text-white mb-1">
                        {study.author}
                      </div>
                      <div className="text-sm text-gray-400">{study.title}</div>
                    </div>
                    <button className="px-6 py-3 bg-white text-black rounded-full font-semibold hover:bg-gray-100 transition-colors">
                      {study.buttonText}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Carousel Indicators */}
          <div className="flex justify-center gap-2 mt-16">
            {caseStudies.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToCard(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  activeIndex === index
                    ? "bg-white w-8"
                    : "bg-gray-600 w-2 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Mobile View */}
        <div className="lg:hidden space-y-12">
          {caseStudies.map((study, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {/* Quote */}
              <p className="text-2xl md:text-3xl font-normal leading-relaxed mb-8 text-white">
                {study.quote}
              </p>

              {/* Author */}
              <div className="mb-6">
                <div className="text-base font-semibold text-white mb-1">
                  {study.author}
                </div>
                <div className="text-sm text-gray-400">{study.title}</div>
              </div>

              {/* Button */}
              <button className="px-6 py-3 bg-white text-black rounded-full font-semibold hover:bg-gray-100 transition-colors">
                {study.buttonText}
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
