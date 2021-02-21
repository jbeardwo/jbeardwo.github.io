$(document).ready(function(){
  $('#menu .button').click(function() {
      if ($(this).hasClass('active')) return false;
      var name = $(this).attr('id');
      var $visible = $('#main .content:visible');
      $('.active').removeClass('active');
      $(this).addClass('active');
      if ($visible.length == 0) showContent(name);
      else $visible.fadeOut(500, function() {
          showContent(name);
      });
  });
})

function showContent(name)
{
    $('#main .' + name).fadeIn(500);
}
