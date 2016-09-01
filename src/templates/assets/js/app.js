$(document).ready(function(){
  $('.panel').on('mouseenter', function(){
    $(this).addClass("panel-info");
  });

  $('.panel').on('mouseleave', function(){
    $(this).removeClass("panel-info");
  });
})
