/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/jobs              ->  index
 * POST    /api/jobs              ->  create
 * GET     /api/jobs/:id          ->  show
 * PUT     /api/jobs/:id          ->  update
 * DELETE  /api/jobs/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Job from './job.model';
const config = require('../../config/environment');
import * as ut from '../../components/utils';

// Gets a list of Jobs
export function index(req, res) {
  const q = ut.queryBuilder({ req, defaultCount: 30, model: 'job' });
  const sort = q.sort ? q.sort : '-created_at';
  if (!q.query.$and) {
    q.query.$and = [];
  }

  q.query.$and.push({ active: true });

  Job.find(q.query)
    .sort(sort)
    .skip(q.skip)
    .limit(q.count)
    .execAsync()
    .then(jobs => {
      Job.countAsync(q.query)
        .then(found =>
          res.status(200).send({ count: q.count, found, page: q.page, items: jobs })
        );
    })
    .catch(ut.handleError(req, res));
}

// Gets a single Job from the DB
export function show(req, res) {
  Job.findById(req.params.id)
    .execAsync()
    .then(ut.handleEntityNotFound(res))
    .then(ut.respondWithResult(res))
    .catch(ut.handleError(req, res));
}

// Creates a new Job in the DB
// @TODO: Thumbnail is hackable, change that
export function create(req, res) {
  const model = req.body;
  const now = new Date();
  model.created_at = now;
  model.updated_at = now;

  Job.createAsync(model)
    .then(ut.respondWithResult(res, 201))
    .catch(ut.handleError(req, res));
}

// Updates an existing Job in the DB
export function update(req, res) {
  Job.findById(req.params.id)
    .execAsync()
    .then(ut.handleEntityNotFound(res))
    .then(ut.saveUpdates(req.body))
    .then(ut.respondWithResult(res))
    .catch(ut.handleError(req, res));
}