'use strict';

var gallery = require('./gallery');

// Создание DOM-элемента картинки и загрузка фото
var getPictureElement = function(picture) {
  var PICTURE_LOAD_TIMEOUT = 1000;
  var template = document.querySelector('#picture-template');
  var templateContainer = 'content' in template ? template.content : template;
  var pictureElement = templateContainer.querySelector('.picture').cloneNode(true);

  pictureElement.querySelector('.picture-likes').textContent = picture.likes;
  pictureElement.querySelector('.picture-comments').textContent = picture.comments;

  var pictureImage = new Image(182, 182);
  var pictureImageTimeout = null;

  //Проверка наличия свойства preview
  function emptyObject() {
    if (picture.preview) {
      return true;
    }
    return false;
  }

  pictureImage.onload = function() {
    clearTimeout(pictureImageTimeout);
    pictureElement.querySelector('img').src = picture.url;
  };

  pictureImage.onerror = function() {
    if (emptyObject(picture) === true) {
      clearTimeout(pictureImageTimeout);
      pictureElement.querySelector('img').src = picture.preview;
    } else {
      pictureElement.classList.add('picture-load-failure');
    }
  };

  pictureImage.src = picture.url;

  pictureImageTimeout = setTimeout(function() {
    pictureElement.classList.add('picture-load-failure');
  }, PICTURE_LOAD_TIMEOUT);

  return pictureElement;
};

var Picture = function(picture, number) {
  this.data = picture;
  this.element = getPictureElement(picture, number);
  var self = this;
  this.element.onclick = function(evt) {
    gallery.show(number);
    evt.preventDefault();
  };
  this.remove = function() {
    self.element.onclick = null;
  };
};

module.exports = Picture;
