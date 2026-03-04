import { useState } from "react";
import { useCalculatorStore } from "@/store/useCalculatorStore";
import { calculateROI } from "@/utils/calculations";
import { motion } from "motion/react";
import { Sparkles, Copy, CheckCircle2, RefreshCw } from "lucide-react";
import { GoogleGenAI } from "@google/genai";

export default function PitchGenerator() {
  const store = useCalculatorStore();
  const [pitch, setPitch] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

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

  const generatePitch = async () => {
    setIsGenerating(true);
    setPitch("");
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not set.");
      }

      const ai = new GoogleGenAI({ apiKey });

      const prompt = `
        You are a senior SaaS product architect and financial modeling specialist writing a pitch for a marketing agency to send to their client.
        
        Here are the financial projections based on our proposed services:
        - Current Monthly Revenue: ${formatCurrency(store.clientRevenue)}
        - Projected New Monthly Revenue: ${formatCurrency(results.newRevenue)}
        - Monthly Revenue Increase: ${formatCurrency(results.monthlyRevenueIncrease)}
        - Project Duration: ${store.projectDuration} months
        - Total Projected Gain over ${store.projectDuration} months: ${formatCurrency(results.totalGain)}
        - Agency Service Cost (Total over ${store.projectDuration} months): ${formatCurrency(results.totalServiceCost)}
        - Projected ROI: ${formatPercent(results.roi)}
        
        Write a persuasive, professional, and confident pitch summary to the client. 
        Include:
        1. A strong opening statement.
        2. A clear financial breakdown explanation.
        3. A value justification paragraph (why the agency cost is an investment, not an expense).
        4. A closing pitch CTA.
        
        Keep the tone professional, confident, and data-backed. Use markdown for formatting (bolding key numbers). Do not include any placeholder brackets like [Client Name], just write it as a general but direct pitch.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      setPitch(response.text || "Failed to generate pitch.");
    } catch (error) {
      console.error("Error generating pitch:", error);
      setPitch(
        "An error occurred while generating the pitch. Please try again.",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(pitch);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl mt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <Sparkles className="text-indigo-400" />
          AI Pitch Generator
        </h2>
        <button
          onClick={generatePitch}
          disabled={isGenerating}
          className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 disabled:cursor-not-allowed text-white font-medium flex items-center gap-2 transition-all shadow-[0_0_20px_-5px_rgba(79,70,229,0.5)]"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              {pitch ? "Regenerate Pitch" : "Generate Pitch"}
            </>
          )}
        </button>
      </div>

      <div className="relative min-h-[200px] bg-slate-950/50 border border-slate-800 rounded-2xl p-6">
        {!pitch && !isGenerating && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
            <Sparkles className="w-8 h-8 mb-3 opacity-50" />
            <p>Click generate to create a data-backed pitch summary.</p>
          </div>
        )}

        {isGenerating && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-indigo-400">
            <RefreshCw className="w-8 h-8 mb-3 animate-spin" />
            <p className="animate-pulse">Crafting your perfect pitch...</p>
          </div>
        )}

        {pitch && !isGenerating && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="prose prose-invert prose-indigo max-w-none"
          >
            <div className="whitespace-pre-wrap text-slate-300 leading-relaxed">
              {pitch}
            </div>

            <div className="absolute top-4 right-4">
              <button
                onClick={copyToClipboard}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-2"
                title="Copy to clipboard"
              >
                {isCopied ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
