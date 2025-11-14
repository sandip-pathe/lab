"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase-config";
import Footer from "@/components/Footer";
import ProtectedRoute from "@/components/ProtectedRoute";

interface LOIEntry {
  id: string;
  name: string;
  email: string;
  mobile: string;
  firmName: string;
  city: string;
  teamSize: string;
  practiceFocus: string;
  workflows: string[];
  workflowsOther?: string;
  documentsPerMonth?: string;
  paidPilotReadiness: string;
  shareSamples?: string;
  participationChoice: string;
  stage: string;
  timestamp: { toDate: () => Date } | null;
  source: string;
}

export default function ResponsesPage() {
  return (
    <ProtectedRoute>
      <ResponsesContent />
    </ProtectedRoute>
  );
}

function ResponsesContent() {
  const [entries, setEntries] = useState<LOIEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const q = query(
          collection(db, "loi_entries"),
          orderBy("timestamp", "desc")
        );
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as LOIEntry[];
        setEntries(data);
      } catch (err) {
        console.error("Error fetching entries:", err);
        setError("Failed to load responses");
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
        {/* Ambient background effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/20 via-black to-cyan-950/20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,0.8),rgba(0,0,0,1))]"></div>

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:100px_100px]"></div>

        <div className="relative z-10 text-center">
          <div className="inline-flex items-center gap-3 text-cyan-400/70 text-sm tracking-widest">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
            LOADING RESPONSES
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
        {/* Ambient background effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/20 via-black to-cyan-950/20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,0.8),rgba(0,0,0,1))]"></div>

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:100px_100px]"></div>

        <div className="relative z-10 text-center">
          <p className="text-red-400 text-xl tracking-wide">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
      <div className="flex-1 w-full px-4 sm:px-6 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-navy-900 dark:text-white mb-2">
              LOI Form Responses
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Total submissions: {entries.length}
            </p>
          </div>

          {/* Responses Grid */}
          {entries.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg">
                No responses yet
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:gap-6">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-6 hover:border-teal-600 dark:hover:border-teal-400 transition-all"
                >
                  <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
                    {/* Left Column - Contact & Firm */}
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-navy-900 dark:text-white mb-1">
                          {entry.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                          {entry.timestamp?.toDate
                            ? new Date(
                                entry.timestamp.toDate()
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "N/A"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                          Contact
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 break-all">
                          📧 {entry.email}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          📱 {entry.mobile}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                          Firm Details
                        </p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {entry.firmName}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                          📍 {entry.city}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                          👥 {entry.teamSize}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {entry.practiceFocus}
                        </p>
                      </div>
                    </div>

                    {/* Middle Column - Workflows & Needs */}
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Workflows of Interest
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {entry.workflows?.map((workflow, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-200"
                            >
                              {workflow}
                            </span>
                          ))}
                        </div>
                        {entry.workflowsOther && (
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                            Other: {entry.workflowsOther}
                          </p>
                        )}
                      </div>

                      {entry.documentsPerMonth && (
                        <div>
                          <p className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            Documents/Month
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {entry.documentsPerMonth}
                          </p>
                        </div>
                      )}

                      <div>
                        <p className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                          Paid Pilot Readiness
                        </p>
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200">
                          {entry.paidPilotReadiness}
                        </span>
                      </div>

                      {entry.shareSamples && (
                        <div>
                          <p className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            Sample Sharing
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {entry.shareSamples}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Right Column - Participation Choice */}
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Participation Choice
                        </p>
                        <div className="p-3 bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-950/30 dark:to-emerald-950/30 border border-teal-200 dark:border-teal-800 rounded-lg">
                          <p className="text-sm font-semibold text-teal-900 dark:text-teal-100">
                            {entry.participationChoice === "pilot" &&
                              "✔ Join the Pilot"}
                            {entry.participationChoice === "loi" &&
                              "✔ Sign LOI (Non-Binding)"}
                            {entry.participationChoice === "sample" &&
                              "✔ Show Me a Sample First"}
                            {entry.participationChoice === "paid" &&
                              "✔ Paid Pilot (Fast Track)"}
                          </p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Stage:</span>{" "}
                          {entry.stage}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Source:</span>{" "}
                          {entry.source}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}
