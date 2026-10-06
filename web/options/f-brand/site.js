// Five jobs: draw the brand mosaic, mark the nav on scroll, play the hero answer once, copy code, send the access form.
(function () {
  "use strict";

  var root = document.documentElement;

  // Brand mosaic. Draw square tiles graded from deep cobalt to pale blue.
  // A fixed seed gives the same tiles on every load.
  var STOPS = [
    [0, [1, 64, 203]], [0.3, [2, 101, 241]], [0.52, [34, 126, 253]],
    [0.72, [82, 156, 253]], [0.87, [128, 182, 252]], [1, [160, 200, 251]]
  ];
  function getShade(t) {
    t = Math.max(0, Math.min(1, t));
    for (var i = 1; i < STOPS.length; i += 1) {
      if (t <= STOPS[i][0]) {
        var low = STOPS[i - 1], high = STOPS[i];
        var k = (t - low[0]) / (high[0] - low[0]);
        return low[1].map(function (value, j) { return value + (high[1][j] - value) * k; });
      }
    }
    return STOPS[STOPS.length - 1][1];
  }
  function getRandom(seed) {
    return function () {
      seed = (seed + 0x6d2b79f5) | 0;
      var x = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x;
      return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
    };
  }
  function drawMosaic(band, withGlint) {
    var box = band.querySelector(".mosaic");
    var width = band.clientWidth, height = band.clientHeight;
    if (!box || !width || !height) return;
    var narrow = width < 760;
    var tile = narrow ? 48 : (width < 1120 ? 96 : 112);
    var cols = Math.ceil(width / tile), rows = Math.ceil(height / tile) + 2;
    var reverse = band.getAttribute("data-mosaic") === "reverse";
    // On a phone the text covers the full width, so use only the deeper half of the scale.
    var span = narrow ? 0.42 : 1;
    var random = getRandom(reverse ? 29 : 11);
    var parts = [];
    var glints = [];
    for (var r = 0; r < rows; r += 1) {
      for (var c = 0; c < cols; c += 1) {
        var t = (c + 0.5) / cols;
        if (reverse) t = 1 - t;
        t = t * span + (r / Math.max(rows - 1, 1)) * 0.05;
        var rgb = getShade(t);
        var jitter = (random() - 0.5) * 0.07;
        rgb = rgb.map(function (value) {
          return Math.round(jitter > 0 ? value + (255 - value) * jitter : value * (1 + jitter));
        });
        parts.push('<rect x="' + c * tile + '" y="' + r * tile + '" width="' + tile + '" height="' + tile +
          '" fill="rgb(' + rgb.join(",") + ')"/>');
        if (withGlint && random() < 0.07 && glints.length < 7) glints.push([c, r]);
      }
    }
    // Lighter seams between tiles.
    var seams = [];
    for (var x = 1; x < cols; x += 1) seams.push('M' + (x * tile - 0.5) + ' 0V' + rows * tile);
    for (var y = 1; y < rows; y += 1) seams.push('M0 ' + (y * tile - 0.5) + 'H' + cols * tile);
    var glintMarks = glints.map(function (cell, index) {
      return '<rect class="glint" x="' + cell[0] * tile + '" y="' + cell[1] * tile + '" width="' + tile + '" height="' + tile +
        '" fill="#fff" style="animation-delay:' + (200 + index * 260) + 'ms"/>';
    }).join("");
    box.innerHTML = '<svg width="' + cols * tile + '" height="' + rows * tile + '" aria-hidden="true" focusable="false">' +
      parts.join("") + glintMarks +
      '<path d="' + seams.join("") + '" stroke="rgba(255,255,255,0.09)" stroke-width="1" fill="none"/></svg>';
    band.setAttribute("data-width", width);
    band.setAttribute("data-height", rows * tile);
  }
  var bands = document.querySelectorAll("[data-mosaic]");
  var motion = root.classList.contains("motion");
  bands.forEach(function (band) { drawMosaic(band, motion && band.classList.contains("band-hero")); });
  if (window.ResizeObserver) {
    var watcher = new ResizeObserver(function (entries) {
      entries.forEach(function (entry) {
        var band = entry.target;
        // Draw again only when the width changes or the band grows past the tiles.
        if (String(band.clientWidth) !== band.getAttribute("data-width") ||
          band.clientHeight > Number(band.getAttribute("data-height"))) drawMosaic(band, false);
      });
    });
    bands.forEach(function (band) { watcher.observe(band); });
  }

  // Nav hairline after the first scroll.
  var nav = document.querySelector(".nav");
  function markNav() { if (nav) nav.classList.toggle("scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", markNav, { passive: true });
  markNav();

  // Hero answer. Split the reply into words, then start the sequence once.
  function playDemo() {
    var demo = document.getElementById("demo");
    if (!demo || !root.classList.contains("motion") || root.classList.contains("played")) return;
    var text = demo.querySelector(".reply-text");
    if (text) {
      var index = 0;
      var walker = document.createTreeWalker(text, NodeFilter.SHOW_TEXT);
      var nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      nodes.forEach(function (node) {
        var parts = node.textContent.split(/(\s+)/);
        var fragment = document.createDocumentFragment();
        parts.forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) { fragment.appendChild(document.createTextNode(part)); return; }
          var span = document.createElement("span");
          span.className = "w";
          span.textContent = part;
          span.style.animationDelay = (560 + index * 30) + "ms";
          index += 1;
          fragment.appendChild(span);
        });
        node.parentNode.replaceChild(fragment, node);
      });
    }
    requestAnimationFrame(function () { demo.classList.add("play"); });
  }
  if (document.fonts && document.fonts.ready) {
    var started = false;
    var go = function () { if (!started) { started = true; playDemo(); } };
    document.fonts.ready.then(go);
    setTimeout(go, 600);
  } else {
    playDemo();
  }

  // Copy buttons.
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    return new Promise(function (resolve, reject) {
      var area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      var done = false;
      try { done = document.execCommand("copy"); } catch (error) { done = false; }
      document.body.removeChild(area);
      if (done) resolve(); else reject(new Error("copy failed"));
    });
  }
  document.querySelectorAll("[data-copy]").forEach(function (button) {
    var label = button.querySelector("span");
    var timer;
    button.addEventListener("click", function () {
      copyText(button.getAttribute("data-copy")).then(function () {
        label.textContent = "Copied";
        button.classList.add("is-copied");
      }, function () {
        label.textContent = "Select and copy";
      }).then(function () {
        clearTimeout(timer);
        timer = setTimeout(function () {
          label.textContent = "Copy";
          button.classList.remove("is-copied");
        }, 2000);
      });
    });
  });

  // Access form. Validate, then POST JSON {site, email} to /access.
  var ICON_OK = '<svg aria-hidden="true" viewBox="0 0 16 16"><path d="M3.5 8.4l2.8 2.8 6.2-6.4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var ICON_ERROR = '<svg aria-hidden="true" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M8 4.8v3.6M8 10.8v.2" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';

  function cleanSite(value) {
    var text = value.trim();
    if (!text) return "";
    if (!/^https?:\/\//i.test(text)) text = "https://" + text;
    try {
      var url = new URL(text);
      if (!/^[^.\s]+(\.[^.\s]+)+$/.test(url.hostname)) return "";
      return url.origin + (url.pathname === "/" ? "" : url.pathname);
    } catch (error) {
      return "";
    }
  }
  function checkEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
  }
  function escapeText(text) {
    var box = document.createElement("span");
    box.textContent = text;
    return box.innerHTML;
  }
  function setError(input, message) {
    var box = document.getElementById(input.getAttribute("aria-describedby"));
    if (message) {
      input.setAttribute("aria-invalid", "true");
      box.textContent = message;
      box.hidden = false;
    } else {
      input.removeAttribute("aria-invalid");
      box.textContent = "";
      box.hidden = true;
    }
  }

  document.querySelectorAll("form[data-access]").forEach(function (form) {
    var siteInput = form.querySelector('input[name="site"]');
    var emailInput = form.querySelector('input[name="email"]');
    var button = form.querySelector(".btn-submit");
    var buttonLabel = button.querySelector(".btn-label");
    var status = form.querySelector(".access-status");

    [siteInput, emailInput].forEach(function (input) {
      input.addEventListener("input", function () {
        if (input.getAttribute("aria-invalid") === "true") setError(input, "");
      });
    });

    function validate() {
      var site = cleanSite(siteInput.value);
      var emailOk = checkEmail(emailInput.value);
      setError(siteInput, site ? "" : (siteInput.value.trim() ? "Enter a full website address, like acme.com." : "Enter your website, like acme.com."));
      setError(emailInput, emailOk ? "" : (emailInput.value.trim() ? "Enter a valid work email, like you@acme.com." : "Enter your work email."));
      if (!site) { siteInput.focus(); return null; }
      if (!emailOk) { emailInput.focus(); return null; }
      return { site: site, email: emailInput.value.trim() };
    }

    function send(data) {
      status.innerHTML = "";
      button.disabled = true;
      button.setAttribute("aria-busy", "true");
      buttonLabel.textContent = "Sending";
      fetch("/access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      }).then(function (response) {
        if (!response.ok) throw new Error("status " + response.status);
        form.classList.add("is-done");
        var host = data.site.replace(/^https?:\/\//, "");
        status.innerHTML = '<div class="status status-ok">' + ICON_OK +
          '<p><strong>Thank you. We are building your agent for ' + escapeText(host) + '.</strong><br>' +
          'We will email ' + escapeText(data.email) + ' when your preview is ready.</p></div>';
      }).catch(function () {
        status.innerHTML = '<div class="status status-error">' + ICON_ERROR +
          '<div><p><strong>We could not send your request.</strong> Check your connection, then try again.</p>' +
          '<button type="button" class="retry-button">Try again</button></div></div>';
        var retry = status.querySelector(".retry-button");
        retry.addEventListener("click", function () { send(data); });
        retry.focus();
      }).then(function () {
        button.disabled = false;
        button.removeAttribute("aria-busy");
        buttonLabel.textContent = "Get your agent";
      });
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var data = validate();
      if (data) send(data);
    });
  });
})();
