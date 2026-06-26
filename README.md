# LegalCiber Check

**Diagnóstico gratuito de ciberseguridad y cumplimiento RGPD para despachos de abogados y gestorías**

[![Estado](https://img.shields.io/badge/estado-en%20desarrollo-yellow)](https://github.com/ciberseguridad720/legalciber-check)
[![Licencia](https://img.shields.io/badge/licencia-MIT-blue)](LICENSE)
[![Hecho con](https://img.shields.io/badge/hecho%20con-React-61DAFB)](https://reactjs.org)
[![Por](https://img.shields.io/badge/por-Ciberseguridad%20720-blue)](https://ciberseguridad720.com)

---

## Qué es

LegalCiber Check es una herramienta web gratuita que permite a cualquier despacho de abogados o gestoría evaluar su nivel de ciberseguridad y cumplimiento RGPD en menos de 10 minutos, sin necesidad de conocimientos técnicos.

**El flujo es simple:**
1. El usuario responde 20 preguntas sobre su situación real
2. La herramienta calcula un score de 0 a 100 por categoría
3. Se genera un informe con los riesgos prioritarios y una hoja de ruta de 90 días

---

## Para quién es

| Perfil | Por qué lo necesita |
|--------|---------------------|
| Despachos de abogados | RGPD Art. 32 · deber de confidencialidad · protección de datos de clientes |
| Gestorías y asesorías | Datos fiscales de cientos de clientes · RGPD · NIS2 en cadena de suministro |
| Colegios de mediadores | Herramienta para ofrecer a sus colegiados como valor añadido |

---

## Categorías del diagnóstico

| Categoría | Peso | Marco normativo |
|-----------|------|-----------------|
| Protección de datos RGPD | 20 pts | RGPD Art. 5, 25, 30, 32, 33 |
| Seguridad del correo | 20 pts | RGPD Art. 32 · ENS |
| Control de accesos | 20 pts | RGPD Art. 32 · principio mínimo privilegio |
| Dispositivos y trabajo remoto | 15 pts | RGPD Art. 32 · LOPDGDD |
| Copias de seguridad | 15 pts | Continuidad de negocio |
| Formación del equipo | 10 pts | RGPD Art. 39 |
| **Total** | **100 pts** | |

---

## Niveles de riesgo

| Score | Nivel | Descripción |
|-------|-------|-------------|
| 0 – 39 | 🔴 Crítico | Exposición máxima — actuar esta semana |
| 40 – 59 | 🟠 Alto | Carencias graves — resolver en 30 días |
| 60 – 79 | 🟡 Medio | Base razonable — optimizar puntos débiles |
| 80 – 94 | 🟢 Bajo | Buen nivel — mantener y mejorar |
| 95 – 100 | ✅ Protegido | Nivel avanzado |

---

## Stack técnico

- **Frontend:** React 18 · CSS variables (design system C720)
- **IA:** Claude API (Anthropic) para generación de informes personalizados
- **Backend:** Node.js · Supabase (base de datos y autenticación)
- **Pagos:** Stripe (plan Professional: €79/mes)
- **Hosting:** Vercel
- **PDF:** Generación de informes ejecutivos vía API

---

## Estructura del proyecto

```
legalciber-check/
├── src/
│   ├── components/
│   │   ├── IntroScreen.jsx       # Selección tipo de empresa
│   │   ├── QuestionScreen.jsx    # Flujo de preguntas
│   │   ├── EmailCapture.jsx      # Captura de lead
│   │   ├── ResultsScreen.jsx     # Resultados y recomendaciones
│   │   └── ScoreArc.jsx          # Visualización del score
│   ├── data/
│   │   └── questions.js          # Banco de 20 preguntas con scoring
│   ├── utils/
│   │   └── scoring.js            # Lógica de cálculo de puntuaciones
│   └── App.jsx
├── api/
│   ├── generate-report.js        # Endpoint Claude API → PDF
│   └── capture-lead.js           # Supabase lead storage
├── public/
└── README.md
```

---

## Planes de producto

| Plan | Precio | Incluye |
|------|--------|---------|
| **Gratuito** | €0 | Diagnóstico completo · Score · Top 3 riesgos |
| **Professional** | €79/mes | Informe PDF ejecutivo · GAP RGPD · Monitorización mensual · Alertas regulatorias |
| **Partner / White-label** | €299/mes | Multi-cliente · Dashboard · Marca blanca |
| **Securiza720** | €249/mes | EDR gestionado · vCISO · Backup · Respuesta a incidentes |

---

## Desarrollo local

```bash
# Clonar el repositorio
git clone https://github.com/ciberseguridad720/legalciber-check.git
cd legalciber-check

# Instalar dependencias
npm install

# Variables de entorno (crear .env.local)
cp .env.example .env.local
# Añadir: ANTHROPIC_API_KEY, SUPABASE_URL, SUPABASE_KEY, STRIPE_KEY

# Iniciar servidor de desarrollo
npm run dev
```

---

## Roadmap

- [x] MVP: 20 preguntas + scoring + resultados
- [x] Prototipo funcional (React)
- [ ] Backend Supabase (captura de leads)
- [ ] Generación de PDF vía Claude API
- [ ] Integración Stripe (plan Professional)
- [ ] Landing page de conversión
- [ ] Version 2: diagnóstico por verticales (seguros, AAPP)

---

## Licencia

MIT © [Ciberseguridad 720](https://ciberseguridad720.com)

---

## Contacto

**Ciberseguridad 720** · info@ciberseguridad720.com · +34 624 27 85 33  
[ciberseguridad720.com](https://ciberseguridad720.com)
