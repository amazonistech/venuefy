import { indiaTime } from "./bookingDisplay";

const inr = (amount) =>
  "INR " +
  (Number(amount || 0) / 100).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export async function downloadBookingReceipt(receipt) {
  const { jsPDF } = await import("jspdf");
  const pdf = new jsPDF({ unit: "mm", format: "a4" });
  const margin = 19;
  const width = 172;
  let y = 44;

  function row(label, value) {
    const lines = pdf.splitTextToSize(String(value), 100);
    if (y + lines.length * 5 > 276) {
      pdf.addPage();
      y = 22;
    }
    pdf.setTextColor(81, 97, 118);
    pdf.text(label, margin, y);
    pdf.setTextColor(22, 44, 83);
    pdf.text(lines, margin + width, y, { align: "right" });
    y += Math.max(8, lines.length * 5 + 3);
  }

  pdf.setProperties({ title: "Venuefy booking payment receipt" });
  pdf.setFillColor(22, 44, 83);
  pdf.rect(0, 0, 210, 32, "F");
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(20);
  pdf.text("Venuefy", margin, 14);
  pdf.setFontSize(12);
  pdf.text("Booking payment receipt", margin, 23);
  pdf.setFontSize(10);
  row("Booking reference", receipt.booking);
  if (receipt.price?.packageName) row("Package", receipt.price.packageName);
  if (receipt.eventStartAt)
    row("Event start", indiaTime(receipt.eventStartAt) + " IST");
  if (receipt.eventEndAt)
    row("Event end", indiaTime(receipt.eventEndAt) + " IST");
  if (receipt.generatedAt)
    row("Generated", indiaTime(receipt.generatedAt) + " IST");
  if (receipt.price?.totalPaise != null)
    row("Total booking value", inr(receipt.price.totalPaise));
  y += 4;
  pdf.setDrawColor(214, 224, 236);
  pdf.line(margin, y - 5, margin + width, y - 5);

  const payments = (receipt.payments || []).filter(
    (payment) => payment.status === "captured",
  );
  let captured = 0;
  let refunded = 0;
  for (const payment of payments) {
    row("Razorpay payment", payment.paymentId || payment.orderId);
    row("Amount captured", inr(payment.amountPaise));
    if (payment.refundedPaise > 0) row("Refunded", inr(payment.refundedPaise));
    captured += payment.amountPaise || 0;
    refunded += payment.refundedPaise || 0;
    y += 2;
  }
  row("Net online payment received", inr(captured - refunded));
  pdf.save("venuefy-receipt-" + receipt.booking + ".pdf");
}
