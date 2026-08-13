const express = require('express');
const router = express.Router();
const controller = require('../controllers/boga-modules.controller.js');

// 7.2.1 / 8.2: Verifikasi Supplier Legal OCR
router.post('/supplier/verify-legal', controller.verifySupplierLegal);

// 7.2.2: Pengadaan dan Penerimaan Barang
router.post('/pengadaan/penerimaan', controller.processProcurementReceipt);

// 7.2.3 / 8.3: Verifikasi Pembayaran & Escrow Reconciliation
router.post('/payment/reconcile', controller.reconcilePayment);

// 7.2.4 / 8.4: Geofencing Haversine Check
router.post('/distribusi/geofence', controller.checkGeofence);

// 7.2.5 / 8.5: Audit Pangan & IPFS Hashing
router.post('/audit/pangan', controller.publishFoodAudit);

// 7.2.6 / 8.6: School Feedback & AI Chatbot
router.post('/sekolah/feedback-chatbot', controller.processSchoolFeedback);

// 7.2.7 / 8.7: Soulbound Token (SBT) Reputation Leaderboard
router.get('/reputasi/sbt', controller.getSbtReputation);

// 7.2.8: Executive Audit Dashboard Summary
router.get('/dashboard/audit-summary', controller.getDashboardAuditSummary);

module.exports = router;
