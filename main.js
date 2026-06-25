var SUPABASE_URL = 'https://offjpauzkpwibrgasdgl.supabase.co';
var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mZmpwYXV6a3B3aWJyZ2FzZGdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzMjM2MjgsImV4cCI6MjA5Nzg5OTYyOH0.CQSDiLKOWNhH0ij4ySUnSh9yOQsmM-RklwXpRiBYPvI';

function supabaseInsert(table, data) {
  return fetch(SUPABASE_URL + '/rest/v1/' + table, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify(data)
  });
}

document.addEventListener('DOMContentLoaded', function () {
  var forms = document.querySelectorAll('#waitlistForm');

  forms.forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var btn = form.querySelector('button[type="submit"]');
      var originalText = btn.textContent;
      btn.textContent = 'Enviando...';
      btn.disabled = true;

      var data = {};
      var inputs = form.querySelectorAll('input, select');
      inputs.forEach(function (input) {
        if (input.name && input.value) {
          data[input.name] = input.value.trim();
        }
      });

      data.pagina = window.location.pathname.replace(/\//g, '').replace('.html', '') || 'index';

      supabaseInsert('waitlist', data)
        .then(function (res) {
          if (res.ok) {
            form.style.display = 'none';
            var success = document.getElementById('waitlistSuccess');
            if (success) success.style.display = 'block';
          } else {
            return res.json().then(function (err) {
              if (err.code === '23505') {
                form.style.display = 'none';
                var success = document.getElementById('waitlistSuccess');
                if (success) {
                  success.querySelector('h3').textContent = 'Ya te registraste antes';
                  success.querySelector('p').textContent = 'Este email ya está en la lista. Te vamos a avisar cuando estemos listos.';
                  success.style.display = 'block';
                }
              } else {
                btn.textContent = 'Error, intentá de nuevo';
                btn.disabled = false;
                setTimeout(function () { btn.textContent = originalText; }, 3000);
              }
            });
          }
        })
        .catch(function () {
          btn.textContent = 'Error, intentá de nuevo';
          btn.disabled = false;
          setTimeout(function () { btn.textContent = originalText; }, 3000);
        });
    });
  });

  var nav = document.querySelector('.nav');
  window.addEventListener('scroll', function () {
    if (window.pageYOffset > 100) {
      nav.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)';
    } else {
      nav.style.boxShadow = 'none';
    }
  });
});
