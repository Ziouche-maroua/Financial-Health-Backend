import { Request, Response } from 'express';
import PDFDocument from 'pdfkit';
import * as XLSX from 'xlsx';
import { createObjectCsvWriter } from 'csv-writer';
import { db } from '../config/firebaseConfig'; // Firestore configuration
import fs from 'fs';

// Fetch transactions from Firestore based on userId
const fetchUserTransactions = async (userId: string) => {
    const transactionsSnapshot = await db.collection('transactions')
        .where('userId', '==', userId)
        .get();

    if (transactionsSnapshot.empty) {
        throw new Error('No transactions found');
    }

    return transactionsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    }));
};

// Generate PDF report
export const generatePDFReport = async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
        const transactions = await fetchUserTransactions(userId);

        const doc = new PDFDocument();
        const filename = `financial-report-${userId}.pdf`;
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Type', 'application/pdf');

        doc.text('Financial Report', { align: 'center' });
        doc.text('--------------------------');

        // Example: Adding transactions to the PDF
        transactions.forEach((transaction: any) => {
            doc.text(`ID: ${transaction.id}, Amount: ${transaction.amount}, Category: ${transaction.category}`);
        });

        doc.pipe(res);
        doc.end();
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Generate Excel report
export const generateExcelReport = async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
        const transactions = await fetchUserTransactions(userId);

        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(transactions);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');

        const filename = `financial-report-${userId}.xlsx`;
        res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

        const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
        res.send(buffer);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Generate CSV report
export const generateCSVReport = async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
        const transactions = await fetchUserTransactions(userId);

        const csvWriter = createObjectCsvWriter({
            path: `./tmp/report-${userId}.csv`,
            header: [
                { id: 'id', title: 'ID' },
                { id: 'amount', title: 'Amount' },
                { id: 'category', title: 'Category' },
                { id: 'type', title: 'Type' },
                { id: 'date', title: 'Date' },
                { id: 'description', title: 'Description' }
            ]
        });

        await csvWriter.writeRecords(transactions); // Write to CSV

        res.download(`./tmp/report-${userId}.csv`, (err) => {
            if (err) {
                res.status(500).send({ message: err.message });
            } else {
                // Optionally delete file after download
                fs.unlinkSync(`./tmp/report-${userId}.csv`);
            }
        });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};
