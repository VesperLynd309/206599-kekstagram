'use strict';

//Получение данных со списком картинок
(function() {
  document.querySelector('.filters').classList.add('hidden');

  var load = require('../js/load');
  var getPictureElement = require('../js/get-picture-element');

  var container = document.querySelector('.pictures');
  var PICTURES_LOAD_URL = '//localhost:1507/api/pictures';

  // Отрисовка списка на странице
  var renderPictures = function(pictures) {
 	pictures.forEach(function(picture) {
       container.appendChild(getPictureElement(picture));
	});
  };

  load(PICTURES_LOAD_URL, renderPictures, '__jsonpCallback');
   document.querySelector('.filters').classList.remove('hidden');
})();
