/*
 * jquery.chineserp
 * https://github.com/xixilive/chineserp-jquery
 *
 * Copyright (c) 2013 xixilive
 * Licensed under the MIT license.
 */

(function($, cr) {
  'use strict';

  /**
  * PickerRenderer, render regions as picker
  * @param {Object} picker, RegionPicker object
  * @param {Array} regions, Picked regions array
  * @params {Array} collections, the collections that contains regions
  * @return {Object} PickerRenderer object
  */
  var PickerRenderer = function(picker, regions, collections){
    this.picker = picker;
    this.closer = this.picker.options.closer;

    if($('#region-picker').length === 0){
      var div = $('<div id="region-picker" style="position:absolute;display:none;"></div>');
      if(!this.closer){
        div.append('<a href="javascript:;" class="region-picker-closer" title="cancel">&#215;</a>');
        this.closer = '#region-picker .region-picker-closer';
      }
      div.append('<div class="regions"></div>').appendTo('body')
    }

    this.overlay = $("#region-picker");
    this.container = $('.regions', this.overlay);
    this.container.on('click', '.region-list li', $.proxy(this.onItemClick, this));

    $(window).on('resize', $.proxy(this.show, this));
    $(this.closer) && $(this.closer).on('click', $.proxy(this.onCloserClick, this));

    return this.render(regions, collections);
  };

  PickerRenderer.prototype = {

    /**
    * onItemClick, region item click handler
    * @param {Object} e, relative event object
    * @return undefined
    */
    onItemClick: function(e){
      var self = this, el = $(e.currentTarget);
      this.picker.picker.pick(el.data('region').i, function(regions, collections){
        self.render(regions, collections, el.data('region') === regions[regions.length-1]);
      });
    },

    onCloserClick: function(e){
      this.overlay.hide();
    },

    /**
    * render specified regions and collections
    * @param {Array} regions, picked regions array
    * @param {Array} collections, the collections that contains regions
    * @param {Boolean} confirmed, is the element's data of current click event equal the last element in region array
    * @return {Object} PickerRenderer object
    */
    render: function(regions, collections, confirmed){
      var container = this.container.empty();
      var ul, li;
      collections.forEach(function(collection, i){
        ul = $('<ul>').addClass('region-list');
        collection.forEach(function(r){
          li = $('<li>').text(r.n).data('region', r);
          if(regions[i] && regions[i].i === r.i){
            li.addClass('picked');
          }
          li.appendTo(ul);
        });
        ul.appendTo(container);
      });
      this._resizeContaier();
      
      if(confirmed){
        this.overlay.hide();
        this.picker.picked(regions, collections, confirmed);
        return this;
      }

      this.picker.picked(regions, collections, confirmed);
      return this;
    },

    /**
    * show, display region picker
    * @return {Object} PickerRenderer object
    */
    show: function(){
      var offset = this.picker.el.position();
      this.overlay.css({
        top: offset.top + this.picker.el.outerHeight(true),
        left: offset.left
      }).show();
      return this;
    },

    /**
    * _resizeContaier, re-calculate container's position and size
    * @return {Object} PickerRenderer object
    */
    _resizeContaier: function(){
      var w = 0, items = this.picker.options.items || 10, picked;
      var h = $('.region-list li:first').outerHeight(true);
      $('.region-list', this.container).each(function(){
        $(this).height(h * items);
        w += $(this).outerWidth(true) + 1;

        //scroll picked element into view
        picked = $(this).children('.picked').index() + 1;
        if(picked - items > 0){
          $(this).scrollTop(h * (picked - items + 1));
        }
      });
      this.container.width(w);
      return this;
    }
  };

  /**
  * SelectorRenderer, render regions in a group of SELECT tags
  * @param {Object} picker, RegionPicker object
  * @param {Array} regions, Picked regions array
  * @params {Array} collections, the collections that contains regions
  * @return {Object} SelectorRenderer object
  */
  var SelectorRenderer = function(picker, regions, collections){
    this.picker = picker;
    this.options = $.extend({
      text: 'n',
      value: 'i'
    },picker.options.option || {});
    this.container = picker.el;
    this.container.on('change', 'select', $.proxy(this.onItemChange, this));
    this.render(regions, collections);
  };

  SelectorRenderer.prototype = {
    /**
    * onItemChange, will be called when a change event fired on SELECT tag
    * @param {Object} e, event object
    * @return undefined
    */
    onItemChange: function(e){
      var el = $(e.currentTarget);
      var selected = el.find('option:selected').data('region');
      this.picker.picker.pick(selected.i, $.proxy(this.render, this));
    },

    /**
    * render specified regions and collections
    * @param {Array} regions, picked regions array
    * @param {Array} collections, the collections that contains regions
    * @return {Object} SelectorRenderer object
    */
    render: function(regions, collections){
      //hide empty elements
      $('select:gt('+(collections.length - 1)+')', this.container).empty().hide();
      for(var i=0; i < collections.length; i++){
        var select = $('select:eq('+i+')', this.container).empty().show();
        var collection = collections[i];
        collection.forEach($.proxy(this._renderOption, this, regions, select));
      }
      this.picker.picked(regions, collections);
      return this;
    },

    _renderOption: function(regions, select, r){
      var text = this.options.text, value = this.options.value;
      var option = $('<option></option>').data('region', r);
      if($.isFunction(text)){
        option.text(text(r));
      }else{
        option.text(r[text]);
      }
      if($.isFunction(value)){
        option.attr('value', value(r));
      }else{
        option.attr('value', r[value]);
      }
      
      if(regions.indexOf(r) !== -1){
        option.attr('selected', 'selected');
      }
      option.appendTo(select);
    }
  };

  /**
  * RegionPicker
  * @param {Object} el, current element
  * @param {Object} options
  *   remote: the remote data path, default is empty-string
  *   mode: which mode to use, avaliable values are 'picker' and 'selector', default is picker
  *   region: the default value to be picked(selected), see also ChineseRegion.RegionPicker#pick
  *   initialize: a hook that will be called before the default value has picked(selected)
  *   initialized: a hook that will be called after the default value was picked(selected)
  *   picked: a hook that will be called after a value was picked(selected)
  *   option: only for 'selector' mode, use to specify text attribute and value attribute for OPTION tag
  * @return {Object} RegionPicker object
  */
  var RegionPicker = function(el, options){
    this.el = el;
    this.options = $.extend({
      mode: 'picker',
      region: ''
    }, options || {});
    console.log(this.options);
    new cr.RegionPicker({
      remote: this.options.remote,
      initialized: $.proxy(this.pickerInitialized, this)
    });
    return this;
  };

  RegionPicker.prototype = {
    constructor: RegionPicker,

    /**
    * pickerInitialized
    * @param {Object} picker, ChineseRegion.RegionPicker object
    * @return undefined
    */
    pickerInitialized: function(picker){
      var self = this;
      this.picker = picker;
      if($.isFunction(this.options.initialize)){
        this.options.initialize(this);
      }
      this.picker.pick(this.options.region, function(regions, collections){
        switch(self.options.mode){
          case 'picker':
            self._actAsPicker(regions, collections);break;
          case 'selector':
            self._actAsSelector(regions, collections);break;
        }
        if($.isFunction(self.options.initialized)){
          self.options.initialized(regions, collections, self);
        }
      });
    },

    /**
    * _actAsPicker, make a region picker
    * @param {Array} regions, picked regions array that specified by the default value to be picked
    * @params {Array} collections, the collections that contains regions
    * @return undefined
    */
    _actAsPicker: function(regions, collections){
      this.el.on('click', $.proxy(function(){
        this.renderer = this.renderer || new PickerRenderer(this, regions, collections);
        this.renderer.show();
      }, this));
    },

    /**
    * _actAsSelector, make a region picker
    * @param {Array} regions, picked regions array that specified by the default value to be picked
    * @params {Array} collections, the collections that contains regions
    * @return undefined
    */
    _actAsSelector: function(regions, collections){
      this.renderer = this.renderer || new SelectorRenderer(this, regions, collections);
    },

    /**
      picked, should be called in a renderer object, in order to fire the 'picked' hook of region picker
    * @param {Array} regions, picked regions array
    * @params {Array} collections, the collections that contains regions
    * @param {mixed} options, additional arguments to be passed to the 'picked' hook
    */
    picked: function(regions, collections, options){
      if($.isFunction(this.options.picked)){
        this.options.picked(regions, collections, options, this);
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
  
}(jQuery, ChineseRegion));
