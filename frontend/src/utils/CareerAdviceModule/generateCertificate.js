import { jsPDF } from 'jspdf';

export const generateCertificate = ({ studentName, programTitle, category, instructor, completedDate }) => {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const W = 297;
  const H = 210;

  // Background - deep navy
  doc.setFillColor(10, 25, 60);
  doc.rect(0, 0, W, H, 'F');

  // Gold border outer
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(3);
  doc.rect(8, 8, W - 16, H - 16);

  // Gold border inner
  doc.setLineWidth(0.8);
  doc.rect(12, 12, W - 24, H - 24);

  // Gold top/bottom bars
  doc.setFillColor(212, 175, 55);
  doc.rect(8, 8, W - 16, 2, 'F');
  doc.rect(8, H - 10, W - 16, 2, 'F');

  // Blue left/right accent strips
  doc.setFillColor(26, 86, 219);
  doc.rect(8, 10, 6, H - 20, 'F');
  doc.rect(W - 14, 10, 6, H - 20, 'F');

  // Corner decorations
  [[20, 20], [W - 20, 20], [20, H - 20], [W - 20, H - 20]].forEach(([x, y]) => {
    doc.setDrawColor(212, 175, 55);
    doc.setLineWidth(1.2);
    doc.circle(x, y, 4, 'S');
    doc.setFillColor(212, 175, 55);
    doc.circle(x, y, 1.5, 'F');
  });

  // CareerPath branding
  doc.setFontSize(11);
  doc.setTextColor(212, 175, 55);
  doc.setFont('helvetica', 'bold');
  doc.text('CAREERPATH', W / 2, 28, { align: 'center' });

  doc.setFontSize(7);
  doc.setTextColor(150, 170, 220);
  doc.setFont('helvetica', 'normal');
  doc.text('Career Advice & Development Platform', W / 2, 34, { align: 'center' });

  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(0.4);
  doc.line(60, 38, W - 60, 38);

  // Certificate title
  doc.setFontSize(9);
  doc.setTextColor(150, 170, 220);
  doc.setFont('helvetica', 'normal');
  doc.setCharSpace(4);
  doc.text('CERTIFICATE OF COMPLETION', W / 2, 48, { align: 'center' });
  doc.setCharSpace(0);

  // Intro text
  doc.setFontSize(12);
  doc.setTextColor(200, 210, 240);
  doc.setFont('helvetica', 'italic');
  doc.text('This is to proudly certify that', W / 2, 62, { align: 'center' });

  // Student name - large
  doc.setFontSize(32);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text(studentName, W / 2, 82, { align: 'center' });

  // Underline name
  const nameWidth = doc.getTextWidth(studentName);
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(0.7);
  doc.line(W / 2 - nameWidth / 2, 85, W / 2 + nameWidth / 2, 85);

  // Completed text
  doc.setFontSize(11);
  doc.setTextColor(180, 200, 240);
  doc.setFont('helvetica', 'normal');
  doc.text('has successfully completed the leadership program', W / 2, 96, { align: 'center' });

  // Program title in gold
  doc.setFontSize(17);
  doc.setTextColor(212, 175, 55);
  doc.setFont('helvetica', 'bold');
  const titleLines = doc.splitTextToSize('"' + programTitle + '"', 200);
  doc.text(titleLines, W / 2, 110, { align: 'center' });

  // Category badge
  const badgeY = titleLines.length > 1 ? 126 : 122;
  doc.setFillColor(26, 86, 219);
  doc.roundedRect(W / 2 - 30, badgeY - 5, 60, 9, 4, 4, 'F');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'normal');
  doc.text(category.toUpperCase(), W / 2, badgeY + 1, { align: 'center' });

  // Bottom info section
  const infoY = H - 40;
  doc.setDrawColor(50, 70, 120);
  doc.setLineWidth(0.5);
  doc.line(40, infoY - 5, W - 40, infoY - 5);

  // Instructor
  doc.setFontSize(8);
  doc.setTextColor(130, 155, 200);
  doc.setFont('helvetica', 'normal');
  doc.text('INSTRUCTOR', 60, infoY + 2, { align: 'center' });
  doc.setFontSize(10);
  doc.setTextColor(220, 230, 255);
  doc.setFont('helvetica', 'bold');
  doc.text(instructor, 60, infoY + 9, { align: 'center' });

  // Date
  doc.setFontSize(8);
  doc.setTextColor(130, 155, 200);
  doc.setFont('helvetica', 'normal');
  doc.text('DATE OF COMPLETION', W / 2, infoY + 2, { align: 'center' });
  doc.setFontSize(10);
  doc.setTextColor(220, 230, 255);
  doc.setFont('helvetica', 'bold');
  doc.text(completedDate, W / 2, infoY + 9, { align: 'center' });

  // Certificate ID
  const certId = 'CP-' + Date.now().toString().slice(-8).toUpperCase();
  doc.setFontSize(8);
  doc.setTextColor(130, 155, 200);
  doc.setFont('helvetica', 'normal');
  doc.text('CERTIFICATE ID', W - 60, infoY + 2, { align: 'center' });
  doc.setFontSize(9);
  doc.setTextColor(212, 175, 55);
  doc.setFont('helvetica', 'bold');
  doc.text(certId, W - 60, infoY + 9, { align: 'center' });

  // Signature line
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(0.5);
  doc.line(W / 2 - 30, infoY + 14, W / 2 + 30, infoY + 14);
  doc.setFontSize(7);
  doc.setTextColor(130, 155, 200);
  doc.setFont('helvetica', 'italic');
  doc.text('Authorized Signature — CareerPath Platform', W / 2, infoY + 19, { align: 'center' });

  doc.save('CareerPath_Certificate_' + studentName.replace(/\s+/g, '_') + '.pdf');
};
