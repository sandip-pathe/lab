"use client";

import { useEffect, useState } from "react";
import { ActivityLogEntry } from "@/lib/types";
import { subscribeToActivityLog } from "@/lib/firestore";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";

export default function ActivityLog() {
  const [activities, setActivities] = useState<ActivityLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToActivityLog((data) => {
      setActivities(data);
      setIsLoading(false);
    }, 20);

    return () => unsubscribe();
  }, []);

  const getActivityIcon = (action: ActivityLogEntry["action"]) => {
    switch (action) {
      case "created":
        return "➕";
      case "updated":
        return "✏️";
      case "stage_changed":
        return "🚀";
      default:
        return "📝";
    }
  };

  const getActivityColor = (action: ActivityLogEntry["action"]) => {
    switch (action) {
      case "created":
        return "bg-green-100 text-green-800 border-green-200";
      case "updated":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "stage_changed":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getActivityText = (activity: ActivityLogEntry) => {
    switch (activity.action) {
      case "created":
        return `${activity.firmName} added as ${activity.to}`;
      case "updated":
        return `${activity.firmName} updated`;
      case "stage_changed":
        return `${activity.firmName} moved from ${activity.from} to ${activity.to}`;
      default:
        return `${activity.firmName} activity`;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
        <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-700 border-t-teal-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Recent Activity</h2>
        <span className="text-sm text-gray-400">
          {activities.length} {activities.length === 1 ? "event" : "events"}
        </span>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {activities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No activity yet</p>
            <p className="text-sm mt-2">Add your first lead to get started</p>
          </div>
        ) : (
          activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`p-3 rounded-lg border ${getActivityColor(
                activity.action
              )}`}
            >
              <div className="flex items-start gap-3">
                <span className="text-xl">
                  {getActivityIcon(activity.action)}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">
                    {getActivityText(activity)}
                  </p>
                  {activity.note && (
                    <p className="text-xs mt-1 opacity-75">{activity.note}</p>
                  )}
                  <p className="text-xs mt-1 opacity-60">
                    {formatDistanceToNow(activity.timestamp, {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
