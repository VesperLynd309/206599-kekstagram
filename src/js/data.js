'use strict';

define([
  '../js/load',
  '../js/get-picture-element',
], function(load, getPictureElement) {
  	var container = document.querySelector('.pictures');
	var PICTURES_LOAD_URL = '//localhost:1507/api/pictures';

	// Отрисовка списка на странице
	var renderPictures = function(pictures) {
  	   pictures.forEach(function(picture) {
       container.appendChild(getPictureElement(picture));
  	});
   };

	load(PICTURES_LOAD_URL, renderPictures, '__jsonpCallback');
});
