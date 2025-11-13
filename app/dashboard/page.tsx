"use client";

import { useEffect, useState } from "react";
import { Lead } from "@/lib/types";
import { subscribeToLeads } from "@/lib/firestore";
import FunnelVisualization from "@/components/FunnelVisualization";
import FunnelBoard from "@/components/FunnelBoard";
import LeadsTable from "@/components/LeadsTable";
import ActivityLog from "@/components/ActivityLog";
import WeeklySummary from "@/components/WeeklySummary";
import LeadModal from "@/components/LeadModal";
import SeedDataButton from "@/components/SeedDataButton";
import Footer from "@/components/Footer";
import ProtectedRoute from "@/components/ProtectedRoute";
import { motion } from "framer-motion";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const unsubscribe = subscribeToLeads((data) => {
      setLeads(data);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [refreshKey]);

  const handleAddLead = () => {
    setSelectedLead(null);
    setIsModalOpen(true);
  };

  const handleEditLead = (lead: Lead) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedLead(null);
  };

  const handleSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

  if (isLoading) {
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
            LOADING DASHBOARD
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gradient-to-r from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent"
              >
                Founder Sales Command Center
              </motion.h1>
              <p className="text-gray-400 mt-2">
                Legal AI Lab • YCW26 • B2B Sales Pipeline
              </p>
            </div>
            <div className="flex gap-3">
              {leads.length === 0 && <SeedDataButton />}
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={handleAddLead}
                className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-teal-500/20 flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Lead
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-gradient-to-br from-teal-900/50 to-teal-800/30 border border-teal-700/50 rounded-xl p-6">
            <div className="text-sm text-teal-300 mb-2">Total Firms</div>
            <div className="text-3xl font-bold text-white">{leads.length}</div>
          </div>
          <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border border-blue-700/50 rounded-xl p-6">
            <div className="text-sm text-blue-300 mb-2">Responses</div>
            <div className="text-3xl font-bold text-white">
              {leads.filter((l) => l.stage !== "Suspect").length}
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border border-purple-700/50 rounded-xl p-6">
            <div className="text-sm text-purple-300 mb-2">In Pilots</div>
            <div className="text-3xl font-bold text-white">
              {leads.filter((l) => l.stage === "Opportunity").length}
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-900/50 to-green-800/30 border border-green-700/50 rounded-xl p-6">
            <div className="text-sm text-green-300 mb-2">Customers</div>
            <div className="text-3xl font-bold text-white">
              {leads.filter((l) => l.stage === "Customer").length}
            </div>
          </div>
        </motion.div>

        {/* Weekly Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <WeeklySummary leads={leads} />
        </motion.div>

        {/* Drag and Drop Board */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <FunnelBoard
            leads={leads}
            onRefresh={handleSuccess}
            onEditLead={handleEditLead}
          />
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Funnel Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <FunnelVisualization leads={leads} />
          </motion.div>

          {/* Activity Log */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <ActivityLog />
          </motion.div>
        </div>

        {/* Leads Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <LeadsTable
            leads={leads}
            onEditLead={handleEditLead}
            onRefresh={handleSuccess}
          />
        </motion.div>
      </div>

      <Footer />

      {/* Lead Modal */}
      <LeadModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        lead={selectedLead}
        onSuccess={handleSuccess}
      />
    </main>
  );
}
