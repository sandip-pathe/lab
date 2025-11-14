"use client";

import { useState, useEffect } from "react";
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
    name: "",
    email: "",
    mobile: "",
    firmName: "",
    employeeSize: "",
    aiNeeds: "",
    interestedInPilot: false,
    interestedInLOI: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [errors, setErrors] = useState<string[][]>([[], [], [], [], [], []]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
    // Clear errors when user types
    const newErrors = [...errors];
    newErrors[currentStep] = [];
    setErrors(newErrors);
  };

  const handleNext = () => {
    const currentStepData = steps[currentStep];
    if (!currentStepData?.canProceed) {
      const newErrors = [...errors];
      newErrors[currentStep] = currentStepData?.errorMessages || [
        "Please complete all required fields",
      ];
      setErrors(newErrors);
      return;
    }
    const newErrors = [...errors];
    newErrors[currentStep] = [];
    setErrors(newErrors);
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent if user is typing in textarea
      if (e.target instanceof HTMLTextAreaElement) return;

      if (e.key === "Enter" && currentStep < steps.length - 1) {
        e.preventDefault();
        if (steps[currentStep]?.canProceed) {
          setCurrentStep((prev) => prev + 1);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.interestedInPilot && !formData.interestedInLOI) {
      toast.error("Please select at least one option (Pilot or LOI)");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Save to loi_entries collection (for responses page)
      await addDoc(collection(db, "loi_entries"), {
        ...formData,
        stage: "prospect",
        timestamp: serverTimestamp(),
        source: "custom_form",
      });

      // 2. Create a new lead in the Suspect stage (for sales funnel)
      await createLead({
        firmName: formData.firmName,
        contactName: formData.name,
        email: formData.email,
        phone: formData.mobile,
        stage: "Suspect",
        notes: `AI Needs: ${formData.aiNeeds}\n\nInterested in Pilot: ${
          formData.interestedInPilot ? "Yes" : "No"
        }\nInterested in LOI: ${
          formData.interestedInLOI ? "Yes" : "No"
        }\n\nEmployee Size: ${formData.employeeSize}\nSource: Join Lab Form`,
      });

      toast.success("Successfully added to sales funnel!");
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Countdown timer effect
  useEffect(() => {
    if (isSubmitted && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isSubmitted && countdown === 0) {
      router.push("/");
    }
  }, [isSubmitted, countdown, router]);

  const steps = [
    {
      id: 0,
      title: "What's your name?",
      description: "Let's start with the basics",
      field: (
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          autoFocus
          className="w-full text-base sm:text-xl md:text-3xl font-normal text-navy-900 dark:text-white border-none border-b-2 sm:border-b-3 border-gray-300 dark:border-gray-600 focus:border-teal-600 dark:focus:border-teal-400 focus:outline-none focus:ring-0 pb-2 sm:pb-3 bg-white dark:bg-gray-900 transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-500"
          placeholder="Your full name"
        />
      ),
      canProceed: formData.name.trim().length > 0,
      errorMessages: ["Please enter your name"],
    },
    {
      id: 1,
      title: "Contact Information",
      description: "How can we reach you?",
      field: (
        <div className="space-y-6">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full text-xl md:text-2xl font-normal text-navy-900 dark:text-white border-none border-b-3 border-gray-300 dark:border-gray-600 focus:border-teal-600 dark:focus:border-teal-400 focus:outline-none focus:ring-0 pb-3 bg-white dark:bg-gray-900 transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-500"
            placeholder="Email address"
          />
          <input
            type="tel"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            required
            className="w-full text-xl md:text-2xl font-normal text-navy-900 dark:text-white border-none border-b-3 border-gray-300 dark:border-gray-600 focus:border-teal-600 dark:focus:border-teal-400 focus:outline-none focus:ring-0 pb-3 bg-white dark:bg-gray-900 transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-500"
            placeholder="Mobile number"
          />
        </div>
      ),
      canProceed:
        formData.email.includes("@") && formData.mobile.trim().length > 0,
      errorMessages: ["Please enter a valid email and mobile number"],
    },
    {
      id: 2,
      title: "Tell us about your firm",
      description: "Company details",
      field: (
        <div className="space-y-6">
          <input
            type="text"
            name="firmName"
            value={formData.firmName}
            onChange={handleChange}
            required
            className="w-full text-xl md:text-2xl font-normal text-navy-900 dark:text-white border-none border-b-3 border-gray-300 dark:border-gray-600 focus:border-teal-600 dark:focus:border-teal-400 focus:outline-none focus:ring-0 pb-3 bg-white dark:bg-gray-900 transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-500"
            placeholder="Firm name"
          />
          <select
            name="employeeSize"
            value={formData.employeeSize}
            onChange={handleChange}
            required
            className="w-full text-xl md:text-2xl font-normal text-navy-900 dark:text-white border-none border-b-3 border-gray-300 dark:border-gray-600 focus:border-teal-600 dark:focus:border-teal-400 focus:outline-none focus:ring-0 pb-3 bg-white dark:bg-gray-900 transition-colors cursor-pointer"
          >
            <option
              value=""
              className="text-gray-400 dark:text-gray-500"
              disabled
            >
              Select employee size
            </option>
            <option value="1-10" className="text-navy-900 dark:text-white">
              1-10 employees
            </option>
            <option value="11-50" className="text-navy-900 dark:text-white">
              11-50 employees
            </option>
            <option value="51-200" className="text-navy-900 dark:text-white">
              51-200 employees
            </option>
            <option value="201-500" className="text-navy-900 dark:text-white">
              201-500 employees
            </option>
            <option value="500+" className="text-navy-900 dark:text-white">
              500+ employees
            </option>
          </select>
        </div>
      ),
      canProceed:
        formData.firmName.trim().length > 0 && formData.employeeSize !== "",
      errorMessages: ["Please enter firm name and select employee size"],
    },
    {
      id: 3,
      title: "What do you need from AI right now?",
      description: "Help us understand your current challenges",
      field: (
        <textarea
          name="aiNeeds"
          value={formData.aiNeeds}
          onChange={handleChange}
          required
          rows={6}
          className="w-full text-sm sm:text-base md:text-lg lg:text-xl font-normal text-navy-900 dark:text-white border-2 border-gray-300 dark:border-gray-600 focus:border-teal-600 dark:focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-200 dark:focus:ring-teal-800 p-3 sm:p-4 rounded-lg bg-white dark:bg-gray-900 transition-all resize-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
          placeholder="Tell us about your AI needs, challenges, or use cases..."
        />
      ),
      canProceed: formData.aiNeeds.trim().length > 10,
      errorMessages: ["Please describe your AI needs (at least 10 characters)"],
    },
    {
      id: 4,
      title: "What We Do",
      description: "Legal AI Lab - Infrastructure for Legal Cognition",
      field: (
        <div className="bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-950 dark:to-emerald-950 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border-2 border-teal-200 dark:border-teal-800">
          <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none">
            <p className="text-base sm:text-lg lg:text-xl text-gray-800 dark:text-gray-200 leading-relaxed mb-4 sm:mb-6">
              We&apos;re building{" "}
              <strong className="text-teal-700 dark:text-teal-400">
                AI-powered infrastructure
              </strong>{" "}
              that transforms legal documents into structured, reusable
              intelligence.
            </p>
            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm">
                <h4 className="text-base sm:text-lg font-bold text-navy-900 dark:text-white mb-2">
                  🎯 High-Trust Summaries
                </h4>
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                  Jurisdiction-aware legal analysis you can file with confidence
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm">
                <h4 className="text-base sm:text-lg font-bold text-navy-900 dark:text-white mb-2">
                  📊 Clause Intelligence
                </h4>
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                  Extract and reuse contract building blocks across all matters
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm">
                <h4 className="text-base sm:text-lg font-bold text-navy-900 dark:text-white mb-2">
                  🤖 Adaptive Learning
                </h4>
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                  Your legal data becomes structured, reusable intelligence
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm">
                <h4 className="text-base sm:text-lg font-bold text-navy-900 dark:text-white mb-2">
                  🔒 Private & Secure
                </h4>
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                  High-trust pilot environment for your sensitive data
                </p>
              </div>
            </div>
            <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 italic">
              Join 10 visionary law firms building the future of legal
              operations.
            </p>
          </div>
        </div>
      ),
      canProceed: true,
      errorMessages: [],
    },
    {
      id: 5,
      title: "How would you like to participate?",
      description: "Select one or both options",
      field: (
        <div className="space-y-3 sm:space-y-4">
          <label className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 lg:p-5 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-xl hover:border-teal-600 dark:hover:border-teal-400 focus-within:border-teal-600 dark:focus-within:border-teal-400 focus-within:ring-2 focus-within:ring-teal-200 dark:focus-within:ring-teal-800 cursor-pointer transition-all">
            <input
              type="checkbox"
              name="interestedInPilot"
              checked={formData.interestedInPilot}
              onChange={handleChange}
              className="mt-1 w-5 h-5 text-teal-600 border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-teal-600 dark:focus:ring-teal-400 cursor-pointer"
            />
            <div>
              <h4 className="text-base sm:text-lg font-bold text-navy-900 dark:text-white mb-1 sm:mb-2">
                🚀 Join the Pilot Program
              </h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Get early access to test our AI infrastructure with your
                real-world legal workflows. Provide feedback and shape the
                product roadmap.
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 lg:p-5 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-xl hover:border-teal-600 dark:hover:border-teal-400 focus-within:border-teal-600 dark:focus-within:border-teal-400 focus-within:ring-2 focus-within:ring-teal-200 dark:focus-within:ring-teal-800 cursor-pointer transition-all">
            <input
              type="checkbox"
              name="interestedInLOI"
              checked={formData.interestedInLOI}
              onChange={handleChange}
              className="mt-1 w-5 h-5 text-teal-600 border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-teal-600 dark:focus:ring-teal-400 cursor-pointer"
            />
            <div>
              <h4 className="text-base sm:text-lg font-bold text-navy-900 dark:text-white mb-1 sm:mb-2">
                📝 Sign Letter of Intent (Non-Binding)
              </h4>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                Express formal interest in partnership. No commitment required -
                just a signal that you&apos;re interested in exploring
                collaboration opportunities.
              </p>
            </div>
          </label>
        </div>
      ),
      canProceed: formData.interestedInPilot || formData.interestedInLOI,
      errorMessages: ["Please select at least one participation option"],
    },
  ];

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  if (!currentStepData) {
    return null;
  }

  // Success screen after submission
  if (isSubmitted) {
    return (
      <div className="w-full max-w-3xl mx-auto h-full flex items-center justify-center bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="mb-6 sm:mb-8">
            <div className="inline-flex items-center justify-center w-16 sm:w-20 h-16 sm:h-20 bg-teal-100 dark:bg-teal-900 rounded-full mb-4 sm:mb-6">
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
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-navy-900 dark:text-white mb-3 sm:mb-4">
              Thank You, {formData.name}!
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-6 sm:mb-8">
              Your submission has been received successfully.
            </p>
          </div>

          <div className="bg-teal-50 dark:bg-teal-950 border-2 border-teal-200 dark:border-teal-800 rounded-lg sm:rounded-xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
            <h3 className="text-lg sm:text-xl font-bold text-navy-900 dark:text-white mb-3">
              What happens next?
            </h3>
            <div className="text-left space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-700 dark:text-gray-300">
              <p className="flex items-start gap-3">
                <span className="text-teal-600 dark:text-teal-400 text-xl">
                  1️⃣
                </span>
                <span>
                  We&apos;ll review your information and AI needs carefully
                </span>
              </p>
              <p className="flex items-start gap-3">
                <span className="text-teal-600 dark:text-teal-400 text-xl">
                  2️⃣
                </span>
                <span>
                  Our team will reach out within 2-3 business days to discuss
                  next steps
                </span>
              </p>
              <p className="flex items-start gap-3">
                <span className="text-teal-600 dark:text-teal-400 text-xl">
                  3️⃣
                </span>
                <span>
                  We&apos;ll schedule a demo and explore how we can help your
                  firm
                </span>
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
              Redirecting to home in{" "}
              <span className="font-bold text-teal-600 dark:text-teal-400">
                {countdown}
              </span>{" "}
              second{countdown !== 1 ? "s" : ""}...
            </p>
            <button
              onClick={() => router.push("/")}
              className="inline-block px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg"
            >
              Go to Home Now
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-5xl mx-auto h-full flex flex-col justify-between bg-white dark:bg-gray-900 p-4 sm:p-6 lg:p-8 rounded-xl"
    >
      <div>
        {/* Progress Bar */}
        <div className="mb-4 sm:mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-xs sm:text-sm font-medium text-teal-600 dark:text-teal-400">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 dark:from-teal-600 dark:to-emerald-600"
              initial={{ width: 0 }}
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
            className="py-4 sm:py-6 lg:py-8"
          >
            <div className="mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-navy-900 dark:text-white mb-2">
                {currentStepData.title}
              </h2>
              <p className="text-base md:text-lg text-gray-600 dark:text-gray-400">
                {currentStepData.description}
              </p>
              {errors[currentStep] && errors[currentStep].length > 0 && (
                <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  {errors[currentStep].map((error, idx) => (
                    <p
                      key={idx}
                      className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2"
                    >
                      <span>⚠️</span>
                      {error}
                    </p>
                  ))}
                </div>
              )}
            </div>

            <div className="mb-8">{currentStepData.field}</div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center gap-2 sm:gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentStep === 0}
          className="px-3 sm:px-6 py-2 sm:py-3 text-sm sm:text-base text-gray-600 dark:text-gray-400 hover:text-navy-900 dark:hover:text-white font-medium disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          ← Previous
        </button>

        <div className="flex gap-1 sm:gap-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full transition-all ${
                index === currentStep
                  ? "bg-teal-600 dark:bg-teal-500 w-6 sm:w-8"
                  : index < currentStep
                  ? "bg-teal-400 dark:bg-teal-600"
                  : "bg-gray-300 dark:bg-gray-600"
              }`}
            />
          ))}
        </div>

        {currentStep < steps.length - 1 ? (
          <button
            type="button"
            onClick={handleNext}
            disabled={!currentStepData.canProceed}
            className="px-4 sm:px-8 py-2 sm:py-4 text-sm sm:text-base bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 text-white font-semibold rounded-lg sm:rounded-xl shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Next →
          </button>
        ) : (
          <button
            type="submit"
            disabled={!currentStepData.canProceed || isSubmitting}
            className="px-4 sm:px-8 py-2 sm:py-4 text-sm sm:text-base bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 text-white font-semibold rounded-lg sm:rounded-xl shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isSubmitting ? "Submitting..." : "Submit →"}
          </button>
        )}
      </div>
    </form>
  );
}
