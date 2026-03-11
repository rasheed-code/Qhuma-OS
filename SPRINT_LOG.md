# QHUMA OS — Sprint Log
> Este archivo es escrito por el agente al final de cada ciclo y leído al inicio del siguiente.
> NO editar manualmente.

---

## Estado actual
- **Último ciclo**: Manual (Session 0)
- **Fecha**: 2026-03-11

## Sprints completados

### [SPRINT-STUDENT][S1] EvidenceGallery ✅
- Componente: `src/components/EvidenceGallery.tsx`
- 12 evidencias mock del proyecto Airbnb Málaga
- Grid con thumbnails por tipo, badges estado LOMLOE, calificación 1-4
- Panel derecho: progreso circular, desglose por asignatura, próxima entrega
- Wireo: `StudentView` type añadido `"evidences"`, Sidebar nav, page.tsx
- Commit: `a5eae4f`

## Sprints pendientes (en orden de prioridad)

### STUDENT
- [ ] [S2] StudentAchievements — logros/badges con rareza y XP
- [ ] [S3] StreakCalendar — heatmap 30 días de actividad
- [ ] [S4] StudentPortfolio — portfolio personal exportable
- [ ] [S5] LevelUpModal — overlay celebración subida de nivel

### TEACHER
- [ ] [T1] TeacherAnalytics mejorado — heatmap competencias, barras CSS, alumnos en riesgo
- [ ] [T2] TeacherGradeBook — cuaderno notas spreadsheet LOMLOE 1-4
- [ ] [T3] TeacherProjectGenerator — formulario conectado a /api/generate-projects
- [ ] [T4] TeacherMessages — centro mensajes con plantillas rápidas
- [ ] [T5] ClassHealthWidget — anillo salud clase SVG, tendencia, acciones rápidas

### ADMIN (en orden, son dependientes)
- [ ] [A1] AdminDashboard — panel principal, Role type, RoleSelector, Sidebar, page.tsx
- [ ] [A2] AdminUserManagement — tabla usuarios, modal añadir, toggle activo
- [ ] [A3] AdminAIUsage — gráficas uso IA, coste €, heatmap por alumno
- [ ] [A4] AdminSchoolSettings — config colegio, LOMLOE checklist, calendario

## Próximo ciclo
Implementar en este orden: **S2 → T1 → A1 → T2**

## Notas técnicas
- `Role` type en `src/types/index.ts` — añadir `"admin"` cuando se implemente A1
- `AdminView` type necesario para A1 — crear en types/index.ts
- TeacherAnalytics ya existe como componente vacío — reemplazar contenido, no crear nuevo
- RoleSelector en `src/components/RoleSelector.tsx` — leer antes de modificar para A1
- Sidebar soporta roles student/parent/teacher — extender para admin en A1
- Push siempre al final del ciclo (1 push por ciclo, múltiples commits)
- Todos los textos en español
- Solo colores del design system — ver DESIGN_SYSTEM.md
