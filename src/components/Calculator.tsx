import { useCalculatorStore } from "@/store/useCalculatorStore";
import { motion } from "motion/react";
import {
  DollarSign,
  Percent,
  TrendingUp,
  Clock,
  Users,
  Activity,
} from "lucide-react";

export default function Calculator() {
  const store = useCalculatorStore();

  const inputs = [
    {
      id: "clientRevenue",
      label: "Client Monthly Revenue",
      icon: DollarSign,
      value: store.clientRevenue,
      setter: store.setClientRevenue,
      type: "number",
      prefix: "$",
    },
    {
      id: "aov",
      label: "Average Order Value (AOV)",
      icon: DollarSign,
      value: store.aov,
      setter: store.setAov,
      type: "number",
      prefix: "$",
    },
    {
      id: "currentConversion",
      label: "Current Conversion Rate",
      icon: Percent,
      value: store.currentConversion,
      setter: store.setCurrentConversion,
      type: "number",
      suffix: "%",
    },
    {
      id: "estimatedImprovement",
      label: "Est. Conversion Improvement",
      icon: TrendingUp,
      value: store.estimatedImprovement,
      setter: store.setEstimatedImprovement,
      type: "number",
      suffix: "%",
    },
    {
      id: "estimatedTrafficGrowth",
      label: "Est. Traffic Growth",
      icon: Users,
      value: store.estimatedTrafficGrowth,
      setter: store.setEstimatedTrafficGrowth,
      type: "number",
      suffix: "%",
    },
    {
      id: "projectDuration",
      label: "Project Duration (Months)",
      icon: Clock,
      value: store.projectDuration,
      setter: store.setProjectDuration,
      type: "number",
    },
    {
      id: "agencyCost",
      label: "Agency Service Cost (Monthly)",
      icon: Activity,
      value: store.agencyCost,
      setter: store.setAgencyCost,
      type: "number",
      prefix: "$",
    },
  ];

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-white">Business Inputs</h2>
        <div className="flex items-center gap-2 bg-slate-800/50 p-1 rounded-lg border border-slate-700">
          <button
            onClick={() => store.setIsOptimistic(false)}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${!store.isOptimistic ? "bg-slate-700 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"}`}
          >
            Conservative
          </button>
          <button
            onClick={() => store.setIsOptimistic(true)}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${store.isOptimistic ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"}`}
          >
            Optimistic
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {inputs.map((input, index) => (
          <motion.div
            key={input.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group"
          >
            <label
              htmlFor={input.id}
              className="block text-sm font-medium text-slate-400 mb-2 group-focus-within:text-indigo-400 transition-colors"
            >
              {input.label}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <input.icon className="h-5 w-5 text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
              </div>
              <input
                type={input.type}
                id={input.id}
                value={input.value}
                onChange={(e) => input.setter(Number(e.target.value))}
                className="block w-full pl-10 pr-12 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
              {input.prefix && (
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <span className="text-slate-500 font-medium">
                    {input.prefix}
                  </span>
                </div>
              )}
              {input.suffix && (
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <span className="text-slate-500 font-medium">
                    {input.suffix}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
