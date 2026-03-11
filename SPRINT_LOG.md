# QHUMA OS — Sprint Log
> Este archivo es escrito por el agente al final de cada ciclo y leído al inicio del siguiente.
> NO editar manualmente.

---

## DOCUMENTOS FUNDACIONALES (leer siempre antes de implementar)

| Archivo | Ruta | Propósito |
|---------|------|-----------|
| culture.md | `/Users/father/Documents/Colegio/Qhuma OS/culture.md` | 6 bloques pedagógicos + módulos de IA a implementar |
| QHUMA_Master_Document.md | `/Users/father/Documents/Colegio/QHUMA_Master_Document.md` | Visión, 5 pilares, QHUMA Capital, Q-Coins, etapas educativas |
| PLATAFORMA_EDUCATIVA.md | `/Users/father/Documents/Colegio/PLATAFORMA_EDUCATIVA.md` | Arquitectura técnica, modelo datos, funcionalidades killer |
| DESIGN_SYSTEM.md | `/Users/father/Documents/Colegio/Qhuma OS/DESIGN_SYSTEM.md` | Tokens de color, componentes, reglas de layout |
| Real Decreto 217/2022 | `/Users/father/Documents/Colegio/Real Decreto 217 2022 Educación Secundaria.pdf` | Normativa ESO oficial (LOMLOE) |
| Real Decreto 243/2022 | `/Users/father/Documents/Colegio/Real Decreto 243 2022 Bachillerato.pdf` | Normativa Bachillerato oficial |

---

## Principios de culture.md (aplicar en cada sprint)

### Bloque 1 — Mentalidad
- **Modo Socrático**: la IA nunca da la respuesta directa en primera interacción; siempre lanza pregunta de retorno
- **Error Log**: cada error se documenta y analiza, nunca se penaliza
- **Deep Dive**: cuando el alumno lleva X minutos en un tema por iniciativa propia, la IA profundiza en vez de redirigir

### Bloque 2 — Educación financiera
- **Dinero Real**: conceptos financieros integrados en el proyecto activo, nunca como clase aislada
- **Empresa por dentro**: estructuras organizativas reales a través de casos del proyecto

### Bloque 3 — Comunicación
- **Pitch Lab**: cada proyecto termina con presentación pública; IA actúa como coach antes de la entrega
- **Narrativa propia**: portfolio = relato de lo creado/resuelto/aprendido, no archivo de notas

### Bloque 4 — Inteligencias múltiples
- **Perfil de Inteligencias**: construido a través de 30 días de interacción (no test inicial)
- **Industrias Vivas**: inmersión en sectores reales desde los 14 años

### Bloque 5 — Adaptabilidad
- **Mercado en tiempo real**: tendencias laborales integradas en los proyectos activos
- **Aprendizaje continuo**: la plataforma siempre propone un "siguiente nivel"

### Bloque 6 — Cuerpo
- **Cuerpo como herramienta**: micro-contenido de neurociencia del movimiento cada ~90 min de pantalla

### Principio rector
> Ningún módulo se activa como contenido aislado. Todo se despliega dentro del contexto del proyecto activo. La IA no enseña finanzas — enseña finanzas porque el alumno necesita financiar su proyecto esta semana.

---

## Estado actual

- **Último ciclo completo**: Ciclo 3 ✅ (push: `3aede28`)
- **Fecha**: 2026-03-11
- **Próximo ciclo**: Ciclo 4 (integración culture.md)

---

## Sprints completados

### Ciclo 1
### [SPRINT-STUDENT][S1] EvidenceGallery ✅
- Commit: `a5eae4f`
- 12 evidencias mock Airbnb Málaga, thumbnails por tipo, badges LOMLOE, calificación 1-4
- Panel derecho: progreso circular, desglose asignatura, próxima entrega

### [SPRINT-STUDENT][S2] StudentAchievements ✅
- Commit: `8f9b553`
- 10 logros desbloqueados + 5 bloqueados. Rareza: Común/Raro/Legendario
- Tipos StudentView += achievements, Role += admin

### Ciclo 2
### [SPRINT-TEACHER][T1] TeacherAnalytics ✅
- Commit: `b06b20f`
- Heatmap 12×8 LOMLOE, barras CSS entregas vs objetivo, tabla de riesgo 0-100
- Todo en español. Solo design system colors.

### [SPRINT-ADMIN][A1] AdminDashboard ✅
- Commit: `ede462a`
- 5 tabs: Resumen, Usuarios, IA, Colegios, Informes. Selector de colegio.
- SVG health ring, sistema activo, actividad reciente, acciones rápidas.

### [SPRINT-TEACHER][T2] TeacherGradeBook ✅
- Commit: `5756af0`
- Tabla 12 alumnos × 8 competencias LOMLOE. Click-to-edit. Color coded 1-4.
- Media por alumno y por competencia. Distribución de niveles en 4 cards.

### [SPRINT-STUDENT][S3] StreakCalendar ✅
- Commit: `c508d63`
- Heatmap 5 semanas × 6 días con rgba inline para intensidad de color
- Racha actual: 12 días. Panel derecho: contador, stats, próximo hito.

### Ciclo 3
### [SPRINT-STUDENT][S4] StudentPortfolio ✅
- Commit: `6beaee7`
- Narrativa semanal del proyecto con reflexiones personales y crecimiento LOMLOE
- Gráfica antes/después por competencia (click para detalles). Nota de mentora.
- culture.md Bloque 3: "Narrativa propia". Vista "portfolio" en sidebar.

### [SPRINT-STUDENT][S5] LevelUpModal ✅
- Commit: `4e1bdc7`
- Modal animado con gradient, badge de nivel, XP ganados, perks por nivel 2-5
- Perks conectados a culture.md (Modo Socrático, QHUMA Capital, Pitch Lab)
- Trigger demo en barra XP de StudentDashboard.

### [SPRINT-TEACHER][T3] TeacherProjectGenerator ✅
- Commit: `54f7cee`
- Config: área de conocimiento, duración, competencias LOMLOE prioritarias
- 3 plantillas de proyecto completas con fases, entregables, criterios eval, impacto real
- Integración QHUMA Capital para proyectos de alto potencial.

### [SPRINT-TEACHER][T4] TeacherMessages ✅
- Commit: `3aede28`
- Chat por alumno, historial, indicadores de estado on_track/needs_attention/excelling
- 8 plantillas de respuesta rápida. Panel de próximos check-ins.

---

## Sprints pendientes — Ciclo 4 (integrar culture.md — PRIORIDAD ALTA)

- [ ] [T5] ClassHealthWidget — reemplazar hero de TeacherDashboard con anillo SVG de salud de clase (% alumnos on_track, riesgo, excelling). Mostrar alertas críticas.
- [ ] [C1] ModoSocratico — modificar `/api/tutor-chat/route.ts`: primera respuesta siempre es pregunta de retorno socrática. Si no existe la ruta, crear el handler con lógica de system prompt.
- [ ] [C2] ErrorLog — nueva sección en StudentPortfolio: "Mis errores aprendidos". Cada error = título, qué asumí, dónde falló, qué cambiaría. Lista editable con badge de competencia.
- [ ] [C3] PitchLab — nuevo componente standalone accesible desde sidebar del alumno. Cronómetro, guía de estructura del pitch (problema/solución/mercado/financiero/equipo), input de notas por sección, botón "Simular audiencia".

---

## Sprints pendientes — Ciclo 5

- [ ] [C4] PerfilInteligencias — visualización en StudentProfile de 8 dimensiones de inteligencia construidas desde interacciones (mock data + metodología Gardner)
- [ ] [C5] CuerpoHerramienta — widget de descanso activo: aparece tras 90 min en pantalla, micro-contenido neurociencia, temporizador 10 min
- [ ] [A2] AdminUserManagement — tabla usuarios, modal añadir, toggle activo/inactivo, buscador
- [ ] [A5] QHUMACapital — panel de QHUMA Capital: proyectos en pitch, inversión solicitada hasta €10.000, votación

---

## Notas técnicas (leer antes de cada ciclo)

- **StudentView type**: "dashboard" | "project" | "task" | "competencies" | "calendar" | "qcoins" | "profile" | "settings" | "evidences" | "achievements" | "streak" | "portfolio"
- **TeacherView type**: "dashboard" | "projects" | "analytics" | "calendar" | "students" | "settings" | "gradebook" | "generator" | "messages"
- **ParentView type**: "overview" | "progress" | "calendar" | "teachers" | "profile" | "settings"
- **AdminView type**: "overview" | "users" | "ai" | "schools" | "reports"
- **Sidebar**: todos los roles y sus nav arrays están en `src/components/Sidebar.tsx`. Añadir icono de lucide-react, labelEs, view.
- **page.tsx**: renderiza componentes con condición `role === X && activeView === Y`. Siempre importar el componente nuevo arriba.
- **culture.md módulos**: no son páginas nuevas, son capas de comportamiento. Implementar como: modificaciones al chat API, secciones dentro de componentes existentes, o widgets contextuales.
- **Datos LOMLOE oficiales**: Real Decreto 217/2022 define las 8 competencias clave para ESO.
- **QHUMA Capital**: proyectos reales con inversión hasta €10.000.
- **Q-Coins**: canjeables por talleres, equipamiento maker studio, excursiones, prioridad Passion Workshop.
- Push siempre una vez al final del ciclo (no por sprint).
- Todo el texto en español. Solo colores del design system. Solo lucide-react para iconos. NUNCA shadow-lg/xl.
