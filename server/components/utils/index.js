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
  const query = { $and: [{ attr: { $all: [] } }] };
  let arr;
  const coords = {};

  if (q.count) { delete q.count; }
  if (q.page) { delete q.page; }
  if (q.locale) { delete q.locale; }
  if (q.sort_by) { delete q.sort_by; }

  for (const i in q) {
    if (q.hasOwnProperty(i)) {
      if (model && config.attributes[model].indexOf(i) > -1) {
        const ai = _.findIndex(query.$and, o => o.hasOwnProperty('attr'));
        if (_.isArray(q[i])) {
          const l = q[i].length;
          arr = [];
          for (let j = 0; j < l; j++) {
            const obj = { k: i, v: q[i][j] };
            arr.push(obj);
          }

          query.$and[ai].attr.$all.push({ $elemMatch: { $or: arr } });
        } else {
          query.$and[ai].attr.$all.push({ $elemMatch: { k: i, v: q[i] } });
        }
      } else if (i.includes('min')) {
        const p = i.split('min')[1].toLowerCase();
        if (p === 'price') {
          q[i] = q[i] * 100;
        }
        query[p] = { $gte: q[i] };
      } else if (i.includes('max')) {
        const p = i.split('max')[1].toLowerCase();
        if (p === 'price') {
          q[i] = q[i] * 100;
        }
        query[p] = { $lte: q[i] };
      } else if (i === 'category') {
        let done = false;

        arr = [q[i]];
        Category.find({}, (err, cs) => {
          arr = findChildsAndPopulateArray(cs, q[i], arr);
          done = true;
        });

        require('deasync').loopWhile(() => !done);
        const l = arr.length;
        const arr2 = [];
        for (let j = 0; j < l; j++) {
          const obj = {};
          obj[i] = arr[j];
          arr2.push(obj);
        }

        query.$and.push({ $or: arr2 });
      } else if (i === 'ids') {
        query.$and.push({ _id: { $in: q[i] } });
      } else if (i === 'text') {
        arr = [];
        arr.push({ title: { $regex: new RegExp(`.*${RegExp.quote(q[i]).toLowerCase()}.*`, 'i') } });
        arr.push({ description: { $regex: new RegExp(`.*${RegExp.quote(q[i]).toLowerCase()}.*`, 'i') } });
        query.$and.push({ $or: arr });
      } else if (_.isArray(q[i])) {
        const l = q[i].length;
        arr = [];
        for (let j = 0; j < l; j++) {
          const obj = {};
          obj[i] = q[i][j];
          arr.push(obj);
        }

        query.$and.push({ $or: arr });
      } else if (i === 'name' || i === 'title') {
        query.$and.push({ [i]: { $regex: new RegExp(`^${RegExp.quote(q[i]).toLowerCase()}`, 'i') } });
      } else if (['north', 'south', 'west', 'east'].indexOf(i) > -1) {
        coords[i] = q[i];
      } else if (i === 'city' || i === 'district') {
        if (i === 'city') { // TODO
          query.$and.push({ 'address.administrative_areas': { $regex: new RegExp(`^${RegExp.quote(q[i]).toLowerCase()}`, 'i') } });
        } else {
          query.$and.push({ 'address.administrative_areas': { $regex: new RegExp(`^${RegExp.quote(q[i]).toLowerCase()}`, 'i') } });
        }
      } else {
        const obj = {};
        obj[i] = q[i];
        query.$and.push(obj);
      }
    }
  }

  if (coords.hasOwnProperty('north') && coords.north && coords.hasOwnProperty('south') && coords.south &&
  coords.hasOwnProperty('west') && coords.west && coords.hasOwnProperty('east') && coords.east) {
    const ci = _.findIndex(query.$and, o => o.hasOwnProperty('address.administrative_areas'));
    if (ci > -1) query.$and.splice(ci, 1);

    const di = _.findIndex(query.$and, o => o.hasOwnProperty('address.administrative_areas'));
    if (di > -1) query.$and.splice(di, 1);

    query.$and.push({ 'address.coords.lat': { $gt: coords.south } });
    query.$and.push({ 'address.coords.lat': { $lt: coords.north } });
    query.$and.push({ 'address.coords.lng': { $gt: coords.west } });
    query.$and.push({ 'address.coords.lng': { $lt: coords.east } });
  }

  const ai = _.findIndex(query.$and, o => o.hasOwnProperty('attr'));
  if (query.$and[ai].attr.$all.length === 0) {
    query.$and.splice(ai, 1);
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
          if (key === 'ratings') {
            if (entity.ratings) {
              if (entity.ratings.averages && entity.ratings.averages.length === 0) {
                entity.averages = val;
              } else {
                entity.ratings.averages = entity.ratings.averages.map((ave, i) => (ave * entity.ratings.counter + val[i]) / (entity.ratings.counter + 1));
              }
              entity.ratings.all.push({ by: by._id, ratings: val });
              entity.ratings.counter++;
            } else {
              entity.ratings = {
                averages: val,
                counter: 1,
                all: [{ by: by._id, ratings: val }]
              };
            }
            // entity.markModified('ratings');
          } else if (key === 'attr') {
            if (!entity.attr) entity.attr = [];
            val.forEach(at => {
              const ai = _.findIndex(entity.attr, att => att.k === at.k);
              if (ai > -1) {
                entity.attr[ai].v = at.v;
              } else {
                entity.attr.push(at);
              }

              if (_.isArray(at.v)) {
                entity.markModified(`attr.${at.k}`);
              }
            });
          } else {
            entity[key] = updates[key];
          }

          delete updates[key];
          entity.markModified(key);
        }
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
