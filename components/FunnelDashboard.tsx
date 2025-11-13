"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase-config";
import { motion } from "framer-motion";

interface FunnelStage {
  stage: string;
  description: string;
  count: number;
  percentage: number;
}

// Mock data for when Firestore is empty
const mockData: FunnelStage[] = [
  {
    stage: "Leads",
    description: "Firms contacted",
    count: 30,
    percentage: 100,
  },
  {
    stage: "Prospects",
    description: "Responded / Interested",
    count: 12,
    percentage: 40,
  },
  {
    stage: "Opportunities",
    description: "Signed LOIs / Confirmed Interest",
    count: 7,
    percentage: 23,
  },
  {
    stage: "Customers",
    description: "Active Pilot Partners",
    count: 3,
    percentage: 10,
  },
];

export default function FunnelDashboard() {
  const [funnelData, setFunnelData] = useState<FunnelStage[]>(mockData);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [usingMockData, setUsingMockData] = useState(false);

  useEffect(() => {
    fetchFunnelData();
  }, []);

  const fetchFunnelData = async () => {
    try {
      const q = query(
        collection(db, "loi_entries"),
        orderBy("timestamp", "desc")
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setUsingMockData(true);
        setIsLoading(false);
        return;
      }

      // Count entries by stage
      const stageCounts: Record<string, number> = {
        lead: 0,
        prospect: 0,
        opportunity: 0,
        customer: 0,
      };

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const stage = data.stage?.toLowerCase() || "prospect";
        if (stage in stageCounts) {
          stageCounts[stage]++;
        }
      });

      // Calculate totals
      const totalLeads =
        Object.values(stageCounts).reduce((sum, count) => sum + count, 0) || 30;

      const calculatedData: FunnelStage[] = [
        {
          stage: "Leads",
          description: "Firms contacted",
          count: totalLeads,
          percentage: 100,
        },
        {
          stage: "Prospects",
          description: "Responded / Interested",
          count:
            stageCounts.prospect +
            stageCounts.opportunity +
            stageCounts.customer,
          percentage: Math.round(
            ((stageCounts.prospect +
              stageCounts.opportunity +
              stageCounts.customer) /
              totalLeads) *
              100
          ),
        },
        {
          stage: "Opportunities",
          description: "Signed LOIs / Confirmed Interest",
          count: stageCounts.opportunity + stageCounts.customer,
          percentage: Math.round(
            ((stageCounts.opportunity + stageCounts.customer) / totalLeads) *
              100
          ),
        },
        {
          stage: "Customers",
          description: "Active Pilot Partners",
          count: stageCounts.customer,
          percentage: Math.round((stageCounts.customer / totalLeads) * 100),
        },
      ];

      setFunnelData(calculatedData);
      setUsingMockData(false);
      setLastUpdated(new Date().toLocaleString());
    } catch (error) {
      console.error("Error fetching funnel data:", error);
      setUsingMockData(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Mock Data Notice */}
      {usingMockData && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
          <p className="text-sm text-yellow-800">
            📊 Displaying sample data. Add entries to Firestore to see live
            data.
          </p>
        </div>
      )}

      {/* Funnel Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-navy-900">
                  Stage
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-navy-900">
                  Description
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-navy-900">
                  Count
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-navy-900">
                  Conversion %
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {funnelData.map((item, index) => (
                <motion.tr
                  key={item.stage}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <span className="font-semibold text-navy-900">
                      {item.stage}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {item.description}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center justify-center w-12 h-12 bg-teal-100 text-teal-700 font-bold rounded-lg">
                      {item.count}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-lg font-semibold text-navy-900">
                      {item.percentage}%
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
        <h3 className="text-2xl font-bold text-navy-900 mb-6">
          Stage Progression
        </h3>
        <div className="space-y-6">
          {funnelData.map((item, index) => (
            <motion.div
              key={item.stage}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-navy-900">
                  {item.stage}
                </span>
                <span className="text-sm text-gray-600">{item.count}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.percentage}%` }}
                  transition={{
                    duration: 1,
                    delay: 0.6 + index * 0.1,
                    ease: "easeOut",
                  }}
                  className="h-full bg-gradient-to-r from-teal-500 to-teal-600 rounded-full"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div className="text-center text-sm text-gray-500">
        <p>
          Data auto-refreshes daily
          {lastUpdated && ` • Last updated ${lastUpdated}`}
        </p>
        <p className="mt-1">
          Legal AI Factories — Infrastructure for Legal Cognition
        </p>
      </div>
    </div>
  );
}
