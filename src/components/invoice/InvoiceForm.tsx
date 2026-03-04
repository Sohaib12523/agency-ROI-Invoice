import { useInvoiceStore } from '@/store/useInvoiceStore';
import { Plus, Trash2, Wand2 } from 'lucide-react';
import { useState } from 'react';
import { GoogleGenAI } from '@google/genai';

export default function InvoiceForm() {
  const {
    seller,
    client,
    details,
    items,
    theme,
    updateSeller,
    updateClient,
    updateDetails,
    updateTheme,
    addItem,
    updateItem,
    removeItem,
  } = useInvoiceStore();

  const [isRefining, setIsRefining] = useState<string | null>(null);

  const handleRefine = async (id: string, text: string, type: 'description' | 'notes') => {
    if (!text) return;
    setIsRefining(id);
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not set.");
      }
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `Refine the following ${type} for a professional invoice. Make it sound corporate, clear, and professional. Fix any grammar issues. Return ONLY the refined text, nothing else.\n\nOriginal: "${text}"`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      const refinedText = response.text?.trim() || text;
      
      if (type === 'description') {
        updateItem(id, { description: refinedText });
      } else {
        updateDetails({ notes: refinedText });
      }
    } catch (error) {
      console.error('Failed to refine text:', error);
    } finally {
      setIsRefining(null);
    }
  };

  return (
    <div className="space-y-8 bg-slate-900/50 p-6 rounded-2xl border border-white/10">
      {/* Seller Details */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-sm">1</span>
          Your Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Company Name"
            value={seller.companyName}
            onChange={(e) => updateSeller({ companyName: e.target.value })}
            className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
          <input
            type="text"
            placeholder="Email"
            value={seller.email}
            onChange={(e) => updateSeller({ email: e.target.value })}
            className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
          <input
            type="text"
            placeholder="Address"
            value={seller.address}
            onChange={(e) => updateSeller({ address: e.target.value })}
            className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 md:col-span-2"
          />
        </div>
      </section>

      {/* Client Details */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-sm">2</span>
          Client Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Client Name"
            value={client.clientName}
            onChange={(e) => updateClient({ clientName: e.target.value })}
            className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
          <input
            type="text"
            placeholder="Company Name"
            value={client.companyName}
            onChange={(e) => updateClient({ companyName: e.target.value })}
            className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
          <input
            type="text"
            placeholder="Address"
            value={client.address}
            onChange={(e) => updateClient({ address: e.target.value })}
            className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 md:col-span-2"
          />
        </div>
      </section>

      {/* Invoice Details */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-sm">3</span>
          Invoice Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Invoice Number</label>
            <input
              type="text"
              value={details.invoiceNumber}
              onChange={(e) => updateDetails({ invoiceNumber: e.target.value })}
              className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Issue Date</label>
            <input
              type="date"
              value={details.issueDate}
              onChange={(e) => updateDetails({ issueDate: e.target.value })}
              className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Due Date</label>
            <input
              type="date"
              value={details.dueDate}
              onChange={(e) => updateDetails({ dueDate: e.target.value })}
              className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Currency</label>
            <select
              value={details.currency}
              onChange={(e) => updateDetails({ currency: e.target.value })}
              className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="CAD">CAD ($)</option>
              <option value="AUD">AUD ($)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Discount (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={details.discountRate}
              onChange={(e) => updateDetails({ discountRate: Number(e.target.value) })}
              className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Amount Paid</label>
            <input
              type="number"
              min="0"
              value={details.paidAmount}
              onChange={(e) => updateDetails({ paidAmount: Number(e.target.value) })}
              className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>
        </div>
      </section>

      {/* Line Items */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-sm">4</span>
            Line Items
          </h3>
          <button
            onClick={addItem}
            className="text-sm flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Item
          </button>
        </div>
        
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={item.id} className="p-4 bg-slate-950/50 border border-white/5 rounded-xl space-y-3 relative group">
              <div className="flex justify-between items-start gap-4">
                <input
                  type="text"
                  placeholder="Item Name"
                  value={item.name}
                  onChange={(e) => updateItem(item.id, { name: e.target.value })}
                  className="flex-1 bg-transparent border-b border-white/10 px-0 py-1 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 font-medium"
                />
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-slate-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <div className="relative">
                <textarea
                  placeholder="Description (e.g., website work and design fixing)"
                  value={item.description}
                  onChange={(e) => updateItem(item.id, { description: e.target.value })}
                  rows={2}
                  className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 resize-none pr-10"
                />
                <button
                  onClick={() => handleRefine(item.id, item.description, 'description')}
                  disabled={isRefining === item.id || !item.description}
                  className="absolute right-2 bottom-2 p-1.5 rounded-md bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Refine with AI"
                >
                  <Wand2 className={`w-4 h-4 ${isRefining === item.id ? 'animate-spin' : ''}`} />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-medium text-slate-500 uppercase tracking-wider mb-1">Qty</label>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, { quantity: Number(e.target.value) })}
                    className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-slate-500 uppercase tracking-wider mb-1">Price</label>
                  <input
                    type="number"
                    min="0"
                    value={item.unitPrice}
                    onChange={(e) => updateItem(item.id, { unitPrice: Number(e.target.value) })}
                    className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-slate-500 uppercase tracking-wider mb-1">Tax %</label>
                  <input
                    type="number"
                    min="0"
                    value={item.taxRate}
                    onChange={(e) => updateItem(item.id, { taxRate: Number(e.target.value) })}
                    className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* Notes & Terms */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-sm">5</span>
          Notes & Terms
        </h3>
        <div className="space-y-4">
          <div className="relative">
            <label className="block text-xs font-medium text-slate-400 mb-1">Notes</label>
            <textarea
              value={details.notes}
              onChange={(e) => updateDetails({ notes: e.target.value })}
              rows={3}
              className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none pr-10"
              placeholder="Thank you for your business..."
            />
            <button
              onClick={() => handleRefine('notes', details.notes, 'notes')}
              disabled={isRefining === 'notes' || !details.notes}
              className="absolute right-2 bottom-2 p-1.5 rounded-md bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Refine with AI"
            >
              <Wand2 className={`w-4 h-4 ${isRefining === 'notes' ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </section>

      {/* Theme & Branding */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-sm">6</span>
          Theme & Branding
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Background Color</label>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded border border-white/10 overflow-hidden shrink-0 relative">
                <input
                  type="color"
                  value={theme.backgroundColor}
                  onChange={(e) => updateTheme({ backgroundColor: e.target.value })}
                  className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer"
                />
              </div>
              <input
                type="text"
                value={theme.backgroundColor}
                onChange={(e) => updateTheme({ backgroundColor: e.target.value })}
                className="flex-1 bg-slate-950/50 border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Text Color</label>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded border border-white/10 overflow-hidden shrink-0 relative">
                <input
                  type="color"
                  value={theme.textColor}
                  onChange={(e) => updateTheme({ textColor: e.target.value })}
                  className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer"
                />
              </div>
              <input
                type="text"
                value={theme.textColor}
                onChange={(e) => updateTheme({ textColor: e.target.value })}
                className="flex-1 bg-slate-950/50 border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Accent Color</label>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded border border-white/10 overflow-hidden shrink-0 relative">
                <input
                  type="color"
                  value={theme.accentColor}
                  onChange={(e) => updateTheme({ accentColor: e.target.value })}
                  className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer"
                />
              </div>
              <input
                type="text"
                value={theme.accentColor}
                onChange={(e) => updateTheme({ accentColor: e.target.value })}
                className="flex-1 bg-slate-950/50 border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
