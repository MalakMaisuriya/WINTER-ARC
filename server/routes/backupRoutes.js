const express = require('express');
const router = express.Router();
const { exportUserDataJson, exportUserDataCsv, importUserData, deleteAccount } = require('../controllers/backupController');
const { protect } = require('../middleware/auth');

router.get('/json', protect, exportUserDataJson);
router.get('/csv', protect, exportUserDataCsv);
router.post('/import', protect, importUserData);
router.delete('/account', protect, deleteAccount);

module.exports = router;
