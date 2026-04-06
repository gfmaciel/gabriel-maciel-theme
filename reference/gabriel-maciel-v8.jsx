import { useState, useEffect, useRef, useCallback } from "react";

const posts = [
  { title: "Como usei IA para economizar 10 horas por semana", tag: "Produtividade", date: "Mar 2025", cover: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&q=80" },
  { title: "Automatizando tarefas chatas com Claude: um guia prático", tag: "IA na Prática", date: "Fev 2025", cover: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&q=80" },
  { title: "O que aprendi construindo meu primeiro agente de IA", tag: "Projetos", date: "Jan 2025", cover: "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=600&q=80" },
  { title: "IA para pequenas empresas: por onde começar sem enlouquecer", tag: "Negócios", date: "Dez 2024", cover: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80" },
];

const projects = [
  { name: "Defesa.AI", desc: "Plataforma de geração automatizada de defesas jurídicas para demandas massificadas. Construída para bancos, telecom e varejistas.", tag: "LegalTech · IA", emoji: "⚖️" },
  { name: "Nano Banana", desc: "Livros infantis personalizados gerados por IA com abordagem terapêutica. Cada história é única para cada criança.", tag: "EdTech · Criatividade", emoji: "📚" },
  { name: "Automação com Claude", desc: "Setup de automação 24/7 via Telegram + VPS que executa tarefas da vida pessoal e profissional de forma autônoma.", tag: "Automação · Open Source", emoji: "🤖" },
];

const videos = [
  { id: "yt1", title: "Como automatizar seu negócio com IA em 2025", views: "12k visualizações", duration: "14:32", thumb: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=480&q=80" },
  { id: "yt2", title: "5 ferramentas de IA que uso todo dia", views: "8.4k visualizações", duration: "9:47", thumb: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=480&q=80" },
  { id: "yt3", title: "Construindo um agente de IA do zero", views: "6.1k visualizações", duration: "21:05", thumb: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=480&q=80" },
];

const services = [
  { key: "consultoria", label: "Entender como aplicar IA no meu negócio", icon: "🔍", title: "Consultoria em IA", desc: "Mapeio onde a IA pode gerar resultado real para você — sem promessas vazias.", template: "Olá Gabriel, tenho uma [tipo de empresa/área] e hoje perdemos [tempo/dinheiro/recurso] com [processo específico]. Quero entender se consigo resolver isso com IA sem precisar de uma equipe técnica. Você consegue me ajudar?" },
  { key: "desenvolvimento", label: "Desenvolver uma solução de IA para mim", icon: "🛠️", title: "Desenvolvimento", desc: "Construo soluções personalizadas com IA para automatizar processos ou criar novos produtos.", template: "Olá Gabriel, preciso automatizar [processo específico] na minha empresa. Hoje fazemos isso manualmente e leva [tempo/custo aproximado]. Quero saber se você consegue construir uma solução para isso." },
  { key: "treinamento", label: "Treinar meu time a ser mais produtivo com IA", icon: "🎓", title: "Treinamento de equipes", desc: "Ensino times a usar ferramentas de IA no dia a dia, de forma prática e sem jargão técnico.", template: "Olá Gabriel, tenho um time de [tamanho] pessoas em [área/setor] e quero que eles usem IA para [objetivo]. O maior obstáculo hoje é [barreira principal]. Podemos conversar sobre um treinamento?" },
];

const socials = [
  { label: "LinkedIn", url: "#", svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="#0A66C2"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
  { label: "Instagram", url: "#", svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="url(#ig)"><defs><linearGradient id="ig" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stopColor="#f09433"/><stop offset="50%" stopColor="#dc2743"/><stop offset="100%" stopColor="#bc1888"/></linearGradient></defs><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg> },
  { label: "X", url: "#", svg: <svg width="15" height="15" viewBox="0 0 24 24" fill="white"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
  { label: "TikTok", url: "#", svg: <svg width="15" height="15" viewBox="0 0 24 24" fill="white"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.73a4.85 4.85 0 01-1.01-.04z"/></svg> },
  { label: "YouTube", url: "#", svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="#FF0000"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg> },
];

// ─── Replace with your real Site Key from console.cloud.google.com/apis ───────
// Test key (always passes, shows reCAPTCHA UI): 6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI
// Production key: register at https://www.google.com/recaptcha/admin
const RECAPTCHA_SITE_KEY = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI";

const C = {
  navy: "#0C2D3E", navyMid: "#163B50",
  gold: "#D4A920", goldLight: "#F0CC50", goldPale: "#FBF3D0",
  white: "#FFFFFF", offWhite: "#F7F8F9",
  ink: "#111820", inkMid: "#3A4A56", inkLight: "#6B7E8C",
  border: "#DDE4E8", error: "#D94F4F", errorBg: "#FFF5F5",
};

// ─── reCAPTCHA hook ───────────────────────────────────────────────────────────
function useRecaptcha(siteKey) {
  const widgetId = useRef(null);
  const containerRef = useRef(null);
  const [token, setToken] = useState(null);
  const [loaded, setLoaded] = useState(false);

  // Load the reCAPTCHA script once
  useEffect(() => {
    const scriptId = "recaptcha-script";
    if (document.getElementById(scriptId)) {
      if (window.grecaptcha) setLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://www.google.com/recaptcha/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    script.onload = () => setLoaded(true);
    document.head.appendChild(script);
  }, []);

  // Render the widget once the script is ready and the container is mounted
  const renderWidget = useCallback(() => {
    if (!loaded || !containerRef.current || widgetId.current !== null) return;
    if (!window.grecaptcha?.render) return;

    widgetId.current = window.grecaptcha.render(containerRef.current, {
      sitekey: siteKey,
      theme: "light",
      callback: (t) => setToken(t),
      "expired-callback": () => setToken(null),
      "error-callback": () => setToken(null),
    });
  }, [loaded, siteKey]);

  useEffect(() => {
    if (loaded) {
      // grecaptcha may not be ready immediately after onload fires
      if (window.grecaptcha?.render) {
        renderWidget();
      } else {
        window.onRecaptchaLoad = renderWidget;
      }
    }
  }, [loaded, renderWidget]);

  const reset = useCallback(() => {
    if (widgetId.current !== null && window.grecaptcha) {
      window.grecaptcha.reset(widgetId.current);
      setToken(null);
    }
  }, []);

  return { containerRef, token, reset, loaded };
}

// ─── Utilities ────────────────────────────────────────────────────────────────
function useInView() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.06 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function FadeIn({ children, delay = 0 }) {
  const [ref, visible] = useInView();
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(20px)", transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s` }}>
      {children}
    </div>
  );
}

const GoldBar = ({ center }) => <div style={{ width: 44, height: 3, background: C.gold, borderRadius: 2, margin: center ? "0 auto 16px" : "0 0 16px" }} />;

const Label = ({ children, center }) => (
  <div className="sans" style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: C.gold, marginBottom: 8, textAlign: center ? "center" : "left" }}>{children}</div>
);

const SectionHeader = ({ label, title, action }) => (
  <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 36, flexWrap: "wrap", gap: 12 }}>
    <div>
      <Label>{label}</Label>
      <GoldBar />
      <h2 className="serif" style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 700, lineHeight: 1.15, color: C.navy }}>{title}</h2>
    </div>
    {action && (
      <button onClick={action.fn} className="sans" style={{ fontSize: 13, fontWeight: 600, color: C.navy, background: "none", border: "none", cursor: "pointer", borderBottom: `2px solid ${C.gold}`, paddingBottom: 2, flexShrink: 0 }}>
        {action.label}
      </button>
    )}
  </div>
);

function FloatField({ label, type = "text", value, onChange, onBlur, error, textarea, rows = 4, maxLen }) {
  const [focused, setFocused] = useState(false);
  const raised = focused || value.length > 0;
  const id = label.toLowerCase().replace(/\s+/g, "-");
  const fieldStyle = {
    width: "100%", background: error ? C.errorBg : C.white,
    border: `1.5px solid ${error ? C.error : focused ? C.gold : C.border}`,
    borderRadius: 8, padding: textarea ? "28px 16px 28px" : "26px 16px 10px",
    fontSize: 15, color: C.ink, outline: "none",
    transition: "border-color 0.2s, background 0.2s",
    fontFamily: "-apple-system,'Segoe UI',sans-serif",
    lineHeight: 1.6, resize: textarea ? "vertical" : undefined,
    minHeight: textarea ? 120 : undefined,
  };
  const labelStyle = {
    position: "absolute", left: 16,
    top: raised ? 9 : textarea ? 18 : "50%",
    transform: raised ? "none" : textarea ? "none" : "translateY(-50%)",
    fontSize: raised ? 11 : 15, fontWeight: raised ? 700 : 400,
    color: error ? C.error : raised ? C.gold : C.inkLight,
    letterSpacing: raised ? "0.07em" : 0,
    textTransform: raised ? "uppercase" : "none",
    pointerEvents: "none", transition: "all 0.18s ease",
    fontFamily: "-apple-system,'Segoe UI',sans-serif",
  };
  return (
    <div style={{ position: "relative" }}>
      {textarea
        ? <textarea id={id} style={fieldStyle} rows={rows} value={value} maxLength={maxLen}
            onChange={onChange} onFocus={() => setFocused(true)} onBlur={() => { setFocused(false); onBlur?.(); }} />
        : <input id={id} type={type} style={fieldStyle} value={value}
            onChange={onChange} onFocus={() => setFocused(true)} onBlur={() => { setFocused(false); onBlur?.(); }} />
      }
      <label htmlFor={id} style={labelStyle}>{error || label}</label>
      {textarea && maxLen && (
        <div className="sans" style={{ position: "absolute", bottom: 10, right: 12, fontSize: 11, color: value.length > maxLen * 0.9 ? C.error : C.inkLight }}>
          {value.length}/{maxLen}
        </div>
      )}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [heroVisible, setHeroVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [form, setForm] = useState({ nome: "", email: "", mensagem: "" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [captchaError, setCaptchaError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const { containerRef: captchaRef, token: captchaToken, reset: resetCaptcha } = useRecaptcha(RECAPTCHA_SITE_KEY);

  useEffect(() => { setTimeout(() => setHeroVisible(true), 80); }, []);
  useEffect(() => {
    const close = () => setMenuOpen(false);
    window.addEventListener("scroll", close, { passive: true });
    return () => window.removeEventListener("scroll", close);
  }, []);

  const scrollTo = (id) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setMenuOpen(false); };

  const validate = (f) => {
    const e = {};
    if (!f.nome.trim()) e.nome = "Nome obrigatório";
    if (!f.email.trim()) e.email = "Email obrigatório";
    else if (!/\S+@\S+\.\S+/.test(f.email)) e.email = "Email inválido";
    if (!f.mensagem.trim()) e.mensagem = "Mensagem obrigatória";
    return e;
  };

  const handleServiceSelect = (key) => {
    const svc = services.find(s => s.key === key);
    setSelectedService(key);
    setForm(prev => ({ ...prev, mensagem: svc.template }));
    setTimeout(() => scrollTo("form-section"), 250);
  };

  const handleBlur = (field) => {
    setTouched(t => ({ ...t, [field]: true }));
    setErrors(e => ({ ...e, ...validate(form) }));
  };

  const handleSubmit = () => {
    const e = validate(form);
    setTouched({ nome: true, email: true, mensagem: true });
    setErrors(e);

    const hasCaptcha = !!captchaToken;
    setCaptchaError(!hasCaptcha);

    if (Object.keys(e).length > 0 || !hasCaptcha) return;

    setSubmitting(true);
    // TODO: send `captchaToken` to your backend for server-side verification
    // POST /api/contact { ...form, recaptchaToken: captchaToken }
    // Server calls: https://www.google.com/recaptcha/api/siteverify
    //   with secret key + token, checks response.success === true
    setTimeout(() => { setSubmitting(false); setSent(true); }, 1400);
  };

  const ha = (d) => ({
    opacity: heroVisible ? 1 : 0,
    transform: heroVisible ? "none" : "translateY(20px)",
    transition: `opacity 0.75s ease ${d}s, transform 0.75s ease ${d}s`,
  });

  return (
    <div style={{ fontFamily: "Georgia, serif", background: C.white, color: C.ink, overflowX: "hidden" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::selection { background: #D4A92030; }
        .serif { font-family: Georgia, serif; }
        .sans  { font-family: -apple-system, 'Segoe UI', sans-serif; }

        .btn-gold { background:${C.gold};color:${C.navy};padding:13px 28px;border-radius:4px;font-size:14px;font-weight:700;border:none;cursor:pointer;letter-spacing:.04em;text-transform:uppercase;transition:background .2s,transform .15s,box-shadow .2s;font-family:-apple-system,'Segoe UI',sans-serif;white-space:nowrap; }
        .btn-gold:hover { background:${C.goldLight};transform:translateY(-2px);box-shadow:0 8px 24px rgba(212,169,32,.4); }
        .btn-gold:disabled { opacity:.6;cursor:not-allowed;transform:none;box-shadow:none; }
        .btn-outline { background:transparent;color:#fff;padding:12px 26px;border-radius:4px;font-size:14px;font-weight:600;border:2px solid rgba(255,255,255,.5);cursor:pointer;transition:all .2s;font-family:-apple-system,'Segoe UI',sans-serif;white-space:nowrap; }
        .btn-outline:hover { border-color:${C.gold};color:${C.gold};transform:translateY(-2px); }

        .card { background:${C.white};border:1px solid ${C.border};border-radius:10px;overflow:hidden;transition:transform .22s,box-shadow .22s,border-color .22s; }
        .card:hover { transform:translateY(-5px);box-shadow:0 16px 40px rgba(12,45,62,.1);border-color:${C.gold}; }

        .post-row { padding:18px 0;border-bottom:1px solid ${C.border};cursor:pointer;display:flex;gap:16px;align-items:center;transition:padding-left .2s; }
        .post-row:hover { padding-left:6px; }
        .post-arrow { opacity:0;transition:opacity .2s,transform .2s;margin-left:auto;flex-shrink:0;font-size:18px; }
        .post-row:hover .post-arrow { opacity:1;transform:translateX(4px);color:${C.gold}; }

        .pill { display:inline-block;background:${C.goldPale};color:#7A5800;font-size:11px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;padding:3px 10px;border-radius:20px;font-family:-apple-system,'Segoe UI',sans-serif;white-space:nowrap; }

        .nav-btn { background:none;border:none;cursor:pointer;font-size:14px;font-weight:500;color:${C.inkMid};transition:color .2s;font-family:-apple-system,'Segoe UI',sans-serif; }
        .nav-btn:hover { color:${C.navy}; }

        .service-option { display:flex;align-items:flex-start;gap:14px;padding:16px 18px;border-radius:10px;border:2px solid rgba(255,255,255,.08);background:${C.navyMid};cursor:pointer;transition:border-color .2s,transform .15s;text-align:left;width:100%; }
        .service-option:hover { border-color:rgba(212,169,32,.5);transform:translateX(3px); }
        .service-option.selected { border-color:${C.gold};background:rgba(212,169,32,.07); }

        .social-btn { display:flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:8px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);transition:background .2s,transform .15s;text-decoration:none; }
        .social-btn:hover { background:rgba(255,255,255,.14);transform:translateY(-2px); }

        .yt-card { background:${C.white};border:1px solid ${C.border};border-radius:10px;overflow:hidden;cursor:pointer;transition:transform .2s,box-shadow .2s,border-color .2s; }
        .yt-card:hover { transform:translateY(-4px);box-shadow:0 14px 36px rgba(12,45,62,.1);border-color:${C.gold}; }
        .yt-card:hover .yt-play { background:${C.gold}; }
        .yt-play { width:44px;height:44px;border-radius:50%;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;transition:background .2s; }

        .contact-chip { display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:8px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08); }

        /* reCAPTCHA container */
        .recaptcha-wrap { margin-top: 4px; }
        .recaptcha-error-msg { font-family:-apple-system,'Segoe UI',sans-serif; font-size:12px; color:${C.error}; margin-top:6px; display:flex; align-items:center; gap:5px; }

        /* Mobile menu */
        .mobile-menu { display:none;flex-direction:column;gap:0;position:fixed;top:64px;left:0;right:0;z-index:98;background:${C.white};border-bottom:1px solid ${C.border};box-shadow:0 8px 24px rgba(0,0,0,.08); }
        .mobile-menu.open { display:flex; }
        .mobile-menu button { display:block;width:100%;padding:16px 24px;font-size:16px;font-weight:500;color:${C.ink};background:none;border:none;border-bottom:1px solid ${C.border};text-align:left;cursor:pointer;font-family:-apple-system,'Segoe UI',sans-serif; }
        .mobile-menu button:last-child { border-bottom:none; }

        @media (max-width: 768px) {
          .nav-links { display: none !important; }
          .hamburger { display: flex !important; }
        }
        @media (min-width: 769px) {
          .hamburger { display: none !important; }
          .mobile-menu { display: none !important; }
        }
        @media (max-width: 600px) {
          .blog-cover-card { flex-direction: column !important; }
          .blog-cover-img  { width: 100% !important; height: 180px !important; }
        }
        @media (max-width: 860px) {
          .contact-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
        @media (max-width: 640px) {
          .section { padding-left: 20px !important; padding-right: 20px !important; padding-top: 56px !important; padding-bottom: 56px !important; }
          .hero-section { padding-left: 20px !important; padding-right: 20px !important; padding-top: 100px !important; padding-bottom: 64px !important; }
          .footer-inner { flex-direction: column !important; align-items: center !important; text-align: center !important; gap: 20px !important; }
        }
        @media (max-width: 400px) {
          .hero-ctas { flex-direction: column !important; }
          .hero-ctas button { width: 100%; justify-content: center; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* ── NAV ── */}
      <nav className="sans" style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 99, background: "rgba(255,255,255,.95)", backdropFilter: "blur(14px)", borderBottom: `1px solid ${C.border}`, padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div className="serif" style={{ fontSize: 24, fontWeight: 700, color: C.navy }}>GM</div>
        <div className="nav-links" style={{ display: "flex", gap: 28, alignItems: "center" }}>
          {["projetos", "artigos"].map(s => (
            <button key={s} className="nav-btn" onClick={() => scrollTo(s)} style={{ textTransform: "capitalize" }}>{s}</button>
          ))}
          <button className="btn-gold" onClick={() => scrollTo("contato")} style={{ padding: "9px 20px", fontSize: 13 }}>Fale comigo</button>
        </div>
        <button className="hamburger" onClick={() => setMenuOpen(o => !o)} style={{ background: "none", border: "none", cursor: "pointer", padding: 8, display: "none", alignItems: "center", justifyContent: "center" }} aria-label="Menu">
          {menuOpen
            ? <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.navy} strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.navy} strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          }
        </button>
      </nav>
      <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
        {["projetos", "artigos"].map(s => <button key={s} onClick={() => scrollTo(s)} style={{ textTransform: "capitalize" }}>{s}</button>)}
        <button onClick={() => scrollTo("contato")} style={{ color: C.gold, fontWeight: 700 }}>Fale comigo →</button>
      </div>

      {/* ── HERO ── */}
      <section className="hero-section" style={{ background: C.navy, padding: "124px 32px 84px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, right: 0, width: 260, height: 260, opacity: .05, backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "20px 20px", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 4, background: `linear-gradient(to right, ${C.gold}, transparent)` }} />
        <div style={{ maxWidth: 760, margin: 0 }}>
          <div style={{ ...ha(0.1), display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
            <span style={{ fontSize: 18 }}>👋</span>
            <span className="sans" style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,.5)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Olá, meu nome é</span>
          </div>
          <h1 className="serif" style={{ ...ha(0.22), fontSize: "clamp(52px, 10vw, 96px)", fontWeight: 700, lineHeight: .93, letterSpacing: "-.025em", color: C.white, marginBottom: 32 }}>
            Gabriel<br /><span style={{ color: C.gold }}>Maciel.</span>
          </h1>
          <p className="sans" style={{ ...ha(0.38), fontSize: "clamp(18px, 2.4vw, 22px)", fontWeight: 300, lineHeight: 1.55, color: "rgba(255,255,255,.88)", marginBottom: 14, maxWidth: 520 }}>
            Você não precisa entender de tecnologia{" "}
            <em className="serif" style={{ fontStyle: "italic", fontWeight: 700, color: C.white }}>para usar IA de verdade.</em>
          </p>
          <p className="sans" style={{ ...ha(0.48), fontSize: "clamp(15px, 1.8vw, 17px)", fontWeight: 300, lineHeight: 1.7, color: "rgba(255,255,255,.62)", marginBottom: 40, maxWidth: 480 }}>
            Construo automações e ferramentas de IA — e documento cada passo aqui para você replicar no seu negócio.
          </p>
          <div className="hero-ctas" style={{ ...ha(0.56), display: "flex", gap: 14, flexWrap: "wrap" }}>
            <button className="btn-gold" onClick={() => scrollTo("projetos")}>Conhecer projetos</button>
            <button className="btn-outline" onClick={() => scrollTo("contato")}>Trabalhe comigo</button>
          </div>
        </div>
      </section>

      {/* ── PROJETOS ── */}
      <section id="projetos" className="section" style={{ padding: "80px 32px", background: C.offWhite, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <FadeIn><SectionHeader label="Projetos" title="O que estou construindo" action={{ label: "Ver todos →", fn: () => {} }} /></FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 18 }}>
            {projects.map((p, i) => (
              <FadeIn key={p.name} delay={i * .1}>
                <div className="card" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                  <div style={{ padding: 24, display: "flex", flexDirection: "column", flex: 1 }}>
                    <div style={{ fontSize: 32, marginBottom: 12 }}>{p.emoji}</div>
                    <div style={{ marginBottom: 10 }}><span className="pill">{p.tag}</span></div>
                    <h3 className="serif" style={{ fontSize: 19, fontWeight: 700, marginBottom: 10, lineHeight: 1.25, color: C.navy }}>{p.name}</h3>
                    <p className="sans" style={{ fontSize: 14, lineHeight: 1.7, color: C.inkMid, flex: 1 }}>{p.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── ARTIGOS ── */}
      <section id="artigos" className="section" style={{ padding: "80px 32px", background: C.white }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <FadeIn><SectionHeader label="Artigos" title="O que escrevo" action={{ label: "Ver todos →", fn: () => {} }} /></FadeIn>
          <div>
            {posts.map((p, i) => (
              <FadeIn key={p.title} delay={i * .07}>
                <div style={{ marginBottom: p.cover ? 16 : 0 }}>
                  {p.cover ? (
                    <div className="card blog-cover-card" style={{ display: "flex", overflow: "hidden", cursor: "pointer" }}
                      onMouseEnter={e => { const img = e.currentTarget.querySelector(".cimg"); if (img) img.style.transform = "scale(1.05)"; }}
                      onMouseLeave={e => { const img = e.currentTarget.querySelector(".cimg"); if (img) img.style.transform = "scale(1)"; }}>
                      <div className="blog-cover-img" style={{ width: 180, flexShrink: 0, overflow: "hidden" }}>
                        <img className="cimg" src={p.cover} alt={p.title} style={{ width: "100%", height: "100%", minHeight: 130, objectFit: "cover", transition: "transform .4s ease", display: "block" }} />
                      </div>
                      <div style={{ padding: "20px 22px", display: "flex", flexDirection: "column", justifyContent: "center", flex: 1 }}>
                        <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8, flexWrap: "wrap" }}>
                          <span className="pill">{p.tag}</span>
                          <span className="sans" style={{ fontSize: 12, color: C.inkLight }}>{p.date}</span>
                        </div>
                        <h3 className="serif" style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.3, color: C.ink, marginBottom: 10 }}>{p.title}</h3>
                        <div className="sans" style={{ fontSize: 13, color: C.gold, fontWeight: 600 }}>Ler artigo →</div>
                      </div>
                    </div>
                  ) : (
                    <div className="post-row">
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 6, flexWrap: "wrap" }}>
                          <span className="pill">{p.tag}</span>
                          <span className="sans" style={{ fontSize: 12, color: C.inkLight }}>{p.date}</span>
                        </div>
                        <h3 className="serif" style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.3, color: C.ink }}>{p.title}</h3>
                      </div>
                      <span className="post-arrow sans">→</span>
                    </div>
                  )}
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── YOUTUBE ── */}
      <section id="youtube" className="section" style={{ padding: "80px 32px", background: C.offWhite, borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <FadeIn>
            <SectionHeader label="YouTube" title="Quer me ver construindo?" action={{ label: "Ver canal →", fn: () => window.open("https://youtube.com/@gabrielmaciel", "_blank") }} />
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
            {videos.map((v, i) => (
              <FadeIn key={v.id} delay={i * .1}>
                <div className="yt-card">
                  <div style={{ position: "relative", aspectRatio: "16/9", overflow: "hidden", background: C.border }}>
                    <img src={v.thumb} alt={v.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.22)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <div className="yt-play"><svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg></div>
                    </div>
                    <div className="sans" style={{ position: "absolute", bottom: 8, right: 8, background: "rgba(0,0,0,.8)", color: "#fff", fontSize: 11, fontWeight: 700, padding: "2px 6px", borderRadius: 4 }}>{v.duration}</div>
                  </div>
                  <div style={{ padding: "14px 16px" }}>
                    <h3 className="serif" style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.35, color: C.ink, marginBottom: 6 }}>{v.title}</h3>
                    <span className="sans" style={{ fontSize: 12, color: C.inkLight }}>{v.views}</span>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTATO ── */}
      <section id="contato" className="section" style={{ padding: "80px 32px", background: C.navy, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: .04, backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "24px 24px", pointerEvents: "none" }} />
        <div style={{ maxWidth: 860, margin: "0 auto", position: "relative" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 44 }}>
              <Label center>Vamos trabalhar juntos</Label>
              <GoldBar center />
              <h2 className="serif" style={{ fontSize: "clamp(26px, 4vw, 42px)", fontWeight: 700, color: C.white, lineHeight: 1.1, marginBottom: 12 }}>Como posso te ajudar?</h2>
            </div>

            {/* Step 1 */}
            <div className="sans" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: C.gold, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: C.navy, flexShrink: 0 }}>1</div>
              <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,.5)", textTransform: "uppercase", letterSpacing: "0.07em" }}>O que você precisa?</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 44 }}>
              {services.map(s => (
                <button key={s.key} className={`service-option${selectedService === s.key ? " selected" : ""}`} onClick={() => handleServiceSelect(s.key)}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${selectedService === s.key ? C.gold : "rgba(255,255,255,.25)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2, transition: "border-color .2s" }}>
                    {selectedService === s.key && <div style={{ width: 10, height: 10, borderRadius: "50%", background: C.gold }} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="sans" style={{ fontSize: 15, fontWeight: 600, color: selectedService === s.key ? C.gold : C.white, marginBottom: 3, transition: "color .2s" }}>{s.label}</div>
                    <div className="sans" style={{ fontSize: 13, color: "rgba(255,255,255,.38)", lineHeight: 1.5 }}>{s.desc}</div>
                  </div>
                  <span style={{ fontSize: 20, flexShrink: 0 }}>{s.icon}</span>
                </button>
              ))}
            </div>

            <div style={{ height: 1, background: "rgba(255,255,255,.07)", marginBottom: 40 }} />

            {/* Step 2 */}
            <div id="form-section">
              <div className="sans" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: selectedService ? C.gold : "rgba(255,255,255,.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: selectedService ? C.navy : "rgba(255,255,255,.4)", flexShrink: 0, transition: "background .3s,color .3s" }}>2</div>
                <span className="sans" style={{ fontSize: 13, fontWeight: 600, color: selectedService ? "rgba(255,255,255,.5)" : "rgba(255,255,255,.22)", textTransform: "uppercase", letterSpacing: "0.07em", transition: "color .3s" }}>Seus dados</span>
              </div>

              <div className="contact-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 48, alignItems: "start" }}>
                {/* Left */}
                <div>
                  <h3 className="serif" style={{ fontSize: 20, fontWeight: 700, color: C.white, marginBottom: 10 }}>Me manda uma mensagem</h3>
                  <p className="sans" style={{ fontSize: 14, lineHeight: 1.75, color: "rgba(255,255,255,.4)", marginBottom: 24 }}>Você também pode me escrever diretamente:</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div className="contact-chip">
                      <div style={{ width: 32, height: 32, borderRadius: 6, background: "rgba(255,255,255,.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.55)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                      </div>
                      <div>
                        <div className="sans" style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: C.gold, marginBottom: 2 }}>Email</div>
                        <div className="sans" style={{ fontSize: 12, color: "rgba(255,255,255,.38)" }}>contato@gabrielmaciel.com.br</div>
                      </div>
                    </div>
                    <div className="contact-chip">
                      <div style={{ width: 32, height: 32, borderRadius: 6, background: "#0A66C2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                      </div>
                      <div>
                        <div className="sans" style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: C.gold, marginBottom: 2 }}>LinkedIn</div>
                        <div className="sans" style={{ fontSize: 12, color: "rgba(255,255,255,.38)" }}>linkedin.com/in/gabrielmaciel</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right — form */}
                <div>
                  {sent ? (
                    <div style={{ background: C.navyMid, border: `2px solid ${C.gold}`, borderRadius: 12, padding: 40, textAlign: "center" }}>
                      <div style={{ fontSize: 44, marginBottom: 14 }}>✅</div>
                      <h3 className="serif" style={{ fontSize: 22, fontWeight: 700, color: C.white, marginBottom: 8 }}>Mensagem enviada!</h3>
                      <p className="sans" style={{ fontSize: 14, color: "rgba(255,255,255,.45)" }}>Obrigado. Vou te responder em breve.</p>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                      <FloatField label="Seu nome" value={form.nome}
                        onChange={e => setForm({ ...form, nome: e.target.value })}
                        onBlur={() => handleBlur("nome")}
                        error={touched.nome && errors.nome} />
                      <FloatField label="Seu email" type="email" value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        onBlur={() => handleBlur("email")}
                        error={touched.email && errors.email} />
                      <FloatField label="Mensagem" textarea rows={5} maxLen={600} value={form.mensagem}
                        onChange={e => setForm({ ...form, mensagem: e.target.value })}
                        onBlur={() => handleBlur("mensagem")}
                        error={touched.mensagem && errors.mensagem} />

                      {selectedService && (
                        <p className="sans" style={{ fontSize: 12, color: "rgba(255,255,255,.3)", lineHeight: 1.5, marginTop: -4 }}>
                          💡 Preencha os campos entre [ ] com as informações do seu negócio.
                        </p>
                      )}

                      {/* ── reCAPTCHA ── */}
                      <div className="recaptcha-wrap">
                        {/* Widget renders here — background forced white so it's visible on dark section */}
                        <div
                          ref={captchaRef}
                          style={{
                            display: "inline-block",
                            borderRadius: 6,
                            overflow: "hidden",
                            border: captchaError ? `2px solid ${C.error}` : "2px solid transparent",
                            transition: "border-color .2s",
                          }}
                        />
                        {captchaError && (
                          <div className="recaptcha-error-msg">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.error} strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                            Por favor, confirme que você não é um robô.
                          </div>
                        )}
                      </div>

                      <button
                        className="btn-gold"
                        onClick={handleSubmit}
                        disabled={submitting}
                        style={{ alignSelf: "flex-start", display: "flex", alignItems: "center", gap: 8 }}
                      >
                        {submitting
                          ? <><svg style={{ animation: "spin 1s linear infinite" }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>Enviando...</>
                          : "Enviar mensagem →"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#060F15", padding: "28px 24px", borderTop: `3px solid ${C.gold}` }}>
        <div className="footer-inner" style={{ maxWidth: 860, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <span className="serif" style={{ fontSize: 20, fontWeight: 700, color: C.white }}>GM</span>
          <div style={{ display: "flex", gap: 8 }}>
            {socials.map(s => <a key={s.label} className="social-btn" href={s.url} target="_blank" rel="noopener noreferrer" title={s.label}>{s.svg}</a>)}
          </div>
          <span className="sans" style={{ fontSize: 12, color: "rgba(255,255,255,.25)" }}>© {new Date().getFullYear()} Gabriel Maciel</span>
        </div>
      </footer>
    </div>
  );
}
