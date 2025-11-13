"use client";

import { useState } from "react";
import { Lead, LeadStage } from "@/lib/types";
import { createLead, updateLead, updateLeadStage } from "@/lib/firestore";
import toast from "react-hot-toast";

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead?: Lead | null;
  onSuccess: () => void;
}

const STAGES: LeadStage[] = ["Suspect", "Prospect", "Opportunity", "Customer"];

export default function LeadModal({
  isOpen,
  onClose,
  lead,
  onSuccess,
}: LeadModalProps) {
  const [formData, setFormData] = useState({
    firmName: lead?.firmName || "",
    contactName: lead?.contactName || "",
    email: lead?.email || "",
    phone: lead?.phone || "",
    stage: lead?.stage || ("Suspect" as LeadStage),
    notes: lead?.notes || "",
  });
  const [stageNote, setStageNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (lead) {
        // Update existing lead
        const stageChanged = lead.stage !== formData.stage;

        if (stageChanged) {
          // Update stage with history
          await updateLeadStage(
            lead.id,
            formData.stage,
            lead.stage,
            formData.firmName,
            stageNote || undefined
          );
        }

        // Update other fields
        await updateLead(lead.id, {
          firmName: formData.firmName,
          contactName: formData.contactName,
          email: formData.email,
          phone: formData.phone,
          notes: formData.notes,
          lastUpdated: new Date(),
        });

        toast.success("Lead updated successfully!");
      } else {
        // Create new lead
        await createLead({
          firmName: formData.firmName,
          contactName: formData.contactName,
          email: formData.email,
          phone: formData.phone,
          stage: formData.stage,
          notes: formData.notes,
        });
        toast.success("Lead created successfully!");
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving lead:", error);
      toast.error("Failed to save lead. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-800">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">
            {lead ? "Edit Lead" : "Add New Lead"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Firm Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Firm Name *
            </label>
            <input
              type="text"
              name="firmName"
              value={formData.firmName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Acme Legal Partners"
            />
          </div>

          {/* Contact Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Contact Name *
            </label>
            <input
              type="text"
              name="contactName"
              value={formData.contactName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="John Doe"
            />
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="john@acmelegal.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>

          {/* Stage */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Stage *
            </label>
            <select
              name="stage"
              value={formData.stage}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              {STAGES.map((stage) => (
                <option key={stage} value={stage}>
                  {stage}
                </option>
              ))}
            </select>
          </div>

          {/* Stage Change Note (only if editing and stage changed) */}
          {lead && lead.stage !== formData.stage && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Stage Change Note
              </label>
              <input
                type="text"
                value={stageNote}
                onChange={(e) => setStageNote(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Why is this lead moving stages?"
              />
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
              placeholder="Add any additional notes about this lead..."
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? "Saving..."
                : lead
                ? "Update Lead"
                : "Create Lead"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
