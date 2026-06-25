document.addEventListener('DOMContentLoaded', function () {
  var forms = document.querySelectorAll('#waitlistForm');

  forms.forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var inputs = form.querySelectorAll('input, select');
      var data = {};
      inputs.forEach(function (input) {
        if (input.name) {
          data[input.name] = input.value;
        } else if (input.placeholder) {
          data[input.placeholder] = input.value;
        } else if (input.tagName === 'SELECT') {
          data['rol'] = input.value;
        }
      });

      var entries = JSON.parse(localStorage.getItem('colectiba_waitlist') || '[]');
      entries.push({ data: data, timestamp: new Date().toISOString() });
      localStorage.setItem('colectiba_waitlist', JSON.stringify(entries));

      form.style.display = 'none';
      var success = document.getElementById('waitlistSuccess');
      if (success) {
        success.style.display = 'block';
      }
    });
  });

  var nav = document.querySelector('.nav');
  var lastScroll = 0;
  window.addEventListener('scroll', function () {
    var currentScroll = window.pageYOffset;
    if (currentScroll > 100) {
      nav.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)';
    } else {
      nav.style.boxShadow = 'none';
    }
    lastScroll = currentScroll;
  });
});
