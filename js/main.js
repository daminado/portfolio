// =====================================================================
//  CONTATOS: preencha aqui (campos vazios não aparecem no site)
// =====================================================================
const CONTACT = {
  whatsapp: "71997355078",   // só números com DDD
  email: "danielmoreira12anos@gmail.com",
  instagram: "https://www.instagram.com/drivox.br/",  // link completo
  github: "https://github.com/daminado",     // link completo
  linkedin: "https://www.linkedin.com/in/danielmoreira-dev/"    // link completo
};

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
const esc = (v) => String(v).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

// ---------------- boot em terminal ----------------
async function boot() {
  const el = $(".boot"), out = $("[data-boot]");
  let seen = false;
  try { seen = sessionStorage.getItem("booted") === "1"; sessionStorage.setItem("booted", "1"); } catch { /* sem storage */ }
  const lines = [
    ["cmd", "$ npm run portfolio"],
    ["", "> carregando projetos............ ok"],
    ["", "> conectando sistemas............ agenda · login · painel"],
    ["ok", "✓ pronto. bem-vindo."]
  ];
  if (!reduce && !seen) {
    for (const [cls, text] of lines) {
      const span = document.createElement("span");
      if (cls) span.className = cls;
      out.append(span);
      for (const ch of text) { span.textContent += ch; await sleep(cls === "cmd" ? 28 : 7); }
      out.append("\n");
      await sleep(cls === "cmd" ? 220 : 120);
    }
    await sleep(260);
  }
  el.classList.add("done");
  $(".hero-title").classList.add("in");
  setTimeout(() => el.remove(), 1000);
}

// ---------------- cursor + holofote ----------------
function cursor() {
  const root = document.documentElement;
  addEventListener("pointermove", (e) => {
    root.style.setProperty("--mx", e.clientX + "px");
    root.style.setProperty("--my", e.clientY + "px");
  }, { passive: true });
  if (!finePointer) return;
  const c = $(".cursor"), dot = $(".c-dot"), ring = $(".c-ring");
  let x = -100, y = -100, rx = -100, ry = -100;
  addEventListener("pointermove", (e) => { x = e.clientX; y = e.clientY; }, { passive: true });
  addEventListener("pointerdown", () => c.classList.add("down"));
  addEventListener("pointerup", () => c.classList.remove("down"));
  document.addEventListener("pointerover", (e) => c.classList.toggle("hover", !!e.target.closest("a,button,input,textarea,[draggable],.kb-card,.ms-grid i")));
  const loop = () => {
    rx += (x - rx) * 0.18; ry += (y - ry) * 0.18;
    dot.style.setProperty("--x", x + "px"); dot.style.setProperty("--y", y + "px");
    ring.style.setProperty("--rx", rx + "px"); ring.style.setProperty("--ry", ry + "px");
    requestAnimationFrame(loop);
  };
  loop();
}

function magnetic() {
  if (!finePointer || reduce) return;
  $$(".magnetic").forEach((b) => {
    b.addEventListener("pointermove", (e) => {
      const r = b.getBoundingClientRect();
      b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px, ${(e.clientY - r.top - r.height / 2) * 0.35}px)`;
    });
    b.addEventListener("pointerleave", () => { b.style.transform = ""; });
  });
}

// ---------------- nav ----------------
function nav() {
  const n = $(".nav");
  let last = 0;
  addEventListener("scroll", () => {
    const y = scrollY;
    n.classList.toggle("scrolled", y > 20);
    n.classList.toggle("hide", y > 600 && y > last);
    last = y;
  }, { passive: true });
  const links = $$(".nav-links a");
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) links.forEach((a) => a.classList.toggle("on", a.getAttribute("href") === "#" + e.target.id));
  }), { rootMargin: "-45% 0px -50% 0px" });
  $$("section[id]").forEach((s) => io.observe(s));
}

// ---------------- revelar ----------------
function reveals() {
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }), { rootMargin: "0px 0px -8% 0px" });
  $$(".r").forEach((el) => {
    const sib = [...el.parentElement.children].filter((c) => c.classList.contains("r"));
    el.style.setProperty("--d", `${Math.min(sib.indexOf(el), 6) * 0.08}s`);
    io.observe(el);
  });
  $$(".hero-title .ln > span").forEach((s, i) => s.style.setProperty("--d", `${0.1 + i * 0.12}s`));
}

function counters() {
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    io.unobserve(e.target);
    const el = e.target, to = +el.dataset.count, suf = el.dataset.suffix || "", t0 = performance.now();
    const tick = (t) => {
      const k = reduce ? 1 : Math.min(1, (t - t0) / 1400);
      el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))) + (k === 1 ? suf : "");
      if (k < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }), { threshold: .6 });
  $$("[data-count]").forEach((c) => io.observe(c));
}

function rotator() {
  const words = $$("[data-rotator] b");
  let i = 0;
  setInterval(() => {
    const cur = words[i];
    cur.classList.remove("on"); cur.classList.add("off");
    setTimeout(() => cur.classList.remove("off"), 600);
    i = (i + 1) % words.length;
    words[i].classList.add("on");
  }, 2400);
}

function marquee() { const t = $("[data-marquee]"); t.innerHTML += t.innerHTML; }

// ---------------- editor ao vivo (código → interface) ----------------
const CODE = [
  [`<span class="c">// Agendamento.jsx</span>`],
  [`<span class="k">export function</span> <span class="f">Agendamento</span>() {`],
  [`  <span class="k">const</span> [servico, setServico] = <span class="f">useState</span>();`],
  [`  <span class="k">const</span> livres = <span class="f">useHorariosLivres</span>(servico);`],
  [``],
  [`  <span class="k">return</span> (`],
  [`    &lt;<span class="t">Card</span> titulo=<span class="s">"Agendar"</span>&gt;`],
  [`      &lt;<span class="t">Servicos</span> onEscolher={setServico} /&gt;`, "chips"],
  [`      &lt;<span class="t">Dias</span> proximos={<span class="s">30</span>} /&gt;`, "days"],
  [`      &lt;<span class="t">Horarios</span> lista={livres} /&gt;`, "slots"],
  [`      &lt;<span class="t">Botao</span> onClick={reservar}&gt;Confirmar&lt;/<span class="t">Botao</span>&gt;`, "btn"],
  [`    &lt;/<span class="t">Card</span>&gt;`],
  [`  );`],
  [`}`],
  [``],
  [`<span class="k">async function</span> <span class="f">reservar</span>() {`],
  [`  <span class="k">await</span> <span class="f">runTransaction</span>(db, travaDeVaga);`, "ok"],
  [`  <span class="c">// ✓ sem reserva duplicada</span>`],
  [`}`]
];
async function liveEditor() {
  const code = $("[data-code]"), pv = $("[data-preview]");
  const parts = ["chips", "days", "slots", "btn", "ok"];
  const setPart = (p, on) => $(`[data-pv="${p}"]`, pv).classList.toggle("hide", !on);
  const title = $(`[data-pv="title"]`, pv), step = $("[data-pv-step]", pv);
  const act = {
    chips: async () => { title.textContent = "Escolha o serviço"; step.textContent = "1/3"; setPart("chips", 1); await sleep(350); $$("[data-pv=chips] span", pv)[1].classList.add("on"); },
    days: async () => { title.textContent = "Escolha o dia"; step.textContent = "2/3"; setPart("days", 1); await sleep(350); $$("[data-pv=days] span", pv)[1].classList.add("on"); },
    slots: async () => { title.textContent = "Escolha o horário"; step.textContent = "3/3"; setPart("slots", 1); await sleep(350); $$("[data-pv=slots] span", pv)[3].classList.add("on"); },
    btn: async () => { setPart("btn", 1); },
    ok: async () => { const b = $(`[data-pv="btn"]`, pv); b.classList.add("press"); b.textContent = "Reservando…"; await sleep(650); b.classList.remove("press"); setPart("btn", 0); title.textContent = "Tudo certo!"; setPart("ok", 1); }
  };
  const reset = () => {
    parts.forEach((p) => setPart(p, 0));
    $$(".on", pv).forEach((e) => e.classList.remove("on"));
    title.textContent = "Agendar"; step.textContent = "0/3";
    $(`[data-pv="btn"]`, pv).textContent = "Confirmar reserva";
  };
  if (reduce) { code.innerHTML = CODE.map((l) => l[0]).join("\n"); for (const p of parts.slice(0, 4)) await act[p](); return; }
  const strip = (h) => { const d = document.createElement("div"); d.innerHTML = h; return d.textContent; };
  // espera o editor aparecer na tela
  await new Promise((res) => { const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { io.disconnect(); res(); } }); io.observe(code); });
  for (;;) {
    reset(); code.innerHTML = "";
    for (const [html, action] of CODE) {
      const line = document.createElement("span");
      code.append(line);
      const txt = strip(html);
      const cur = document.createElement("i"); cur.className = "cur";
      for (let i = 1; i <= txt.length; i += 2) { line.textContent = txt.slice(0, i); line.append(cur); await sleep(14); }
      line.innerHTML = html;
      code.append("\n");
      if (action) await act[action]();
      await sleep(action ? 380 : 60);
    }
    code.insertAdjacentHTML("beforeend", `<i class="cur"></i>`);
    await sleep(3200);
  }
}

// ---------------- projetos: rolagem horizontal fixada ----------------
function cases() {
  const wrap = $("[data-cases]"), track = $("[data-track]"), bar = $("[data-cases-bar]");
  const desktop = matchMedia("(min-width: 900px)");
  let dist = 0;
  const measure = () => {
    if (!desktop.matches) { wrap.style.removeProperty("--pin-h"); track.style.transform = ""; return; }
    dist = Math.max(0, track.scrollWidth - innerWidth);
    wrap.style.setProperty("--pin-h", `${innerHeight + dist}px`);
    onScroll();
  };
  const onScroll = () => {
    if (!desktop.matches) { bar.style.width = `${(track.scrollLeft / Math.max(1, track.scrollWidth - track.clientWidth)) * 100}%`; return; }
    const r = wrap.getBoundingClientRect();
    const k = Math.min(1, Math.max(0, -r.top / Math.max(1, wrap.offsetHeight - innerHeight)));
    track.style.transform = `translate3d(${-dist * k}px,0,0)`;
    bar.style.width = `${k * 100}%`;
  };
  addEventListener("scroll", onScroll, { passive: true });
  track.addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", measure);
  desktop.addEventListener?.("change", measure);
  measure();
  addEventListener("load", measure);
}

// mini 1: rastreio que avança sozinho
function miniTrack() {
  const box = $("[data-mini-track]"), items = $$("li", box), bar = $(".mt-bar", box);
  let s = 2;
  const paint = () => {
    items.forEach((li, i) => { li.className = i < s ? "done" : i === s ? "now" : ""; });
    bar.style.setProperty("--p", `${(s / (items.length - 1)) * 100}%`);
    $(".tag", box).textContent = s >= items.length - 1 ? "pronta!" : "na oficina";
  };
  paint();
  setInterval(() => { s = s >= items.length - 1 ? 1 : s + 1; paint(); }, 1800);
}

// mini 2: horários onde o serviço inteiro cabe
function miniSlots() {
  const grid = $("[data-mini-slots] .ms-grid");
  const busy = new Set([1, 5, 6]);
  const need = 4;
  grid.innerHTML = Array.from({ length: 10 }, (_, i) => `<i data-i="${i}" title="${8 + i}h" class="${busy.has(i) ? "busy" : ""}"></i>`).join("");
  const blocks = $$("i", grid);
  const fits = (s) => s + need <= 10 && [...Array(need).keys()].every((k) => !busy.has(s + k));
  blocks.forEach((b, i) => {
    if (fits(i)) b.classList.add("fit");
    const run = (on) => { if (fits(i)) for (let k = 0; k < need; k++) blocks[i + k].classList.toggle("run", on); };
    b.addEventListener("pointerenter", () => run(true));
    b.addEventListener("pointerleave", () => run(false));
    b.addEventListener("click", () => {
      if (!fits(i)) return;
      blocks.forEach((x) => x.classList.remove("sel"));
      for (let k = 0; k < need; k++) blocks[i + k].classList.add("sel");
      $("[data-mini-slots] .ms-note").textContent = `Reservado das ${8 + i}h às ${8 + i + need}h ✓`;
    });
  });
}

// mini 3: simulador de economia
function miniSim() {
  const box = $("[data-mini-sim]"), input = $("input", box);
  const brl = (v) => "R$ " + Math.round(v).toLocaleString("pt-BR");
  const upd = () => {
    const v = +input.value;
    $("[data-sim-val]", box).textContent = brl(v);
    $("[data-sim-new]", box).textContent = `${brl(v * 0.05)} – ${Math.round(v * 0.2)}`;
    $("[data-sim-year]", box).textContent = `até ${brl(v * 0.95 * 12)}`;
    input.style.accentColor = "var(--cyan)";
  };
  input.addEventListener("input", upd);
  upd();
}

// mini 4: lista de orçamento que vira mensagem de WhatsApp
function miniQuote() {
  const box = $("[data-mini-quote]"), list = $(".mq-list", box), msg = $("[data-mq-msg]", box);
  const items = [
    { name: "Parafuso sextavado", spec: '3/8" x 2" zincado', qty: 200, step: 50 },
    { name: "Porca sextavada", spec: '3/8"', qty: 200, step: 50 },
    { name: "Disco de corte", spec: '7" p/ inox', qty: 10, step: 5 }
  ];
  list.innerHTML = items.map((it, i) => `
    <div class="mq-row" data-i="${i}">
      <div><b>${esc(it.name)}</b><span>${esc(it.spec)}</span></div>
      <div class="mq-step"><button type="button" data-d="-1" aria-label="Menos ${esc(it.name)}">−</button><output>${it.qty}</output><button type="button" data-d="1" aria-label="Mais ${esc(it.name)}">+</button></div>
    </div>`).join("");
  const paint = () => {
    const on = items.filter((it) => it.qty > 0);
    msg.textContent = on.length
      ? ["Oi! Queria um orçamento desses itens:", ...on.map((it, n) => `${n + 1}. ${it.name} ${it.spec} (${it.qty} un)`)].join("\n")
      : "Lista vazia. Adicione um item.";
    $$(".mq-row", list).forEach((r) => { const it = items[r.dataset.i]; $("output", r).textContent = it.qty; r.classList.toggle("off", !it.qty); });
  };
  list.addEventListener("click", (e) => {
    const b = e.target.closest("[data-d]");
    if (!b) return;
    const it = items[b.closest(".mq-row").dataset.i];
    it.qty = Math.max(0, it.qty + it.step * +b.dataset.d);
    paint();
    msg.parentElement.classList.remove("pop"); void msg.offsetWidth; msg.parentElement.classList.add("pop");
  });
  paint();
}

// ---------------- demos do bento ----------------
function bookDemo() {
  const box = $("[data-book-demo]"), days = $(".bd-days", box), slots = $(".bd-slots", box), log = $(".bd-log", box);
  const wd = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
  const list = [];
  for (let d = new Date(), n = 0; list.length < 5 && n < 12; n++) { d.setDate(d.getDate() + 1); if (d.getDay() !== 0) list.push(new Date(d)); }
  const hours = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"];
  const taken = {};
  list.forEach((d, i) => { taken[i] = new Set(hours.filter((_, h) => (h * 7 + i * 3) % 5 === 0)); });
  let day = 0;
  const mine = new Set();
  const write = (html) => {
    const lines = log.innerHTML ? log.innerHTML.split("<br>") : [];
    lines.push(html);
    log.innerHTML = lines.slice(-4).join("<br>");
  };
  const code = () => Math.random().toString(36).slice(2, 6).toUpperCase();
  const paintDays = () => {
    days.innerHTML = list.map((d, i) => `<button type="button" class="${i === day ? "on" : ""}" data-d="${i}">${wd[d.getDay()]}<b>${String(d.getDate()).padStart(2, "0")}</b></button>`).join("");
    $$("button", days).forEach((b) => b.onclick = () => { day = +b.dataset.d; paintDays(); paintSlots(); });
  };
  const paintSlots = () => {
    slots.innerHTML = hours.map((h) => {
      const k = `${day}|${h}`;
      return `<button type="button" data-h="${h}" class="${mine.has(k) ? "mine" : ""}" ${taken[day].has(h) && !mine.has(k) ? "disabled" : ""}>${h}</button>`;
    }).join("");
    $$("button", slots).forEach((b) => b.onclick = () => reserve(b));
    // botões desabilitados também "tentam" reservar para mostrar a trava
    $$("button:disabled", slots).forEach((b) => { b.disabled = false; b.dataset.busy = "1"; b.style.opacity = ".3"; b.style.textDecoration = "line-through"; });
  };
  let busy = false;
  const reserve = async (b) => {
    if (busy) return;
    busy = true;
    const h = b.dataset.h, k = `${day}|${h}`, d = list[day];
    const when = `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")} ${h}`;
    write(`<span class="w">POST /api/reservas</span> { ${when} }`);
    await sleep(380);
    write(`transação: verificando vaga…`);
    await sleep(480);
    if (mine.has(k) || b.dataset.busy) {
      write(`<span class="rd">✗ 409 vaga já ocupada, reserva duplicada bloqueada</span>`);
      b.classList.add("shake"); setTimeout(() => b.classList.remove("shake"), 450);
    } else {
      mine.add(k);
      write(`<span class="g">✓ 201 reservado · protocolo #${code()}</span>`);
      paintSlots();
    }
    busy = false;
  };
  paintDays(); paintSlots();
  log.innerHTML = `<span class="w">GET /api/horarios</span> → 200 · ${hours.length * list.length} horários carregados`;
}

function loginDemo() {
  const box = $("[data-login-demo]"), btn = $(".g-btn", box), steps = $$(".flow li", box), w = $(".welcome", box);
  let done = false;
  btn.onclick = async () => {
    if (done) { done = false; steps.forEach((s) => s.classList.remove("ok")); w.classList.remove("on"); btn.lastChild.textContent = "Continuar com Google"; return; }
    btn.classList.add("busy");
    for (const s of steps) { await sleep(520); s.classList.add("ok"); }
    await sleep(300);
    btn.classList.remove("busy"); w.classList.add("on"); btn.lastChild.textContent = "Sair e testar de novo"; done = true;
  };
}

function kanban() {
  const board = $("[data-kanban]");
  const count = () => $$(".kb-col", board).forEach((c) => { $("h4 i", c).textContent = $$(".kb-card", c).length; });
  let drag = null, ghost = null, ox = 0, oy = 0;
  board.addEventListener("dragstart", (e) => e.preventDefault()); // usamos pointer events (funciona no touch também)
  board.addEventListener("pointerdown", (e) => {
    const card = e.target.closest(".kb-card");
    if (!card) return;
    e.preventDefault();
    drag = card;
    const r = card.getBoundingClientRect();
    ox = e.clientX - r.left; oy = e.clientY - r.top;
    ghost = card.cloneNode(true);
    Object.assign(ghost.style, { position: "fixed", left: r.left + "px", top: r.top + "px", width: r.width + "px", zIndex: 150, pointerEvents: "none", transform: "rotate(-3deg) scale(1.04)", boxShadow: "0 20px 40px -12px #000" });
    document.body.append(ghost);
    card.classList.add("drag");
  });
  addEventListener("pointermove", (e) => {
    if (!drag) return;
    ghost.style.left = e.clientX - ox + "px"; ghost.style.top = e.clientY - oy + "px";
    const col = document.elementFromPoint(e.clientX, e.clientY)?.closest(".kb-col");
    $$(".kb-col", board).forEach((c) => c.classList.toggle("over", c === col));
  });
  addEventListener("pointerup", (e) => {
    if (!drag) return;
    const col = document.elementFromPoint(e.clientX, e.clientY)?.closest(".kb-col");
    if (col && board.contains(col)) col.append(drag);
    drag.classList.remove("drag"); ghost.remove();
    $$(".kb-col", board).forEach((c) => c.classList.remove("over"));
    drag = null; count();
  });
  count();
}

async function waDemo() {
  const out = $("[data-wa-text]");
  const msgs = [
    ["Olá, ", "Rafael", "! Seu ", "Polimento", " está ", "pronto ✅", " Pode vir buscar quando quiser."],
    ["Oi, ", "Bruna", "! Confirmando sua ", "Lavagem", " para ", "amanhã às 14h", ". Qualquer coisa, é só chamar."],
    ["Fala, ", "Diego", "! A ", "Vitrificação", " está na ", "etapa 3 de 4", ". Mandei as fotos na sua área de cliente 📸"]
  ];
  await new Promise((res) => { const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { io.disconnect(); res(); } }); io.observe(out); });
  for (let m = 0; ; m = (m + 1) % msgs.length) {
    out.innerHTML = "";
    for (const [i, part] of msgs[m].entries()) {
      const isVar = i % 2 === 1;
      const node = document.createElement(isVar ? "mark" : "span");
      out.append(node);
      if (isVar) { node.textContent = part; await sleep(160); continue; }
      for (const ch of part) { node.textContent += ch; await sleep(reduce ? 0 : 22); }
    }
    await sleep(2600);
  }
}

function inView(sel, fn, t = .4) {
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { fn(e.target); io.unobserve(e.target); } }), { threshold: t });
  $$(sel).forEach((el) => io.observe(el));
}

function rulesTest() {
  const box = $("[data-rules-test]"), out = $("output", box);
  const res = {
    cliente: ["ok", "✓ permitido: o pedido é dele"],
    outro: ["no", "✗ negado: pedido de outra pessoa"],
    admin: ["ok", "✓ permitido: administrador"]
  };
  $$("button", box).forEach((b) => b.onclick = () => {
    const [cls, txt] = res[b.dataset.as];
    out.className = ""; out.textContent = "avaliando regra…";
    setTimeout(() => { out.className = cls; out.textContent = txt; }, 350);
  });
}

function rolesDemo() {
  const box = $("[data-roles-demo]"), note = $(".rd-note", box);
  const ROLES = {
    admin: { areas: ["pedidos", "catalogo", "config", "acessos"], txt: "Dono vê e edita tudo, inclusive quem entra." },
    vendas: { areas: ["pedidos"], txt: "Vendedor só atende pedidos. O resto é bloqueado no banco de dados, não só escondido." },
    org: { areas: ["catalogo"], txt: "Estoque só edita o catálogo. Não vê pedidos nem configurações." }
  };
  const set = (r) => {
    $$("[data-role]", box).forEach((b) => b.classList.toggle("on", b.dataset.role === r));
    $$("[data-area]", box).forEach((li) => li.classList.toggle("ok", ROLES[r].areas.includes(li.dataset.area)));
    note.textContent = ROLES[r].txt;
  };
  $$("[data-role]", box).forEach((b) => b.addEventListener("click", () => set(b.dataset.role)));
  set("admin");
}

function guideDemo() {
  const box = $("[data-guide-demo]"), out = $(".gd-out", box);
  const G = {
    madeira: ["Parafuso soberbo", "Pré-furo em madeira dura", "Zincado dentro, inox fora"],
    metal: ["Sextavado + porca e arruela", "Autobrocante em chapa fina", "Broca de metal duro p/ inox"],
    parede: ["Parafuso + bucha de nylon", "Furo na medida exata da bucha", "Broca própria p/ concreto"],
    externa: ["Inox ou galvanizado", "Arruela de vedação", "Zincado comum enferruja"]
  };
  const set = (k) => {
    $$("[data-g]", box).forEach((b) => b.classList.toggle("on", b.dataset.g === k));
    const [p, a, d] = G[k];
    out.innerHTML = `<div><dt>indicado</dt><dd>${esc(p)}</dd></div><div><dt>instalação</dt><dd>${esc(a)}</dd></div><div><dt>dica</dt><dd>${esc(d)}</dd></div>`;
  };
  $$("[data-g]", box).forEach((b) => b.addEventListener("click", () => set(b.dataset.g)));
  set("madeira");
}

function tilt() {
  $$(".tile").forEach((t) => {
    t.addEventListener("pointermove", (e) => {
      const r = t.getBoundingClientRect();
      t.style.setProperty("--mx", e.clientX - r.left + "px");
      t.style.setProperty("--my", e.clientY - r.top + "px");
      if (finePointer && !reduce && t.hasAttribute("data-tilt")) {
        const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        t.style.transform = `perspective(1000px) rotateX(${-y * 3}deg) rotateY(${x * 3}deg)`;
      }
    });
    t.addEventListener("pointerleave", () => { t.style.transform = ""; });
  });
}

function timeline() {
  const tl = $("[data-timeline]"), items = $$("li", tl);
  const upd = () => {
    const r = tl.getBoundingClientRect();
    const k = Math.max(0, Math.min(1, (innerHeight * .6 - r.top) / r.height));
    tl.style.setProperty("--tp", k.toFixed(3));
    items.forEach((li) => li.classList.toggle("lit", li.getBoundingClientRect().top < innerHeight * .6));
  };
  addEventListener("scroll", upd, { passive: true });
  upd();
}

// ---------------- contato ----------------
const ICONS = {
  whatsapp: `<svg viewBox="0 0 24 24"><path d="M4 20l1.2-4.1A8.5 8.5 0 1 1 8.4 19z"/></svg>`,
  email: `<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M4 7l8 6 8-6"/></svg>`,
  instagram: `<svg viewBox="0 0 24 24"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/></svg>`,
  github: `<svg viewBox="0 0 24 24"><path d="M9 19c-4 1.3-4-2-6-2.5M15 21v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1-.3-3.4 1.3a11.6 11.6 0 0 0-6 0C6.8 2.8 5.8 3.1 5.8 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4.4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/></svg>`,
  linkedin: `<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 10v6M8 7.5v.01M12 16v-3.5a2 2 0 0 1 4 0V16M12 10v6"/></svg>`
};
function contact() {
  const wa = CONTACT.whatsapp.replace(/\D/g, "");
  const links = [
    wa && ["whatsapp", "WhatsApp", `(${wa.slice(0, 2)}) ${wa.slice(2, 7)}-${wa.slice(7)}`, `https://wa.me/55${wa}`],
    CONTACT.email && ["email", "E-mail", CONTACT.email, `mailto:${CONTACT.email}`],
    CONTACT.instagram && ["instagram", "Instagram", CONTACT.instagram.replace(/^https?:\/\/(www\.)?/, ""), CONTACT.instagram],
    CONTACT.linkedin && ["linkedin", "LinkedIn", CONTACT.linkedin.replace(/^https?:\/\/(www\.)?/, ""), CONTACT.linkedin],
    CONTACT.github && ["github", "GitHub", CONTACT.github.replace(/^https?:\/\/(www\.)?/, ""), CONTACT.github]
  ].filter(Boolean);
  $("[data-links]").innerHTML = links.map(([k, label, sub, href]) => `
    <a class="clink" href="${esc(href)}" target="_blank" rel="noopener"><span class="ci">${ICONS[k]}</span><div><b>${label}</b><span>${esc(sub)}</span></div>${k === "email" ? `<button type="button" class="copy" data-copy="${esc(sub)}">copiar</button>` : `<span class="arrow">↗</span>`}</a>`).join("")
    || `<div class="clink"><span class="ci">${ICONS.email}</span><div><b>Contatos em breve</b><span>preencha CONTACT em js/main.js</span></div></div>`;

  $$("[data-copy]").forEach((b) => b.addEventListener("click", async (e) => {
    e.preventDefault(); e.stopPropagation();
    let ok = false;
    try { await navigator.clipboard.writeText(b.dataset.copy); ok = true; } catch {
      const ta = Object.assign(document.createElement("textarea"), { value: b.dataset.copy });
      ta.style.cssText = "position:fixed;opacity:0";
      document.body.append(ta); ta.select();
      try { ok = document.execCommand("copy"); } catch { /* sem suporte */ }
      ta.remove();
    }
    if (!ok) { location.href = "mailto:" + b.dataset.copy; return; }
    b.textContent = "copiado ✓"; b.classList.add("ok");
    setTimeout(() => { b.textContent = "copiar"; b.classList.remove("ok"); }, 1800);
  }));
  const demo = $("[data-demo]");
  if (demo) { if (wa) demo.href = "https://wa.me/55" + wa + "?text=" + encodeURIComponent("Olá, Daniel! Vi seu portfólio e queria ver uma demonstração de um projeto parecido com o meu negócio."); else demo.remove(); }
  const fab = $("[data-fab]");
  if (wa) {
    fab.href = `https://wa.me/55${wa}?text=${encodeURIComponent("Olá, Daniel! Vi seu portfólio e quero conversar sobre um projeto.")}`;
    const contactSec = $("#contato");
    addEventListener("scroll", () => {
      const nearContact = contactSec.getBoundingClientRect().top < innerHeight * .7;
      fab.classList.toggle("show", scrollY > innerHeight * .9 && !nearContact);
    }, { passive: true });
  } else fab.remove();

  const f = $("[data-cform]"), hint = $("[data-cf-hint]");
  $$("[data-chips] button", f).forEach((b) => { b.setAttribute("aria-pressed", "false"); b.onclick = () => b.setAttribute("aria-pressed", b.classList.toggle("on")); });
  f.onsubmit = (e) => {
    e.preventDefault();
    const nome = f.nome.value.trim();
    if (!nome) { hint.textContent = "Me diz pelo menos o seu nome 🙂"; f.nome.focus(); return; }
    const precisa = $$("[data-chips] .on", f).map((b) => b.textContent);
    const text = `Olá, Daniel! Sou ${nome}${f.negocio.value.trim() ? ` (${f.negocio.value.trim()})` : ""}.` +
      (precisa.length ? `\nPreciso de: ${precisa.join(", ")}.` : "") +
      (f.msg.value.trim() ? `\n\n${f.msg.value.trim()}` : "") + `\n\n(vim pelo seu portfólio)`;
    if (wa) { open(`https://wa.me/55${wa}?text=${encodeURIComponent(text)}`, "_blank", "noopener"); hint.textContent = "Abrindo o WhatsApp…"; }
    else if (CONTACT.email) { location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent("Projeto via portfólio")}&body=${encodeURIComponent(text)}`; }
    else hint.textContent = "Contato ainda não configurado.";
  };
}




// ---------------- modelos: tela cheia ----------------
function modelos() {
  const box = $("[data-lbox]");
  if (!box) return;
  const img = $("img", box), cap = $("figcaption", box);
  const close = () => { box.hidden = true; document.documentElement.style.overflow = ""; };
  $$("[data-full]").forEach((b) => b.addEventListener("click", () => {
    img.src = b.dataset.full; img.alt = "Modelo " + b.dataset.title;
    cap.textContent = "Modelo " + b.dataset.title + " · marca fictícia";
    box.hidden = false; document.documentElement.style.overflow = "hidden";
    $(".lb-x", box).focus();
  }));
  box.addEventListener("click", (e) => { if (e.target === box || e.target.closest(".lb-x")) close(); });
  addEventListener("keydown", (e) => { if (e.key === "Escape" && !box.hidden) close(); });
}

// ---------------- início ----------------
boot();
cursor();
magnetic();
nav();
reveals();
counters();
rotator();
marquee();
liveEditor();
cases();
miniTrack();
miniSlots();
miniSim();
miniQuote();
bookDemo();
loginDemo();
kanban();
waDemo();
inView("[data-sim-bars]", (el) => el.classList.add("in"));
rulesTest();
rolesDemo();
guideDemo();
tilt();
timeline();
modelos();
contact();
$$("[data-year]").forEach((y) => { y.textContent = new Date().getFullYear(); });
