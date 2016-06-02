// (c) VARIANTE

const _ = require('lodash');
const path = require('path');

/**
 * Gets config properties that conerns only the current Node environment, merged
 * with the optional `defaults` parameter. Environment specific config values
 * should reside in `envs.{NODE_ENV_NAME}` of the config object.
 *
 * @param {string|Object} [config]
 * @param {Object} [defaults]
 *
 * @return {string|Object}
 *
 * @example
 *   // The following example will return a config object with `foo` set as `10`
 *   // in production environent.
 *   {
 *     foo: 1,
 *     envs: {
 *       production: {
 *         foo: 10
 *       }
 *     }
 *   }
 */
exports.config = function(config, defaults) {
  const env = process.env.NODE_ENV || 'production';
  const defaultConfig = _.omit(defaults, 'envs') || {};
  const defaultEnvConfig = _.get(defaults, `envs.${env}`) || {};
  const baseConfig = _.omit(config, 'envs') || {};
  const envConfig = _.get(config, `envs.${env}`);
  return _.merge(defaultConfig, baseConfig, defaultEnvConfig, envConfig);
};

/**
 * Returns glob(s) using the specified pattern(s) relative to the `base`
 * directory, if provided. Option to append file extensions.
 *
 * @param {string|Array} [patterns] - Glob(s) relative to the `base` directory
 *                                    if specified in the options.
 * @param {Object} [options] - Additional options.
 * @param {string} [options.base] - Base directory which the patterns will be
 *                                  relative to.
 * @param {Array} [options.exts] - Array of file extensions (no '.') to append
 *                                 to the globs that are returned.
 *
 * @return {string|Array} - Resolved glob pattern(s).
 */
exports.glob = function(patterns, options) {
  var base = _.get(options, 'base');
  var exts = _.get(options, 'exts');
  return resolve(base, patterns, exts);
};

/**
 * Returns a glob with given pattern(s), base and allowed file extensions.
 *
 * @param {string} base - Base path of which all returned glob patterns will be
 *                        relative to.
 * @param {string|Array} [pattern] - Glob pattern(s) to be resolved.
 * @param {Array} [fileExtensions] - File extensions to be appened to the output
 *                                   glob(s).
 *
 * @return {string|Array} - Resolved glob pattern(s).
 */
function resolve(base, pattern, fileExtensions) {
  if (pattern instanceof Array) {
    let patterns = _.flatten(pattern);
    return _.map(patterns, (val) => (resolve(base, val, fileExtensions)));
  }
  else {
    if (!pattern) pattern = '';

    let negate = _.startsWith(pattern, '!');
    let exts = ((path.extname(pattern) === '') && fileExtensions) ? globExts(fileExtensions) : '';

    if (_.startsWith(pattern, '!')) pattern = pattern.substr(1);

    return `${negate ? '!' : ''}${path.join(base || '', `${pattern}${exts}`)}`;
  }
}

/**
 * Returns a globbing pattern including the specified file extensions.
 *
 * @param {...(Array|string)} extensions - Extensions to be included in the
 *                                         returned glob. If unspecified, `.*`
 *                                         will be returned.
 *
 * @return {string} - Glob pattern consisting of all specified extensions.
 */
function globExts(extensions) {
  let exts = _.flattenDeep(_.concat.apply(null, arguments));
  return (exts.length <= 1) ? `.${exts[0] || '*'}` : `.{${exts.join(',')}}`;
};
