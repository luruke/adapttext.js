/*!
 * adapttext.js v1.0.1 - https://github.com/luruke/AdaptText.js
 * MIT License
 */

(function (root, factory) {
  'use strict';

  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.AdaptText = factory();
  }
}(this, function () {
  var AdaptText = function(element, options) {
    //TODO: check if there is a child
    this.element = element;
    this.child = this.element.children[0];
    this.options = {
      minFontSize: 10,
      maxFontSize: 200,
      tollerance: 10,
      callback: function() {}
    };

    for (var prop in options)
      if (options.hasOwnProperty(prop))
        this.options[prop] = options[prop];

    this.child.style.display = 'inline-block';
    this.child.style.margin = '0px';

    //TODO: add debounce
    this.onResize = this.elaborate.bind(this);
    window.addEventListener('resize', this.onResize);
    this.elaborate();
  };

  AdaptText.prototype.destroy = function() {
    window.removeEventListener('resize', this.onResize);
  };

  //TODO: memoize the result beased on element's width/height?
  AdaptText.prototype.elaborate = function() {
    var fontSize = this.options.minFontSize;

    do {
      this.element.style.fontSize = (fontSize++) + 'px';
      if (fontSize > this.options.maxFontSize)
        break;
    } while (this.isFitting());

    fontSize--;

    this.element.style.fontSize = fontSize + 'px';
    this.options.callback(fontSize);
  };

  AdaptText.prototype.isFitting = function() {
    var parentWidth = this.element.clientWidth;
    var parentHeight = this.element.clientHeight;
    var width = this.child.clientWidth;
    var height = this.child.clientHeight;

    return (width - this.options.tollerance <= parentWidth &&
            height - this.options.tollerance <= parentHeight);
  };

  var $ = window.jQuery || false;

  if ($) {
    $.fn.adaptText = function (options) {
      $(this).each(function() {
        $(this).data('adaptText', new AdaptText(this, options));
      });
    };
  }

  return AdaptText;
}));
