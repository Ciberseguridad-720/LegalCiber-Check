import { useState } from "react";

// ── DATA ────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { id: "rgpd",        label: "Protección de datos RGPD",    color: "#185FA5", max: 20 },
  { id: "email",       label: "Seguridad del correo",         color: "#534AB7", max: 20 },
  { id: "accesos",     label: "Control de accesos",           color: "#993C1D", max: 20 },
  { id: "dispositivos",label: "Dispositivos y trabajo remoto",color: "#0F6E56", max: 15 },
  { id: "backups",     label: "Copias de seguridad",          color: "#BA7517", max: 15 },
  { id: "formacion",   label: "Formación del equipo",         color: "#5F5E5A", max: 10 },
];

const QUESTIONS = [
  // ── RGPD (4 × 5 = 20 pts) ────────────────────────────────────────────────
  {
    id: 1, cat: "rgpd",
    text: "¿Tienen un Registro de Actividades de Tratamiento (RAT) documentado y actualizado?",
    options: [
      "Sí, actualizado y revisado regularmente",
      "Existe pero está desactualizado o incompleto",
      "No tenemos registro de actividades de tratamiento",
    ],
    scores: [5, 2, 0],
    risk: "No contar con el RAT es infracción directa del RGPD Art. 30 — multa de hasta €10M o el 2% de la facturación global.",
  },
  {
    id: 2, cat: "rgpd",
    text: "¿Han firmado contratos de encargo de tratamiento con todos sus proveedores cloud (Google, Microsoft, Dropbox...)?",
    options: [
      "Sí, con todos los que gestionan datos de clientes",
      "Solo con algunos proveedores",
      "No tenemos estos contratos firmados",
    ],
    scores: [5, 2, 0],
    risk: "Sin estos contratos, ceden datos personales de clientes a terceros sin cobertura legal — responsabilidad directa ante la AEPD.",
  },
  {
    id: 3, cat: "rgpd",
    text: "¿Disponen de procedimiento para atender solicitudes de derechos RGPD (acceso, rectificación, supresión) de sus clientes?",
    options: [
      "Sí, con procedimiento documentado y plazos definidos",
      "Lo gestionamos informalmente caso por caso",
      "No tenemos ningún procedimiento establecido",
    ],
    scores: [5, 2, 0],
    risk: "Superar el plazo de 1 mes en solicitudes de derechos genera sanciones directas e inmediatas de la AEPD.",
  },
  {
    id: 4, cat: "rgpd",
    text: "¿Tienen protocolo para notificar brechas de seguridad a la AEPD en menos de 72 horas?",
    options: [
      "Sí, con responsables designados y procedimiento documentado",
      "Sabemos que hay que notificar pero sin procedimiento formal",
      "No conocemos esta obligación o no tenemos protocolo",
    ],
    scores: [5, 2, 0],
    risk: "Superar las 72h en la notificación puede multiplicar la sanción hasta el nivel máximo de la infracción.",
  },
  // ── CORREO (4 × 5 = 20 pts) ──────────────────────────────────────────────
  {
    id: 5, cat: "email",
    text: "¿Los profesionales usan correo corporativo o personal (Gmail, Hotmail...) para comunicarse con clientes?",
    options: [
      "Todos usan exclusivamente correo corporativo",
      "La mayoría usa corporativo, algunos usan personal",
      "Muchos usan correo personal para asuntos de clientes",
    ],
    scores: [5, 2, 0],
    risk: "El correo personal no cumple los estándares RGPD y es el principal vector de entrada del phishing en despachos y gestorías.",
  },
  {
    id: 6, cat: "email",
    text: "¿Cifran los documentos confidenciales antes de enviarlos por email a clientes?",
    options: [
      "Sí, siempre, con contraseña o herramienta de cifrado",
      "A veces, solo para los más sensibles",
      "No, enviamos los documentos directamente como adjunto",
    ],
    scores: [5, 2, 0],
    risk: "Enviar documentación de clientes sin cifrar incumple el deber de confidencialidad profesional y el Art. 32 del RGPD.",
  },
  {
    id: 7, cat: "email",
    text: "¿Han recibido intentos de phishing o fraude del CEO en los últimos 12 meses?",
    options: [
      "No hemos recibido ningún intento detectado",
      "Sí, pero los detectamos sin consecuencias",
      "Sí y alguno fue exitoso, o no sabríamos identificarlos",
    ],
    scores: [5, 2, 0],
    risk: "El 91% de los ciberataques a despachos comienzan con un email. La incapacidad de detectarlos es el mayor riesgo operativo.",
  },
  {
    id: 8, cat: "email",
    text: "¿Tienen protección avanzada de correo más allá del filtro antispam básico?",
    options: [
      "Sí, con solución específica (Microsoft Defender, Proofpoint...)",
      "Solo el filtro básico del proveedor de correo",
      "No tenemos protección específica o no lo sabemos",
    ],
    scores: [5, 2, 0],
    risk: "Los filtros básicos no detectan spear phishing personalizado, el más frecuente y efectivo contra despachos.",
  },
  // ── ACCESOS (4 × 5 = 20 pts) ─────────────────────────────────────────────
  {
    id: 9, cat: "accesos",
    text: "¿Utilizan autenticación de doble factor (2FA) para acceder a sistemas con datos de clientes?",
    options: [
      "Sí, en todos los sistemas críticos (email, CRM, almacenamiento)",
      "Solo en alguno",
      "No usamos autenticación de doble factor",
    ],
    scores: [5, 2, 0],
    risk: "El 2FA bloquea el 99.9% de los ataques automatizados. Es la medida con mejor ratio coste/protección del mercado.",
  },
  {
    id: 10, cat: "accesos",
    text: "¿Cómo gestionan los accesos cuando un empleado causa baja?",
    options: [
      "Protocolo inmediato: baja de accesos el mismo día de la salida",
      "Lo hacemos pero sin protocolo formal ni plazo definido",
      "No tenemos un proceso establecido para esto",
    ],
    scores: [5, 2, 0],
    risk: "El 20% de las brechas internas en despachos involucran accesos de ex-empleados que no fueron revocados a tiempo.",
  },
  {
    id: 11, cat: "accesos",
    text: "¿Cada profesional accede solo a la información necesaria para su trabajo (principio de mínimo privilegio)?",
    options: [
      "Sí, accesos segmentados por rol y nivel de responsabilidad",
      "Parcialmente, algunos tienen más acceso del necesario",
      "Todos acceden a toda la información del despacho",
    ],
    scores: [5, 2, 0],
    risk: "El principio de mínimo privilegio es obligatorio bajo RGPD Art. 32 y limita el daño en caso de cuenta comprometida.",
  },
  {
    id: 12, cat: "accesos",
    text: "¿Tienen política de contraseñas seguras y usan gestor de contraseñas corporativo?",
    options: [
      "Sí, política definida y gestor corporativo (Bitwarden, 1Password...)",
      "Tenemos normas básicas pero sin gestor corporativo",
      "Cada persona gestiona sus contraseñas como considera",
    ],
    scores: [5, 2, 0],
    risk: "La reutilización de contraseñas es el origen del 80% de los accesos no autorizados en despachos y gestorías de tamaño medio.",
  },
  // ── DISPOSITIVOS (3 × 5 = 15 pts) ────────────────────────────────────────
  {
    id: 13, cat: "dispositivos",
    text: "¿Los empleados acceden a datos de clientes desde dispositivos personales sin control corporativo?",
    options: [
      "No, solo desde dispositivos corporativos gestionados centralmente",
      "Sí, pero con restricciones (VPN obligatoria, sin descarga local)",
      "Sí, sin ningún tipo de control específico",
    ],
    scores: [5, 2, 0],
    risk: "Un móvil personal con datos de clientes sin cifrado de disco convierte cada robo en una brecha RGPD de notificación obligatoria.",
  },
  {
    id: 14, cat: "dispositivos",
    text: "¿Todos los dispositivos tienen antivirus/EDR actualizado y cifrado de disco activado?",
    options: [
      "Sí, gestionados centralizadamente con EDR profesional",
      "Antivirus básico en algunos dispositivos, no en todos",
      "No tenemos solución antivirus en todos o no lo sabemos",
    ],
    scores: [5, 2, 0],
    risk: "Un portátil sin cifrado de disco infectado con ransomware puede paralizar el despacho durante días, con pérdida media de 45.000€.",
  },
  {
    id: 15, cat: "dispositivos",
    text: "¿Utilizan VPN al acceder a sistemas del despacho en remoto o desde WiFi público?",
    options: [
      "Sí, VPN obligatoria para cualquier acceso remoto",
      "La tienen disponible pero no es obligatorio usarla",
      "No tienen VPN o no la utilizan habitualmente",
    ],
    scores: [5, 2, 0],
    risk: "Trabajar en una cafetería o aeropuerto sin VPN expone las comunicaciones del despacho a interceptación en redes abiertas.",
  },
  // ── BACKUPS (3 × 5 = 15 pts) ─────────────────────────────────────────────
  {
    id: 16, cat: "backups",
    text: "¿Con qué frecuencia realizan copias de seguridad de los expedientes y datos de clientes?",
    options: [
      "Backup automático diario con copia en ubicación separada",
      "Backup semanal o manual cuando lo recordamos",
      "Sin backup regular o no lo sabemos con certeza",
    ],
    scores: [5, 2, 0],
    risk: "Sin backup diario, un ataque ransomware destruye de media 3.5 días de trabajo facturable del despacho.",
  },
  {
    id: 17, cat: "backups",
    text: "¿Han probado restaurar una copia de seguridad en los últimos 6 meses?",
    options: [
      "Sí, con pruebas de restauración documentadas y exitosas",
      "Lo hemos hecho alguna vez pero sin regularidad",
      "Nunca hemos probado que el backup funcione realmente",
    ],
    scores: [5, 2, 0],
    risk: "El 60% de los backups que no se testean fallan en el momento crítico. Un backup no verificado no existe operativamente.",
  },
  {
    id: 18, cat: "backups",
    text: "¿Las copias de seguridad están almacenadas separadas de los sistemas principales (regla 3-2-1)?",
    options: [
      "Sí, backup en cloud con copia inmutable o ubicación externa",
      "Backup en disco externo dentro de la misma oficina",
      "Sin backup en ubicación separada de los sistemas",
    ],
    scores: [5, 2, 0],
    risk: "Un backup en la misma red que los sistemas principales queda cifrado junto a los datos en un ataque ransomware.",
  },
  // ── FORMACIÓN (2 × 5 = 10 pts) ───────────────────────────────────────────
  {
    id: 19, cat: "formacion",
    text: "¿Han recibido los empleados formación específica en ciberseguridad en el último año?",
    options: [
      "Sí, formación formal con registro de asistencia y evaluación",
      "Hemos compartido alguna guía o hecho alguna sesión informal",
      "No hemos realizado ninguna formación específica",
    ],
    scores: [5, 2, 0],
    risk: "El error humano es la causa del 88% de los incidentes en despachos. La formación es la medida preventiva más rentable.",
  },
  {
    id: 20, cat: "formacion",
    text: "¿Tienen protocolo para que los empleados reporten incidentes de seguridad (email sospechoso, acceso inusual)?",
    options: [
      "Sí, protocolo documentado con contacto designado y tiempos de respuesta",
      "Saben a quién avisar pero sin protocolo formal",
      "No tenemos ningún protocolo de reporte establecido",
    ],
    scores: [5, 2, 0],
    risk: "Sin protocolo de reporte, el tiempo medio de detección supera los 200 días — una eternidad en términos de daño de reputación y datos.",
  },
];

// ── HELPERS ──────────────────────────────────────────────────────────────────

function calcScores(answers) {
  const catScores = {};
  CATEGORIES.forEach((c) => { catScores[c.id] = 0; });
  QUESTIONS.forEach((q) => {
    if (answers[q.id] !== undefined) catScores[q.cat] += q.scores[answers[q.id]];
  });
  const total = Object.values(catScores).reduce((a, b) => a + b, 0);
  return { catScores, total };
}

function getRisk(score) {
  if (score < 40) return { label: "Riesgo crítico", color: "#A32D2D", bg: "#FCEBEB", border: "#F09595" };
  if (score < 60) return { label: "Riesgo alto",    color: "#854F0B", bg: "#FAEEDA", border: "#FAC775" };
  if (score < 80) return { label: "Riesgo medio",   color: "#BA7517", bg: "#FAEEDA", border: "#EF9F27" };
  if (score < 95) return { label: "Riesgo bajo",    color: "#27500A", bg: "#EAF3DE", border: "#97C459" };
  return              { label: "Protegido",          color: "#085041", bg: "#E1F5EE", border: "#5DCAA5" };
}

function ScoreArc({ score }) {
  const r = 72, cx = 90, cy = 90;
  const startAngle = Math.PI * 0.75;
  const endAngle   = Math.PI * 2.25;
  const sweep      = endAngle - startAngle;
  const filled     = startAngle + (score / 100) * sweep;
  const toXY = (a) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  const [sx, sy] = toXY(startAngle);
  const [ex, ey] = toXY(endAngle);
  const [fx, fy] = toXY(filled);
  const risk = getRisk(score);
  const large = (score / 100) * sweep > Math.PI ? 1 : 0;
  return (
    <svg width="180" height="160" viewBox="0 0 180 160" role="img" aria-label={`Score ${score} de 100`}>
      <path d={`M${sx},${sy} A${r},${r} 0 1,1 ${ex},${ey}`}
        fill="none" stroke="var(--color-border-tertiary)" strokeWidth="12" strokeLinecap="round" />
      {score > 0 && (
        <path d={`M${sx},${sy} A${r},${r} 0 ${large},1 ${fx},${fy}`}
          fill="none" stroke={risk.color} strokeWidth="12" strokeLinecap="round" />
      )}
      <text x="90" y="86" textAnchor="middle" fontSize="32" fontWeight="500"
        fill="var(--color-text-primary)">{score}</text>
      <text x="90" y="106" textAnchor="middle" fontSize="12"
        fill="var(--color-text-secondary)">de 100</text>
      <text x="90" y="128" textAnchor="middle" fontSize="13" fontWeight="500"
        fill={risk.color}>{risk.label}</text>
    </svg>
  );
}

// ── SCREENS ──────────────────────────────────────────────────────────────────

const s = {
  card: {
    background: "var(--color-background-primary)",
    border: "0.5px solid var(--color-border-tertiary)",
    borderRadius: 12,
    padding: "24px 28px",
    maxWidth: 620,
    margin: "0 auto",
  },
  label: { fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 4 },
  h1: { fontSize: 22, fontWeight: 500, margin: "0 0 6px", color: "var(--color-text-primary)" },
  h2: { fontSize: 18, fontWeight: 500, margin: "0 0 4px", color: "var(--color-text-primary)" },
  body: { fontSize: 14, color: "var(--color-text-secondary)", lineHeight: 1.65, margin: 0 },
  btn: {
    padding: "10px 20px", borderRadius: 8, fontSize: 14, fontWeight: 500,
    border: "0.5px solid var(--color-border-secondary)", cursor: "pointer",
    background: "transparent", color: "var(--color-text-primary)",
  },
  btnPrimary: {
    padding: "10px 20px", borderRadius: 8, fontSize: 14, fontWeight: 500,
    border: "none", cursor: "pointer",
    background: "var(--color-text-primary)", color: "var(--color-background-primary)",
  },
  input: {
    width: "100%", padding: "10px 12px", borderRadius: 8, fontSize: 14,
    border: "0.5px solid var(--color-border-secondary)",
    background: "var(--color-background-primary)",
    color: "var(--color-text-primary)", boxSizing: "border-box",
  },
  optBtn: (sel) => ({
    display: "block", width: "100%", textAlign: "left", padding: "12px 16px",
    borderRadius: 8, fontSize: 13, lineHeight: 1.5,
    border: sel ? "1.5px solid var(--color-border-info)" : "0.5px solid var(--color-border-tertiary)",
    background: sel ? "var(--color-background-info)" : "var(--color-background-primary)",
    color: sel ? "var(--color-text-info)" : "var(--color-text-primary)",
    cursor: "pointer", marginBottom: 8,
  }),
  divider: { borderTop: "0.5px solid var(--color-border-tertiary)", margin: "20px 0" },
  tag: (color) => ({
    display: "inline-block", fontSize: 11, padding: "2px 8px", borderRadius: 20,
    background: color + "18", color: color, fontWeight: 500, marginRight: 4,
  }),
};

function IntroScreen({ onStart }) {
  const [firmType, setFirmType] = useState("");
  const [firmName, setFirmName] = useState("");

  const types = [
    { id: "despacho", label: "Despacho de abogados", sub: "Firma jurídica o asesoría legal" },
    { id: "gestoria", label: "Gestoría / Asesoría", sub: "Fiscal, contable o laboral" },
  ];

  return (
    <div style={s.card}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ ...s.tag("#185FA5"), marginBottom: 12 }}>Ciberseguridad 720</div>
        <h1 style={s.h1}>LegalCiber Check</h1>
        <p style={s.body}>
          Diagnóstico gratuito de ciberseguridad y cumplimiento RGPD para despachos de abogados
          y gestorías. 20 preguntas · 10 minutos · Resultado inmediato.
        </p>
      </div>

      <div style={{ ...s.divider, margin: "16px 0" }} />

      <div style={{ marginBottom: 16 }}>
        <div style={s.label}>Tipo de despacho o empresa</div>
        <div style={{ display: "flex", gap: 10 }}>
          {types.map((t) => (
            <div key={t.id} onClick={() => setFirmType(t.id)}
              style={{
                flex: 1, padding: "12px 14px", borderRadius: 8, cursor: "pointer",
                border: firmType === t.id ? "1.5px solid var(--color-border-info)" : "0.5px solid var(--color-border-tertiary)",
                background: firmType === t.id ? "var(--color-background-info)" : "var(--color-background-secondary)",
              }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: firmType === t.id ? "var(--color-text-info)" : "var(--color-text-primary)" }}>
                {t.label}
              </div>
              <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginTop: 2 }}>{t.sub}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <div style={s.label}>Nombre del despacho o gestoría (opcional)</div>
        <input style={s.input} placeholder="Ej: Despacho García & Asociados"
          value={firmName} onChange={(e) => setFirmName(e.target.value)} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 20 }}>
        {[
          ["<10 min", "Duración"],
          ["20", "Preguntas"],
          ["Gratuito", "Sin registro"],
        ].map(([v, l]) => (
          <div key={l} style={{ background: "var(--color-background-secondary)", borderRadius: 8, padding: "10px 12px", textAlign: "center" }}>
            <div style={{ fontSize: 18, fontWeight: 500, color: "var(--color-text-primary)" }}>{v}</div>
            <div style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>{l}</div>
          </div>
        ))}
      </div>

      <button disabled={!firmType} onClick={() => onStart(firmType, firmName)}
        style={{ ...s.btnPrimary, width: "100%", opacity: firmType ? 1 : 0.4 }}>
        Iniciar diagnóstico
      </button>

      <p style={{ ...s.body, fontSize: 11, marginTop: 12, textAlign: "center" }}>
        Al continuar acepta la política de privacidad de Ciberseguridad 720. Los datos no se comparten con terceros.
      </p>
    </div>
  );
}

function QuestionScreen({ qIndex, total, question, catLabel, onAnswer, selectedAnswer }) {
  const pct = Math.round((qIndex / total) * 100);
  const catColor = CATEGORIES.find((c) => c.id === question.cat)?.color || "#888";

  return (
    <div style={s.card}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <span style={{ ...s.tag(catColor) }}>{catLabel}</span>
          <span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>
            {qIndex + 1} / {total}
          </span>
        </div>
        <div style={{ background: "var(--color-background-tertiary)", borderRadius: 20, height: 4, overflow: "hidden" }}>
          <div style={{ width: `${pct}%`, height: 4, background: catColor, borderRadius: 20, transition: "width .3s" }} />
        </div>
      </div>

      <p style={{ fontSize: 15, fontWeight: 500, color: "var(--color-text-primary)", lineHeight: 1.5, marginBottom: 18 }}>
        {question.text}
      </p>

      <div>
        {question.options.map((opt, i) => (
          <button key={i} onClick={() => onAnswer(i)} style={s.optBtn(selectedAnswer === i)}>
            <span style={{ fontSize: 11, fontWeight: 500, marginRight: 6,
              color: selectedAnswer === i ? "var(--color-text-info)" : "var(--color-text-tertiary)" }}>
              {["A", "B", "C"][i]}
            </span>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function EmailScreen({ score, onSubmit }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const risk = getRisk(score);

  return (
    <div style={s.card}>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <ScoreArc score={score} />
        <div style={{
          display: "inline-block", padding: "4px 14px", borderRadius: 20, fontSize: 13, fontWeight: 500,
          background: risk.bg, color: risk.color, border: `1px solid ${risk.border}`, marginTop: 4,
        }}>
          {risk.label}
        </div>
      </div>

      <div style={s.divider} />

      <h2 style={{ ...s.h2, marginBottom: 8 }}>Reciba su informe completo</h2>
      <p style={{ ...s.body, marginBottom: 16 }}>
        El informe ejecutivo incluye el análisis detallado por categoría, los 5 riesgos prioritarios
        con referencia normativa RGPD, y una hoja de ruta de 90 días con coste estimado de cada medida.
      </p>

      <div style={{ marginBottom: 12 }}>
        <div style={s.label}>Nombre y apellidos</div>
        <input style={s.input} placeholder="María García López"
          value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div style={{ marginBottom: 20 }}>
        <div style={s.label}>Email profesional</div>
        <input style={s.input} type="email" placeholder="mgarcia@despachogarcia.com"
          value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>

      <button onClick={() => onSubmit(email, name)} disabled={!email || !name}
        style={{ ...s.btnPrimary, width: "100%", opacity: email && name ? 1 : 0.4 }}>
        Ver informe completo gratuito
      </button>
      <p style={{ ...s.body, fontSize: 11, marginTop: 10, textAlign: "center" }}>
        Sin spam. Puede darse de baja en cualquier momento. Solo le enviaremos el informe y alertas regulatorias relevantes para su sector.
      </p>
    </div>
  );
}

function ResultsScreen({ firmType, firmName, answers }) {
  const { catScores, total } = calcScores(answers);
  const risk = getRisk(total);
  const [tab, setTab] = useState("resumen");

  const worstCats = [...CATEGORIES]
    .map((c) => ({ ...c, pct: Math.round((catScores[c.id] / c.max) * 100) }))
    .sort((a, b) => a.pct - b.pct)
    .slice(0, 3);

  const worstQs = QUESTIONS
    .filter((q) => answers[q.id] === 2)
    .slice(0, 5);

  const roadmap = [
    { week: "Semana 1–2", items: ["Activar 2FA en correo y sistemas críticos (coste: €0)", "Crear protocolo de notificación de incidentes (1h de trabajo)", "Verificar que existe contrato de encargo con Google/Microsoft"] },
    { week: "Semana 3–4", items: ["Implantar gestor de contraseñas corporativo (€3–5/usuario/mes)", "Revisar y actualizar el Registro de Actividades de Tratamiento", "Briefing de ciberseguridad al equipo (30 minutos)"] },
    { week: "Mes 2", items: ["Contratar solución EDR para todos los dispositivos (incluido en Securiza720)", "Configurar backup diario automático con copia offsite", "Cifrado de disco en todos los portátiles"] },
    { week: "Mes 3", items: ["Realizar simulacro de phishing con el equipo", "Prueba de restauración de backup documentada", "Revisión anual del cumplimiento RGPD con asesor"] },
  ];

  const tabs = ["resumen", "análisis", "hoja de ruta", "plan pro"];

  return (
    <div style={{ ...s.card, maxWidth: 680 }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 20, flexWrap: "wrap" }}>
        <div>
          <ScoreArc score={total} />
        </div>
        <div style={{ flex: 1, minWidth: 240 }}>
          <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginBottom: 4 }}>
            {firmName || (firmType === "despacho" ? "Despacho de abogados" : "Gestoría / Asesoría")}
          </div>
          <h1 style={{ ...s.h1, fontSize: 18 }}>Diagnóstico de ciberseguridad</h1>
          <div style={{
            display: "inline-block", padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 500,
            background: risk.bg, color: risk.color, border: `1px solid ${risk.border}`, marginBottom: 12,
          }}>{risk.label}</div>
          <p style={{ ...s.body, fontSize: 13 }}>
            {total < 60
              ? "Su despacho presenta carencias críticas que lo exponen a sanciones RGPD y a paralización por ransomware. Recomendamos actuar esta semana."
              : total < 80
              ? "Tiene una base, pero hay vulnerabilidades importantes. Las medidas prioritarias de abajo pueden resolverse en menos de 30 días."
              : "Buen nivel de protección. Las mejoras identificadas le acercan a la protección total y al cumplimiento RGPD completo."}
          </p>
        </div>
      </div>

      <div style={s.divider} />

      <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
        {tabs.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            style={{
              ...s.btn, fontSize: 12, padding: "6px 14px",
              background: tab === t ? "var(--color-background-info)" : "transparent",
              color: tab === t ? "var(--color-text-info)" : "var(--color-text-secondary)",
              borderColor: tab === t ? "var(--color-border-info)" : "var(--color-border-tertiary)",
            }}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {tab === "resumen" && (
        <div>
          <div style={{ marginBottom: 20 }}>
            {CATEGORIES.map((c) => {
              const pct = Math.round((catScores[c.id] / c.max) * 100);
              return (
                <div key={c.id} style={{ display: "grid", gridTemplateColumns: "160px 1fr 42px", gap: 10, alignItems: "center", marginBottom: 10 }}>
                  <div style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>{c.label}</div>
                  <div style={{ background: "var(--color-background-tertiary)", borderRadius: 20, height: 8, overflow: "hidden" }}>
                    <div style={{ width: `${pct}%`, height: 8, borderRadius: 20, background: c.color, transition: "width .5s" }} />
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 500, color: pct < 50 ? "#A32D2D" : pct < 75 ? "#854F0B" : "#27500A", textAlign: "right" }}>
                    {pct}%
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ background: "var(--color-background-secondary)", borderRadius: 8, padding: "14px 16px" }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 10 }}>
              3 áreas más críticas — actuar primero
            </div>
            {worstCats.map((c, i) => (
              <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#A32D2D18", color: "#A32D2D", fontSize: 11, fontWeight: 500, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-primary)" }}>{c.label}</div>
                  <div style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>Score: {c.pct}% — necesita mejora inmediata</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "análisis" && (
        <div>
          {worstQs.length === 0
            ? <p style={s.body}>¡Excelente! No se detectaron respuestas de riesgo alto.</p>
            : worstQs.map((q) => (
              <div key={q.id} style={{ borderLeft: "3px solid #A32D2D", padding: "10px 14px", marginBottom: 12, borderRadius: "0 8px 8px 0", background: "var(--color-background-secondary)" }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 4 }}>{q.text}</div>
                <div style={{ fontSize: 12, color: "#A32D2D", lineHeight: 1.5 }}>{q.risk}</div>
              </div>
            ))
          }
          <div style={{ background: "#FAEEDA", borderRadius: 8, padding: "12px 14px", marginTop: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: "#854F0B", marginBottom: 4 }}>Referencia normativa</div>
            <div style={{ fontSize: 11, color: "#854F0B", lineHeight: 1.7 }}>
              RGPD Art. 5 (principios del tratamiento) · Art. 25 (privacidad por diseño) ·
              Art. 30 (registro de actividades) · Art. 32 (seguridad del tratamiento) ·
              Art. 33 (notificación de brechas 72h) · LOPDGDD Art. 28 (medidas de seguridad)
            </div>
          </div>
        </div>
      )}

      {tab === "hoja de ruta" && (
        <div>
          {roadmap.map((r, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: 0, marginBottom: 2 }}>
              <div style={{
                fontSize: 11, fontWeight: 500, padding: "10px 12px",
                background: i === 0 ? "var(--color-background-danger)" : i === 1 ? "var(--color-background-warning)" : "var(--color-background-success)",
                color: i === 0 ? "var(--color-text-danger)" : i === 1 ? "var(--color-text-warning)" : "var(--color-text-success)",
                borderRadius: "8px 0 0 8px", display: "flex", alignItems: "center",
              }}>{r.week}</div>
              <div style={{
                fontSize: 12, color: "var(--color-text-secondary)", padding: "10px 14px",
                border: "0.5px solid var(--color-border-tertiary)", borderLeft: "none",
                borderRadius: "0 8px 8px 0", lineHeight: 1.8,
              }}>
                {r.items.map((item, j) => <div key={j}>• {item}</div>)}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "plan pro" && (
        <div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
            {[
              { name: "Professional", price: "€79/mes", features: ["Informe ejecutivo PDF completo", "GAP analysis RGPD documentado", "Monitorización mensual del score", "Alertas de novedades regulatorias", "Soporte email prioritario"], featured: true },
              { name: "Securiza720", price: "€249/mes", features: ["Todo lo de Professional", "EDR gestionado en todos los dispositivos", "Backup diario automatizado", "vCISO dedicado Ciberseguridad 720", "Respuesta ante incidentes incluida"], featured: false },
            ].map((plan) => (
              <div key={plan.name} style={{
                flex: 1, minWidth: 220,
                border: plan.featured ? "2px solid var(--color-border-info)" : "0.5px solid var(--color-border-tertiary)",
                borderRadius: 12, padding: "16px 18px",
              }}>
                {plan.featured && (
                  <div style={{ background: "var(--color-background-info)", color: "var(--color-text-info)", fontSize: 11, fontWeight: 500, padding: "2px 10px", borderRadius: 20, display: "inline-block", marginBottom: 8 }}>
                    Recomendado
                  </div>
                )}
                <div style={{ fontSize: 15, fontWeight: 500, color: "var(--color-text-primary)" }}>{plan.name}</div>
                <div style={{ fontSize: 22, fontWeight: 500, margin: "6px 0 12px", color: "var(--color-text-primary)" }}>
                  {plan.price}
                </div>
                {plan.features.map((f) => (
                  <div key={f} style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 5 }}>
                    <span style={{ color: "var(--color-text-success)" }}>✓ </span>{f}
                  </div>
                ))}
                <button style={{ ...s.btnPrimary, width: "100%", marginTop: 16, fontSize: 13 }}
                  onClick={() => window.open("mailto:info@ciberseguridad720.com?subject=Solicitud " + plan.name, "_blank")}>
                  Solicitar información
                </button>
              </div>
            ))}
          </div>
          <div style={{ background: "var(--color-background-secondary)", borderRadius: 8, padding: "12px 14px", fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.7 }}>
            <b style={{ color: "var(--color-text-primary)" }}>¿Tiene dudas?</b> Solicite una videollamada de 20 minutos sin compromiso.
            Analizamos su situación y le decimos exactamente qué necesita hacer primero, sin jerga técnica.<br />
            <span style={{ color: "var(--color-text-info)" }}>info@ciberseguridad720.com · +34 624 27 85 33</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ── MAIN APP ─────────────────────────────────────────────────────────────────

export default function LegalCiberCheck() {
  const [phase, setPhase]           = useState("intro");
  const [firmType, setFirmType]     = useState("");
  const [firmName, setFirmName]     = useState("");
  const [currentQ, setCurrentQ]     = useState(0);
  const [answers, setAnswers]       = useState({});
  const [selectedOpt, setSelectedOpt] = useState(null);

  const handleStart = (type, name) => {
    setFirmType(type); setFirmName(name); setPhase("questions");
  };

  const handleAnswer = (optIndex) => {
    setSelectedOpt(optIndex);
    setTimeout(() => {
      const newAns = { ...answers, [QUESTIONS[currentQ].id]: optIndex };
      setAnswers(newAns);
      setSelectedOpt(null);
      if (currentQ + 1 < QUESTIONS.length) {
        setCurrentQ(currentQ + 1);
      } else {
        setPhase("email");
      }
    }, 350);
  };

  const catLabel = CATEGORIES.find((c) => c.id === QUESTIONS[currentQ]?.cat)?.label || "";

  return (
    <div style={{ padding: "1rem 0", fontFamily: "var(--font-sans)" }}>
      {phase === "intro" && <IntroScreen onStart={handleStart} />}
      {phase === "questions" && (
        <QuestionScreen
          qIndex={currentQ}
          total={QUESTIONS.length}
          question={QUESTIONS[currentQ]}
          catLabel={catLabel}
          onAnswer={handleAnswer}
          selectedAnswer={selectedOpt}
        />
      )}
      {phase === "email" && (
        <EmailScreen
          score={calcScores(answers).total}
          onSubmit={() => setPhase("results")}
        />
      )}
      {phase === "results" && (
        <ResultsScreen firmType={firmType} firmName={firmName} answers={answers} />
      )}

      {phase === "questions" && (
        <div style={{ textAlign: "center", marginTop: 12 }}>
          <button style={{ ...s.btn, fontSize: 12, color: "var(--color-text-tertiary)", border: "none" }}
            onClick={() => { if (currentQ > 0) { setCurrentQ(currentQ - 1); setSelectedOpt(null); } else { setPhase("intro"); } }}>
            ← Volver
          </button>
        </div>
      )}
    </div>
  );
}
