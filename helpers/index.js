// © Andrew Wei

/**
 * Resolves paths in view files. This method ensures that there are no
 * relative paths (by prefixing paths with '/' if needed) and resolves
 * fingerprinted paths.
 *
 * @param {string} p
 * @param {string} manifestPath
 *
 * @return {string}
 */
exports.getPath = function(p, manifestPath) {
  // Ensure there are no relative paths.
  let regex = /^(?!.*:\/\/)\w+.*$/g
  if (regex.test(p)) p = `/${p}`;

  try {
    let manifest = require(manifestPath);
    if (!manifest) return p;
    let r = manifest[p] || manifest[p.substr(1)];
    if (!r) return p;
    if (regex.test(r)) r = `/${r}`;
    return r;
  }
  catch (err) {
    return p;
  }
};
