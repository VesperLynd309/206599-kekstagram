'use strict';

var load = require('./load');
var Picture = require('./picture');
var gallery = require('./gallery');

//Получение данных со списком картинок
(module.exports = function() {
  var filters = document.querySelector('.filters');
  filters.classList.add('hidden');

  var container = document.querySelector('.pictures');
  var PICTURES_LOAD_URL = '/api/pictures';
  var pageNumber = 0;
  var pageSize = 12;
  var GAP = 100;
  var THROTTLE_TIMEOUT = 200;
  var footer = document.querySelector('.footer');
  var filter = 'filter-popular';

  // Отрисовка списка на странице
  var renderPictures = function(pictures) {
    pictures.forEach(function(picture, number) {
      container.appendChild(new Picture(picture, number).element);
    });
    gallery.setPictures(pictures);
  };

  var addMorePictures = function() {
    if (container.getBoundingClientRect().height < window.innerHeight - footer.getBoundingClientRect().height) {
      load(PICTURES_LOAD_URL, {
        from: 0,
        to: 11,
      }, renderPictures);
    }
  };

  // смена фильтра с отрисовкой нового списка картинок
  var changeFilter = function(filterID) {
    container.innerHTML = '';
    pageNumber = 0;
    load(PICTURES_LOAD_URL, {
      from: 0,
      to: 11,
      filter: filterID
    }, renderPictures);
    addMorePictures();
  };

  var lastCall = Date.now();

  changeFilter();
  
  window.addEventListener('scroll', function() {
    if (Date.now() - lastCall >= THROTTLE_TIMEOUT) {
      if (footer.getBoundingClientRect().bottom - window.innerHeight <= GAP) {
        load(PICTURES_LOAD_URL, {
          from: pageNumber * pageSize,
          to: pageNumber * pageSize + pageSize,
          filter: filter
        }, renderPictures);
        pageNumber++;
        addMorePictures();
      }
      lastCall = Date.now();
    }
  });

  filters.addEventListener('change', function(evt) {
    if (evt.target.classList.contains('filters-radio')) {
      changeFilter(evt.target.id);
    }
  });

  filters.classList.remove('hidden');
})();
