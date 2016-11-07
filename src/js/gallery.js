'use strict';

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
 
  this.setActivePicture(number);
};
 
Gallery.prototype.hide = function() {
  this.galleryContainer.classList.add('invisible');
  this.galleryClose.onclick = null;
  this.galleryPicture.onclick = null;
};
 
Gallery.prototype.setActivePicture = function(number) {
  this.pictureLikes = document.querySelector('.likes-count');
  this.pictureComments = document.querySelector('.comments-count');
  this.activePicture = number;
  var that = this;
  
  this.galleryPicture.onerror = function(evt) {
    that.galleryPicture.classList.add('gallery-picture-load-failure');
  };
 
  this.galleryPicture.src = this.pictures[number].url;
  this.pictureLikes.textContent = this.pictures[number].likes;
  this.pictureComments.textContent = this.pictures[number].comments;
};
 
module.exports = new Gallery();
