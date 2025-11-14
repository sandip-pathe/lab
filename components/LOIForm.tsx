"use client";

import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase-config";
import { createLead } from "@/lib/firestore";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function LOIForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    firmName: "",
    city: "Mumbai",
    teamSize: "",
    practiceFocus: "",
    email: "",
    name: "",
    mobile: "",
    workflows: [] as string[],
    workflowsOther: "",
    documentsPerMonth: "",
    paidPilotReadiness: "",
    shareSamples: "",
    participationChoice: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const workflowOptions = [
    "Contract summarization",
    "Judgment summarization",
    "Clause extraction",
    "Due diligence support",
    "Compliance document review",
    "Internal knowledge management",
    "Litigation/Discovery",
    "Template drafting",
  ];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      const checkboxValue = (e.target as HTMLInputElement).value;

      if (name === "workflows") {
        setFormData((prev) => ({
          ...prev,
          workflows: checked
            ? [...prev.workflows, checkboxValue]
            : prev.workflows.filter((w) => w !== checkboxValue),
        }));
      }
    } else if (type === "radio") {
      setFormData((prev) => ({ ...prev, [name]: value }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    setErrors([]);
  };

  const validateStep = (step: number): boolean => {
    setErrors([]);

    switch (step) {
      case 0:
        if (
          !formData.firmName.trim() ||
          !formData.city.trim() ||
          !formData.teamSize ||
          !formData.practiceFocus.trim()
        ) {
          setErrors(["Please complete all required fields"]);
          return false;
        }
        return true;
      case 1:
        if (
          !formData.email.includes("@") ||
          !formData.name.trim() ||
          !formData.mobile.trim()
        ) {
          setErrors(["Please complete all required fields"]);
          return false;
        }
        return true;
      case 2:
        if (formData.workflows.length === 0) {
          setErrors(["Please select at least one workflow"]);
          return false;
        }
        return true;
      case 3:
        if (!formData.paidPilotReadiness) {
          setErrors(["Please answer the question"]);
          return false;
        }
        return true;
      case 5:
        if (!formData.participationChoice) {
          setErrors(["Please select a participation option"]);
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep(currentStep)) {
      return;
    }

    setIsSubmitting(true);

    try {
      await addDoc(collection(db, "loi_entries"), {
        ...formData,
        stage: "prospect",
        timestamp: serverTimestamp(),
        source: "pilot_form_v2",
      });

      await createLead({
        firmName: formData.firmName,
        contactName: formData.name,
        email: formData.email,
        phone: formData.mobile,
        stage: "Suspect",
        notes: `Workflows: ${formData.workflows.join(", ")}${
          formData.workflowsOther ? ` (Other: ${formData.workflowsOther})` : ""
        }\nDocuments/Month: ${formData.documentsPerMonth}\nPaid Pilot: ${
          formData.paidPilotReadiness
        }\nSamples: ${formData.shareSamples}\nChoice: ${
          formData.participationChoice
        }\nPractice: ${formData.practiceFocus}\nTeam Size: ${
          formData.teamSize
        }\nCity: ${formData.city}`,
      });

      toast.success("Successfully submitted!");
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    {
      id: 0,
      title: "Firm Details",
      component: (
        <div className="space-y-6">
          <input
            type="text"
            name="firmName"
            value={formData.firmName}
            onChange={handleChange}
            className="w-full text-xl font-normal text-navy-900 dark:text-white border-b-2 border-gray-300 dark:border-gray-600 focus:border-teal-600 focus:outline-none pb-3 bg-transparent"
            placeholder="Firm name"
          />
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full text-xl font-normal text-navy-900 dark:text-white border-b-2 border-gray-300 dark:border-gray-600 focus:border-teal-600 focus:outline-none pb-3 bg-transparent"
            placeholder="City"
          />
          <select
            name="teamSize"
            value={formData.teamSize}
            onChange={handleChange}
            className="w-full text-xl font-normal text-navy-900 dark:text-white border-b-2 border-gray-300 dark:border-gray-600 focus:border-teal-600 focus:outline-none pb-3 bg-transparent cursor-pointer"
          >
            <option value="">Size of team</option>
            <option value="1-5">1-5 people</option>
            <option value="6-15">6-15 people</option>
            <option value="16-50">16-50 people</option>
            <option value="50+">50+ people</option>
          </select>
          <input
            type="text"
            name="practiceFocus"
            value={formData.practiceFocus}
            onChange={handleChange}
            className="w-full text-xl font-normal text-navy-900 dark:text-white border-b-2 border-gray-300 dark:border-gray-600 focus:border-teal-600 focus:outline-none pb-3 bg-transparent"
            placeholder="Practice focus (e.g., startup law, M&A)"
          />
        </div>
      ),
    },
    {
      id: 1,
      title: "Contact Information",
      component: (
        <div className="space-y-6">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full text-xl font-normal text-navy-900 dark:text-white border-b-2 border-gray-300 dark:border-gray-600 focus:border-teal-600 focus:outline-none pb-3 bg-transparent"
            placeholder="Email address"
          />
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full text-xl font-normal text-navy-900 dark:text-white border-b-2 border-gray-300 dark:border-gray-600 focus:border-teal-600 focus:outline-none pb-3 bg-transparent"
            placeholder="Your name"
          />
          <input
            type="tel"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            className="w-full text-xl font-normal text-navy-900 dark:text-white border-b-2 border-gray-300 dark:border-gray-600 focus:border-teal-600 focus:outline-none pb-3 bg-transparent"
            placeholder="Mobile number"
          />
        </div>
      ),
    },
    {
      id: 2,
      title: "Workflows We Can Help With",
      subtitle: "Which workflows do you want AI to improve first?",
      component: (
        <div className="space-y-4">
          {workflowOptions.map((option) => (
            <label
              key={option}
              className="flex items-center gap-3 p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-teal-500 cursor-pointer transition-all"
            >
              <input
                type="checkbox"
                name="workflows"
                value={option}
                checked={formData.workflows.includes(option)}
                onChange={handleChange}
                className="w-5 h-5 text-teal-600 rounded"
              />
              <span className="text-lg text-navy-900 dark:text-white">
                {option}
              </span>
            </label>
          ))}
          <input
            type="text"
            name="workflowsOther"
            value={formData.workflowsOther}
            onChange={handleChange}
            className="w-full mt-4 text-lg font-normal text-navy-900 dark:text-white border-b-2 border-gray-300 dark:border-gray-600 focus:border-teal-600 focus:outline-none pb-3 bg-transparent"
            placeholder="Other (please specify)"
          />
        </div>
      ),
    },
    {
      id: 3,
      title: "Paid Pilot Readiness",
      component: (
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-bold text-navy-900 dark:text-white mb-4">
              Are you open to a paid pilot if the value is clear?
            </h3>
            <div className="space-y-3">
              {[
                "Yes, starting immediately",
                "Yes, pending internal approval",
                "Want to evaluate output first",
                "Not right now",
              ].map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-3 p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-teal-500 cursor-pointer transition-all"
                >
                  <input
                    type="radio"
                    name="paidPilotReadiness"
                    value={option}
                    checked={formData.paidPilotReadiness === option}
                    onChange={handleChange}
                    className="w-5 h-5 text-teal-600"
                  />
                  <span className="text-lg text-navy-900 dark:text-white">
                    {option}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 4,
      title: "Pilot Overview & Expectations",
      subtitle: "Please Read Before Choosing Next Step",
      component: (
        <div className="bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-950 dark:to-emerald-950 rounded-2xl p-8 border-2 border-teal-200 dark:border-teal-800">
          <p className="text-lg text-gray-800 dark:text-gray-200 mb-6">
            The Legal AI Lab is a 4-week collaboration with a small number of
            Mumbai startup-focused firms. We only onboard 5 firms per cohort
            because every pilot requires deep, hands-on work.
          </p>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-navy-900 dark:text-white mb-3">
                What You Get:
              </h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>
                  ✓ Summaries of contracts and judgments relevant to your
                  practice
                </li>
                <li>✓ Clause breakdowns, exceptions, red flags</li>
                <li>✓ Secure, private environment with full transparency</li>
                <li>✓ Direct WhatsApp/phone line during the pilot</li>
                <li>✓ Weekly review calls</li>
                <li>
                  ✓ Custom tuning for Indian jurisdictions and startup workflows
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-navy-900 dark:text-white mb-3">
                What We Expect:
              </h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>• 2–5 sample documents</li>
                <li>• Honest feedback</li>
                <li>• A 20–30 min onboarding call</li>
                <li>• One weekly check-in</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-navy-900 dark:text-white mb-3">
                Outcome:
              </h3>
              <p className="text-gray-700 dark:text-gray-300 italic">
                If you find value → continue into paid partnership with
                locked-in pricing.
                <br />
                If not → walk away freely. No pressure. No contract.
                <br />
                You keep outputs generated during the pilot. You’re not buying
                software. You’re shaping it.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 5,
      title: "Choose How You'd Like to Participate",
      component: (
        <div className="space-y-4">
          {[
            {
              value: "pilot",
              title: "✔ Join the Pilot",
              desc: "Get full access for 4 weeks, onboarding, weekly calls, and outputs on real documents.",
            },
            {
              value: "loi",
              title: "✔ Sign LOI (Non-Binding)",
              desc: "Secure your place in a future cohort. Shows intent but doesn't obligate you.",
            },
            {
              value: "sample",
              title: "✔ I'm Not Sure — Show Me a Sample First",
              desc: "Upload 1–2 redacted documents. We'll send you a short summary so you can see the quality.",
            },
            {
              value: "paid",
              title: "✔ Proceed to Paid Pilot (Fast Track)",
              desc: "Skip the line. Immediate onboarding with fee credited toward future subscriptions.",
            },
          ].map((option) => (
            <label
              key={option.value}
              className="flex items-start gap-4 p-6 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-teal-500 cursor-pointer transition-all"
            >
              <input
                type="radio"
                name="participationChoice"
                value={option.value}
                checked={formData.participationChoice === option.value}
                onChange={handleChange}
                className="mt-1 w-5 h-5 text-teal-600"
              />
              <div>
                <h4 className="text-lg font-bold text-navy-900 dark:text-white mb-2">
                  {option.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  {option.desc}
                </p>
              </div>
            </label>
          ))}
        </div>
      ),
    },
  ];

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  if (isSubmitted) {
    return (
      <div className="w-full max-w-3xl mx-auto h-full flex items-center justify-center bg-white dark:bg-gray-900 p-6 rounded-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-teal-100 dark:bg-teal-900 rounded-full mb-6">
              <svg
                className="w-12 h-12 text-teal-600 dark:text-teal-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-4xl font-bold text-navy-900 dark:text-white mb-4">
              Thank You, {formData.name}!
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              Your application has been submitted successfully.
            </p>
          </div>

          <div className="bg-teal-50 dark:bg-teal-950 border-2 border-teal-200 dark:border-teal-800 rounded-xl p-8 mb-8">
            <h3 className="text-xl font-bold text-navy-900 dark:text-white mb-4">
              What happens next?
            </h3>
            <div className="text-left space-y-3 text-gray-700 dark:text-gray-300">
              <p>✓ We’ll review your application carefully</p>
              <p>✓ Our team will reach out within 2-3 business days</p>
              <p>✓ We’ll schedule a call to discuss next steps</p>
            </div>
          </div>

          <button
            onClick={() => router.push("/")}
            className="px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg"
          >
            Go to Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-5xl mx-auto h-full flex flex-col justify-between bg-white dark:bg-gray-900 p-6 lg:p-8 rounded-xl"
    >
      <div>
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm font-medium text-teal-600">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-teal-500 to-emerald-500"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Form Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="py-8"
          >
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-navy-900 dark:text-white mb-2">
                {currentStepData.title}
              </h2>
              {"subtitle" in currentStepData && currentStepData.subtitle && (
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  {currentStepData.subtitle}
                </p>
              )}
              {errors.length > 0 && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  {errors.map((error, idx) => (
                    <p
                      key={idx}
                      className="text-sm text-red-600 dark:text-red-400"
                    >
                      ⚠️ {error}
                    </p>
                  ))}
                </div>
              )}
            </div>

            <div className="mb-8">{currentStepData.component}</div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentStep === 0}
          className="px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-navy-900 font-medium disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ← Previous
        </button>

        <div className="flex gap-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentStep
                  ? "bg-teal-600 w-8"
                  : index < currentStep
                  ? "bg-teal-400"
                  : "bg-gray-300"
              }`}
            />
          ))}
        </div>

        {currentStep < steps.length - 1 ? (
          <button
            type="button"
            onClick={handleNext}
            className="px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl shadow-lg"
          >
            Next →
          </button>
        ) : (
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl shadow-lg disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Submit & Proceed"}
          </button>
        )}
      </div>
    </form>
  );
}
