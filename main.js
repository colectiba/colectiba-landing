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

  // Lógica de Pestañas (Tab Switcher) para "Cómo funciona"
  var tabButtons = document.querySelectorAll('.tab-btn');
  var tabPanels = document.querySelectorAll('.tab-panel');

  tabButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      tabButtons.forEach(function (b) {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      tabPanels.forEach(function (p) {
        p.classList.remove('active');
        p.style.display = 'none';
      });

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      var targetId = btn.getAttribute('aria-controls');
      var targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('active');
        targetPanel.style.display = 'block';
      }
    });
  });

  // Cerrar menú móvil al hacer click en enlaces de la sección
  var navLinksContainer = document.querySelector('.nav__links');
  var mobileToggle = document.querySelector('.nav__mobile-toggle');
  var menuLinks = document.querySelectorAll('.nav__links a');

  menuLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      if (navLinksContainer && navLinksContainer.classList.contains('open')) {
        navLinksContainer.classList.remove('open');
      }
      if (mobileToggle && mobileToggle.getAttribute('aria-expanded') === 'true') {
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Actualizar estadísticas reales desde el backend
  var apiBase = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000'
    : 'https://app.colectiba.com';

  function animateValue(obj, start, end, duration, prefix) {
    prefix = prefix || '';
    if (start === end) {
      obj.textContent = prefix + end;
      return;
    }
    var range = end - start;
    if (range <= 0) {
      obj.textContent = prefix + end;
      return;
    }
    var current = start;
    var stepTime = 20; // 50 fps
    var stepsCount = duration / stepTime;
    var stepValue = range / stepsCount;

    var timer = setInterval(function () {
      current += stepValue;
      if (current >= end) {
        obj.textContent = prefix + end;
        clearInterval(timer);
      } else {
        obj.textContent = prefix + Math.floor(current);
      }
    }, stepTime);
  }

  fetch(apiBase + '/api/landing-stats')
    .then(function (res) { return res.json(); })
    .then(function (res) {
      if (res && res.ok && res.data) {
        var elArtists = document.getElementById('stat-artists');
        var elCurators = document.getElementById('stat-curators-galleries');
        var elArtworks = document.getElementById('stat-artworks');

        if (elArtists) animateValue(elArtists, 0, res.data.artists, 1000, '+');
        if (elCurators) animateValue(elCurators, 0, res.data.curatorsAndGalleries, 1000, '+');
        if (elArtworks) animateValue(elArtworks, 0, res.data.artworks, 1000, '+');
      }
    })
    .catch(function (err) {
      console.warn('Error fetching landing stats:', err);
    });
});
