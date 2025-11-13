"use client";

import { Lead } from "@/lib/types";
import {
  FunnelChart,
  Funnel,
  LabelList,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface FunnelVisualizationProps {
  leads: Lead[];
}

export default function FunnelVisualization({
  leads,
}: FunnelVisualizationProps) {
  // Calculate stage counts
  const stageCounts = {
    Suspect: leads.filter((l) => l.stage === "Suspect").length,
    Prospect: leads.filter((l) => l.stage === "Prospect").length,
    Opportunity: leads.filter((l) => l.stage === "Opportunity").length,
    Customer: leads.filter((l) => l.stage === "Customer").length,
  };

  const total = leads.length || 1; // Avoid division by zero

  const data = [
    {
      stage: "Suspects",
      value: stageCounts.Suspect,
      fill: "#5eead4", // teal-300
      percentage: Math.round((stageCounts.Suspect / total) * 100),
    },
    {
      stage: "Prospects",
      value: stageCounts.Prospect,
      fill: "#60a5fa", // blue-400
      percentage: Math.round((stageCounts.Prospect / total) * 100),
    },
    {
      stage: "Opportunities",
      value: stageCounts.Opportunity,
      fill: "#c084fc", // purple-400
      percentage: Math.round((stageCounts.Opportunity / total) * 100),
    },
    {
      stage: "Customers",
      value: stageCounts.Customer,
      fill: "#34d399", // green-400
      percentage: Math.round((stageCounts.Customer / total) * 100),
    },
  ];

  const CustomLabel = (props: unknown) => {
    const labelProps = props as {
      x?: number;
      y?: number;
      width?: number;
      value?: number;
      index?: number;
    };

    const x = labelProps.x ?? 0;
    const y = labelProps.y ?? 0;
    const width = labelProps.width ?? 0;
    const value = labelProps.value ?? 0;
    const index = labelProps.index ?? 0;

    // Safety check
    if (
      typeof x !== "number" ||
      typeof y !== "number" ||
      typeof width !== "number" ||
      isNaN(x) ||
      isNaN(y) ||
      isNaN(width)
    ) {
      return null;
    }

    const stage = data[index];
    if (!stage) return null;

    const centerX = x + width / 2;

    return (
      <text
        x={centerX}
        y={y + 20}
        fill="#fff"
        textAnchor="middle"
        dominantBaseline="middle"
        className="font-bold"
      >
        <tspan fontSize="16" fontWeight="700">
          {stage.stage}
        </tspan>
        <tspan x={centerX} dy="20" fontSize="24" fontWeight="900">
          {value}
        </tspan>
        <tspan x={centerX} dy="20" fontSize="14">
          ({stage.percentage}%)
        </tspan>
      </text>
    );
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
      <h2 className="text-xl font-bold text-white mb-6">Sales Funnel</h2>

      <div className="w-full h-[400px] min-h-[400px]">
        <ResponsiveContainer width="100%" height={400}>
          <FunnelChart width={600} height={400}>
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "1px solid #374151",
                borderRadius: "8px",
                color: "#fff",
              }}
              formatter={(value: number, name: string, props) => [
                `${value} leads (${props.payload.percentage}%)`,
                props.payload.stage,
              ]}
            />
            <Funnel dataKey="value" data={data} isAnimationActive={false}>
              <LabelList position="center" content={CustomLabel} />
            </Funnel>
          </FunnelChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-3 bg-gray-800/50 rounded-lg border border-gray-700">
          <div className="text-2xl font-bold text-teal-300">
            {stageCounts.Suspect}
          </div>
          <div className="text-xs text-gray-400 mt-1">Suspects</div>
        </div>
        <div className="text-center p-3 bg-gray-800/50 rounded-lg border border-gray-700">
          <div className="text-2xl font-bold text-blue-400">
            {stageCounts.Prospect}
          </div>
          <div className="text-xs text-gray-400 mt-1">Prospects</div>
        </div>
        <div className="text-center p-3 bg-gray-800/50 rounded-lg border border-gray-700">
          <div className="text-2xl font-bold text-purple-400">
            {stageCounts.Opportunity}
          </div>
          <div className="text-xs text-gray-400 mt-1">Opportunities</div>
        </div>
        <div className="text-center p-3 bg-gray-800/50 rounded-lg border border-gray-700">
          <div className="text-2xl font-bold text-green-400">
            {stageCounts.Customer}
          </div>
          <div className="text-xs text-gray-400 mt-1">Customers</div>
        </div>
      </div>
    </div>
  );
}
