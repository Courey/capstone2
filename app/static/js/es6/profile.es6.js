(function(){
  'use strict';
  $(document).ready(init);

  function init(){
    getUserId();
  }

  function getUserId(){
    var userId = $('.profile').attr('data-userId');
    console.log(userId);
    // BootstrapDialog.show({
    //   title: 'this is a modal',
    //   message: 'you did it'
    //
    // });
  }


})();
