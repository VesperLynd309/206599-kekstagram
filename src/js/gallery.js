'use strict';

var Gallery = function () {
	this.pictures = [];
	this.activePicture = 0;

	this.galleryContainer = document.querySelector('.gallery-overlay');
	this.galleryClose = document.querySelector('.gallery-overlay-close');
	this.galleryPicture = document.querySelector('.gallery-overlay-image');
};

Gallery.prototype = function() {
	var self = this;

	setPictures : function(pictures) {
		this.pictures = pictures;
	},
	show : function(number) {
		this.galleryClose.onclick = function() {
			self.hide();
		}
		
		this.galleryPicture.onclick = function() {
			if (number === self.pictures.length - 1) {
				self.setActivePicture(self.activePicture(0))
			} else {
			self.setActivePicture(self.activePicture + 1);
			}
		}
		
		galleryContainer.classList.remove('invisible');

		self.setActivePicture(number);
	},
	hide : function() {
		galleryContainer.classList.add('invisible');
		this.galleryClose.onclick = null;
		this.galleryPicture.onclick = null;
	},
	setActivePicture : function(number) {
		self.activePicture = number;

		this.element.querySelector('.likes-count').textContent = this.pictures[number].likes;
      	this.element.querySelector('.comments-count').textContent = this.pictures[number].comments;
};

module.exports = new Gallery();