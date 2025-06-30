const express = require('express');
const router = express.Router();
const { getSuggestions , getAddressFromId } = require('../controller/location.controller');

router.get('/suggestions', getSuggestions);
router.get("/get-user-address/:id", getAddressFromId);

module.exports = router;
