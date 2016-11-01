'use strict';

var load = require('../js/load');
var getPictureElement = require('../js/picture');
var gallery = require('../js/gallery');

//Получение данных со списком картинок
(module.exports = function() {
  document.querySelector('.filters').classList.add('hidden');

  var container = document.querySelector('.pictures');
  var PICTURES_LOAD_URL = '//localhost:1507/api/pictures';

  // Отрисовка списка на странице
  var renderPictures = function(pictures) {
    pictures.forEach(function(picture, number) {
      container.appendChild(getPictureElement(picture, number));
    });
   // gallery.setPictures(pictures);
  };

  load(PICTURES_LOAD_URL, renderPictures, '__jsonpCallback');
  document.querySelector('.filters').classList.remove('hidden');
})();
