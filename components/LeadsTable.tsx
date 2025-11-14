"use client";

import { useState } from "react";
import { Lead, LeadStage } from "@/lib/types";
import { deleteLead } from "@/lib/firestore";
import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";

interface LeadsTableProps {
  leads: Lead[];
  onEditLead: (lead: Lead) => void;
  onRefresh: () => void;
}

const STAGE_COLORS = {
  Suspect: "bg-teal-500/20 text-teal-300 border-teal-500/30",
  Prospect: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  Opportunity: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  Customer: "bg-green-500/20 text-green-300 border-green-500/30",
};

export default function LeadsTable({
  leads,
  onEditLead,
  onRefresh,
}: LeadsTableProps) {
  const [filter, setFilter] = useState<LeadStage | "All">("All");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLeads = leads.filter((lead) => {
    const matchesFilter = filter === "All" || lead.stage === filter;
    const matchesSearch =
      lead.firmName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleDelete = async (id: string, firmName: string) => {
    if (confirm(`Are you sure you want to delete ${firmName}?`)) {
      try {
        await deleteLead(id);
        toast.success("Lead deleted successfully!");
        onRefresh();
      } catch (error) {
        console.error("Error deleting lead:", error);
        toast.error("Failed to delete lead.");
      }
    }
  };

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-xl font-bold text-white">
            All Leads ({filteredLeads.length})
          </h2>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent w-full sm:w-64"
              />
              <svg
                className="absolute left-3 top-2.5 w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* Filter */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as LeadStage | "All")}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="All">All Stages</option>
              <option value="Suspect">Suspects</option>
              <option value="Prospect">Prospects</option>
              <option value="Opportunity">Opportunities</option>
              <option value="Customer">Customers</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {/* Desktop Table View */}
        <table className="w-full hidden md:table">
          <thead className="bg-gray-800/50 border-b border-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Firm
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Stage
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Last Updated
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {filteredLeads.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  {searchTerm || filter !== "All"
                    ? "No leads found matching your filters"
                    : "No leads yet. Add your first lead to get started!"}
                </td>
              </tr>
            ) : (
              filteredLeads.map((lead) => (
                <tr
                  key={lead.id}
                  className="hover:bg-gray-800/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-white">
                        {lead.firmName}
                      </div>
                      {lead.notes && (
                        <div className="text-xs text-gray-500 mt-1 truncate max-w-xs">
                          {lead.notes}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm text-white">
                        {lead.contactName}
                      </div>
                      <div className="text-xs text-gray-500">{lead.email}</div>
                      {lead.phone && (
                        <div className="text-xs text-gray-500">
                          {lead.phone}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                        STAGE_COLORS[lead.stage]
                      }`}
                    >
                      {lead.stage}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {formatDistanceToNow(lead.lastUpdated, { addSuffix: true })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEditLead(lead)}
                        className="p-2 text-teal-400 hover:text-teal-300 hover:bg-gray-800 rounded-lg transition-colors"
                        title="Edit"
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
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(lead.id, lead.firmName)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-gray-800 rounded-lg transition-colors"
                        title="Delete"
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4 p-4">
          {filteredLeads.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchTerm || filter !== "All"
                ? "No leads found matching your filters"
                : "No leads yet. Add your first lead to get started!"}
            </div>
          ) : (
            filteredLeads.map((lead) => (
              <div
                key={lead.id}
                className="bg-gray-800/30 border border-gray-700 rounded-lg p-4 space-y-3"
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1">
                    <h3 className="font-medium text-white text-base">
                      {lead.firmName}
                    </h3>
                    <p className="text-sm text-white mt-1">
                      {lead.contactName}
                    </p>
                    <p className="text-xs text-gray-500">{lead.email}</p>
                    {lead.phone && (
                      <p className="text-xs text-gray-500">{lead.phone}</p>
                    )}
                  </div>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                      STAGE_COLORS[lead.stage]
                    }`}
                  >
                    {lead.stage}
                  </span>
                </div>

                {lead.notes && (
                  <p className="text-xs text-gray-400 line-clamp-2">
                    {lead.notes}
                  </p>
                )}

                <div className="flex justify-between items-center pt-2 border-t border-gray-700">
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(lead.lastUpdated, { addSuffix: true })}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEditLead(lead)}
                      className="p-2 text-teal-400 hover:text-teal-300 hover:bg-gray-800 rounded-lg transition-colors"
                      title="Edit"
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
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(lead.id, lead.firmName)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-gray-800 rounded-lg transition-colors"
                      title="Delete"
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
