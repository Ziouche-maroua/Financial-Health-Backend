import express from 'express';
import { generatePDFReport, generateExcelReport, generateCSVReport } from '../controllers/reportController';

const router = express.Router();

router.get('/report/pdf/:userId', generatePDFReport);
router.get('/report/excel/:userId', generateExcelReport);
router.get('/report/csv/:userId', generateCSVReport);

export default router;
