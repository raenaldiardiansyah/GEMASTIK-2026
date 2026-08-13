const express = require('express');
const router = express.Router();

// Import semua rute modul
const authRoutes = require('../auth.routes.js');
const vendorRoutes = require('../vendor.route.js');
const inventoryRoutes = require('../inventory.route.js');
const spkRoutes = require('../spk.route.js');
const bogaModuleRoutes = require('../boga-modules.route.js');

/**
 * Pendaftaran Modul API v1
 */
router.use('/auth', authRoutes);
router.use('/vendors', vendorRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/spk', spkRoutes);
router.use('/boga', bogaModuleRoutes);

module.exports = router;
