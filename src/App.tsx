import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { motion } from "motion/react";
import Hero from "@/components/Hero";
import Calculator from "@/components/Calculator";
import Results from "@/components/Results";
import PitchGenerator from "@/components/PitchGenerator";
import ExportOptions from "@/components/ExportOptions";
import Navigation from "@/components/Navigation";
import InvoiceGenerator from "@/pages/InvoiceGenerator";

function MainApp() {
  return (
    <>
      <Hero />
      <main
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10"
        id="calculator"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5 xl:col-span-4"
          >
            <Calculator />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-7 xl:col-span-8 sticky top-24 space-y-8"
          >
            <Results />
            <PitchGenerator />
            <ExportOptions />
          </motion.div>
        </div>
      </main>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-indigo-500/30">
        <Navigation />
        <div className="pt-16">
          <Routes>
            <Route path="/" element={<MainApp />} />
            <Route path="/invoice" element={<InvoiceGenerator />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
