/* =============================================================
   SkinClair — global.js
   Panier AJAX (drawer), variantes produit, zoom galerie,
   recherche prédictive, pop-up email, animations d'apparition.
   Zéro dépendance externe pour des performances maximales.
   ============================================================= */
(function () {
  'use strict';

  var overlay = null;

  document.addEventListener('DOMContentLoaded', function () {
    overlay = document.querySelector('[data-overlay]');
    initHeader();
    initDrawers();
    initSearchPanel();
    initAnnouncementBar();
    initQuantityInputs(document);
    initAjaxAddForms(document);
    initCartDrawerEvents();
    initCartPage();
    initProduct();
    initSliders();
    initReveal();
    initPopup();
    initNewsletterSuccess();
  });

  /* ---------- Utilitaires ---------- */

  function formatMoney(cents) {
    var format = (window.theme && window.theme.moneyFormat) || '{{amount_with_comma_separator}} €';
    var value = (cents / 100).toFixed(2);
    var parts = value.split('.');
    var amount;
    if (format.indexOf('amount_no_decimals') !== -1) {
      amount = Math.round(cents / 100).toString();
    } else if (format.indexOf('amount_with_comma_separator') !== -1) {
      amount = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ',' + parts[1];
    } else {
      amount = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '.' + parts[1];
    }
    return format.replace(/\{\{\s*amount[^}]*\}\}/, amount);
  }

  function openOverlay() {
    if (!overlay) return;
    overlay.hidden = false;
    requestAnimationFrame(function () { overlay.classList.add('is-visible'); });
  }

  function closeOverlay() {
    if (!overlay) return;
    overlay.classList.remove('is-visible');
    setTimeout(function () { overlay.hidden = true; }, 300);
  }

  function trapEscape(callback) {
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') callback();
    });
  }

  /* ---------- Header ---------- */

  function initHeader() {
    var header = document.querySelector('.site-header');
    if (!header) return;
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Drawers (menu mobile + panier) ---------- */

  var openDrawer = null;

  function toggleDrawer(id, open) {
    var drawer = document.getElementById(id);
    if (!drawer) return;
    var shouldOpen = open !== undefined ? open : !drawer.classList.contains('is-open');
    if (openDrawer && openDrawer !== drawer) {
      openDrawer.classList.remove('is-open');
    }
    drawer.classList.toggle('is-open', shouldOpen);
    document.body.classList.toggle('drawer-open', shouldOpen);
    if (shouldOpen) {
      openDrawer = drawer;
      openOverlay();
      var focusable = drawer.querySelector('button, a, input');
      if (focusable) focusable.focus({ preventScroll: true });
    } else {
      openDrawer = null;
      closeOverlay();
    }
  }

  function closeAllDrawers() {
    if (openDrawer) toggleDrawer(openDrawer.id, false);
    var panel = document.querySelector('.search-panel.is-open');
    if (panel) panel.classList.remove('is-open');
  }

  function initDrawers() {
    document.addEventListener('click', function (e) {
      var opener = e.target.closest('[data-drawer-open]');
      if (opener) {
        e.preventDefault();
        toggleDrawer(opener.getAttribute('data-drawer-open'), true);
        return;
      }
      var closer = e.target.closest('[data-drawer-close]');
      if (closer) {
        e.preventDefault();
        closeAllDrawers();
      }
    });
    if (overlay) overlay.addEventListener('click', closeAllDrawers);
    trapEscape(closeAllDrawers);
  }

  /* ---------- Recherche prédictive ---------- */

  function initSearchPanel() {
    var toggle = document.querySelector('[data-search-toggle]');
    var panel = document.getElementById('SearchPanel');
    if (!toggle || !panel) return;
    var input = panel.querySelector('input[name="q"]');
    var results = panel.querySelector('[data-search-results]');
    var timer = null;

    toggle.addEventListener('click', function () {
      var isOpen = panel.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', isOpen);
      if (isOpen && input) input.focus();
    });

    if (!input || !results) return;

    input.addEventListener('input', function () {
      clearTimeout(timer);
      var q = input.value.trim();
      if (q.length < 2) { results.innerHTML = ''; return; }
      timer = setTimeout(function () {
        var url = window.routes.predictive_search_url +
          '?q=' + encodeURIComponent(q) +
          '&resources[type]=product&resources[limit]=5&section_id=predictive-search';
        fetch(url)
          .then(function (r) { return r.text(); })
          .then(function (html) {
            var doc = new DOMParser().parseFromString(html, 'text/html');
            var inner = doc.querySelector('#PredictiveSearchResults');
            results.innerHTML = inner ? inner.innerHTML : '';
          })
          .catch(function () { results.innerHTML = ''; });
      }, 250);
    });
  }

  /* ---------- Barre d'annonces rotative ---------- */

  function initAnnouncementBar() {
    var bar = document.querySelector('[data-announcement-rotate]');
    if (!bar) return;
    var items = bar.querySelectorAll('.announcement-bar__item');
    if (items.length < 2) return;
    var index = 0;
    setInterval(function () {
      items[index].setAttribute('data-hidden', '');
      index = (index + 1) % items.length;
      items[index].removeAttribute('data-hidden');
    }, 4500);
  }

  /* ---------- Quantités ---------- */

  function initQuantityInputs(scope) {
    scope.querySelectorAll('.qty').forEach(function (qty) {
      if (qty.dataset.bound) return;
      qty.dataset.bound = 'true';
      var input = qty.querySelector('input');
      qty.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-qty-change]');
        if (!btn || !input) return;
        e.preventDefault();
        var delta = parseInt(btn.getAttribute('data-qty-change'), 10);
        var next = Math.max(parseInt(input.min || '0', 10), (parseInt(input.value, 10) || 0) + delta);
        input.value = next;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      });
    });
  }

  /* ---------- Panier AJAX ---------- */

  function refreshCart(openAfter) {
    return fetch(window.routes.root_url + '?sections=cart-drawer')
      .then(function (r) { return r.json(); })
      .then(function (sections) {
        var drawer = document.getElementById('CartDrawer');
        if (drawer && sections['cart-drawer']) {
          var doc = new DOMParser().parseFromString(sections['cart-drawer'], 'text/html');
          var fresh = doc.getElementById('CartDrawer');
          if (fresh) {
            var wasOpen = drawer.classList.contains('is-open');
            drawer.innerHTML = fresh.innerHTML;
            if (wasOpen || openAfter) {
              drawer.classList.add('is-open');
              document.body.classList.add('drawer-open');
              openDrawer = drawer;
            }
            initQuantityInputs(drawer);
          }
        }
        return fetch(window.routes.cart_url + '.js').then(function (r) { return r.json(); });
      })
      .then(function (cart) {
        document.querySelectorAll('[data-cart-count]').forEach(function (el) {
          el.textContent = cart.item_count;
          el.setAttribute('data-count', cart.item_count);
        });
        if (openAfter) openOverlay();
        return cart;
      });
  }

  function initAjaxAddForms(scope) {
    scope.querySelectorAll('form[data-ajax-add]').forEach(function (form) {
      if (form.dataset.bound) return;
      form.dataset.bound = 'true';
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var btn = form.querySelector('[type="submit"]');
        var label = btn ? btn.textContent : '';
        if (btn) { btn.setAttribute('aria-disabled', 'true'); btn.textContent = '…'; }

        fetch(window.routes.cart_add_url + '.js', {
          method: 'POST',
          body: new FormData(form),
          headers: { 'X-Requested-With': 'XMLHttpRequest' }
        })
          .then(function (r) {
            if (!r.ok) return r.json().then(function (err) { throw err; });
            return r.json();
          })
          .then(function () { return refreshCart(true); })
          .then(function () {
            if (btn) {
              btn.textContent = (window.theme.strings && window.theme.strings.added) || '✓';
              setTimeout(function () {
                btn.textContent = label;
                btn.removeAttribute('aria-disabled');
              }, 1600);
            }
          })
          .catch(function (err) {
            if (btn) { btn.textContent = label; btn.removeAttribute('aria-disabled'); }
            alert((err && err.description) || 'Une erreur est survenue. Merci de réessayer.');
          });
      });
    });
  }

  function initCartDrawerEvents() {
    document.addEventListener('change', function (e) {
      var input = e.target.closest('[data-line-qty]');
      if (!input) return;
      changeLine(input.getAttribute('data-line-key'), parseInt(input.value, 10) || 0);
    });
    document.addEventListener('click', function (e) {
      var removeBtn = e.target.closest('[data-line-remove]');
      if (!removeBtn) return;
      e.preventDefault();
      changeLine(removeBtn.getAttribute('data-line-key'), 0);
    });
  }

  function changeLine(key, quantity) {
    fetch(window.routes.cart_change_url + '.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: key, quantity: quantity })
    })
      .then(function (r) { return r.json(); })
      .then(function () {
        if (document.querySelector('[data-cart-page]')) {
          window.location.reload();
        } else {
          refreshCart(false);
        }
      });
  }

  function initCartPage() {
    var page = document.querySelector('[data-cart-page]');
    if (!page) return;
    initQuantityInputs(page);
  }

  /* ---------- Page produit ---------- */

  function initProduct() {
    var root = document.querySelector('[data-product-root]');
    if (!root) return;

    var jsonEl = root.querySelector('[data-product-json]');
    var variants = jsonEl ? JSON.parse(jsonEl.textContent) : [];
    var idInput = root.querySelector('input[name="id"]');
    var priceWrap = root.querySelector('[data-product-price]');
    var atcBtn = root.querySelector('[data-atc-button]');
    var stockEl = root.querySelector('[data-stock-status]');
    var stickyPrice = document.querySelector('[data-sticky-price]');

    /* Sélection de variante */
    root.querySelectorAll('[data-option-input]').forEach(function (input) {
      input.addEventListener('change', onOptionChange);
    });

    function selectedOptions() {
      var opts = [];
      root.querySelectorAll('[data-option-index]').forEach(function (fs) {
        var checked = fs.querySelector('input:checked');
        opts[parseInt(fs.getAttribute('data-option-index'), 10)] = checked ? checked.value : null;
      });
      return opts;
    }

    function onOptionChange() {
      var opts = selectedOptions();
      var match = variants.find(function (v) {
        return v.options.every(function (val, i) { return val === opts[i]; });
      });
      if (!match) return;
      if (idInput) idInput.value = match.id;

      if (priceWrap) {
        var html = '<span class="price__current">' + formatMoney(match.price) + '</span>';
        if (match.compare_at_price && match.compare_at_price > match.price) {
          html += ' <s class="price__compare">' + formatMoney(match.compare_at_price) + '</s>';
          html += ' <span class="price__badge">-' + Math.round((match.compare_at_price - match.price) / match.compare_at_price * 100) + '%</span>';
        }
        priceWrap.querySelector('.price').innerHTML = html;
      }
      if (stickyPrice) stickyPrice.textContent = formatMoney(match.price);

      if (atcBtn) {
        if (match.available) {
          atcBtn.removeAttribute('disabled');
          atcBtn.textContent = window.theme.strings.addToCart;
        } else {
          atcBtn.setAttribute('disabled', '');
          atcBtn.textContent = window.theme.strings.soldOut;
        }
      }
      if (stockEl) stockEl.hidden = !match.available;

      if (match.featured_media && match.featured_media.position) {
        selectMedia(match.featured_media.position - 1);
      }

      var url = new URL(window.location.href);
      url.searchParams.set('variant', match.id);
      window.history.replaceState({}, '', url.toString());
    }

    /* Galerie */
    var mainImg = root.querySelector('[data-main-image]');
    var thumbs = root.querySelectorAll('[data-thumb]');

    function selectMedia(index) {
      var thumb = thumbs[index];
      if (!thumb || !mainImg) return;
      mainImg.src = thumb.getAttribute('data-full-src');
      mainImg.srcset = thumb.getAttribute('data-full-srcset') || '';
      mainImg.alt = thumb.querySelector('img') ? thumb.querySelector('img').alt : '';
      thumbs.forEach(function (t) { t.classList.remove('is-active'); });
      thumb.classList.add('is-active');
    }

    thumbs.forEach(function (thumb, i) {
      thumb.addEventListener('click', function () { selectMedia(i); });
    });

    /* Zoom (survol desktop, tap mobile) */
    var mediaWrap = root.querySelector('[data-zoom-container]');
    if (mediaWrap && mainImg) {
      var zoomed = false;
      function applyZoom(e) {
        var rect = mediaWrap.getBoundingClientRect();
        var x = ((e.clientX - rect.left) / rect.width) * 100;
        var y = ((e.clientY - rect.top) / rect.height) * 100;
        mainImg.style.transformOrigin = x + '% ' + y + '%';
        mainImg.style.transform = 'scale(1.9)';
      }
      function resetZoom() {
        mainImg.style.transform = '';
        mediaWrap.classList.remove('is-zoomed');
        zoomed = false;
      }
      var isTouch = window.matchMedia('(hover: none)').matches;
      if (isTouch) {
        mediaWrap.addEventListener('click', function (e) {
          if (zoomed) { resetZoom(); return; }
          zoomed = true;
          mediaWrap.classList.add('is-zoomed');
          applyZoom(e);
        });
      } else {
        mediaWrap.addEventListener('mousemove', function (e) {
          mediaWrap.classList.add('is-zoomed');
          applyZoom(e);
        });
        mediaWrap.addEventListener('mouseleave', resetZoom);
      }
    }

    /* Barre d'achat mobile fixe */
    var sticky = document.querySelector('[data-sticky-atc]');
    var buyBlock = root.querySelector('.product__buy');
    if (sticky && buyBlock && 'IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        sticky.classList.toggle('is-visible', !entries[0].isIntersecting && entries[0].boundingClientRect.top < 0);
      }, { threshold: 0 });
      io.observe(buyBlock);
      var stickyBtn = sticky.querySelector('[data-sticky-submit]');
      if (stickyBtn) {
        stickyBtn.addEventListener('click', function () {
          var form = root.querySelector('form[data-ajax-add]');
          if (form) form.requestSubmit ? form.requestSubmit() : form.submit();
        });
      }
    }

    /* Recommandations produit */
    var reco = document.querySelector('[data-recommendations]');
    if (reco) {
      var url = reco.getAttribute('data-url');
      fetch(url)
        .then(function (r) { return r.text(); })
        .then(function (html) {
          var doc = new DOMParser().parseFromString(html, 'text/html');
          var inner = doc.querySelector('[data-recommendations]');
          if (inner && inner.innerHTML.trim()) {
            reco.innerHTML = inner.innerHTML;
            initReveal();
            initAjaxAddForms(reco);
            initSliders();
          } else {
            var section = reco.closest('.section');
            if (section) section.remove();
          }
        });
    }
  }

  /* ---------- Sliders (flèches sur rails scroll-snap) ---------- */

  function initSliders() {
    document.querySelectorAll('[data-slider]').forEach(function (slider) {
      if (slider.dataset.bound) return;
      slider.dataset.bound = 'true';
      var track = slider.querySelector('[data-slider-track]');
      if (!track) return;
      slider.querySelectorAll('[data-slider-prev]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          track.scrollBy({ left: -track.clientWidth * 0.8, behavior: 'smooth' });
        });
      });
      slider.querySelectorAll('[data-slider-next]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          track.scrollBy({ left: track.clientWidth * 0.8, behavior: 'smooth' });
        });
      });
    });
  }

  /* ---------- Apparition au scroll ---------- */

  function initReveal() {
    var els = document.querySelectorAll('.reveal:not(.is-visible)');
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (entry.isIntersecting) {
          entry.target.style.transitionDelay = Math.min(i * 60, 240) + 'ms';
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Pop-up newsletter ---------- */

  function initPopup() {
    var popup = document.getElementById('NewsletterPopup');
    if (!popup) return;
    var key = 'skinclair-popup-dismissed';
    var days = parseInt(popup.getAttribute('data-frequency') || '7', 10);
    var delay = parseInt(popup.getAttribute('data-delay') || '6', 10) * 1000;

    var dismissedAt = null;
    try { dismissedAt = localStorage.getItem(key); } catch (e) { /* stockage indisponible */ }
    if (dismissedAt && Date.now() - parseInt(dismissedAt, 10) < days * 86400000) return;
    if (/customer_posted=true/.test(window.location.search)) { dismiss(); return; }

    function dismiss() {
      popup.classList.remove('is-open');
      try { localStorage.setItem(key, Date.now().toString()); } catch (e) { /* ignore */ }
    }

    setTimeout(function () {
      if (document.body.classList.contains('drawer-open')) return;
      popup.classList.add('is-open');
    }, delay);

    popup.querySelectorAll('[data-popup-close]').forEach(function (btn) {
      btn.addEventListener('click', dismiss);
    });
    var form = popup.querySelector('form');
    if (form) {
      form.addEventListener('submit', function () {
        try { localStorage.setItem(key, Date.now().toString()); } catch (e) { /* ignore */ }
      });
    }
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && popup.classList.contains('is-open')) dismiss();
    });
  }

  /* ---------- Confirmation inscription newsletter ---------- */

  function initNewsletterSuccess() {
    if (!/customer_posted=true/.test(window.location.search)) return;
    var target = document.querySelector('[data-newsletter-success]');
    if (target) {
      target.hidden = false;
      target.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  }
})();
