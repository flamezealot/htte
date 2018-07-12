const diff = require('htte-diff');
const query = require('htte-query');

const ContextError = require('./error');

function differ(store, unit, segs = []) {
  let self = { segs: [] };
  self.exec = function(tagType, handler, literal, actual) {
    if (tagType !== 'differ') {
      self.log('resolver plugin is forbidden in differ context');
      return;
    }
    return handler(self, literal, actual);
  };
  self.enter = function(seg) {
    return differ(store, unit, segs.concat(seg));
  };
  self.diff = function(expected, actual, strict) {
    return diff(self, expected, actual, strict);
  };
  self.query = query(store, unit);
  self.throw = function(msg) {
    throw new ContextError(msg, segs);
  };
  return self;
}

module.exports = differ;
