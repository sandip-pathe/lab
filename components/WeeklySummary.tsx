"use client";

import { useEffect, useState } from "react";
import { Lead, LeadStage } from "@/lib/types";
import { startOfWeek, endOfWeek, isWithinInterval } from "date-fns";
import { motion } from "framer-motion";

interface WeeklySummaryProps {
  leads: Lead[];
}

export default function WeeklySummary({ leads }: WeeklySummaryProps) {
  const [weeklyStats, setWeeklyStats] = useState({
    newSuspects: 0,
    newProspects: 0,
    newOpportunities: 0,
    newCustomers: 0,
    totalMovements: 0,
    topMovers: [] as { firmName: string; from: LeadStage; to: LeadStage }[],
  });

  useEffect(() => {
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 }); // Monday
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

    let newSuspects = 0;
    let newProspects = 0;
    let newOpportunities = 0;
    let newCustomers = 0;
    let totalMovements = 0;
    const topMovers: { firmName: string; from: LeadStage; to: LeadStage }[] =
      [];

    leads.forEach((lead) => {
      // Check for new leads this week
      if (
        isWithinInterval(lead.createdAt, { start: weekStart, end: weekEnd })
      ) {
        switch (lead.stage) {
          case "Suspect":
            newSuspects++;
            break;
          case "Prospect":
            newProspects++;
            break;
          case "Opportunity":
            newOpportunities++;
            break;
          case "Customer":
            newCustomers++;
            break;
        }
      }

      // Check for stage changes this week
      lead.stageHistory.forEach((transition) => {
        if (
          transition.from &&
          isWithinInterval(transition.timestamp, {
            start: weekStart,
            end: weekEnd,
          })
        ) {
          totalMovements++;
          if (topMovers.length < 5) {
            topMovers.push({
              firmName: lead.firmName,
              from: transition.from,
              to: transition.to,
            });
          }
        }
      });
    });

    setWeeklyStats({
      newSuspects,
      newProspects,
      newOpportunities,
      newCustomers,
      totalMovements,
      topMovers,
    });
  }, [leads]);

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">
          📊 This Week&apos;s Summary
        </h2>
        <span className="text-xs bg-teal-500/20 text-teal-300 px-3 py-1 rounded-full">
          Last 7 days
        </span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800/50 rounded-lg p-4 border border-gray-700"
        >
          <p className="text-xs text-gray-400 mb-1">New Suspects</p>
          <p className="text-2xl font-bold text-teal-400">
            {weeklyStats.newSuspects}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800/50 rounded-lg p-4 border border-gray-700"
        >
          <p className="text-xs text-gray-400 mb-1">New Prospects</p>
          <p className="text-2xl font-bold text-blue-400">
            {weeklyStats.newProspects}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800/50 rounded-lg p-4 border border-gray-700"
        >
          <p className="text-xs text-gray-400 mb-1">New Opportunities</p>
          <p className="text-2xl font-bold text-purple-400">
            {weeklyStats.newOpportunities}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-800/50 rounded-lg p-4 border border-gray-700"
        >
          <p className="text-xs text-gray-400 mb-1">New Customers</p>
          <p className="text-2xl font-bold text-green-400">
            {weeklyStats.newCustomers}
          </p>
        </motion.div>
      </div>

      {/* Total Movements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-gray-800/50 rounded-lg p-4 border border-gray-700"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400 mb-1">Total Stage Movements</p>
            <p className="text-3xl font-bold text-white">
              {weeklyStats.totalMovements}
            </p>
          </div>
          <div className="text-4xl">🚀</div>
        </div>

        {/* Top Movers */}
        {weeklyStats.topMovers.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-700">
            <p className="text-xs text-gray-400 mb-2">Recent Progressions:</p>
            <div className="space-y-2">
              {weeklyStats.topMovers.map((mover, index) => (
                <div
                  key={index}
                  className="text-xs bg-gray-700/30 rounded px-2 py-1.5 flex items-center justify-between"
                >
                  <span className="text-white font-medium">
                    {mover.firmName}
                  </span>
                  <span className="text-gray-400">
                    {mover.from} → {mover.to}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
