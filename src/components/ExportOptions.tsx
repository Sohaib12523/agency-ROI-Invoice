import { useCalculatorStore } from "@/store/useCalculatorStore";
import { calculateROI } from "@/utils/calculations";
import { motion } from "motion/react";
import { Download, Link as LinkIcon, FileText } from "lucide-react";
import jsPDF from "jspdf";
import domtoimage from "dom-to-image-more";

export default function ExportOptions() {
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

  const handleDownloadPDF = async () => {
    const element = document.getElementById("report-content");
    if (!element) return;

    try {
      const scale = 2;
      const dataUrl = await domtoimage.toPng(element, {
        bgcolor: "#0f172a",
        width: element.clientWidth * scale,
        height: element.clientHeight * scale,
        style: {
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          width: `${element.clientWidth}px`,
          height: `${element.clientHeight}px`
        }
      });
      
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (element.clientHeight * pdfWidth) / element.clientWidth;

      pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("AgencyROI_Pro_Report.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  const handleCopyLink = () => {
    // In a real app, this would generate a unique shareable link
    const dummyLink = "https://agencyroipro.com/report/1a2b3c4d";
    navigator.clipboard.writeText(dummyLink);
    alert("Shareable link copied to clipboard!");
  };

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl mt-8">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
        <FileText className="text-cyan-400" />
        Export & Share
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={handleDownloadPDF}
          className="flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium border border-slate-700 transition-all group"
        >
          <Download className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
          Download PDF Report
        </button>

        <button
          onClick={handleCopyLink}
          className="flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium border border-slate-700 transition-all group"
        >
          <LinkIcon className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
          Copy Shareable Link
        </button>
      </div>

      {/* Hidden content for PDF generation */}
      <div
        id="report-content"
        className="absolute left-[-9999px] top-0 w-[800px] bg-slate-900 p-12 text-white font-sans"
      >
        <div className="mb-8 border-b border-slate-800 pb-6">
          <h1 className="text-4xl font-bold text-white mb-2">
            AgencyROI Pro Report
          </h1>
          <p className="text-slate-400">Projected Financial Impact Analysis</p>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-12">
          <div>
            <h3 className="text-lg font-semibold text-slate-300 mb-4">
              Current Metrics
            </h3>
            <ul className="space-y-2 text-slate-400">
              <li>
                Monthly Revenue:{" "}
                <span className="text-white font-medium">
                  {formatCurrency(store.clientRevenue)}
                </span>
              </li>
              <li>
                Average Order Value:{" "}
                <span className="text-white font-medium">
                  {formatCurrency(store.aov)}
                </span>
              </li>
              <li>
                Conversion Rate:{" "}
                <span className="text-white font-medium">
                  {store.currentConversion}%
                </span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-300 mb-4">
              Projected Metrics
            </h3>
            <ul className="space-y-2 text-slate-400">
              <li>
                New Monthly Revenue:{" "}
                <span className="text-emerald-400 font-medium">
                  {formatCurrency(results.newRevenue)}
                </span>
              </li>
              <li>
                Monthly Increase:{" "}
                <span className="text-emerald-400 font-medium">
                  {formatCurrency(results.monthlyRevenueIncrease)}
                </span>
              </li>
              <li>
                Project Duration:{" "}
                <span className="text-white font-medium">
                  {store.projectDuration} Months
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-slate-800 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Financial Summary
          </h2>
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-slate-400 mb-2">Total Project Gain</p>
              <p className="text-3xl font-bold text-emerald-400">
                {formatCurrency(results.totalGain)}
              </p>
            </div>
            <div>
              <p className="text-slate-400 mb-2">Agency Service Cost</p>
              <p className="text-3xl font-bold text-slate-300">
                {formatCurrency(results.totalServiceCost)}
              </p>
            </div>
            <div>
              <p className="text-slate-400 mb-2">Projected ROI</p>
              <p className="text-3xl font-bold text-indigo-400">
                {formatPercent(results.roi)}
              </p>
            </div>
          </div>
        </div>

        <div className="text-center text-slate-500 text-sm mt-12 pt-8 border-t border-slate-800">
          Generated by AgencyROI Pro - {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}
