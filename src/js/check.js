'use strict';

(function getMessage(a, b) {
  if (typeof a === 'boolean') {
    if (a === true) {
      return ('Переданное GIF-изображение анимировано и содержит ' + b + ' кадров');
     } else {
     return ('Переданное GIF-изображение не анимировано');
    }

  } else if (typeof a === 'number') {
    return ('Переданное SVG-изображение содержит ' + a + 'объектов и ' + (b * 4) + ' атрибутов');
  } else if (typeof a === 'object') {
     var amountOfRedPoints = 0;
     for ( var i = 0; i < a.length; i++) {
       amountOfRedPoints += a[i];
     } return ('Количество красных точек во всех строчках изображения: ' + amountOfRedPoints);
   } else if (typeof a === 'object' && typeof b === 'object') {
     var artifactsSquare = 0;
     var j;
     for ( i = 0, j = 0; i < a.length && j < b.length; i++, j++) {
       artifactsSquare += a[i] * b[j];
     } return ('Общая площадь артефактов сжатия: ' + artifactsSquare + ' пикселей');
   } else {
     return ('Переданы некорректные данные');
   }
})();