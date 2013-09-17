(function($) {

  module('core');

  test('$.fn.regionPicker was defined', function(){
    expect(1);
    equal(typeof $(document).regionPicker, 'function');
  });


}(jQuery));
