'use strict';

document.querySelector('.filters').classList.add('hidden');

define([
  'load',
  'get-picture-element',
  ], function(load, getPictureElement) {
    load('data.js', function(pictures) {
      pictures.forEach(getPictureElement());
    });
  });

document.querySelector('.filters').classList.remove('hidden');
