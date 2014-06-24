/* jshint unused:false*/
(function(){
  'use strict';
  $(document).ready(init);

  function init(){
    getAlerts();
    $('#mood').on('change', changeMood);
    $('#enableProximity').click(enableProximity);
  }

  function getAlerts(){
    //alert('hi');
    ajax('/alerts/load', 'put', null, alerts=>{
      console.log(alerts);
    }, 'json');
  }
  function changeMood(){
    var mood = $('#mood').val();
    ajax(`/alerts/changeStatus/${mood}`, 'put', null, ()=>{});
  }

  function enableProximity(){
    console.log('enable proximity hit');
    ajax(`/alerts/enable/proximity`, 'put', null, ()=>{});
  }



})();

function ajax(url, type,  data={}, success=response=>console.log(response), dataType='html'){
  'use strict';
  $.ajax({url: url, type: type, data: data, dataType: dataType, success:success});
}
