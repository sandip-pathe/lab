"use client";

import { motion } from "framer-motion";

const features = [
  {
    title: "High-Trust Summaries",
    description:
      "Jurisdiction-aware legal analysis you can file with confidence.",
  },
  {
    title: "Clause Intelligence",
    description:
      "Extract and reuse contract building blocks across all matters.",
  },
  {
    title: "Adaptive Learning",
    description: "Your legal data becomes structured, reusable intelligence.",
  },
];

export default function Features() {
  return (
    <section className="py-20 px-6 bg-white dark:bg-gray-900">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-navy-900 dark:text-gray-100 mb-4">
            Built for Law Firms
          </h2>
          <p className="text-lg text-slate-600 dark:text-gray-400 max-w-2xl mx-auto">
            Modular AI infrastructure that transforms legal work.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <h3 className="text-xl font-bold text-navy-900 dark:text-gray-100 mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-600 dark:text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
