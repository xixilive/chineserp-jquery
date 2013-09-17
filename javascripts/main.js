$(function(){
  function regionInfo(r){
    var list = [];
    list.push('<li>ID = '+ r.i +'</li>');
    list.push('<li>Name = '+ r.n +'</li>');
    list.push('<li>Alias = '+ r.a +'</li>');
    list.push('<li>Pinyin = '+ r.y +'</li>');
    list.push('<li>Abbr = '+ r.b +'</li>');
    list.push('<li>Postcode = '+ r.z +'</li>');
    return '<ul>'+ list.join("\n") +'</ul>'
  };

  $('#demo1 .region-picker').regionPicker().on('picked.rp', function(e, regions){
    $('#demo1 input').val(regions.map(function(r){ return r.n; }).join(", "));
  });

  $('#demo2 .region-picker').regionPicker().on('picked.rp', function(e, regions){
    $('#regions-info').html(regions.map(function(r){ return regionInfo(r); }).join("\n"));
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
