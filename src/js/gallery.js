'use strict';

var Gallery = function () {
	var self = this;
	this.pictures = [];
	this.activePicture = 0;
	this.galleryContainer = document.querySelector('.gallery-overlay');
	this.galleryClose = document.querySelector('.gallery-overlay-close');
	this.galleryPicture = document.querySelector('.gallery-overlay-image');
};

Gallery.prototype.setPictures = function() {
	this.pictures = pictures;
}
	
Gallery.prototype.show = function(number) {
	var self = this;

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

	//galleryContainer.classList.remove('invisible');

	self.setActivePicture(number);
};

Gallery.prototype.hide = function() {
	galleryContainer.classList.add('invisible');
	this.galleryClose.onclick = null;
	this.galleryPicture.onclick = null;
},
	
Gallery.prototype.setActivePicture = function(number) {
	self.activePicture = number;
	this.pictureElement.querySelector('.likes-count').textContent = this.pictures[number].likes;
    this.pictureElement.querySelector('.comments-count').textContent = this.pictures[number].comments;
};

module.exports = new Gallery();