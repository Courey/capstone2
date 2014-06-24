/* jshint unused:false*/
(function(){
  'use strict';
  $(document).ready(init);

  function init(){
    $('div.bhoechie-tab-menu>div.list-group>a').click(doStuff);
  }

  function doStuff(e){
    e.preventDefault();
    $(this).siblings('a.active').removeClass('active');
    $(this).addClass('active');
    var index = $(this).index();
    $('div.bhoechie-tab>div.bhoechie-tab-content').removeClass('active');
    $('div.bhoechie-tab>div.bhoechie-tab-content').eq(index).addClass('active');
  }

})();

function ajax(url, type,  data={}, success=response=>console.log(response), dataType='html'){
  'use strict';
  $.ajax({url: url, type: type, data: data, dataType: dataType, success:success});
}
