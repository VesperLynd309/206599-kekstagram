'use strict';

module.exports = function(list, filterID) {
  switch (filterID) {
    case 'filter-new':
     return list.sort(function(a, b) {
        return b.created - a.created;
      });
      break;
    case 'filter-discussed':
      return list.sort(function(a, b) {
        return b.comments - a.comments;
      });
      break;
    default:
      return list.sort(function(a, b) {
        return b.likes - a.likes;
      });
  }
  return list;
};

