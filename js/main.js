// Mewb portfolio: sticky header, gallery filters, lightbox, copy-to-clipboard.
(function () {
  var top = document.querySelector(".top");
  var onScroll = function () { top.classList.toggle("is-scrolled", window.scrollY > 8); };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Filters
  var tiles = Array.prototype.slice.call(document.querySelectorAll(".tile"));
  var chips = document.querySelectorAll(".chip[data-filter]");
  chips.forEach(function (chip) {
    var f = chip.getAttribute("data-filter");
    var n = f === "all" ? tiles.length : tiles.filter(function (t) { return t.dataset.cat === f; }).length;
    chip.querySelector("b").textContent = n;
    chip.addEventListener("click", function () {
      chips.forEach(function (c) { c.setAttribute("aria-pressed", c === chip ? "true" : "false"); });
      tiles.forEach(function (t) { t.hidden = f !== "all" && t.dataset.cat !== f; });
    });
  });

  // Lightbox
  var lb = document.getElementById("lb");
  var img = document.getElementById("lb-img");
  var title = document.getElementById("lb-title");
  var desc = document.getElementById("lb-desc");
  var current = -1;

  function visible() { return tiles.filter(function (t) { return !t.hidden; }); }
  function show(tile) {
    var list = visible();
    current = list.indexOf(tile);
    var thumb = tile.querySelector("img");
    img.src = tile.getAttribute("href");
    img.alt = thumb.alt;
    img.style.imageRendering = tile.classList.contains("pixel") ? "pixelated" : "";
    title.textContent = tile.querySelector("figcaption b").textContent;
    desc.textContent = tile.dataset.desc || "";
  }
  function step(d) {
    var list = visible();
    if (!list.length) return;
    show(list[(current + d + list.length) % list.length]);
  }

  if (lb && typeof lb.showModal === "function") {
    tiles.forEach(function (tile) {
      tile.addEventListener("click", function (e) {
        e.preventDefault();
        show(tile);
        lb.showModal();
      });
    });
    document.getElementById("lb-prev").addEventListener("click", function () { step(-1); });
    document.getElementById("lb-next").addEventListener("click", function () { step(1); });
    document.getElementById("lb-close").addEventListener("click", function () { lb.close(); });
    lb.addEventListener("click", function (e) { if (e.target === lb) lb.close(); });
    lb.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "ArrowRight") step(1);
    });
  }

  // Copy email
  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    var label = btn.textContent;
    btn.addEventListener("click", function () {
      var done = function () {
        btn.textContent = "Copied";
        setTimeout(function () { btn.textContent = label; }, 1600);
      };
      if (navigator.clipboard) navigator.clipboard.writeText(btn.dataset.copy).then(done, done);
      else done();
    });
  });

  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
