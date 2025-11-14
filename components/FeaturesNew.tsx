"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import React from "react";

export default function FeaturesNew() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const benefits = [
    {
      title: "Time, back.",
      description:
        "Summaries of long contracts and judgments you can rely on — with clauses, citations, exceptions, red flags.",
      icon: "⏱️",
    },
    {
      title: "AI that understands Indian startup law.",
      description:
        "From SHA/SSA to ESOPs, from vendor agreements to due-diligence checklists — we train on your real work, not generic foreign templates.",
      icon: "🇮🇳",
    },
    {
      title: "Private, secure workflows.",
      description:
        "Your documents stay encrypted and invisible to public models. Clear data boundaries, transparent retention, zero ambiguity.",
      icon: "🔒",
    },
    {
      title: "A direct line to the builder.",
      description:
        "Weekly pilot calls, fast iteration, and the power to influence the roadmap.",
      icon: "🤝",
    },
    {
      title: "Preferential lifetime pricing.",
      description: "Founding firms lock in early rates as we scale nationwide.",
      icon: "💎",
    },
  ];

  const scrollToCard = (index: number) => {
    if (scrollContainerRef.current) {
      const cardWidth = 320 + 24;
      scrollContainerRef.current.scrollTo({
        left: cardWidth * index,
        behavior: "smooth",
      });
      setActiveIndex(index);
    }
  };

  return (
    <section className="py-20 bg-white dark:bg-gray-950 overflow-hidden">
      <div className="w-full mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-navy-900 to-slate-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
            What Your Firm Gets
          </h2>
        </motion.div>

        {/* Desktop Carousel */}
        <div className="hidden lg:block relative px-6">
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onMouseEnter={() => setActiveIndex(index)}
                className={`flex-shrink-0 w-80 snap-center bg-gradient-to-br from-slate-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-3xl p-8 transition-all duration-500 ${
                  activeIndex === index
                    ? "border-2 border-teal-500 dark:border-teal-400 shadow-xl shadow-teal-500/30 scale-105"
                    : "border-2 border-gray-200 dark:border-gray-700 shadow-lg hover:border-teal-300 dark:hover:border-teal-600"
                }`}
              >
                <div className="text-5xl mb-6">{benefit.icon}</div>
                <h3 className="text-2xl font-bold mb-4 text-navy-900 dark:text-white">
                  {benefit.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-gray-400 leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Carousel Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {benefits.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToCard(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  activeIndex === index
                    ? "bg-teal-500 w-8"
                    : "bg-gray-300 dark:bg-gray-600 hover:bg-teal-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Mobile/Tablet Grid */}
        <div className="lg:hidden grid sm:grid-cols-2 gap-6 px-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-gradient-to-br from-slate-50 to-white dark:from-gray-900 dark:to-gray-800 border-4 border-gray-200 dark:border-gray-700 rounded-3xl p-6 sm:p-8 hover:shadow-xl hover:border-teal-300 dark:hover:border-teal-600 transition-all duration-300"
            >
              <div className="text-4xl sm:text-5xl mb-4 sm:mb-6">
                {benefit.icon}
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-navy-900 dark:text-white">
                {benefit.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-gray-400 leading-relaxed">
                {benefit.description}
              </p>
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
