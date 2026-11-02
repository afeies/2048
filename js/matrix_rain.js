// Falling green "digital rain" drawn on a full-screen canvas behind the game.
(function () {
  var canvas = document.createElement("canvas");
  canvas.className = "matrix-rain";
  canvas.setAttribute("aria-hidden", "true");
  document.body.insertBefore(canvas, document.body.firstChild);

  var ctx      = canvas.getContext("2d");
  var glyphs   = "01010101アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEF";
  var fontSize = 16;
  var columns  = [];
  var reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    var count = Math.ceil(canvas.width / fontSize);
    columns = [];
    for (var i = 0; i < count; i++) {
      // Start each column at a random height so the rain isn't a flat line.
      columns.push(Math.random() * -canvas.height / fontSize);
    }

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  function randomGlyph() {
    return glyphs.charAt(Math.floor(Math.random() * glyphs.length));
  }

  function draw() {
    // Translucent black wash leaves fading trails behind each drop.
    ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = fontSize + "px monospace";

    for (var i = 0; i < columns.length; i++) {
      var y = columns[i] * fontSize;

      // Bright leading character, dimmer green body.
      ctx.fillStyle = Math.random() > 0.96 ? "#d6ffd9" : "#00ff41";
      ctx.fillText(randomGlyph(), i * fontSize, y);

      if (y > canvas.height && Math.random() > 0.975) {
        columns[i] = 0;
      } else {
        columns[i] += 1;
      }
    }
  }

  resize();
  window.addEventListener("resize", resize);

  if (reduceMotion) {
    // Render a single still frame instead of animating.
    for (var f = 0; f < 120; f++) draw();
    return;
  }

  var last = 0;
  function loop(time) {
    if (time - last > 50) { // ~20fps keeps the rain readable and cheap
      draw();
      last = time;
    }
    window.requestAnimationFrame(loop);
  }
  window.requestAnimationFrame(loop);
})();
