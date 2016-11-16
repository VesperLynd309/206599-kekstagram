/* global Resizer: true */
/* global Cookies */

/**
 * @fileoverview
 * @author Igor Alexeenko (o0)
 */

'use strict';

(function() {
  /** @enum {string} */
  var FileType = {
    'GIF': '',
    'JPEG': '',
    'PNG': '',
    'SVG+XML': ''
  };

  /** @enum {number} */
  var Action = {
    ERROR: 0,
    UPLOADING: 1,
    CUSTOM: 2
  };

  /**
   * Регулярное выражение, проверяющее тип загружаемого файла. Составляется
   * из ключей FileType.
   * @type {RegExp}
   */
  var fileRegExp = new RegExp('^image/(' + Object.keys(FileType).join('|').replace('\+', '\\+') + ')$', 'i');

  /**
   * @type {Object.<string, string>}
   */
  var filterMap;

  /**
   * Объект, который занимается кадрированием изображения.
   * @type {Resizer}
   */
  var currentResizer;

  /**
   * Удаляет текущий объект {@link Resizer}, чтобы создать новый с другим
   * изображением.
   */
  var cleanupResizer = function() {
    if (currentResizer) {
      currentResizer.remove();
      currentResizer = null;
    }
  };

  /**
   * Ставит одну из трех случайных картинок на фон формы загрузки.
   */
  var updateBackground = function() {
    var images = [
      'img/logo-background-1.jpg',
      'img/logo-background-2.jpg',
      'img/logo-background-3.jpg'
    ];

    var backgroundElement = document.querySelector('.upload');
    var randomImageNumber = Math.round(Math.random() * (images.length - 1));
    backgroundElement.style.backgroundImage = 'url(' + images[randomImageNumber] + ')';
  };

  /**
   * Проверяет, валидны ли данные, в форме кадрирования.
   * @return {boolean}
   */
  var resizeFormIsValid = function() {
    return true;
  };

  /**
   * Форма загрузки изображения.
   * @type {HTMLFormElement}
   */
  var uploadForm = document.forms['upload-select-image'];

  /**
   * Форма кадрирования изображения.
   * @type {HTMLFormElement}
   */
  var resizeForm = document.forms['upload-resize'];

  /**
   * Форма добавления фильтра.
   * @type {HTMLFormElement}
   */
  var filterForm = document.forms['upload-filter'];

  /**
   * @type {HTMLImageElement}
   */
  var filterImage = filterForm.querySelector('.filter-image-preview');

  /**
   * @type {HTMLElement}
   */
  var uploadMessage = document.querySelector('.upload-message');

  /**
   * @param {Action} action
   * @param {string=} message
   * @return {Element}
   */
  var showMessage = function(action, message) {
    var isError = false;

    switch (action) {
      case Action.UPLOADING:
        message = message || 'Кексограмим&hellip;';
        break;

      case Action.ERROR:
        isError = true;
        message = message || 'Неподдерживаемый формат файла<br> <a href="' + document.location + '">Попробовать еще раз</a>.';
        break;
    }

    uploadMessage.querySelector('.upload-message-container').innerHTML = message;
    uploadMessage.classList.remove('invisible');
    uploadMessage.classList.toggle('upload-message-error', isError);
    return uploadMessage;
  };

  var hideMessage = function() {
    uploadMessage.classList.add('invisible');
  };

  /**
   * Обработчик изменения изображения в форме загрузки. Если загруженный
   * файл является изображением, считывается исходник картинки, создается
   * Resizer с загруженной картинкой, добавляется в форму кадрирования
   * и показывается форма кадрирования.
   * @param {Event} evt
   */
  uploadForm.addEventListener('change', function(evt) {
    var element = evt.target;
    if (element.id === 'upload-file') {
      // Проверка типа загружаемого файла, тип должен быть изображением
      // одного из форматов: JPEG, PNG, GIF или SVG.
      if (fileRegExp.test(element.files[0].type)) {
        var fileReader = new FileReader();

        showMessage(Action.UPLOADING);

        fileReader.addEventListener('load', function() {
          cleanupResizer();

          currentResizer = new Resizer(fileReader.result);
          currentResizer.setElement(resizeForm);
          uploadMessage.classList.add('invisible');

          uploadForm.classList.add('invisible');
          resizeForm.classList.remove('invisible');

          hideMessage();

          var x = document.querySelector('#resize-x');
          var y = document.querySelector('#resize-y');
          var size = document.querySelector('#resize-size');
          var formButton = document.querySelector('#resize-fwd');

           // Деактивация кнопки
          function disableButton() {
            formButton.setAttribute('disabled', 'disabled');
          }

          // активация кнопки
          function activeButton() {
            formButton.removeAttribute('disabled');
          }

          // Проверка правильности введенных значений
          function valideteForm() {

            var valueX = x.value;
            var valueY = y.value;
            var valueSize = size.value;

            if (typeof valueX !== 'number' || typeof valueY !== 'number' || typeof valueSize !== 'number') {
              disableButton();
            } else {
              activeButton();
            }

            if ((valueX + valueSize) > currentResizer._image.naturalWidth || valueX < 0 ) {
              disableButton();
            } else {
              activeButton();
            }

            if ((valueX + valueSize) > currentResizer._image.naturalHeight || valueY < 0) {
              disableButton();
            } else {
              activeButton();
            }

            var sizeWidth = (Math.min(currentResizer._image.naturalWidth, currentResizer._image.naturalHeight) - Math.min(valueX, valueY));
            if (valueSize > sizeWidth || valueSize < 0) {
              disableButton();
            } 

            if((valueX - Math.round(valueX)) != 0 || (valueY - Math.round(valueY)) !=0 || (valueSize - Math.round(valueSize)) !=0) {
              disableButton();
            }
            else {
              activeButton();
            }
          }
          valideteForm();

          size.addEventListener('input', function() {
            valideteForm();
          });

          y.addEventListener('input', function() {
            valideteForm();
          });

          x.addEventListener('input', function() {
            valideteForm();
          });
        });

        fileReader.readAsDataURL(element.files[0]);
      } else {
        // Показ сообщения об ошибке, если формат загружаемого файла не поддерживается
        showMessage(Action.ERROR);
      }
    }
  });

  /**
   * Обработка сброса формы кадрирования. Возвращает в начальное состояние
   * и обновляет фон.
   * @param {Event} evt
   */
  resizeForm.addEventListener('reset', function(evt) {
    evt.preventDefault();

    cleanupResizer();
    updateBackground();

    resizeForm.classList.add('invisible');
    uploadForm.classList.remove('invisible');
  });

  /**
   * Обработка отправки формы кадрирования. Если форма валидна, экспортирует
   * кропнутое изображение в форму добавления фильтра и показывает ее.
   * @param {Event} evt
   */
  resizeForm.addEventListener('submit', function(evt) {
    evt.preventDefault();

    if (resizeFormIsValid()) {
      var image = currentResizer.exportImage().src;

      var thumbnails = filterForm.querySelectorAll('.upload-filter-preview');
      for (var i = 0; i < thumbnails.length; i++) {
        thumbnails[i].style.backgroundImage = 'url(' + image + ')';
      }



      filterImage.src = image;

      resizeForm.classList.add('invisible');
      filterForm.classList.remove('invisible');
    }
  });

  resizeFormIsValid();

  /**
   * Сброс формы фильтра. Показывает форму кадрирования.
   * @param {Event} evt
   */
  filterForm.addEventListener('reset', function(evt) {
    evt.preventDefault();

    filterForm.classList.add('invisible');
    resizeForm.classList.remove('invisible');
  });

  var noneFilter = document.querySelector('#upload-filter-none');
  var chromeFilter = document.querySelector('#upload-filter-chrome');
  var sepiaFilter = document.querySelector('#upload-filter-sepia');
  var marvinFilter = document.querySelector('#upload-filter-marvin');

  filterForm.addEventListener('click', function() {
    saveFilter();
  });

  function saveFilter() {
    // Расчет кол-ва дней с прошлого дня рождения Грейс Хоппер
    function daysBeforeDeleteCookie() {
      var now = new Date();
      var startDate = new Date('1970-01-01');
      var GraseBirthday = new Date('1970-12-09');

      //кол-во дней с начала года и до дня рождения Грейс Хоппер
      var daysBeforeBirthday = (GraseBirthday - startDate);

      var daysAfterBirthday = (365 * 24 * 60 * 60 * 1000) - daysBeforeBirthday;

      //день рождения Грейс Хоппер в текущем году
      var GraseBirthdayInThisYear = (Math.floor(now / (1000 * 60 * 60 * 24 * 365))) * (365 * 24 * 60 * 60 * 1000) + daysBeforeBirthday;

      // разница между текущей датой и днем рождения Грейс Хоппер в текущем году
      var calculateDays = (now - GraseBirthdayInThisYear);

      var cookieDelete;

      if (calculateDays < 0) {
        var daysAfterLastBithday = now - Math.floor(now) + daysAfterBirthday;
        cookieDelete = daysAfterLastBithday / (1000 * 60 * 60 * 24);
      } else {
        cookieDelete = calculateDays / (1000 * 60 * 60 * 24);
      }
      return cookieDelete;
    }

    noneFilter.addEventListener('click', function() {
      Cookies.set('upload-filter', 'none', { expires: daysBeforeDeleteCookie() });
    });

    chromeFilter.addEventListener('click', function() {
      Cookies.set('upload-filter', 'chrome', { expires: daysBeforeDeleteCookie() });
    });

    sepiaFilter.addEventListener('click', function() {
      Cookies.set('upload-filter', 'sepia', { expires: daysBeforeDeleteCookie() });
    });

    marvinFilter.addEventListener('click', function() {
      Cookies.set('upload-filter', 'marvin', { expires: daysBeforeDeleteCookie() });
    });
  }

  /**
   * Отправка формы фильтра. Возвращает в начальное состояние, предварительно
   * записав сохраненный фильтр в cookie.
   * @param {Event} evt
   */

  filterForm.addEventListener('submit', function(evt) {

    evt.preventDefault();

    cleanupResizer();
    updateBackground();

    filterForm.classList.add('invisible');
    uploadForm.classList.remove('invisible');
  });

  /**
   * Обработчик изменения фильтра. Добавляет класс из filterMap соответствующий
   * выбранному значению в форме.
   */
  filterForm.addEventListener('change', function() {
    if (!filterMap) {
      // Ленивая инициализация. Объект не создается до тех пор, пока
      // не понадобится прочитать его в первый раз, а после этого запоминается
      // навсегда.
      filterMap = {
        'none': 'filter-none',
        'chrome': 'filter-chrome',
        'sepia': 'filter-sepia',
        'marvin': 'filter-marvin'
      };
    }

    var selectedFilter = [].filter.call(filterForm['upload-filter'], function(item) {
      return item.checked;
    })[0].value;

    // Класс перезаписывается, а не обновляется через classList потому что нужно
    // убрать предыдущий примененный класс. Для этого нужно или запоминать его
    // состояние или просто перезаписывать.
    filterImage.className = 'filter-image-preview ' + filterMap[selectedFilter];
  });

  var resizeX = resizeForm.querySelector('#resize-x');
  var resizeY = resizeForm.querySelector('#resize-y');
  var resizeSide = resizeForm.querySelector('#resize-size');

  // Обновление currentResizer с новыми значениями в форме.
  var newPictureSize = document.querySelector('.upload-resize-controls');
  newPictureSize.addEventListener('change', function() {
    currentResizer.setConstraint(Math.round(resizeX.value), Math.round(resizeY.value), Math.round(resizeSide.value));
  });

  // Добавление значений смещения в форму.
  window.addEventListener('resizerchange', function() {
    var constraint = currentResizer.getConstraint();

    resizeX.value = constraint.x;
    resizeY.value = constraint.y;
    resizeSide.value = constraint.side;
  });

  cleanupResizer();
  updateBackground();
})();
