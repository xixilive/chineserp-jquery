$(function(){
  $('#demo1 .region-picker').regionPicker().on('picked.rp', function(e, regions){
    $('#demo1 input').val(regions.map(function(r){ return r.n; }).join(", "));
  });
});
