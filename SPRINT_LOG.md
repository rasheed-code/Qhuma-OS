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

- **Último ciclo completo**: Ciclo 32 ✅ (push: `5ec906e`)
- **Fecha**: 2026-03-11
- **Próximo ciclo**: Ciclo 33

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

---

## Sprints completados — Ciclo 23

### [SPRINT-TEACHER][T22] TeacherDashboard — Sección "Próximas entregas" ✅
- Commit: `880f0c4`
- Archivo modificado: `src/components/TeacherDashboard.tsx`
- Const módulo: `proximasEntregas: EntregaProxima[]` — 5 entregas (Airbnb Málaga) con alumno, tarea, comp, fechaLimite, diasRestantes, estado (retrasado/pendiente)
- Interface `EntregaProxima` + type `EstadoEntrega`
- States: `recordadas: Set<string>`, `recordandoId: string | null`
- `handleRecordar(id)`: 900ms delay + añade al Set + feedback CheckCircle2 "Enviado"
- Badge días: 0d=urgent, 1d=warning, 2d+=success. Fondo row por estado
- Nota de protocolo en bg-background al pie del panel
- Imports añadidos: `Bell, ClipboardList`

### [SPRINT-STUDENT][S24] StudentQCoins — historial filtrado, gráfico evolución, racha gasto ✅
- Commit: `df914e2`
- Archivo modificado: `src/components/StudentQCoins.tsx`
- `evolucionMensual`: const módulo, 6 meses Oct–Mar con ganadas/gastadas
- `transaccionesPendientes`: 2 entradas mock (Demo Day, revisión evidencias)
- State: `filtroTx: "todo"|"ganadas"|"gastadas"|"pendientes"` con type local dentro del componente
- Filtros 4 pills con colores semáforo. Transacciones pendientes visibles en "todo" y "pendientes"
- Gráfico barras CSS h-20 side-by-side: sidebar (ganadas) / urgent/50 (gastadas). Badge "+N QC vs mes ant."
- Badge "Racha de gasto inteligente" bg-sidebar activo cuando ratio gastadas/ganadas < 50% en 3 meses
- Imports añadidos: `BarChart3, Filter, Award`

### [SPRINT-ADMIN][A22] AdminDashboard — Gestión Q-Coins a nivel sistema ✅
- Commit: `3e81e75`
- Archivo modificado: `src/components/AdminDashboard.tsx`
- States: `showEmitirQCoins`, `emitirMotivo`, `emitirCantidad`, `emitirDestinatario`, `emitiendo`, `emitido`
- `handleEmitirQCoins()`: 1.4s delay + feedback éxito 2.5s + cierre formulario
- 4 KPIs: total en circulación 14.820 (bg-sidebar), emitidos +3.240 (success), canjeados -1.180 (urgent), crecimiento +8.4% (accent)
- Top 5 alumnos por saldo: barras CSS proporcionales al máximo, avatar + saldo QC
- Top 5 transacciones: ganadas/canjes con colores success/warning, alumno + motivo + fecha
- Formulario "Emitir Q-Coins especiales": select destinatario, input cantidad (número), input motivo
- Widget insertado en left column del tab Overview (después de Bienestar docente A21) dentro del mismo `space-y-5`
- Imports añadidos: `Coins, Sparkles`

### [SPRINT-CULTURE][C22] StudentPortfolio — Evidencias con QR ✅
- Commit: `be65066`
- Archivo modificado: `src/components/StudentPortfolio.tsx`
- States: `qrVisible: string | null`, `imprimiendoTarjeta: string | null`
- `handleImprimirTarjeta(ev)`: genera QR SVG 7×7 determinista (seed de ev.id.charCodeAt), construye HTML completo tarjeta con Inter, logo QHUMA, título, competencia, descripción completa, URL portfolio + QR embed. Blob descargable `tarjeta_evidencia_{id}_lucas_garcia.html`
- QR inline: botón "Ver QR" / "Ocultar QR" en la sección expanded de cada evidencia. SVG 64×64 con mismo algoritmo seed. URL mock `qhuma.es/portfolio/lucas-garcia/ev-{id}`
- Botón "Imprimir tarjeta" bg-sidebar con RefreshCw animado durante generación (1.5s)
- Principio culture.md Bloque 3: el portfolio es relato de lo creado — el QR lleva la evidencia al mundo real
- Imports añadidos: `QrCode, Printer`

---

---

## Sprints completados — Ciclo 24

### [SPRINT-TEACHER][T23] TeacherAnalytics — Semáforo de riesgo actualizado ✅
- Commit: `4ba9922` (fix TS: `6b6e248`)
- Archivo modificado: `src/components/TeacherAnalytics.tsx`
- Constante módulo `riesgoBase`: 12 alumnos con diasSinAct, compBaja, tardias, tendencia
- Funciones módulo: `computeScore()` (score = diasSinAct×3 + (100-compBaja)×4/100 + tardias×5), `nivelRiesgo()` (Alto/Medio/Bajo)
- `microAccionPorNivel`: Record<"Alto"|"Medio"|"Bajo", string> con acción recomendada
- State añadido: `contactadosSemaforo: Set<string>`
- Panel "Semáforo de riesgo actualizado" antes de la comparativa de progreso semanal
- Donut SVG 3 arcos (success/warning/urgent) con conteo alumnos; distribución 3 KPIs
- Lista de 12 alumnos ordenada por score: badge nivel, flecha tendencia (ArrowUp/ArrowDown/Minus), micro-acción, barra score/40
- Botón Contactar solo para riesgo Alto con feedback CheckCircle2
- Imports añadidos: `ArrowUp, ArrowDown, Minus, ShieldAlert`

### [SPRINT-STUDENT][S25] StudentDashboard — Widget "Habilidad de la semana" ✅
- Commit: `37db134`
- Archivo modificado: `src/components/StudentDashboard.tsx`
- IIFE pattern sin estados nuevos — detecta comp más baja de `compScores` hardcoded (CCEC: 55 es la más baja)
- `compScores` y `compNames`: Records de las 8 competencias LOMLOE con scores mock
- `ejercicios`: Record<CompKey, { titulo, descripcion, tiempo, dificultad, evidencia }> — 8 entradas con contexto Casa Limón
- `dificultadCfg`: Record<"Básico"|"Medio"|"Avanzado", {bg, text}>
- Panel con: badge comp detectada + score, barra progreso, card ejercicio en bg-accent-light, badge dificultad, badge tiempo
- Botón "Marcar como practicado · +45 Q-Coins": alert inline con feedback
- Botón "Pedir otro ejercicio": fetch /api/tutor-chat mode="narrativa" con prompt contextualizado en Casa Limón
- Insertado entre S23 (Perfil cognitivo activo) y S6 (Mercado en Tiempo Real)
- Sin imports nuevos (Sparkles y CheckCircle2 ya existían)

### [SPRINT-ADMIN][A23] AdminDashboard — Análisis de uso por franja horaria ✅
- Commit: `da34a31`
- Archivo modificado: `src/components/AdminDashboard.tsx`
- States añadidos: `franjaVista: "semana" | "media"`, `mantenimientoSlot: string | null`, `mantenimientoGuardado: string | null`
- IIFE en tab Métricas: `dataSemana` Record con dos datasets (semana/media) de actividad % — 4 franjas × 5 días
- Heatmap table: opacidad rgba(31,81,76, val/100×0.8), badges PICO/MIN en celda máximo/mínimo
- Algoritmo detección pico y valle: O(n²) sobre data[franja][día]
- Anotaciones: 2 cards (success-light pico / urgent-light valle) con descripción
- Leyenda gradiente de 5 intensidades
- Panel "Programar mantenimiento": select de 3 slots + botón Guardar con estado guardado + mensaje confirmación
- Toggle "Esta semana" / "Media 4 semanas" en header
- Insertado en tab Métricas al final del space-y-5 (después de A16)
- Sin imports nuevos (Clock y Server ya estaban importados)

### [SPRINT-CULTURE][C23] StudentPortfolio — "Mi impacto en números" con proyección IA ✅
- Commit: `52b494e`
- Archivo modificado: `src/components/StudentPortfolio.tsx`
- States añadidos: `proyeccionVisible: boolean`, `loadingProyeccion: boolean`, `proyeccionData: {conservador, realista, optimista}: number[] | null`, `proyeccionGuardada: boolean`
- Sección "Proyección a 12 meses" insertada inmediatamente después de S15 "Mi impacto real" y antes de S16
- Estado vacío: botón "¿Qué pasaría si...?" bg-accent-light con Sparkles icon
- `handleProyeccion`: fetch /api/tutor-chat mode="narrativa" solicitando JSON con 3 arrays de 12 meses; parse via regex `/\{[\s\S]*\}/`; fallback mock con curva de crecimiento realista
- 3 escenarios: conservador (40% ocupación / bg-urgent-light), realista (65% / bg-warning-light), optimista (85% / bg-success-light)
- KPIs por escenario: ingreso mensual medio + total anual
- Barras mensuales CSS proporcionales al máximo (optimista); etiquetas Abr-Mar
- Nota metodológica en bg-background
- Botón "Guardar proyección en portfolio" bg-sidebar → estado guardado bg-success-light con timestamp
- Import añadido: `CheckCircle2`

---

## Sprints completados — Ciclo 25

### [SPRINT-TEACHER][T24] TeacherRubrica — Panel rubricas guardadas ✅
- Commit: `d5a2784`
- Archivo modificado: `src/components/TeacherRubrica.tsx`
- Panel "Mis rúbricas guardadas" antes del grid principal: 3 rúbricas del proyecto Airbnb Málaga (CLC+CD+CE / CCEC+CLC+CD / STEM+CE+CLC)
- Distribución de alumnos por nivel (1-4) con barra CSS multi-segmento coloreada por nivel LOMLOE
- Botón Duplicar: 900ms delay + feedback "Copia creada" vía Set duplicadas
- Botón Asignar a proyecto: select inline de 3 proyectos activos + badge "Asignada" success-light
- Botón Descargar PDF: genera HTML blob con tabla de criterios LOMLOE, descarga vía URL.createObjectURL
- Estados: rubricasDuplicadas (Set), duplicandoId (string|null), asignandoRubricaId (string|null), rubricaAsignada (Record<string,string>), exportandoRubrica (string|null), rubricaExportada (Set)
- Imports añadidos: Copy, FolderOpen, Download, Layers, Calendar, RefreshCw

### [SPRINT-STUDENT][S26] StudentAchievements — Misiones semanales ✅
- Commit: `62c9d2e`
- Archivo modificado: `src/components/StudentAchievements.tsx`
- Sección "Misiones de esta semana" insertada antes del stats de rareza (al inicio del panel principal)
- 4 misiones por cluster LOMLOE: CLC+CPL (ficha bilingüe), STEM (margen por reserva), CD (widget reservas), CE+CPSAA (pitch 90s Demo Day)
- Cada misión: ícono cluster, título, descripción contextualizada en Casa Limón, barra de progreso pasos, XP, badge días restantes
- Badge días: urgent (hoy), warning (≤3d), muted (>3d)
- Botón "Completar paso": 700ms delay + animación bounce + actualización progreso
- Auto-completado: cuando progreso=total, badge "¡Misión completada! +Q-Coins" con CheckCircle2
- Estados: misionesProgreso Record<string,number>, completandoPaso (string|null), pasoCompletado (Set<string>)
- Imports añadidos: Clock, ChevronRight

### [SPRINT-ADMIN][A24] AdminDashboard — Panel integridad académica ✅
- Commit: `4d3f5f9`
- Archivo modificado: `src/components/AdminDashboard.tsx`
- Panel "Integridad académica" insertado en tab Inspección después de la sección de documentos
- 5 alertas mock de similitud entre entregas (75-91%) con alumno1/alumno2 de la clase de 12 alumnos
- KPIs: total alertas esta semana / revisadas / pendientes en grid 3 columnas
- Barra CSS de similitud por alerta: urgent (>85%) o warning (70-85%) con badge de nivel
- Avatares con iniciales de ambos alumnos superpuestos (avatar2 -ml-2)
- Acciones: "Marcar revisada" → Set, "Solicitar aclaración" → 900ms delay + estado enviada, "Ignorar" → oculta de la lista
- Estado vacío cuando todas las alertas han sido gestionadas
- Estados: alertasRevisadas (Set), alertasIgnoradas (Set), solicitandoClarificacion (string|null), clarificacionEnviada (Set)

### [SPRINT-CULTURE][C24] TeacherChat — Modo Deep Dive visual ✅
- Commit: `5171810`
- Archivo modificado: `src/components/TeacherChat.tsx`
- Barra de profundidad 0-100% calculada como (studentMsgCount-6)/10×100, actualizada en useEffect existente
- Panel "Hilos de exploración activos": extrae las 3 últimas frases de respuestas IA, botón "Explorar" prepopula el input con pregunta socrática profundizadora
- Botón "Guardar sesión Deep Dive": 1000ms delay → crea sesión con tema detectado, profundidad, 3 insights clave
- Panel colapsable "N sesiones guardadas": máx 3 sesiones en LIFO, cada una con tema truncado, barra profundidad, hora, insights
- Estados: deepDiveDepth (0-100), deepDiveHilos (string[]), deepDiveSesiones (array), guardandoSesion, sessionGuardada, showSesiones
- Imports añadidos: BookOpen, ChevronDown, ChevronUp, Save, CheckCircle2

---

## Sprints completados — Ciclo 26

### [SPRINT-TEACHER][T25] TeacherStudents — Plan de acción individual ✅
- Commit: `29ab0dd`
- Archivo modificado: `src/components/TeacherStudents.tsx`
- Interface `PlanAccion` (id, descripcion, competencia, tiempoMin, estado)
- Panel "Plan de acción individual" en vista expandida de cada alumno: toggle "Ver plan"/"Ocultar"
- Secciones: Fortalezas (top 2 competencias por score), Áreas de mejora (bottom 2 comps), Plan semanal
- 3 acciones semanales con: checkbox circular (pendiente→progreso→completado), badge comp, tiempo, estado
- `handleGenerarPlan(studentId, globalIdx)`: fetch /api/tutor-chat mode="narrativa" con formato JSON array; fallback `planMockPorAlumno()` derivado de competencies scores
- `handleDescargarPlan(student, acciones)`: HTML blob con tabla de acciones, Blob/createObjectURL, filename `plan_accion_{nombre}_{fecha}.pdf`
- `handleToggleAccionEstado(accionId)`: cicla pendiente→progreso→completado en `accionesEstado`
- States: planAlumnoId (string|null), planAcciones (Record<string, PlanAccion[]>), generandoPlan (string|null), planDescargado (Set<string>), accionesEstado (Record<string, estado>)
- Imports añadidos: Target, Sparkles, Download, Trophy, Star, BookOpen, RefreshCw

### [SPRINT-STUDENT][S27] StudentDashboard — Widget "Mi tribu aprende" ✅
- Commit: `9ad0c91`
- Archivo modificado: `src/components/StudentDashboard.tsx`
- Sección "Mi tribu aprende" insertada entre S25 (Habilidad de la semana) y S6 (Mercado en Tiempo Real)
- Stats agregados: 8 evidencias subidas (success), 3 pitches ensayados (accent), racha media 12d (warning)
- 3 logros anónimos: Alumno A (CE), Alumno B (CLC), Alumno C (STEM) con emoji + competencia badge
- Banner bg-sidebar: "Estás entre los top 3 esta semana 🔥"
- Heatmap 7 días: barras CSS proporcionales a intensidad con opacidad interpolada (bg-accent-text)
- IIFE pattern completo, sin estados nuevos

### [SPRINT-ADMIN][A25] AdminDashboard — Proyectos en segunda ronda ✅
- Commit: `5ca252f`
- Archivo modificado: `src/components/AdminDashboard.tsx`
- Panel "Proyectos en segunda ronda" insertado al final del tab Capital (después de carta generador A9)
- 3 proyectos: Casa Limón (Lucas García, €4.500, mentor Ana Martínez), EcoMercado Escolar (Sofía Torres, €3.000, mentor Carlos Rueda), App Guía Turística (Pablo Ruiz, €8.500, mentor Ana Martínez)
- Stepper 3 fases por proyecto: Revisión documental ✅, Pitch ante claustro ✅, Votación inversores (en progreso)
- Comentario mentor en bg-accent-light; días desde última actualización; badge inversión bg-sidebar
- "Ver expediente completo": expand detalle con grid 4 KPIs + próxima acción en bg-warning-light
- "Solicitar reunión": select 5 fechas disponibles + confirmación bg-success-light con CheckCircle2
- States: expedienteExpandido (string|null), reunionSolicitada (Set<string>), fechaReunion (Record<string,string>)
- Import añadido: Target

### [SPRINT-CULTURE][C25] StudentPortfolio — Línea del tiempo integrada ✅
- Commit: `c9583cd`
- Archivo modificado: `src/components/StudentPortfolio.tsx`
- Toggle "Vista narrativa" / "Línea del tiempo" en cabecera (debajo del subtítulo, antes del S19)
- En modo timeline: cronología unificada de hitos (Trophy verde), errores (AlertCircle naranja), evidencias (FileText accent-text)
- Leyenda de 3 tipos + contador total de eventos
- Cada evento: dot absoluto con icono, fecha, tipo badge, competencia badge, título, descripción, XP (hitos) o estado superado (errores)
- Ordenación cronológica por fase (Semana 1 → 4)
- Botón "Exportar": genera HTML blob con todos los eventos + estilos, Blob/createObjectURL
- Modo narrativa: todo el contenido anterior (C6 → narrativeBlocks) envuelto en React fragment `{timelineVista === "narrativa" && <>...</>}`
- States: timelineVista ("narrativa"|"timeline"), exportandoTimeline, timelineExportado
- Imports añadidos: Trophy, Download

---

## Sprints completados — Ciclo 27

### [SPRINT-TEACHER][T26] TeacherDashboard — Semana en números ✅
- Commit: `b51bddd`
- Archivo modificado: `src/components/TeacherDashboard.tsx`
- Panel colapsable "Semana en números" ANTES del hero/health widget (primer elemento del dashboard)
- 5 stats con icono, valor, trend arrow+%: evidencias revisadas 7/12 (+17%), media LOMLOE 3.1 (+5%), alumnos mejoraron 8 (+33%), nuevos errores 2 (-50%), Q-Coins 340 (+13%)
- Trend color semáforo: errores invierte la lógica (menos = success, más = urgent)
- Badge "Semana 3 · 10–14 mar" en header; toggle ChevronUp/Down; estado `semanaExpanded` (default true)
- "Generar resumen narrativo": fetch /api/tutor-chat mode="narrativa" → card AI bg-accent-light con texto 3 frases
- "Compartir con equipo directivo": navigator.clipboard + feedback "¡Copiado!" 2s
- States: `semanaExpanded`, `semanaResumen`, `generandoResumen`, `resumenCopiado`
- Imports añadidos: `ChevronDown, ChevronUp, Coins, Trophy, Copy`

### [SPRINT-STUDENT][S28] StudentProfile — Mi red de apoyo ✅
- Commit: `125714a`
- Archivo modificado: `src/components/StudentProfile.tsx`
- Sección "Mi red de apoyo" insertada ANTES de "Competencias" (entre evidence portfolio y competency overview)
- 3 mentor cards: Profesora Martínez (Tutora QHUMA, CE+STEM, bg-sidebar), Jorge Blanco (Inversor externo, CE+CCEC, bg-accent-text), María Rivas (Alumni QHUMA, CLC+CCEC, bg-warning)
- Cada card: avatar initials circle, nombre, rol, specialty badges con colores por comp, último mensaje preview itálico, response time con Clock icon
- "Pedir consejo" → form inline con textarea + botón Enviar (1.2s delay) + feedback "¡Mensaje enviado!" success-light
- IIFE pattern con specialtyColors Record interno
- States: `mentorMensaje Record<string,string>`, `enviandoMentor string|null`, `mentorEnviado Set<string>`, `mentorFormOpen string|null`
- Imports añadidos: `useState, Clock, ChevronRight, CheckCircle2, Send, RefreshCw`

### [SPRINT-ADMIN][A26] AdminDashboard — Rendimiento docente ✅
- Commit: `6c48c29`
- Archivo modificado: `src/components/AdminDashboard.tsx`
- Panel "Rendimiento docente" al FINAL del tab Métricas (después de A23 heatmap franja horaria)
- KPI bar: avg satisfacción 4.1, avg respuesta 3.2h, total feedbacks 47
- Tabla 6 docentes: Ana Martínez, Carlos Pérez, Isabel Mora, Roberto Sánchez, Patricia Gómez, Luis Fernández
- Columnas: nombre + badge rendimiento, alumnos, evidencias/sem, resp.(h) coloreado semáforo, barra uso IA %, stars satisfacción
- Badge performance: Destacado ≥4.5 (success), En progreso 3.5–4.4 (accent), Apoyo <3.5 (warning)
- "Ver detalle": expande fila con últimos 3 feedbacks + funcionalidad IA favorita en bg-sidebar
- "Reconocer logro" (Trophy icon): 900ms delay + feedback "Enviado" CheckCircle2 green
- States: `docenteExpandido string|null`, `docenteReconocido Set<string>`, `reconociendoDocente string|null`
- Import añadido: `Star`

### [SPRINT-CULTURE][C26] PitchLab — Modo Debate ✅
- Commit: `5d1d381`
- Archivo modificado: `src/components/PitchLab.tsx`
- Modo `"debate"` añadido al type de `mode` (`"write" | "feedback" | "debate"`)
- Tab navigation: 3 pills "Preparar / Feedback / Debate" en el header (bg-background/card pattern)
- Selector de postura: "A favor" (success-light) o "En contra" (urgent-light) con descripción contextual
- `handleIniciarDebate(postura)`: fetch /api/tutor-chat mode="pitchcoach" → 3 argumentos opuestos; fallback hardcoded específico al proyecto
- Parse de respuesta: extrae líneas que empiezan con `\d\.`, fallback a array hardcoded
- 3 cards argumento + respuesta: burbuja IA (bg-background), textarea alumno, CheckCircle2 cuando relleno
- "Evaluar mi debate" (disabled si alguna respuesta vacía): fetch pitchcoach → parse PUNTUACIÓN + MÁS FUERTE + MÁS DÉBIL
- Evaluación: panel bg-sidebar con score 1–10 + barra 10 segmentos coloreada + panel evaluación textual con colores por tipo de línea
- `handleResetDebate()`: limpia todos los states del debate
- States: `debatePostura`, `debateArgumentos`, `debateRespuestas`, `debateEvaluacion`, `debatePuntuacion`, `generandoArgumentos`, `evaluandoDebate`
- Import añadido: `TrendingDown`

---

---

## Sprints completados — Ciclo 28

### [SPRINT-TEACHER][T27] TeacherMessages — Grupo y plantillas avanzadas ✅
- Commit: `e45a737`
- Archivo modificado: `src/components/TeacherMessages.tsx`
- Botón "Mensaje a toda la clase" toggle en header (bg-sidebar cuando activo)
- Modo grupo: avatares 12 alumnos en header, textarea + botón "Enviar a todos" con delay 1.5s + confirmación "Enviado a 12 alumnos" con CheckCheck
- Panel "Mensajes programados" con 2 entradas mock (mañana 9h, viernes 16h) en bg-warning-light con botón Cancelar
- 3 plantillas avanzadas: Recordatorio Demo Day / Felicitación proyecto / Alerta entrega pendiente — preview tooltip al hover (derecha del botón)
- Estados: grupoMode, grupoMensaje, enviandoGrupo, grupoEnviado, canceladoProgramado Set<string>, hoveredPlantilla
- Imports añadidos: Users, Calendar, X, Bell

### [SPRINT-STUDENT][S29] StudentDashboard — Modo enfoque Pomodoro ✅
- Commit: `8ba8dc2`
- Archivo modificado: `src/components/StudentDashboard.tsx`
- Botón flotante "Modo enfoque" al final del today view (abre panel inline, no overlay fullscreen)
- Ring SVG circular (r=44, viewBox 100×100) mostrando tiempo restante: stroke-dasharray dinámico con transición 1s linear
- Fases: trabajo 25 min (stroke accent-text) / descanso 5 min (stroke success)
- Tarea activa pulled from today.tasks.find("in_progress") — fallback "Completar modelo financiero Casa Limón"
- Controles: Iniciar/Pausar/Continuar + Reiniciar (RotateCcw) + botón "Iniciar descanso 5 min" al completar sesión
- Flash ring-success + animate-pulse + "+20 Q-Coins" al completar sesión 25 min
- Log 2 sesiones previas mock (08:45, 10:15) + contador sesionesHoy reactivo
- useEffect con setInterval y cleanup (mismo patrón que PitchLab C12 ensayoTimer)
- Estados: enfoqueMode, enfoqueRunning, enfoqueElapsed, enfoqueFase, sesionesHoy, enfoqueCompleted
- Imports añadidos: Focus, RotateCcw, X

### [SPRINT-ADMIN][A27] AdminDashboard — Alertas automáticas en tab IA ✅
- Commit: `9c4b72e`
- Archivo modificado: `src/components/AdminDashboard.tsx`
- Panel "Configuración de alertas automáticas" al final del tab IA (dentro del space-y-5)
- 6 reglas: inactividad 3d / nota baja / evidencia vencida / Q-Coins bajo / ratio completado / streak rota
- Cada regla: toggle pill (CSS inline-flex) + condición + destinatarios badges (Alumno/Tutor/Familia con colores) + última vez + selector frecuencia (inmediata/diaria/semanal)
- Botón "Probar alerta": 800ms delay → "Enviada a 3" con CheckCircle2 por 3.5s; solo activo si regla activa
- Resumen top: 3 KPIs grid (reglas activas / alertas semana 14 / pendientes de configurar)
- Estados: alertasConfig Record<string,boolean>, alertasFrecuencia Record<string,string>, probandoAlerta string|null, alertaProbada Set<string>
- Imports: Bell ya existía

### [SPRINT-CULTURE][C27] StudentPortfolio — Insignias de habilidad LOMLOE ✅
- Commit: `f504be2`
- Archivo modificado: `src/components/StudentPortfolio.tsx`
- Sección "Insignias de habilidad" en columna derecha w-64, debajo de Teacher comment
- 8 insignias (CLC/CPL/STEM/CD/CPSAA/CC/CE/CCEC) con estados desbloqueado(≥70%)/progreso(40-69%)/bloqueado(<40%)
- Desbloqueadas: grid 2 cols en bg-accent-light, icono emoji, nombre, comp, fecha "3 mar", CheckCircle2
- Expandida: evidencia que la generó + momento narrativo + botón Compartir (clipboard)
- En progreso: barra warning + "X evidencias más para desbloquear"
- Bloqueadas: grid 4 cols, icono con Lock superpuesto (absolute), opacity-40
- "Exportar insignias": HTML blob con grid de 8 insignias + estilos Inter, Blob/createObjectURL, filename insignias_lucas_garcia.html
- Estados: badgeExpandida string|null, exportandoBadges, badgesExportadas
- Imports añadidos: Lock, Shield

---

## Sprints completados — Ciclo 32

### [SPRINT-TEACHER][T30] TeacherAnalytics — Panel "Correlación esfuerzo × resultado" ✅
- Commit: `46ade05`
- Archivo: `src/components/TeacherAnalytics.tsx`
- CSS scatter plot con 12 alumnos posicionados por effort (44–89%) y result (38–83%) con datos seeded determinísticos
- 4 cuadrantes: Estrellas (success), Potencial (accent), Apoyo (warning), Prioritario (urgent)
- Hover tooltip con nombre + valores. Summary pills 4 columnas. Panel de recomendaciones por cuadrante.
- Nuevos imports: `Target`, `Lightbulb`

### [SPRINT-STUDENT][S32] StudentDashboard — Widget "Preparación Demo Day" ✅
- Commit: `869a161`
- Archivo: `src/components/StudentDashboard.tsx`
- 6 ítems checklist con badges LOMLOE: pitch(CLC), slides(CD), financiero(STEM), ensayo(CE), feedback(CPSAA), equipo(CC)
- SVG ring (r=22, circ≈138) con color dinámico al 80%/50%. Countdown 2 días → Demo Day viernes 13 mar
- Toggle por ítem (Set<string>), tachado al marcar. Footer motivacional según % completado
- Estado inicial: pitch + financiero ya marcados

### [SPRINT-ADMIN][A30] AdminDashboard — Panel seguimiento proyectos activos ✅
- Commit: `eddea15`
- Archivo: `src/components/AdminDashboard.tsx`
- Panel en Overview tab columna izquierda (después del IIFE Q-Coins A22)
- 12 alumnos con barra de progreso, conteo evidencias, badge status (En curso/Entregado/Retrasado)
- Summary pills: media clase, nº entregados, nº retrasados
- Nuevo import: `FolderOpen`

### [SPRINT-CULTURE][C30] StudentProfile — Panel "Diario socrático" (Bloque 1) ✅
- Commit: `735285b`
- Archivo: `src/components/StudentProfile.tsx`
- 3 entradas anteriores con pregunta socrática + respuesta del alumno + pregunta de seguimiento IA
- Prompt diario rotatorio (3 prompts, rotación por día del mes)
- Textarea para reflexión de hoy + botón guardar + respuesta IA inline al guardar
- Nuevo import: `BookOpen`. Nuevo estado: `diarioHoy`, `diarioGuardado`

### [SPRINT-FIX][FX1] Language selector Student/Teacher — alineado con ParentSettings ✅
- Commit: `5ec906e`
- Archivos: `src/components/StudentSettings.tsx`, `src/components/TeacherSettings.tsx`
- Botones con flags 🇪🇸/🇬🇧, Check icon en activo, accent-light active state — idéntico a ParentSettings
- Solo ES/EN, sin Catalán. Cache .next eliminado para forzar recompilación limpia.

---

## Sprints completados — Ciclo 31

### [SPRINT-I18N][I1] StudentDashboard + StudentCalendar — i18n alumno completo ✅
- Commit: `31abb19`
- Archivos: `src/components/StudentDashboard.tsx`, `src/components/StudentCalendar.tsx`
- KPI array Economía (S22): label/info/meta de 4 KPIs envueltos en lbl()
- "4 reservas activas" → lbl()
- "Beneficio neto del mes" → lbl()
- Difficulty badges: difLabel map (Básico/Medio/Avanzado → Basic/Medium/Advanced)
- Mercado sección: "Actualizado hoy, 11 mar 2026" + "Conectado a: …" → lbl()
- StudentCalendar: subtitle "Lanza tu Airbnb · Semana 3" → lbl()

### [SPRINT-I18N][I2] TeacherProjectGenerator — i18n profesor completo ✅
- Commit: `2a9738f`
- Archivo: `src/components/TeacherProjectGenerator.tsx`
- Archivo NO tenía useLang importado — añadido desde cero
- Traducidos: h1, subtitle, buttons (Nueva config, Copiar, ¡Copiado!, Regenerar, Generando, Generar proyecto)
- Form labels: Contexto, Duración, Competencias prioritarias
- Placeholder textarea, "sem." → lbl()
- Hints panel (Metodología QHUMA texto + 3 bullets)
- Result section headers: Fases del proyecto, Entregables, Criterios de evaluación, Impacto real
- Spinner "Regenerando…" → lbl()

### [SPRINT-I18N][I3] Auditoría completa + fixes cruzados ✅
- Commit: `d35a40e`
- Archivos: `ProjectDetail.tsx`, `RoleSelector.tsx`, `EvidenceGallery.tsx`, `TeacherProjects.tsx`
- ProjectDetail: useLang añadido, colConfig labels → labelEs/labelEn, Kanban column labels bilingüe
- RoleSelector: useLang añadido, roles array movido dentro del componente, sublabels → lbl()
- EvidenceGallery: "Proyecto: … Semana X de Y" → lbl() para wrapper y semana
- TeacherProjects: placeholder textarea → lbl()
- Confirmado: TeacherDashboard, TeacherAnalytics, TeacherStudents, TeacherGradeBook, TeacherCalendar, TeacherRubrica, todos los Parent* componentes, AdminDashboard — todos correctamente bilingüe

### [SPRINT-I18N][I4] QCoins + TrimesterTimeline — widgets bilingüe ✅
- Commit: `1ed5afb`
- Archivos: `src/components/QCoins.tsx`, `src/components/TrimesterTimeline.tsx`
- QCoins: useLang añadido, "Q-Coins & XP" / "XP This Week" / "Day Streak" / "Evidences" → lbl()
- TrimesterTimeline: useLang añadido, "Trimester 1 Projects" / "Real World Business" → lbl()

---

## Sprints completados — Ciclo 30

### [SPRINT-TEACHER][T29] TeacherAnalytics — Comparativa entre grupos y exportar análisis ✅
- Commit: `5aac928`
- Archivo modificado: `src/components/TeacherAnalytics.tsx`
- Panel "Comparativa entre grupos" al FINAL de TeacherAnalytics (después de sparklines semanales)
- Grupo A: Lucas, Sofía, Pablo, María, Diego, Ana. Grupo B: Carlos, Laura, Tomás, Carla, Alejandro, Valentina
- Vista "Por competencia": 8 barras LOMLOE lado a lado (sidebar=A, accent-text/60=B), badge "lidera" por comp
- Vista "Por indicador": 3 indicadores (racha/entregas/riesgo) con barras y badge "Lidera: Grupo X"
- KPI summary grid 3 columnas: racha media, entregas a tiempo %, riesgo medio — con badge A/B líder
- Toggle "Por competencia" / "Por indicador" (bg-background/card pattern)
- "Exportar análisis comparativo": Blob HTML con tabla LOMLOE 8 comps + indicadores + fecha. Blob/createObjectURL download `analisis_comparativo_grupos_{fecha}.pdf`
- Estados añadidos: `grupoComparativaVista ("competencia"|"indicador")`, `exportandoAnalisis`, `analisisExportado`
- Imports añadidos: `Download`, `Layers`

### [SPRINT-STUDENT][S31] StudentQCoins — Tienda de experiencias con reserva de plaza ✅
- Commit: `c530e61` (fix TS: `ddb4a9b`)
- Archivo modificado: `src/components/StudentQCoins.tsx`
- Tipo `Categoria` ampliado con "Experiencias". Interface `Experiencia` + `Reserva` definidas en módulo
- 4 experiencias: Visita empresa tech Málaga (500QC, 10/12), Workshop foto profesional (350QC, 6/8), Charla inversor QHUMA Capital (250QC, 12/15), Mentoría 1:1 alumni (400QC, 3/5)
- Cada card: placeholder imagen (bg-sidebar/10 + icono), título, fecha pill warning, descripción, aforo con barra CSS (success/warning/urgent según %) y "N libres"
- "Reservar plaza": verifica saldo → deduce de `saldoActual` → añade a `reservas` → muestra confirmación con ticket code `QHM-{id}-{random}`
- "Mis reservas" toggle: lista de reservas activas con ticket badge + "Cancelar" (refund QC)
- `saldoActual` state inicializado a `currentStudent.qcoins`, declarado junto a otros Mercado states (antes de la primera referencia)
- catColors y catLabels actualizados con "Experiencias" (bg-sidebar/10)
- Sección visible cuando catActiva === "Todo" || "Experiencias"
- Estados añadidos: `saldoActual`, `reservas`, `cancelando`, `reservandoId`, `confirmacionReserva`, `showMisReservas`
- Imports añadidos: `Building2`, `BookOpen`, `Briefcase`, `UserCheck`, `Ticket`

### [SPRINT-ADMIN][A29] AdminDashboard — Mapa de riesgo de abandono en Métricas ✅
- Commit: `15845be`
- Archivo modificado: `src/components/AdminDashboard.tsx`
- Panel "Mapa de riesgo de abandono" al FINAL del tab Métricas (después de A26 rendimiento docente)
- 12 alumnos clasificados por engagement (bajo/medio/alto) × progreso (bajo/medio/alto) en grid 3×3
- Colores de celda: critico (urgent-light + border urgent + animate-pulse), warning (warning-light), success (success-light), neutral (background)
- Chips por alumno con iniciales: urgent (critico), warning, success según cuadrante
- Zona crítica (bajo+bajo): borde pulsante + etiqueta "⚠ Zona crítica"
- Resumen urgent-light: X alumnos en zona crítica + 3 acciones recomendadas numeradas
- "Generar informe de riesgo": HTML blob tabla completa 12 alumnos + zona crítica destacada, download `informe_riesgo_abandono_{fecha}.pdf`
- Leyenda colores + counter (warning + OK) en pie del panel
- Estados añadidos: `riesgoInformeGenerado (boolean)`, `generandoRiesgoInforme (boolean)`
- Imports: Download, RefreshCw, AlertTriangle, CheckCircle2 (ya existían)

### [SPRINT-CULTURE][C29] StudentDashboard — Reflexión diaria socrática ✅
- Commit: `a8beb64`
- Archivo modificado: `src/components/StudentDashboard.tsx`
- Widget "Reflexión del día" insertado como PRIMER elemento del main content (antes del hero CD1)
- Fecha y día de la semana calculados en tiempo real con `new Date()`
- 5 prompts rotativos por día de semana (lunes→viernes) sobre el proyecto Casa Limón / Airbnb Málaga — todos en modo socrático
- Fines de semana usan el prompt de viernes
- Textarea max 300 chars con contador (warning al llegar a 280)
- "Guardar reflexión": 700ms delay → guarda `{ texto, dia, fecha }` al array `reflexionesGuardadas` (max 5, LIFO) → "Reflexión guardada ✓" 3s
- "Ver mis reflexiones" toggle: lista de últimas 5 con día + fecha + texto completo en bg-background cards
- IIFE pattern para `prompts` / `handleGuardar` / fecha — variables scoped al bloque
- Estados añadidos: `reflexionHoy (string)`, `reflexionesGuardadas (array)`, `guardandoReflexion`, `reflexionGuardada`, `showReflexiones`
- Sin imports nuevos (CheckCircle2 ya existía)

---

## Sprints completados — Ciclo 29

### [SPRINT-TEACHER][T28] TeacherCalendar — Vista trimestral y duplicar semana ✅
- Commit: `f9b1a89`
- Archivo modificado: `src/components/TeacherCalendar.tsx`
- `VistaCalendario` type extendido a `"semana" | "mes" | "trimestre"`
- Botón "Trimestre" añadido al toggle vista (3 opciones)
- `semanasTrimestrales`: array 12 semanas con días lun-vie, fases (1/2/3), flags esDemoDay (S12) / esEntregaT2 (S8)
- Grid 12 filas × 6 cols (semana label + 5 días): dots de color por tipo de evento, celda vacía si sin eventos
- Semana actual (S1) en accent-light, Demo Day (S12) en success-light, Entrega T2 (S8) en warning-light
- Panel "Duplicar semana": select origen + select destino, copia eventos con offset días × 7
- 900ms delay, chips de copias realizadas en success-light con CheckCircle2
- `getSemanaPorDia()`: mapeo día → semana (1=9-13, 2=16-20, 3=23-27, resto estimado)
- Estados añadidos: semanaOrigen, semanaDestino, semanasDuplicadas (Set<string>), duplicando
- Imports añadidos: Copy, RefreshCw

### [SPRINT-STUDENT][S30] StudentAchievements — Retos entre compañeros ✅
- Commit: `0424eff`
- Archivo modificado: `src/components/StudentAchievements.tsx`
- Interface `RetoCompanero` (id, desafiador, desafiadoNombre, competencia, descripcion, fechaLimite, estado, xpEnJuego, progreso)
- Sección "Retos entre compañeros" insertada entre S26 misiones semanales y Stats rarity row
- 3 retos activos: STEM RevPAR (aceptado + barra progreso 45%), CLC reseñas (pendiente), CE precios (completado)
- "Aceptar reto": cambia estado a aceptado con progreso 0 + barra visible
- "Lanzar reto" form: select competencia (8 LOMLOE), textarea descripción, 3 destinos anónimos (A/B/C), plazo (3/5/7d)
- 1s delay → nuevo reto añadido al array + feedback success-light 2.5s + cierre form
- XP en juego: 100 (3d) / 150 (5d) / 200 (7d)
- `compColors` y `estadoCfg` Records internos al componente
- Estados añadidos: retosActivos, retosAceptados (Set), lanzandoReto, nuevoRetoComp/Desc/Destino/Dias, retosEnviados, enviandoReto, retoEnviadoFeedback, showLanzarForm
- Import añadido: X

### [SPRINT-ADMIN][A28] AdminDashboard — Panel Licencias y facturación en Informes ✅
- Commit: `0a6b760`
- Archivo modificado: `src/components/AdminDashboard.tsx`
- Panel "Estado de licencias y facturación" al FINAL del tab Informes (IIFE), después de Informes recientes
- 4 KPIs: plan QHUMA Professional (bg-sidebar), renovación 1 sept 2026, seats 312/500 62% (warning si >80%), próx. factura €600
- Barra de uso de licencias con color semáforo
- Toggle "Ver detalle"/"Colapsar" (licenciaExpanded state)
- Tabla módulos: 5 módulos con dot activo/inactivo, badge incluido/add-on, barra uso%, precio/año; total anual en bg-sidebar
- Historial 4 facturas: concepto, fecha, importe, estado (Pagada=success-light / Pendiente=warning-light), descarga Blob real
- "Solicitar ampliación": range slider 500-1000 seats, €4.80/alumno extra mostrado, 1.5s delay + éxito success-light
- `handleSolicitarAmpliacion()` y `handleDescargarFactura(id, filename)` con Blob/createObjectURL
- Estados añadidos: licenciaExpanded, ampliacionSolicitada, ampliacionSeats (750), solicitandoAmpliacion, descargandoFactura (string|null)

### [SPRINT-CULTURE][C28] TeacherChat — Sesión de tutoría estructurada con agenda ✅
- Commit: `0165371`
- Archivo modificado: `src/components/TeacherChat.tsx`
- Botón "TUTORÍA" (ClipboardList icon) en header del chat — toggle activo/inactivo, accent cuando activo
- Agenda 4 pasos definida en `agendaTutoria` array (dentro de componente): Check-in 2min, Revisión 5min, Obstáculos 10min, Plan 3min
- Progress indicator 4 segmentos: success (completado), accent-text (activo), gris (pendiente)
- Timer countdown por paso con barra de progreso coloreada (urgent si <30s); botón Iniciar/Pausar con useEffect + setInterval
- `tutoriaIntervalRef` useRef<ReturnType<typeof setInterval>> para cleanup correcto del interval
- Pregunta sugerida por paso (clickable) → pre-llena el input del chat via `setInput()`
- Checkbox circular por paso → marca completado + avanza al siguiente step automáticamente
- `handleGuardarTutoria()`: 1.2s delay, crea sesión con pasos/fecha/duración/resumen, prepend a tutoriaSesiones (máx 5)
- Panel historial de sesiones: fecha, pasos completados, duración, resumen truncado
- Estados añadidos: tutoriaMode, tutoriaStep (0-3), tutoriaTimers (number[]), tutoriaCompletados (Set<number>), tutoriaSesiones (array), guardandoTutoria, tutoriaGuardada, tutoriaTimerRunning
- Imports añadidos: ClipboardList, Timer, X

---

## Notas técnicas (leer antes de cada ciclo)

- **StudentView type**: "dashboard" | "project" | "task" | "competencies" | "calendar" | "qcoins" | "profile" | "settings" | "evidences" | "achievements" | "streak" | "portfolio" | "pitchlab" (sin cambios en Ciclo 7)
- **TeacherView type**: "dashboard" | "projects" | "analytics" | "calendar" | "students" | "settings" | "gradebook" | "generator" | "messages" | "rubrica" (sin cambios en Ciclo 9)
- **ParentView type**: "overview" | "progress" | "calendar" | "teachers" | "profile" | "settings"
- **AdminView type**: "overview" | "users" | "capital" | "ai" | "schools" | "reports" | "inspection" | "metrics" (metrics añadido en Ciclo 9)
- **TeacherStudents**: C7 modificado (TeacherComentarios). T11 añade historialPorAlumno (const a nivel módulo) y filtros "Brillando"/"En riesgo". T25 añade PlanAccion interface + planAlumnoId/planAcciones/generandoPlan/planDescargado/accionesEstado states + handleGenerarPlan()/handleDescargarPlan()/handleToggleAccionEstado(). Panel "Plan de acción individual" en vista expandida antes de las barras de competencias. Leer antes de editar en ciclos futuros.
- **StudentAchievements**: S13 añade misionesCompletadas (const módulo), sharedId state, botón Compartir por logro, panel Próximos desbloqueos en sidebar. S26 añade misionesSemanales (array dentro del componente, 4 misiones LOMLOE), misionesProgreso Record/completandoPaso/pasoCompletado states. Sección "Misiones de esta semana" insertada antes de Stats rarity row. Imports añadidos: Clock, ChevronRight. S30 añade interface RetoCompanero (id/desafiador/desafiadoNombre/competencia/descripcion/fechaLimite/estado/xpEnJuego/progreso?) definida DENTRO del componente (no en módulo). retosIniciales array de 3 retos mock. retosActivos/retosAceptados/lanzandoReto/nuevoRetoComp-Desc-Destino-Dias/retosEnviados/enviandoReto/retoEnviadoFeedback/showLanzarForm states. Sección "Retos entre compañeros" entre S26 y Stats rarity row. handleAceptarReto()/handleLanzarReto() con 1s delay. compColors y estadoCfg Records internos. Import añadido: X. Leer antes de editar.
- **AdminDashboard**: A11 añade plantillasPredefinidas, reportTipo "familia", downloadedFilename state, preview por tipo con IIFE. reportTipo type: "individual"|"grupo"|"lomloe"|"inspeccion"|"familia". A28 añade licenciaExpanded/ampliacionSolicitada/ampliacionSeats/solicitandoAmpliacion/descargandoFactura states + handleSolicitarAmpliacion() + handleDescargarFactura(id,filename). Panel "Estado de licencias y facturación" con IIFE al FINAL del tab Informes (después de Informes recientes): 4 KPIs, barra uso, toggle colapsar, tabla módulos (5), historial facturas (4), slider ampliación 500-1000 seats.
- **PitchLab**: C12 ensayoMode timer. C13 guionPorSeccion + guionOpen. C14 computeSectionScores() + sectionScores. C15 preguntasJurado + respuestasJurado/evaluacionesJurado/evaluandoJurado + handleEvaluarRespuesta(). C16 añade primerasPreguntasVivo (Record por perfil) + vivoInversor/vivoPreguntas/vivoRespuestas/vivoStep/vivoRespuestaActual/vivoIsGenerating/vivoPuntuacion/vivoComentario states + handleIniciarSesionVivo()/handleEnviarRespuestaVivo(). C17 añade SesionVivo interface + historialSesiones state (max 3) + handleRepetirConInversor(). Panel historial col-span-3 antes del mentor message con gráfico evolución y "Repetir" botón. C18 añade ensayoPreguntaIntercalada/ensayoRespuestaIntercalada states + ensayoIntercaladasVisitadas useRef Set + useEffect detección transición sección + handleContinuarTrasIntercalada(). tipoMap: solucion→competencia, mercado→riesgo, financiero→operacional, equipo→inversión. Panel intercalado como 3ª rama del ternario ensayo. C19 añade ensayoScore/ensayoScoreFuerte/ensayoScoreMejora/ensayoScoreLoading states + useEffect sobre ensayoCompleted → fetch pitchcoach + panel score (barra 10 seg + punto fuerte + mejora). handleResetEnsayo() resetea C19 states. C20 añade ensayoTiemposPorSeccion Record<string,number> + ensayoSeccionAnteriorRef. useEffect del ensayo tick actualiza tiempos por sección en cada segundo. Panel running "Tiempo por sección": barras individuales + timer elapsed/objetivo coloreado semáforo. Post-ensayo: tabla tiempos con delta por sección. handleResetEnsayo() resetea C20. C21 añade exportandoGuion/guionExportado states + handleExportarGuion() — HTML blob con 5 secciones completas, guión C13, scores C14, resumen scores. Botón "Descargar guión" bg-accent en header del modo feedback. Badge de éxito col-span-3 con CheckCircle2. Imports añadidos: Download, RefreshCw. C26 añade mode type extendido a "write"|"feedback"|"debate" + tab navigation 3 pills en header (Preparar/Feedback/Debate) + debatePostura/debateArgumentos/debateRespuestas/debateEvaluacion/debatePuntuacion/generandoArgumentos/evaluandoDebate states + handleIniciarDebate(postura)/handleEvaluarDebate()/handleResetDebate(). Pantalla selector postura (A favor/En contra). fetch pitchcoach para generar 3 argumentos opuestos (parse líneas \d\.) y para evaluar debate (parse PUNTUACIÓN/MÁS FUERTE/MÁS DÉBIL). Panel resultado: bg-sidebar score grande + barra 10 seg + evaluación textual coloreada por tipo de línea. Import añadido: TrendingDown.
- **TeacherGradeBook**: T12 exportCSV. T13 distribución. T14 HistorialCambio + historialCambios + showHistorial. T15 gradesTrimAnterior + compareModo + colAvgT1(). T16 añade gradesT3 (const módulo) + trimestre state + activeGrades/prevGrades derivados + editingEnabled. colAvgT1→colAvgPrev(). T17 añade isExportingPDF/exportPDFFilename states + handleExportPDF() → HTML Blob descarga. Botón "Informe TX PDF" bg-sidebar en header. T18 añade expandedAlumno/comentariosTrimestral/generandoFeedback/feedbackGenerado/copiadoFeedback states. Botón expand (MessageSquare+ChevronDown/Up) en celda nombre. Fila expandida con textarea comentario + borrador IA. generarFeedbackMock() función interna. handleGenerarFeedbackIA() fetch /api/tutor-chat mode=pitchcoach. handleCopiarFeedback() clipboard. T20 añade ObjetivoMejora interface + objetivosIniciales (const módulo) + objetivos/showObjetivos/nuevoObjetivoAlumnoId/Comp/Desc/Fecha states. Panel colapsable al final. Alumnos con nivel 1: comps en riesgo como badges urgent, checkbox circular por objetivo, formulario inline añadir. T21 añade exportandoInforme/exportInformeFilename states + handleExportarInformeIndividual(alumnoId) — HTML blob con radar T1/T2/T3, tabla LOMLOE, objetivos, feedback. Botón "Informe individual" (UserCheck icon, bg-sidebar) en modal T19. Import añadido: UserCheck.
- **StudentPortfolio**: S14 timelineHitos. S15 Mi impacto real. S16 evidenciasDestacadas + expandedEvidencia. S17 competenciaMesSemanal + retosPersonalizados + card Competencia del mes. S18 añade reflexionBullets/isGenerandoReflexion/expandedBullets/notasReflexion states + handleGenerarReflexion() → narrativa. S19 añade showVistaPublica/vistaPublicaURL/urlCopiada/mostrarDatosPersonales states + handleCompartirPortfolio()/handleCopiarURL(). Panel Vista pública con URL, toggle datos, top-4 comps, 3 hitos, 3 KPIs impacto. S20 añade ProximoPaso interface + proximosPasosMock (módulo) + proximosPasos/generandoProximosPasos/generandoPaso states + handleGenerarProximosPasos()/handleRegenerarPaso(i). Panel antes de "Crecimiento en competencias" con 3 cards accionables y botón Otro por paso. S21 cambia título sección "Historial de errores" → "Mis errores → Mis aprendizajes". Añade timeline vertical + superadosSet/confirmandoSuperacion/superacionMensaje states + handleMarcarSuperado() fetch pitchcoach. Barra progreso LOMLOE before→after en expanded. Dots timeline coloreados por superación. C22 añade qrVisible/imprimiendoTarjeta states + handleImprimirTarjeta(ev) — QR SVG 7×7 determinista (seed por id), HTML blob tarjeta con Inter + logo + descripción completa + QR embed. Botón "Ver QR" + QR inline en sección expanded de S16. Botón "Imprimir tarjeta" bg-sidebar con descarga directa. Imports añadidos: QrCode, Printer. C23 añade proyeccionVisible/loadingProyeccion/proyeccionData/proyeccionGuardada states + panel "Proyección a 12 meses" insertado entre S15 y S16. Botón "¿Qué pasaría si...?" → fetch narrativa → parse JSON 3 arrays 12 meses → fallback mock → 3 escenarios (conservador/realista/optimista) con KPIs + barras mensuales CSS. Botón "Guardar proyección" bg-sidebar → estado guardado. Import añadido: CheckCircle2. C25 añade timelineVista/exportandoTimeline/timelineExportado states + toggle "Vista narrativa"/"Línea del tiempo" antes del bloque S19. En modo timeline: cronología unificada hitos+errores+evidencias con dots posicionados, leyenda 3 tipos, botón exportar HTML blob. En modo narrativa: todo contenido anterior envuelto en `{timelineVista === "narrativa" && <>...</>}`. Imports añadidos: Trophy, Download. C27 añade badgeExpandida/exportandoBadges/badgesExportadas states + sección "Insignias de habilidad" al FINAL de la columna derecha w-64 (después de Teacher comment). 8 insignias LOMLOE con progreso: desbloqueadas (≥70%) grid 2 cols expand+Compartir; en progreso (40-69%) barra warning; bloqueadas (<40%) grid 4 cols con Lock icon absoluto opacity-40. handleExportarBadges() genera HTML blob grid 4 cols. Imports añadidos: Lock, Shield.
- **AdminDashboard**: A13 metricsVista toggle. A14 agendaGenerada/generandoAgenda + KPI Capital comprometido. A15 actividadDocente (const módulo) + showTodasActividades. A16 añade compClaseVista state + gráfico "Top competencias por clase" en tab Métricas (barras CSS + línea ref nivel 3.0 + toggle 1º/2º ESO). A17 añade notificacionesAutomaticas (const módulo, 5 entradas) + notificacionesEnviadas Set + notificandoId + handleEnviarNotificacion(). Widget en Overview columna izquierda. A18 añade comparativaMetrica state ("engagement" default) + panel "Análisis comparativo ampliado" con evolucionMensual (4×2 meses) side-by-side bars + comparativaCompetencias radar (8 COMPS × 2 colegios) con badge diferencia. Toggle 4 métricas en header. A19 añade Copy/Check imports + exportandoComparativa/comparativaExportada/copiandoResumen/resumenCopiado states. Botones "Exportar CSV" (Blob download 2 colegios × 4 métricas × 4 meses + 8 comps) y "Copiar resumen ejecutivo" (clipboard, texto diferencial español) en barra inferior panel A18. A20 añade comunicadoDestinatario/Asunto/Cuerpo/Enviando/Enviado states + historialComunicados array (5 entradas) + plantillasComunicado (3) + handleEnviarComunicado(). Widget "Centro de comunicación" en Overview col izquierda después de A17. Selector 4 destinatarios con count + 3 plantillas clickables + formulario + historial 5 enviados con badge tipo TOD/DOC/FAM/ALU. A21 añade bienestarEncuestaEnviada/bienestarRespuestas/bienestarEnviando states. Widget "Bienestar docente" en Overview izquierda (después de A20): 3 docentes con carga%, sesiones, alertas, riesgo bajo/medio/alto; protocolo inline para alto; encuesta semanal 4 ítems 1–5 con validación y vista resultados. Sin nuevos imports. A22 añade showEmitirQCoins/emitirMotivo/emitirCantidad/emitirDestinatario/emitiendo/emitido states + handleEmitirQCoins() (1.4s delay, cierre auto 2.5s). Widget "Gestión Q-Coins sistema" en Overview left (después de A21): 4 KPIs grid, top-5 alumnos por saldo con barras CSS, top-5 transacciones ganadas/canjes, formulario emitir Q-Coins especiales con select/input/motivo. Imports añadidos: Coins, Sparkles. A23 añade franjaVista/mantenimientoSlot/mantenimientoGuardado states. IIFE en tab Métricas: heatmap 4 franjas × 5 días con opacidad rgba(31,81,76, v/100×0.8), badges PICO/MIN, 2 anotaciones, leyenda degradiente, selector mantenimiento con 3 slots + estado guardado. Toggle "Esta semana"/"Media 4 semanas". Insertado al final del tab Métricas. Sin imports nuevos. A25 añade expedienteExpandido (string|null) + reunionSolicitada (Set<string>) + fechaReunion (Record<string,string>) states. Panel "Proyectos en segunda ronda" al final del tab Capital (IIFE): 3 proyectos con stepper 3 fases, comentario mentor bg-accent-light, expediente expandible (grid 4 KPIs + próxima acción), select fechas reunión + estado confirmado. Import añadido: Target. A27 añade alertasConfig/alertasFrecuencia (Record<string,boolean/string>) + probandoAlerta string|null + alertaProbada Set<string> states. Panel "Configuración de alertas automáticas" al FINAL del tab IA (dentro del space-y-5): resumen 3 KPIs grid + 6 reglas cada una con toggle pill CSS + condición + destinatarios badges + última vez + select frecuencia + botón probar (800ms → "Enviada a 3" 3.5s). IIFE pattern. Bell ya estaba importado.
- **API tutor-chat**: soporta mode="narrativa", mode="pitchcoach", mode="errorlog", mode="cuerpo" (CUERPO_SYSTEM_PROMPT — 3 frases de reincorporación post-pausa), deepDive=true, y modo por defecto socrático.
- **ProjectDetail**: Ciclo 11 añade vista Kanban. `kanban` state local inicializado de task.status. `reviewOverride = new Set(["mon-3","mon-5","tue-1"])`. `estimadoMin` mock de minutos por taskId. Drag-and-drop nativo HTML5, no librería.
- **TeacherDashboard**: Ciclo 11 añade tareasVencidas y alumnosSinLogin mock data a nivel de módulo (fuera del componente). Estado prorrogadas: Set<string>.
- **StudentDashboard**: S8 añade profesionalInvitado y showPreguntaInvitado state. IndustriasVivas entre Tribe y Mercado. S22 añade sección "Economía de mi proyecto" entre IndustriasVivas y Mercado (4 KPIs, desglose 6 líneas, bloque IA socrático). S23 añade sección "Perfil cognitivo activo" entre Economía y Mercado — IIFE pattern, 8 inteligencias Gardner mapeadas a CompKey, inteligencia activa derivada de tareaActiva.competencies[0], panel bg-sidebar + grid top-3. Import añadido: Brain. S25 añade sección "Habilidad de la semana" entre S23 y Mercado — IIFE, compScores/compNames/ejercicios como vars locales del IIFE, detecta comp más baja, ejercicio contextualizado en Casa Limón con dificultad/tiempo/evidencia, botones Marcar (+45 Q-Coins alert) y Pedir otro (fetch narrativa). Sin estados nuevos. S27 añade sección "Mi tribu aprende" entre S25 y S6 (Mercado) — IIFE pattern, 3 stats grid, 3 logros anónimos array, banner bg-sidebar ranking hint, heatmap 7 días barras CSS. Sin estados nuevos. S29 añade botón flotante "Modo enfoque" + panel Pomodoro al final del today view (después de S27): enfoqueMode/enfoqueRunning/enfoqueElapsed/enfoqueFase/sesionesHoy/enfoqueCompleted states + useEffect timer (cleanup setInterval). Ring SVG r=44 con strokeDasharray dinámico. Panel: ring + controles + tarea activa + log sesiones. Imports añadidos: Focus, RotateCcw, X. C29 añade widget "Reflexión del día" como PRIMER elemento del main content (antes del hero CD1): IIFE pattern con prompts Record<number,{es,en}> (lunes=1→viernes=5), fecha real `new Date()`, diaSemana calculado por getDay(). Textarea max 300 chars con contador warning@280. handleGuardar() 700ms → prepend reflexion {texto,dia,fecha} a reflexionesGuardadas (max 5 LIFO) → feedback "Reflexión guardada ✓" 3s. Toggle "Ver mis reflexiones" → lista últimas 5 en bg-background cards. reflexionHoy/reflexionesGuardadas/guardandoReflexion/reflexionGuardada/showReflexiones states declarados al inicio del componente. Sin nuevos imports.
- **StudentQCoins**: S24 añade evolucionMensual (const módulo, 6 meses) + transaccionesPendientes (2 entradas mock) + filtroTx state (type local "todo"|"ganadas"|"gastadas"|"pendientes"). Panel derecho: gráfico barras CSS side-by-side (sidebar/urgent) + badge "Racha gasto inteligente" (bg-sidebar, activo si ratio < 50% × 3 meses) + historial con filtros 4 pills. Imports añadidos: BarChart3, Filter, Award. S31 añade Categoria type extendido con "Experiencias", interfaces Experiencia/Reserva a nivel módulo. saldoActual state (inicializado a currentStudent.qcoins) declarado junto a otros Mercado states al inicio del componente. experienciasData array de 4 items definido DENTRO del componente (usa lbl()). reservas/cancelando/reservandoId/confirmacionReserva/showMisReservas states. handleReservar(): verifica saldo, 1s delay, genera ticket QHM-{id}-{random}, deduce de saldoActual, prepend a reservas, confirmacion 5s. handleCancelar(): 800ms delay, remove + refund. Sección "Tienda de Experiencias" visible cuando catActiva==="Todo"||"Experiencias": grid 2 cols, placeholder imagen bg-sidebar/10, aforo con barra CSS, "Reservar plaza" btn. "Mis reservas" toggle colapsable. Confirmación toast success-light con ticket code. catColors/catLabels actualizados con "Experiencias". saldoDisponible ahora apunta a saldoActual. Imports añadidos: Building2, BookOpen, Briefcase, UserCheck, Ticket.
- **TeacherDashboard**: T22 añade proximasEntregas (const módulo, 5 entregas) + interface EntregaProxima + type EstadoEntrega + recordadas Set + recordandoId state + handleRecordar() (900ms). Panel "Próximas entregas" insertado entre urgencias (T10) y seguimiento individual: lista con badge días (urgent/warning/success), fondo row por estado, botón Recordar con Bell icon + feedback CheckCircle2. Imports añadidos: Bell, ClipboardList. T26 añade semanaExpanded/semanaResumen/generandoResumen/resumenCopiado states + handleGenerarResumen() (fetch narrativa) + handleCopiarResumen() (clipboard). Panel colapsable "Semana en números" como PRIMER elemento del main content (antes del hero): 5 stats con trend arrows, card AI narrativa, botones Generar+Compartir. Imports añadidos: ChevronDown, ChevronUp, Coins, Trophy, Copy.
- **API tutor-chat**: usa GoogleGenAI con `@google/genai`, modelo gemini-2.0-flash, GEMINI_API_KEY env var. Leer ruta ANTES de modificar. Ya tiene modo socrático activo.
- **TeacherDashboard**: usa `bg-[#4F8EF7]` (azul) para excelling — es el único color hardcoded fuera del design system. No romper ese patrón en Ciclo 5+, o reemplazar por `bg-accent` si queda bien visualmente.
- **StudentProfile**: C4 ya modificado (PerfilInteligencias). S28 añade useState + mentorMensaje/enviandoMentor/mentorEnviado/mentorFormOpen states + handlePedirConsejo(). Sección "Mi red de apoyo" insertada ANTES de "Competencias" (después de evidence portfolio): IIFE pattern, 3 mentor cards con avatar/rol/specialty badges/último mensaje/tiempo respuesta, form inline textarea + botones Enviar+Cancelar + feedback success-light. specialtyColors Record dentro del IIFE. Imports añadidos: useState, Clock, ChevronRight, CheckCircle2, Send, RefreshCw. Leer antes de editar en ciclos futuros.
- **DeepDive / TeacherChat**: TeacherChat auto-activa deepDiveMode tras 6 mensajes del alumno. El addon se añade al SYSTEM_PROMPT en la API. No duplicar lógica al modificar TeacherChat. C24 extiende el useEffect existente: computa deepDiveDepth (0-100) + extrae deepDiveHilos (last 3 AI sentences). Añade deepDiveSesiones (max 3, LIFO) + guardandoSesion/sessionGuardada/showSesiones states. Panel profundímetro + hilos + guardar sesión + colapsable sesiones insertados en el bloque deepDiveMode. Imports añadidos: BookOpen, ChevronDown, ChevronUp, Save, CheckCircle2. C28 añade tutoriaMode/tutoriaStep(0-3)/tutoriaTimers(number[])/tutoriaCompletados(Set<number>)/tutoriaSesiones(array)/guardandoTutoria/tutoriaGuardada/tutoriaTimerRunning states + tutoriaIntervalRef useRef (para cleanup interval). `agendaTutoria` array de 4 pasos definido DENTRO del componente (usa lbl()). Botón "TUTORÍA" (ClipboardList) en header del chat toggle. Panel tutoriaMode: progress bar 4 segs, 4 step cards con timer countdown/barra/pregunta clickable, checkbox circular, Iniciar/Pausar, handleGuardarTutoria() 1.2s delay + sesión en historial. Imports añadidos: ClipboardList, Timer, X.
- **TeacherCalendar**: T8 rewrote completely — vista semana/mes. T28 añade vista "trimestre" a VistaCalendario type. semanasTrimestrales (array 12 semanas generado en componente). getSemanaPorDia() helper. Panel "Duplicar semana" con selects origen/destino + handleDuplicarSemana() 900ms + chips copias. Grid 12×6 con dots de eventos por día, resaltado semanas especiales (S1 accent, S8 warning, S12 success). Imports añadidos: Copy, RefreshCw.
- **MercadoRealTime**: mercadoTendencias array definido en StudentDashboard.tsx (no en un archivo de datos separado).
- **TeacherAnalytics**: T23 añade riesgoBase (const módulo, 12 alumnos), computeScore(), nivelRiesgo(), microAccionPorNivel Record. State contactadosSemaforo: Set<string>. Panel "Semáforo de riesgo actualizado" antes de comparativa semanal: donut SVG 3 arcos + distribución 3 KPIs + lista ordenada por score con arrowTendencia + micro-acción + botón Contactar (solo Alto). Imports añadidos: ArrowUp, ArrowDown, Minus, ShieldAlert. T29 añade grupoComparativaVista/exportandoAnalisis/analisisExportado states. Panel "Comparativa entre grupos" al FINAL (después de sparklines). grupoA/grupoB arrays de 6 alumnos c/u con racha/entregasATiempo/riesgo. avgA_comps/avgB_comps calculados vía seededLevel(si,ci) / seededLevel(si+6,ci). Toggle vista competencia/indicador. Vista competencia: 8 barras LOMLOE side-by-side sidebar/accent-text + badge lidera. Vista indicador: 3 indicadores con 2 barras + badge. KPI summary grid 3 cols. handleExportar() → HTML Blob download. Imports añadidos: Download, Layers.
- **AdminDashboard**: el tab "Usuarios" existe pero es UI simplificada. A2 lo expande con tabla real. A24 añade alertasRevisadas/alertasIgnoradas (Set), solicitandoClarificacion (string|null), clarificacionEnviada (Set) states. Panel "Integridad académica" al final del tab Inspección (después de documentos): 5 alertas mock, 3 KPIs, barra similitud, avatares duales, 3 acciones por alerta. IIFE pattern dentro del tab inspection. Estados de control para UI reactiva. A26 añade docenteExpandido (string|null) + docenteReconocido (Set<string>) + reconociendoDocente (string|null) states + handleReconocerLogro() (900ms delay). Panel "Rendimiento docente" al FINAL del tab Métricas (IIFE): 3 KPIs + tabla 6 docentes con badge rendimiento (Destacado/En progreso/Apoyo), barra IA%, stars satisfacción, Ver detalle (expande últimos 3 feedbacks + IA favorita), Trophy Reconocer botón. Import añadido: Star. A29 añade riesgoInformeGenerado (boolean) + generandoRiesgoInforme (boolean) states. Panel "Mapa de riesgo de abandono" al FINAL del tab Métricas (IIFE, después de A26): alumnos array de 12 con engagement/progreso/riesgo. celdas array 9 entradas (3×3 grid). tipoBg/chipColor Records. Grid CSS 3 cols: fila alto/medio/bajo progreso, cada celda con chips alumno coloreados por cuadrante. Zona critica (bajo+bajo): border urgent + animate-pulse + etiqueta. Resumen urgent-light: lista criticos + 3 acciones. handleGenerarInforme() → HTML blob con tabla 12 alumnos + fecha. Sin nuevos imports (Download/RefreshCw/AlertTriangle/CheckCircle2 ya existían).
- **QHUMA Capital**: según QHUMA_Master_Document, inversión real de hasta €10.000. El panel A5 debe mostrar proyectos en distintas fases de evaluación (pitch → votación → aprobado → financiado).
- **Q-Coins**: canjeables por talleres, equipamiento maker studio, excursiones, prioridad Passion Workshop.
- Push siempre una vez al final del ciclo (no por sprint).
- Todo el texto en español. Solo colores del design system. Solo lucide-react para iconos. NUNCA shadow-lg/xl.
