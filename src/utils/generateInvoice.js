import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateInvoice = (order) => {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(22);
  doc.setTextColor(255, 193, 7);
  doc.text("BLACK HUB", 14, 20);

  doc.setFontSize(11);
  doc.setTextColor(120);

  doc.text(`Invoice #: ${order.id}`, 14, 30);
  doc.text(
    `Date: ${
      order.createdAt?.toDate
        ? order.createdAt.toDate().toLocaleDateString()
        : new Date().toLocaleDateString()
    }`,
    14,
    37
  );

  doc.text(`Customer: ${order.customerName || "Anonymous"}`, 14, 44);
  doc.text(`Email: ${order.email || "-"}`, 14, 51);

  autoTable(doc, {
    startY: 60,
    head: [["Product", "Qty", "Price", "Total"]],
    body:
      order.items?.map((item) => [
        item.title,
        item.quantity,
        `NGN ${item.price}`,
        `NGN ${item.quantity * item.price}`,
      ]) || [],
  });

  const finalY = doc.lastAutoTable.finalY + 15;

  doc.setFontSize(16);
  doc.setTextColor(0);

  doc.text(
    `Grand Total: NGN ${Number(order.total || 0).toLocaleString()}`,
    14,
    finalY
  );

  doc.save(`Invoice-${order.id}.pdf`);
};