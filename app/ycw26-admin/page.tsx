/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase-config";
import ProtectedRoute from "@/components/ProtectedRoute";
import toast from "react-hot-toast";
import Footer from "@/components/Footer";

export default function YCW26AdminPage() {
  return (
    <ProtectedRoute>
      <AdminContent />
    </ProtectedRoute>
  );
}

function AdminContent() {
  const [activeTab, setActiveTab] = useState<
    "metrics" | "firms" | "commitments" | "insights" | "milestones"
  >("metrics");

  // Metrics State
  const [metrics, setMetrics] = useState({
    firms_contacted: 0,
    active_conversations: 0,
    ndas_executed: 0,
    lois_signed: 0,
    upcoming_meetings: 0,
  });

  // Firm State
  const [firms, setFirms] = useState<any[]>([]);
  const [newFirm, setNewFirm] = useState({
    name: "",
    stage: "",
    region: "",
    focus_area: "",
  });
  const [editingFirm, setEditingFirm] = useState<string | null>(null);
  const [editFirmData, setEditFirmData] = useState({
    name: "",
    stage: "",
    region: "",
    focus_area: "",
  });

  // Commitment State
  const [commitments, setCommitments] = useState<any[]>([]);
  const [newCommitment, setNewCommitment] = useState({
    type: "",
    description: "",
  });
  const [editingCommitment, setEditingCommitment] = useState<string | null>(
    null
  );
  const [editCommitmentData, setEditCommitmentData] = useState({
    type: "",
    description: "",
  });

  // Insight State
  const [insights, setInsights] = useState<any[]>([]);
  const [newInsight, setNewInsight] = useState({ text: "", order: 1 });
  const [editingInsight, setEditingInsight] = useState<string | null>(null);
  const [editInsightData, setEditInsightData] = useState({
    text: "",
    order: 1,
  });

  // Milestone State
  const [milestones, setMilestones] = useState<any[]>([]);
  const [newMilestone, setNewMilestone] = useState({
    goal: "",
    target_date: "",
    order: 1,
  });
  const [editingMilestone, setEditingMilestone] = useState<string | null>(null);
  const [editMilestoneData, setEditMilestoneData] = useState({
    goal: "",
    target_date: "",
    order: 1,
  });

  const loadAllData = async () => {
    try {
      // Load metrics
      const metricsSnap = await getDocs(collection(db, "metrics"));
      if (!metricsSnap.empty) {
        setMetrics(metricsSnap.docs[0].data() as any);
      }

      // Load firms
      const firmsSnap = await getDocs(collection(db, "firms"));
      setFirms(firmsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

      // Load commitments
      const commitmentsSnap = await getDocs(collection(db, "commitments"));
      setCommitments(
        commitmentsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );

      // Load insights
      const insightsSnap = await getDocs(collection(db, "insights"));
      const insightsData = insightsSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as any[];
      setInsights(insightsData.sort((a, b) => (a.order || 0) - (b.order || 0)));

      // Load milestones
      const milestonesSnap = await getDocs(collection(db, "milestones"));
      const milestonesData = milestonesSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as any[];
      setMilestones(
        milestonesData.sort((a, b) => (a.order || 0) - (b.order || 0))
      );
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load data");
    }
  };

  useEffect(() => {
    const fetchInitialData = () => {
      loadAllData();
    };
    fetchInitialData();
  }, []);

  const saveMetrics = async () => {
    try {
      await setDoc(doc(db, "metrics", "main"), metrics);
      toast.success("Metrics updated!");
    } catch (error) {
      console.error("Error saving metrics:", error);
      toast.error("Failed to save metrics");
    }
  };

  const addFirm = async () => {
    if (
      !newFirm.name ||
      !newFirm.stage ||
      !newFirm.region ||
      !newFirm.focus_area
    ) {
      toast.error("Please fill all firm fields");
      return;
    }
    try {
      await addDoc(collection(db, "firms"), newFirm);
      setNewFirm({ name: "", stage: "", region: "", focus_area: "" });
      loadAllData();
      toast.success("Firm added!");
    } catch (error) {
      console.error("Error adding firm:", error);
      toast.error("Failed to add firm");
    }
  };

  const deleteFirm = async (id: string) => {
    try {
      await deleteDoc(doc(db, "firms", id));
      loadAllData();
      toast.success("Firm deleted!");
    } catch (error) {
      console.error("Error deleting firm:", error);
      toast.error("Failed to delete firm");
    }
  };

  const startEditingFirm = (firm: any) => {
    setEditingFirm(firm.id);
    setEditFirmData({
      name: firm.name,
      stage: firm.stage,
      region: firm.region,
      focus_area: firm.focus_area,
    });
  };

  const cancelEditingFirm = () => {
    setEditingFirm(null);
    setEditFirmData({ name: "", stage: "", region: "", focus_area: "" });
  };

  const updateFirm = async (id: string) => {
    if (
      !editFirmData.name ||
      !editFirmData.stage ||
      !editFirmData.region ||
      !editFirmData.focus_area
    ) {
      toast.error("Please fill all firm fields");
      return;
    }
    try {
      await setDoc(doc(db, "firms", id), editFirmData);
      setEditingFirm(null);
      setEditFirmData({ name: "", stage: "", region: "", focus_area: "" });
      loadAllData();
      toast.success("Firm updated!");
    } catch (error) {
      console.error("Error updating firm:", error);
      toast.error("Failed to update firm");
    }
  };

  const addCommitment = async () => {
    if (!newCommitment.type || !newCommitment.description) {
      toast.error("Please fill all commitment fields");
      return;
    }
    try {
      await addDoc(collection(db, "commitments"), newCommitment);
      setNewCommitment({ type: "", description: "" });
      loadAllData();
      toast.success("Commitment added!");
    } catch (error) {
      console.error("Error adding commitment:", error);
      toast.error("Failed to add commitment");
    }
  };

  const deleteCommitment = async (id: string) => {
    try {
      await deleteDoc(doc(db, "commitments", id));
      loadAllData();
      toast.success("Commitment deleted!");
    } catch (error) {
      console.error("Error deleting commitment:", error);
      toast.error("Failed to delete commitment");
    }
  };

  const startEditingCommitment = (commitment: any) => {
    setEditingCommitment(commitment.id);
    setEditCommitmentData({
      type: commitment.type,
      description: commitment.description,
    });
  };

  const cancelEditingCommitment = () => {
    setEditingCommitment(null);
    setEditCommitmentData({ type: "", description: "" });
  };

  const updateCommitment = async (id: string) => {
    if (!editCommitmentData.type || !editCommitmentData.description) {
      toast.error("Please fill all commitment fields");
      return;
    }
    try {
      await setDoc(doc(db, "commitments", id), editCommitmentData);
      setEditingCommitment(null);
      setEditCommitmentData({ type: "", description: "" });
      loadAllData();
      toast.success("Commitment updated!");
    } catch (error) {
      console.error("Error updating commitment:", error);
      toast.error("Failed to update commitment");
    }
  };

  const addInsight = async () => {
    if (!newInsight.text) {
      toast.error("Please enter insight text");
      return;
    }
    try {
      await addDoc(collection(db, "insights"), newInsight);
      setNewInsight({ text: "", order: insights.length + 1 });
      loadAllData();
      toast.success("Insight added!");
    } catch (error) {
      console.error("Error adding insight:", error);
      toast.error("Failed to add insight");
    }
  };

  const deleteInsight = async (id: string) => {
    try {
      await deleteDoc(doc(db, "insights", id));
      loadAllData();
      toast.success("Insight deleted!");
    } catch (error) {
      console.error("Error deleting insight:", error);
      toast.error("Failed to delete insight");
    }
  };

  const startEditingInsight = (insight: any) => {
    setEditingInsight(insight.id);
    setEditInsightData({
      text: insight.text,
      order: insight.order || 1,
    });
  };

  const cancelEditingInsight = () => {
    setEditingInsight(null);
    setEditInsightData({ text: "", order: 1 });
  };

  const updateInsight = async (id: string) => {
    if (!editInsightData.text) {
      toast.error("Please enter insight text");
      return;
    }
    try {
      await setDoc(doc(db, "insights", id), editInsightData);
      setEditingInsight(null);
      setEditInsightData({ text: "", order: 1 });
      loadAllData();
      toast.success("Insight updated!");
    } catch (error) {
      console.error("Error updating insight:", error);
      toast.error("Failed to update insight");
    }
  };

  const addMilestone = async () => {
    if (!newMilestone.goal || !newMilestone.target_date) {
      toast.error("Please fill all milestone fields");
      return;
    }
    try {
      await addDoc(collection(db, "milestones"), newMilestone);
      setNewMilestone({
        goal: "",
        target_date: "",
        order: milestones.length + 1,
      });
      loadAllData();
      toast.success("Milestone added!");
    } catch (error) {
      console.error("Error adding milestone:", error);
      toast.error("Failed to add milestone");
    }
  };

  const deleteMilestone = async (id: string) => {
    try {
      await deleteDoc(doc(db, "milestones", id));
      loadAllData();
      toast.success("Milestone deleted!");
    } catch (error) {
      console.error("Error deleting milestone:", error);
      toast.error("Failed to delete milestone");
    }
  };

  const startEditingMilestone = (milestone: any) => {
    setEditingMilestone(milestone.id);
    setEditMilestoneData({
      goal: milestone.goal,
      target_date: milestone.target_date,
      order: milestone.order || 1,
    });
  };

  const cancelEditingMilestone = () => {
    setEditingMilestone(null);
    setEditMilestoneData({ goal: "", target_date: "", order: 1 });
  };

  const updateMilestone = async (id: string) => {
    if (!editMilestoneData.goal || !editMilestoneData.target_date) {
      toast.error("Please fill all milestone fields");
      return;
    }
    try {
      await setDoc(doc(db, "milestones", id), editMilestoneData);
      setEditingMilestone(null);
      setEditMilestoneData({ goal: "", target_date: "", order: 1 });
      loadAllData();
      toast.success("Milestone updated!");
    } catch (error) {
      console.error("Error updating milestone:", error);
      toast.error("Failed to update milestone");
    }
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <img
            src="/logo.png"
            alt="Legal AI Lab Logo"
            width={55}
            height={55}
            className="object-contain"
          />
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
              YC W26 Traction Board Admin
            </h1>
            <p className="text-sm sm:text-base text-gray-400">
              Update metrics, firms, commitments, insights, and milestones
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 sm:gap-2 mb-6 sm:mb-8 border-b border-gray-800 overflow-x-auto">
          {["metrics", "firms", "commitments", "insights", "milestones"].map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-3 sm:px-6 py-2 sm:py-3 font-medium capitalize text-sm sm:text-base whitespace-nowrap ${
                  activeTab === tab
                    ? "text-cyan-400 border-b-2 border-cyan-400"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {tab}
              </button>
            )
          )}
        </div>

        {/* Metrics Tab */}
        {activeTab === "metrics" && (
          <div className="bg-gray-900 rounded-xl p-4 sm:p-6 border border-gray-800">
            <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">
              Engagement Metrics
            </h2>
            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Firms Contacted
                </label>
                <input
                  type="number"
                  value={metrics.firms_contacted}
                  onChange={(e) =>
                    setMetrics({
                      ...metrics,
                      firms_contacted: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Active Conversations
                </label>
                <input
                  type="number"
                  value={metrics.active_conversations}
                  onChange={(e) =>
                    setMetrics({
                      ...metrics,
                      active_conversations: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  NDAs Executed
                </label>
                <input
                  type="number"
                  value={metrics.ndas_executed}
                  onChange={(e) =>
                    setMetrics({
                      ...metrics,
                      ndas_executed: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  LOIs Signed
                </label>
                <input
                  type="number"
                  value={metrics.lois_signed}
                  onChange={(e) =>
                    setMetrics({
                      ...metrics,
                      lois_signed: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Upcoming Meetings
                </label>
                <input
                  type="number"
                  value={metrics.upcoming_meetings}
                  onChange={(e) =>
                    setMetrics({
                      ...metrics,
                      upcoming_meetings: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                />
              </div>
            </div>
            <button
              onClick={saveMetrics}
              className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium"
            >
              Save Metrics
            </button>
          </div>
        )}

        {/* Firms Tab */}
        {activeTab === "firms" && (
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h2 className="text-xl font-bold mb-6">Cohort Firms</h2>

            {/* Add New Firm */}
            <div className="mb-6 p-4 bg-gray-800 rounded-lg">
              <h3 className="font-medium mb-4">Add New Firm</h3>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Firm Name (e.g., ABC Legal Partners)"
                  value={newFirm.name}
                  onChange={(e) =>
                    setNewFirm({ ...newFirm, name: e.target.value })
                  }
                  className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white md:col-span-2"
                />
                <input
                  type="text"
                  placeholder="Stage (e.g., Exploratory, Under NDA, LOI Signed)"
                  value={newFirm.stage}
                  onChange={(e) =>
                    setNewFirm({ ...newFirm, stage: e.target.value })
                  }
                  className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
                <input
                  type="text"
                  placeholder="Region (e.g., India, UK, US)"
                  value={newFirm.region}
                  onChange={(e) =>
                    setNewFirm({ ...newFirm, region: e.target.value })
                  }
                  className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
                <input
                  type="text"
                  placeholder="Focus Area (e.g., Corporate, Litigation)"
                  value={newFirm.focus_area}
                  onChange={(e) =>
                    setNewFirm({ ...newFirm, focus_area: e.target.value })
                  }
                  className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white md:col-span-2"
                />
              </div>
              <button
                onClick={addFirm}
                className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg"
              >
                Add Firm
              </button>
            </div>

            {/* Firms List */}
            <div className="space-y-2">
              {firms.map((firm) => (
                <div key={firm.id} className="p-4 bg-gray-800 rounded-lg">
                  {editingFirm === firm.id ? (
                    <div>
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <input
                          type="text"
                          placeholder="Firm Name"
                          value={editFirmData.name}
                          onChange={(e) =>
                            setEditFirmData({
                              ...editFirmData,
                              name: e.target.value,
                            })
                          }
                          className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white md:col-span-2"
                        />
                        <input
                          type="text"
                          placeholder="Stage"
                          value={editFirmData.stage}
                          onChange={(e) =>
                            setEditFirmData({
                              ...editFirmData,
                              stage: e.target.value,
                            })
                          }
                          className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                        />
                        <input
                          type="text"
                          placeholder="Region"
                          value={editFirmData.region}
                          onChange={(e) =>
                            setEditFirmData({
                              ...editFirmData,
                              region: e.target.value,
                            })
                          }
                          className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                        />
                        <input
                          type="text"
                          placeholder="Focus Area"
                          value={editFirmData.focus_area}
                          onChange={(e) =>
                            setEditFirmData({
                              ...editFirmData,
                              focus_area: e.target.value,
                            })
                          }
                          className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white md:col-span-2"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateFirm(firm.id)}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEditingFirm}
                          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-white font-bold text-lg">
                          {firm.name}
                        </span>
                        <div className="flex gap-2 mt-1 text-sm">
                          <span className="text-cyan-400">{firm.stage}</span>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-400">{firm.region}</span>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-400">
                            {firm.focus_area}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEditingFirm(firm)}
                          className="text-cyan-400 hover:text-cyan-300"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteFirm(firm.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Commitments Tab */}
        {activeTab === "commitments" && (
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h2 className="text-xl font-bold mb-6">Partner Commitments</h2>

            <div className="mb-6 p-4 bg-gray-800 rounded-lg">
              <h3 className="font-medium mb-4">Add New Commitment</h3>
              <div className="grid gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Type (e.g., Tier-1 Corporate Firm (India))"
                  value={newCommitment.type}
                  onChange={(e) =>
                    setNewCommitment({ ...newCommitment, type: e.target.value })
                  }
                  className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
                <textarea
                  placeholder="Description (e.g., LOI signed for document summarization pilot)"
                  value={newCommitment.description}
                  onChange={(e) =>
                    setNewCommitment({
                      ...newCommitment,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                  className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
              </div>
              <button
                onClick={addCommitment}
                className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg"
              >
                Add Commitment
              </button>
            </div>

            <div className="space-y-2">
              {commitments.map((commitment) => (
                <div key={commitment.id} className="p-4 bg-gray-800 rounded-lg">
                  {editingCommitment === commitment.id ? (
                    <div>
                      <div className="grid gap-4 mb-4">
                        <input
                          type="text"
                          value={editCommitmentData.type}
                          onChange={(e) =>
                            setEditCommitmentData({
                              ...editCommitmentData,
                              type: e.target.value,
                            })
                          }
                          className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                        />
                        <textarea
                          value={editCommitmentData.description}
                          onChange={(e) =>
                            setEditCommitmentData({
                              ...editCommitmentData,
                              description: e.target.value,
                            })
                          }
                          rows={3}
                          className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateCommitment(commitment.id)}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEditingCommitment}
                          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-cyan-400 font-medium">
                          {commitment.type}
                        </span>
                        <p className="text-gray-300 mt-1">
                          {commitment.description}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEditingCommitment(commitment)}
                          className="text-cyan-400 hover:text-cyan-300"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteCommitment(commitment.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Insights Tab */}
        {activeTab === "insights" && (
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h2 className="text-xl font-bold mb-6">What We&apos;re Learning</h2>

            <div className="mb-6 p-4 bg-gray-800 rounded-lg">
              <h3 className="font-medium mb-4">Add New Insight</h3>
              <div className="grid gap-4 mb-4">
                <textarea
                  placeholder="Insight text (e.g., Firms value reasoning transparency over automation speed)"
                  value={newInsight.text}
                  onChange={(e) =>
                    setNewInsight({ ...newInsight, text: e.target.value })
                  }
                  rows={3}
                  className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
                <input
                  type="number"
                  placeholder="Order"
                  value={newInsight.order}
                  onChange={(e) =>
                    setNewInsight({
                      ...newInsight,
                      order: parseInt(e.target.value) || 1,
                    })
                  }
                  className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
              </div>
              <button
                onClick={addInsight}
                className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg"
              >
                Add Insight
              </button>
            </div>

            <div className="space-y-2">
              {insights.map((insight, idx) => (
                <div key={insight.id} className="p-4 bg-gray-800 rounded-lg">
                  {editingInsight === insight.id ? (
                    <div>
                      <div className="grid gap-4 mb-4">
                        <textarea
                          value={editInsightData.text}
                          onChange={(e) =>
                            setEditInsightData({
                              ...editInsightData,
                              text: e.target.value,
                            })
                          }
                          rows={3}
                          className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                        />
                        <input
                          type="number"
                          value={editInsightData.order}
                          onChange={(e) =>
                            setEditInsightData({
                              ...editInsightData,
                              order: parseInt(e.target.value) || 1,
                            })
                          }
                          className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateInsight(insight.id)}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEditingInsight}
                          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-start">
                      <div className="flex gap-4">
                        <span className="text-cyan-400 font-mono">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <p className="text-gray-300">{insight.text}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEditingInsight(insight)}
                          className="text-cyan-400 hover:text-cyan-300"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteInsight(insight.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Milestones Tab */}
        {activeTab === "milestones" && (
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h2 className="text-xl font-bold mb-6">Next Milestones</h2>

            <div className="mb-6 p-4 bg-gray-800 rounded-lg">
              <h3 className="font-medium mb-4">Add New Milestone</h3>
              <div className="grid gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Goal (e.g., Activate first live pilot)"
                  value={newMilestone.goal}
                  onChange={(e) =>
                    setNewMilestone({ ...newMilestone, goal: e.target.value })
                  }
                  className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
                <input
                  type="text"
                  placeholder="Target Date (e.g., Dec 1, Q1 2026)"
                  value={newMilestone.target_date}
                  onChange={(e) =>
                    setNewMilestone({
                      ...newMilestone,
                      target_date: e.target.value,
                    })
                  }
                  className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
                <input
                  type="number"
                  placeholder="Order"
                  value={newMilestone.order}
                  onChange={(e) =>
                    setNewMilestone({
                      ...newMilestone,
                      order: parseInt(e.target.value) || 1,
                    })
                  }
                  className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
              </div>
              <button
                onClick={addMilestone}
                className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg"
              >
                Add Milestone
              </button>
            </div>

            <div className="space-y-2">
              {milestones.map((milestone) => (
                <div key={milestone.id} className="p-4 bg-gray-800 rounded-lg">
                  {editingMilestone === milestone.id ? (
                    <div>
                      <div className="grid gap-4 mb-4">
                        <input
                          type="text"
                          value={editMilestoneData.goal}
                          onChange={(e) =>
                            setEditMilestoneData({
                              ...editMilestoneData,
                              goal: e.target.value,
                            })
                          }
                          className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                        />
                        <input
                          type="text"
                          value={editMilestoneData.target_date}
                          onChange={(e) =>
                            setEditMilestoneData({
                              ...editMilestoneData,
                              target_date: e.target.value,
                            })
                          }
                          className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                        />
                        <input
                          type="number"
                          value={editMilestoneData.order}
                          onChange={(e) =>
                            setEditMilestoneData({
                              ...editMilestoneData,
                              order: parseInt(e.target.value) || 1,
                            })
                          }
                          className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateMilestone(milestone.id)}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEditingMilestone}
                          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-white">{milestone.goal}</p>
                        <p className="text-gray-400 text-sm mt-1">
                          {milestone.target_date}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEditingMilestone(milestone)}
                          className="text-cyan-400 hover:text-cyan-300"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteMilestone(milestone.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
