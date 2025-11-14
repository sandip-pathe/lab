"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import React from "react";

export default function BlogArticles() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const articles = [
    {
      title:
        "The Legal AI Tipping Point: Why Indian Firms Are About to Automate the Back Office",
      excerpt:
        "An analysis of the inflection point where AI moves from experiment to essential infrastructure in Indian legal practice.",
      readTime: "12 min read",
    },
    {
      title:
        "The Rise of Private Legal AI: The Next Advantage for India's Law Firms",
      excerpt:
        "How proprietary AI systems are becoming the competitive moat for forward-thinking law firms.",
      readTime: "10 min read",
    },
    {
      title:
        "Why Law Is Too Nuanced for One-Click AI — and Why That's Exactly Why AI Matters",
      excerpt:
        "Understanding why legal complexity makes AI more valuable, not less — when implemented correctly.",
      readTime: "9 min read",
    },
    {
      title:
        "Why a ₹50,000 MOU Is Not the Same as an AI-Drafted One — and Why That Difference Matters",
      excerpt:
        "The subtle ways AI-assisted drafting changes not just speed, but quality and risk management.",
      readTime: "11 min read",
    },
  ];

  const scrollToCard = (index: number) => {
    if (scrollContainerRef.current) {
      const cardWidth = 900 + 24;
      scrollContainerRef.current.scrollTo({
        left: cardWidth * index,
        behavior: "smooth",
      });
      setActiveIndex(index);
    }
  };

  return (
    <section className="py-32 px-6 bg-white dark:bg-gray-950 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-navy-900 dark:text-white">
            Insights & Analysis
          </h2>
          <p className="text-lg text-slate-600 dark:text-gray-400 max-w-2xl mx-auto">
            Data-driven perspectives on legal AI in India
          </p>
        </motion.div>

        {/* Desktop Carousel */}
        <div className="hidden lg:block relative">
          <div
            ref={scrollContainerRef}
            className="overflow-x-auto snap-x snap-mandatory scrollbar-hide"
          >
            <div className="flex">
              {articles.map((article, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  onMouseEnter={() => setActiveIndex(index)}
                  className="flex-shrink-0 w-full snap-center px-8"
                >
                  {/* Title */}
                  <h3 className="text-3xl md:text-4xl font-bold mb-6 text-navy-900 dark:text-white leading-tight">
                    {article.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-xl text-slate-600 dark:text-gray-400 mb-8 leading-relaxed">
                    {article.excerpt}
                  </p>

                  {/* Read Time & Button */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500 dark:text-gray-500">
                      {article.readTime}
                    </span>
                    <button className="px-6 py-3 bg-navy-900 dark:bg-white text-white dark:text-black rounded-full font-semibold hover:bg-navy-800 dark:hover:bg-gray-100 transition-colors">
                      Read Article
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Carousel Indicators */}
          <div className="flex justify-center gap-2 mt-16">
            {articles.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToCard(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  activeIndex === index
                    ? "bg-navy-900 dark:bg-white w-8"
                    : "bg-gray-300 dark:bg-gray-600 w-2 hover:bg-navy-600 dark:hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Mobile View */}
        <div className="lg:hidden space-y-12">
          {articles.map((article, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {/* Title */}
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-navy-900 dark:text-white leading-tight">
                {article.title}
              </h3>

              {/* Excerpt */}
              <p className="text-lg text-slate-600 dark:text-gray-400 mb-6 leading-relaxed">
                {article.excerpt}
              </p>

              {/* Read Time */}
              <div className="mb-4">
                <span className="text-sm text-slate-500 dark:text-gray-500">
                  {article.readTime}
                </span>
              </div>

              {/* Button */}
              <button className="px-6 py-3 bg-navy-900 dark:bg-white text-white dark:text-black rounded-full font-semibold hover:bg-navy-800 dark:hover:bg-gray-100 transition-colors">
                Read Article
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
