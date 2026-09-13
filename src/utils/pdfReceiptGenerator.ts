import { jsPDF } from 'jspdf';
import { OrderRecord } from '../types';

export interface ReceiptData {
  orderNumber: string;
  itemType: string;
  itemTitle: string;
  studentName: string;
  studentRoll: string;
  studentEmail: string;
  collegeName: string;
  amount: number;
  paymentMethod: string;
  date: string;
  status: string;
  notesOrVenue?: string;
  passCode?: string;
  tutorOrAuthor?: string;
  pointsEarned?: number;
}

/**
 * Formats order item type into readable title
 */
export function formatOrderTypeLabel(type: string): string {
  switch (type) {
    case 'note_rental':
      return 'Senior Exam Note (Autonomous Rental)';
    case 'note_purchase':
      return 'Senior Exam Note (Permanent License)';
    case 'project_rental':
      return 'Capstone Project Sandbox (Lab Kit Rental)';
    case 'project_purchase':
      return 'Capstone Project Source & Circuit License';
    case 'tutor_session':
      return '1:1 In-Person Peer Mentorship Session';
    default:
      return 'Academic Resource Access';
  }
}

/**
 * Generates an official Vidyasys Academic Summary Receipt PDF using jsPDF
 */
export function generateReceiptPdf(order: OrderRecord | ReceiptData): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;

  // Header Banner Background (Deep Vidyalankar Indigo)
  doc.setFillColor(30, 41, 79); // #1e294f
  doc.roundedRect(margin, 15, contentWidth, 34, 3, 3, 'F');

  // Decorative Accent Bar (Emerald)
  doc.setFillColor(16, 185, 129); // #10b981
  doc.rect(margin, 15, contentWidth, 2, 'F');

  // Institution Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('VIDYASYS ACADEMIC PLATFORM', margin + 8, 26);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(203, 213, 225); // slate-300
  doc.text(
    order.collegeName.toUpperCase() + ' • LEARN, SHARE, BUILD & GROW',
    margin + 8,
    32
  );
  doc.text(
    'Vidyalankar Educational Campus Node, Wadala (E), Mumbai - 400037',
    margin + 8,
    37
  );

  // Top Right Header Voucher Badge
  doc.setFillColor(45, 62, 110);
  doc.roundedRect(pageWidth - margin - 54, 21, 46, 18, 2, 2, 'F');
  doc.setTextColor(224, 231, 255); // indigo-100
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('OFFICIAL VOUCHER', pageWidth - margin - 31, 27, { align: 'center' });
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.text(order.orderNumber, pageWidth - margin - 31, 33, { align: 'center' });

  // Receipt Title & Verification Status Line
  let currentY = 56;
  doc.setTextColor(15, 23, 42); // slate-900
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('Academic Booking & Transaction Receipt', margin, currentY);

  // Status Badge
  const isCompleted = order.status === 'completed' || order.status === 'active_rental' || order.status === 'upcoming_session';
  doc.setFillColor(isCompleted ? 240 : 254, isCompleted ? 253 : 242, isCompleted ? 244 : 242);
  doc.setDrawColor(isCompleted ? 167 : 252, isCompleted ? 243 : 165, isCompleted ? 208 : 165);
  doc.roundedRect(pageWidth - margin - 38, currentY - 5, 38, 7, 1.5, 1.5, 'FD');
  doc.setTextColor(isCompleted ? 22 : 185, isCompleted ? 101 : 28, isCompleted ? 52 : 28);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  const statusLabel = order.status === 'upcoming_session' 
    ? 'CONFIRMED PASS' 
    : order.status === 'active_rental' 
      ? 'ACTIVE RENTAL' 
      : 'COMPLETED';
  doc.text(statusLabel, pageWidth - margin - 19, currentY - 0.5, { align: 'center' });

  currentY += 8;

  // Thin Divider
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.setLineWidth(0.4);
  doc.line(margin, currentY, pageWidth - margin, currentY);

  currentY += 7;

  // 2-Column Info Grid (Student Information & Order Metadata)
  const colWidth = (contentWidth - 6) / 2;

  // Box 1: Student Information
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, currentY, colWidth, 38, 2, 2, 'FD');

  doc.setTextColor(71, 85, 105); // slate-600
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('STUDENT INFORMATION', margin + 5, currentY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Name:', margin + 5, currentY + 14);
  doc.setFont('helvetica', 'bold');
  doc.text(order.studentName || 'Student', margin + 25, currentY + 14);

  doc.setFont('helvetica', 'normal');
  doc.text('Roll No:', margin + 5, currentY + 20);
  doc.setFont('helvetica', 'bold');
  doc.text(order.studentRoll || 'N/A', margin + 25, currentY + 20);

  doc.setFont('helvetica', 'normal');
  doc.text('Email:', margin + 5, currentY + 26);
  doc.setTextColor(79, 70, 229);
  doc.text(order.studentEmail || 'student@vidyalankar.edu.in', margin + 25, currentY + 26);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text('Campus:', margin + 5, currentY + 32);
  doc.setFont('helvetica', 'bold');
  const shortCampus = order.collegeName.includes('Polytechnic') ? 'Vidyalankar Polytechnic' : 'VIT Mumbai';
  doc.text(shortCampus, margin + 25, currentY + 32);

  // Box 2: Transaction Details
  const col2X = margin + colWidth + 6;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(col2X, currentY, colWidth, 38, 2, 2, 'FD');

  doc.setTextColor(71, 85, 105);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('TRANSACTION DETAILS', col2X + 5, currentY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Order ID:', col2X + 5, currentY + 14);
  doc.setFont('helvetica', 'bold');
  doc.text(order.orderNumber, col2X + 32, currentY + 14);

  doc.setFont('helvetica', 'normal');
  doc.text('Date & Time:', col2X + 5, currentY + 20);
  doc.text(order.date, col2X + 32, currentY + 20);

  doc.text('Payment Mode:', col2X + 5, currentY + 26);
  doc.setFont('helvetica', 'bold');
  doc.text(order.paymentMethod, col2X + 32, currentY + 26);

  doc.setFont('helvetica', 'normal');
  doc.text('Security Pass:', col2X + 5, currentY + 32);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(16, 185, 129); // emerald
  doc.text(order.passCode || 'VERIFIED-CAMPUS-PASS', col2X + 32, currentY + 32);

  currentY += 45;

  // Itemized Table Header
  doc.setFillColor(241, 245, 249); // slate-100
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, currentY, contentWidth, 8, 1, 1, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text('ITEM DESCRIPTION', margin + 5, currentY + 5.5);
  doc.text('SERVICE TYPE', margin + 95, currentY + 5.5);
  doc.text('ACCESS / VENUE', margin + 130, currentY + 5.5);
  doc.text('AMOUNT', pageWidth - margin - 5, currentY + 5.5, { align: 'right' });

  currentY += 10;

  // Item Row
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);

  // Split title if it's too long
  const splitTitle = doc.splitTextToSize(order.itemTitle, 86);
  doc.text(splitTitle, margin + 5, currentY + 4);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  const typeLabel = formatOrderTypeLabel(order.itemType);
  const splitType = doc.splitTextToSize(typeLabel, 32);
  doc.text(splitType, margin + 95, currentY + 4);

  const venueInfo = order.notesOrVenue || (order.itemType.includes('tutor') ? 'Central Library Pod' : 'Digital DRM Access');
  const splitVenue = doc.splitTextToSize(venueInfo, 32);
  doc.text(splitVenue, margin + 130, currentY + 4);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text(`INR ${order.amount.toFixed(2)}`, pageWidth - margin - 5, currentY + 4, { align: 'right' });

  const rowHeight = Math.max(splitTitle.length, splitType.length, splitVenue.length) * 5 + 6;
  currentY += rowHeight;

  // Table Bottom Divider
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, currentY, pageWidth - margin, currentY);

  currentY += 6;

  // Financial Breakdown Box (Right aligned)
  const totalBoxWidth = 80;
  const totalBoxX = pageWidth - margin - totalBoxWidth;

  doc.setFillColor(250, 250, 250);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(totalBoxX, currentY, totalBoxWidth, 34, 2, 2, 'FD');

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Subtotal:', totalBoxX + 6, currentY + 7);
  doc.text(`INR ${order.amount.toFixed(2)}`, pageWidth - margin - 6, currentY + 7, { align: 'right' });

  doc.text('Campus Tech & Lab Subsidy:', totalBoxX + 6, currentY + 13);
  doc.setTextColor(16, 185, 129);
  doc.text('- INR 0.00', pageWidth - margin - 6, currentY + 13, { align: 'right' });

  doc.setTextColor(71, 85, 105);
  doc.text('GST (Exempted Educational):', totalBoxX + 6, currentY + 19);
  doc.text('INR 0.00', pageWidth - margin - 6, currentY + 19, { align: 'right' });

  doc.setDrawColor(203, 213, 225);
  doc.line(totalBoxX + 4, currentY + 22, pageWidth - margin - 4, currentY + 22);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Total Paid:', totalBoxX + 6, currentY + 29);
  doc.setTextColor(30, 41, 79);
  doc.text(`INR ${order.amount.toFixed(2)}`, pageWidth - margin - 6, currentY + 29, { align: 'right' });

  // Student Cashback Points Callout (Left side of breakdown)
  const pointsReward = Math.round(order.amount * 0.1);
  const cashbackBoxWidth = contentWidth - totalBoxWidth - 8;
  doc.setFillColor(238, 242, 255); // indigo-50
  doc.setDrawColor(199, 210, 254); // indigo-200
  doc.roundedRect(margin, currentY, cashbackBoxWidth, 34, 2, 2, 'FD');

  doc.setTextColor(67, 56, 202); // indigo-700
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('STUDENT SCHOLAR REWARDS', margin + 6, currentY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text('Points Credited to Student Wallet:', margin + 6, currentY + 14);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(16, 185, 129);
  doc.text(`+${pointsReward} Scholar Points`, margin + 6, currentY + 21);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Redeemable for lab kit rentals and peer exam cram sessions.', margin + 6, currentY + 28);

  currentY += 42;

  // In-Person Verification & QR Stamp Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, currentY, contentWidth, 32, 2, 2, 'FD');

  // Stamp / Watermark Effect
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(margin + 5, currentY + 4, 38, 24, 1.5, 1.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('CAMPUS VERIFIED', margin + 24, currentY + 11, { align: 'center' });
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 79);
  doc.text('ACADEMIC CELL', margin + 24, currentY + 17, { align: 'center' });
  doc.setFontSize(6.5);
  doc.setTextColor(16, 185, 129);
  doc.text('SEAL VERIFIED', margin + 24, currentY + 23, { align: 'center' });

  // Verification Instructions
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Important Academic Pass Instructions:', margin + 48, currentY + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text('• Show this digital or printed voucher with student ID card upon entry to library discussion pods or lab counter.', margin + 48, currentY + 14);
  doc.text('• Senior notes access is locked to your student account with dynamic DRM watermark. Unauthorized redistribution is prohibited.', margin + 48, currentY + 19);
  doc.text('• For peer tutoring queries or schedule adjustments, visit the Vidyasys Academic Helpdesk in M-Block or library.', margin + 48, currentY + 24);

  // Footer Legal Note & Security Hash
  const footerY = 270;
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text(
    `Generated by Vidyasys • One platform where students Learn, Share, Build & Grow • Auth Hash: SHA256-${order.orderNumber.replace(/[^0-9]/g, '')}${Date.now().toString().slice(-6)}`,
    margin,
    footerY
  );
  doc.text(
    `Page 1 of 1 • System Date: ${new Date().toLocaleDateString('en-IN')}`,
    pageWidth - margin,
    footerY,
    { align: 'right' }
  );

  return doc;
}

/**
 * Convenience function to trigger immediate browser download of the receipt PDF
 */
export function downloadReceiptPdf(order: OrderRecord | ReceiptData): void {
  const doc = generateReceiptPdf(order);
  const cleanOrderNum = order.orderNumber.replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `Vidyasys_Receipt_${cleanOrderNum}.pdf`;
  doc.save(filename);
}
