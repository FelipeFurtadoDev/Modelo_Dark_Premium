/* ==========================================================
   CONFIGURAÇÃO DO WHATSAPP
   Deixe vazio ("") enquanto for demonstração.
   Para ativar: só números, com país e DDD. Ex. fictício: "5511999999999"
   ========================================================== */
const WHATSAPP_NUMBER = "";
const WHATSAPP_MESSAGE = "Olá! Encontrei seu site e gostaria de informações sobre orçamento ou agendamento.";

document.documentElement.classList.add("js");
const menosMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Menu móvel ---------- */
const botaoMenu = document.querySelector(".menu-toggle");
const menu = document.getElementById("menu-principal");

function abrirMenu(abrir) {
  menu.classList.toggle("aberto", abrir);
  botaoMenu.setAttribute("aria-expanded", String(abrir));
  document.body.style.overflow = abrir ? "hidden" : "";   // trava a rolagem com o menu aberto
}
botaoMenu.addEventListener("click", () => abrirMenu(botaoMenu.getAttribute("aria-expanded") !== "true"));
menu.addEventListener("click", (e) => { if (e.target.closest("a")) abrirMenu(false); });
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && botaoMenu.getAttribute("aria-expanded") === "true") {
    abrirMenu(false);
    botaoMenu.focus();
  }
});

/* ---------- Revelar ao rolar ---------- */
const itens = document.querySelectorAll("[data-reveal]");
if (menosMovimento || !("IntersectionObserver" in window)) {
  itens.forEach((el) => el.classList.add("on"));
} else {
  const obs = new IntersectionObserver((entradas) => {
    entradas.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("on"); obs.unobserve(en.target); }
    });
  }, { threshold: 0.12 });
  itens.forEach((el) => obs.observe(el));
}

/* ---------- Header sólido ao rolar + parallax leve ---------- */
const header = document.querySelector(".site-header");
const paralaxes = document.querySelectorAll("[data-parallax]");
let agendado = false;

function atualizar() {
  agendado = false;
  header.classList.toggle("rolou", window.scrollY > 40);
  if (menosMovimento) return;
  paralaxes.forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.bottom < 0 || r.top > window.innerHeight) return;           // fora da tela: ignora
    const deslocamento = (r.top + r.height / 2 - window.innerHeight / 2) * -0.05;
    el.style.setProperty("--py", deslocamento.toFixed(1) + "px");
  });
}
window.addEventListener("scroll", () => {
  if (!agendado) { agendado = true; requestAnimationFrame(atualizar); }
}, { passive: true });
atualizar();

/* ---------- Botões de WhatsApp ---------- */
const numeroValido = /^\d{10,15}$/.test(WHATSAPP_NUMBER);
const aviso = document.getElementById("aviso");
let temporizador;

function mostrarAviso(texto) {
  aviso.textContent = texto;
  aviso.classList.add("visivel");
  clearTimeout(temporizador);
  temporizador = setTimeout(() => aviso.classList.remove("visivel"), 8000);
}

document.querySelectorAll("[data-whatsapp]").forEach((botao) => {
  if (numeroValido) {
    botao.href = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(WHATSAPP_MESSAGE);
    botao.target = "_blank";
    botao.rel = "noopener noreferrer";
  } else {
    botao.addEventListener("click", (e) => {
      e.preventDefault();
      mostrarAviso("Contato demonstrativo: nenhum número foi configurado. Em um site real, este botão abriria o WhatsApp da empresa.");
    });
  }
});