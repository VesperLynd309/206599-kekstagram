'use strict';

document.querySelector('.filters').classList.add('hidden');

var PICTURE_LOAD_TIMEOUT = 1000;
var container = document.querySelector('.pictures');
var template = document.querySelector('#picture-template');
var templateContainer = 'content' in template ? template.content : template;
var PICTURES_LOAD_URL = '//localhost:1507/api/pictures';

var load = function(url, callback, callbackName) {
  if (!callbackName) {
    callbackName = 'cb' + Date.now();
  }

  window[callbackName] = function(pictures) {
    callback(pictures);
  }

  var script = document.createElement('script');
  script.src = url + '?callback=' + callbackName;
  document.body.appendChild(script);
};

load(PICTURES_LOAD_URL, function(pictures) {
  console.log(pictures);
}, "pictures");

//Проверка наличия свойства preview
function emptyObject(picture) {
  //for (pictures.preview in pictures) {
  if (picture.preview) {
    return true;
  }
    return false;
}

var getPictureElement = function(picture) {
  var pictureElement = templateContainer.querySelector('.picture').cloneNode(true);
  pictureElement.querySelector('.picture-likes').textContent = picture.likes;
  pictureElement.querySelector('.picture-comments').textContent = picture.comments;

  var pictureImage = new Image(182, 182);
  var pictureImageTimeout = null;

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

var renderPictures = function(pictures) {
  pictures.forEach(function(picture) {
    container.appendChild(getPictureElement(picture));
  });
};

load(PICTURES_LOAD_URL, renderPictures, '__jsonpCallback');

document.querySelector('.filters').classList.remove('hidden');
