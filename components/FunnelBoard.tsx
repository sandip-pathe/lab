"use client";

import { useState } from "react";
import { Lead, LeadStage } from "@/lib/types";
import { updateLeadStage } from "@/lib/firestore";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

interface FunnelBoardProps {
  leads: Lead[];
  onRefresh: () => void;
  onEditLead?: (lead: Lead) => void;
}

const stages: { name: LeadStage; color: string; bg: string; border: string }[] =
  [
    {
      name: "Suspect",
      color: "text-teal-400",
      bg: "bg-teal-900/20",
      border: "border-teal-700/50",
    },
    {
      name: "Prospect",
      color: "text-blue-400",
      bg: "bg-blue-900/20",
      border: "border-blue-700/50",
    },
    {
      name: "Opportunity",
      color: "text-purple-400",
      bg: "bg-purple-900/20",
      border: "border-purple-700/50",
    },
    {
      name: "Customer",
      color: "text-green-400",
      bg: "bg-green-900/20",
      border: "border-green-700/50",
    },
  ];

export default function FunnelBoard({
  leads,
  onRefresh,
  onEditLead,
}: FunnelBoardProps) {
  const [draggedLead, setDraggedLead] = useState<Lead | null>(null);
  const [dragOverStage, setDragOverStage] = useState<LeadStage | null>(null);

  const handleDragStart = (e: React.DragEvent, lead: Lead) => {
    setDraggedLead(lead);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, stage: LeadStage) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverStage(stage);
  };

  const handleDragLeave = () => {
    setDragOverStage(null);
  };

  const handleDrop = async (e: React.DragEvent, newStage: LeadStage) => {
    e.preventDefault();
    setDragOverStage(null);

    if (!draggedLead || draggedLead.stage === newStage) {
      setDraggedLead(null);
      return;
    }

    const oldStage = draggedLead.stage;

    try {
      await updateLeadStage(
        draggedLead.id,
        newStage,
        oldStage,
        draggedLead.firmName,
        `Moved from ${oldStage} to ${newStage}`
      );

      toast.success(`${draggedLead.firmName} moved to ${newStage}!`);
      onRefresh();
    } catch (error) {
      console.error("Error updating lead stage:", error);
      toast.error("Failed to update lead stage");
    } finally {
      setDraggedLead(null);
    }
  };

  const getLeadsByStage = (stage: LeadStage) => {
    return leads.filter((lead) => lead.stage === stage);
  };

  return (
    <div className="bg-gray-900 rounded-xl p-4 sm:p-6 border border-gray-800">
      <div className="mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
          Sales Pipeline
        </h2>
        <p className="text-gray-400 text-xs sm:text-sm">
          Drag and drop leads to change their stage
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stages.map((stage) => {
          const stageLeads = getLeadsByStage(stage.name);
          const isDropTarget = dragOverStage === stage.name;

          return (
            <div
              key={stage.name}
              onDragOver={(e) => handleDragOver(e, stage.name)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, stage.name)}
              className={`rounded-xl border-2 transition-all ${
                isDropTarget
                  ? "border-cyan-500 bg-cyan-900/20 scale-105"
                  : `${stage.border} ${stage.bg}`
              }`}
            >
              {/* Stage Header */}
              <div className="p-3 sm:p-4 border-b border-gray-700/50">
                <h3
                  className={`font-bold text-base sm:text-lg ${stage.color} mb-1`}
                >
                  {stage.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-400">
                  {stageLeads.length} leads
                </p>
              </div>

              {/* Leads List */}
              <div className="p-2 space-y-2 min-h-[200px] sm:min-h-[300px] max-h-[400px] sm:max-h-[600px] overflow-y-auto">
                {stageLeads.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 text-sm">
                    Drop leads here
                  </div>
                ) : (
                  stageLeads.map((lead) => (
                    <motion.div
                      key={lead.id}
                      draggable
                      onDragStart={(e) =>
                        handleDragStart(e as unknown as React.DragEvent, lead)
                      }
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.02 }}
                      className={`p-4 bg-gray-800 rounded-lg border border-gray-700 cursor-move hover:border-gray-600 transition-all ${
                        draggedLead?.id === lead.id ? "opacity-50" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-white text-sm">
                          {lead.firmName}
                        </h4>
                        {onEditLead && (
                          <button
                            onClick={() => onEditLead(lead)}
                            className="text-gray-400 hover:text-white transition-colors"
                            title="Edit lead"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mb-1">
                        {lead.contactName}
                      </p>
                      <p className="text-xs text-gray-500">{lead.email}</p>
                      {lead.phone && (
                        <p className="text-xs text-gray-500 mt-1">
                          {lead.phone}
                        </p>
                      )}
                      <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {new Date(lead.lastUpdated).toLocaleDateString()}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Drag hint */}
      {draggedLead && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-cyan-900/30 border border-cyan-700/50 rounded-lg text-center"
        >
          <p className="text-cyan-400 text-sm">
            🎯 Dragging <strong>{draggedLead.firmName}</strong> - Drop on a
            column to change stage
          </p>
        </motion.div>
      )}
    </div>
  );
}
