"use client";

import { useState } from "react";
import { createLead } from "@/lib/firestore";
import toast from "react-hot-toast";

const sampleLeads = [
  {
    firmName: "Acme Legal Partners",
    contactName: "John Doe",
    email: "john@acmelegal.com",
    phone: "+1 (555) 123-4567",
    stage: "Customer" as const,
    notes: "First pilot partner - actively testing document automation",
  },
  {
    firmName: "Globex Corporation Legal",
    contactName: "Jane Smith",
    email: "jane@globex.com",
    phone: "+1 (555) 234-5678",
    stage: "Opportunity" as const,
    notes: "Signed LOI - starting pilot next week",
  },
  {
    firmName: "Stark Industries Legal",
    contactName: "Tony Stark",
    email: "tony@stark.com",
    stage: "Opportunity" as const,
    notes: "Very interested in contract review automation",
  },
  {
    firmName: "Wayne Enterprises Law",
    contactName: "Bruce Wayne",
    email: "bruce@wayne.com",
    phone: "+1 (555) 456-7890",
    stage: "Prospect" as const,
    notes: "Responded positively, scheduling demo call",
  },
  {
    firmName: "Umbrella Legal Services",
    contactName: "Alice Johnson",
    email: "alice@umbrella.com",
    stage: "Prospect" as const,
    notes: "Interested in AI research capabilities",
  },
  {
    firmName: "Oscorp Legal Department",
    contactName: "Norman Osborn",
    email: "norman@oscorp.com",
    stage: "Suspect" as const,
    notes: "Initial outreach sent, no response yet",
  },
  {
    firmName: "Cyberdyne Systems Legal",
    contactName: "Miles Dyson",
    email: "miles@cyberdyne.com",
    phone: "+1 (555) 789-0123",
    stage: "Suspect" as const,
    notes: "Potential fit for litigation support",
  },
  {
    firmName: "Weyland-Yutani Legal",
    contactName: "Carter Burke",
    email: "carter@weyland.com",
    stage: "Prospect" as const,
    notes: "Expressed interest in compliance automation",
  },
];

export default function SeedDataButton() {
  const [isSeeding, setIsSeeding] = useState(false);

  const seedData = async () => {
    if (!confirm("This will add 8 sample leads to your database. Continue?")) {
      return;
    }

    setIsSeeding(true);
    let successCount = 0;

    try {
      for (const lead of sampleLeads) {
        await createLead(lead);
        successCount++;
        toast.success(`Added ${lead.firmName}`);
        // Small delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      toast.success(`Successfully added ${successCount} sample leads!`, {
        duration: 5000,
      });
    } catch (error) {
      console.error("Error seeding data:", error);
      toast.error(`Added ${successCount} leads before error occurred`);
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <button
      onClick={seedData}
      disabled={isSeeding}
      className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
    >
      {isSeeding ? (
        <>
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
          Seeding Data...
        </>
      ) : (
        <>
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
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
            />
          </svg>
          Seed Sample Data
        </>
      )}
    </button>
  );
}
