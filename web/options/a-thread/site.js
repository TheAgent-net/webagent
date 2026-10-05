// agentnet homepage, option A. No framework. No build step.
(function () {
  "use strict";

  var root = document.documentElement;
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function wait(ms) {
    return new Promise(function (resolve) { window.setTimeout(resolve, ms); });
  }

  // ---------- Hero thread: type in once ----------

  function startThread() {
    var thread = document.querySelector("[data-thread]");
    if (!thread || !root.classList.contains("motion")) return Promise.resolve();
    root.classList.add("motion-started");
    var messages = Array.prototype.slice.call(thread.querySelectorAll(".msg"));
    var typing = [500, 850, 650, 750];
    var chain = wait(250);
    messages.forEach(function (message, i) {
      chain = chain
        .then(function () { message.classList.add("is-typing"); return wait(typing[i] || 600); })
        .then(function () {
          message.classList.remove("is-typing");
          message.classList.add("is-in");
          return wait(i === 1 ? 650 : 300);
        });
    });
    return chain;
  }

  // ---------- Headline greeting: Maya, then ChatGPT agent ----------

  function startGreeting() {
    var greet = document.querySelector("[data-greet]");
    var name = document.querySelector("[data-name]");
    if (!greet || !name || reduced) return;

    var names = [
      { text: "ChatGPT agent", agent: true },
      { text: "Maya", agent: false }
    ];

    function erase() {
      greet.classList.add("is-typing");
      var step = function () {
        var text = name.textContent;
        if (!text.length) return Promise.resolve();
        name.textContent = text.slice(0, -1);
        return wait(55).then(step);
      };
      return step();
    }

    function type(entry) {
      greet.classList.toggle("is-agent", entry.agent);
      var i = 0;
      var step = function () {
        if (i >= entry.text.length) return Promise.resolve();
        i += 1;
        name.textContent = entry.text.slice(0, i);
        return wait(70).then(step);
      };
      return step();
    }

    // Change the name one time and come back. Then stop.
    var chain = wait(1200);
    names.forEach(function (entry) {
      chain = chain
        .then(erase)
        .then(function () { return wait(180); })
        .then(function () { return type(entry); })
        .then(function () { greet.classList.remove("is-typing"); return wait(entry.agent ? 2600 : 0); });
    });
  }

  startThread().then(startGreeting);

  // ---------- Access form ----------

  var ICON_DONE = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="#7CF2C2"/><path d="m7.5 12.4 3 3 6-6.4" fill="none" stroke="#17171C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var ICON_ALERT = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="#FF9EC0"/><path d="M12 7v6.5" fill="none" stroke="#17171C" stroke-width="2.2" stroke-linecap="round"/><circle cx="12" cy="17" r="1.3" fill="#17171C"/></svg>';

  function escapeText(text) {
    var span = document.createElement("span");
    span.textContent = text;
    return span.innerHTML;
  }

  function getSite(value) {
    var raw = value.trim();
    if (!raw) return null;
    var withScheme = /^https?:\/\//i.test(raw) ? raw : "https://" + raw;
    try {
      var url = new URL(withScheme);
      if (!/\.[a-z]{2,}$/i.test(url.hostname)) return null;
      return url.origin + (url.pathname === "/" ? "" : url.pathname);
    } catch (error) {
      return null;
    }
  }

  function showReply(form, html) {
    var reply = form.querySelector("[data-reply]");
    reply.innerHTML = '<div class="bubble">' + html + "</div>";
  }

  function clearReply(form) {
    form.querySelector("[data-reply]").innerHTML = "";
  }

  function setBusy(form, busy) {
    var button = form.querySelector("button[type=submit]");
    var label = form.querySelector("[data-label]");
    button.disabled = busy;
    label.textContent = busy ? "Sending" : "Get your agent";
  }

  function sendAccess(form) {
    var siteInput = form.querySelector("input[name=site]");
    var emailInput = form.querySelector("input[name=email]");
    var site = getSite(siteInput.value);
    var email = emailInput.value.trim();
    var emailValid = email.length > 0 && emailInput.checkValidity();

    siteInput.setAttribute("aria-invalid", site ? "false" : "true");
    emailInput.setAttribute("aria-invalid", emailValid ? "false" : "true");

    if (!site || !emailValid) {
      var problems = [];
      if (!site) problems.push("Enter your website, for example acme.dev.");
      if (!emailValid) problems.push("Enter your work email, for example maya@acme.dev.");
      showReply(form, ICON_ALERT + "<span>" + problems.join(" ") + "</span>");
      (site ? emailInput : siteInput).focus();
      return;
    }

    setBusy(form, true);
    clearReply(form);

    fetch("/access", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ site: site, email: email })
    })
      .then(function (response) {
        if (!response.ok) throw new Error("status " + response.status);
        var host = new URL(site).hostname;
        showReply(form, ICON_DONE + "<span>Thank you. We will build an agent from <b>" + escapeText(host) +
          "</b> and send the preview to <b>" + escapeText(email) + "</b>.</span>");
        siteInput.value = "";
        emailInput.value = "";
      })
      .catch(function () {
        showReply(form, ICON_ALERT + "<span>We could not send your request. Check your connection, then try again.</span>" +
          '<button class="retry" type="button" data-retry>Try again</button>');
        var retry = form.querySelector("[data-retry]");
        retry.addEventListener("click", function () { sendAccess(form); });
      })
      .then(function () { setBusy(form, false); });
  }

  Array.prototype.forEach.call(document.querySelectorAll("[data-access]"), function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      sendAccess(form);
    });
    Array.prototype.forEach.call(form.querySelectorAll("input"), function (input) {
      input.addEventListener("input", function () {
        if (input.getAttribute("aria-invalid") === "true") input.setAttribute("aria-invalid", "false");
      });
    });
  });

  // ---------- Copy the install tag ----------

  Array.prototype.forEach.call(document.querySelectorAll("[data-copy]"), function (button) {
    var source = document.querySelector(button.getAttribute("data-copy"));
    var label = button.querySelector("[data-copy-label]");
    var note = document.querySelector("[data-copy-note]");
    var timer;

    function done(ok) {
      label.textContent = ok ? "Copied" : "Press Ctrl+C";
      if (note) note.textContent = ok ? "Tag copied." : "Copy did not work. Select the tag and copy it.";
      button.classList.toggle("is-done", ok);
      window.clearTimeout(timer);
      timer = window.setTimeout(function () {
        label.textContent = "Copy";
        button.classList.remove("is-done");
        if (note) note.textContent = "";
      }, 2000);
    }

    function copyFallback(text) {
      var area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "absolute";
      area.style.left = "-9999px";
      document.body.appendChild(area);
      area.select();
      var ok = false;
      try { ok = document.execCommand("copy"); } catch (error) { ok = false; }
      document.body.removeChild(area);
      return ok;
    }

    button.addEventListener("click", function () {
      var text = source.textContent;
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(copyFallback(text)); });
      } else {
        done(copyFallback(text));
      }
    });
  });
})();
