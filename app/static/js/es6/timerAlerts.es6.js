(function(){
  'use strict';
  $(document).ready(init);

  function init(){
    getAlerts();
  }

  function getAlerts(){
    alert('hi');
    ajax('/alerts/load', 'put', null, alerts=>{
      console.log(alerts);
    }, 'json');
  }


})();

function ajax(url, type,  data={}, success=response=>console.log(response), dataType='html'){
  'use strict';
  $.ajax({url: url, type: type, data: data, dataType: dataType, success:success});
}
