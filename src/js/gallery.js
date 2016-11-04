'use strict';

var PICTURE_LOAD_TIMEOUT = 1000;

var Gallery = function() {

  this.pictures = [];
  this.activePicture = 0;
  this.galleryContainer = document.querySelector('.gallery-overlay');
  this.galleryClose = document.querySelector('.gallery-overlay-close');
  this.galleryPicture = document.querySelector('.gallery-overlay-image');
};

Gallery.prototype.setPictures = function(pictures) {
  this.pictures = pictures;
};

Gallery.prototype.show = function(number) {
  var self = this;

  this.galleryClose.onclick = function() {
    self.hide();
  };

  this.galleryPicture.onclick = function() {
    if (number === self.pictures.length - 1) {
      self.setActivePicture(0);
    } else {
      self.setActivePicture(number + 1);
    }
  };

  this.galleryContainer.classList.remove('invisible');

  self.setActivePicture(number);
};

Gallery.prototype.hide = function() {
  this.galleryContainer.classList.add('invisible');
  this.galleryClose.onclick = null;
  this.galleryPicture.onclick = null;
};

Gallery.prototype.setActivePicture = function(number) {
  this.pictureLikes = document.querySelector('.likes-count');
  this.pictureComments = document.querySelector('.comments-count');
  self.activePicture = number;
  this.galleryPictureContainer = document.querySelector('.gallery-overlay-preview');

  this.galleryPictureContainer = new Image();
  var that = this;

  this.galleryPictureContainer.onload = function(evt) {
  	that.galleryPicture.src = that.pictures[number].url;
  };

  this.galleryPictureContainer.onerror = function(evt) {
  	that.galleryPicture.classList.add('picture-load-failure');
  };

  this.galleryPictureContainer = this.pictures[number].url;
  this.pictureLikes.textContent = this.pictures[number].likes;
  this.pictureComments.textContent = this.pictures[number].comments;
};

module.exports = new Gallery();
