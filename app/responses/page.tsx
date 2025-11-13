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
  employeeSize: string;
  aiNeeds: string;
  interestedInPilot: boolean;
  interestedInLOI: boolean;
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
      <div className="flex-1 w-full px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-navy-900 dark:text-white mb-2">
              LOI Form Responses
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Total submissions: {entries.length}
            </p>
          </div>

          {/* Responses Grid */}
          {entries.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                No responses yet
              </p>
            </div>
          ) : (
            <div className="grid gap-6">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:border-teal-600 dark:hover:border-teal-400 transition-all"
                >
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-bold text-navy-900 dark:text-white mb-1">
                          {entry.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
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
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                          Contact
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                          📧 {entry.email}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                          📱 {entry.mobile}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                          Firm
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                          {entry.firmName}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {entry.employeeSize} employees
                        </p>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          AI Needs
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                          {entry.aiNeeds}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Interest
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {entry.interestedInPilot && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200">
                              🚀 Pilot Program
                            </span>
                          )}
                          {entry.interestedInLOI && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200">
                              📝 Letter of Intent
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Stage: {entry.stage} · Source: {entry.source}
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
