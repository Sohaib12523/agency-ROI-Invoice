import { useInvoiceStore } from '@/store/useInvoiceStore';
import { motion } from 'motion/react';
import { Download, FileText, Printer, Trash2 } from 'lucide-react';
import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function InvoicePreview() {
  const { seller, client, details, items, theme } = useInvoiceStore();
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const totalTax = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice * (item.taxRate / 100)), 0);
  const discountAmount = subtotal * (details.discountRate / 100);
  const grandTotal = subtotal + totalTax - discountAmount;
  const dueAmount = grandTotal - details.paidAmount;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: details.currency || 'USD',
    }).format(amount);
  };

  const handleDownloadPDF = async () => {
    if (!invoiceRef.current) return;
    
    try {
      setIsGenerating(true);
      const element = invoiceRef.current;
      
      // Wait a bit for any fonts/images to load
      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(element, {
        backgroundColor: theme.backgroundColor,
        scale: 2,
        useCORS: true,
        logging: false,
        windowWidth: 1024,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.querySelector('[data-invoice-container="true"]') as HTMLElement;
          if (clonedElement) {
            clonedElement.style.width = '794px';
            clonedElement.style.maxWidth = '794px';
            clonedElement.style.padding = '48px'; // Match md:p-12
            clonedElement.style.margin = '0';
            clonedElement.style.transform = 'none';
            
            // Ensure the parent container doesn't restrict the width
            const parent = clonedElement.parentElement;
            if (parent) {
              parent.style.width = 'auto';
              parent.style.minWidth = '794px';
              parent.style.padding = '0';
              parent.style.margin = '0';
              parent.style.display = 'block';
            }
          }
        }
      });
      
      const dataUrl = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      // Calculate how many pages we need
      const pageHeightInPixels = (pdfHeight * imgWidth) / pdfWidth;
      let heightLeft = imgHeight;
      let position = 0;

      // Fill background for the first page to prevent white space
      pdf.setFillColor(theme.backgroundColor || '#ffffff');
      pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');

      pdf.addImage(dataUrl, 'PNG', 0, position, pdfWidth, (imgHeight * pdfWidth) / imgWidth);
      heightLeft -= pageHeightInPixels;

      while (heightLeft > 1) {
        position -= pdfHeight;
        pdf.addPage();
        // Fill background for subsequent pages
        pdf.setFillColor(theme.backgroundColor || '#ffffff');
        pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');
        pdf.addImage(dataUrl, 'PNG', 0, position, pdfWidth, (imgHeight * pdfWidth) / imgWidth);
        heightLeft -= pageHeightInPixels;
      }
      
      pdf.save(`${details.invoiceNumber || 'Invoice'}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 flex flex-col h-full">
      <div className="flex items-center justify-between bg-slate-900/50 p-4 rounded-xl border border-white/10 shrink-0">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-400" />
          Live Preview
        </h2>
        <div className="flex gap-2">
          <button
            onClick={useInvoiceStore.getState().resetInvoice}
            className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-red-400 hover:bg-slate-700 transition-colors"
            title="Reset Invoice"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={handlePrint}
            className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            title="Print"
          >
            <Printer className="w-4 h-4" />
          </button>
          <button
            onClick={handleDownloadPDF}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition-colors text-sm font-medium shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            {isGenerating ? 'Generating...' : 'Download PDF'}
          </button>
        </div>
      </div>

      <div className="flex-1 bg-slate-900/30 rounded-xl border border-white/10 overflow-auto custom-scrollbar py-4 md:py-8">
        <div className="w-full px-[40px] flex justify-center">
          <div 
            ref={invoiceRef}
            data-invoice-container="true"
            className="p-8 md:p-12 min-h-[1123px] w-full box-border bg-white shadow-2xl print:shadow-none shrink-0 relative"
            style={{ backgroundColor: theme.backgroundColor, color: theme.textColor, fontFamily: '"Inter", sans-serif' }}
          >
          {/* Header */}
          <div className="flex justify-between items-start mb-12">
            <div>
              {seller.logoUrl ? (
                <img src={seller.logoUrl} alt="Logo" className="h-16 object-contain mb-4" />
              ) : (
                <div className="text-3xl font-bold mb-4 tracking-tight" style={{ color: theme.textColor }}>
                  {seller.companyName || 'Your Company'}
                </div>
              )}
              <div className="text-sm space-y-1" style={{ color: theme.textColor, opacity: 0.7 }}>
                <p>{seller.address}</p>
                <p>{seller.email}</p>
                <p>{seller.phone}</p>
                {seller.taxId && <p>Tax ID: {seller.taxId}</p>}
              </div>
            </div>
            <div className="text-right">
              <h1 className="text-4xl font-light mb-4 uppercase tracking-widest" style={{ color: theme.textColor, opacity: 0.5 }}>Invoice</h1>
              <div className="text-sm space-y-2">
                <div className="flex justify-end gap-4">
                  <span className="w-24 text-right" style={{ color: theme.textColor, opacity: 0.7 }}>Invoice No:</span>
                  <span className="font-medium w-32 text-left" style={{ color: theme.textColor }}>{details.invoiceNumber}</span>
                </div>
                <div className="flex justify-end gap-4">
                  <span className="w-24 text-right" style={{ color: theme.textColor, opacity: 0.7 }}>Issue Date:</span>
                  <span className="font-medium w-32 text-left" style={{ color: theme.textColor }}>{details.issueDate}</span>
                </div>
                <div className="flex justify-end gap-4">
                  <span className="w-24 text-right" style={{ color: theme.textColor, opacity: 0.7 }}>Due Date:</span>
                  <span className="font-medium w-32 text-left" style={{ color: theme.textColor }}>{details.dueDate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bill To */}
          <div className="mb-12">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: theme.accentColor }}>Bill To</h3>
            <div className="text-sm space-y-1" style={{ color: theme.textColor, opacity: 0.8 }}>
              <p className="font-semibold text-lg" style={{ color: theme.textColor }}>{client.clientName || 'Client Name'}</p>
              <p>{client.companyName}</p>
              <p>{client.address}</p>
              <p>{client.email}</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-12">
            <table className="w-full text-sm text-left table-fixed">
              <thead>
                <tr className="border-b-2" style={{ borderColor: theme.accentColor, color: theme.textColor, opacity: 0.8 }}>
                  <th className="pb-3 font-semibold w-1/2">Description</th>
                  <th className="pb-3 font-semibold text-right w-1/12">Qty</th>
                  <th className="pb-3 font-semibold text-right w-1/6">Price</th>
                  <th className="pb-3 font-semibold text-right w-1/12">Tax</th>
                  <th className="pb-3 font-semibold text-right w-1/6">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: `${theme.textColor}20` }}>
                {items.map((item) => (
                  <tr key={item.id} style={{ borderColor: `${theme.textColor}20` }}>
                    <td className="py-4 pr-4">
                      <p className="font-medium" style={{ color: theme.textColor }}>{item.name || 'Item Name'}</p>
                      {item.description && (
                        <p className="mt-1 text-xs leading-relaxed" style={{ color: theme.textColor, opacity: 0.7 }}>{item.description}</p>
                      )}
                    </td>
                    <td className="py-4 text-right" style={{ color: theme.textColor, opacity: 0.9 }}>{item.quantity}</td>
                    <td className="py-4 text-right" style={{ color: theme.textColor, opacity: 0.9 }}>{formatCurrency(item.unitPrice)}</td>
                    <td className="py-4 text-right" style={{ color: theme.textColor, opacity: 0.9 }}>{item.taxRate}%</td>
                    <td className="py-4 text-right font-medium" style={{ color: theme.textColor }}>
                      {formatCurrency(item.quantity * item.unitPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-12">
            <div className="w-full max-w-sm space-y-3 text-sm">
              <div className="flex justify-between" style={{ color: theme.textColor, opacity: 0.8 }}>
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {totalTax > 0 && (
                <div className="flex justify-between" style={{ color: theme.textColor, opacity: 0.8 }}>
                  <span>Tax</span>
                  <span>{formatCurrency(totalTax)}</span>
                </div>
              )}
              {discountAmount > 0 && (
                <div className="flex justify-between" style={{ color: theme.textColor, opacity: 0.8 }}>
                  <span>Discount ({details.discountRate}%)</span>
                  <span style={{ color: theme.accentColor }}>-{formatCurrency(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold pt-3 border-t" style={{ borderColor: `${theme.textColor}20`, color: theme.textColor }}>
                <span>Total</span>
                <span>{formatCurrency(grandTotal)}</span>
              </div>
              {details.paidAmount > 0 && (
                <div className="flex justify-between pt-2" style={{ color: theme.textColor, opacity: 0.8 }}>
                  <span>Amount Paid</span>
                  <span>{formatCurrency(details.paidAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-semibold pt-2 border-t" style={{ borderColor: `${theme.textColor}20`, color: theme.accentColor }}>
                <span>Amount Due</span>
                <span>{formatCurrency(dueAmount)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {details.notes && (
            <div className="pt-8 border-t" style={{ borderColor: `${theme.textColor}20` }}>
              <h3 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: theme.accentColor }}>Notes</h3>
              <p className="text-sm whitespace-pre-wrap" style={{ color: theme.textColor, opacity: 0.8 }}>{details.notes}</p>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}
