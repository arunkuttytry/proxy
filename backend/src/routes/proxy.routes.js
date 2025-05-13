const express = require('express');
const { body, validationResult } = require('express-validator');
const { ProxyService } = require('../services/proxy.service');
const { logger } = require('../utils/logger');

const router = express.Router();
const proxyService = new ProxyService();

// Get all proxies
router.get('/', async (req, res, next) => {
  try {
    const proxies = await proxyService.getAllProxies();
    res.json(proxies);
  } catch (error) {
    next(error);
  }
});

// Add new proxy
router.post('/',
  [
    body('ip').isIP().withMessage('Invalid IP address'),
    body('port').isInt({ min: 1, max: 65535 }).withMessage('Port must be between 1 and 65535')
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { ip, port } = req.body;
      const proxy = await proxyService.addProxy(ip, port);
      res.status(201).json(proxy);
    } catch (error) {
      next(error);
    }
  }
);

// Delete proxy
router.delete('/:id', async (req, res, next) => {
  try {
    await proxyService.deleteProxy(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// Regenerate config
router.post('/regenerate', async (req, res, next) => {
  try {
    await proxyService.regenerateConfig();
    res.json({ message: 'Configuration regenerated successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router; 