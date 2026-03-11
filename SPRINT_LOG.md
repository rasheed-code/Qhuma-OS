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

- **Último ciclo completo**: Ciclo 22 ✅ (push: `48a5073`)
- **Fecha**: 2026-03-11
- **Próximo ciclo**: Ciclo 23

---

## Sprints completados

### Ciclo 1
### [SPRINT-STUDENT][S1] EvidenceGallery ✅ — Commit: `a5eae4f`
### [SPRINT-STUDENT][S2] StudentAchievements ✅ — Commit: `8f9b553`

### Ciclo 2
### [SPRINT-TEACHER][T1] TeacherAnalytics ✅ — Commit: `b06b20f`
### [SPRINT-ADMIN][A1] AdminDashboard ✅ — Commit: `ede462a`
### [SPRINT-TEACHER][T2] TeacherGradeBook ✅ — Commit: `5756af0`
### [SPRINT-STUDENT][S3] StreakCalendar ✅ — Commit: `c508d63`

### Ciclo 3
### [SPRINT-STUDENT][S4] StudentPortfolio ✅ — Commit: `6beaee7`
### [SPRINT-STUDENT][S5] LevelUpModal ✅ — Commit: `4e1bdc7`
### [SPRINT-TEACHER][T3] TeacherProjectGenerator ✅ — Commit: `54f7cee`
### [SPRINT-TEACHER][T4] TeacherMessages ✅ — Commit: `3aede28`

### Ciclo 4
### [SPRINT-TEACHER][T5] ClassHealthWidget ✅
- Commit: `bfd7470`
- Archivo modificado: `src/components/TeacherDashboard.tsx`
- Reemplaza health bar linear con anillo SVG donut 3 segmentos (excelling=accent, on_track=success, needs_attention=warning)
- Porcentaje de salud en centro del anillo. Avatares de alumnos agrupados por estado.
- Trend +4% vs semana pasada. Botón "Contactar alumnos en riesgo".
- NOTA: TeacherDashboard usa `bg-[#4F8EF7]` (azul) para "excelling" — no cambiado para no romper otras partes.

### [SPRINT-CULTURE][C1] ModoSocratico ✅
- Commit: `9e34325`
- Archivos modificados: `src/app/api/tutor-chat/route.ts` + `src/components/TeacherChat.tsx`
- SYSTEM_PROMPT reescrito con MODO SOCRÁTICO como regla fundamental: primera respuesta siempre es pregunta de retorno
- 3 ejemplos concretos de respuesta socrática en el prompt
- Indicador visual "SOCRÁTICO" pill verde en el header del chat (visible solo para role="student")
- La API usa GoogleGenAI con modelo gemini-2.0-flash

### [SPRINT-CULTURE][C2] ErrorLog ✅
- Commit: `80d5a3d`
- Archivo modificado: `src/components/StudentPortfolio.tsx`
- Nueva sección "Historial de errores aprendidos" después de las semanas narrativas
- 3 entradas mock del proyecto Airbnb Málaga con competencias: STEM, CCEC, CE
- Cada entrada: qué asumí / dónde falló / qué cambiaría — código de color (warning/urgent/accent)
- Cards colapsables con estado resuelto/pendiente. Marco pedagógico en texto introductorio.
- Imports añadidos: AlertCircle, ChevronDown, ChevronUp, RefreshCw

### [SPRINT-CULTURE][C3] PitchLab ✅
- Commit: `4479148`
- Archivo creado: `src/components/PitchLab.tsx`
- 5 secciones de pitch: Problema / Solución / Mercado / Financiero / Equipo
- Cada sección: textarea con placeholder guiado, tips del mentor, temporizador Play/Pause/Reset
- Navegación lateral con estado de completado. Contador de palabras vs objetivo.
- Modo "Simular audiencia": scoring algorítmico en Estructura/Claridad/Persuasión (0-100)
- Nota final de Prof. Ana contextualizada al score obtenido
- "pitchlab" añadido a StudentView type + Sidebar (icono Mic)

---

## Ciclo 5 ✅ completado

### [SPRINT-CULTURE][C4] PerfilInteligencias ✅
- Commit: `d1300d2`
- Archivo modificado: `src/components/StudentProfile.tsx`
- Nueva sección "Perfil de Inteligencias" antes de Achievements
- 8 dimensiones Gardner: lingüística, lógico-matemática, espacial, musical, corporal-cinestésica, interpersonal, intrapersonal, naturalista
- Grid 2 columnas; barras degradado sidebar→accent; datos mock de 30 días de interacción
- Texto introductorio: construido desde interacción, no test inicial
- Imports añadidos: Brain, Music, Globe, Activity, Leaf, MessageSquare

### [SPRINT-CULTURE][C5] CuerpoHerramienta ✅
- Commit: `7de9eaa`
- Archivo modificado: `src/components/StudentDashboard.tsx`
- Botón "Demo 90 min" en fila de controles (junto al toggle Hoy/Semana)
- Widget card bg-sidebar: mensaje BDNF + neurociencia, temporizador 10 min Play/Pause
- "Volver al trabajo" cierra y reinicia el timer
- useEffect con setInterval; se limpia al pausar o cerrar
- Imports añadidos: useEffect, Activity, Play, Pause

### [SPRINT-ADMIN][A2] AdminUserManagement ✅
- Commit: `14fc527`
- Archivo modificado: `src/components/AdminDashboard.tsx`
- usuariosMock expandido a 12 filas (añadidos: Lucía Fernández, Tomás Herrera, Isabel Mora, Roberto Núñez)
- Búsqueda en tiempo real por nombre/email
- Filtros select: rol y estado
- Modal "Añadir usuario" con nombre, email, rol, grupo/curso
- IIFE para evitar contaminar el scope del componente con las vars de filtrado

### [SPRINT-ADMIN][A5] QHUMACapital ✅
- Commit: `14fc527` (mismo commit que A2)
- Archivos modificados: `src/components/AdminDashboard.tsx`, `src/types/index.ts`, `src/components/Sidebar.tsx`
- AdminView ampliado con "capital"
- Sidebar adminNav: nuevo ítem "Capital" (icono Landmark)
- Tab "Capital" en AdminDashboard con: 4 KPIs, 5 proyectos mock con fases pitch/votación/aprobado/financiado
- Barra de votos por proyecto, inversión hasta €10.000, botón "Revisar pitch"
- faseConfig con colores del design system por fase

---

## Ciclo 6 ✅ completado

### [SPRINT-ADMIN][A3] AdminAIUsage ✅
- Commit: `61cfaaf`
- Archivo modificado: `src/components/AdminDashboard.tsx`
- 4 KPIs: llamadas, coste, tiempo, tasa socrática 74%
- Barras CSS por funcionalidad con % del total y coste €
- Comparativa semanal: barras CSS 4 semanas (Feb–Mar)
- Heatmap 12 usuarios × 5 días con interpolación rgb accent→sidebar por intensidad
- Leyenda de color en el heatmap

### [SPRINT-ADMIN][A4] AdminSchoolSettings ✅
- Commit: `61cfaaf` (mismo commit que A3)
- Archivo modificado: `src/components/AdminDashboard.tsx`
- Formulario editable para info del colegio (nombre, director, email, nivel, dirección)
- 8 toggles de competencias LOMLOE con click; conteo activas/8
- Calendario académico 3 trimestres con estados activo/completado/próximo
- Escala LOMLOE 1-4 con etiquetas oficiales: Inicio / En proceso / Logro esperado / Logro sobresaliente
- Nuevos datos: heatmapAlumnos, comparativaSemanal, escalasLOMLOE, trimestres
- Nuevos imports: Save, TrendingDown, Minus, Calendar

### [SPRINT-STUDENT][S6] MercadoRealTime ✅
- Commit: `eba9e0b`
- Archivo modificado: `src/components/StudentDashboard.tsx`
- Sección nueva al final del today view: "Mercado en Tiempo Real"
- 5 tendencias Turismo & PropTech vinculadas al proyecto Airbnb Málaga
- TrendingUp/TrendingDown/Minus con colores success/urgent/warning
- Cambio %, salario referencia, competencia LOMLOE por tendencia
- Bloque IA contextualizado con insight real: +18% turismo digital 2025
- Principio culture.md Bloque 5: integrado en proyecto activo, no clase aislada

### [SPRINT-CULTURE][S7] DeepDive ✅
- Commit: `3c25bc0`
- Archivos modificados: `src/app/api/tutor-chat/route.ts` + `src/components/TeacherChat.tsx`
- DEEP_DIVE_ADDON: instrucciones de nivel experto (revenue management, cohortes, LTV, escalabilidad)
- API acepta parámetro deepDive: boolean; se activa el addon solo cuando true
- TeacherChat: auto-activa tras 6 mensajes del alumno; botón demo disponible
- Pill "DEEP DIVE" (icono Telescope) en el header junto a "SOCRÁTICO"
- Banner warning-light cuando modo activo

---

## Ciclo 7 ✅ completado

### [SPRINT-TEACHER][T6] TeacherComentarios ✅
- Commit: `2ff420b`
- Archivo modificado: `src/components/TeacherStudents.tsx`
- Sistema de comentarios inline en panel expandido de alumnos
- 3 categorías: ¡Buen trabajo! (success) / Requiere atención (warning) / Entrega pendiente (urgent)
- Historial de comentarios con colores por categoría; datos mock para Lucas y alumnos en riesgo
- Input con Enter o botón Send; badge de conteo de notas en la tarjeta del alumno
- Textos en español (statusLabels, filtros, encabezados)

### [SPRINT-STUDENT][S8] IndustriasVivas ✅
- Commit: `00e732e`
- Archivo modificado: `src/components/StudentDashboard.tsx`
- Nueva sección "Profesional Invitado" en today view (entre Tribe y Mercado Real)
- Perfil: Marta Sánchez, Revenue Manager Booking.com España, 8 años experiencia
- Thumbnail de vídeo simulado con Play; bloque "Conectado a tu proyecto"
- Pregunta de reflexión desplegable: festival de música + dinámica de precios
- Principio culture.md Bloque 4: Industrias Vivas — inmersión en sector real desde los 14 años
- Nuevos imports: UserCheck, MessageSquare

### [SPRINT-ADMIN][A6] AdminReportsEnhanced ✅
- Commit: `adc9556`
- Archivo modificado: `src/components/AdminDashboard.tsx`
- Generador con 3 selectores: alumno (filtrado de usuariosMock alumnos), trimestre, tipo
- Botón "Generar informe" con carga simulada 1.4s (RefreshCw girando)
- Preview: estructura de 8 secciones, escala LOMLOE 4 niveles, botón "Descargar PDF"
- Informes recientes conservados bajo el generador
- Estado A6 con useState; no afecta otros tabs

### [SPRINT-CULTURE][C6] NarrativaPropia ✅
- Commit: `f07a5b4`
- Archivos modificados: `src/components/StudentPortfolio.tsx`, `src/app/api/tutor-chat/route.ts`
- Botón "Regenerar narrativa IA" en encabezado del portfolio (pill accent-light, RefreshCw)
- API: nuevo NARRATIVA_SYSTEM_PROMPT — párrafo en primera persona sin modo socrático
- Card bg-sidebar con narrativa generada, sello IA + timestamp + botón ✕
- mode="narrativa" en el body — no interfiere con deepDive ni modo socrático existentes

---

## Ciclo 8 ✅ completado

### [SPRINT-TEACHER][T7] TeacherRubrica ✅
- Commit: `c2b1553`
- Archivo creado: `src/components/TeacherRubrica.tsx`
- 3 rúbricas del Proyecto Airbnb Málaga: Plantillas comunicación / Simulación rentabilidad / Landing page
- Escala LOMLOE 1-4 con colores design system: urgent/warning/accent/success
- Grid interactivo: click en celda cicla nivel (1→2→3→4) por alumno × criterio LOMLOE
- Panel expandible por alumno: muestra descriptor exacto del nivel asignado
- Vista alumno: muestra criterios sin scores para auto-evaluación previa a entrega
- Botón "Guardar rúbrica" con CheckCircle2 como feedback visual
- "rubrica" añadido a TeacherView type + Sidebar (icono ClipboardCheck)

### [SPRINT-STUDENT][S9] QCoinsMarket ✅
- Commit: `29e7757`
- Archivo modificado: `src/components/StudentQCoins.tsx`
- 13 items en 4 categorías: Talleres / Maker Studio / Excursiones / Passion Workshop
- Filtros de categoría con colores design system por tipo; grid 3 columnas
- Carrito en panel derecho: añadir/quitar, total, saldo restante, confirmar canje
- Estado "¡Canje confirmado!" con CheckCircle2 + vaciado automático
- Historial de canjes: 2 canjes mock (realizado/confirmado) con colores de estado
- Q-Store digital conservada, Logros y Movimientos en panel derecho
- Icons añadidos: ShoppingCart, X, CheckCircle2, Camera, Cpu, MapPin

### [SPRINT-ADMIN][A7] AdminInspection ✅
- Commit: `330656c`
- Archivo modificado: `src/components/AdminDashboard.tsx`
- Nuevo tab "Inspección" (AdminView ampliado con "inspection" + Sidebar icono Search)
- 4 KPIs: alumnos activos, cumplimiento LOMLOE %, evidencias entregadas, proyectos en curso
- Tabla de todos los alumnos: proyecto, progreso barra CSS, evidencias, nivel LOMLOE 1-4, estado
- Checklist normativo: 10 requisitos del Real Decreto 217/2022 con estado ok/pendiente
- 6 documentos disponibles para descarga con estado listo/pendiente
- Botón "Exportar para inspección" en cabecera de tabla

### [SPRINT-CULTURE][C7] PitchCoach ✅
- Commit: `8016c67`
- Archivos modificados: `src/components/PitchLab.tsx`, `src/app/api/tutor-chat/route.ts`
- Botón "Pedir consejo" por sección en modo escritura; llama a API con mode="pitchcoach"
- PITCHCOACH_SYSTEM_PROMPT: sin Socrático — feedback directo en 3 pasos (punto fuerte / mejora / ejemplo)
- Respuesta Prof. Ana en card bg-sidebar por sección; botón ✕ para cerrar
- Estado de carga: Loader2 girando + "Analizando..." durante espera
- En modo feedback: panel "Feedback IA por sección" agrupa todos los consejos recopilados
- Imports añadidos: Sparkles, Loader2

---

## Ciclo 9 ✅ completado

### [SPRINT-TEACHER][T8] TeacherCalendario mejorado ✅
- Commit: `adb10bb`
- Archivo modificado: `src/components/TeacherCalendar.tsx` (reescritura completa)
- Toggle vista Semana/Mes con estado
- Vista mes: grid calendario marzo 2026 con offset lunes-primero, celdas coloreadas por tipo de evento
- Vista semana: columnas lun-vie con eventos del día, tareas con iconos de estado en español
- 6 eventos mock (Demo Day, Entregas, Pitches, Recordatorio) con colores por tipo (success/warning/urgent/accent)
- Botón "Enviar recordatorio" por evento: CheckCircle2 + feedback "¡Enviado!" 3s
- Modal "Añadir evento": título, tipo, día (número), hora — añade al estado local
- Todo el texto en español

### [SPRINT-STUDENT][S10] StudentCompetencias mejoradas ✅
- Commit: `6993335`
- Archivo modificado: `src/components/StudentCompetencies.tsx`
- Selector de trimestre T1/T2/T3 (pill tabs sobre sidebar)
- `historicoPorTrimestre` con 24 valores mock (8 competencias × 3 trims) coherentes
- Radar chart extendido: segundo polígono SVG punteado para media de clase anonimizada
- Panel lateral "Evolución histórica": barras mini T1/T2/T3 por competencia con resaltado del trimestre activo
- Panel "vs. Media de clase": barras comparativas + delta con color success/urgent
- En cada CompetencyCard: barra de media de clase + indicador encima/debajo

### [SPRINT-ADMIN][A8] AdminMetricas ✅
- Commit: `15ede05`
- Archivos modificados: `src/types/index.ts`, `src/components/Sidebar.tsx`, `src/components/AdminDashboard.tsx`
- `AdminView` ampliado con "metrics", Sidebar adminNav añade { icon: BarChart3, "Métricas" }
- Tab metrics con IIFE pattern: 4 KPIs, comparativa colegios, histograma engagement, tabla riesgo
- Comparativa Málaga vs Madrid: 4 métricas (retención/engagement/evidencias/LOMLOE) con barras CSS opacidad diferenciada
- Tabla riesgo de abandono: 3 alumnos mock, score = racha×3 + evidencias×4, niveles Alto/Medio/Bajo
- Metodología de scoring explicada en el pie de tabla

### [SPRINT-CULTURE][C8] MercadoIntegrado ✅
- Commit: `34b9b37`
- Archivo modificado: `src/components/StudentQCoins.tsx`
- Import `competencies` de @/data/competencies
- `compToMercado`: mapping CompetencyKey → { itemId, razon, categoria } — 8 entradas
- Banner bg-sidebar con avatar Sparkles, competencia más baja detectada, ítem recomendado, razonamiento pedagógico
- "Ver en mercado" → setCatActiva automático a la categoría del ítem recomendado
- "Renovar consejo" → 1.5s loading simulado + iaVersion counter
- Botón ✕ → setIaDismissed(true) oculta el banner
- Principio culture.md Bloque 5: plataforma propone siempre el siguiente nivel contextualizado

---

## Ciclo 10 ✅ completado

### [SPRINT-TEACHER][T9] TeacherAnalytics mejorado ✅
- Commit: `2225b98`
- Archivo modificado: `src/components/TeacherAnalytics.tsx`
- "Sin actividad hoy": card bg-urgent-light con Pablo Ruiz (3d) y Tomás Herrera (2d); botón "Contactar" con estado Set<string> contactados; CheckCircle2 al contactar
- "Distribución LOMLOE": barras horizontales apiladas (8 competencias × 4 niveles) usando seededLevel(si,ci); segmentos urgent/warning/accent/success proporcionales
- "Comparativa progreso semanal": grid 6 cols, sparklines CSS 4 semanas por alumno; semana actual bg-accent-text oscuro; semanas anteriores bg-accent-light; delta en texto
- `sparklineWeek(si, weekIdx, progress)` función determinista: base converge a progress real + noise 7%
- Imports añadidos: useState (ya existía), ZapOff, MessageSquare, CheckCircle2

### [SPRINT-STUDENT][S11] StudentCalendario mejorado ✅
- Commit: `d8b97e8`
- Archivo modificado: `src/components/StudentCalendar.tsx` (reescritura completa)
- Toggle mes/semana: pills bg-background con shadow-sm en activo
- Vista semana: columnas lun-vie, eventos personales por día sobre tareas, texto en español
- Vista mes: grid 7 cols con offset=6 (mar 2026 empieza domingo), celdas con colored dots por tipo
- `eventosPersonales`: 4 eventos — Entrega (mar 9), Pitch Lab (mar 11 = hoy), Demo Day (mar 13), Entrega (mar 17)
- Badge dinámico en header: "Hoy tienes 1 evento" cuando hay eventos el día 11
- `tipoConfig`: entrega (warning), pitch (accent), demoday (urgent), hito (success)
- Lista de eventos en vista mes con chip "Hoy" en el evento actual

### [SPRINT-ADMIN][A9] AdminCapitalDeep ✅
- Commit: `8eef31d`
- Archivo modificado: `src/components/AdminDashboard.tsx`
- Nuevos estados: votosEnVivo (starts 7), votandoId, cartaProyectoId, generandoCarta, cartaGenerada
- Votación en tiempo real: barra animada + puntitos individuales 12-12, indicador quórum (9/12), botón "Emitir voto" con delay 800ms
- Historial T1: 5 pitches (financiado/aprobado/votación/pendiente/rechazado) con nota del claustro
- Generador de carta: select de proyectos aprobado/financiado, preview carta oficial con fecha, importe, firmante, botón "Descargar PDF"
- Imports añadidos: ninguno nuevo (ClipboardCheck ya existía)

### [SPRINT-CULTURE][C9] ErrorLogIA ✅
- Commit: `fc491af`
- Archivos modificados: `src/app/api/tutor-chat/route.ts` + `src/components/StudentPortfolio.tsx`
- `ERRORLOG_SYSTEM_PROMPT`: 3 preguntas numeradas, máximo 20 palabras cada una; causa raíz / transferencia / acción concreta; sin emojis, sin comentarios extra
- API: `mode === "errorlog"` usa ERRORLOG_SYSTEM_PROMPT; no afecta otros modos
- Portfolio: `iaReflexiones: Record<string, string>` + `loadingReflexion: string | null` por error
- Botón "Analizar con IA · 3 preguntas de reflexión" (dashed border, Sparkles icon) en cada error expandido
- Estado post-IA: card bg-sidebar/5 con preguntas parseadas por línea; botón "Regenerar preguntas"
- Imports añadidos: Sparkles

---

## Ciclo 11 ✅ completado

### [SPRINT-TEACHER][T10] TeacherDashboard Urgencias ✅
- Commit: `4958529`
- Archivo modificado: `src/components/TeacherDashboard.tsx`
- Panel "Tareas vencidas hoy": tareasVencidas mock agrupadas por alumno; cada tarea tiene badge días retraso, competencia, botón "Prorrogar 48h" (Set<string> prorrogadas); feedback visual "+48h ✓" al prorrogar
- Panel "Sin acceso a plataforma": alumnosSinLogin mock (2 alumnos); fecha última actividad, badge días sin login, botón Contactar; cuadro protocolo QHUMA
- Grid 2 columnas entre Alertas y Seguimiento individual
- Imports añadidos: WifiOff, CalendarClock, RefreshCw
- Tipo local CompKeyTeacher para evitar importar del archivo global

### [SPRINT-STUDENT][S12] StudentProjectKanban mejorado ✅
- Commit: `614f36a`
- Archivo modificado: `src/components/ProjectDetail.tsx`
- Toggle Lista / Kanban en header (junto a botón Volver)
- 4 columnas: Por hacer (upcoming/locked), En curso (in_progress), En revisión (override mon-3/mon-5/tue-1), Completado (completed)
- Drag-and-drop nativo HTML5: onDragStart/onDragOver/onDrop/onDragEnd; estado dragId + dragOverCol
- `kanban` local: Record<taskId, KanbanCol> inicializado de task.status + reviewOverride Set
- Cada tarjeta: GripVertical handle, título, badge tiempo estimado (estimadoMin mock), competencias top-2
- Columna vacía: placeholder dashed border "Arrastra aquí"
- Imports añadidos: useRef, LayoutList, Columns, Clock, GripVertical

### [SPRINT-ADMIN][A10] AdminDashboardOverview mejorado ✅
- Commit: `0e79e86`
- Archivo modificado: `src/components/AdminDashboard.tsx`
- Gráfico barras CSS evolución mensual: 6 meses (Oct25–Mar26), barra actual bg-accent-text oscuro, badge "+29% en 6 meses"
- Top 3 proyectos: ranking por progreso (Carmen 94%, Sofía 88%, Lucas 72%), barra CSS proporcional, avatar alumno
- Heatmap hora del día: grid 5 días × 13 horas, opacidad interpolada rgba(sidebar, 0.12–0.87), leyenda gradiente
- Imports añadidos: Trophy, BarChart3

### [SPRINT-CULTURE][C10] CuerpoIA ✅
- Commit: `d9e7c46`
- Archivos modificados: `src/components/StudentDashboard.tsx`, `src/app/api/tutor-chat/route.ts`
- `CUERPO_SYSTEM_PROMPT`: 3 frases de reincorporación — reconoce pausa, consejo específico sobre tarea en progreso, mención BDNF; empieza con "Lucas, ..."
- API: mode="cuerpo" usa CUERPO_SYSTEM_PROMPT; no interfiere con otros modos
- StudentDashboard: `iaConsejoDescanso` + `loadingConsejo` state; `fetchConsejoIA(tareaActual)` async
- `fetchConsejoIA` se dispara en el useEffect cuando `s <= 1` (timer a cero), capturando `today.tasks.find(in_progress)?.title`
- Widget post-timer: spinner de carga, card bg-white/8 con consejo de Prof. Ana (IA badge + texto), botón Volver

---

## Ciclo 12 ✅ completado

### [SPRINT-TEACHER][T11] TeacherStudents mejorado ✅
- Commit: `67aba19`
- Archivo modificado: `src/components/TeacherStudents.tsx`
- Interfaz `HistorialIntervencion` (tipo: "comentario" | "prorroga" | "contacto", descripcion, fecha)
- `historialPorAlumno` constante a nivel de módulo: 5 entradas para Lucas (idx 0), 3 para needs_attention, 2 para excelling, [] para on_track
- Panel "Historial de intervenciones" en vista expandida (antes de Comentarios): chips con icono MessageSquare/Clock/Phone, badge de tipo, fecha y descripción
- Filtros renombrados: "Todos los alumnos" → "Todos" · "Destacados" → "Brillando" · "Necesitan atención" → "En riesgo"
- Import añadido: Phone (Lucide)

### [SPRINT-STUDENT][S13] StudentAchievements mejorado ✅
- Commit: `40f8ed0`
- Archivo modificado: `src/components/StudentAchievements.tsx`
- `misionesCompletadas`: 5 misiones del proyecto Airbnb Málaga (Semanas 1-3) con competencia LOMLOE y XP cada una
- Sección "Misiones completadas": card bg-card con íconos CheckCircle2 por misión, etiqueta competencia, XP ganado
- Botón "Compartir" por logro desbloqueado: simula `navigator.clipboard.writeText` con URL canónica QHUMA; feedback visual "Copiado" 2s vía `sharedId` state
- Panel derecho "Próximos desbloqueos": reemplaza "Siguiente logro" con lista dinámica de todos los logros bloqueados que tienen `progress`, con barra de progreso individual y porcentaje
- Estado `sharedId: string | null` para gestionar feedback de copia
- Imports añadidos: Copy, CheckCircle2, MapPin

### [SPRINT-ADMIN][A11] AdminReports mejorado ✅
- Commit: `df9b6de`
- Archivo modificado: `src/components/AdminDashboard.tsx`
- 3 plantillas predefinidas clickables (LOMLOE Completo 📋 / Inspección 🔍 / Informe Familia 👨‍👩‍👦): cards con descripción; click aplica tipo y resetea preview
- `reportTipo` ampliado con "familia"; `tipoLabel` y selector `<select>` actualizados con la nueva opción
- `downloadedFilename` state: genera nombre dinámico `informe_{alumno-slug}_T{trimestre}_{tipo}_{AAAAMMDD}.pdf` visible bajo el botón de descarga
- Preview enriquecido por tipo: secciones distintas para lomloe/inspeccion/familia/individual/grupo usando datos reales del alumno seleccionado y `reportAlumnos.length`
- Preview usa IIFE para capturar `alumnoData`, `previewFilename` y `secciones` según tipo activo
- Estado `downloadedFilename: string | null`

### [SPRINT-CULTURE][C11] PitchLabScoring mejorado ✅
- Commit: `50f7a9f`
- Archivo modificado: `src/components/PitchLab.tsx`
- Interfaz `InversorVoto` (decision: "si"|"no"|null, razon: string|null, loading: boolean)
- `inversoresConfig`: 3 perfiles — conservadora Marta Ruiz (30k€, umbral 72), moderado Javier Torres (75k€, umbral 58), arriesgada Elena López (150k€, umbral 40)
- `inversoresVotos: Record<string, InversorVoto>` state
- `handleSimulate` convertida a `async`: tras calcular feedback local, lanza 3 llamadas API pitchcoach escalonadas (950ms entre cada una)
- Decisión determinista: avgScore vs umbral de perfil; razón generada por Gemini con contexto del inversor
- Panel "Inversores simulados" en modo feedback (antes del panel IA por sección): 3 tarjetas con avatar, badge ✓/✗ animado, spinner de carga, razón entrecomillada
- Banner "Capital conseguido" (bg-success-light) suma los capitales de inversores con voto "si"
- Mensaje de refuerzo si capitalConseguido === 0 y todos terminaron de votar

---

## Ciclo 13 ✅ completado

### [SPRINT-TEACHER][T12] TeacherGradeBook mejorado ✅
- Commit: `cb094ad`
- Archivo modificado: `src/components/TeacherGradeBook.tsx`
- `handleExportCSV()`: Blob real con BOM UTF-8, filename dinámico `notas_lomloe_T2_1eso_{YYYY-MM-DD}.csv`, descarga automática vía anchor click
- CSV incluye cabecera con 8 columnas LOMLOE + Media, una fila por alumno con niveles actuales
- `alertasTrimestral`: filtra alumnos con nivel 1 en ≥3 competencias, reactivo a edición de celdas
- Panel bg-urgent-light con AlertTriangle encima de la tabla; badge "Urgente" por alumno afectado
- Icono AlertTriangle inline junto al nombre en la fila de la tabla (wrap en `<span title="...">`)
- Estado `isExporting: boolean` + `exportFilename: string | null` para feedback visual

### [SPRINT-STUDENT][S14] StudentPortfolio mejorado ✅
- Commit: `248dcfe`
- Archivo modificado: `src/components/StudentPortfolio.tsx`
- `timelineHitos`: 7 hitos del proyecto Airbnb Málaga (Semanas 1-4), const a nivel de módulo
- Timeline visual: línea vertical CSS absoluta con gradiente, dot verde ✓ para completados, naranja → para próximo
- Cada card: título, +XP badge, fecha · fase, competencia LOMLOE usando compColor()
- Último hito "Demo Day" marcado como `completado: false` con badge "Próximo"
- Contador "X/7 hitos completados" en el header de la sección
- Import añadido: GitCommit (lucide-react)

### [SPRINT-ADMIN][A12] AdminDashboard Overview mejorado ✅
- Commit: `bca6817`
- Archivo modificado: `src/components/AdminDashboard.tsx`
- Estado `showIALogs: boolean` añadido al componente
- Widget "Salud del sistema IA" en tab Overview (columna izquierda, entre Estado del sistema y Acciones rápidas)
- 3 KPIs en grid: latencia 1.2s / tasa de error 0.3% / tokens 1.84M (valores mock)
- `iaLogs`: 5 entradas simuladas con timestamp, tipo (error/timeout/warning) y mensaje detallado
- Botón "Ver logs" toggle `showIALogs`; logs con bg color-coded por tipo (error=urgent-light, timeout=warning-light, warning=background)
- Patrón IIFE para scoping de `iaLogs` dentro del JSX, consistente con A8-A11

### [SPRINT-CULTURE][C12] PitchLab mejorado ✅
- Commit: `8dc8a2f`
- Archivo modificado: `src/components/PitchLab.tsx`
- `totalPitchSecs = 270` (suma de durationSeg de las 5 secciones); `sectionCumulative` acumulativo
- Estados: `ensayoMode`, `ensayoRunning`, `ensayoElapsed`, `ensayoCompleted`
- `useEffect` con `setInterval` (1s): autopausa y marca completado al llegar a 270s
- `currentEnsayoSectionIdx` deriva la sección activa por `sectionCumulative.findIndex`
- Barra de progreso global bg-accent; mini dots por sección (verde=done, accent=actual, gris=pendiente)
- Controles: Empezar/Pausar/Continuar + Reiniciar; el botón "Salir del ensayo" resetea al salir
- Estado completado: bg-success-light, "Pitch completado en X:XX min", botón Reiniciar

---

---

## Ciclo 14 ✅ completado

### [SPRINT-TEACHER][T13] TeacherGradeBook — vista comparativa distribución ✅
- Commit: `aef3bdd`
- Archivo modificado: `src/components/TeacherGradeBook.tsx`
- Sección "Distribución por competencia" entre tabla y resumen global de niveles
- Una fila por cada una de las 8 competencias LOMLOE con barra segmentada horizontal
- 4 segmentos por barra: proporcionales al nº de alumnos en cada nivel (1–4)
- Colores: bg-urgent (1) / bg-warning (2) / bg-accent-text (3) / bg-success (4)
- Conteo "NxN" a la derecha y media de clase a la izquierda de cada barra
- Tooltip nativo (HTML title) con descripción del nivel y recuento de alumnos
- Leyenda en el footer de la sección
- Import añadido: BarChart3

### [SPRINT-STUDENT][S15] StudentPortfolio — sección Mi impacto real ✅
- Commit: `c211916`
- Archivo modificado: `src/components/StudentPortfolio.tsx`
- Card "Mi impacto real" insertada entre S14 timeline y bloques narrativos semanales
- 4 KPIs en grid 2×2 con valores mock realistas del proyecto Airbnb Málaga:
  - Ocupación media: 72% (bg-success-light) con barra CSS
  - Ingresos proyectados: 1.850€/mes (bg-accent-light) con nota de punto de equilibrio
  - Reseñas positivas: 14/15 (bg-warning-light) con dot-row visual
  - Ranking zonal: Top 8% Málaga Centro Histórico (bg-sidebar, texto accent)
- Imports añadidos: BarChart3, MapPin, Users

### [SPRINT-ADMIN][A13] AdminDashboard Metrics — toggle semana/mes ✅
- Commit: `1bdf546`
- Archivo modificado: `src/components/AdminDashboard.tsx`
- Estado `metricsVista: "semana" | "mes"` añadido al componente (default: "semana")
- Toggle Semana/Mes en cabecera del gráfico de actividad (tab Metrics)
- Vista semana: 7 barras Lun–Dom; fines de semana con barra atenuada (text-muted/30)
- Vista mes: 4 barras Sem 1–Sem 4 con datos mock distintos (68/75/72/78%)
- Alturas relativas al máximo de la vista activa (normalización dinámica)
- Patrón IIFE para scoping local de actividadDiaria y actividadMensual

### [SPRINT-CULTURE][C13] PitchLab mejorado — Guión de apoyo ✅
- Commit: `27d2c7d`
- Archivo modificado: `src/components/PitchLab.tsx`
- `guionPorSeccion`: módulo-level const con 4 puntos por sección (2 Clave + 2 secundarios)
- Datos específicos del proyecto: cifras INE/AirDNA, precios Casa Limón, modelo financiero
- Panel colapsable debajo de los Tips en el editor de cada sección
- Cabecera del panel: badge "N puntos clave" + chevron toggle
- Puntos Clave: bg-sidebar, texto blanco, badge "Clave" bg-accent text-sidebar
- Puntos secundarios: bg-background, texto text-secondary, dot muted
- Frase de transición sugerida en bg-accent-light cursiva al final del panel
- Estado `guionOpen: Set<string>` — colapsable independiente por sección
- Imports añadidos: BookOpen, ChevronDown, ChevronUp

---

---

## Ciclo 15 ✅ completado

### [SPRINT-TEACHER][T14] TeacherGradeBook — historial de cambios ✅
- Commit: `5279194`
- Archivo modificado: `src/components/TeacherGradeBook.tsx`
- Interfaz `HistorialCambio`: alumnoNombre, competencia, nivelAnterior, nivelNuevo, timestamp
- `saveEdit` registra cambios dentro del updater funcional de `setGrades` (acceso a `prev` sin stale)
- `historialCambios` state: array max 20 entradas, prepend en cada edición diferente
- Panel "Últimos cambios" colapsable (`showHistorial` state), 5 más recientes
- ArrowUp verde (subida) / ArrowDown rojo (bajada); chips nivel anterior → nuevo con colores nivelConfig
- Timestamp "Hoy · HH:MM" via toLocaleTimeString
- Imports: ArrowUp, ArrowDown, ArrowRight, History, ChevronDown, ChevronUp

### [SPRINT-STUDENT][S16] StudentPortfolio — Evidencias destacadas ✅
- Commit: `e22c2fa`
- Archivo modificado: `src/components/StudentPortfolio.tsx`
- `evidenciasDestacadas`: const módulo, 4 evidencias (análisis STEM · brand board CCEC · listing CLC · modelo financiero CE)
- `expandedEvidencia: string | null` — preview inline al hacer clic en card
- Grid 2×2: icono tipo (BarChart3/FileImage/FileText) + badge "Destacada" + título + descripcionCorta + competencia badge
- Expandido: bg-accent-light, icono bg-accent-text/text-accent, descripcionCompleta + botón "Ver en galería"
- `stopPropagation` en el área de preview para evitar colapsar al clicar descripción
- Imports: FileImage, ExternalLink

### [SPRINT-ADMIN][A14] AdminDashboard Capital — reunión inversores + KPI comprometido ✅
- Commit: `936f839`
- Archivo modificado: `src/components/AdminDashboard.tsx`
- KPI "Capital total comprometido": suma proyectos aprobado/financiado (€8.200), bg-sidebar con accent
- Barra de progreso sobre €20.000 fondo semestral simulado
- Panel "Próxima reunión de inversores": 25 mar · 10:00 · 3 proyectos en agenda
- Botón "Preparar agenda PDF" con filename dinámico `agenda_inversores_QHUMA_{YYYYMMDD}.pdf`
- `agendaGenerada`/`generandoAgenda` state + feedback CheckCircle2 + filename
- Patrón IIFE para `capitalComprometido`, `agendaProyectos`, `agendaFilename`
- Insertado entre KPI stats y "Proyectos QHUMA Capital"

### [SPRINT-CULTURE][C14] PitchLab mejorado — Puntuación por sección ✅
- Commit: `5b11485`
- Archivo modificado: `src/components/PitchLab.tsx`
- `computeSectionScores()`: función módulo, score 1–10 por sección (wordRatio × 7 + bonus términos clave)
- `sectionScores: Record<string, number> | null` state — computado en `handleSimulate`
- Se limpia al volver a write mode ("Volver a practicar")
- Tabla col-span-3 en modo feedback: sección, barra CSS, score, badge "Mejorar" para la más débil
- Colores barra: bg-success (≥7) / bg-warning (5-6) / bg-urgent (<5)
- Sección más débil: fondo bg-urgent-light + badge "Mejorar" rojo
- Patrón IIFE para calcular `minScore` y `weakestId` dentro del JSX

---

## Ciclo 16 ✅ completado

### [SPRINT-TEACHER][T15] TeacherGradeBook — modo Comparar con trimestre anterior ✅
- Commit: `d9d2272`
- Archivo modificado: `src/components/TeacherGradeBook.tsx`
- `gradesTrimAnterior`: const módulo, mismo esquema 12×8 con notas ligeramente inferiores al T2
- `compareModo: boolean` state; toggle en barra de leyenda (botón con ArrowUp/ArrowDown + label "Comparar T1")
- Botón activo: `bg-sidebar text-white`; inactivo: `bg-card text-text-secondary border`
- Cada celda no-editing: cuando `compareModo` muestra debajo ArrowUp (verde) / ArrowRight / ArrowDown (rojo) + `+N`/`=`/`−N`
- Fila "Media clase": `colAvgT1()` helper; delta en decimales con threshold 0.05 para ArrowRight
- Media global (celda esquina): IIFE para calcular `totalAvgT1` y mostrar delta

### [SPRINT-STUDENT][S17] StudentPortfolio — sección Competencia del mes ✅
- Commit: `86f62f7`
- Archivo modificado: `src/components/StudentPortfolio.tsx`
- `competenciaMesSemanal`: const módulo, Record<CompKey, number[]> — 4 semanas × 8 competencias
- `retosPersonalizados`: const módulo, Record<CompKey, string> — reto específico por competencia
- La card "Competencia del mes" en el sidebar (reemplaza "Mejor competencia") calcula dinámicamente el top-growth comp desde `compProgress` (CE: +38%)
- Gráfico semanal CSS: 4 barras `bg-success` con altura proporcional al max, etiquetas S1–S4 y porcentaje encima
- Reto personalizado en `bg-accent-light` con icono Lightbulb
- Cálculo con IIFE dentro del JSX del sidebar

### [SPRINT-ADMIN][A15] AdminDashboard Overview — widget Actividad docente hoy ✅
- Commit: `d068c49`
- Archivo modificado: `src/components/AdminDashboard.tsx`
- `actividadDocente`: const módulo, 6 entradas (avatar/nombre/accion/hora/icon/color)
- `showTodasActividades: boolean` state + toggle "Ver todas (6)" / "Ver menos"
- Widget en columna izquierda del overview (antes del cierre de `flex-1`); muestra 3 por defecto, 6 al expandir
- Avatar circular bg-sidebar/text-white, icono de acción con color por tipo
- Import añadido: `MessageSquare`

### [SPRINT-CULTURE][C15] PitchLab — panel Preguntas del jurado ✅
- Commit: `e3276c7`
- Archivo modificado: `src/components/PitchLab.tsx`
- `preguntasJurado`: const módulo, 5 preguntas específicas Airbnb Málaga (tracción/competencia/riesgo/operacional/inversión)
- `tipoColor`: Record<string, string> para badges de tipo
- States: `respuestasJurado`, `evaluacionesJurado`, `evaluandoJurado`
- `handleEvaluarRespuesta()`: llama /api/tutor-chat mode="pitchcoach" con contexto inversor+pregunta+respuesta del alumno
- Panel col-span-3 en feedback mode: lista de 5 preguntas, cada una con avatar, tipo badge, pregunta itálica, textarea, botón "Evaluar respuesta" + display evaluación IA
- Botón "Evaluar" deshabilitado si respuesta vacía o evaluando

---

## Ciclo 17 ✅ completado

### [SPRINT-TEACHER][T16] TeacherGradeBook — selector de trimestre T1/T2/T3 ✅
- Commit: `2ff5e16`
- Archivo modificado: `src/components/TeacherGradeBook.tsx`
- `gradesT3`: const módulo (12×8, valores ligeramente superiores a T2)
- `trimestre: "T1" | "T2" | "T3"` state con selector de 3 botones en header
- `activeGrades` derivado: T1→gradesTrimAnterior, T2→grades (editable), T3→gradesT3 (read-only)
- `prevGrades` derivado: T1→null, T2→gradesTrimAnterior, T3→grades
- `editingEnabled = trimestre === "T2"`: celdas solo editables en T2, badge "solo lectura" para T1/T3
- `rowAvg`/`colAvg` usan `activeGrades`; `colAvgPrev` reemplaza `colAvgT1` y devuelve `null` para T1
- Botón "Comparar Tx" oculto en T1 (sin trimestre previo); label dinámico ("Comparar T1" o "Comparar T2")
- CSV export incluye trimestre en filename: `notas_lomloe_T2_1eso_FECHA.csv`
- Cambiar trimestre resetea editing y compareModo

### [SPRINT-STUDENT][S18] StudentPortfolio — panel Reflexión semanal IA ✅
- Commit: `186ecc5`
- Archivo modificado: `src/components/StudentPortfolio.tsx`
- States: `reflexionBullets: string[] | null`, `isGenerandoReflexion`, `expandedBullets: Set<number>`, `notasReflexion: Record<number, string>`
- `handleGenerarReflexion()`: llama /api/tutor-chat mode="narrativa", pide 3 bullets numerados, parsea por líneas
- Fallback: 3 bullets hardcoded en caso de error o falta de conexión
- Sección antes del timeline con botón "Generar reflexión de la semana" / "Regenerar"
- Estado vacío: icono Sparkles + descripción; spinner durante carga
- 3 bullets colapsables con etiqueta por posición (Aprendizaje principal / Competencia aplicada / Lección del error)
- Cada bullet expandido muestra textarea "Mi nota personal" (notasReflexion state)
- `toggleBullet()` gestiona Set de expandidos

### [SPRINT-ADMIN][A16] AdminDashboard Métricas — gráfico Top competencias por clase ✅
- Commit: `b3eedc5`
- Archivo modificado: `src/components/AdminDashboard.tsx`
- `compClaseVista: "1eso" | "2eso"` state
- `compData`: mock con medias LOMLOE por clase (1º ESO: CLC:3.2, CPL:2.8, STEM:3.4... | 2º ESO: CLC:3.5, CD:3.6...)
- Gráfico de barras CSS h-40, colores por nivel (≥3.5=success, 3.0–3.4=accent-text, 2–2.9=warning, <2=urgent)
- Toggle 1º ESO / 2º ESO (bg-sidebar cuando activo)
- Línea de referencia horizontal dashed en nivel 3.0 (Logro esperado) con posicionamiento CSS `bottom: refLinePct%`
- Leyenda de colores al pie
- Insertado al final del `space-y-5` del tab Métricas, antes del cierre

### [SPRINT-CULTURE][C16] PitchLab — modo Inversores en vivo ✅
- Commit: `35dbbc1`
- Archivo modificado: `src/components/PitchLab.tsx`
- `primerasPreguntasVivo`: Record<string, string> con pregunta inicial hardcoded por perfil inversor
- States: `vivoInversor`, `vivoPreguntas: string[]`, `vivoRespuestas: string[]`, `vivoStep: 0|1|2|3|4`, `vivoRespuestaActual`, `vivoIsGenerating`, `vivoPuntuacion: number|null`, `vivoComentario: string|null`
- `handleIniciarSesionVivo()`: selecciona inversor random, carga primera pregunta, resetea estado
- `handleEnviarRespuestaVivo()`: pasos 1–2 → pitchcoach genera siguiente pregunta; paso 3 → evaluación final (parse PUNTUACIÓN/COMENTARIO)
- Panel col-span-3 en feedback mode antes del mentor message
- UI: chat visual con historial Qs/Rs (burbujas), textarea activo, botón "Enviar y continuar/finalizar", spinner generando
- Evaluación final: puntuación 1–10 en grande con color semáforo (≥8=success, ≥6=accent, <6=warning)

---

## Ciclo 18 ✅ completado

### [SPRINT-TEACHER][T17] TeacherGradeBook — exportar informe PDF ✅
- Commit: `cfdd96e`
- Archivo modificado: `src/components/TeacherGradeBook.tsx`
- Imports añadidos: `FileText`
- States: `isExportingPDF: boolean`, `exportPDFFilename: string | null`
- `handleExportPDF()`: genera HTML completo con tabla 12×8 LOMLOE + resumen estadístico (media global, alumno top, alertas) + distribución por niveles. Blob text/html descargable como .pdf via URL.createObjectURL.
- Filename dinámico: `informe_lomloe_T2_1eso_FECHA.pdf`
- Botón "Informe TX PDF" bg-sidebar junto al CSV en header; spinner RefreshCw durante generación
- Feedback filename con CheckCircle2 tras descarga exitosa

### [SPRINT-STUDENT][S19] StudentPortfolio — modo Vista pública compartible ✅
- Commit: `2ae9b04`
- Archivo modificado: `src/components/StudentPortfolio.tsx`
- Imports añadidos: `Share2, Copy, Eye, EyeOff`
- States: `showVistaPublica: boolean`, `vistaPublicaURL: string | null`, `urlCopiada: boolean`, `mostrarDatosPersonales: boolean`
- `handleCompartirPortfolio()`: genera URL mock `https://qhuma.es/portfolio/lucas-garcia-{token}` al primer click; muestra panel
- `handleCopiarURL()`: navigator.clipboard.writeText + feedback "¡Copiada!" 2s
- Panel con: barra URL + botón Copiar, toggle Datos visibles/ocultos, card previsualización
- Previsualización: avatar + nombre (oculto si toggle off), top 4 competencias (barras ocultas si toggle off), 3 últimos hitos completados, 3 KPIs de impacto (valores ocultos si toggle off)
- Botón "Compartir portfolio" bg-accent (pill) en header junto a "Regenerar narrativa IA"

### [SPRINT-ADMIN][A17] AdminDashboard — panel Notificaciones automáticas ✅
- Commit: `40b2b6f`
- Archivo modificado: `src/components/AdminDashboard.tsx`
- Import añadido: `Send`
- `notificacionesAutomaticas`: const módulo, 5 entradas (2 alumno_inactivo warning/urgent, 1 hito_completado success, 1 inversor_aprueba accent, 1 informe_listo muted)
- States: `notificacionesEnviadas: Set<string>`, `notificandoId: string | null`
- `handleEnviarNotificacion(id)`: 900ms delay → añade id al Set enviadas
- Widget en columna izquierda del tab Overview (después de Actividad docente hoy)
- Cada notificación: avatar icono contextual, destinatario + canal badge (email/SMS), mensaje, contacto
- Botón "Enviar ahora" → spinner RefreshCw → estado "Enviada" con CheckCircle2 verde
- Badge "N pendientes" en header del widget, actualizado reactivamente

### [SPRINT-CULTURE][C17] PitchLab — historial de sesiones en vivo ✅
- Commit: `d017f48`
- Archivo modificado: `src/components/PitchLab.tsx`
- Import añadido: `History`
- Interface: `SesionVivo { inversor, puntuacion, comentario, fecha, preguntaClave }`
- State: `historialSesiones: SesionVivo[]` (máx 3, LIFO)
- `handleRepetirConInversor(inv)`: inicia sesión con inversor específico (no random)
- `handleEnviarRespuestaVivo` modificado: guarda sesión en historialSesiones al llegar a step 4 (en rama try y catch)
- Panel col-span-3 en feedback mode antes de Mentor message; visible solo cuando historialSesiones.length > 0
- Gráfico de evolución: barras CSS h-20 en orden cronológico (reverse), visible si ≥2 sesiones
- Lista de sesiones: card por sesión con inversor + puntuación grande + fecha + pregunta clave + comentario
- Botón "Repetir con {nombre}" llama handleRepetirConInversor con el inversor de la sesión

---

## Sprints completados — Ciclo 19

### [SPRINT-TEACHER][T18] TeacherGradeBook — feedback textual por alumno ✅
- Commit: `befb700`
- Archivo modificado: `src/components/TeacherGradeBook.tsx`
- Imports añadidos: `MessageSquare, Copy`
- States: `expandedAlumno: string | null`, `comentariosTrimestral: Record<string, string>`, `generandoFeedback: string | null`, `feedbackGenerado: Record<string, string>`, `copiadoFeedback: string | null`
- Botón expand/collapse con `MessageSquare + ChevronDown/Up` en celda de nombre de cada alumno (bg-accent-light cuando expanded)
- Fila expandida (colspan = COMPS.length + 2): panel flex con textarea "Comentario trimestral" (izquierda) + bloque "Borrador IA" (derecha)
- `handleGenerarFeedbackIA(alumnoId)`: fetch /api/tutor-chat mode="pitchcoach", prompt con notas LOMLOE del alumno + comentario docente; fallback a `generarFeedbackMock()` (función interna que genera texto con fortaleza/mejora de las notas reales)
- `handleCopiarFeedback(alumnoId)`: navigator.clipboard.writeText + feedback "Copiado" 2s
- Botón "Copiar" con Copy/CheckCircle2 en panel de Borrador IA generado
- Botón "Generar borrador IA" bg-sidebar con RefreshCw animado durante generación

### [SPRINT-STUDENT][S20] StudentPortfolio — próximos pasos recomendados ✅
- Commit: `bdfda90`
- Archivo modificado: `src/components/StudentPortfolio.tsx`
- Interface módulo: `ProximoPaso { competencia: CompKey; accion: string; tiempo: string; descripcion: string }`
- `proximosPasosMock`: 3 pasos (CE: pitch Demo Day, CD: landing page, CPL: FAQ francés)
- States: `proximosPasos: ProximoPaso[] | null`, `generandoProximosPasos: boolean`, `generandoPaso: number | null`
- `handleGenerarProximosPasos()`: fetch /api/tutor-chat mode="narrativa" solicitando JSON array; parse jsonMatch(/\[[\s\S]*\]/); fallback a proximosPasosMock
- `handleRegenerarPaso(index)`: fetch /api/tutor-chat para paso alternativo (JSON objeto); parse jsonMatch(/\{[\s\S]*?\}/); fallback a array `alternativas[index % 3]`
- Panel insertado antes de "Competency growth overview": botón "Generar con IA" (Sparkles) cuando no hay pasos; 3 cards con número, competencia badge, tiempo badge, acción, descripción, y botón "Otro" (RefreshCw) por cada paso
- Estado vacío: icon Lightbulb centrado con descripción del comportamiento esperado

### [SPRINT-ADMIN][A18] AdminDashboard — comparativa ampliada entre colegios ✅
- Commit: `0b2cc0c`
- Archivo modificado: `src/components/AdminDashboard.tsx`
- State añadido: `comparativaMetrica: "retencion" | "engagement" | "evidencias" | "lomloe"` (default "engagement")
- Panel nuevo "Análisis comparativo ampliado" insertado entre comparativa básica + engagement y Riesgo de abandono (tab Métricas)
- Toggle de 4 métricas en header del panel: chip activo bg-sidebar text-white
- `evolucionMensual`: objeto Record por métrica con 4 meses (Dic/Ene/Feb/Mar) × 2 colegios; definido en IIFE de la vista
- `comparativaCompetencias`: 8 COMPS × {malaga, madrid} con valores mock diferenciados
- Gráfico evolución mensual: barras CSS side-by-side (sidebar / accent-text/50), valor encima de cada barra, badge diferencia (+N/-N) bajo cada mes
- Radar competencias: filas por competencia con 2 barras CSS apiladas (altura proporcional al mayor) + badge diferencia Mlg−Mad (success-light si positivo, urgent-light si negativo)
- Leyenda en ambos sub-gráficos: □ Málaga / □ Madrid

### [SPRINT-CULTURE][C18] PitchLab — ensayo con preguntas intercaladas ✅
- Commit: `06a8cf8`
- Archivo modificado: `src/components/PitchLab.tsx`
- States: `ensayoPreguntaIntercalada: typeof preguntasJurado[number] | null`, `ensayoRespuestaIntercalada: string`
- `ensayoIntercaladasVisitadas: useRef<Set<number>>`: ref (no state) para evitar re-triggers tras responder
- useEffect detecta `currentEnsayoSectionIdx`: cuando idx > 0 y no visitado y ensayoRunning → busca pregunta de preguntasJurado filtrada por tipo (solucion→competencia, mercado→riesgo, financiero→operacional, equipo→inversión) → pausa ensayo, muestra pregunta
- `handleContinuarTrasIntercalada()`: limpia pregunta/respuesta, reanuda ensayoRunning
- `handleResetEnsayo()` extendido: limpia estados C18 y resetea el ref Set
- UI dentro del bloque ensayo: tercera rama del ternario (`ensayoCompleted ? ... : ensayoPreguntaIntercalada ? ... : <running>`)
- Panel pregunta: avatar inversor + nombre, badge tipo (tipoColor), pregunta en texto grande, textarea respuesta, botones "Continuar ensayo" (disabled si vacío) y "Omitir pregunta"

---

## Sprints completados — Ciclo 20

### [SPRINT-TEACHER][T19] TeacherGradeBook — Vista resumen por alumno ✅
- Commit: `cc3b7c2`
- Archivo modificado: `src/components/TeacherGradeBook.tsx`
- Panel lateral/modal al expandir alumno: radar CSS 8 competencias, minibarras T1/T2/T3 comparativa, historial de cambios filtrado, comentario/feedback de T18

### [SPRINT-STUDENT][S21] StudentPortfolio — Mis errores → Mis aprendizajes ✅
- Commit: `226d12f`
- Archivo modificado: `src/components/StudentPortfolio.tsx`
- Timeline visual con línea vertical conectora + dots numerados (verde con ✓ si superado)
- Cada error card: icono de estado, barra progreso LOMLOE (before→after) con color diferenciado
- Botón "Marcar como superado" llama /api/tutor-chat mode="narrativa" → mensaje IA de confirmación
- States: `superadosSet: Set<string>` (inicializado con e1+e2), `confirmandoSuperacion: string | null`, `superacionMensaje: Record<string, string>`
- Contador "N/3 superados" en header de sección (success-light badge)

### [SPRINT-ADMIN][A19] AdminDashboard — Exportar informe comparativo ✅
- Commit: `226d12f`
- Archivo modificado: `src/components/AdminDashboard.tsx`
- Imports añadidos: `Copy, Check`
- States: `exportandoComparativa`, `comparativaExportada`, `copiandoResumen`, `resumenCopiado`
- "Exportar CSV comparativa": genera CSV (cabecera Colegio/Métrica/Dic/Ene/Feb/Mar + 8 filas por métrica + sección competencias) via Blob/download
- "Copiar resumen ejecutivo": texto español con diferenciales clave (retención/engagement/evidencias/LOMLOE + top comps) via navigator.clipboard
- Ambos botones en barra inferior del panel A18, con feedback de estado (spinner → éxito)

### [SPRINT-CULTURE][C19] PitchLab — Puntuación con IA al terminar ensayo ✅
- Commit: `226d12f`
- Archivo modificado: `src/components/PitchLab.tsx`
- States: `ensayoScore: number | null`, `ensayoScoreFuerte: string | null`, `ensayoScoreMejora: string | null`, `ensayoScoreLoading: boolean`
- useEffect sobre `ensayoCompleted`: fetch /api/tutor-chat mode="pitchcoach" con tiempoEmpleado + respuestasIntercaladas + proyecto "Airbnb Málaga"
- Fallback: score aleatorio 6–9, mensajes hardcoded en caso de error
- Panel "Ensayo completado" expandido: Loader2 durante carga → score grande (n/10) + barra 10 segmentos coloreada por nivel (≥8=success, ≥6=accent, <6=warning) + card punto fuerte (success/10) + card mejora prioritaria (warning/10)
- `handleResetEnsayo()` resetea los 4 estados C19

---

## Sprints completados — Ciclo 21

### [SPRINT-TEACHER][T20] TeacherGradeBook — Objetivos de mejora por alumno ✅
- Commit: `2008960`
- Archivo modificado: `src/components/TeacherGradeBook.tsx`
- Interface `ObjetivoMejora` (id, alumnoId, competencia, descripcion, fechaLimite, conseguido)
- `objetivosIniciales`: 3 objetivos mock para Pablo (STEM/CE) y Alejandro (CPL)
- States: `objetivos`, `showObjetivos`, `nuevoObjetivoAlumnoId`, `nuevoObjetivoComp`, `nuevoObjetivoDesc`, `nuevoObjetivoFecha`
- Panel colapsable "Objetivos de mejora" al final del GradeBook
- Filtra alumnos con nivel 1 en ≥1 competencia; muestra sus competencias en riesgo como badges urgent
- Por alumno: lista de objetivos con checkbox circular marcable (strikethrough + badge "Conseguido")
- Formulario inline "Añadir objetivo": select competencia, input fecha límite, textarea descripción, botón Guardar
- Imports añadidos: Target, CalendarClock

### [SPRINT-STUDENT][S22] StudentDashboard — Widget Economía de mi proyecto ✅
- Commit: `ff50203`
- Archivo modificado: `src/components/StudentDashboard.tsx`
- Sección nueva entre IndustriasVivas y Mercado en Tiempo Real: "Economía de mi proyecto"
- 4 KPIs: ingresos 1.240€/1.850€ meta (bg-success-light), gastos 310€/350€ (bg-warning-light), beneficio neto 930€ (bg-accent-light), ROI 18% vs 15% objetivo (bg-background/sidebar)
- Barra de progreso por KPI con color semáforo design system
- Desglose de 4 reservas mes (Müller/Roca/Nakamura/Martins) + costes limpieza/extras
- Línea total: beneficio neto +930€ vs punto equilibrio 750€
- Bloque IA contextualizado: explica por qué las reservas largas mejoran el margen + pregunta socrática sobre tarifa "semana completa"
- Principio culture.md Bloque 2: finanzas dentro del proyecto activo, no como clase aislada

### [SPRINT-ADMIN][A20] AdminDashboard — Centro de comunicación ✅
- Commit: `c96c975`
- Archivo modificado: `src/components/AdminDashboard.tsx`
- States: `comunicadoDestinatario` (todos/docentes/familias/alumnos), `comunicadoAsunto`, `comunicadoCuerpo`, `comunicadoEnviando`, `comunicadoEnviado`, `historialComunicados` (array 5 entradas)
- `plantillasComunicado`: 3 plantillas rápidas con asunto + cuerpo preescrito
- `handleEnviarComunicado()`: 1.4s delay + prepend al historial con timestamp real + reset form
- Widget en columna izquierda del tab Overview (después de Notificaciones automáticas)
- Selector de 4 destinatarios con badge de conteo; chip activo bg-sidebar
- Plantillas clickables en bg-accent-light; formulario con input asunto + textarea cuerpo
- Historial 5 comunicados recientes: badge tipo (TOD/DOC/FAM/ALU) + asunto truncado + hora + nº destinatarios

### [SPRINT-CULTURE][C20] PitchLab — Cronómetro por sección en ensayo ✅
- Commit: `dd7bbe5`
- Archivo modificado: `src/components/PitchLab.tsx`
- States: `ensayoTiemposPorSeccion: Record<string, number>`, `ensayoSeccionAnteriorRef: useRef`
- useEffect del ensayo extendido: en cada tick calcula secIdx y secElapsed → actualiza `ensayoTiemposPorSeccion`
- Panel "Tiempo por sección" visible en running state: barra por sección (verde ≤85%, naranja 85–100%, rojo >100%), timer elapsed/objetivo en tiempo real, sección actual en accent
- Post-ensayo: tabla "Tiempos por sección" en completed state con delta por sección (exacto/+Ns pasado/-Ns antes), coloreado por semáforo verde/naranja/rojo
- `handleResetEnsayo()` resetea C20 states (tiempos + ref)
- No añade nuevos imports (Timer, Play, Pause, RotateCcw ya existían)

---

## Sprints completados — Ciclo 22

### [SPRINT-TEACHER][T21] TeacherGradeBook — Informe de seguimiento individual exportable ✅
- Commit: `382226f`
- Archivo modificado: `src/components/TeacherGradeBook.tsx`
- Botón "Informe individual" en header del modal T19 (vista resumen por alumno): genera HTML completo con radar T1/T2/T3, tabla LOMLOE 8 competencias, objetivos de mejora (con estado conseguido), feedback docente/IA y 4 recomendaciones para siguiente trimestre
- Filename dinámico: `seguimiento_{nombre}_{trimestre}_{fecha}.pdf` via Blob/createObjectURL
- Estado `exportandoInforme: string | null` + `exportInformeFilename: string | null`
- Badge de éxito CheckCircle2 en `bg-success-light` bajo el header del modal
- Import añadido: UserCheck

### [SPRINT-STUDENT][S23] StudentDashboard — Perfil cognitivo activo ✅
- Commit: `01df7fc`
- Archivo modificado: `src/components/StudentDashboard.tsx`
- Sección nueva entre "Economía de mi proyecto" y "Mercado en Tiempo Real": "Perfil cognitivo activo"
- 8 inteligencias Gardner mapeadas a CompetencyKey: STEM→lógico-matemática, CD→espacial-digital, CLC→lingüística, CE→emprendedora, CPSAA→intrapersonal, CC→interpersonal, CPL→plurilingüe, CCEC→estético-creativa
- Inteligencia dominante del día derivada de `tareaActiva.competencies[0]` (in_progress task)
- Panel bg-sidebar: nombre, nivel /100, barra accent, estrategia específica para la tarea activa
- Grid derecho: top 3 inteligencias con barras proporcionadas y ranking
- Todo IIFE, sin estados nuevos — estático mock con niveles por perfil
- Principio culture.md Bloque 4: perfil de inteligencias construido desde interacción, no test inicial
- Import añadido: Brain

### [SPRINT-ADMIN][A21] AdminDashboard — Bienestar docente ✅
- Commit: `7266a3c`
- Archivo modificado: `src/components/AdminDashboard.tsx`
- Widget "Bienestar docente" en columna izquierda del tab Overview (después de Centro de comunicación A20)
- 3 docentes mock con carga semanal %, sesiones/semana, alertas urgentes, nivel de riesgo (bajo/medio/alto)
- Colores por riesgo: bajo=success, medio=warning, alto=urgent (design system)
- Protocolo sugerido inline en urgent-light para riesgo alto
- Encuesta semanal de 4 ítems (1–5): botones numerados interactivos, validación completitud, 1.2s delay submit
- Vista post-envío: cuadros de color por valor + media del equipo calculada dinámicamente
- Estados añadidos: `bienestarEncuestaEnviada: boolean`, `bienestarRespuestas: Record<string, number>`, `bienestarEnviando: boolean`

### [SPRINT-CULTURE][C21] PitchLab — Exportar guión completo ✅
- Commit: `48a5073`
- Archivo modificado: `src/components/PitchLab.tsx`
- Botón "Descargar guión" (bg-accent) en header del modo feedback, junto a "Volver a practicar"
- `handleExportarGuion()`: genera HTML completo con 5 secciones, texto del alumno, puntos clave del guión (C13), transiciones, puntuación por sección (C14), y resumen de scores (Estructura/Claridad/Persuasión)
- Filename: `guion_pitch_airbnb_malaga_{fecha}.pdf` via Blob/createObjectURL
- Badge de éxito col-span-3 con CheckCircle2 verde tras descarga
- Resetea guionExportado al "Volver a practicar"
- Estados añadidos: `exportandoGuion: boolean`, `guionExportado: string | null`
- Imports añadidos: Download, RefreshCw

---

## Notas técnicas (leer antes de cada ciclo)

- **StudentView type**: "dashboard" | "project" | "task" | "competencies" | "calendar" | "qcoins" | "profile" | "settings" | "evidences" | "achievements" | "streak" | "portfolio" | "pitchlab" (sin cambios en Ciclo 7)
- **TeacherView type**: "dashboard" | "projects" | "analytics" | "calendar" | "students" | "settings" | "gradebook" | "generator" | "messages" | "rubrica" (sin cambios en Ciclo 9)
- **ParentView type**: "overview" | "progress" | "calendar" | "teachers" | "profile" | "settings"
- **AdminView type**: "overview" | "users" | "capital" | "ai" | "schools" | "reports" | "inspection" | "metrics" (metrics añadido en Ciclo 9)
- **TeacherStudents**: C7 modificado (TeacherComentarios). T11 añade historialPorAlumno (const a nivel módulo) y filtros "Brillando"/"En riesgo". Leer antes de editar en ciclos futuros.
- **StudentAchievements**: S13 añade misionesCompletadas (const módulo), sharedId state, botón Compartir por logro, panel Próximos desbloqueos en sidebar. Leer antes de editar.
- **AdminDashboard**: A11 añade plantillasPredefinidas, reportTipo "familia", downloadedFilename state, preview por tipo con IIFE. reportTipo type: "individual"|"grupo"|"lomloe"|"inspeccion"|"familia".
- **PitchLab**: C12 ensayoMode timer. C13 guionPorSeccion + guionOpen. C14 computeSectionScores() + sectionScores. C15 preguntasJurado + respuestasJurado/evaluacionesJurado/evaluandoJurado + handleEvaluarRespuesta(). C16 añade primerasPreguntasVivo (Record por perfil) + vivoInversor/vivoPreguntas/vivoRespuestas/vivoStep/vivoRespuestaActual/vivoIsGenerating/vivoPuntuacion/vivoComentario states + handleIniciarSesionVivo()/handleEnviarRespuestaVivo(). C17 añade SesionVivo interface + historialSesiones state (max 3) + handleRepetirConInversor(). Panel historial col-span-3 antes del mentor message con gráfico evolución y "Repetir" botón. C18 añade ensayoPreguntaIntercalada/ensayoRespuestaIntercalada states + ensayoIntercaladasVisitadas useRef Set + useEffect detección transición sección + handleContinuarTrasIntercalada(). tipoMap: solucion→competencia, mercado→riesgo, financiero→operacional, equipo→inversión. Panel intercalado como 3ª rama del ternario ensayo. C19 añade ensayoScore/ensayoScoreFuerte/ensayoScoreMejora/ensayoScoreLoading states + useEffect sobre ensayoCompleted → fetch pitchcoach + panel score (barra 10 seg + punto fuerte + mejora). handleResetEnsayo() resetea C19 states. C20 añade ensayoTiemposPorSeccion Record<string,number> + ensayoSeccionAnteriorRef. useEffect del ensayo tick actualiza tiempos por sección en cada segundo. Panel running "Tiempo por sección": barras individuales + timer elapsed/objetivo coloreado semáforo. Post-ensayo: tabla tiempos con delta por sección. handleResetEnsayo() resetea C20. C21 añade exportandoGuion/guionExportado states + handleExportarGuion() — HTML blob con 5 secciones completas, guión C13, scores C14, resumen scores. Botón "Descargar guión" bg-accent en header del modo feedback. Badge de éxito col-span-3 con CheckCircle2. Imports añadidos: Download, RefreshCw.
- **TeacherGradeBook**: T12 exportCSV. T13 distribución. T14 HistorialCambio + historialCambios + showHistorial. T15 gradesTrimAnterior + compareModo + colAvgT1(). T16 añade gradesT3 (const módulo) + trimestre state + activeGrades/prevGrades derivados + editingEnabled. colAvgT1→colAvgPrev(). T17 añade isExportingPDF/exportPDFFilename states + handleExportPDF() → HTML Blob descarga. Botón "Informe TX PDF" bg-sidebar en header. T18 añade expandedAlumno/comentariosTrimestral/generandoFeedback/feedbackGenerado/copiadoFeedback states. Botón expand (MessageSquare+ChevronDown/Up) en celda nombre. Fila expandida con textarea comentario + borrador IA. generarFeedbackMock() función interna. handleGenerarFeedbackIA() fetch /api/tutor-chat mode=pitchcoach. handleCopiarFeedback() clipboard. T20 añade ObjetivoMejora interface + objetivosIniciales (const módulo) + objetivos/showObjetivos/nuevoObjetivoAlumnoId/Comp/Desc/Fecha states. Panel colapsable al final. Alumnos con nivel 1: comps en riesgo como badges urgent, checkbox circular por objetivo, formulario inline añadir. T21 añade exportandoInforme/exportInformeFilename states + handleExportarInformeIndividual(alumnoId) — HTML blob con radar T1/T2/T3, tabla LOMLOE, objetivos, feedback. Botón "Informe individual" (UserCheck icon, bg-sidebar) en modal T19. Import añadido: UserCheck.
- **StudentPortfolio**: S14 timelineHitos. S15 Mi impacto real. S16 evidenciasDestacadas + expandedEvidencia. S17 competenciaMesSemanal + retosPersonalizados + card Competencia del mes. S18 añade reflexionBullets/isGenerandoReflexion/expandedBullets/notasReflexion states + handleGenerarReflexion() → narrativa. S19 añade showVistaPublica/vistaPublicaURL/urlCopiada/mostrarDatosPersonales states + handleCompartirPortfolio()/handleCopiarURL(). Panel Vista pública con URL, toggle datos, top-4 comps, 3 hitos, 3 KPIs impacto. S20 añade ProximoPaso interface + proximosPasosMock (módulo) + proximosPasos/generandoProximosPasos/generandoPaso states + handleGenerarProximosPasos()/handleRegenerarPaso(i). Panel antes de "Crecimiento en competencias" con 3 cards accionables y botón Otro por paso. S21 cambia título sección "Historial de errores" → "Mis errores → Mis aprendizajes". Añade timeline vertical + superadosSet/confirmandoSuperacion/superacionMensaje states + handleMarcarSuperado() fetch pitchcoach. Barra progreso LOMLOE before→after en expanded. Dots timeline coloreados por superación.
- **AdminDashboard**: A13 metricsVista toggle. A14 agendaGenerada/generandoAgenda + KPI Capital comprometido. A15 actividadDocente (const módulo) + showTodasActividades. A16 añade compClaseVista state + gráfico "Top competencias por clase" en tab Métricas (barras CSS + línea ref nivel 3.0 + toggle 1º/2º ESO). A17 añade notificacionesAutomaticas (const módulo, 5 entradas) + notificacionesEnviadas Set + notificandoId + handleEnviarNotificacion(). Widget en Overview columna izquierda. A18 añade comparativaMetrica state ("engagement" default) + panel "Análisis comparativo ampliado" con evolucionMensual (4×2 meses) side-by-side bars + comparativaCompetencias radar (8 COMPS × 2 colegios) con badge diferencia. Toggle 4 métricas en header. A19 añade Copy/Check imports + exportandoComparativa/comparativaExportada/copiandoResumen/resumenCopiado states. Botones "Exportar CSV" (Blob download 2 colegios × 4 métricas × 4 meses + 8 comps) y "Copiar resumen ejecutivo" (clipboard, texto diferencial español) en barra inferior panel A18. A20 añade comunicadoDestinatario/Asunto/Cuerpo/Enviando/Enviado states + historialComunicados array (5 entradas) + plantillasComunicado (3) + handleEnviarComunicado(). Widget "Centro de comunicación" en Overview col izquierda después de A17. Selector 4 destinatarios con count + 3 plantillas clickables + formulario + historial 5 enviados con badge tipo TOD/DOC/FAM/ALU. A21 añade bienestarEncuestaEnviada/bienestarRespuestas/bienestarEnviando states. Widget "Bienestar docente" en Overview izquierda (después de A20): 3 docentes con carga%, sesiones, alertas, riesgo bajo/medio/alto; protocolo inline para alto; encuesta semanal 4 ítems 1–5 con validación y vista resultados. Sin nuevos imports.
- **API tutor-chat**: soporta mode="narrativa", mode="pitchcoach", mode="errorlog", mode="cuerpo" (CUERPO_SYSTEM_PROMPT — 3 frases de reincorporación post-pausa), deepDive=true, y modo por defecto socrático.
- **ProjectDetail**: Ciclo 11 añade vista Kanban. `kanban` state local inicializado de task.status. `reviewOverride = new Set(["mon-3","mon-5","tue-1"])`. `estimadoMin` mock de minutos por taskId. Drag-and-drop nativo HTML5, no librería.
- **TeacherDashboard**: Ciclo 11 añade tareasVencidas y alumnosSinLogin mock data a nivel de módulo (fuera del componente). Estado prorrogadas: Set<string>.
- **StudentDashboard**: S8 añade profesionalInvitado y showPreguntaInvitado state. IndustriasVivas entre Tribe y Mercado. S22 añade sección "Economía de mi proyecto" entre IndustriasVivas y Mercado (4 KPIs, desglose 6 líneas, bloque IA socrático). S23 añade sección "Perfil cognitivo activo" entre Economía y Mercado — IIFE pattern, 8 inteligencias Gardner mapeadas a CompKey, inteligencia activa derivada de tareaActiva.competencies[0], panel bg-sidebar + grid top-3. Import añadido: Brain.
- **API tutor-chat**: usa GoogleGenAI con `@google/genai`, modelo gemini-2.0-flash, GEMINI_API_KEY env var. Leer ruta ANTES de modificar. Ya tiene modo socrático activo.
- **TeacherDashboard**: usa `bg-[#4F8EF7]` (azul) para excelling — es el único color hardcoded fuera del design system. No romper ese patrón en Ciclo 5+, o reemplazar por `bg-accent` si queda bien visualmente.
- **StudentProfile**: C4 ya modificado (PerfilInteligencias). Leer antes de editar en ciclos futuros.
- **DeepDive**: TeacherChat auto-activa deepDiveMode tras 6 mensajes del alumno. El addon se añade al SYSTEM_PROMPT en la API. No duplicar lógica al modificar TeacherChat.
- **MercadoRealTime**: mercadoTendencias array definido en StudentDashboard.tsx (no en un archivo de datos separado).
- **AdminDashboard**: el tab "Usuarios" existe pero es UI simplificada. A2 lo expande con tabla real.
- **QHUMA Capital**: según QHUMA_Master_Document, inversión real de hasta €10.000. El panel A5 debe mostrar proyectos en distintas fases de evaluación (pitch → votación → aprobado → financiado).
- **Q-Coins**: canjeables por talleres, equipamiento maker studio, excursiones, prioridad Passion Workshop.
- Push siempre una vez al final del ciclo (no por sprint).
- Todo el texto en español. Solo colores del design system. Solo lucide-react para iconos. NUNCA shadow-lg/xl.
