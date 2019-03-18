$(document).ready(function() {
  var introHeader = 'Official savings survey';
  var regularHeader = 'Complete your savings profile and you could save $800.00';
  var lastQuestionHeader = 'Your potential savings will be revealed';
  var urgencyMessages = [
    'Don\'t let todays deal go unclaimed!!!',
    'Take action before the final deadline!!!',
    'Limited time offering!<br>Claim now!!!',
    'Take action now!<br>Your savings await!!!',
  ];

  var modal$ = $('#main-modal');
  var itemId = 0;

  $('body').on('click', function(e) {
    var target = e.target;
    var toggle = target.getAttribute('data-toggle');
    if (toggle !== 'modal') { return; }
    
    var targetModal = target.getAttribute('data-modal-id');
    if (!modalData[targetModal]) {
      alert('Wrong modal id.\n\nAvailable options are: ' + modalArray.map(function(item) { return item.slug; }).join(', '));
      return false;
    }

    setModalContent(modal$.find('.modal-content'), modalData[targetModal]);
    modal$.modal();
  })

  function setModalContent(modalContent$, modalData) {
    var pages = [];

    pages.push(generatePage(
      introHeader,
      generateIntro(),
      generateFooter(
        'Next',
        0,
        modalData.questions.length,
        urgencyMessages[0]
      ),
    ));

    for (var i = 0; i < modalData.questions.length; i++) {
      var targetHeader = modalData.questions.length - 1 === i ?lastQuestionHeader : regularHeader;
      pages.push(generatePage(
        targetHeader,
        generatePageQuestion(modalData.questions[i]),
        generateFooter(
          'Next',
          i + 1,
          modalData.questions.length,
          urgencyMessages[(i + 1) % urgencyMessages.length],
        ),
      ));
    }

    pages.push(generatePage(
      null,
      generateOutro(modalData.referral),
      null,
    ));

    var modalSlider$ = $('<div class="modal-content-slider"></div>');
    modalSlider$.append(pages);
    modalContent$.html(modalSlider$);
  }

  function generatePage(headerContent, content, footer) {
    var content$ = $('<div class="modal-page-content"></div>');
    content$.append(content);

    var page$ = $('<div class="modal-page"></div>');
    page$.append($('<div class="modal-page-header">' + headerContent + '</div>'));
    page$.append(content);
    page$.append(footer);
    return page$;
  }

  function generateIntro() {
    return $('<p>Intro page</p>');
  }

  function generateOutro(referral) {
    // TODO
    return $('<h1>That\'s all folks!</h1>')
  }


  function generatePageQuestion(item) {
    var content = [($('<p class="page-question">' + item.question + '</p>'))];
    switch (item.response) {
      case 'text':
        return content.concat($('<input type="text" required />'));
      case 'textarea':
        return content.concat($('<textarea required></textarea>'));
      case 'checkbox':
      case 'radio': {
        if (item.options && item.options.length) {
          return content.concat(generateOptionList(item.options, item.response));
        }
        return content.concat($('Missing options'));
      }
    }
  }

  function generateFooter(actionText, step, stepCount, urgencyMessage) {
    var button = $('<button>' + actionText + '</button>');
    button.on('click', function() { togglePage(step + 1); });
    var nextStep = $('<div class="next-step"></div>');
    nextStep.append(button);

    var width = (step + 1) / (stepCount + 1) * 100 + '%';
    var stepPosition = $('<div class="step-position"><div class="current-step" style="width: ' + width + '"></div></div>');
    var urgency = $('<div class="notice-message"><div class="message">' + urgencyMessage + '</div></div>')
    return [nextStep, stepPosition, urgency];
  }

  function generateOptionList(options, type) {
    var name = itemId;
    return $(options.map(function(option, i) {
      var id = option + i + ++itemId;
      return '\
        <div class="form-check">\
          <input class="form-check-input" name="' + name + '" type="' + type + '" value="' + option +'" id="' + id + '">\
          <label class="form-check-label" for="' + id + '">' + option + '</label>\
        </div>\
      '
    }).join('\n'));
  }

  function togglePage(page) {
    var slider$ = $('.modal-content-slider');
    var position = page * -100 + '%';
    slider$.css('transform', 'translate3d(' + position + ', 0, 0)');
  }
});
