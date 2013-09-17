# Chinese region picker plugin for jQuery

The best region picker plugin for jQuery in China. based on [Chineserp][crp], data provided by [Chinese region db][crd]


## Getting Started
Download the [production version][min] or the [development version][dev].

In your web page:

```html
<script src="jquery.js"></script>
<script src="dist/jquery.chineserp.min.js"></script>
<link rel="stylesheet" href="dist/jquery.chineserp.css" media="screen">
<script>
jQuery(function($) {
  //work with a link and 'data-' attributes
  $('a.region-picker').regionPicker()
    .on('picked.rp', function(e, regions){
      $('#picker1 input').val(regions.map(function(r){ return r.n; }).join(", "));
    });

  //work with a button
  $('button.region-picker').regionPicker({
    remote: '/example',
    picked: '310105' //region code of Shanghai
  }).on('picked.rp', function(e, regions){
    $('#picker1 input').val(regions.map(function(r){ return r.n; }).join(", "));
  });
});
</script>

<div id="picker1" class="picker">
  <h1>Region Picker via link</h1>
  <input type="text" readonly="readonly"/>
  <a class="region-picker" href="javascript:;" data-remote="/example" data-picked="新疆维吾尔自治区, 喀什地区, 巴楚县" data-visible="5">
    Pickup a region
  </a>
  <button class="region-picker" type="button">Pickup a region</button>
</div>
```

## Documentation

```javascript
$('SELECTOR').regionPicker({OPTIONS}).on('EVENT', HANDLER);
```

### options
```javascript
{
  remote: 'path_of_json_data',  //URI path of json data files
  picked: 'region_id or region names',  //the initial value to be picked, names are seperated by comma or space, defaule is empty.
  visible: 10,   //the number of items that should be visibled in list element, default is 10.
  animate: 0,  //animation speed in ms, 0 means non-animation, default is 0
}
```
more details for 'remote' at [Chineserp][crp]

### events

```javascript
$('SELECTOR').regionPicker().on('initializing.rp', function(e, picker){
  //fire when plugin initializing
})
```

```javascript
$('SELECTOR').regionPicker().on('initialized.rp', function(e, picker){
  //fire when plugin initialized
})
```

```javascript
$('SELECTOR').regionPicker().on('picked.rp', function(e, regions, picker){
  //fire when a region has picked up,
  //the regions argument contains several region objects that picked up by user
})
```

```javascript
$('SELECTOR').regionPicker().on('loading.rp', function(e, picker){
  //fire when plugin is loading data
})
```

```javascript
$('SELECTOR').regionPicker().on('loaded.rp', function(e, data, picker){
  //fire when data loaded
})
```

### DOM tree

```html
<div id="region-picker">
  <a href="javascript:;" class="region-picker-closer" title="cancel">&#215;</a>
  <div class="regions">
    <ul class="region-list">
      <li>REGION</li>
      ...more
    </ul>
    ...more
  </div>
</div>
```

## Examples

```javascript
jQuery(function(){
  $('.region-picker').regionPicker()
  .on('picked.rp', function(e, regions){
    console.log(regions);
  })
  .on('initializing.rp', function(e, picker){
    $(this).text('initializing').attr('disabled', true);
  })
  .on('initialized.rp', function(e, picker){
    $(this).text('Pickup a region').attr('disabled', false);
  })
  .on('loading.rp', function(e, picker){
    $(this).text('loading...').attr('disabled', true);
  })
  .on('loaded.rp', function(e, data, picker){
    $(this).text('Pickup a region').attr('disabled', false);
  });
});
```
learn more at examples


## Release History
  * 2013-09-17  v0.0.1  the first version of RegionPicker plugin.

[crp]: https://github.com/xixilive/chineserp
[crd]: https://github.com/xixilive/chinese_region_db
[min]: https://raw.github.com/xixilive/chineserp-jquery/master/dist/jquery.chineserp.min.js
[dev]: https://raw.github.com/xixilive/chineserp-jquery/master/dist/jquery.chineserp.js
[gh]: http://xixilive.github.io/jquery.chineserp