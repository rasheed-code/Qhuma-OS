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

- **Último ciclo**: Ciclo 1 parcial (interrumpido tras S2)
- **Fecha**: 2026-03-11

---

## Sprints completados

### [SPRINT-STUDENT][S1] EvidenceGallery ✅
- Archivo: `src/components/EvidenceGallery.tsx`
- 12 evidencias mock Airbnb Málaga, thumbnails por tipo, badges LOMLOE, calificación 1-4
- Panel derecho: progreso circular, desglose asignatura, próxima entrega
- Commit: `a5eae4f`

### [SPRINT-STUDENT][S2] StudentAchievements ✅
- Archivo: `src/components/StudentAchievements.tsx`
- 10 logros desbloqueados + 5 bloqueados con progreso visible
- Rareza: Común/Raro/Legendario con colores del design system
- Tipos: `StudentView += "achievements"`, `Role += "admin"` (prep A1)
- Commit: `8f9b553`

---

## Sprints pendientes — Ciclo 2 (implementar en este orden)

- [ ] [T1] TeacherAnalytics — reemplazar componente existente, todo en español
- [ ] [A1] AdminDashboard — panel admin completo con Role/AdminView/RoleSelector/Sidebar
- [ ] [T2] TeacherGradeBook — cuaderno notas LOMLOE 1-4 editable
- [ ] [S3] StreakCalendar — heatmap 30 días actividad

---

## Sprints pendientes — Ciclo 3

- [ ] [S4] StudentPortfolio — portfolio personal con Narrativa propia (culture.md Bloque 3)
- [ ] [S5] LevelUpModal — overlay celebración subida de nivel
- [ ] [T3] TeacherProjectGenerator — formulario + /api/generate-projects
- [ ] [T4] TeacherMessages — centro mensajes con plantillas rápidas

---

## Sprints pendientes — Ciclo 4 (integrar culture.md)

- [ ] [T5] ClassHealthWidget — anillo salud clase SVG en TeacherDashboard
- [ ] [C1] ModoSocratico — modificar /api/tutor-chat: primera respuesta = pregunta socrática, no respuesta directa. Registrar ratio pregunta/respuesta en datos del alumno.
- [ ] [C2] ErrorLog — sección "Mis errores" en StudentPortfolio: cada reenvío de evidencia genera mini-análisis IA ("¿Qué asumiste? ¿Dónde falló? ¿Qué cambiarías?")
- [ ] [C3] PitchLab — componente de práctica para Demo Day: el alumno ensaya con IA, recibe feedback sobre estructura/claridad/persuasión. Conectar con /api/tutor-chat con system prompt de coach.
- [ ] [C4] PerfilInteligencias — visualización del mapa de inteligencias en StudentProfile: 8 dimensiones construidas desde interacciones (simular con mock data + explicar metodología)
- [ ] [C5] CuerpoHerramienta — widget de descanso activo que aparece tras 90 min: micro-contenido sobre neurociencia del movimiento, temporizador de 10 min, botón de vuelta al trabajo

---

## Sprints pendientes — Ciclo 5 (Admin avanzado)

- [ ] [A2] AdminUserManagement — tabla usuarios, modal añadir, toggle activo/inactivo
- [ ] [A3] AdminAIUsage — gráficas uso IA, coste €, heatmap por alumno
- [ ] [A4] AdminSchoolSettings — config colegio, checklist 8 competencias LOMLOE, calendario
- [ ] [A5] QHUMACapital — panel de QHUMA Capital: proyectos en pitch, inversión solicitada, votación

---

## Notas técnicas (leer antes de cada ciclo)

- **Role type**: ya incluye `"admin"` (añadido en S2). AdminView type: aún no creado — crear en A1.
- **TeacherAnalytics**: componente existente en `src/components/TeacherAnalytics.tsx` — REEMPLAZAR contenido, no crear nuevo. Actualmente tiene texto en inglés y colores fuera del design system.
- **RoleSelector**: `src/components/RoleSelector.tsx` — añadir admin con icono `Shield` y label "Admin QHUMA"
- **Sidebar**: para admin, añadir `activeAdminView` prop + nav admin. Actualmente el roleInfo ya tiene `admin` (añadido en S2 fix).
- **page.tsx**: para admin, añadir `useState<AdminView>("overview")` + `<AdminDashboard />` cuando role="admin"
- **culture.md módulos**: no son páginas nuevas, son capas de comportamiento. Implementar como: modificaciones al chat API, secciones dentro de componentes existentes, o widgets contextuales.
- **Datos LOMLOE oficiales**: Real Decreto 217/2022 define las 8 competencias clave para ESO. Usar nomenclatura exacta del BOE cuando se muestren en UI formal (admin/informes).
- **QHUMA Capital**: proyectos reales con inversión hasta €10.000. En el dashboard docente puede aparecer como proyecto especial de Bachillerato.
- **Q-Coins**: según QHUMA_Master_Document, son canjeables por talleres exclusivos, equipamiento maker studio, excursiones, y prioridad en Passion Workshop.
- Push siempre una vez al final del ciclo (no por sprint).
- Todo el texto en español. Solo colores del design system. Solo lucide-react para iconos.
