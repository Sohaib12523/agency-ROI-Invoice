import { useCalculatorStore } from "@/store/useCalculatorStore";
import { calculateROI } from "@/utils/calculations";
import { motion } from "motion/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { ArrowUpRight, DollarSign, Percent, TrendingUp } from "lucide-react";

export default function Results() {
  const store = useCalculatorStore();
  const results = calculateROI(
    store.clientRevenue,
    store.aov,
    store.currentConversion,
    store.estimatedImprovement,
    store.estimatedTrafficGrowth,
    store.projectDuration,
    store.agencyCost,
    store.isOptimistic,
  );

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val);
  const formatPercent = (val: number) =>
    new Intl.NumberFormat("en-US", {
      style: "percent",
      maximumFractionDigits: 1,
    }).format(val / 100);

  const chartData = [
    { name: "Current", revenue: store.clientRevenue },
    { name: "Projected", revenue: results.newRevenue },
  ];

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl flex flex-col h-full">
      <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
        <TrendingUp className="text-emerald-400" />
        Live Projections
      </h2>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-950/50 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <p className="text-sm font-medium text-slate-400 mb-2">
            Total Project Gain
          </p>
          <div className="text-3xl font-bold text-white flex items-baseline gap-2">
            {formatCurrency(results.totalGain)}
            <ArrowUpRight className="w-5 h-5 text-emerald-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-950/50 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <p className="text-sm font-medium text-slate-400 mb-2">
            Projected ROI
          </p>
          <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
            {formatPercent(results.roi)}
          </div>
        </motion.div>
      </div>

      <div className="flex-1 min-h-[250px] mb-8">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis
              dataKey="name"
              stroke="#64748b"
              tick={{ fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              stroke="#64748b"
              tick={{ fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(val) => `$${val / 1000}k`}
            />
            <Tooltip
              cursor={{ fill: "#1e293b" }}
              contentStyle={{
                backgroundColor: "#0f172a",
                border: "1px solid #1e293b",
                borderRadius: "12px",
                color: "#fff",
              }}
              formatter={(value: number) => [
                formatCurrency(value),
                "Monthly Revenue",
              ]}
            />
            <Bar dataKey="revenue" radius={[8, 8, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index === 0 ? "#334155" : "#4f46e5"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-indigo-300 mb-1">
              Recommended Pricing
            </p>
            <p className="text-xs text-slate-400 mb-3">
              Based on 20% of projected gain
            </p>
            <div className="text-2xl font-bold text-white">
              {formatCurrency(results.recommendedPricing)}{" "}
              <span className="text-sm font-normal text-slate-400">
                / project
              </span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-indigo-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
