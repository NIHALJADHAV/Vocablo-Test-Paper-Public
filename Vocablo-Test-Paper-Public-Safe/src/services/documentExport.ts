import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle } from 'docx';
import jsPDF from 'jspdf';
import { TestPaper, GeneratedQuestion, PaperSection } from '../types';

// Helper to sanitize filenames
export function sanitizeFilename(str: string): string {
  return str.replace(/[^a-zA-Z0-9_-]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
}

export function generatePaperFilename(paper: TestPaper, suffix: string, ext: 'docx' | 'pdf'): string {
  const parts = [
    sanitizeFilename(paper.schoolName || 'School'),
    `Class_${paper.grade}`,
    sanitizeFilename(paper.subject),
    sanitizeFilename(paper.examName || 'Exam')
  ];
  if (suffix) parts.push(suffix);
  return `${parts.join('_')}.${ext}`;
}

// Download blob helper
function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}

// ----------------------------------------------------
// DOCX GENERATION ENGINE
// ----------------------------------------------------
export async function exportPaperToDocx(paper: TestPaper, isAnswerKeyOnly = false): Promise<void> {
  const children: any[] = [];

  // Header - School Name
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 },
      children: [
        new TextRun({
          text: (paper.schoolName || 'EXAMINATION PAPER').toUpperCase(),
          bold: true,
          size: 32, // 16pt
          font: 'Times New Roman'
        })
      ]
    })
  );

  if (paper.schoolAddress) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 },
        children: [
          new TextRun({
            text: paper.schoolAddress,
            size: 20, // 10pt
            italics: true,
            font: 'Times New Roman'
          })
        ]
      })
    );
  }

  // Exam Title
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 160 },
      children: [
        new TextRun({
          text: isAnswerKeyOnly
            ? `${(paper.examName || 'ACADEMIC ASSESSMENT').toUpperCase()} — COMPLETE ANSWER KEY & MARKING RUBRIC`
            : (paper.examName || 'ACADEMIC ASSESSMENT').toUpperCase(),
          bold: true,
          size: 24, // 12pt
          font: 'Times New Roman'
        })
      ]
    })
  );

  // Metadata Table (Class, Subject, Duration, Max Marks)
  const metaTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 4, color: '888888' },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE }
            },
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: 'CLASS: ', bold: true, font: 'Times New Roman' }),
                  new TextRun({ text: paper.grade, font: 'Times New Roman' }),
                  new TextRun({ text: '    |    SUBJECT: ', bold: true, font: 'Times New Roman' }),
                  new TextRun({ text: paper.subject, font: 'Times New Roman' })
                ]
              })
            ]
          }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 4, color: '888888' },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE }
            },
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({ text: 'TIME: ', bold: true, font: 'Times New Roman' }),
                  new TextRun({ text: paper.duration || '1 Hour', font: 'Times New Roman' }),
                  new TextRun({ text: '    |    MAX. MARKS: ', bold: true, font: 'Times New Roman' }),
                  new TextRun({ text: String(paper.maximumMarks), bold: true, font: 'Times New Roman' })
                ]
              })
            ]
          })
        ]
      }),
      new TableRow({
        children: [
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.SINGLE, size: 4, color: '888888' },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE }
            },
            children: [
              new Paragraph({
                spacing: { after: 120 },
                children: [
                  new TextRun({ text: 'DATE: ', bold: true, font: 'Times New Roman' }),
                  new TextRun({ text: paper.date || '____________', font: 'Times New Roman' })
                ]
              })
            ]
          }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.SINGLE, size: 4, color: '888888' },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE }
            },
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                spacing: { after: 120 },
                children: [
                  new TextRun({ text: 'NAME: ________________________   ROLL NO: _______', font: 'Times New Roman' })
                ]
              })
            ]
          })
        ]
      })
    ]
  });

  children.push(metaTable);

  // General Instructions
  if (!isAnswerKeyOnly && paper.generalInstructions && paper.generalInstructions.length > 0) {
    children.push(
      new Paragraph({
        spacing: { before: 160, after: 80 },
        children: [
          new TextRun({ text: 'General Instructions:', bold: true, size: 22, font: 'Times New Roman' })
        ]
      })
    );

    paper.generalInstructions.forEach((inst, i) => {
      children.push(
        new Paragraph({
          spacing: { after: 40 },
          indent: { left: 360 },
          children: [
            new TextRun({ text: `${i + 1}. `, bold: true, font: 'Times New Roman' }),
            new TextRun({ text: inst, font: 'Times New Roman' })
          ]
        })
      );
    });
  }

  children.push(new Paragraph({ spacing: { after: 160 } }));

  // Render Sections & Questions
  paper.sections.forEach(section => {
    // Section Header
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 240, after: 60 },
        children: [
          new TextRun({
            text: section.title.toUpperCase(),
            bold: true,
            size: 24,
            font: 'Times New Roman'
          }),
          new TextRun({
            text: `  [${section.totalMarks} Marks]`,
            bold: true,
            size: 22,
            font: 'Times New Roman'
          })
        ]
      })
    );

    if (section.instructions) {
      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 140 },
          children: [
            new TextRun({
              text: section.instructions,
              italics: true,
              size: 20,
              font: 'Times New Roman'
            })
          ]
        })
      );
    }

    // Questions
    section.questions.forEach(q => {
      // Question Line
      children.push(
        new Paragraph({
          spacing: { before: 100, after: 60 },
          indent: { left: 240 },
          children: [
            new TextRun({
              text: `${q.number}.  `,
              bold: true,
              font: 'Times New Roman'
            }),
            new TextRun({
              text: q.question,
              font: 'Times New Roman'
            }),
            new TextRun({
              text: `   [${q.marks}]`,
              bold: true,
              font: 'Times New Roman'
            })
          ]
        })
      );

      // Options for MCQ
      if (q.questionType === 'MCQ' && q.options && q.options.length > 0) {
        q.options.forEach(opt => {
          children.push(
            new Paragraph({
              indent: { left: 720 },
              spacing: { after: 40 },
              children: [
                new TextRun({
                  text: opt,
                  font: 'Times New Roman'
                })
              ]
            })
          );
        });
      }

      // If Answer Key mode, render the answer and marking points directly below
      if (isAnswerKeyOnly) {
        children.push(
          new Paragraph({
            indent: { left: 720 },
            spacing: { before: 40, after: 40 },
            children: [
              new TextRun({ text: 'Expected Answer / Solution: ', bold: true, color: '1B5E20', font: 'Times New Roman' }),
              new TextRun({ text: q.answer, font: 'Times New Roman' })
            ]
          })
        );

        if (q.markingRubric && q.markingRubric.length > 0) {
          children.push(
            new Paragraph({
              indent: { left: 720 },
              spacing: { after: 60 },
              children: [
                new TextRun({ text: 'Marking Rubric: ', bold: true, italics: true, color: '4A148C', font: 'Times New Roman' }),
                new TextRun({ text: q.markingRubric.join(' | '), italics: true, font: 'Times New Roman' })
              ]
            })
          );
        }
      }
    });
  });

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720, // 0.5 in
              bottom: 720,
              left: 1080, // 0.75 in
              right: 1080
            }
          }
        },
        children
      }
    ]
  });

  const blob = await Packer.toBlob(doc);
  const filename = generatePaperFilename(
    paper,
    isAnswerKeyOnly ? 'Answer_Key' : '',
    'docx'
  );
  downloadBlob(blob, filename);
}

// ----------------------------------------------------
// PDF GENERATION ENGINE (High-Fidelity Printable PDF)
// ----------------------------------------------------
export function exportPaperToPdf(paper: TestPaper, isAnswerKeyOnly = false): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - (margin * 2);
  let y = 18;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin - 10) {
      doc.addPage();
      y = margin;
      drawHeaderFooter(doc);
    }
  };

  const drawHeaderFooter = (targetDoc: jsPDF) => {
    const totalPages = targetDoc.getNumberOfPages();
    targetDoc.setFont('times', 'normal');
    targetDoc.setFontSize(8);
    targetDoc.setTextColor(100);
    targetDoc.text(
      `${paper.schoolName} — Class ${paper.grade} ${paper.subject} | Page ${targetDoc.getCurrentPageInfo().pageNumber}`,
      pageWidth / 2,
      pageHeight - 8,
      { align: 'center' }
    );
  };

  // Header Title
  doc.setFont('times', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(20, 20, 20);
  doc.text((paper.schoolName || 'EXAMINATION PAPER').toUpperCase(), pageWidth / 2, y, { align: 'center' });
  y += 6;

  if (paper.schoolAddress) {
    doc.setFont('times', 'italic');
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    doc.text(paper.schoolAddress, pageWidth / 2, y, { align: 'center' });
    y += 5;
  }

  // Exam Name
  doc.setFont('times', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(30, 30, 30);
  const examTitle = isAnswerKeyOnly
    ? `${(paper.examName || 'EXAMINATION').toUpperCase()} — COMPLETE ANSWER KEY`
    : (paper.examName || 'EXAMINATION').toUpperCase();
  doc.text(examTitle, pageWidth / 2, y, { align: 'center' });
  y += 6;

  // Horizontal divider
  doc.setLineWidth(0.4);
  doc.setDrawColor(60, 60, 60);
  doc.line(margin, y, pageWidth - margin, y);
  y += 5;

  // Metadata Row 1: Class, Subject, Time, Max Marks
  doc.setFont('times', 'normal');
  doc.setFontSize(10);
  doc.text(`Class: ${paper.grade}`, margin, y);
  doc.text(`Subject: ${paper.subject}`, margin + 35, y);
  doc.text(`Time: ${paper.duration || '1 Hour'}`, pageWidth - margin - 55, y);
  doc.setFont('times', 'bold');
  doc.text(`Max. Marks: ${paper.maximumMarks}`, pageWidth - margin, y, { align: 'right' });
  y += 5;

  // Metadata Row 2: Date, Name, Roll No.
  doc.setFont('times', 'normal');
  doc.text(`Date: ${paper.date || '____________'}`, margin, y);
  doc.text('Name: __________________________', margin + 65, y);
  doc.text('Roll No: ____________', pageWidth - margin, y, { align: 'right' });
  y += 4;

  doc.line(margin, y, pageWidth - margin, y);
  y += 6;

  // General Instructions
  if (!isAnswerKeyOnly && paper.generalInstructions && paper.generalInstructions.length > 0) {
    doc.setFont('times', 'bold');
    doc.setFontSize(9.5);
    doc.text('General Instructions:', margin, y);
    y += 4.5;
    doc.setFont('times', 'normal');
    doc.setFontSize(8.5);

    paper.generalInstructions.forEach((inst, i) => {
      const line = `${i + 1}. ${inst}`;
      const split = doc.splitTextToSize(line, contentWidth - 4);
      doc.text(split, margin + 2, y);
      y += (split.length * 3.8);
    });
    y += 3;
  }

  // Render Sections
  paper.sections.forEach(section => {
    checkPageBreak(25);

    // Section Header
    y += 3;
    doc.setFont('times', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    const secHeader = `${section.title.toUpperCase()}  [${section.totalMarks} Marks]`;
    doc.text(secHeader, pageWidth / 2, y, { align: 'center' });
    y += 5;

    if (section.instructions) {
      doc.setFont('times', 'italic');
      doc.setFontSize(9);
      doc.setTextColor(70, 70, 70);
      doc.text(section.instructions, pageWidth / 2, y, { align: 'center' });
      y += 5;
    }

    // Questions
    section.questions.forEach(q => {
      checkPageBreak(q.options ? 35 : 20);

      // Question Number & Text
      doc.setFont('times', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(20, 20, 20);
      doc.text(`${q.number}.`, margin, y);

      // Marks on right
      doc.text(`[${q.marks}]`, pageWidth - margin, y, { align: 'right' });

      // Wrap question text
      doc.setFont('times', 'normal');
      const qTextLines = doc.splitTextToSize(q.question, contentWidth - 18);
      doc.text(qTextLines, margin + 6, y);
      y += (qTextLines.length * 4.4);

      // Options for MCQ
      if (q.questionType === 'MCQ' && q.options && q.options.length > 0) {
        doc.setFont('times', 'normal');
        doc.setFontSize(9.5);
        q.options.forEach(opt => {
          checkPageBreak(6);
          doc.text(opt, margin + 12, y);
          y += 4.5;
        });
      }

      // Answer Key Info if enabled
      if (isAnswerKeyOnly) {
        checkPageBreak(12);
        doc.setFont('times', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(22, 101, 52); // green
        doc.text('Answer: ', margin + 12, y);
        doc.setFont('times', 'normal');
        const ansLines = doc.splitTextToSize(q.answer, contentWidth - 30);
        doc.text(ansLines, margin + 26, y);
        y += (ansLines.length * 4.2);

        if (q.markingRubric && q.markingRubric.length > 0) {
          doc.setFont('times', 'italic');
          doc.setFontSize(8.5);
          doc.setTextColor(107, 33, 168); // purple
          const rubricText = `Rubric: ${q.markingRubric.join(' | ')}`;
          const rubricLines = doc.splitTextToSize(rubricText, contentWidth - 25);
          doc.text(rubricLines, margin + 12, y);
          y += (rubricLines.length * 3.8);
        }
      }

      y += 3; // spacing between questions
    });

    y += 2;
  });

  // Footer for all pages
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont('times', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text(
      `${paper.schoolName} — Class ${paper.grade} ${paper.subject} | Page ${i} of ${pageCount}`,
      pageWidth / 2,
      pageHeight - 8,
      { align: 'center' }
    );
  }

  const filename = generatePaperFilename(
    paper,
    isAnswerKeyOnly ? 'Answer_Key' : '',
    'pdf'
  );
  doc.save(filename);
}
