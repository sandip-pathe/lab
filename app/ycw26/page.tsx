"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase-config";
import Footer from "@/components/Footer";

interface Metrics {
  firms_contacted: number;
  active_conversations: number;
  ndas_executed: number;
  lois_signed: number;
  upcoming_meetings: number;
}

interface Firm {
  name: string;
  region: string;
  focus_area: string;
  stage: string;
}

interface Commitment {
  description: string;
  type: string;
}

interface Insight {
  text: string;
  order: number;
}

interface Milestone {
  goal: string;
  target_date: string;
  order: number;
}

export default function YCW26TractionBoard() {
  const [metrics, setMetrics] = useState<Metrics>({
    firms_contacted: 0,
    active_conversations: 0,
    ndas_executed: 0,
    lois_signed: 0,
    upcoming_meetings: 0,
  });
  const [firms, setFirms] = useState<Firm[]>([]);
  const [commitments, setCommitments] = useState<Commitment[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const metricsSnap = await getDocs(collection(db, "metrics"));
        if (!metricsSnap.empty) {
          const data = metricsSnap.docs[0].data() as Metrics;
          setMetrics(data);
        }

        const firmsSnap = await getDocs(collection(db, "firms"));
        const firmsData = firmsSnap.docs.map((doc) => doc.data() as Firm);
        setFirms(firmsData);

        const commitmentsSnap = await getDocs(collection(db, "commitments"));
        const commitmentsData = commitmentsSnap.docs.map(
          (doc) => doc.data() as Commitment
        );
        setCommitments(commitmentsData);

        const insightsSnap = await getDocs(collection(db, "insights"));
        const insightsData = insightsSnap.docs
          .map((doc) => doc.data() as Insight)
          .sort((a, b) => a.order - b.order);
        setInsights(insightsData);

        const milestonesSnap = await getDocs(collection(db, "milestones"));
        const milestonesData = milestonesSnap.docs
          .map((doc) => doc.data() as Milestone)
          .sort((a, b) => a.order - b.order);
        setMilestones(milestonesData);
      } catch (error) {
        console.error("Error fetching traction data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/20 via-black to-cyan-950/20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,0.8),rgba(0,0,0,1))]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:100px_100px]"></div>
        <div className="relative z-10 text-center">
          <div className="inline-flex items-center gap-3 text-cyan-400/70 text-sm tracking-widest">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
            LOADING DATA
          </div>
        </div>
      </div>
    );
  }

  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <header className="mb-16 border-b border-gray-800 pb-8">
          <div className="flex items-center gap-4 mb-6">
            <Image
              src="/logo.png"
              alt="Legal AI Lab Logo"
              width={60}
              height={60}
              className="object-contain"
            />
            <div>
              <h1 className="text-4xl font-semibold text-white tracking-tight">
                Anaya Legal AI Lab — YC W26 Traction Board
              </h1>
              <p className="text-sm text-gray-500 mt-2">
                Updated {currentDate}
              </p>
            </div>
          </div>
          <p className="text-lg text-gray-400 leading-relaxed">
            Building private AI infrastructure with law firms — privacy,
            precision, and partnership.
          </p>
        </header>

        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-white mb-6">
            Engagement Metrics
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <MetricCard
              value={metrics.firms_contacted}
              label="Firms Contacted"
              sublabel="Total outreach"
            />
            <MetricCard
              value={metrics.active_conversations}
              label="Active Conversations"
              sublabel="Ongoing discussions"
            />
            <MetricCard
              value={metrics.ndas_executed}
              label="NDAs Executed"
              sublabel="Under confidentiality"
            />
            <MetricCard
              value={metrics.lois_signed}
              label="LOIs Signed"
              sublabel="Non-binding intent"
            />
            <MetricCard
              value={metrics.upcoming_meetings}
              label="Upcoming Meetings"
              sublabel="Next 2 weeks"
            />
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-white mb-6">
            Cohort Formation
          </h2>
          <div className="border border-gray-800 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                    Firm Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                    Stage
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                    Region
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                    Focus Area
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {firms.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No firm data available
                    </td>
                  </tr>
                ) : (
                  firms.map((firm, idx) => (
                    <tr key={idx} className="hover:bg-gray-900/30">
                      <td className="px-6 py-4 text-sm font-medium text-white">
                        {firm.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-cyan-400">
                        {firm.stage}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {firm.region}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {firm.focus_area}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {commitments.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-white mb-6">
              Partner Commitments
            </h2>
            <div className="space-y-3">
              {commitments.map((commitment, idx) => (
                <div
                  key={idx}
                  className="border border-gray-800 rounded-lg px-6 py-4 bg-gray-900/20"
                >
                  <p className="text-sm text-gray-300 leading-relaxed">
                    <span className="text-cyan-400 font-medium">
                      {commitment.type}
                    </span>{" "}
                    — {commitment.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {insights.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-white mb-6">
              What We&apos;re Learning
            </h2>
            <div className="space-y-3">
              {insights.map((insight, idx) => (
                <div key={idx} className="flex gap-4">
                  <span className="text-cyan-400 font-mono text-sm mt-1">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <p className="text-gray-300 leading-relaxed flex-1">
                    {insight.text}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {milestones.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-white mb-6">
              Next Milestones
            </h2>
            <div className="space-y-3">
              {milestones.map((milestone, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-start border border-gray-800 rounded-lg px-6 py-4 bg-gray-900/20"
                >
                  <p className="text-gray-300">{milestone.goal}</p>
                  <span className="text-sm text-gray-500 whitespace-nowrap ml-4">
                    {milestone.target_date}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mb-16 border-t border-gray-800 pt-8">
          <div className="bg-gray-900/30 border border-gray-800 rounded-lg px-6 py-5">
            <p className="text-sm text-gray-400 leading-relaxed">
              All firm identities anonymized under NDA. Full details (LOIs,
              NDAs) available for YC review under confidentiality.
            </p>
          </div>
        </section>

        <footer className="text-center border-t border-gray-800 pt-8">
          <p className="text-gray-500 text-sm">
            The Legal AI Lab is where law firms co-build the future of legal
            intelligence.
          </p>
        </footer>
      </div>
      <Footer />
    </main>
  );
}

function MetricCard({
  value,
  label,
  sublabel,
}: {
  value: number;
  label: string;
  sublabel: string;
}) {
  return (
    <div className="border border-gray-800 rounded-lg px-4 py-5 bg-gray-900/20">
      <div className="text-3xl font-semibold text-white mb-1">{value}</div>
      <div className="text-sm font-medium text-gray-300 mb-1">{label}</div>
      <div className="text-xs text-gray-500">{sublabel}</div>
    </div>
  );
}
