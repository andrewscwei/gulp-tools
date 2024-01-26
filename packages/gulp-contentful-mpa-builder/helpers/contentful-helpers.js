// (c) Andrew Wei

const _ = require(`lodash`);
const Contentful = require(`contentful`);

/**
 * @see module:contentful~createClient
 */
exports.createClient = Contentful.createClient;

/**
 * Reduces fetched Contentful entries into compact data.
 *
 * @param {Object|Object[]} docs - Raw Contentful entries to reduce.
 * @param {boolean} [relative] - Specifies whether to attach `prev` and `next`
 *                               pointers to each document.
 * @param {Object} [config] - Options.
 *
 * @return {Object} - Object with reduced document data.
 */
exports.reduce = function(entries, relative, config) {
  if (entries instanceof Array) {
    let ret = {};

    entries.forEach((entry, i) => {
      const r = exports.reduce(entry, false, config);
      if (!ret[r.type]) ret[r.type] = [];
      ret[r.type].push(r);
    });

    if (relative) {
      // Add prev and next references.
      for (let key in ret) {
        let collection = ret[key];
        let n = collection.length;

        collection.forEach((entry, i) => {
          entry.prev = (i > 0) ? collection[i-1] : undefined;
          entry.next = (i < (n - 1)) ? collection[i+1] : undefined;
        });
      }
    }

    return ret;
  }
  else {
    let r = _.mapKeys(_.mapValues(entries.fields, (v, k) => {
      if (v.fields && v.fields.file) {
        return v.fields.file.url;
      }
      else {
        return v;
      }
    }), (v, k) => {
      return k;
    });

    r.type = entries.sys.contentType.sys.id;

    return r;
  }
};
