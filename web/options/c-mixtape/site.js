// agentnet homepage, option C. Small vanilla script. No framework.
(function () {
  "use strict";

  var stillMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  // ---------- Tape: Side A for people, Side B for agents ----------
  var tape = document.querySelector(".tape");
  if (tape) {
    var tabs = Array.prototype.slice.call(tape.querySelectorAll('[role="tab"]'));
    var faces = {
      a: document.getElementById("side-a"),
      b: document.getElementById("side-b")
    };
    var flip = tape.querySelector("[data-flip]");
    var flipLabel = flip.querySelector(".flip-label");

    function showSide(side, moveFocus) {
      tape.setAttribute("data-side", side);
      tabs.forEach(function (tab) {
        var selected = tab.id === "tab-" + side;
        tab.setAttribute("aria-selected", selected ? "true" : "false");
        tab.tabIndex = selected ? 0 : -1;
        if (selected && moveFocus) tab.focus();
      });
      Object.keys(faces).forEach(function (key) {
        var face = faces[key];
        if (key === side) {
          face.removeAttribute("inert");
          face.removeAttribute("aria-hidden");
        } else {
          face.setAttribute("inert", "");
          face.setAttribute("aria-hidden", "true");
        }
      });
      flipLabel.textContent = side === "a" ? "Flip to side B" : "Flip to side A";
    }

    tabs.forEach(function (tab, index) {
      tab.addEventListener("click", function () {
        showSide(tab.id.slice(-1), false);
      });
      tab.addEventListener("keydown", function (event) {
        var next = null;
        if (event.key === "ArrowRight" || event.key === "ArrowDown") next = tabs[(index + 1) % tabs.length];
        if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = tabs[(index - 1 + tabs.length) % tabs.length];
        if (event.key === "Home") next = tabs[0];
        if (event.key === "End") next = tabs[tabs.length - 1];
        if (next) {
          event.preventDefault();
          showSide(next.id.slice(-1), true);
        }
      });
    });

    flip.addEventListener("click", function () {
      showSide(tape.getAttribute("data-side") === "a" ? "b" : "a", false);
    });

    showSide("a", false);

    // The play marker runs down the Side A tracklist one time on load.
    var wrap = faces.a.querySelector(".tracks-wrap");
    var marker = wrap.querySelector(".playhead");
    var rows = wrap.querySelectorAll(".tracks li");
    if (!stillMotion.matches && marker.animate && rows.length > 1) {
      var first = rows[0].offsetTop;
      var frames = [];
      for (var i = 0; i < rows.length; i++) {
        var offset = rows[i].offsetTop - first;
        var at = i / rows.length;
        frames.push({ transform: "translateY(" + offset + "px)", offset: at, easing: "cubic-bezier(0.16, 1, 0.3, 1)" });
        frames.push({ transform: "translateY(" + offset + "px)", offset: at + 0.7 / rows.length, easing: "cubic-bezier(0.16, 1, 0.3, 1)" });
      }
      frames.push({ transform: "translateY(0px)", offset: 1 });
      marker.animate(frames, {
        duration: 3600,
        delay: 500,
        easing: "linear",
        fill: "none"
      });
      rows.forEach(function (row, index) {
        row.animate(
          [{ backgroundColor: "rgba(215, 38, 46, 0)" }, { backgroundColor: "rgba(215, 38, 46, 0.07)" }, { backgroundColor: "rgba(215, 38, 46, 0)" }],
          { duration: 900, delay: 500 + index * (3600 / rows.length), easing: "ease-out" }
        );
      });
    }
  }

  // ---------- Access forms ----------
  var forms = document.querySelectorAll("[data-access]");

  function getSite(value) {
    var text = value.trim();
    if (!text) return "";
    if (!/^https?:\/\//i.test(text)) text = "https://" + text;
    try {
      var url = new URL(text);
      if (!/\./.test(url.hostname)) return null;
      return url.origin + (url.pathname === "/" ? "" : url.pathname);
    } catch (error) {
      return null;
    }
  }

  function showError(input, message) {
    var box = document.getElementById(input.getAttribute("aria-describedby"));
    if (message) {
      input.setAttribute("aria-invalid", "true");
      box.textContent = message;
    } else {
      input.removeAttribute("aria-invalid");
      box.textContent = "";
    }
  }

  function checkForm(form) {
    var siteInput = form.elements.site;
    var emailInput = form.elements.email;
    var site = getSite(siteInput.value);
    var email = emailInput.value.trim();
    var firstBad = null;

    if (site === "") {
      showError(siteInput, "Enter your website address, for example acme.com.");
      firstBad = siteInput;
    } else if (site === null) {
      showError(siteInput, "This address does not look right. Try a form like acme.com.");
      firstBad = siteInput;
    } else {
      showError(siteInput, "");
    }

    if (!email) {
      showError(emailInput, "Enter your work email.");
      firstBad = firstBad || emailInput;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showError(emailInput, "This email does not look right. Try a form like you@acme.com.");
      firstBad = firstBad || emailInput;
    } else {
      showError(emailInput, "");
    }

    if (firstBad) {
      firstBad.focus();
      return null;
    }
    return { site: site, email: email };
  }

  function sendForm(form, data) {
    var button = form.querySelector('button[type="submit"]');
    var label = button.querySelector(".button-label");
    var status = form.querySelector(".form-status");
    status.className = "form-status";
    status.textContent = "";
    button.disabled = true;
    label.textContent = "Sending…";

    fetch("/access", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
      .then(function (response) {
        if (!response.ok) throw new Error("status " + response.status);
        status.className = "form-status is-done";
        status.innerHTML = "";
        var title = document.createElement("p");
        title.className = "thanks-title";
        title.textContent = "Thank you. Your mix is on the way.";
        var text = document.createElement("p");
        text.textContent = "We will build a preview of your agent from " + data.site + " and write to " + data.email + ".";
        status.appendChild(title);
        status.appendChild(text);
        form.querySelector(".fields").hidden = true;
        var foot = form.querySelector(".form-foot");
        if (foot) foot.hidden = true;
        else button.hidden = true;
      })
      .catch(function () {
        status.className = "form-status is-error";
        status.innerHTML = "";
        var text = document.createElement("p");
        text.textContent = "We could not send your request. Check your connection, then try again.";
        var retry = document.createElement("button");
        retry.type = "button";
        retry.className = "button retry";
        retry.textContent = "Try again";
        retry.addEventListener("click", function () {
          sendForm(form, data);
        });
        status.appendChild(text);
        status.appendChild(retry);
      })
      .then(function () {
        button.disabled = false;
        label.textContent = "Get your agent";
      });
  }

  Array.prototype.forEach.call(forms, function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var data = checkForm(form);
      if (data) sendForm(form, data);
    });
    Array.prototype.forEach.call(form.querySelectorAll("input"), function (input) {
      input.addEventListener("input", function () {
        if (input.getAttribute("aria-invalid") === "true") showError(input, "");
      });
    });
  });

  // ---------- Copy the script tag ----------
  Array.prototype.forEach.call(document.querySelectorAll("[data-copy]"), function (button) {
    var label = button.querySelector(".copy-label");
    var timer = null;
    button.addEventListener("click", function () {
      var text = document.getElementById(button.getAttribute("data-copy")).textContent;
      var done = function () {
        label.textContent = "Copied";
        button.classList.add("is-copied");
        clearTimeout(timer);
        timer = setTimeout(function () {
          label.textContent = "Copy";
          button.classList.remove("is-copied");
        }, 2000);
      };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(done, function () {
          copyByHand(text);
          done();
        });
      } else {
        copyByHand(text);
        done();
      }
    });
  });

  function copyByHand(text) {
    var area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    try { document.execCommand("copy"); } catch (error) { /* Do nothing. */ }
    document.body.removeChild(area);
  }

  // ---------- Phone menu ----------
  var top = document.querySelector(".top");
  var menu = document.querySelector(".menu-button");
  if (top && menu) {
    menu.addEventListener("click", function () {
      var open = menu.getAttribute("aria-expanded") === "true";
      menu.setAttribute("aria-expanded", open ? "false" : "true");
      top.classList.toggle("is-open", !open);
    });
    top.addEventListener("click", function (event) {
      if (event.target.closest(".nav a")) {
        menu.setAttribute("aria-expanded", "false");
        top.classList.remove("is-open");
      }
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && top.classList.contains("is-open")) {
        menu.setAttribute("aria-expanded", "false");
        top.classList.remove("is-open");
        menu.focus();
      }
    });
  }
})();
