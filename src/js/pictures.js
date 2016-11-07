'use strict';

var load = require('./load');
var Picture = require('./picture');
var gallery = require('./gallery');

//Получение данных со списком картинок
(module.exports = function() {
  document.querySelector('.filters').classList.add('hidden');

  var container = document.querySelector('.pictures');
  var PICTURES_LOAD_URL = '//localhost:1507/api/pictures';

  // Отрисовка списка на странице
  var renderPictures = function(pictures) {
    pictures.forEach(function(picture, number) {
      container.appendChild(new Picture(picture, number).element);
    });
    gallery.setPictures(pictures);
  };

  load(PICTURES_LOAD_URL, renderPictures, '__jsonpCallback');
  document.querySelector('.filters').classList.remove('hidden');
})();
