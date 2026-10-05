// Four jobs: mark the nav on scroll, play the hero answer once, copy code, send the access form.
(function () {
  "use strict";

  var root = document.documentElement;

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
