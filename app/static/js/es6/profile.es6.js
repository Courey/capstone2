(function(){
  'use strict';
  $(document).ready(init);

  function init(){
    getUserId();
  }

  function getUserId(){
    var userId = $('.profile').attr('data-userId');
    console.log(userId);
  }

  
})();
