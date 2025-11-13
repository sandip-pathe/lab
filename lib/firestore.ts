// Firestore utility functions for lead management

import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  onSnapshot,
  QuerySnapshot,
  DocumentData,
} from "firebase/firestore";
import { db } from "./firebase-config";
import { Lead, LeadStage, StageTransition, ActivityLogEntry } from "./types";

const LEADS_COLLECTION = "leads";
const ACTIVITY_LOG_COLLECTION = "activity_log";

// Convert Firestore timestamp to Date
const timestampToDate = (
  timestamp: Timestamp | Date | string | number
): Date => {
  if (timestamp && typeof timestamp === "object" && "toDate" in timestamp) {
    return timestamp.toDate();
  }
  if (timestamp instanceof Date) {
    return timestamp;
  }
  return new Date(timestamp);
};

// Convert Lead data from Firestore
const convertLeadData = (id: string, data: DocumentData): Lead => {
  return {
    id,
    firmName: data.firmName || "",
    contactName: data.contactName || "",
    email: data.email || "",
    phone: data.phone || "",
    stage: data.stage || "Suspect",
    notes: data.notes || "",
    createdAt: timestampToDate(data.createdAt),
    lastUpdated: timestampToDate(data.lastUpdated),
    stageHistory: (data.stageHistory || []).map((h: DocumentData) => ({
      from: h.from,
      to: h.to,
      timestamp: timestampToDate(h.timestamp),
      note: h.note,
    })),
  };
};

// Create a new lead
export const createLead = async (
  leadData: Omit<Lead, "id" | "createdAt" | "lastUpdated" | "stageHistory">
): Promise<string> => {
  const now = Timestamp.now();
  const stageHistory: StageTransition[] = [
    {
      from: null,
      to: leadData.stage,
      timestamp: now.toDate(),
      note: "Lead created",
    },
  ];

  const docRef = await addDoc(collection(db, LEADS_COLLECTION), {
    ...leadData,
    createdAt: now,
    lastUpdated: now,
    stageHistory,
  });

  // Log activity
  await addDoc(collection(db, ACTIVITY_LOG_COLLECTION), {
    leadId: docRef.id,
    firmName: leadData.firmName,
    action: "created",
    to: leadData.stage,
    timestamp: now,
  });

  return docRef.id;
};

// Update a lead
export const updateLead = async (
  id: string,
  updates: Partial<Omit<Lead, "id" | "createdAt" | "stageHistory">>
): Promise<void> => {
  const leadRef = doc(db, LEADS_COLLECTION, id);
  const now = Timestamp.now();

  await updateDoc(leadRef, {
    ...updates,
    lastUpdated: now,
  });

  // Log activity
  await addDoc(collection(db, ACTIVITY_LOG_COLLECTION), {
    leadId: id,
    firmName: updates.firmName || "Unknown",
    action: "updated",
    timestamp: now,
  });
};

// Update lead stage
export const updateLeadStage = async (
  id: string,
  newStage: LeadStage,
  oldStage: LeadStage,
  firmName: string,
  note?: string
): Promise<void> => {
  const leadRef = doc(db, LEADS_COLLECTION, id);
  const now = Timestamp.now();

  const transition: StageTransition = {
    from: oldStage,
    to: newStage,
    timestamp: now.toDate(),
    note,
  };

  // Get current stage history and append new transition
  const leadsQuery = query(
    collection(db, LEADS_COLLECTION),
    where("__name__", "==", id)
  );
  const snapshot = await getDocs(leadsQuery);

  let currentHistory: StageTransition[] = [];
  snapshot.forEach((doc) => {
    const data = doc.data();
    currentHistory = data.stageHistory || [];
  });

  await updateDoc(leadRef, {
    stage: newStage,
    lastUpdated: now,
    stageHistory: [...currentHistory, transition],
  });

  // Log activity
  await addDoc(collection(db, ACTIVITY_LOG_COLLECTION), {
    leadId: id,
    firmName,
    action: "stage_changed",
    from: oldStage,
    to: newStage,
    timestamp: now,
    note,
  });
};

// Delete a lead
export const deleteLead = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, LEADS_COLLECTION, id));
};

// Get all leads
export const getAllLeads = async (): Promise<Lead[]> => {
  const q = query(
    collection(db, LEADS_COLLECTION),
    orderBy("lastUpdated", "desc")
  );
  const querySnapshot = await getDocs(q);

  const leads: Lead[] = [];
  querySnapshot.forEach((doc) => {
    leads.push(convertLeadData(doc.id, doc.data()));
  });

  return leads;
};

// Get leads by stage
export const getLeadsByStage = async (stage: LeadStage): Promise<Lead[]> => {
  const q = query(
    collection(db, LEADS_COLLECTION),
    where("stage", "==", stage),
    orderBy("lastUpdated", "desc")
  );
  const querySnapshot = await getDocs(q);

  const leads: Lead[] = [];
  querySnapshot.forEach((doc) => {
    leads.push(convertLeadData(doc.id, doc.data()));
  });

  return leads;
};

// Real-time listener for leads
export const subscribeToLeads = (
  callback: (leads: Lead[]) => void
): (() => void) => {
  const q = query(
    collection(db, LEADS_COLLECTION),
    orderBy("lastUpdated", "desc")
  );

  return onSnapshot(q, (snapshot: QuerySnapshot) => {
    const leads: Lead[] = [];
    snapshot.forEach((doc) => {
      leads.push(convertLeadData(doc.id, doc.data()));
    });
    callback(leads);
  });
};

// Get activity log
export const getActivityLog = async (
  limit = 50
): Promise<ActivityLogEntry[]> => {
  const q = query(
    collection(db, ACTIVITY_LOG_COLLECTION),
    orderBy("timestamp", "desc")
  );
  const querySnapshot = await getDocs(q);

  const activities: ActivityLogEntry[] = [];
  let count = 0;
  querySnapshot.forEach((doc) => {
    if (count >= limit) return;
    const data = doc.data();
    activities.push({
      id: doc.id,
      leadId: data.leadId,
      firmName: data.firmName,
      action: data.action,
      from: data.from,
      to: data.to,
      timestamp: timestampToDate(data.timestamp),
      note: data.note,
    });
    count++;
  });

  return activities;
};

// Real-time listener for activity log
export const subscribeToActivityLog = (
  callback: (activities: ActivityLogEntry[]) => void,
  limit = 50
): (() => void) => {
  const q = query(
    collection(db, ACTIVITY_LOG_COLLECTION),
    orderBy("timestamp", "desc")
  );

  return onSnapshot(q, (snapshot: QuerySnapshot) => {
    const activities: ActivityLogEntry[] = [];
    let count = 0;
    snapshot.forEach((doc) => {
      if (count >= limit) return;
      const data = doc.data();
      activities.push({
        id: doc.id,
        leadId: data.leadId,
        firmName: data.firmName,
        action: data.action,
        from: data.from,
        to: data.to,
        timestamp: timestampToDate(data.timestamp),
        note: data.note,
      });
      count++;
    });
    callback(activities);
  });
};
