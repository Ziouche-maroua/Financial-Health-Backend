// import { Request, Response } from 'express';
// import PDFDocument from 'pdfkit';
// import * as XLSX from 'xlsx';
// import { createObjectCsvWriter } from 'csv-writer';

// export const generatePDFReport = async (req: Request, res: Response) => {
//     const { userId } = req.params;
    
//     const doc = new PDFDocument();
//     let filename = `report-${userId}.pdf`;
//     res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
//     res.setHeader('Content-type', 'application/pdf');

//     doc.text('Financial Report', { align: 'center' });
//     doc.text('--------------------------');
//     // Add more detailed report data here
//     // You might want to retrieve transactions/budgets to populate this report.

//     doc.pipe(res);
//     doc.end();
// };

// export const generateExcelReport = async (req: Request, res: Response) => {
//     const { userId } = req.params;

//     // Fetch data from Firestore (transactions/budgets)
//     const transactionsSnapshot = await db.collection('transactions').where('userId', '==', userId).get();
//     const transactions = transactionsSnapshot.docs.map(doc => doc.data());

//     const workbook = XLSX.utils.book_new();
//     const worksheet = XLSX.utils.json_to_sheet(transactions);
//     XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');

//     const filename = `report-${userId}.xlsx`;
//     res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
//     res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

//     const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
//     res.send(buffer);
// };

// export const generateCSVReport = async (req: Request, res: Response) => {
//     const { userId } = req.params;

//     // Fetch data from Firestore (transactions/budgets)
//     const transactionsSnapshot = await db.collection('transactions').where('userId', '==', userId).get();
//     const transactions = transactionsSnapshot.docs.map(doc => doc.data());

//     const csvWriter = createObjectCsvWriter({
//         path: `report-${userId}.csv`,
//         header: [
//             { id: 'transactionId', title: 'Transaction ID' },
//             { id: 'amount', title: 'Amount' },
//             { id: 'category', title: 'Category' },
//             { id: 'type', title: 'Type' },
//             { id: 'date', title: 'Date' },
//             { id: 'description', title: 'Description' }
//         ]
//     });

//     await csvWriter.writeRecords(transactions); // Write to CSV

//     res.download(`report-${userId}.csv`, (err) => {
//         if (err) {
//             res.status(500).send({ message: err.message });
//         }
//     });
// };
