// Configure o WhatsApp (DDI + DDD + número, somente dígitos) e o e-mail abaixo.
var WHATSAPP = "5500000000000";
var EMAIL = "contato@rafc.com.br";

var D = {seg:"", obj:"", qtd:""};

function wa(texto) {
  return "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(texto);
}

document.querySelectorAll("[data-wa]").forEach(function(link) {
  link.href = wa(link.getAttribute("data-wa"));
  link.target = "_blank";
  link.rel = "noopener";
});

function show(passo) {
  for (var i = 1; i <= 4; i++) {
    document.getElementById("q" + i).classList.toggle("hide", i !== passo);
  }
  var progresso = Math.min(passo, 3);
  document.getElementById("bar").style.width = (progresso * 33.333) + "%";
  document.querySelector(".bar").setAttribute("aria-valuenow", progresso);
  document.getElementById("quizStatus").textContent = passo === 4 ? "Orçamento pronto" : "Pergunta " + passo + " de 3";
  if (passo > 1) {
    var titulo = document.querySelector("#q" + passo + " h3");
    if (titulo) titulo.focus({preventScroll:true});
  }
}

function msg() {
  return "Olá! Meu negócio: " + D.seg + ". Quero resolver: " + D.obj + ". Preciso de " + D.qtd + " NFC RAFC. Pode me enviar um orçamento?";
}

function finish() {
  document.getElementById("resumo").textContent = D.seg + " · " + D.obj + " · " + D.qtd;
  document.getElementById("goWa").href = wa(msg());
  document.getElementById("goMail").href = "mailto:" + EMAIL + "?subject=" + encodeURIComponent("Orçamento RAFC") + "&body=" + encodeURIComponent(msg());
  show(4);
}

document.querySelectorAll(".opts[data-k]").forEach(function(group) {
  group.querySelectorAll(".opt").forEach(function(button) {
    button.onclick = function() {
      D[group.dataset.k] = button.textContent;
      var proximo = {seg:2, obj:3, qtd:4}[group.dataset.k];
      if (proximo === 4) finish(); else show(proximo);
    };
  });
});

document.querySelectorAll(".back").forEach(function(button) {
  button.onclick = function() { show(+button.dataset.b); };
});

document.querySelectorAll(".chip").forEach(function(chip) {
  chip.onclick = function() {
    D.seg = chip.dataset.seg;
    show(2);
    document.getElementById("comecar").scrollIntoView();
  };
});

// Inclinação sutil do produto: responde ao cursor sem afetar a animação de entrada.
(function initHeroTilt() {
  var hero = document.querySelector(".hero-media");
  var orbit = document.querySelector(".hero-orbit");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var precisePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (!hero || !orbit || reduceMotion || !precisePointer) return;

  var frame = 0;
  hero.addEventListener("pointermove", function(event) {
    var bounds = hero.getBoundingClientRect();
    var x = (event.clientX - bounds.left) / bounds.width - .5;
    var y = (event.clientY - bounds.top) / bounds.height - .5;
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(function() {
      orbit.style.setProperty("--hero-rx", (-y * 7).toFixed(2) + "deg");
      orbit.style.setProperty("--hero-ry", (x * 9).toFixed(2) + "deg");
    });
  });
  hero.addEventListener("pointerleave", function() {
    cancelAnimationFrame(frame);
    orbit.style.setProperty("--hero-rx", "0deg");
    orbit.style.setProperty("--hero-ry", "0deg");
  });
})();

// Entradas no scroll: comunicam a sequência da página sem bloquear o conteúdo.
(function initScrollReveals() {
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var items = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));

  document.querySelectorAll("[data-reveal-group]").forEach(function(group) {
    Array.prototype.forEach.call(group.children, function(child, index) {
      child.style.setProperty("--reveal-delay", (index * 90) + "ms");
      items.push(child);
    });
  });

  items.forEach(function(item) {
    item.classList.add("reveal-item");
    if (item.dataset.delay) item.style.setProperty("--reveal-delay", item.dataset.delay + "ms");
  });

  document.documentElement.classList.add("js");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    items.forEach(function(item) { item.classList.add("is-visible"); });
    return;
  }

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, {threshold:0.12, rootMargin:"0px 0px -8%"});

  items.forEach(function(item) { observer.observe(item); });
})();
