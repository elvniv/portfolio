// pdfUtils.js
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export const generatePdfFromHtml = async (htmlContent, fileName) => {
  const element = document.createElement('div');
  element.innerHTML = `
    <style>
      body {
        font-family: Arial, sans-serif;
        font-size: 12px;
        line-height: 1.5;
        margin: 20px;
      }
      h1 {
        font-size: 12px;
        margin-bottom: 20px;
      }
      p {
        margin-bottom: 10px;
      }
      .section {
        margin-bottom: 20px;
      }
    </style>
    <div class="section">
      ${htmlContent.replace(/\n/g, '<br>')}
    </div>
  `;
  document.body.appendChild(element);

  const canvas = await html2canvas(element, { scale: 1, scrollY: -window.scrollY });
  const imgData = canvas.toDataURL('image/png');

  const pdfWidth = 595.28; // A4 width in points
  const pdfHeight = 841.89; // A4 height in points
  const margin = 40; // Margin in points (approx. 1.4 cm)

  const pdf = new jsPDF({
    orientation: 'p',
    unit: 'pt',
    format: 'a4',
  });

  const contentWidth = pdfWidth - 2 * margin;
  const contentHeight = (canvas.height * contentWidth) / canvas.width;

  // Add content to the PDF
  let pageOffset = margin + 50;
  while (pageOffset < contentHeight + margin) {
    const pageHeight = Math.min(contentHeight + margin - pageOffset, pdfHeight - margin - 50);
    pdf.addImage(imgData, 'PNG', margin, pageOffset, contentWidth, pageHeight, undefined, 'FAST');
    pageOffset += pageHeight;
    if (pageOffset < contentHeight + margin) {
      pdf.addPage();
    }
  }

  const pdfBlob = pdf.output('blob');
  const url = URL.createObjectURL(pdfBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${fileName}-unsigned.pdf`;
  link.click();
  URL.revokeObjectURL(url);

  document.body.removeChild(element);
};