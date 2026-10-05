// agentnet option B. Form, copy, and "Explain more". No framework.

(function () {
  "use strict";

  /* ---------- Access form ---------- */

  var form = document.getElementById("get");
  if (form) {
    var site = form.querySelector("#site");
    var email = form.querySelector("#email");
    var submit = form.querySelector("[data-submit]");
    var status = form.querySelector("[data-status]");
    var body = form.querySelector("[data-form-body]");
    var label = submit.textContent;
    var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    function getSite(value) {
      var text = value.trim();
      if (!text) return null;
      if (!/^https?:\/\//i.test(text)) text = "https://" + text;
      try {
        var url = new URL(text);
        if (url.hostname.indexOf(".") < 1 || /\s/.test(value.trim())) return null;
        return url.origin + (url.pathname === "/" ? "" : url.pathname);
      } catch (error) {
        return null;
      }
    }

    function showError(input, message) {
      var error = document.getElementById(input.id + "-error");
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

    function checkSite() {
      if (!site.value.trim()) { showError(site, "Write your website address, for example acme.com."); return false; }
      if (!getSite(site.value)) { showError(site, "This does not look like a website address. Try acme.com."); return false; }
      showError(site, ""); return true;
    }

    function checkEmail() {
      var value = email.value.trim();
      if (!value) { showError(email, "Write your work email so we can send your preview."); return false; }
      if (!EMAIL_PATTERN.test(value)) { showError(email, "This email is not complete. Check for an @ and a domain."); return false; }
      showError(email, ""); return true;
    }

    site.addEventListener("blur", function () { if (site.value.trim()) checkSite(); });
    email.addEventListener("blur", function () { if (email.value.trim()) checkEmail(); });
    site.addEventListener("input", function () { if (site.getAttribute("aria-invalid")) checkSite(); });
    email.addEventListener("input", function () { if (email.getAttribute("aria-invalid")) checkEmail(); });

    function setBusy(busy) {
      submit.disabled = busy;
      submit.textContent = busy ? "Sending..." : label;
      form.setAttribute("aria-busy", busy ? "true" : "false");
    }

    function showFailure() {
      status.innerHTML =
        '<div class="notice notice-error" role="alert">' +
        '<svg class="icon" aria-hidden="true"><use href="#alert"/></svg>' +
        "<div><p><strong>We could not send your request.</strong></p>" +
        "<p>Our server did not answer. Your details are still here. Try again in a moment.</p>" +
        '<button class="retry" type="button" data-retry>Try again</button></div></div>';
      status.querySelector("[data-retry]").addEventListener("click", send);
    }

    function showThanks(siteValue, emailValue) {
      var host = siteValue.replace(/^https?:\/\//, "");
      body.innerHTML =
        '<div class="thanks" role="status" tabindex="-1">' +
        '<span class="hand"></span>' +
        "<p><strong>Thank you. We have your site.</strong> We will build a preview from its pages.</p>" +
        "<p></p></div>";
      body.querySelector(".hand").textContent = host;
      body.querySelectorAll("p")[1].textContent = "We will email " + emailValue + " when your preview is ready.";
      body.querySelector(".thanks").focus();
    }

    function send() {
      var siteValue = getSite(site.value);
      var emailValue = email.value.trim();
      status.innerHTML = "";
      setBusy(true);
      fetch("/access", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ site: siteValue, email: emailValue })
      })
        .then(function (response) {
          if (!response.ok) throw new Error("status " + response.status);
          showThanks(siteValue, emailValue);
        })
        .catch(function () {
          setBusy(false);
          showFailure();
        });
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      status.innerHTML = "";
      var siteOk = checkSite();
      var emailOk = checkEmail();
      if (!siteOk) { site.focus(); return; }
      if (!emailOk) { email.focus(); return; }
      send();
    });
  }

  /* ---------- Buttons that go to the form ---------- */

  document.querySelectorAll('a[href="#get"]').forEach(function (link) {
    link.addEventListener("click", function (event) {
      var target = document.getElementById("get");
      var input = document.getElementById("site");
      if (!target || !input) return;
      event.preventDefault();
      var still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      target.scrollIntoView({ behavior: still ? "auto" : "smooth", block: "center" });
      input.focus({ preventScroll: true });
      history.replaceState(null, "", "#get");
    });
  });

  /* ---------- Copy the script tag ---------- */

  document.querySelectorAll("[data-copy]").forEach(function (button) {
    var source = document.querySelector(button.getAttribute("data-copy"));
    var text = button.querySelector("[data-copy-label]");
    var live = button.parentNode.querySelector("[data-copy-status]");
    var timer;

    function done(ok) {
      text.textContent = ok ? "Copied" : "Select and copy";
      button.classList.toggle("is-done", ok);
      if (live) live.textContent = ok ? "Script tag copied." : "Copy failed. Select the tag and copy it.";
      clearTimeout(timer);
      timer = setTimeout(function () {
        text.textContent = "Copy";
        button.classList.remove("is-done");
        if (live) live.textContent = "";
      }, 2000);
    }

    function fallback(value) {
      var area = document.createElement("textarea");
      area.value = value;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      var ok = false;
      try { ok = document.execCommand("copy"); } catch (error) { ok = false; }
      document.body.removeChild(area);
      return ok;
    }

    button.addEventListener("click", function () {
      var value = source.textContent;
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(value).then(function () { done(true); }, function () { done(fallback(value)); });
      } else {
        done(fallback(value));
      }
    });
  });

  /* ---------- Explain more ---------- */

  document.querySelectorAll("[data-more]").forEach(function (button) {
    var more = document.getElementById(button.getAttribute("aria-controls"));
    button.addEventListener("click", function () {
      var open = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", open ? "false" : "true");
      button.textContent = open ? "Explain more" : "Show less";
      more.hidden = open;
    });
  });
})();
