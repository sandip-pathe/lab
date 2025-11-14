"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function LabSection() {
  const forWho = [
    "Firms advising startups, funds, and high-growth companies",
    "Teams overwhelmed with contracts, compliance docs, policy reviews, and diligence",
    "Firms looking for leverage, not headcount",
    "Partners who want early access, speed, and trust",
  ];

  const notFor = [
    'Firms expecting "magic"',
    "Firms that won't engage or share feedback",
    'Firms who want "AI" without a clear problem',
    "Anyone looking for a chatbot",
  ];

  const steps = [
    {
      number: "1",
      title: "Apply to Join",
      description: "Tell us about your workflows, document volume, and goals.",
    },
    {
      number: "2",
      title: "We Shortlist 5 Firms",
      description: "Based on fit, readiness, and willingness to collaborate.",
    },
    {
      number: "3",
      title: "Pilot Begins (4 weeks)",
      description:
        "Real documents → summaries → iterations → measurable reduction in review time.",
    },
    {
      number: "4",
      title: "Decision",
      description:
        "If it works: continue as a paid early partner. If it doesn't: no obligation, no cost.",
    },
  ];

  return (
    <>
      {/* What is the Lab */}
      <section className="py-20 px-6 bg-gradient-to-br from-slate-50 via-white to-teal-50/30 dark:from-gray-900 dark:via-black dark:to-gray-950">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-teal-600 to-emerald-600 dark:from-teal-400 dark:to-emerald-400 bg-clip-text text-transparent">
              What is the Legal AI Lab?
            </h2>
            <p className="text-xl sm:text-2xl text-slate-600 dark:text-gray-400 leading-relaxed max-w-4xl mx-auto">
              A hands-on, 4-week pilot where we test AI on real legal workflows
              with a small group of startup-focused Mumbai firms.
            </p>
            <p className="text-2xl font-bold text-navy-900 dark:text-white mt-6">
              <span className="text-teal-600 dark:text-teal-400">
                A real collaboration.
              </span>
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mt-16">
            {/* Who is this for */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white dark:bg-gray-800 border-2 border-teal-200 dark:border-teal-700 rounded-2xl p-8"
            >
              <h3 className="text-2xl font-bold mb-6 text-teal-600 dark:text-teal-400 flex items-center gap-2">
                <span className="text-3xl">✓</span> Who is this for?
              </h3>
              <ul className="space-y-4">
                {forWho.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <svg
                      className="w-6 h-6 text-teal-500 flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-slate-700 dark:text-gray-300">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Who is this NOT for */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white dark:bg-gray-800 border-2 border-red-200 dark:border-red-700/50 rounded-2xl p-8"
            >
              <h3 className="text-2xl font-bold mb-6 text-red-600 dark:text-red-400 flex items-center gap-2">
                <span className="text-3xl">✗</span> Who is this not for?
              </h3>
              <ul className="space-y-4">
                {notFor.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <svg
                      className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-slate-700 dark:text-gray-300">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center text-lg font-medium text-slate-700 dark:text-gray-300 mt-12 italic"
          >
            We focus on practicality, not hype.
          </motion.p>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-white dark:bg-gray-950">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-navy-900 to-slate-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
              How It Works
            </h2>
          </motion.div>

          <div className="space-y-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex gap-6 items-start"
              >
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-500 dark:from-teal-600 dark:to-emerald-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  {step.number}
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="text-2xl font-bold mb-2 text-navy-900 dark:text-white">
                    {step.title}
                  </h3>
                  <p className="text-lg text-slate-600 dark:text-gray-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Final CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center mt-16"
          >
            <Link
              href="/loi"
              className="group inline-flex items-center gap-2 px-10 py-5 bg-gradient-to-r from-teal-600 to-emerald-600 dark:from-teal-500 dark:to-emerald-500 text-white text-lg font-semibold rounded-2xl shadow-2xl hover:shadow-teal-500/50 dark:hover:shadow-teal-400/30 transition-all duration-300 hover:scale-105"
            >
              Request Invitation
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
