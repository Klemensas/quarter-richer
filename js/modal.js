$(document).ready(function() {
  var modal$ = $('#main-modal');

  $('body').on('click', function(e) {
    var target = e.target;
    var toggle = target.getAttribute('data-toggle');
    if (toggle !== 'modal') { return; }
    
    var targetModal = target.getAttribute('data-modal-id');
    if (!modalData[targetModal]) {
      alert('Wrong modal id.\n\nAvailable options are: ' + modalArray.map(function(item) { return item.slug; }).join(', '));
      return false;
    }

    var z = modal$.modal();
    console.log('sss', modal$, e, z);
  })
  console.log('hi modal')
});
