// Type definitions for B2B Sales Funnel Dashboard

export type LeadStage = "Suspect" | "Prospect" | "Opportunity" | "Customer";

export interface StageTransition {
  from: LeadStage | null;
  to: LeadStage;
  timestamp: Date;
  note?: string;
}

export interface Lead {
  id: string;
  firmName: string;
  contactName: string;
  email: string;
  phone?: string;
  stage: LeadStage;
  notes: string;
  createdAt: Date;
  lastUpdated: Date;
  stageHistory: StageTransition[];
}

export interface FunnelMetrics {
  totalSuspects: number;
  totalProspects: number;
  totalOpportunities: number;
  totalCustomers: number;
  suspectToProspectRate: number;
  prospectToOpportunityRate: number;
  opportunityToCustomerRate: number;
  overallConversionRate: number;
}

export interface WeeklySummary {
  weekStart: Date;
  weekEnd: Date;
  newSuspects: number;
  newProspects: number;
  newOpportunities: number;
  newCustomers: number;
  totalMovements: number;
  topMovers: {
    firmName: string;
    from: LeadStage;
    to: LeadStage;
  }[];
}

export interface ActivityLogEntry {
  id: string;
  leadId: string;
  firmName: string;
  action: "created" | "updated" | "stage_changed";
  from?: LeadStage;
  to?: LeadStage;
  timestamp: Date;
  note?: string;
}
