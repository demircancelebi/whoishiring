'use strict';

import { Router } from 'express';
const controller = require('./job.controller');
const auth = require('../../auth/auth.service');

const router = new Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', auth.hasRole('admin'), controller.create);
router.put('/:id', auth.hasRole('admin'), controller.update);

module.exports = router;
