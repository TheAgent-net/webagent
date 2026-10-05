// agentnet homepage, option D.
// Three jobs: send the access form, copy the install tag, play the demo once.

(function () {
  "use strict";

  var ICON_OK = '<svg class="icon" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="7.25"/><path d="m6.75 10.25 2.25 2.25 4.25-4.75"/></svg>';
  var ICON_ERROR = '<svg class="icon" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="7.25"/><path d="M10 6.25v4.5M10 13.5v.25"/></svg>';

  // Nav: show a hairline after the page scrolls.
  var nav = document.querySelector(".nav");
  function setNavLine() {
    if (nav) nav.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", setNavLine, { passive: true });
  setNavLine();

  // Access form.

  function getSite(value) {
    var text = value.trim();
    if (!text) return { error: "Enter your website address." };
    var candidate = /^https?:\/\//i.test(text) ? text : "https://" + text;
    try {
      var url = new URL(candidate);
      if (!/\.[a-z]{2,}$/i.test(url.hostname)) throw new Error("no domain");
      return { value: url.origin + (url.pathname === "/" ? "" : url.pathname) };
    } catch (error) {
      return { error: "Enter a website address like acme.com." };
    }
  }

  function getEmail(value) {
    var text = value.trim();
    if (!text) return { error: "Enter your work email." };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(text)) return { error: "Enter an email address like you@acme.com." };
    return { value: text };
  }

  function showFieldError(input, message) {
    var error = document.getElementById(input.getAttribute("aria-describedby"));
    if (message) {
      input.setAttribute("aria-invalid", "true");
      error.textContent = message;
      error.hidden = false;
    } else {
      input.removeAttribute("aria-invalid");
      error.textContent = "";
      error.hidden = true;
    }
  }

  function escapeText(text) {
    var node = document.createElement("span");
    node.textContent = text;
    return node.innerHTML;
  }

  function setBusy(form, busy) {
    var button = form.querySelector('button[type="submit"]');
    var label = button.querySelector(".button-label");
    button.disabled = busy;
    label.textContent = busy ? "Sending" : "Get your agent";
    form.setAttribute("aria-busy", busy ? "true" : "false");
  }

  function sendForm(form) {
    var siteInput = form.querySelector('input[name="site"]');
    var emailInput = form.querySelector('input[name="email"]');
    var status = form.querySelector(".form-status");
    var site = getSite(siteInput.value);
    var email = getEmail(emailInput.value);

    showFieldError(siteInput, site.error);
    showFieldError(emailInput, email.error);
    status.innerHTML = "";

    if (site.error || email.error) {
      (site.error ? siteInput : emailInput).focus();
      return;
    }

    setBusy(form, true);

    fetch("/access", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ site: site.value, email: email.value })
    })
      .then(function (response) {
        if (!response.ok) throw new Error("status " + response.status);
        form.classList.add("is-done");
        status.innerHTML =
          '<div class="status status-ok">' + ICON_OK +
          "<div><strong>Thank you. Your agent is on the way.</strong>" +
          "We will build a preview from " + escapeText(site.value) +
          " and email " + escapeText(email.value) + " when it is ready.</div></div>";
        status.querySelector(".status").setAttribute("tabindex", "-1");
        status.querySelector(".status").focus();
      })
      .catch(function () {
        status.innerHTML =
          '<div class="status status-error">' + ICON_ERROR +
          "<div><strong>We could not send your request.</strong>" +
          "Your details are still here. Check your connection, then try again." +
          '<br><button class="status-retry" type="button">Try again</button></div></div>';
        status.querySelector(".status-retry").addEventListener("click", function () {
          sendForm(form);
        });
      })
      .then(function () {
        setBusy(form, false);
      });
  }

  document.querySelectorAll("form[data-access]").forEach(function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      sendForm(form);
    });
    form.querySelectorAll("input").forEach(function (input) {
      input.addEventListener("input", function () {
        if (input.getAttribute("aria-invalid") === "true") showFieldError(input, "");
      });
    });
  });

  // Copy button.

  document.querySelectorAll("[data-copy]").forEach(function (button) {
    var label = button.querySelector(".copy-label");
    var timer;
    button.addEventListener("click", function () {
      var source = document.querySelector(button.getAttribute("data-copy"));
      var text = source ? source.textContent : "";
      var done = function () {
        button.classList.add("is-copied");
        label.textContent = "Copied";
        clearTimeout(timer);
        timer = setTimeout(function () {
          button.classList.remove("is-copied");
          label.textContent = "Copy";
        }, 2000);
      };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(done, function () { copyByRange(text) && done(); });
      } else if (copyByRange(text)) {
        done();
      }
    });
  });

  function copyByRange(text) {
    var area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    var copied = false;
    try { copied = document.execCommand("copy"); } catch (error) { copied = false; }
    document.body.removeChild(area);
    return copied;
  }

  // Demo: the answer streams in, then the table rows settle.

  var demo = document.querySelector("[data-demo]");
  var replay = document.querySelector("[data-replay]");
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (demo && !reduced.matches) {
    var index = 0;
    demo.querySelectorAll("[data-stream]").forEach(function (answer) {
      splitWords(answer);
    });
    function splitWords(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType === 3) {
          var parts = child.textContent.split(/(\s+)/);
          var fragment = document.createDocumentFragment();
          parts.forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) {
              fragment.appendChild(document.createTextNode(part));
            } else {
              var word = document.createElement("span");
              word.className = "w";
              word.style.setProperty("--i", index++);
              word.textContent = part;
              fragment.appendChild(word);
            }
          });
          node.replaceChild(fragment, child);
        } else if (child.nodeType === 1) {
          splitWords(child);
        }
      });
    }
    demo.querySelectorAll("[data-rows] tbody tr").forEach(function (row, rowIndex) {
      row.style.setProperty("--r", rowIndex);
    });

    var play = function () {
      demo.classList.remove("is-playing");
      void demo.offsetWidth;
      demo.classList.add("is-playing");
      if (replay) replay.hidden = true;
      setTimeout(function () { if (replay) replay.hidden = false; }, 3000);
    };

    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
          play();
          observer.disconnect();
        }
      }, { threshold: 0.25 });
      observer.observe(demo);
    } else {
      play();
    }

    if (replay) replay.addEventListener("click", play);
  }
})();
