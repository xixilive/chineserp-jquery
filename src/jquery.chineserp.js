/*
 * jquery.chineserp
 * https://github.com/xixilive/chineserp-jquery
 *
 * Copyright (c) 2013 xixilive
 * Licensed under the MIT license.
 */

(function($) {
  'use strict';

  var RegionRenderer = function(picker, regions, collections){
    if($('#region-picker').length == 0){
      $('<div id="region-picker"></div>')
        .append('<div class="picker-actions"> \
          <a data-action="cancel" href="javascript:;">Cancel</a> \
          <a data-action="confirm" href="javascript:;">Confirm</a> \
        </div>')
        .append('<div class="picker-regions"></div>')
        .appendTo('body');
    }

    this.picker = picker;

    this.container = $('#region-picker');
    this.container.on('click', '.region-list li', $.proxy(this.onItemClick, this));
    this.container.on('click', 'a[data-action]', $.proxy(this.onButtonClick, this));
    this.render(regions, collections);
  };

  RegionRenderer.prototype = {
    onButtonClick: function(e){
      var btn = $(e.currentTarget);
      if(btn.attr('data-action') == 'confirm'){
        var s = this.picker.regions.map(function(r){ return r.n; }).join(', ');
        this.picker.el.text(s);
      }
      this.container.hide(100);
    },

    onItemClick: function(e){
      var el = $(e.currentTarget);
      this.picker.picker.pick(el.data('region').i, $.proxy(this.render, this));
    },

    render: function(regions, collections){
      var container = $('.picker-regions', this.container).empty();
      var ul, li;
      collections.forEach(function(collection){
        ul = $('<ul>').addClass('region-list');
        collection.forEach(function(r){
          li = $('<li>').text(r.n).data('region', r);
          if(regions.indexOf(r) != -1){
            li.addClass('picked');
          }
          li.appendTo(ul);
        });
        ul.appendTo(container);
      });
      this.picker.picked(regions);
    }
  };

  /**
  * 
  */
  var RegionPicker = function(el, options){
    this.el = el;
    this.options = $.extend({}, options || {});
    this.regions = [];
    new cr.RegionPicker({
      remote: this.options.remote,
      initialized: $.proxy(this.pickerInitialized, this)
    });
    return this;
  };

  RegionPicker.prototype = {
    constructor: RegionPicker,

    pickerInitialized: function(picker){
      var self = this;
      this.picker = picker;
      this.picker.pick(this.options.defaultValue, function(regions, collections){
        self.el.on('click', $.proxy(self.onClick, self, regions, collections));
        if(typeof self.options.initialized == 'function'){
          self.options.initialized(self, regions, collections);
        }
      });
    },

    onClick: function(regions, collections, e){
      this.renderer = this.renderer || new RegionRenderer(this, regions, collections);
      this.renderer.container.show();
    },

    picked: function(regions){
      this.regions = regions;
      if(typeof this.options.picked == 'function'){
        this.options.picked(regions, this);
      }
    }
  };

  $.fn.regionPicker = function(options){
    return this.each(function(){
      var self = $(this), data = self.data("regionpicker");
      if (!data){
        self.data('regionpicker', (data = new RegionPicker(self, options)));
        self.regionpicker = data;
      }
    });
  };
  
}(jQuery));
