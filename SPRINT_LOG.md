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

- **Último ciclo completo**: Ciclo 11 ✅ (push: `d9e7c46`)
- **Fecha**: 2026-03-11
- **Próximo ciclo**: Ciclo 12

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

## Sprints pendientes — Ciclo 12

- [ ] [T11] TeacherStudents mejorado — en la vista Alumnos, añadir panel de "Historial de intervenciones" por alumno (últimas 5 acciones del docente: comentarios, prórrogas, contactos), filtro rápido por estado de riesgo (Todos / En riesgo / Brillando)
- [ ] [S13] StudentAchievements mejorado — añadir sistema de "Misiones completadas" (5 misiones mock del proyecto Airbnb), sección "Próximos desbloqueos" con barra de progreso hacia el siguiente logro, compartir logro (simula copiar URL)
- [ ] [A11] AdminReports mejorado — en el tab Informes, añadir plantillas de informe predefinidas (LOMLOE completo, Inspección, Familia), vista previa con datos reales de los alumnos mock, descarga simulada con nombre de archivo dinámico
- [ ] [C11] PitchLabScoring mejorado — en PitchLab modo "Simular audiencia", añadir panel de "Inversores simulados" (3 perfiles: conservador/moderado/arriesgado), cada uno vota ✓/✗ con una razón breve generada por IA (mode="pitchcoach" adaptado), resultado final con "capital conseguido"

---

## Notas técnicas (leer antes de cada ciclo)

- **StudentView type**: "dashboard" | "project" | "task" | "competencies" | "calendar" | "qcoins" | "profile" | "settings" | "evidences" | "achievements" | "streak" | "portfolio" | "pitchlab" (sin cambios en Ciclo 7)
- **TeacherView type**: "dashboard" | "projects" | "analytics" | "calendar" | "students" | "settings" | "gradebook" | "generator" | "messages" | "rubrica" (sin cambios en Ciclo 9)
- **ParentView type**: "overview" | "progress" | "calendar" | "teachers" | "profile" | "settings"
- **AdminView type**: "overview" | "users" | "capital" | "ai" | "schools" | "reports" | "inspection" | "metrics" (metrics añadido en Ciclo 9)
- **TeacherStudents**: C7 modificado (TeacherComentarios). Leer antes de editar en ciclos futuros.
- **API tutor-chat**: soporta mode="narrativa", mode="pitchcoach", mode="errorlog", mode="cuerpo" (CUERPO_SYSTEM_PROMPT — 3 frases de reincorporación post-pausa), deepDive=true, y modo por defecto socrático.
- **ProjectDetail**: Ciclo 11 añade vista Kanban. `kanban` state local inicializado de task.status. `reviewOverride = new Set(["mon-3","mon-5","tue-1"])`. `estimadoMin` mock de minutos por taskId. Drag-and-drop nativo HTML5, no librería.
- **TeacherDashboard**: Ciclo 11 añade tareasVencidas y alumnosSinLogin mock data a nivel de módulo (fuera del componente). Estado prorrogadas: Set<string>.
- **StudentDashboard**: S8 añade profesionalInvitado y showPreguntaInvitado state. IndustriasVivas entre Tribe y Mercado.
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
