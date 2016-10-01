'use strict';

import _ from 'lodash';
import config from '../../config/environment';

RegExp.quote = str => `${str}`.replace(/[.?*+^$[\]\\(){}|-]/g, '\\$&');

exports.hasRight = (role, min) => config.userRoles.indexOf(role) >= config.userRoles.indexOf(min);

exports.capitalizeFirstLetter = (str) => {
  const firstChar = str.charAt(0);
  if (firstChar === 'i') {
    return `İ${str.slice(1)}`;
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const findChildsAndPopulateArray = (all, id, arr) => {
  all.forEach(o => {
    if (`${o.parent}` === `${id}`) {
      arr.push(`${o._id}`);
      arr = findChildsAndPopulateArray(all, o._id, arr);
    }
  });

  return arr;
};

exports.queryBuilder = function (opts) {
  const { req, defaultCount, model } = opts;
  const q = req.query;
  const sort = q.sort_by ? `-${q.sort_by}` : null;
  const count = parseInt(q.count, 10) || defaultCount;
  const page = q.page || 1;
  const skip = count * (page - 1);
  const query = { $and: [] };
  let arr;

  if (q.count) { delete q.count; }
  if (q.page) { delete q.page; }
  if (q.locale) { delete q.locale; }
  if (q.sort_by) { delete q.sort_by; }

  for (const i in q) {
    if (q.hasOwnProperty(i)) {
      if (i === 'ids') {
        query.$and.push({ _id: { $in: q[i] } });
      } else if (_.isArray(q[i])) {
        const l = q[i].length;
        arr = [];
        for (let j = 0; j < l; j++) {
          const obj = {};
          obj[i] = q[i][j];
          arr.push(obj);
        }

        query.$and.push({ $or: arr });
      } else {
        const obj = {};
        obj[i] = q[i];
        query.$and.push(obj);
      }
    }
  }

  if (query.$and.length === 0) {
    delete query.$and;
  }

  return { query, count, skip, page, sort };
};

exports.respondWithResult = function (res, statusCode) {
  statusCode = statusCode || 200;
  return entity => {
    if (entity) {
      res.status(statusCode).json(entity);
      return entity;
    }
  };
};

exports.saveUpdates = function (updates, by) {
  return entity => {
    if (entity) {
      _.forEach(updates, (val, key) => {
        if (_.isArray(val)) {
          entity[key] = updates[key];
        }

        delete updates[key];
        entity.markModified(key);
      });

      const updated = _.merge(entity, updates);

      updated.updated_at = new Date();
      if (updates) {
        const keys = Object.keys(updates);
        const l = keys.length;

        for (let ii = 0; ii < l; ii++) {
          if (!(keys[ii] === '_id' || keys[ii] === 'id' || keys[ii] === '__v' || keys[ii] === 'created_at')) {
            updated.markModified(keys[ii]);
          }
        }
      }

      return updated.saveAsync()
      .spread(data => data);
    }
  };
};

exports.removeEntity = function (res) {
  return entity => {
    if (entity) {
      return entity.removeAsync()
        .then(() => {
          res.status(204).end();
        });
    }
  };
};

exports.handleEntityNotFound = function (res) {
  return entity => {
    if (!entity || (_.isArray(entity) && entity.length === 0)) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
};

exports.handleError = function (req, res, statusCode) {
  statusCode = statusCode || 500;
  return err => {
    console.log('req');
    console.log(req);
    console.log('err');
    console.log(err);
    res.status(statusCode).send(err);
  };
};
