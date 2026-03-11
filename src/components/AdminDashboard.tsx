"use client";

import { useState } from "react";
import {
  LayoutDashboard, Users, Bot, Building2, FileText, Shield,
  CheckCircle2, AlertTriangle, TrendingUp, Activity, Zap,
  Download, UserPlus, Bell, Send, ChevronDown, ArrowUp, ArrowDown,
  Server, Database, RefreshCw, Clock, Search, X, Landmark,
  Vote, Eye, Save, TrendingDown, Minus, Calendar, ClipboardCheck,
  Trophy, BarChart3, MessageSquare, Copy, Check, Coins, Sparkles, Target, Star, FolderOpen,
} from "lucide-react";
import { AdminView } from "@/types";
import { useLang } from "@/lib/i18n";

interface AdminDashboardProps {
  activeView: AdminView;
  onNavigate: (view: AdminView) => void;
}

type Colegio = "malaga" | "madrid";

const colegios = {
  malaga: {
    nombre: "QHUMA Málaga",
    alumnos: 312, docentes: 28, proyectos: 14, salud: 94,
    tendencia: "up" as const, clases: 18, nivel: "Primaria + ESO",
  },
  madrid: {
    nombre: "QHUMA Madrid",
    alumnos: 187, docentes: 19, proyectos: 8, salud: 88,
    tendencia: "up" as const, clases: 11, nivel: "ESO + Bachillerato",
  },
};

const actividadReciente = [
  { id: 1, tipo: "success", texto: "Daniel Torres alcanzó el nivel 5 — Arquitecto Digital", tiempo: "Hace 30 min", icon: Zap },
  { id: 2, tipo: "success", texto: "Sofía Martín entregó portfolio completo (16/16 evidencias)", tiempo: "Hace 1h", icon: CheckCircle2 },
  { id: 3, tipo: "info", texto: "IA generó 4 proyectos nuevos con Gemini 2.0 Flash", tiempo: "Hace 2h", icon: Bot },
  { id: 4, tipo: "warning", texto: "Pablo Ruiz requiere atención docente — sin actividad 3 días", tiempo: "Hace 3h", icon: AlertTriangle },
  { id: 5, tipo: "info", texto: "Sincronización LOMLOE completada — 8 competencias actualizadas", tiempo: "Hace 5h", icon: RefreshCw },
];

const estadoSistema = [
  { nombre: "Servidor IA (Gemini 2.0)", estado: "Operativo", detalle: "Respuesta media 1.2s", tipo: "success", icon: Server },
  { nombre: "Base de datos", estado: "Operativo", detalle: "Última copia hace 3h · 98 GB", tipo: "success", icon: Database },
  { nombre: "Sincronización LOMLOE", estado: "Actualizado", detalle: "Última sync hace 2h", tipo: "success", icon: RefreshCw },
  { nombre: "Alumnos sin actividad", estado: "3 alumnos", detalle: "Requieren seguimiento", tipo: "warning", icon: Users },
];

// A15 — Actividad docente hoy
const actividadDocente = [
  { id: 1, avatar: "AM", nombre: "Ana Martínez",  accion: "Actualizó notas LOMLOE — 1º ESO B (8 competencias)",  hora: "14:38", icon: ClipboardCheck, color: "bg-accent-light text-accent-text" },
  { id: 2, avatar: "CP", nombre: "Carlos Pérez",  accion: "Generó informe trimestral de Pablo Ruiz",              hora: "13:55", icon: FileText,      color: "bg-background text-text-muted border border-card-border" },
  { id: 3, avatar: "IM", nombre: "Isabel Mora",   accion: "Lanzó sesión PitchLab con 2º ESO — 18 participantes", hora: "11:20", icon: Zap,            color: "bg-success-light text-success" },
  { id: 4, avatar: "AM", nombre: "Ana Martínez",  accion: "Añadió comentario en portfolio de Sofía Martín",       hora: "10:47", icon: MessageSquare,  color: "bg-accent-light text-accent-text" },
  { id: 5, avatar: "CP", nombre: "Carlos Pérez",  accion: "Marcó hito completado: Demo Day — Lucas García",       hora: "09:31", icon: CheckCircle2,   color: "bg-success-light text-success" },
  { id: 6, avatar: "IM", nombre: "Isabel Mora",   accion: "Creó alerta de seguimiento para Tomás Herrera",        hora: "09:05", icon: AlertTriangle,  color: "bg-warning-light text-warning" },
];

// A17 — Notificaciones automáticas
const notificacionesAutomaticas = [
  {
    id: "na1",
    tipo: "alumno_inactivo",
    destinatario: "Pablo Ruiz",
    canal: "email",
    contacto: "pablo@qhuma.es",
    mensaje: "Pablo lleva 3 días sin acceder a la plataforma. Se recomienda seguimiento docente.",
    icon: AlertTriangle,
    color: "bg-warning-light text-text-primary",
    badgeColor: "bg-warning text-white",
  },
  {
    id: "na2",
    tipo: "hito_completado",
    destinatario: "Familia García (Lucas)",
    canal: "email",
    contacto: "maria@qhuma.es",
    mensaje: "Lucas ha completado el hito 'Modelo financiero' — +140 XP — Proyecto Airbnb Málaga.",
    icon: CheckCircle2,
    color: "bg-success-light text-success",
    badgeColor: "bg-success text-white",
  },
  {
    id: "na3",
    tipo: "inversor_aprueba",
    destinatario: "Sofía Martín",
    canal: "SMS",
    contacto: "+34 612 345 678",
    mensaje: "Tu proyecto 'Huerto Urbano Digital' ha recibido la aprobación del claustro inversor.",
    icon: Vote,
    color: "bg-accent-light text-accent-text",
    badgeColor: "bg-accent-text text-white",
  },
  {
    id: "na4",
    tipo: "informe_listo",
    destinatario: "Ana Martínez (Docente)",
    canal: "email",
    contacto: "ana@qhuma.es",
    mensaje: "El informe LOMLOE de 1º ESO — T2 está listo para descarga en el panel de Informes.",
    icon: FileText,
    color: "bg-background text-text-muted border border-card-border",
    badgeColor: "bg-background text-text-muted border border-card-border",
  },
  {
    id: "na5",
    tipo: "alumno_inactivo",
    destinatario: "Tomás Herrera",
    canal: "SMS",
    contacto: "+34 634 567 890",
    mensaje: "Tomás lleva 2 días sin actividad. Tiene una entrega pendiente para el viernes.",
    icon: AlertTriangle,
    color: "bg-urgent-light text-urgent",
    badgeColor: "bg-urgent text-white",
  },
];

const usuariosMock = [
  { id: "1",  nombre: "Lucas García",      email: "lucas@qhuma.es",      rol: "Alumno",  curso: "1º ESO",               activo: true  },
  { id: "2",  nombre: "Sofía Martín",      email: "sofia@qhuma.es",      rol: "Alumno",  curso: "1º ESO",               activo: true  },
  { id: "3",  nombre: "Pablo Ruiz",        email: "pablo@qhuma.es",      rol: "Alumno",  curso: "1º ESO",               activo: false },
  { id: "4",  nombre: "Ana Martínez",      email: "ana@qhuma.es",        rol: "Docente", curso: "Mentor 1º ESO",        activo: true  },
  { id: "5",  nombre: "Carlos Pérez",      email: "carlos@qhuma.es",     rol: "Docente", curso: "Mentor 2º ESO",        activo: true  },
  { id: "6",  nombre: "María García",      email: "maria@qhuma.es",      rol: "Familia", curso: "Familia Lucas",        activo: true  },
  { id: "7",  nombre: "Daniel Torres",     email: "daniel@qhuma.es",     rol: "Alumno",  curso: "1º ESO",               activo: true  },
  { id: "8",  nombre: "Carmen Vega",       email: "carmen@qhuma.es",     rol: "Alumno",  curso: "1º ESO",               activo: true  },
  { id: "9",  nombre: "Lucía Fernández",   email: "lucia@qhuma.es",      rol: "Alumno",  curso: "2º ESO",               activo: true  },
  { id: "10", nombre: "Tomás Herrera",     email: "tomas@qhuma.es",      rol: "Alumno",  curso: "2º ESO",               activo: false },
  { id: "11", nombre: "Isabel Mora",       email: "isabel@qhuma.es",     rol: "Docente", curso: "Mentor 2º ESO",        activo: true  },
  { id: "12", nombre: "Roberto Núñez",     email: "roberto@qhuma.es",    rol: "Admin",   curso: "Administrador",        activo: true  },
];

const usoIA = [
  { feature: "Tutor chat (MentorIA)", llamadas: 1847, coste: 18.47 },
  { feature: "Generador de proyectos", llamadas: 234, coste: 4.68 },
  { feature: "Informes LOMLOE", llamadas: 89, coste: 2.67 },
];

const heatmapAlumnos = [
  { nombre: "Lucas García",    rol: "Alumno",  semana: [12, 8, 15, 6, 10] },
  { nombre: "Sofía Martín",    rol: "Alumno",  semana: [14, 12, 9, 11, 8] },
  { nombre: "Daniel Torres",   rol: "Alumno",  semana: [11, 9, 13, 7, 12] },
  { nombre: "Carmen Vega",     rol: "Alumno",  semana: [8, 7, 10, 9, 6] },
  { nombre: "Lucía Fernández", rol: "Alumno",  semana: [5, 8, 7, 9, 11] },
  { nombre: "Pablo Ruiz",      rol: "Alumno",  semana: [0, 2, 0, 1, 0] },
  { nombre: "Tomás Herrera",   rol: "Alumno",  semana: [1, 0, 2, 0, 1] },
  { nombre: "Ana Martínez",    rol: "Docente", semana: [4, 6, 5, 8, 3] },
  { nombre: "Carlos Pérez",    rol: "Docente", semana: [3, 5, 4, 6, 2] },
  { nombre: "Isabel Mora",     rol: "Docente", semana: [5, 4, 6, 5, 4] },
  { nombre: "María García",    rol: "Familia", semana: [2, 1, 3, 2, 1] },
  { nombre: "Roberto Núñez",   rol: "Admin",   semana: [6, 8, 7, 9, 5] },
];

const comparativaSemanal = [
  { semana: "Sem 1 Feb", llamadas: 487, coste: 6.12 },
  { semana: "Sem 2 Feb", llamadas: 612, coste: 7.68 },
  { semana: "Sem 3 Feb", llamadas: 534, coste: 6.71 },
  { semana: "Sem 1 Mar (actual)", llamadas: 537, coste: 6.74 },
];

const escalasLOMLOE = [
  { nivel: 1, etiqueta: "Inicio",               desc: "El alumno necesita apoyo para lograr los aprendizajes esperados",               bg: "bg-urgent-light",  text: "text-urgent" },
  { nivel: 2, etiqueta: "En proceso",            desc: "El alumno avanza hacia los aprendizajes esperados con apoyo",                  bg: "bg-warning-light", text: "text-warning" },
  { nivel: 3, etiqueta: "Logro esperado",        desc: "El alumno alcanza los aprendizajes esperados de forma autónoma",               bg: "bg-accent-light",  text: "text-accent-text" },
  { nivel: 4, etiqueta: "Logro sobresaliente",   desc: "El alumno supera los aprendizajes esperados y los aplica en nuevos contextos", bg: "bg-success-light", text: "text-success" },
];

const trimestres = [
  { nombre: "1er Trimestre", inicio: "9 sep 2025", fin: "19 dic 2025", semanas: 15, estado: "completado" as const },
  { nombre: "2º Trimestre",  inicio: "12 ene 2026", fin: "27 mar 2026", semanas: 11, estado: "activo"     as const },
  { nombre: "3er Trimestre", inicio: "22 abr 2026", fin: "22 jun 2026", semanas: 9,  estado: "próximo"    as const },
];

const competenciasLOMLOE = [
  { key: "CLC", nombre: "Comunicación Lingüística", activa: true },
  { key: "CPL", nombre: "Plurilingüe", activa: true },
  { key: "STEM", nombre: "STEM", activa: true },
  { key: "CD", nombre: "Digital", activa: true },
  { key: "CPSAA", nombre: "Personal, Social y Aprender a Aprender", activa: true },
  { key: "CC", nombre: "Ciudadana", activa: true },
  { key: "CE", nombre: "Emprendedora", activa: true },
  { key: "CCEC", nombre: "Conciencia y Expresión Culturales", activa: true },
];

const qhumaCapitalProyectos = [
  {
    id: "1", alumno: "Lucas García", clase: "1º ESO",
    nombre: "El Airbnb de Lucas — Málaga",
    descripcion: "Plataforma de alquiler turístico en Málaga para financiar experiencias educativas locales",
    inversion: 8500, fase: "votación" as const, votos: 7, votosMax: 12,
  },
  {
    id: "2", alumno: "Sofía Martín", clase: "1º ESO",
    nombre: "Huerto Urbano Digital",
    descripcion: "Sistema IoT para gestión de huertos urbanos con app de seguimiento y sostenibilidad",
    inversion: 3200, fase: "aprobado" as const, votos: 11, votosMax: 12,
  },
  {
    id: "3", alumno: "Daniel Torres", clase: "1º ESO",
    nombre: "Podcast Escolar — Historias de Barrio",
    descripcion: "Serie de podcasts que explora la historia del barrio con entrevistas a vecinos",
    inversion: 1800, fase: "pitch" as const, votos: 0, votosMax: 12,
  },
  {
    id: "4", alumno: "Carmen Vega", clase: "1º ESO",
    nombre: "App de Intercambio Estudiantil",
    descripcion: "Plataforma peer-to-peer para intercambio de materiales y servicios entre estudiantes",
    inversion: 5000, fase: "financiado" as const, votos: 12, votosMax: 12,
  },
  {
    id: "5", alumno: "Lucía Fernández", clase: "2º ESO",
    nombre: "Estudio de Animación DIY",
    descripcion: "Miniestudio de stop-motion y animación 2D para producir contenido educativo",
    inversion: 2400, fase: "pitch" as const, votos: 0, votosMax: 12,
  },
];

const faseConfig = {
  pitch:      { label: "Pitch",     color: "bg-background text-text-secondary border border-card-border" },
  votación:   { label: "Votación",  color: "bg-warning-light text-warning" },
  aprobado:   { label: "Aprobado",  color: "bg-accent-light text-accent-text" },
  financiado: { label: "Financiado", color: "bg-success-light text-success" },
};

export default function AdminDashboard({ activeView, onNavigate }: AdminDashboardProps) {
  const { lang } = useLang();
  const lbl = (es: string, en: string) => lang === "es" ? es : en;

  const [colegioActivo, setColegioActivo] = useState<Colegio>("malaga");
  const [showColegioMenu, setShowColegioMenu] = useState(false);
  const colegio = colegios[colegioActivo];

  // A12 — Salud sistema IA state
  const [showIALogs, setShowIALogs] = useState(false);

  // A24 — Integridad académica
  const [alertasRevisadas, setAlertasRevisadas] = useState<Set<string>>(new Set());
  const [alertasIgnoradas, setAlertasIgnoradas] = useState<Set<string>>(new Set());
  const [solicitandoClarificacion, setSolicitandoClarificacion] = useState<string | null>(null);
  const [clarificacionEnviada, setClarificacionEnviada] = useState<Set<string>>(new Set());

  // A13 — Metrics vista toggle
  const [metricsVista, setMetricsVista] = useState<"semana" | "mes">("semana");

  // A18 — Comparativa colegios extended
  const [comparativaMetrica, setComparativaMetrica] = useState<"retencion" | "engagement" | "evidencias" | "lomloe">("engagement");

  // A19 — Exportar informe comparativo
  const [exportandoComparativa, setExportandoComparativa] = useState(false);
  const [comparativaExportada, setComparativaExportada] = useState(false);
  const [copiandoResumen, setCopiandoResumen] = useState(false);
  const [resumenCopiado, setResumenCopiado] = useState(false);

  // A16 — Top competencias por clase
  const [compClaseVista, setCompClaseVista] = useState<"1eso" | "2eso">("1eso");

  // A23 — Análisis por franja horaria
  const [franjaVista, setFranjaVista] = useState<"semana" | "media">("semana");
  const [mantenimientoSlot, setMantenimientoSlot] = useState<string | null>(null);
  const [mantenimientoGuardado, setMantenimientoGuardado] = useState<string | null>(null);

  // A27 — Configuración de alertas automáticas
  const [alertasConfig, setAlertasConfig] = useState<Record<string, boolean>>({
    inactividad3dias: true,
    notaBaja: true,
    evidenciaVencida: false,
    qcoinsBajo: true,
    ratioCompletado: false,
    streakRota: false,
  });
  const [alertasFrecuencia, setAlertasFrecuencia] = useState<Record<string, string>>({
    inactividad3dias: "inmediata",
    notaBaja: "diaria",
    evidenciaVencida: "inmediata",
    qcoinsBajo: "semanal",
    ratioCompletado: "diaria",
    streakRota: "inmediata",
  });
  const [probandoAlerta, setProbandoAlerta] = useState<string | null>(null);
  const [alertaProbada, setAlertaProbada] = useState<Set<string>>(new Set());

  // A2 — Users management state
  const [userSearch, setUserSearch] = useState("");
  const [userFilterRol, setUserFilterRol] = useState("Todos");
  const [userFilterEstado, setUserFilterEstado] = useState("Todos");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({ nombre: "", email: "", rol: "Alumno", curso: "" });

  // A4 — School settings state
  const [compActivas, setCompActivas] = useState<Record<string, boolean>>(
    Object.fromEntries(competenciasLOMLOE.map((c) => [c.key, c.activa]))
  );
  const [schoolForm, setSchoolForm] = useState({
    nombre: "QHUMA Málaga", director: "Roberto Sánchez",
    email: "direccion@qhuma-malaga.es", nivel: "Primaria + ESO",
    direccion: "Calle Larios 12, 29005 Málaga",
  });

  // A6/A11 — Reports generator state
  const reportAlumnos = usuariosMock.filter((u) => u.rol === "Alumno");
  const [reportAlumno, setReportAlumno] = useState(reportAlumnos[0]?.nombre ?? "");
  const [reportTrimestre, setReportTrimestre] = useState<"1" | "2" | "3">("2");
  const [reportTipo, setReportTipo] = useState<"individual" | "grupo" | "lomloe" | "inspeccion" | "familia">("individual");
  const [reportPreview, setReportPreview] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadedFilename, setDownloadedFilename] = useState<string | null>(null);

  const plantillasPredefinidas = [
    {
      id: "lomloe",
      label: "LOMLOE Completo",
      descripcion: "8 competencias clave + escala de progreso + evidencias",
      tipo: "lomloe" as const,
      icon: "📋",
    },
    {
      id: "inspeccion",
      label: "Inspección",
      descripcion: "Checklist normativo RD 217/2022 + indicadores de cumplimiento",
      tipo: "inspeccion" as const,
      icon: "🔍",
    },
    {
      id: "familia",
      label: "Informe Familia",
      descripcion: "Resumen de progreso en lenguaje cercano para tutores legales",
      tipo: "familia" as const,
      icon: "👨‍👩‍👦",
    },
  ];

  const handleGenerarInforme = () => {
    setIsGenerating(true);
    setReportPreview(false);
    setDownloadedFilename(null);
    setTimeout(() => { setIsGenerating(false); setReportPreview(true); }, 1400);
  };
  const handleDescargar = () => {
    setIsDownloading(true);
    const alumnoSlug = reportAlumno.toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const fechaStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const filename = `informe_${alumnoSlug}_T${reportTrimestre}_${reportTipo}_${fechaStr}.pdf`;
    setDownloadedFilename(filename);
    setTimeout(() => setIsDownloading(false), 1200);
  };

  const trimestreLabel: Record<string, string> = { "1": "1er Trimestre 2025-26", "2": "2º Trimestre 2025-26", "3": "3er Trimestre 2025-26" };
  const tipoLabel: Record<string, string> = { individual: "Individual", grupo: "Grupo", lomloe: "LOMLOE Completo", inspeccion: "Inspección", familia: "Informe Familia" };

  // A25 — Proyectos en segunda ronda
  const [expedienteExpandido, setExpedienteExpandido] = useState<string | null>(null);
  const [reunionSolicitada, setReunionSolicitada] = useState<Set<string>>(new Set());
  const [fechaReunion, setFechaReunion] = useState<Record<string, string>>({});

  // A9 — Capital deep state
  const [votosEnVivo, setVotosEnVivo] = useState(7); // proyecto "Airbnb de Lucas"
  const [votandoId, setVotandoId] = useState<string | null>(null);
  const [cartaProyectoId, setCartaProyectoId] = useState("2"); // Huerto Urbano aprobado
  const [generandoCarta, setGenerandoCarta] = useState(false);
  const [cartaGenerada, setCartaGenerada] = useState(false);

  const handleEmitirVoto = (proyId: string) => {
    if (votandoId) return;
    setVotandoId(proyId);
    setTimeout(() => {
      setVotosEnVivo((v) => Math.min(12, v + 1));
      setVotandoId(null);
    }, 800);
  };

  const handleGenerarCarta = () => {
    setGenerandoCarta(true);
    setCartaGenerada(false);
    setTimeout(() => { setGenerandoCarta(false); setCartaGenerada(true); }, 1600);
  };

  // A15 — Actividad docente hoy
  const [showTodasActividades, setShowTodasActividades] = useState(false);

  // A17 — Notificaciones automáticas
  const [notificacionesEnviadas, setNotificacionesEnviadas] = useState<Set<string>>(new Set());
  const [notificandoId, setNotificandoId] = useState<string | null>(null);
  const handleEnviarNotificacion = (id: string) => {
    if (notificandoId || notificacionesEnviadas.has(id)) return;
    setNotificandoId(id);
    setTimeout(() => {
      setNotificacionesEnviadas((prev) => new Set(prev).add(id));
      setNotificandoId(null);
    }, 900);
  };

  // A14 — Próxima reunión agenda
  const [agendaGenerada, setAgendaGenerada] = useState(false);
  const [generandoAgenda, setGenerandoAgenda] = useState(false);
  const handleGenerarAgenda = () => {
    setGenerandoAgenda(true);
    setAgendaGenerada(false);
    setTimeout(() => { setGenerandoAgenda(false); setAgendaGenerada(true); }, 1200);
  };

  // A21 — Bienestar docente
  const [bienestarEncuestaEnviada, setBienestarEncuestaEnviada] = useState(false);
  const [bienestarRespuestas, setBienestarRespuestas] = useState<Record<string, number>>({});
  const [bienestarEnviando, setBienestarEnviando] = useState(false);

  // A22 — Gestión Q-Coins sistema
  const [showEmitirQCoins, setShowEmitirQCoins] = useState(false);
  const [emitirMotivo, setEmitirMotivo] = useState("");
  const [emitirCantidad, setEmitirCantidad] = useState("");
  const [emitirDestinatario, setEmitirDestinatario] = useState("todos");
  const [emitiendo, setEmitiendo] = useState(false);
  const [emitido, setEmitido] = useState(false);

  const handleEmitirQCoins = () => {
    if (!emitirMotivo.trim() || !emitirCantidad.trim()) return;
    setEmitiendo(true);
    setTimeout(() => {
      setEmitiendo(false);
      setEmitido(true);
      setEmitirMotivo("");
      setEmitirCantidad("");
      setTimeout(() => { setEmitido(false); setShowEmitirQCoins(false); }, 2500);
    }, 1400);
  };

  // A20 — Centro de comunicación
  const [comunicadoDestinatario, setComunicadoDestinatario] = useState<"todos" | "docentes" | "familias" | "alumnos">("todos");
  const [comunicadoAsunto, setComunicadoAsunto] = useState("");
  const [comunicadoCuerpo, setComunicadoCuerpo] = useState("");
  const [comunicadoEnviando, setComunicadoEnviando] = useState(false);
  const [comunicadoEnviado, setComunicadoEnviado] = useState(false);
  const [historialComunicados, setHistorialComunicados] = useState([
    { id: "c1", asunto: "Demo Day viernes 13 marzo — confirmación asistencia", destinatario: "todos", hora: "Ayer · 16:42", destinatarios: 24 },
    { id: "c2", asunto: "Informe LOMLOE T2 disponible para descarga", destinatario: "docentes", hora: "Hace 2 días · 10:15", destinatarios: 3 },
    { id: "c3", asunto: "Felicidades — Daniel Torres alcanza Nivel 5 Arquitecto", destinatario: "familias", hora: "Hace 3 días · 09:30", destinatarios: 12 },
    { id: "c4", asunto: "Recordatorio: entrega de evidencias antes del viernes", destinatario: "alumnos", hora: "Hace 4 días · 15:00", destinatarios: 12 },
    { id: "c5", asunto: "Reunión de claustro — martes 17 marzo 14:00", destinatario: "docentes", hora: "Hace 5 días · 11:20", destinatarios: 3 },
  ]);
  const plantillasComunicado = [
    { id: "p1", label: "Recordatorio entrega", asunto: "Recordatorio: entrega de evidencias — semana en curso", cuerpo: "Hola,\n\nOs recordamos que la entrega de evidencias de la semana en curso cierra el próximo viernes a las 23:59.\n\nRevisad el tablero de proyectos en QHUMA OS para confirmar el estado de cada tarea.\n\nUn saludo,\nEquipo QHUMA Málaga" },
    { id: "p2", label: "Invitación Demo Day", asunto: "Estáis invitados al Demo Day de 1º ESO — ¡Este viernes!", cuerpo: "Hola,\n\nTenemos el placer de invitaros al Demo Day de los proyectos de 1º ESO, donde nuestros alumnos presentarán sus proyectos ante inversores.\n\nFecha: viernes 13 de marzo · 16:00\nLugar: Sala de usos múltiples QHUMA Málaga\n\n¡Os esperamos!\nEquipo QHUMA Málaga" },
    { id: "p3", label: "Aviso incidencia", asunto: "Comunicado de servicio: incidencia técnica resuelta", cuerpo: "Hola,\n\nOs informamos de que la incidencia técnica detectada esta mañana en la plataforma QHUMA OS ha sido resuelta satisfactoriamente. Todos los servicios funcionan con normalidad.\n\nDisculpad las molestias.\nEquipo técnico QHUMA" },
  ];
  // A29 — Mapa de riesgo de abandono
  const [riesgoInformeGenerado, setRiesgoInformeGenerado] = useState(false);
  const [generandoRiesgoInforme, setGenerandoRiesgoInforme] = useState(false);

  // A26 — Rendimiento docente
  const [docenteExpandido, setDocenteExpandido] = useState<string | null>(null);
  const [docenteReconocido, setDocenteReconocido] = useState<Set<string>>(new Set());
  const [reconociendoDocente, setReconociendoDocente] = useState<string | null>(null);

  const handleReconocerLogro = (docenteId: string) => {
    if (reconociendoDocente || docenteReconocido.has(docenteId)) return;
    setReconociendoDocente(docenteId);
    setTimeout(() => {
      setDocenteReconocido((prev) => new Set([...prev, docenteId]));
      setReconociendoDocente(null);
    }, 900);
  };

  // A28 — Licencias y facturación
  const [licenciaExpanded, setLicenciaExpanded] = useState(false);
  const [ampliacionSolicitada, setAmpliacionSolicitada] = useState(false);
  const [ampliacionSeats, setAmpliacionSeats] = useState(750);
  const [solicitandoAmpliacion, setSolicitandoAmpliacion] = useState(false);
  const [descargandoFactura, setDescargandoFactura] = useState<string | null>(null);

  const handleSolicitarAmpliacion = () => {
    if (solicitandoAmpliacion) return;
    setSolicitandoAmpliacion(true);
    setTimeout(() => {
      setSolicitandoAmpliacion(false);
      setAmpliacionSolicitada(true);
    }, 1500);
  };

  const handleDescargarFactura = (facturaId: string, filename: string) => {
    if (descargandoFactura) return;
    setDescargandoFactura(facturaId);
    setTimeout(() => {
      const content = `FACTURA QHUMA PROFESSIONAL\n\nRef: ${facturaId}\nFecha: ${filename}\nImporte: Ver detalle abajo\n\nQHUMA Education S.L.\nCIF: B12345678\nCalle Larios 12, 29005 Málaga\n\nConcepto: Licencia QHUMA Professional — 500 alumnos\n`;
      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${filename}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      setDescargandoFactura(null);
    }, 800);
  };

  const handleEnviarComunicado = () => {
    if (!comunicadoAsunto.trim() || !comunicadoCuerpo.trim()) return;
    setComunicadoEnviando(true);
    setTimeout(() => {
      const destinatariosCount = comunicadoDestinatario === "todos" ? 24 : comunicadoDestinatario === "docentes" ? 3 : comunicadoDestinatario === "familias" ? 12 : 12;
      setHistorialComunicados((prev) => [{
        id: `c${Date.now()}`,
        asunto: comunicadoAsunto,
        destinatario: comunicadoDestinatario,
        hora: "Ahora · " + new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
        destinatarios: destinatariosCount,
      }, ...prev].slice(0, 5));
      setComunicadoEnviando(false);
      setComunicadoEnviado(true);
      setComunicadoAsunto("");
      setComunicadoCuerpo("");
      setTimeout(() => setComunicadoEnviado(false), 3000);
    }, 1400);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield size={18} className="text-accent-text" />
            <h1 className="text-[22px] font-bold text-text-primary">{lbl("Panel de Administración", "Administration Panel")}</h1>
          </div>
          <p className="text-[13px] text-text-secondary">{lbl("QHUMA OS · Sistema educativo con IA · España", "QHUMA OS · AI-powered education system · Spain")}</p>
        </div>
        {/* Selector de colegio */}
        <div className="relative">
          <button
            onClick={() => setShowColegioMenu(!showColegioMenu)}
            className="flex items-center gap-2 bg-background px-4 py-2.5 rounded-xl border border-card-border hover:border-accent-text/30 transition-all cursor-pointer"
          >
            <Building2 size={14} className="text-accent-text" />
            <span className="text-[13px] font-medium text-text-primary">{colegio.nombre}</span>
            <ChevronDown size={13} className="text-text-muted" />
          </button>
          {showColegioMenu && (
            <div className="absolute right-0 top-full mt-1 bg-card border border-card-border rounded-xl shadow-sm overflow-hidden z-10 w-48">
              {(Object.keys(colegios) as Colegio[]).map((key) => (
                <button
                  key={key}
                  onClick={() => { setColegioActivo(key); setShowColegioMenu(false); }}
                  className={`w-full text-left px-4 py-2.5 text-[12px] flex items-center gap-2 transition-colors cursor-pointer ${
                    colegioActivo === key ? "bg-accent-light text-accent-text font-semibold" : "text-text-secondary hover:bg-background"
                  }`}
                >
                  <Building2 size={12} />
                  {colegios[key].nombre}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tabs de navegación */}
      <div className="flex gap-1 bg-background rounded-xl p-1 mb-5">
        {([
          { key: "overview" as AdminView, label: lbl("Resumen", "Overview"),      icon: LayoutDashboard },
          { key: "users"    as AdminView, label: lbl("Usuarios", "Users"),        icon: Users },
          { key: "capital"  as AdminView, label: lbl("Capital", "Capital"),       icon: Landmark },
          { key: "ai"       as AdminView, label: lbl("IA", "AI"),                 icon: Bot },
          { key: "schools"  as AdminView, label: lbl("Colegios", "Schools"),      icon: Building2 },
          { key: "reports"  as AdminView, label: lbl("Informes", "Reports"),      icon: FileText },
          { key: "inspection" as AdminView, label: lbl("Inspección", "Inspection"), icon: ClipboardCheck },
        ]).map((tab) => (
          <button
            key={tab.key}
            onClick={() => onNavigate(tab.key)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
              activeView === tab.key
                ? "bg-card text-text-primary shadow-sm"
                : "text-text-muted hover:text-text-secondary"
            }`}
          >
            <tab.icon size={12} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ─── TAB: RESUMEN ─── */}
      {activeView === "overview" && (
        <div className="flex gap-5">
          <div className="flex-1 min-w-0 space-y-5">
            {/* Salud del sistema */}
            <div className="bg-sidebar rounded-2xl p-5 flex items-center gap-6">
              <div className="relative w-20 h-20 flex-shrink-0">
                <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
                  <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                  <circle cx="40" cy="40" r="32" fill="none" stroke="#c3f499" strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 32 * (colegio.salud / 100)} ${2 * Math.PI * 32}`} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[20px] font-bold text-white">{colegio.salud}</span>
                  <span className="text-[9px] text-white/40">/100</span>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-[11px] text-white/50 mb-0.5">{lbl("Salud de la plataforma", "Platform health")}</p>
                <p className="text-[18px] font-bold text-white mb-1">{colegio.nombre}</p>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <ArrowUp size={11} className="text-accent" />
                    <span className="text-[10px] text-accent">{lbl("Mejorando esta semana", "Improving this week")}</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 flex-shrink-0">
                {[
                  { label: lbl("Alumnos", "Students"), val: colegio.alumnos },
                  { label: lbl("Docentes", "Teachers"), val: colegio.docentes },
                  { label: lbl("Proyectos", "Projects"), val: colegio.proyectos },
                  { label: lbl("Clases", "Classes"), val: colegio.clases },
                ].map((s) => (
                  <div key={s.label} className="bg-white/8 rounded-xl px-3 py-2 text-center">
                    <span className="text-[16px] font-bold text-white block">{s.val}</span>
                    <span className="text-[9px] text-white/40">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Estado del sistema */}
            <div className="bg-card rounded-2xl border border-card-border p-5">
              <div className="flex items-center gap-2 mb-4">
                <Activity size={14} className="text-text-primary" />
                <h3 className="text-[14px] font-semibold text-text-primary">{lbl("Estado del sistema", "System status")}</h3>
              </div>
              <div className="space-y-2.5">
                {estadoSistema.map((item) => (
                  <div key={item.nombre} className={`flex items-center gap-3 p-3 rounded-xl border ${
                    item.tipo === "success" ? "bg-success-light border-success/15" : "bg-warning-light border-warning/20"
                  }`}>
                    <item.icon size={15} className={item.tipo === "success" ? "text-success" : "text-text-primary"} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-semibold text-text-primary">{item.nombre}</p>
                      <p className="text-[10px] text-text-muted">{item.detalle}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.tipo === "success" ? "bg-success text-white" : "bg-warning text-white"
                    }`}>{item.estado}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* A12: Widget Salud del sistema IA */}
            {(() => {
              const iaLogs = [
                { timestamp: "11 mar, 14:23", tipo: "timeout", mensaje: "Request timeout — tutor-chat · alumno: Pablo Ruiz · 2.8s" },
                { timestamp: "11 mar, 12:01", tipo: "error",   mensaje: "Gemini 429 — Rate limit reached · retried OK" },
                { timestamp: "10 mar, 18:44", tipo: "timeout", mensaje: "Request timeout — generate-projects · 3.1s" },
                { timestamp: "10 mar, 11:20", tipo: "warning", mensaje: "Respuesta tardía — tutor-chat · 1.9s (umbral: 1.5s)" },
                { timestamp: "9 mar, 16:05",  tipo: "error",   mensaje: "API key inválida detectada — rotación automática OK" },
              ];
              return (
                <div className="bg-card rounded-2xl border border-card-border p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Bot size={14} className="text-accent-text" />
                      <h3 className="text-[14px] font-semibold text-text-primary">{lbl("Salud del sistema IA", "AI system health")}</h3>
                    </div>
                    <button
                      onClick={() => setShowIALogs(!showIALogs)}
                      className="flex items-center gap-1.5 text-[10px] font-semibold text-accent-text bg-accent-light px-2.5 py-1.5 rounded-xl cursor-pointer hover:bg-accent/30 transition-all"
                    >
                      <Eye size={11} />
                      {showIALogs ? lbl("Ocultar logs", "Hide logs") : lbl("Ver logs", "View logs")}
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {[
                      { label: lbl("Latencia media API", "Avg API latency"), valor: "1.2s", color: "text-text-primary", bg: "bg-background" },
                      { label: lbl("Tasa de error", "Error rate"),            valor: "0.3%", color: "text-success",      bg: "bg-background" },
                      { label: lbl("Tokens esta semana", "Tokens this week"), valor: "1.84M", color: "text-accent-text", bg: "bg-accent-light" },
                    ].map((kpi) => (
                      <div key={kpi.label} className={`${kpi.bg} rounded-xl p-3 text-center`}>
                        <span className={`text-[18px] font-bold ${kpi.color} block`}>{kpi.valor}</span>
                        <span className="text-[9px] text-text-muted">{kpi.label}</span>
                      </div>
                    ))}
                  </div>
                  {showIALogs && (
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-text-muted uppercase tracking-wide mb-2">{lbl("Últimos 5 eventos del sistema", "Last 5 system events")}</p>
                      {iaLogs.map((log, i) => (
                        <div key={i} className={`flex items-start gap-2 p-2.5 rounded-xl ${
                          log.tipo === "error" ? "bg-urgent-light" : log.tipo === "timeout" ? "bg-warning-light" : "bg-background"
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5 ${
                            log.tipo === "error" ? "bg-urgent" : log.tipo === "timeout" ? "bg-warning" : "bg-text-muted"
                          }`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] text-text-primary leading-snug">{log.mensaje}</p>
                            <span className="text-[9px] text-text-muted">{log.timestamp}</span>
                          </div>
                          <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 uppercase ${
                            log.tipo === "error" ? "bg-urgent text-white" : log.tipo === "timeout" ? "bg-warning text-white" : "bg-background text-text-muted border border-card-border"
                          }`}>{log.tipo}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Acciones rápidas */}
            <div className="bg-card rounded-2xl border border-card-border p-5">
              <div className="flex items-center gap-2 mb-4">
                <Zap size={14} className="text-accent-text" />
                <h3 className="text-[14px] font-semibold text-text-primary">{lbl("Acciones rápidas", "Quick actions")}</h3>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: lbl("Informe mensual", "Monthly report"), icon: FileText },
                  { label: lbl("Exportar LOMLOE", "Export LOMLOE"), icon: Download },
                  { label: lbl("Añadir usuario", "Add user"), icon: UserPlus },
                  { label: lbl("Notificaciones", "Notifications"), icon: Bell },
                ].map((a) => (
                  <button key={a.label} className="flex flex-col items-center gap-2 p-4 bg-background rounded-xl hover:bg-accent-light hover:border-accent-text/20 border border-transparent transition-all cursor-pointer">
                    <a.icon size={18} className="text-accent-text" />
                    <span className="text-[10px] font-medium text-text-secondary text-center leading-tight">{a.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* A10: Evolución mensual de alumnos activos (barras CSS) */}
            {(() => {
              const meses = [
                { mes: "Oct 25", alumnos: 241 },
                { mes: "Nov 25", alumnos: 267 },
                { mes: "Dic 25", alumnos: 259 },
                { mes: "Ene 26", alumnos: 288 },
                { mes: "Feb 26", alumnos: 302 },
                { mes: "Mar 26", alumnos: 312 },
              ];
              const maxAlumnos = Math.max(...meses.map(m => m.alumnos));
              return (
                <div className="bg-card rounded-2xl border border-card-border p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp size={14} className="text-success" />
                    <h3 className="text-[14px] font-semibold text-text-primary">{lbl("Alumnos activos — evolución mensual", "Active students — monthly trend")}</h3>
                    <span className="ml-auto text-[10px] text-success font-semibold bg-success-light px-2 py-0.5 rounded-full">+29% en 6 meses</span>
                  </div>
                  <div className="flex items-end gap-2 h-28">
                    {meses.map((m, i) => {
                      const isLast = i === meses.length - 1;
                      const pct = (m.alumnos / maxAlumnos) * 100;
                      return (
                        <div key={m.mes} className="flex-1 flex flex-col items-center gap-1">
                          <span className="text-[9px] font-bold text-accent-text">{m.alumnos}</span>
                          <div
                            className={`w-full rounded-t-lg transition-all duration-500 ${isLast ? "bg-accent-text" : "bg-accent-light border border-accent/30"}`}
                            style={{ height: `${pct}%`, minHeight: "6px" }}
                          />
                          <span className="text-[8px] text-text-muted text-center">{m.mes}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* A10: Top 3 proyectos por progreso */}
            <div className="bg-card rounded-2xl border border-card-border p-5">
              <div className="flex items-center gap-2 mb-4">
                <Trophy size={14} className="text-warning" />
                <h3 className="text-[14px] font-semibold text-text-primary">{lbl("Top 3 proyectos en progreso", "Top 3 projects in progress")}</h3>
              </div>
              <div className="space-y-3">
                {[
                  { pos: 1, alumno: "Carmen Vega",    proyecto: "App de Intercambio Estudiantil", progreso: 94, comp: "CE", avatar: "CV" },
                  { pos: 2, alumno: "Sofía Martín",   proyecto: "Huerto Urbano Digital",          progreso: 88, comp: "CD", avatar: "SM" },
                  { pos: 3, alumno: "Lucas García",   proyecto: "El Airbnb de Lucas",             progreso: 72, comp: "STEM", avatar: "LG" },
                ].map((p) => (
                  <div key={p.pos} className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                      p.pos === 1 ? "bg-warning text-white" : p.pos === 2 ? "bg-text-muted/30 text-text-muted" : "bg-background border border-card-border text-text-muted"
                    }`}>{p.pos}</div>
                    <div className="w-7 h-7 rounded-full bg-sidebar text-white text-[9px] font-bold flex items-center justify-center flex-shrink-0">{p.avatar}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-semibold text-text-primary truncate">{p.proyecto}</span>
                        <span className="text-[11px] font-bold text-accent-text ml-2 flex-shrink-0">{p.progreso}%</span>
                      </div>
                      <div className="h-1.5 bg-background rounded-full overflow-hidden">
                        <div className="h-full bg-accent-text rounded-full" style={{ width: `${p.progreso}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* A10: Mapa de calor de actividad por hora del día */}
            {(() => {
              const horas = ["8h", "9h", "10h", "11h", "12h", "13h", "14h", "15h", "16h", "17h", "18h", "19h", "20h"];
              const dias = ["L", "M", "X", "J", "V"];
              // Datos mock: actividad por día × hora (0-12 interacciones)
              const actividad: number[][] = [
                [2, 8, 11, 9, 7, 4, 1, 6, 8, 5, 2, 1, 0],
                [1, 7, 12, 10, 8, 5, 2, 7, 9, 6, 3, 1, 0],
                [3, 9, 11, 8, 6, 4, 1, 5, 7, 4, 2, 0, 0],
                [2, 6, 10, 9, 7, 5, 3, 8, 10, 7, 3, 1, 0],
                [4, 8, 9, 7, 5, 3, 0, 3, 5, 3, 1, 0, 0],
              ];
              const maxAct = 12;
              return (
                <div className="bg-card rounded-2xl border border-card-border p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <BarChart3 size={14} className="text-text-secondary" />
                    <h3 className="text-[14px] font-semibold text-text-primary">{lbl("Actividad por hora del día", "Activity by time of day")}</h3>
                    <span className="ml-auto text-[10px] text-text-muted bg-background px-2 py-0.5 rounded-full">{lbl("Lun–Vie · 8h–20h", "Mon–Fri · 8h–20h")}</span>
                  </div>
                  {/* Horas header */}
                  <div className="flex gap-1 mb-1 ml-4">
                    {horas.map((h) => (
                      <div key={h} className="flex-1 text-center text-[7px] text-text-muted">{h}</div>
                    ))}
                  </div>
                  {/* Grid */}
                  <div className="space-y-1">
                    {dias.map((dia, di) => (
                      <div key={dia} className="flex items-center gap-1">
                        <span className="text-[9px] font-bold text-text-muted w-4 flex-shrink-0">{dia}</span>
                        {actividad[di].map((val, hi) => {
                          const intensity = val / maxAct;
                          return (
                            <div
                              key={hi}
                              className="flex-1 h-5 rounded-sm"
                              style={{
                                backgroundColor: intensity < 0.1
                                  ? "#f4f0e9"
                                  : `rgba(31,81,76,${0.12 + intensity * 0.75})`,
                              }}
                              title={`${dia} ${horas[hi]}: ${val} interacciones`}
                            />
                          );
                        })}
                      </div>
                    ))}
                  </div>
                  {/* Leyenda */}
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-[9px] text-text-muted">{lbl("Menos", "Less")}</span>
                    {[0.1, 0.3, 0.5, 0.7, 0.9].map((op, i) => (
                      <div key={i} className="w-4 h-3 rounded-sm" style={{ backgroundColor: `rgba(31,81,76,${0.12 + op * 0.75})` }} />
                    ))}
                    <span className="text-[9px] text-text-muted">{lbl("Más", "More")}</span>
                  </div>
                </div>
              );
            })()}

            {/* A15: Widget Actividad docente hoy */}
            <div className="bg-card rounded-2xl border border-card-border p-5">
              <div className="flex items-center gap-2 mb-4">
                <Users size={14} className="text-accent-text" />
                <h3 className="text-[14px] font-semibold text-text-primary">{lbl("Actividad docente hoy", "Teacher activity today")}</h3>
                <span className="ml-auto text-[9px] font-bold bg-accent-light text-accent-text px-2 py-0.5 rounded-full">
                  {actividadDocente.length} {lbl("acciones", "actions")}
                </span>
              </div>
              <div className="space-y-3">
                {actividadDocente.slice(0, showTodasActividades ? 6 : 3).map((act) => {
                  const Icon = act.icon;
                  return (
                    <div key={act.id} className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-sidebar text-white text-[9px] font-bold flex items-center justify-center flex-shrink-0">
                        {act.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <span className="text-[11px] font-semibold text-text-primary">{act.nombre}</span>
                            <p className="text-[10px] text-text-secondary leading-snug mt-0.5">{act.accion}</p>
                          </div>
                          <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${act.color}`}>
                            <Icon size={11} />
                          </div>
                        </div>
                        <span className="text-[9px] text-text-muted mt-0.5 block">{act.hora}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <button
                onClick={() => setShowTodasActividades(!showTodasActividades)}
                className="w-full mt-3 flex items-center justify-center gap-1.5 text-[10px] font-semibold text-accent-text hover:underline cursor-pointer py-1"
              >
                <ChevronDown size={11} className={showTodasActividades ? "rotate-180" : ""} />
                {showTodasActividades ? lbl("Ver menos", "View less") : lbl("Ver todas (6)", "View all (6)")}
              </button>
            </div>

            {/* A17: Notificaciones automáticas */}
            <div className="bg-card rounded-2xl border border-card-border p-5">
              <div className="flex items-center gap-2 mb-4">
                <Bell size={14} className="text-accent-text" />
                <h3 className="text-[14px] font-semibold text-text-primary">{lbl("Notificaciones automáticas", "Automatic notifications")}</h3>
                <span className="ml-auto text-[9px] font-bold bg-warning-light text-warning px-2 py-0.5 rounded-full">
                  {notificacionesAutomaticas.length - notificacionesEnviadas.size} {lbl("pendientes", "pending")}
                </span>
              </div>
              <div className="space-y-3">
                {notificacionesAutomaticas.map((n) => {
                  const Icon = n.icon;
                  const enviada = notificacionesEnviadas.has(n.id);
                  const enviando = notificandoId === n.id;
                  return (
                    <div key={n.id} className={`rounded-xl border p-3 transition-all ${enviada ? "opacity-60" : n.color}`}>
                      <div className="flex items-start gap-2.5">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${enviada ? "bg-success-light" : n.color}`}>
                          {enviada ? (
                            <CheckCircle2 size={13} className="text-success" />
                          ) : (
                            <Icon size={13} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="text-[11px] font-semibold text-text-primary truncate">{n.destinatario}</span>
                            <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ${n.badgeColor}`}>
                              {n.canal}
                            </span>
                          </div>
                          <p className="text-[10px] text-text-secondary leading-snug">{n.mensaje}</p>
                          <p className="text-[9px] text-text-muted mt-0.5">{n.contacto}</p>
                        </div>
                      </div>
                      <div className="mt-2.5 flex justify-end">
                        {enviada ? (
                          <span className="text-[9px] font-bold text-success flex items-center gap-1">
                            <CheckCircle2 size={10} /> {lbl("Enviada", "Sent")}
                          </span>
                        ) : (
                          <button
                            onClick={() => handleEnviarNotificacion(n.id)}
                            disabled={!!notificandoId}
                            className="flex items-center gap-1.5 bg-sidebar text-white text-[10px] font-bold px-3 py-1.5 rounded-lg cursor-pointer hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {enviando ? (
                              <><RefreshCw size={10} className="animate-spin" />{lbl("Enviando...", "Sending...")}</>
                            ) : (
                              <><Send size={10} />{lbl("Enviar ahora", "Send now")}</>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* A20: Centro de comunicación */}
            {(() => {
              const destinatarioConfig: Record<string, { label: string; count: number; badge: string }> = {
                todos:    { label: "Todos (alumnos + docentes + familias)", count: 24, badge: "bg-sidebar text-white" },
                docentes: { label: "Solo docentes",                          count: 3,  badge: "bg-accent-text text-white" },
                familias: { label: "Solo familias",                           count: 12, badge: "bg-warning text-white" },
                alumnos:  { label: "Solo alumnos",                            count: 12, badge: "bg-success text-white" },
              };
              const cfg = destinatarioConfig[comunicadoDestinatario];
              return (
                <div className="bg-card rounded-2xl border border-card-border p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Send size={14} className="text-accent-text" />
                    <h3 className="text-[14px] font-semibold text-text-primary">{lbl("Centro de comunicación", "Communication center")}</h3>
                  </div>

                  {/* Selector de destinatarios */}
                  <div className="flex gap-1.5 mb-3 flex-wrap">
                    {(["todos", "docentes", "familias", "alumnos"] as const).map((d) => (
                      <button
                        key={d}
                        onClick={() => setComunicadoDestinatario(d)}
                        className={`text-[10px] font-semibold px-2.5 py-1.5 rounded-lg border cursor-pointer transition-all capitalize ${
                          comunicadoDestinatario === d
                            ? "bg-sidebar text-white border-sidebar"
                            : "bg-background text-text-muted border-card-border hover:text-text-secondary"
                        }`}
                      >
                        {d === "todos" ? lbl("Todos", "All") : d === "docentes" ? lbl("Docentes", "Teachers") : d === "familias" ? lbl("Familias", "Families") : lbl("Alumnos", "Students")}
                        <span className={`ml-1 text-[8px] px-1.5 py-0.5 rounded-full ${
                          comunicadoDestinatario === d ? "bg-white/20" : "bg-background"
                        }`}>
                          {destinatarioConfig[d].count}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Plantillas rápidas */}
                  <div className="flex gap-1.5 mb-3 flex-wrap">
                    <span className="text-[10px] text-text-muted self-center">{lbl("Plantilla:", "Template:")}</span>
                    {plantillasComunicado.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => { setComunicadoAsunto(p.asunto); setComunicadoCuerpo(p.cuerpo); }}
                        className="text-[9px] font-semibold px-2 py-1 rounded-lg bg-accent-light text-accent-text border border-accent/20 cursor-pointer hover:brightness-95 transition-all"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>

                  {/* Formulario */}
                  <div className="space-y-2.5">
                    <input
                      type="text"
                      placeholder={lbl("Asunto del comunicado...", "Subject...")}
                      value={comunicadoAsunto}
                      onChange={(e) => setComunicadoAsunto(e.target.value)}
                      className="w-full text-[11px] bg-background border border-card-border rounded-xl px-3 py-2 text-text-primary outline-none focus:border-accent-text/40 placeholder:text-text-muted"
                    />
                    <textarea
                      placeholder={lbl("Escribe el mensaje aquí...", "Write your message here...")}
                      value={comunicadoCuerpo}
                      onChange={(e) => setComunicadoCuerpo(e.target.value)}
                      className="w-full text-[11px] bg-background border border-card-border rounded-xl px-3 py-2 resize-none outline-none focus:border-accent-text/40 h-[80px] placeholder:text-text-muted text-text-primary"
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-text-muted">
                        {lbl("Para:", "To:")} <span className="font-semibold text-text-secondary">{cfg.count} destinatarios</span>
                      </span>
                      {comunicadoEnviado ? (
                        <span className="flex items-center gap-1.5 text-[11px] font-bold text-success">
                          <CheckCircle2 size={13} /> {lbl("¡Enviado correctamente!", "Sent successfully!")}
                        </span>
                      ) : (
                        <button
                          onClick={handleEnviarComunicado}
                          disabled={!comunicadoAsunto.trim() || !comunicadoCuerpo.trim() || comunicadoEnviando}
                          className="flex items-center gap-1.5 bg-sidebar text-white text-[11px] font-bold px-4 py-2 rounded-xl cursor-pointer hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {comunicadoEnviando
                            ? <><RefreshCw size={11} className="animate-spin" />{lbl("Enviando...", "Sending...")}</>
                            : <><Send size={11} />{lbl("Enviar comunicado", "Send message")}</>
                          }
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Historial de comunicados */}
                  <div className="mt-4 pt-4 border-t border-card-border">
                    <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wide mb-2">{lbl("Enviados recientes", "Recently sent")}</p>
                    <div className="space-y-2">
                      {historialComunicados.slice(0, 5).map((c) => (
                        <div key={c.id} className="flex items-start gap-2.5">
                          <div className={`text-[7px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 mt-0.5 ${
                            c.destinatario === "todos" ? "bg-sidebar text-white" :
                            c.destinatario === "docentes" ? "bg-accent-light text-accent-text" :
                            c.destinatario === "familias" ? "bg-warning-light text-text-primary" :
                            "bg-success-light text-success"
                          }`}>
                            {c.destinatario === "todos" ? "TOD" : c.destinatario === "docentes" ? "DOC" : c.destinatario === "familias" ? "FAM" : "ALU"}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-medium text-text-primary leading-snug truncate">{c.asunto}</p>
                            <span className="text-[9px] text-text-muted">{c.hora} · {c.destinatarios} {lbl("destinatarios", "recipients")}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}

          {/* A21: Bienestar docente */}
          {(() => {
            const docentesBienestar = [
              { avatar: "AM", nombre: "Ana Martínez",  carga: 87, sesiones: 14, alertas: 2, riesgo: "medio"   as const },
              { avatar: "CP", nombre: "Carlos Pérez",  carga: 62, sesiones: 9,  alertas: 0, riesgo: "bajo"    as const },
              { avatar: "IM", nombre: "Isabel Mora",   carga: 94, sesiones: 18, alertas: 4, riesgo: "alto"    as const },
            ];
            const preguntasEncuesta = [
              { id: "energia",     label: "Nivel de energía al final del día" },
              { id: "carga",       label: "Carga administrativa percibida" },
              { id: "satisfaccion",label: "Satisfacción con los resultados del grupo" },
              { id: "apoyo",       label: "Sensación de apoyo del equipo directivo" },
            ];
            const riesgoConfig = {
              bajo:  { label: "Bajo",  bg: "bg-success-light",  text: "text-success",     dot: "bg-success"  },
              medio: { label: "Medio", bg: "bg-warning-light",  text: "text-warning",     dot: "bg-warning"  },
              alto:  { label: "Alto",  bg: "bg-urgent-light",   text: "text-urgent",      dot: "bg-urgent"   },
            };
            const encuestaCompleta = preguntasEncuesta.every((p) => bienestarRespuestas[p.id] !== undefined);
            return (
              <div className="bg-card rounded-2xl border border-card-border p-5 mt-5">
                <div className="flex items-center gap-2 mb-4">
                  <Activity size={14} className="text-accent-text" />
                  <h3 className="text-[14px] font-semibold text-text-primary">{lbl("Bienestar docente", "Teacher wellbeing")}</h3>
                  <span className="ml-auto text-[10px] text-text-muted bg-background px-2 py-0.5 rounded-full">
                    {docentesBienestar.filter((d) => d.riesgo === "alto").length} {lbl("en riesgo de sobrecarga", "at overload risk")}
                  </span>
                </div>

                {/* Indicadores por docente */}
                <div className="space-y-3 mb-5">
                  {docentesBienestar.map((d) => {
                    const cfg = riesgoConfig[d.riesgo];
                    return (
                      <div key={d.avatar} className={`rounded-xl p-3 border ${cfg.bg} ${d.riesgo === "alto" ? "border-urgent/25" : d.riesgo === "medio" ? "border-warning/25" : "border-success/25"}`}>
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-sidebar text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                            {d.avatar}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-[12px] font-semibold text-text-primary">{d.nombre}</span>
                              <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${cfg.bg} ${cfg.text}`}>{lbl("Riesgo", "Risk")} {cfg.label}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-0.5">
                                  <span className="text-[9px] text-text-muted">{lbl("Carga semanal", "Weekly load")}</span>
                                  <span className={`text-[9px] font-bold ${cfg.text}`}>{d.carga}%</span>
                                </div>
                                <div className="h-1.5 bg-white/60 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full ${d.carga >= 90 ? "bg-urgent" : d.carga >= 75 ? "bg-warning" : "bg-success"}`}
                                    style={{ width: `${d.carga}%` }}
                                  />
                                </div>
                              </div>
                              <span className="text-[9px] text-text-muted flex-shrink-0">{d.sesiones} {lbl("sesiones/sem", "sessions/wk")}</span>
                              {d.alertas > 0 && (
                                <span className="flex items-center gap-1 text-[9px] font-bold bg-urgent text-white px-1.5 py-0.5 rounded-full flex-shrink-0">
                                  <AlertTriangle size={8} />
                                  {d.alertas}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        {d.riesgo === "alto" && (
                          <div className="mt-2 pl-10">
                            <p className="text-[10px] text-urgent leading-relaxed">
                              {lbl("Protocolo sugerido: reducir revisiones manuales esta semana. Activar generación automática de informes.", "Suggested protocol: reduce manual reviews this week. Enable automatic report generation.")}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Encuesta semanal de bienestar */}
                <div className="bg-background rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[11px] font-semibold text-text-primary">{lbl("Encuesta semanal — ¿Cómo está el equipo?", "Weekly survey — How is the team?")}</span>
                    {bienestarEncuestaEnviada && (
                      <span className="flex items-center gap-1 text-[9px] font-bold text-success ml-auto">
                        <CheckCircle2 size={10} /> {lbl("Enviada", "Submitted")}
                      </span>
                    )}
                  </div>
                  {bienestarEncuestaEnviada ? (
                    <div className="space-y-2">
                      {preguntasEncuesta.map((p) => (
                        <div key={p.id} className="flex items-center gap-3">
                          <span className="text-[10px] text-text-muted flex-1 truncate">{p.label}</span>
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((n) => (
                              <div key={n} className={`w-4 h-4 rounded-sm ${n <= (bienestarRespuestas[p.id] ?? 0) ? "bg-accent-text" : "bg-card border border-card-border"}`} />
                            ))}
                          </div>
                          <span className="text-[10px] font-bold text-text-primary w-4 text-right">{bienestarRespuestas[p.id] ?? "–"}</span>
                        </div>
                      ))}
                      <div className="mt-2 pt-2 border-t border-card-border">
                        <p className="text-[10px] text-text-muted">
                          {lbl("Media del equipo:", "Team average:")}
                          <span className="font-bold text-accent-text ml-1">
                            {(preguntasEncuesta.reduce((s, p) => s + (bienestarRespuestas[p.id] ?? 0), 0) / preguntasEncuesta.length).toFixed(1)} / 5
                          </span>
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {preguntasEncuesta.map((p) => (
                        <div key={p.id}>
                          <span className="text-[10px] text-text-secondary block mb-1">{p.label}</span>
                          <div className="flex gap-1.5">
                            {[1, 2, 3, 4, 5].map((n) => (
                              <button
                                key={n}
                                onClick={() => setBienestarRespuestas((prev) => ({ ...prev, [p.id]: n }))}
                                className={`w-8 h-8 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${
                                  bienestarRespuestas[p.id] === n
                                    ? "bg-sidebar text-white"
                                    : "bg-card border border-card-border text-text-muted hover:border-accent-text/40 hover:text-accent-text"
                                }`}
                              >
                                {n}
                              </button>
                            ))}
                            <span className="text-[9px] text-text-muted self-center ml-1">
                              {bienestarRespuestas[p.id] === 1 ? lbl("Muy bajo", "Very low") : bienestarRespuestas[p.id] === 5 ? lbl("Óptimo", "Optimal") : ""}
                            </span>
                          </div>
                        </div>
                      ))}
                      <div className="flex justify-end mt-1">
                        <button
                          disabled={!encuestaCompleta || bienestarEnviando}
                          onClick={() => {
                            if (!encuestaCompleta) return;
                            setBienestarEnviando(true);
                            setTimeout(() => { setBienestarEnviando(false); setBienestarEncuestaEnviada(true); }, 1200);
                          }}
                          className="flex items-center gap-1.5 bg-sidebar text-white text-[10px] font-bold px-4 py-2 rounded-xl cursor-pointer hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {bienestarEnviando
                            ? <><RefreshCw size={10} className="animate-spin" />{lbl("Enviando...", "Sending...")}</>
                            : <><Send size={10} />{lbl("Enviar encuesta", "Submit survey")}</>
                          }
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

          {/* A22: Gestión Q-Coins a nivel sistema */}
          {(() => {
            const qcoinsData = {
              totalCirculacion: 14820,
              emitidosEsteMes: 3240,
              canjeadosEsteMes: 1180,
              crecimientoSemana: 8.4,
            };
            const top5Alumnos = [
              { nombre: "Lucas García",     avatar: "LG", saldo: 980 },
              { nombre: "Sofía Torres",     avatar: "ST", saldo: 840 },
              { nombre: "Carmen Vega",      avatar: "CV", saldo: 760 },
              { nombre: "Diego López",      avatar: "DL", saldo: 640 },
              { nombre: "Ana Martín",       avatar: "AM", saldo: 520 },
            ];
            const top5Transacciones = [
              { alumno: "Carmen Vega",   motivo: "App de Intercambio Estudiantil — hito completado", cantidad: 200, fecha: "Hoy · 14:22", tipo: "ganada" as const },
              { alumno: "Lucas García",  motivo: "Canje: Taller de Fotografía Profesional",            cantidad: 120, fecha: "Hoy · 12:15", tipo: "canje"  as const },
              { alumno: "Sofía Torres",  motivo: "Demo Day — bonus presentación equipo",               cantidad: 150, fecha: "Ayer · 16:40", tipo: "ganada" as const },
              { alumno: "Diego López",   motivo: "Canje: Revenue Management avanzado",                 cantidad: 200, fecha: "Ayer · 11:05", tipo: "canje"  as const },
              { alumno: "Ana Martín",    motivo: "Deep Dive — Mentoría STEM 45 min ininterrumpidos",  cantidad: 80,  fecha: "Lun 9 mar",    tipo: "ganada" as const },
            ];
            return (
              <div className="bg-card rounded-2xl border border-card-border p-5 mt-5">
                <div className="flex items-center gap-2 mb-4">
                  <Coins size={15} className="text-accent-text" />
                  <h3 className="text-[14px] font-semibold text-text-primary">{lbl("Gestión Q-Coins — Sistema", "Q-Coins Management — System")}</h3>
                  <button
                    onClick={() => setShowEmitirQCoins(!showEmitirQCoins)}
                    className="ml-auto flex items-center gap-1.5 bg-accent text-sidebar text-[10px] font-bold px-3 py-1.5 rounded-xl cursor-pointer hover:brightness-110 transition-all"
                  >
                    <Sparkles size={11} />
                    {lbl("Emitir Q-Coins", "Issue Q-Coins")}
                  </button>
                </div>

                {/* KPIs */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {[
                    { label: lbl("Total en circulación", "Total in circulation"), valor: qcoinsData.totalCirculacion.toLocaleString("es-ES"), color: "text-sidebar", bg: "bg-sidebar", textAlt: "text-white", bgAlt: "bg-white/8", dark: true },
                    { label: lbl("Emitidos este mes", "Issued this month"),       valor: `+${qcoinsData.emitidosEsteMes.toLocaleString("es-ES")}`, color: "text-success", bg: "bg-success-light", dark: false },
                    { label: lbl("Canjeados este mes", "Redeemed this month"),    valor: `-${qcoinsData.canjeadosEsteMes.toLocaleString("es-ES")}`, color: "text-urgent", bg: "bg-urgent-light", dark: false },
                    { label: lbl("Crecimiento semana", "Weekly growth"),          valor: `+${qcoinsData.crecimientoSemana}%`, color: "text-accent-text", bg: "bg-accent-light", dark: false },
                  ].map((k) => (
                    <div key={k.label} className={`rounded-xl p-3 text-center ${k.dark ? "bg-sidebar" : k.bg}`}>
                      <span className={`text-[18px] font-bold block ${k.dark ? "text-accent" : k.color}`}>{k.valor}</span>
                      <span className={`text-[9px] ${k.dark ? "text-white/40" : "text-text-muted"}`}>{k.label}</span>
                    </div>
                  ))}
                </div>

                {/* Top 5 alumnos por saldo */}
                <div className="mb-4">
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-wide mb-2">{lbl("Top 5 alumnos por saldo", "Top 5 students by balance")}</p>
                  <div className="space-y-1.5">
                    {top5Alumnos.map((a, i) => {
                      const maxSaldo = top5Alumnos[0].saldo;
                      return (
                        <div key={a.nombre} className="flex items-center gap-2.5">
                          <span className="text-[9px] font-bold text-text-muted w-3">{i + 1}</span>
                          <div className="w-6 h-6 rounded-full bg-sidebar text-white text-[8px] font-bold flex items-center justify-center flex-shrink-0">
                            {a.avatar}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-0.5">
                              <span className="text-[10px] font-semibold text-text-primary truncate">{a.nombre}</span>
                              <div className="flex items-center gap-0.5 flex-shrink-0 ml-2">
                                <Coins size={9} className="text-accent-text" />
                                <span className="text-[10px] font-bold text-accent-text">{a.saldo}</span>
                              </div>
                            </div>
                            <div className="h-1 bg-background rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${i === 0 ? "bg-accent-text" : "bg-accent-text/50"}`} style={{ width: `${(a.saldo / maxSaldo) * 100}%` }} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Top 5 transacciones */}
                <div className="mb-4">
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-wide mb-2">{lbl("Últimas transacciones destacadas", "Latest notable transactions")}</p>
                  <div className="space-y-2">
                    {top5Transacciones.map((t, i) => (
                      <div key={i} className="flex items-center gap-2.5">
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${t.tipo === "ganada" ? "bg-success-light" : "bg-warning-light"}`}>
                          <Coins size={10} className={t.tipo === "ganada" ? "text-success" : "text-warning"} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[9px] font-semibold text-text-primary truncate block">{t.alumno} — <span className="font-normal text-text-muted">{t.motivo}</span></span>
                          <span className="text-[8px] text-text-muted">{t.fecha}</span>
                        </div>
                        <span className={`text-[10px] font-bold flex-shrink-0 ${t.tipo === "ganada" ? "text-success" : "text-warning"}`}>
                          {t.tipo === "ganada" ? "+" : "-"}{t.cantidad} QC
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Formulario Emitir Q-Coins */}
                {showEmitirQCoins && (
                  <div className="bg-accent-light rounded-xl p-4 border border-accent/20">
                    <p className="text-[11px] font-semibold text-accent-text mb-3">{lbl("Emitir Q-Coins especiales", "Issue special Q-Coins")}</p>
                    {emitido ? (
                      <div className="flex items-center gap-2 py-3 justify-center">
                        <CheckCircle2 size={16} className="text-success" />
                        <span className="text-[12px] font-bold text-success">{lbl("¡Q-Coins emitidos correctamente!", "Q-Coins issued successfully!")}</span>
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        <div className="flex gap-2">
                          <select
                            value={emitirDestinatario}
                            onChange={(e) => setEmitirDestinatario(e.target.value)}
                            className="flex-1 text-[11px] bg-card border border-card-border rounded-xl px-3 py-2 text-text-primary outline-none"
                          >
                            <option value="todos">{lbl("Todos los alumnos", "All students")}</option>
                            <option value="lucas">Lucas García</option>
                            <option value="sofia">Sofía Torres</option>
                            <option value="carmen">Carmen Vega</option>
                            <option value="diego">Diego López</option>
                            <option value="ana">Ana Martín</option>
                          </select>
                          <input
                            type="number"
                            min="1"
                            max="500"
                            placeholder={lbl("Cantidad", "Amount")}
                            value={emitirCantidad}
                            onChange={(e) => setEmitirCantidad(e.target.value)}
                            className="w-24 text-[11px] bg-card border border-card-border rounded-xl px-3 py-2 text-text-primary outline-none focus:border-accent-text/40"
                          />
                        </div>
                        <input
                          type="text"
                          placeholder={lbl("Motivo de la emisión especial...", "Reason for special issuance...")}
                          value={emitirMotivo}
                          onChange={(e) => setEmitirMotivo(e.target.value)}
                          className="w-full text-[11px] bg-card border border-card-border rounded-xl px-3 py-2 text-text-primary outline-none focus:border-accent-text/40 placeholder:text-text-muted"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setShowEmitirQCoins(false)}
                            className="text-[10px] font-medium text-text-muted px-3 py-1.5 rounded-xl hover:bg-background cursor-pointer transition-all"
                          >
                            {lbl("Cancelar", "Cancel")}
                          </button>
                          <button
                            onClick={handleEmitirQCoins}
                            disabled={!emitirMotivo.trim() || !emitirCantidad.trim() || emitiendo}
                            className="flex items-center gap-1.5 bg-sidebar text-white text-[11px] font-bold px-4 py-1.5 rounded-xl cursor-pointer hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {emitiendo ? <><RefreshCw size={10} className="animate-spin" />{lbl("Emitiendo…", "Issuing…")}</> : <><Coins size={10} />{lbl("Emitir", "Issue")}</>}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })()}

          {/* A30 — Panel seguimiento proyectos activos */}
          {(() => {
            const proyectoAlumnos = [
              { name: "Lucas García",      progress: 78, evidencias: 5, total: 6, status: "active"    },
              { name: "Sofía Torres",      progress: 92, evidencias: 6, total: 6, status: "completed" },
              { name: "Pablo Ruiz",        progress: 45, evidencias: 3, total: 6, status: "delayed"   },
              { name: "María Santos",      progress: 83, evidencias: 5, total: 6, status: "active"    },
              { name: "Diego López",       progress: 61, evidencias: 4, total: 6, status: "active"    },
              { name: "Ana Martín",        progress: 89, evidencias: 6, total: 6, status: "completed" },
              { name: "Carlos Rivera",     progress: 37, evidencias: 2, total: 6, status: "delayed"   },
              { name: "Laura Sanz",        progress: 74, evidencias: 5, total: 6, status: "active"    },
              { name: "Tomás Herrera",     progress: 55, evidencias: 3, total: 6, status: "active"    },
              { name: "Carla Vega",        progress: 96, evidencias: 6, total: 6, status: "completed" },
              { name: "Alejandro Pérez",   progress: 42, evidencias: 2, total: 6, status: "delayed"   },
              { name: "Valentina Cruz",    progress: 68, evidencias: 4, total: 6, status: "active"    },
            ];
            const statusLabel = (s: string) =>
              s === "completed" ? lbl("Entregado", "Submitted")
              : s === "delayed"  ? lbl("Retrasado", "Delayed")
              :                    lbl("En curso", "In progress");
            const statusColors = {
              completed: { bar: "bg-success",  badge: "bg-success-light text-success"  },
              active:    { bar: "bg-accent",    badge: "bg-accent-light text-accent-text" },
              delayed:   { bar: "bg-urgent",    badge: "bg-urgent-light text-urgent"    },
            } as const;
            const nCompleted = proyectoAlumnos.filter(a => a.status === "completed").length;
            const nDelayed   = proyectoAlumnos.filter(a => a.status === "delayed").length;
            const avgProgress = Math.round(proyectoAlumnos.reduce((s,a)=>s+a.progress,0)/proyectoAlumnos.length);

            return (
              <div className="bg-card rounded-2xl border border-card-border p-5">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <FolderOpen size={14} className="text-accent-text" />
                    <h3 className="text-[13px] font-semibold text-text-primary">
                      {lbl("Proyectos activos", "Active Projects")}
                    </h3>
                  </div>
                  <span className="text-[10px] text-text-muted font-medium">
                    {lbl("Negocio Real · T1", "Real Business · T1")}
                  </span>
                </div>

                {/* Summary pills */}
                <div className="flex gap-2 mb-4">
                  <div className="flex items-center gap-1.5 bg-background rounded-xl px-3 py-1.5">
                    <span className="text-[18px] font-bold text-text-primary">{avgProgress}%</span>
                    <span className="text-[9px] text-text-muted leading-tight">{lbl("media\nclase", "class\navg")}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-success-light rounded-xl px-3 py-1.5">
                    <span className="text-[18px] font-bold text-success">{nCompleted}</span>
                    <span className="text-[9px] text-success leading-tight">{lbl("entregados", "submitted")}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-urgent-light rounded-xl px-3 py-1.5">
                    <span className="text-[18px] font-bold text-urgent">{nDelayed}</span>
                    <span className="text-[9px] text-urgent leading-tight">{lbl("retrasados", "delayed")}</span>
                  </div>
                </div>

                {/* Student rows */}
                <div className="space-y-2">
                  {proyectoAlumnos.map((alumno) => {
                    const sc = statusColors[alumno.status as keyof typeof statusColors];
                    return (
                      <div key={alumno.name} className="flex items-center gap-3 py-1.5 border-b border-card-border last:border-0">
                        {/* Name */}
                        <span className="text-[11px] font-medium text-text-primary w-[118px] truncate flex-shrink-0">
                          {alumno.name}
                        </span>

                        {/* Progress bar */}
                        <div className="flex-1 flex items-center gap-2 min-w-0">
                          <div className="flex-1 h-1.5 bg-background rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${sc.bar}`}
                              style={{ width: `${alumno.progress}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-semibold text-text-secondary w-8 text-right flex-shrink-0">
                            {alumno.progress}%
                          </span>
                        </div>

                        {/* Evidencias */}
                        <span className="text-[10px] text-text-muted flex-shrink-0 w-8 text-center">
                          {alumno.evidencias}/{alumno.total}
                        </span>

                        {/* Status badge */}
                        <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${sc.badge}`}>
                          {statusLabel(alumno.status)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </div>

        {/* Panel derecho — Actividad reciente */}
        <div className="w-[260px] flex-shrink-0">
            <div className="bg-card rounded-2xl border border-card-border p-5 h-full">
              <div className="flex items-center gap-2 mb-4">
                <Clock size={14} className="text-text-primary" />
                <h3 className="text-[13px] font-semibold text-text-primary">{lbl("Actividad reciente", "Recent activity")}</h3>
              </div>
              <div className="space-y-3">
                {actividadReciente.map((a) => (
                  <div key={a.id} className="flex gap-2.5">
                    <div className={`w-6 h-6 rounded-lg flex-shrink-0 flex items-center justify-center ${
                      a.tipo === "success" ? "bg-success-light" : a.tipo === "warning" ? "bg-warning-light" : "bg-accent-light"
                    }`}>
                      <a.icon size={11} className={
                        a.tipo === "success" ? "text-success" : a.tipo === "warning" ? "text-text-primary" : "text-accent-text"
                      } />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] text-text-primary leading-snug">{a.texto}</p>
                      <span className="text-[9px] text-text-muted mt-0.5 block">{a.tiempo}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB: USUARIOS ─── */}
      {activeView === "users" && (() => {
        const filtered = usuariosMock.filter((u) => {
          const matchSearch = userSearch === "" || u.nombre.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase());
          const matchRol = userFilterRol === "Todos" || u.rol === userFilterRol;
          const matchEstado = userFilterEstado === "Todos" || (userFilterEstado === "Activo" ? u.activo : !u.activo);
          return matchSearch && matchRol && matchEstado;
        });
        return (
          <div className="bg-card rounded-2xl border border-card-border p-5">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[14px] font-semibold text-text-primary">{lbl("Usuarios", "Users")} — {colegio.nombre}</h3>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-1.5 bg-accent text-sidebar text-[11px] font-bold px-3 py-1.5 rounded-xl cursor-pointer hover:brightness-110 transition-all"
              >
                <UserPlus size={12} />
                {lbl("Añadir usuario", "Add user")}
              </button>
            </div>
            {/* Search + Filters */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder={lbl("Buscar por nombre o email...", "Search by name or email...")}
                  className="w-full bg-background text-[12px] text-text-primary pl-8 pr-3 py-2 rounded-xl border border-card-border outline-none focus:border-accent-text/40 transition-colors"
                />
              </div>
              <select
                value={userFilterRol}
                onChange={(e) => setUserFilterRol(e.target.value)}
                className="bg-background text-[11px] text-text-secondary px-3 py-2 rounded-xl border border-card-border outline-none cursor-pointer"
              >
                {["Todos", "Alumno", "Docente", "Familia", "Admin"].map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
              <select
                value={userFilterEstado}
                onChange={(e) => setUserFilterEstado(e.target.value)}
                className="bg-background text-[11px] text-text-secondary px-3 py-2 rounded-xl border border-card-border outline-none cursor-pointer"
              >
                {["Todos", "Activo", "Inactivo"].map((e) => (
                  <option key={e}>{e}</option>
                ))}
              </select>
              <span className="text-[11px] text-text-muted flex-shrink-0">{filtered.length} {lbl("usuarios", "users")}</span>
            </div>
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-card-border">
                    {[lbl("Nombre","Name"), "Email", lbl("Rol","Role"), lbl("Grupo/Curso","Group/Grade"), lbl("Estado","Status")].map((h) => (
                      <th key={h} className="text-[10px] font-bold text-text-muted text-left pb-3 pr-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u) => (
                    <tr key={u.id} className="border-b border-card-border/50 hover:bg-background/50 transition-colors">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-sidebar text-white text-[9px] font-bold flex items-center justify-center flex-shrink-0">
                            {u.nombre.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                          </div>
                          <span className="text-[12px] font-medium text-text-primary">{u.nombre}</span>
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-[11px] text-text-secondary">{u.email}</td>
                      <td className="py-3 pr-4">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          u.rol === "Docente" ? "bg-accent-light text-accent-text"
                          : u.rol === "Alumno" ? "bg-background text-text-primary border border-card-border"
                          : u.rol === "Admin"  ? "bg-sidebar text-white"
                          : "bg-warning-light text-text-primary"
                        }`}>{u.rol}</span>
                      </td>
                      <td className="py-3 pr-4 text-[11px] text-text-secondary">{u.curso}</td>
                      <td className="py-3">
                        <div className={`flex items-center gap-1.5 w-fit px-2 py-0.5 rounded-full ${u.activo ? "bg-success-light" : "bg-urgent-light"}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${u.activo ? "bg-success" : "bg-urgent"}`} />
                          <span className={`text-[9px] font-semibold ${u.activo ? "text-success" : "text-urgent"}`}>
                            {u.activo ? lbl("Activo", "Active") : lbl("Inactivo", "Inactive")}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-[12px] text-text-muted">{lbl("No hay usuarios que coincidan con los filtros.", "No users match the current filters.")}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Modal — Añadir usuario */}
            {showAddModal && (
              <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
                <div className="bg-card rounded-2xl border border-card-border p-6 w-full max-w-[420px]">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                      <UserPlus size={16} className="text-accent-text" />
                      <h3 className="text-[15px] font-bold text-text-primary">{lbl("Añadir nuevo usuario", "Add new user")}</h3>
                    </div>
                    <button onClick={() => setShowAddModal(false)} className="text-text-muted hover:text-text-primary cursor-pointer transition-colors">
                      <X size={16} />
                    </button>
                  </div>
                  <div className="space-y-3">
                    {[
                      { label: lbl("Nombre completo", "Full name"), key: "nombre", type: "text", placeholder: lbl("Ej. Elena Rodríguez", "e.g. Elena Rodríguez") },
                      { label: "Email",                              key: "email", type: "email", placeholder: "elena@qhuma.es" },
                      { label: lbl("Grupo/Curso", "Group/Grade"),   key: "curso", type: "text", placeholder: lbl("Ej. 1º ESO", "e.g. Year 7") },
                    ].map((field) => (
                      <div key={field.key}>
                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-wide block mb-1">{field.label}</label>
                        <input
                          type={field.type}
                          value={newUser[field.key as keyof typeof newUser]}
                          onChange={(e) => setNewUser({ ...newUser, [field.key]: e.target.value })}
                          placeholder={field.placeholder}
                          className="w-full bg-background text-[12px] text-text-primary px-3 py-2.5 rounded-xl border border-card-border outline-none focus:border-accent-text/40 transition-colors"
                        />
                      </div>
                    ))}
                    <div>
                      <label className="text-[10px] font-bold text-text-muted uppercase tracking-wide block mb-1">{lbl("Rol", "Role")}</label>
                      <select
                        value={newUser.rol}
                        onChange={(e) => setNewUser({ ...newUser, rol: e.target.value })}
                        className="w-full bg-background text-[12px] text-text-primary px-3 py-2.5 rounded-xl border border-card-border outline-none cursor-pointer"
                      >
                        {["Alumno", "Docente", "Familia", "Admin"].map((r) => <option key={r}>{r}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-5">
                    <button
                      onClick={() => setShowAddModal(false)}
                      className="flex-1 py-2.5 bg-background text-text-secondary text-[12px] font-medium rounded-xl cursor-pointer hover:bg-card-border/20 border border-card-border transition-colors"
                    >
                      {lbl("Cancelar", "Cancel")}
                    </button>
                    <button
                      onClick={() => { setShowAddModal(false); setNewUser({ nombre: "", email: "", rol: "Alumno", curso: "" }); }}
                      className="flex-1 py-2.5 bg-accent text-sidebar text-[12px] font-bold rounded-xl cursor-pointer hover:brightness-110 transition-all"
                    >
                      {lbl("Crear usuario", "Create user")}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* ─── TAB: QHUMA CAPITAL ─── */}
      {activeView === "capital" && (
        <div className="space-y-5">
          {/* Header stats */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: lbl("Proyectos en evaluación", "Projects under review"),    valor: "5",      sub: lbl("Este trimestre","This trimester"),                bg: "bg-accent-light",   text: "text-accent-text" },
              { label: lbl("Inversión total solicitada","Total investment requested"), valor: "€21.900", sub: lbl("Máx. €10.000 por proyecto","Max €10,000 per project"), bg: "bg-background", text: "text-text-primary" },
              { label: lbl("Proyectos financiados","Funded projects"),             valor: "1",      sub: "Carmen Vega · €5.000",                               bg: "bg-success-light",  text: "text-success" },
              { label: lbl("Votos emitidos (docentes)","Votes cast (teachers)"),   valor: "30",     sub: lbl("De 48 posibles","Out of 48 possible"),           bg: "bg-warning-light",  text: "text-warning" },
            ].map((s) => (
              <div key={s.label} className={`${s.bg} rounded-2xl p-4 border border-card-border`}>
                <p className="text-[10px] text-text-muted mb-1 leading-tight">{s.label}</p>
                <span className={`text-[24px] font-bold ${s.text} block leading-none`}>{s.valor}</span>
                <span className="text-[10px] text-text-muted mt-1 block">{s.sub}</span>
              </div>
            ))}
          </div>

          {/* A14: Capital comprometido + Próxima reunión */}
          {(() => {
            const capitalComprometido = qhumaCapitalProyectos
              .filter((p) => p.fase === "aprobado" || p.fase === "financiado")
              .reduce((sum, p) => sum + p.inversion, 0);
            const agendaProyectos = [
              { nombre: "El Airbnb de Lucas — Málaga", alumno: "Lucas García", inversion: 8500 },
              { nombre: "Estudio de Animación DIY", alumno: "Lucía Fernández", inversion: 2400 },
              { nombre: "Podcast Escolar — Historias de Barrio", alumno: "Daniel Torres", inversion: 1800 },
            ];
            const fechaAgenda = new Date().toISOString().slice(0, 10).replace(/-/g, "");
            const agendaFilename = `agenda_inversores_QHUMA_${fechaAgenda}.pdf`;
            return (
              <>
                {/* Capital comprometido highlight */}
                <div className="bg-sidebar rounded-2xl p-4 flex items-center gap-5">
                  <div className="flex-1">
                    <p className="text-[11px] text-white/60 mb-0.5">{lbl("Capital total comprometido", "Total committed capital")}</p>
                    <span className="text-[32px] font-bold text-accent leading-none">
                      €{capitalComprometido.toLocaleString()}
                    </span>
                    <p className="text-[10px] text-white/40 mt-1">
                      Suma de proyectos en fase Aprobado + Financiado ·{" "}
                      {qhumaCapitalProyectos.filter((p) => p.fase === "aprobado" || p.fase === "financiado").length} proyectos
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-[10px] text-white/40 mb-1">De un máximo de €10.000 por proyecto</p>
                    <div className="w-40 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent rounded-full"
                        style={{ width: `${Math.min(100, (capitalComprometido / 20000) * 100)}%` }}
                      />
                    </div>
                    <p className="text-[9px] text-white/30 mt-1">
                      {Math.round((capitalComprometido / 20000) * 100)}% del fondo semestral
                    </p>
                  </div>
                </div>

                {/* Próxima reunión de inversores */}
                <div className="bg-card rounded-2xl border border-card-border p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar size={14} className="text-accent-text" />
                    <h3 className="text-[14px] font-semibold text-text-primary">{lbl("Próxima reunión de inversores", "Next investor meeting")}</h3>
                    <span className="ml-auto text-[9px] font-bold bg-warning-light text-warning px-2.5 py-0.5 rounded-full">
                      25 mar · 10:00h
                    </span>
                  </div>
                  <div className="bg-background rounded-xl p-4 mb-4">
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="text-center">
                        <p className="text-[18px] font-bold text-text-primary leading-none">25 mar</p>
                        <p className="text-[10px] text-text-muted">{lbl("Miércoles 2026", "Wednesday 2026")}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[18px] font-bold text-text-primary leading-none">10:00</p>
                        <p className="text-[10px] text-text-muted">{lbl("Sala de proyectos", "Project room")}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[18px] font-bold text-text-primary leading-none">{agendaProyectos.length}</p>
                        <p className="text-[10px] text-text-muted">{lbl("Pitches programados", "Scheduled pitches")}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {agendaProyectos.map((ap, i) => (
                        <div key={i} className="flex items-center gap-3 bg-card rounded-xl px-3 py-2">
                          <span className="text-[10px] font-bold text-text-muted w-5 flex-shrink-0">{i + 1}.</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-semibold text-text-primary truncate">{ap.nombre}</p>
                            <p className="text-[9px] text-text-muted">{ap.alumno}</p>
                          </div>
                          <span className="text-[11px] font-bold text-accent-text flex-shrink-0">
                            €{ap.inversion.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleGenerarAgenda}
                      disabled={generandoAgenda}
                      className="flex items-center gap-1.5 px-4 py-2 bg-accent text-sidebar text-[11px] font-bold rounded-xl hover:brightness-105 transition-all cursor-pointer disabled:opacity-60"
                    >
                      {generandoAgenda ? <RefreshCw size={12} className="animate-spin" /> : <Download size={12} />}
                      {generandoAgenda ? lbl("Generando…", "Generating…") : lbl("Preparar agenda PDF", "Prepare PDF agenda")}
                    </button>
                    {agendaGenerada && (
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 size={12} className="text-success" />
                        <span className="text-[10px] text-success font-mono">{agendaFilename}</span>
                      </div>
                    )}
                  </div>
                </div>
              </>
            );
          })()}

          {/* Proyectos */}
          <div className="bg-card rounded-2xl border border-card-border p-5">
            <div className="flex items-center gap-2 mb-4">
              <Landmark size={14} className="text-accent-text" />
              <h3 className="text-[14px] font-semibold text-text-primary">{lbl("Proyectos QHUMA Capital", "QHUMA Capital Projects")}</h3>
              <span className="ml-auto text-[10px] text-text-muted">{lbl("Fases: Pitch → Votación → Aprobado → Financiado", "Phases: Pitch → Vote → Approved → Funded")}</span>
            </div>
            <div className="space-y-3">
              {qhumaCapitalProyectos.map((p) => {
                const fase = faseConfig[p.fase];
                const porcentajeVotos = p.votosMax > 0 ? Math.round((p.votos / p.votosMax) * 100) : 0;
                return (
                  <div key={p.id} className="bg-background rounded-2xl p-4 flex items-start gap-4">
                    {/* Avatar alumno */}
                    <div className="w-9 h-9 rounded-full bg-sidebar text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                      {p.alumno.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div>
                          <p className="text-[13px] font-semibold text-text-primary leading-snug">{p.nombre}</p>
                          <p className="text-[10px] text-text-muted">{p.alumno} · {p.clase}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full ${fase.color}`}>{fase.label}</span>
                          <span className="text-[12px] font-bold text-accent-text">€{p.inversion.toLocaleString()}</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-text-secondary leading-relaxed mb-2">{p.descripcion}</p>
                      {/* Votos */}
                      {p.fase !== "pitch" && (
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5">
                            <Vote size={11} className="text-text-muted" />
                            <span className="text-[10px] text-text-muted">{p.votos}/{p.votosMax} votos</span>
                          </div>
                          <div className="flex-1 h-1.5 bg-white rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                p.fase === "financiado" ? "bg-success"
                                : p.fase === "aprobado"  ? "bg-accent"
                                : "bg-warning"
                              }`}
                              style={{ width: `${porcentajeVotos}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-semibold text-text-muted">{porcentajeVotos}%</span>
                        </div>
                      )}
                    </div>
                    {/* Acción */}
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-accent-light text-accent-text text-[10px] font-bold rounded-xl hover:brightness-95 transition-all cursor-pointer flex-shrink-0">
                      <Eye size={11} />
                      {lbl("Revisar pitch", "Review pitch")}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── A9: Votación en tiempo real ──────────────────────────── */}
          {(() => {
            const p = qhumaCapitalProyectos[0]; // "El Airbnb de Lucas" en votación
            const votos = votosEnVivo;
            const quorum = 9;
            const pct = Math.round((votos / p.votosMax) * 100);
            const aprobado = votos >= quorum;
            return (
              <div className="bg-card rounded-2xl border border-card-border p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Vote size={14} className="text-warning" />
                  <h3 className="text-[14px] font-semibold text-text-primary">{lbl("Votación del claustro — en directo", "Faculty vote — live")}</h3>
                  <span className={`ml-auto text-[9px] font-bold px-2.5 py-0.5 rounded-full ${aprobado ? "bg-success-light text-success" : "bg-warning-light text-warning"}`}>
                    {aprobado ? lbl("Quórum alcanzado", "Quorum reached") : lbl(`Faltan ${quorum - votos} votos`, `${quorum - votos} votes remaining`)}
                  </span>
                </div>
                <div className="bg-background rounded-xl p-4">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <p className="text-[13px] font-semibold text-text-primary">{p.nombre}</p>
                      <p className="text-[11px] text-text-muted">{p.alumno} · {p.clase} · €{p.inversion.toLocaleString()}</p>
                    </div>
                    <button
                      onClick={() => handleEmitirVoto(p.id)}
                      disabled={votandoId === p.id || votos >= p.votosMax}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer flex-shrink-0 ${
                        votos >= p.votosMax
                          ? "bg-success-light text-success cursor-not-allowed"
                          : votandoId === p.id
                          ? "bg-warning-light text-warning"
                          : "bg-accent text-sidebar hover:brightness-105"
                      }`}
                    >
                      <Vote size={12} />
                      {votos >= p.votosMax ? lbl("Completado", "Complete") : votandoId === p.id ? lbl("Registrando…", "Registering…") : lbl("Emitir voto del claustro", "Cast faculty vote")}
                    </button>
                  </div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex-1 h-3 bg-white rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${aprobado ? "bg-success" : "bg-warning"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-[12px] font-bold text-text-primary flex-shrink-0">{votos}/{p.votosMax}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 flex gap-0.5">
                      {Array.from({ length: p.votosMax }).map((_, i) => (
                        <div key={i} className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${i < votos ? (aprobado ? "bg-success" : "bg-warning") : "bg-card-border"}`} />
                      ))}
                    </div>
                    <span className="text-[9px] text-text-muted flex-shrink-0">Quórum: {quorum}/{p.votosMax}</span>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ── A9: Historial de pitches T1 ──────────────────────────── */}
          <div className="bg-card rounded-2xl border border-card-border p-5">
            <div className="flex items-center gap-2 mb-4">
              <Calendar size={14} className="text-text-secondary" />
              <h3 className="text-[14px] font-semibold text-text-primary">{lbl("Historial de pitches — 1er Trimestre", "Pitch history — 1st Term")}</h3>
              <span className="ml-auto text-[10px] text-text-muted bg-background px-2.5 py-0.5 rounded-full">Sep – Dic 2025</span>
            </div>
            <div className="space-y-2">
              {[
                { alumno: "Carmen Vega",    proyecto: "App de Intercambio Estudiantil",   fecha: "18 dic 2025", resultado: "financiado", inversion: 5000,  nota: "Pitch sobresaliente. Modelo de negocio muy sólido." },
                { alumno: "Sofía Martín",   proyecto: "Huerto Urbano Digital",             fecha: "16 dic 2025", resultado: "aprobado",   inversion: 3200,  nota: "Impacto ambiental excelente. Escalabilidad pendiente." },
                { alumno: "Lucas García",   proyecto: "El Airbnb de Lucas",                fecha: "15 dic 2025", resultado: "votación",   inversion: 8500,  nota: "Inversión alta. Claustro pide más evidencias de mercado." },
                { alumno: "Lucía Fernández",proyecto: "Estudio de Animación DIY",          fecha: "12 dic 2025", resultado: "pendiente",  inversion: 2400,  nota: "Proyecto creativo. Necesita plan de negocio más detallado." },
                { alumno: "Daniel Torres",  proyecto: "Podcast Escolar — Historias de Barrio", fecha: "10 dic 2025", resultado: "rechazado", inversion: 1800, nota: "Dificultad para monetizar. Se recomienda reformular." },
              ].map((h) => {
                const resCfg: Record<string, { bg: string; text: string; label: string }> = {
                  financiado: { bg: "bg-success-light", text: "text-success",    label: "Financiado" },
                  aprobado:   { bg: "bg-accent-light",  text: "text-accent-text", label: "Aprobado" },
                  votación:   { bg: "bg-warning-light", text: "text-warning",    label: "En votación" },
                  pendiente:  { bg: "bg-background",    text: "text-text-muted", label: "Pendiente" },
                  rechazado:  { bg: "bg-urgent-light",  text: "text-urgent",     label: "Rechazado" },
                };
                const cfg = resCfg[h.resultado] ?? resCfg["pendiente"];
                return (
                  <div key={h.alumno} className="flex items-start gap-3 p-3 bg-background rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-sidebar text-white text-[9px] font-bold flex items-center justify-center flex-shrink-0">
                      {h.alumno.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-[12px] font-semibold text-text-primary leading-snug">{h.proyecto}</p>
                          <p className="text-[10px] text-text-muted">{h.alumno} · {h.fecha}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text}`}>{cfg.label}</span>
                          <span className="text-[11px] font-bold text-accent-text">€{h.inversion.toLocaleString()}</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-text-secondary mt-1 leading-relaxed italic">"{h.nota}"</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── A9: Generador de carta de aprobación ─────────────────── */}
          <div className="bg-card rounded-2xl border border-card-border p-5">
            <div className="flex items-center gap-2 mb-4">
              <ClipboardCheck size={14} className="text-accent-text" />
              <h3 className="text-[14px] font-semibold text-text-primary">{lbl("Generador de carta de aprobación", "Approval letter generator")}</h3>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <select
                value={cartaProyectoId}
                onChange={(e) => { setCartaProyectoId(e.target.value); setCartaGenerada(false); }}
                className="flex-1 bg-background text-text-primary text-[12px] border border-card-border rounded-xl px-3 py-2 focus:outline-none focus:border-accent cursor-pointer"
              >
                {qhumaCapitalProyectos
                  .filter((p) => p.fase === "aprobado" || p.fase === "financiado")
                  .map((p) => (
                    <option key={p.id} value={p.id}>{p.nombre} — {p.alumno}</option>
                  ))}
              </select>
              <button
                onClick={handleGenerarCarta}
                disabled={generandoCarta}
                className="flex items-center gap-1.5 px-4 py-2 bg-accent text-sidebar text-[11px] font-bold rounded-xl hover:brightness-105 transition-all cursor-pointer disabled:opacity-60 flex-shrink-0"
              >
                {generandoCarta ? <RefreshCw size={12} className="animate-spin" /> : <Save size={12} />}
                {generandoCarta ? lbl("Generando…", "Generating…") : lbl("Generar carta", "Generate letter")}
              </button>
            </div>
            {cartaGenerada && (() => {
              const p = qhumaCapitalProyectos.find((x) => x.id === cartaProyectoId)!;
              return (
                <div className="bg-background rounded-xl p-5 border border-card-border">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">QHUMA Capital · Carta oficial</p>
                      <p className="text-[11px] text-text-muted">11 de marzo de 2026</p>
                    </div>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-accent-light text-accent-text text-[10px] font-bold rounded-xl hover:brightness-95 cursor-pointer">
                      <Download size={10} />
                      {lbl("Descargar PDF", "Download PDF")}
                    </button>
                  </div>
                  <div className="space-y-2 text-[12px] text-text-primary leading-relaxed">
                    <p className="font-semibold">Estimado/a {p.alumno},</p>
                    <p>
                      En nombre del claustro de QHUMA Capital, nos complace comunicarte que tu proyecto
                      <span className="font-semibold"> "{p.nombre}"</span> ha sido
                      formalmente <span className="font-semibold text-success">aprobado para financiación</span> por
                      un importe de <span className="font-semibold">€{p.inversion.toLocaleString()}</span>.
                    </p>
                    <p>
                      El claustro ha valorado positivamente la solidez del modelo de negocio,
                      el impacto educativo y la alineación con las competencias LOMLOE.
                      El desembolso se realizará en dos tramos, condicionado a la presentación
                      del plan de acción detallado antes del 25 de marzo de 2026.
                    </p>
                    <p className="text-text-muted italic">
                      Esta carta tiene validez oficial en el contexto del programa QHUMA Capital
                      y será registrada en el expediente académico del alumno.
                    </p>
                    <p className="font-semibold mt-3">Atentamente,<br />
                      <span className="text-text-muted font-normal">Dirección Académica · QHUMA OS</span>
                    </p>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* ─── A25: Proyectos en segunda ronda ─────────────────────────── */}
          {(() => {
            const proyectosSegundaRonda = [
              {
                id: "sr1",
                nombre: "Casa Limón — Airbnb Málaga",
                alumno: "Lucas García",
                resumen: "Plataforma de alquiler vacacional en el centro histórico de Málaga con modelo de precios dinámicos basado en datos AirDNA. Ocupación proyectada 65% en escenario realista.",
                lomloe: ["CE", "STEM", "CD", "CLC"],
                inversion: 4500,
                mentor: "Ana Martínez",
                diasDesdeActualidad: 2,
                comentarioMentor: "Modelo financiero sólido. Recomiendo reforzar el plan de contingencia para la estacionalidad.",
                fases: [
                  { nombre: "Revisión documental", completado: true },
                  { nombre: "Pitch ante claustro", completado: true },
                  { nombre: "Votación inversores", completado: false },
                ],
              },
              {
                id: "sr2",
                nombre: "EcoMercado Escolar",
                alumno: "Sofía Torres",
                resumen: "Mercado de productos de temporada gestionado por alumnos con margen real y sistema de reparto de beneficios a través de Q-Coins. Primer trimestre con 3 ediciones piloto.",
                lomloe: ["CE", "CC", "CPSAA", "CLC"],
                inversion: 3000,
                mentor: "Carlos Rueda",
                diasDesdeActualidad: 5,
                comentarioMentor: "Excelente impacto pedagógico. El modelo de Q-Coins añade una capa de innovación que justifica la inversión.",
                fases: [
                  { nombre: "Revisión documental", completado: true },
                  { nombre: "Pitch ante claustro", completado: true },
                  { nombre: "Votación inversores", completado: false },
                ],
              },
              {
                id: "sr3",
                nombre: "App Guía Turística Digital",
                alumno: "Pablo Ruiz",
                resumen: "Aplicación web de itinerarios turísticos personalizados para Málaga con integración de contenidos culturales LOMLOE. Prototipo funcional en Figma con 3 rutas piloto.",
                lomloe: ["CD", "CLC", "CCEC", "CE"],
                inversion: 8500,
                mentor: "Ana Martínez",
                diasDesdeActualidad: 1,
                comentarioMentor: "Prototipo técnico muy ambicioso. Recomiendo acotar el alcance al módulo de rutas culturales para la fase de financiación.",
                fases: [
                  { nombre: "Revisión documental", completado: true },
                  { nombre: "Pitch ante claustro", completado: false },
                  { nombre: "Votación inversores", completado: false },
                ],
              },
            ];

            const fechasDisponibles = [
              "Lun 16 mar · 10:00",
              "Mar 17 mar · 11:30",
              "Mié 18 mar · 09:00",
              "Jue 19 mar · 16:00",
              "Vie 20 mar · 12:00",
            ];

            const compColors: Record<string, string> = {
              CE: "bg-urgent-light text-urgent",
              STEM: "bg-success-light text-success",
              CD: "bg-accent-light text-accent-text",
              CLC: "bg-accent-light text-accent-text",
              CC: "bg-success-light text-success",
              CPSAA: "bg-warning-light text-text-primary",
              CCEC: "bg-warning-light text-text-primary",
              CPL: "bg-background text-text-secondary",
            };

            return (
              <div className="bg-card rounded-2xl border border-card-border p-5 mt-5">
                <div className="flex items-center gap-2 mb-4">
                  <Target size={14} className="text-accent-text" />
                  <h3 className="text-[14px] font-semibold text-text-primary">Proyectos en segunda ronda</h3>
                  <span className="ml-auto text-[10px] font-semibold bg-warning-light text-warning border border-warning/20 px-2.5 py-1 rounded-full">
                    {proyectosSegundaRonda.length} en evaluación
                  </span>
                </div>

                <div className="space-y-4">
                  {proyectosSegundaRonda.map((proyecto) => {
                    const isExpandido = expedienteExpandido === proyecto.id;
                    const yaReunion = reunionSolicitada.has(proyecto.id);
                    const fechaSeleccionada = fechaReunion[proyecto.id] ?? fechasDisponibles[0];
                    const fasesCompletadas = proyecto.fases.filter((f) => f.completado).length;

                    return (
                      <div key={proyecto.id} className="bg-background rounded-xl border border-card-border overflow-hidden">
                        <div className="p-4">
                          {/* Header */}
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                <h4 className="text-[13px] font-semibold text-text-primary">{proyecto.nombre}</h4>
                                <span className="text-[10px] font-semibold bg-sidebar text-accent px-2 py-0.5 rounded-full flex-shrink-0">
                                  €{proyecto.inversion.toLocaleString()}
                                </span>
                              </div>
                              <span className="text-[10px] text-text-muted">
                                {proyecto.alumno} · Mentor: {proyecto.mentor} · hace {proyecto.diasDesdeActualidad}d
                              </span>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <span className="text-[10px] font-semibold text-text-muted">
                                {fasesCompletadas}/3 fases
                              </span>
                            </div>
                          </div>

                          {/* Resumen */}
                          <p className="text-[11px] text-text-secondary leading-relaxed mb-3">{proyecto.resumen}</p>

                          {/* Competencias */}
                          <div className="flex flex-wrap gap-1 mb-3">
                            {proyecto.lomloe.map((comp) => (
                              <span key={comp} className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${compColors[comp] ?? "bg-background text-text-muted"}`}>
                                {comp}
                              </span>
                            ))}
                          </div>

                          {/* Stepper fases */}
                          <div className="flex items-center gap-0 mb-3">
                            {proyecto.fases.map((fase, fi) => (
                              <div key={fi} className="flex items-center flex-1">
                                <div className={`flex items-center gap-1.5 flex-1 px-2 py-1.5 rounded-lg text-[9px] font-medium ${
                                  fase.completado ? "bg-success-light text-success border border-success/20" : "bg-card text-text-muted border border-card-border"
                                }`}>
                                  {fase.completado
                                    ? <CheckCircle2 size={9} className="text-success flex-shrink-0" />
                                    : <Clock size={9} className="text-warning flex-shrink-0" />
                                  }
                                  <span className="truncate">{fase.nombre}</span>
                                  {fase.completado && <span className="ml-auto">✅</span>}
                                  {!fase.completado && fi === fasesCompletadas && <span className="ml-auto text-warning">→</span>}
                                </div>
                                {fi < proyecto.fases.length - 1 && (
                                  <div className={`w-3 h-0.5 flex-shrink-0 ${fase.completado ? "bg-success" : "bg-card-border"}`} />
                                )}
                              </div>
                            ))}
                          </div>

                          {/* Comentario mentor */}
                          <div className="bg-accent-light rounded-xl p-3 border border-accent/20 mb-3">
                            <div className="flex items-center gap-1.5 mb-1">
                              <MessageSquare size={10} className="text-accent-text flex-shrink-0" />
                              <span className="text-[9px] font-bold text-accent-text uppercase tracking-wide">
                                Mentor · {proyecto.mentor}
                              </span>
                            </div>
                            <p className="text-[10px] text-text-secondary leading-relaxed italic">"{proyecto.comentarioMentor}"</p>
                          </div>

                          {/* Acciones */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setExpedienteExpandido(isExpandido ? null : proyecto.id)}
                              className="flex items-center gap-1.5 text-[10px] font-semibold bg-sidebar text-accent px-3 py-2 rounded-xl hover:bg-accent-dark transition-colors cursor-pointer"
                            >
                              <FileText size={11} />
                              {isExpandido ? "Cerrar expediente" : "Ver expediente completo"}
                            </button>
                            {!yaReunion ? (
                              <div className="flex items-center gap-1.5 flex-1">
                                <select
                                  value={fechaSeleccionada}
                                  onChange={(e) => setFechaReunion((prev) => ({ ...prev, [proyecto.id]: e.target.value }))}
                                  className="flex-1 bg-background border border-card-border rounded-xl px-2 py-2 text-[10px] text-text-secondary focus:outline-none focus:border-accent-text/30 cursor-pointer"
                                >
                                  {fechasDisponibles.map((f) => (
                                    <option key={f} value={f}>{f}</option>
                                  ))}
                                </select>
                                <button
                                  onClick={() => {
                                    setReunionSolicitada((prev) => new Set(prev).add(proyecto.id));
                                  }}
                                  className="flex items-center gap-1.5 text-[10px] font-semibold bg-background border border-card-border text-text-secondary px-3 py-2 rounded-xl hover:bg-accent-light hover:text-accent-text hover:border-accent/30 transition-colors cursor-pointer flex-shrink-0"
                                >
                                  <Calendar size={10} />
                                  Solicitar reunión
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5 bg-success-light border border-success/20 px-3 py-2 rounded-xl flex-1">
                                <CheckCircle2 size={11} className="text-success" />
                                <span className="text-[10px] font-semibold text-success">
                                  Reunión confirmada — {fechaSeleccionada}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Expediente expandido */}
                        {isExpandido && (
                          <div className="border-t border-card-border bg-card p-4">
                            <h5 className="text-[12px] font-semibold text-text-primary mb-3">Expediente completo — {proyecto.nombre}</h5>
                            <div className="grid grid-cols-2 gap-4 mb-3">
                              <div className="bg-background rounded-xl p-3">
                                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wide block mb-1">Alumno</span>
                                <span className="text-[12px] font-semibold text-text-primary">{proyecto.alumno}</span>
                              </div>
                              <div className="bg-background rounded-xl p-3">
                                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wide block mb-1">Inversión solicitada</span>
                                <span className="text-[12px] font-semibold text-text-primary">€{proyecto.inversion.toLocaleString()}</span>
                              </div>
                              <div className="bg-background rounded-xl p-3">
                                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wide block mb-1">Mentor asignado</span>
                                <span className="text-[12px] font-semibold text-text-primary">{proyecto.mentor}</span>
                              </div>
                              <div className="bg-background rounded-xl p-3">
                                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wide block mb-1">Progreso evaluación</span>
                                <span className="text-[12px] font-semibold text-text-primary">{fasesCompletadas}/3 fases completadas</span>
                              </div>
                            </div>
                            <div className="bg-warning-light rounded-xl p-3 border border-warning/20">
                              <p className="text-[11px] text-text-secondary leading-relaxed">
                                <strong>Próxima acción:</strong> {
                                  proyecto.fases[fasesCompletadas]?.nombre ?? "Evaluación completada"
                                } — pendiente de decisión del claustro inversor.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ─── TAB: IA ─── */}
      {activeView === "ai" && (
        <div className="space-y-5">
          {/* KPIs */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: lbl("Llamadas API este mes","API calls this month"),     valor: "2.170",   sub: "Gemini 2.0 Flash",                              bg: "bg-accent-light",  text: "text-accent-text" },
              { label: lbl("Coste estimado total","Total estimated cost"),      valor: "€25,82",  sub: lbl("Presupuesto: €40/mes","Budget: €40/month"), bg: "bg-success-light", text: "text-success" },
              { label: lbl("Tiempo medio respuesta","Avg response time"),       valor: "1,2s",    sub: lbl("Objetivo <2s ✓","Target <2s ✓"),           bg: "bg-background",    text: "text-text-primary" },
              { label: lbl("Tasa socrática","Socratic rate"),                   valor: "74%",     sub: lbl("Preguntas de retorno","Return questions"),  bg: "bg-warning-light", text: "text-warning" },
            ].map((s) => (
              <div key={s.label} className={`rounded-2xl p-4 border border-card-border ${s.bg}`}>
                <p className="text-[10px] text-text-muted mb-1 leading-tight">{s.label}</p>
                <span className={`text-[24px] font-bold ${s.text} block leading-none`}>{s.valor}</span>
                <span className="text-[10px] text-text-muted mt-1 block">{s.sub}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-5">
            {/* Uso por funcionalidad */}
            <div className="flex-1 bg-card rounded-2xl border border-card-border p-5">
              <div className="flex items-center gap-2 mb-4">
                <Bot size={14} className="text-accent-text" />
                <h3 className="text-[14px] font-semibold text-text-primary">{lbl("Uso por funcionalidad", "Usage by feature")}</h3>
              </div>
              <div className="space-y-4">
                {usoIA.map((u) => (
                  <div key={u.feature}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[12px] font-medium text-text-secondary">{u.feature}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-text-muted">{u.llamadas.toLocaleString()} llamadas</span>
                        <span className="text-[11px] font-bold text-accent-text">€{u.coste.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="h-2.5 bg-background rounded-full overflow-hidden">
                      <div className="h-full bg-accent-text rounded-full transition-all" style={{ width: `${(u.llamadas / 2170) * 100}%` }} />
                    </div>
                    <span className="text-[9px] text-text-muted block mt-1">
                      {Math.round((u.llamadas / 2170) * 100)}% del total
                    </span>
                  </div>
                ))}
              </div>

              {/* Comparativa semanal */}
              <div className="mt-5 pt-4 border-t border-card-border">
                <div className="flex items-center gap-2 mb-3">
                  <Activity size={12} className="text-text-primary" />
                  <span className="text-[12px] font-semibold text-text-primary">{lbl("Comparativa semanal", "Weekly comparison")}</span>
                </div>
                <div className="flex items-end gap-2 h-[80px]">
                  {comparativaSemanal.map((s) => {
                    const maxLlamadas = Math.max(...comparativaSemanal.map((x) => x.llamadas));
                    const pct = Math.round((s.llamadas / maxLlamadas) * 100);
                    const isActual = s.semana.includes("actual");
                    return (
                      <div key={s.semana} className="flex-1 flex flex-col items-center gap-1">
                        <span className="text-[9px] text-text-muted">{s.llamadas}</span>
                        <div className="w-full flex items-end" style={{ height: "52px" }}>
                          <div
                            className={`w-full rounded-t-lg transition-all ${isActual ? "bg-accent-text" : "bg-accent-light"}`}
                            style={{ height: `${pct}%` }}
                          />
                        </div>
                        <span className="text-[8px] text-text-muted text-center leading-tight">{s.semana.replace(" (actual)", "")}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Heatmap de uso por alumno */}
            <div className="w-[320px] flex-shrink-0 bg-card rounded-2xl border border-card-border p-5">
              <div className="flex items-center gap-2 mb-3">
                <Users size={14} className="text-text-primary" />
                <h3 className="text-[13px] font-semibold text-text-primary">{lbl("Actividad por usuario", "Activity per user")}</h3>
                <span className="ml-auto text-[9px] text-text-muted">{lbl("Lun–Vie esta semana", "Mon–Fri this week")}</span>
              </div>
              {/* Cabecera días */}
              <div className="flex gap-1 mb-1 pl-[88px]">
                {["L", "M", "X", "J", "V"].map((d) => (
                  <div key={d} className="flex-1 text-center text-[9px] text-text-muted font-bold">{d}</div>
                ))}
              </div>
              <div className="space-y-0.5">
                {heatmapAlumnos.map((a) => {
                  const total = a.semana.reduce((acc, v) => acc + v, 0);
                  return (
                    <div key={a.nombre} className="flex items-center gap-1">
                      <div className="w-[84px] flex-shrink-0 flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-sidebar text-white text-[7px] font-bold flex items-center justify-center flex-shrink-0">
                          {a.nombre.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </div>
                        <span className="text-[9px] text-text-secondary truncate">{a.nombre.split(" ")[0]}</span>
                      </div>
                      {a.semana.map((val, i) => {
                        const t = Math.min(val / 15, 1);
                        const r = Math.round(195 + (31 - 195) * t);
                        const g = Math.round(244 + (81 - 244) * t);
                        const b = Math.round(153 + (76 - 153) * t);
                        return (
                          <div
                            key={i}
                            className="flex-1 h-5 rounded-md flex items-center justify-center"
                            style={{ backgroundColor: val === 0 ? "#f4f0e9" : `rgb(${r},${g},${b})` }}
                            title={`${a.nombre} — ${["Lun","Mar","Mié","Jue","Vie"][i]}: ${val} llamadas`}
                          >
                            {val > 0 && (
                              <span className="text-[7px] font-bold" style={{ color: t > 0.5 ? "white" : "#2f574d" }}>{val}</span>
                            )}
                          </div>
                        );
                      })}
                      <span className="text-[8px] text-text-muted w-5 text-right flex-shrink-0">{total}</span>
                    </div>
                  );
                })}
              </div>
              {/* Leyenda */}
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-card-border">
                <span className="text-[9px] text-text-muted">{lbl("Menos", "Less")}</span>
                {[0, 3, 6, 9, 12, 15].map((v) => {
                  const t = Math.min(v / 15, 1);
                  const r = Math.round(195 + (31 - 195) * t);
                  const g = Math.round(244 + (81 - 244) * t);
                  const b = Math.round(153 + (76 - 153) * t);
                  return (
                    <div key={v} className="w-4 h-4 rounded-sm" style={{ backgroundColor: v === 0 ? "#f4f0e9" : `rgb(${r},${g},${b})` }} />
                  );
                })}
                <span className="text-[9px] text-text-muted">{lbl("Más", "More")}</span>
              </div>
            </div>
          </div>

          {/* A27 — Configuración de alertas automáticas */}
          {(() => {
            const reglasAlertas = [
              {
                id: "inactividad3dias",
                nombre: "Alumno sin actividad >3 días",
                condicion: "Sin login ni entrega en 72h",
                destinatarios: ["Alumno", "Tutor"],
                ultimaVez: "Hace 2 días",
                icon: Bell,
              },
              {
                id: "notaBaja",
                nombre: "Nota LOMLOE baja (<2)",
                condicion: "Nivel 1 en cualquier competencia",
                destinatarios: ["Alumno", "Familia"],
                ultimaVez: "Hoy 09:12",
                icon: AlertTriangle,
              },
              {
                id: "evidenciaVencida",
                nombre: "Evidencia vencida",
                condicion: "Fecha límite superada sin entrega",
                destinatarios: ["Alumno", "Tutor"],
                ultimaVez: "Nunca",
                icon: Clock,
              },
              {
                id: "qcoinsBajo",
                nombre: "Q-Coins por debajo de 100",
                condicion: "Saldo QC < 100",
                destinatarios: ["Alumno"],
                ultimaVez: "Hace 5 días",
                icon: Coins,
              },
              {
                id: "ratioCompletado",
                nombre: "Ratio completado <40%",
                condicion: "Evidencias / total < 40%",
                destinatarios: ["Tutor", "Familia"],
                ultimaVez: "Nunca",
                icon: TrendingDown,
              },
              {
                id: "streakRota",
                nombre: "Streak rota 3+ veces",
                condicion: "≥3 interrupciones de racha en el trimestre",
                destinatarios: ["Alumno", "Tutor"],
                ultimaVez: "Nunca",
                icon: Activity,
              },
            ];

            const activas = Object.values(alertasConfig).filter(Boolean).length;
            const pendientes = Object.entries(alertasConfig).filter(([, v]) => !v).length;

            const destinatarioColor: Record<string, string> = {
              Alumno: "bg-accent-light text-accent-text",
              Tutor: "bg-success-light text-success",
              Familia: "bg-warning-light text-warning",
            };

            const frecuencias = ["inmediata", "diaria", "semanal"];

            const handleProbarAlerta = (id: string) => {
              if (probandoAlerta) return;
              setProbandoAlerta(id);
              setTimeout(() => {
                setProbandoAlerta(null);
                setAlertaProbada(new Set([...alertaProbada, id]));
                setTimeout(() => setAlertaProbada((prev) => { const s = new Set(prev); s.delete(id); return s; }), 3500);
              }, 800);
            };

            return (
              <div className="bg-card rounded-2xl border border-card-border p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Bell size={14} className="text-accent-text" />
                  <h3 className="text-[14px] font-semibold text-text-primary">Configuración de alertas automáticas</h3>
                </div>

                {/* Resumen */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[
                    { label: "Reglas activas", valor: activas, bg: "bg-success-light", text: "text-success" },
                    { label: "Alertas enviadas esta semana", valor: 14, bg: "bg-accent-light", text: "text-accent-text" },
                    { label: "Pendientes de configurar", valor: pendientes, bg: pendientes > 0 ? "bg-warning-light" : "bg-background", text: pendientes > 0 ? "text-warning" : "text-text-muted" },
                  ].map((s) => (
                    <div key={s.label} className={`rounded-xl p-3 ${s.bg}`}>
                      <span className={`text-[22px] font-bold ${s.text} block leading-none`}>{s.valor}</span>
                      <span className="text-[9px] text-text-muted block mt-1">{s.label}</span>
                    </div>
                  ))}
                </div>

                {/* Reglas */}
                <div className="space-y-3">
                  {reglasAlertas.map((regla) => {
                    const activa = alertasConfig[regla.id];
                    const probando = probandoAlerta === regla.id;
                    const probada = alertaProbada.has(regla.id);
                    const IconComp = regla.icon;
                    return (
                      <div key={regla.id} className={`rounded-xl border p-4 transition-all ${activa ? "border-card-border bg-background" : "border-card-border/50 bg-card opacity-75"}`}>
                        <div className="flex items-start gap-3">
                          {/* Toggle pill */}
                          <button
                            onClick={() => setAlertasConfig({ ...alertasConfig, [regla.id]: !activa })}
                            className={`relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition-colors cursor-pointer mt-0.5 ${activa ? "bg-success" : "bg-card-border"}`}
                          >
                            <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${activa ? "translate-x-4" : "translate-x-0.5"}`} />
                          </button>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <IconComp size={12} className={activa ? "text-accent-text" : "text-text-muted"} />
                              <span className={`text-[12px] font-semibold ${activa ? "text-text-primary" : "text-text-muted"}`}>{regla.nombre}</span>
                            </div>
                            <p className="text-[10px] text-text-muted mb-2">{regla.condicion}</p>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[9px] text-text-muted">Destinatarios:</span>
                              {regla.destinatarios.map((d) => (
                                <span key={d} className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${destinatarioColor[d] ?? "bg-background text-text-muted"}`}>{d}</span>
                              ))}
                              <span className="text-[9px] text-text-muted ml-auto">Última vez: {regla.ultimaVez}</span>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-2 flex-shrink-0">
                            {/* Frecuencia select */}
                            <select
                              value={alertasFrecuencia[regla.id]}
                              onChange={(e) => setAlertasFrecuencia({ ...alertasFrecuencia, [regla.id]: e.target.value })}
                              disabled={!activa}
                              className="text-[9px] bg-background border border-card-border rounded-lg px-2 py-1 text-text-secondary outline-none cursor-pointer disabled:opacity-40"
                            >
                              {frecuencias.map((f) => (
                                <option key={f} value={f}>{f.charAt(0).toUpperCase() + f.slice(1)}</option>
                              ))}
                            </select>
                            {/* Probar alerta */}
                            <button
                              onClick={() => handleProbarAlerta(regla.id)}
                              disabled={!activa || probandoAlerta !== null}
                              className={`text-[9px] font-bold px-2.5 py-1 rounded-lg cursor-pointer transition-all disabled:opacity-40 ${
                                probada
                                  ? "bg-success-light text-success"
                                  : "bg-accent-light text-accent-text hover:bg-accent/20"
                              }`}
                            >
                              {probando ? (
                                <span className="flex items-center gap-1"><RefreshCw size={9} className="animate-spin" />Probando…</span>
                              ) : probada ? (
                                <span className="flex items-center gap-1"><CheckCircle2 size={9} />Enviada a 3</span>
                              ) : (
                                "Probar alerta"
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ─── TAB: COLEGIOS (A4 — AdminSchoolSettings) ─── */}
      {activeView === "schools" && (
        <div className="space-y-5">
          {/* Información general del colegio */}
          <div className="bg-card rounded-2xl border border-card-border p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Building2 size={14} className="text-text-primary" />
                <h3 className="text-[14px] font-semibold text-text-primary">{lbl("Información del colegio", "School information")} — {colegio.nombre}</h3>
              </div>
              <button className="flex items-center gap-1.5 bg-accent text-sidebar text-[11px] font-bold px-3 py-1.5 rounded-xl cursor-pointer hover:brightness-110 transition-all">
                <Save size={11} />
                {lbl("Guardar cambios", "Save changes")}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: lbl("Nombre del colegio","School name"),    key: "nombre",    placeholder: "QHUMA Málaga" },
                { label: lbl("Director/a","Principal"),              key: "director",  placeholder: lbl("Nombre y apellidos","Full name") },
                { label: lbl("Email institucional","Institutional email"), key: "email", placeholder: "direccion@colegio.es" },
                { label: lbl("Nivel educativo","Education level"),   key: "nivel",     placeholder: lbl("Ej. Primaria + ESO","e.g. Primary + Secondary") },
              ].map((field) => (
                <div key={field.key}>
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-wide block mb-1">{field.label}</label>
                  <input
                    type="text"
                    value={schoolForm[field.key as keyof typeof schoolForm]}
                    onChange={(e) => setSchoolForm({ ...schoolForm, [field.key]: e.target.value })}
                    placeholder={field.placeholder}
                    className="w-full bg-background text-[12px] text-text-primary px-3 py-2.5 rounded-xl border border-card-border outline-none focus:border-accent-text/40 transition-colors"
                  />
                </div>
              ))}
              <div className="col-span-2">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-wide block mb-1">{lbl("Dirección postal","Postal address")}</label>
                <input
                  type="text"
                  value={schoolForm.direccion}
                  onChange={(e) => setSchoolForm({ ...schoolForm, direccion: e.target.value })}
                  placeholder={lbl("Calle, número, código postal, ciudad","Street, number, postal code, city")}
                  className="w-full bg-background text-[12px] text-text-primary px-3 py-2.5 rounded-xl border border-card-border outline-none focus:border-accent-text/40 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Competencias LOMLOE — toggles */}
          <div className="bg-card rounded-2xl border border-card-border p-5">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 size={14} className="text-accent-text" />
              <h3 className="text-[14px] font-semibold text-text-primary">{lbl("Competencias LOMLOE activas", "Active LOMLOE competencies")}</h3>
              <span className="ml-auto text-[10px] text-text-muted">
                {Object.values(compActivas).filter(Boolean).length}/8 activas
              </span>
            </div>
            <p className="text-[11px] text-text-muted mb-4">Según Real Decreto 217/2022 (ESO) y 243/2022 (Bachillerato). Desactivar una competencia la oculta de los informes del colegio.</p>
            <div className="grid grid-cols-2 gap-3">
              {competenciasLOMLOE.map((comp) => {
                const activa = compActivas[comp.key] ?? true;
                return (
                  <div
                    key={comp.key}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
                      activa ? "bg-accent-light border-accent/30" : "bg-background border-card-border opacity-60"
                    }`}
                    onClick={() => setCompActivas({ ...compActivas, [comp.key]: !activa })}
                  >
                    <div className={`w-10 h-5 rounded-full relative flex-shrink-0 transition-colors ${activa ? "bg-accent-text" : "bg-text-muted/30"}`}>
                      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${activa ? "left-5" : "left-0.5"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[11px] font-bold text-accent-text block">{comp.key}</span>
                      <span className="text-[10px] text-text-secondary truncate block">{comp.nombre}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Calendario académico */}
          <div className="bg-card rounded-2xl border border-card-border p-5">
            <div className="flex items-center gap-2 mb-4">
              <Calendar size={14} className="text-text-primary" />
              <h3 className="text-[14px] font-semibold text-text-primary">{lbl("Calendario académico 2025-2026", "Academic calendar 2025-2026")}</h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {trimestres.map((t) => (
                <div key={t.nombre} className={`rounded-2xl p-4 border ${
                  t.estado === "activo"     ? "bg-accent-light border-accent/30"
                  : t.estado === "completado" ? "bg-success-light border-success/20"
                  : "bg-background border-card-border opacity-70"
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[12px] font-bold text-text-primary">{t.nombre}</span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      t.estado === "activo"     ? "bg-accent text-sidebar"
                      : t.estado === "completado" ? "bg-success text-white"
                      : "bg-background border border-card-border text-text-muted"
                    }`}>
                      {t.estado === "activo" ? lbl("En curso","In progress") : t.estado === "completado" ? lbl("Completado","Completed") : lbl("Próximo","Upcoming")}
                    </span>
                  </div>
                  <p className="text-[10px] text-text-muted mb-0.5">{t.inicio} → {t.fin}</p>
                  <p className="text-[10px] font-semibold text-accent-text">{t.semanas} semanas lectivas</p>
                </div>
              ))}
            </div>
          </div>

          {/* Escala de evaluación LOMLOE */}
          <div className="bg-card rounded-2xl border border-card-border p-5">
            <div className="flex items-center gap-2 mb-4">
              <Shield size={14} className="text-text-primary" />
              <h3 className="text-[14px] font-semibold text-text-primary">{lbl("Escala de evaluación LOMLOE (1-4)", "LOMLOE assessment scale (1–4)")}</h3>
              <span className="ml-auto text-[10px] text-text-muted">Conforme a los criterios oficiales del MEC</span>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {escalasLOMLOE.map((e) => (
                <div key={e.nivel} className={`${e.bg} rounded-xl p-4 border border-card-border`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-7 h-7 rounded-lg bg-white flex items-center justify-center text-[16px] font-bold ${e.text}`}>{e.nivel}</div>
                    <span className={`text-[11px] font-bold ${e.text}`}>{e.etiqueta}</span>
                  </div>
                  <p className="text-[10px] text-text-secondary leading-snug">{e.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB: INFORMES ─── */}
      {activeView === "reports" && (
        <div className="space-y-5">
          {/* Generador de informes */}
          <div className="bg-card rounded-2xl border border-card-border p-5">
            <div className="flex items-center gap-2 mb-4">
              <FileText size={15} className="text-accent-text" />
              <h3 className="text-[14px] font-semibold text-text-primary">{lbl("Generador de informes LOMLOE", "LOMLOE report generator")}</h3>
            </div>

            {/* A11: Plantillas predefinidas */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {plantillasPredefinidas.map((p) => (
              <button
                key={p.id}
                onClick={() => { setReportTipo(p.tipo); setReportPreview(false); setDownloadedFilename(null); }}
                className={`text-left p-3 rounded-xl border transition-all cursor-pointer ${
                  reportTipo === p.tipo
                    ? "bg-sidebar border-sidebar"
                    : "bg-background border-card-border hover:border-accent-text/30"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[16px]">{p.icon}</span>
                  <span className={`text-[12px] font-bold ${reportTipo === p.tipo ? "text-accent" : "text-text-primary"}`}>
                    {p.label}
                  </span>
                </div>
                <p className={`text-[10px] leading-relaxed ${reportTipo === p.tipo ? "text-white/60" : "text-text-muted"}`}>
                  {p.descripcion}
                </p>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3 mb-4">
              {/* Selector alumno */}
              <div>
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-wide block mb-1.5">{lbl("Alumno","Student")}</label>
                <select
                  value={reportAlumno}
                  onChange={(e) => { setReportAlumno(e.target.value); setReportPreview(false); }}
                  className="w-full bg-background border border-card-border rounded-xl px-3 py-2.5 text-[12px] text-text-primary outline-none cursor-pointer appearance-none"
                >
                  {reportAlumnos.map((a) => (
                    <option key={a.id} value={a.nombre}>{a.nombre} · {a.curso}</option>
                  ))}
                </select>
              </div>

              {/* Selector trimestre */}
              <div>
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-wide block mb-1.5">{lbl("Trimestre","Term")}</label>
                <select
                  value={reportTrimestre}
                  onChange={(e) => { setReportTrimestre(e.target.value as "1" | "2" | "3"); setReportPreview(false); }}
                  className="w-full bg-background border border-card-border rounded-xl px-3 py-2.5 text-[12px] text-text-primary outline-none cursor-pointer appearance-none"
                >
                  <option value="1">1er Trimestre</option>
                  <option value="2">2º Trimestre (actual)</option>
                  <option value="3">3er Trimestre</option>
                </select>
              </div>

              {/* Selector tipo */}
              <div>
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-wide block mb-1.5">{lbl("Tipo de informe","Report type")}</label>
                <select
                  value={reportTipo}
                  onChange={(e) => { setReportTipo(e.target.value as typeof reportTipo); setReportPreview(false); }}
                  className="w-full bg-background border border-card-border rounded-xl px-3 py-2.5 text-[12px] text-text-primary outline-none cursor-pointer appearance-none"
                >
                  <option value="individual">Individual</option>
                  <option value="grupo">Grupo / Clase</option>
                  <option value="lomloe">LOMLOE Completo</option>
                  <option value="inspeccion">Para Inspección</option>
                  <option value="familia">Informe Familia</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleGenerarInforme}
              disabled={isGenerating}
              className="flex items-center gap-2 bg-sidebar text-white text-[12px] font-bold px-4 py-2.5 rounded-xl cursor-pointer hover:bg-accent-dark transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <><RefreshCw size={13} className="animate-spin" /> {lbl("Generando informe...", "Generating report...")}</>
              ) : (
                <><FileText size={13} /> {lbl("Generar informe", "Generate report")}</>
              )}
            </button>
          </div>

          {/* Preview del informe */}
          {reportPreview && (() => {
            const alumnoData = reportAlumnos.find((a) => a.nombre === reportAlumno);
            const alumnoSlug = reportAlumno.toLowerCase()
              .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
              .replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
            const fechaStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
            const previewFilename = `informe_${alumnoSlug}_T${reportTrimestre}_${reportTipo}_${fechaStr}.pdf`;

            const seccionesPorTipo: Record<string, { n: string; titulo: string }[]> = {
              lomloe: [
                { n: "1", titulo: `Alumno/a: ${reportAlumno} · Curso: ${alumnoData?.curso ?? "1º ESO"} · ${trimestreLabel[reportTrimestre]}` },
                { n: "2", titulo: "Proyecto activo: Gestiona tu Airbnb en Málaga (Semana 3/12)" },
                { n: "3", titulo: "Evaluación competencial LOMLOE — 8 áreas (CLC, CPL, STEM, CD, CPSAA, CC, CE, CCEC)" },
                { n: "4", titulo: "Evidencias entregadas: 9/16 · Calidad general: Logro esperado" },
                { n: "5", titulo: "Historial de errores documentados y reflexiones del alumno" },
                { n: "6", titulo: "Observaciones del docente mentor — Prof. Ana Martínez" },
                { n: "7", titulo: "Escala LOMLOE: Logro sobresaliente en CE · Logro esperado en STEM y CLC" },
                { n: "8", titulo: "Recomendaciones para el 3er Trimestre 2025-26" },
              ],
              inspeccion: [
                { n: "1", titulo: `Centro: QHUMA Málaga · Grupo: 1º ESO · ${trimestreLabel[reportTrimestre]}` },
                { n: "2", titulo: "Programación curricular — Real Decreto 217/2022 (ESO)" },
                { n: "3", titulo: `Ratio docente-alumno: 1:12 · Alumnos activos: ${reportAlumnos.length}` },
                { n: "4", titulo: "Evaluación por competencias LOMLOE — criterios definidos y rúbricas de 4 niveles" },
                { n: "5", titulo: "Control de evidencias digitales por alumno y proyecto" },
                { n: "6", titulo: "Atención a la diversidad — seguimiento activo de 3 alumnos en riesgo" },
                { n: "7", titulo: "Coordinación familias: 100% con acceso al panel parental" },
                { n: "8", titulo: "Estado normativo: 8/10 puntos de checklist OK · 2 pendientes" },
              ],
              familia: [
                { n: "1", titulo: `Progreso general de ${reportAlumno.split(" ")[0]}: 72% completado este trimestre` },
                { n: "2", titulo: "Proyecto: Gestiona tu Airbnb en Málaga — aprendizaje real, resultados reales" },
                { n: "3", titulo: "Tareas completadas: 9 de 16 entregas · Racha activa: 12 días consecutivos" },
                { n: "4", titulo: "Puntos fuertes: Emprendimiento, Comunicación Digital, Análisis Financiero" },
                { n: "5", titulo: "Área de mejora: Gestión del tiempo en entregas de Fase 3" },
                { n: "6", titulo: "Próximos hitos: Demo Day (viernes) · Análisis de rentabilidad (Semana 4)" },
              ],
              individual: [
                { n: "1", titulo: `Alumno/a: ${reportAlumno} · Curso: ${alumnoData?.curso ?? "1º ESO"} · ${trimestreLabel[reportTrimestre]}` },
                { n: "2", titulo: "Proyecto activo: Gestiona tu Airbnb en Málaga" },
                { n: "3", titulo: "Evaluación de las 8 competencias LOMLOE" },
                { n: "4", titulo: "Evidencias entregadas: 9/16 · Calidad: Logro esperado" },
                { n: "5", titulo: "Historial de errores documentados y superados" },
                { n: "6", titulo: "Observaciones del docente mentor" },
                { n: "7", titulo: "Escala LOMLOE: Logro sobresaliente en CE (90%)" },
                { n: "8", titulo: "Recomendaciones para el siguiente trimestre" },
              ],
              grupo: [
                { n: "1", titulo: `Grupo: 1º ESO · ${reportAlumnos.length} alumnos · ${trimestreLabel[reportTrimestre]}` },
                { n: "2", titulo: "Proyecto activo: Gestiona tu Airbnb en Málaga (Semana 3/12)" },
                { n: "3", titulo: "Media competencial del grupo — 8 competencias LOMLOE" },
                { n: "4", titulo: `Evidencias entregadas (media): 9/16 · Alumnos en riesgo: 3` },
                { n: "5", titulo: "Alumnos destacados: 4 con Logro sobresaliente en CE" },
                { n: "6", titulo: "Distribución por niveles LOMLOE: 1/12 Inicio · 3/12 En proceso · 6/12 Logro · 2/12 Sobresaliente" },
              ],
            };
            const secciones = seccionesPorTipo[reportTipo] ?? seccionesPorTipo.individual;

            return (
              <div className="bg-card rounded-2xl border border-accent-text/20 p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-accent-light flex items-center justify-center">
                      <FileText size={14} className="text-accent-text" />
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-text-primary">
                        Informe {tipoLabel[reportTipo]} — {reportAlumno}
                      </p>
                      <p className="text-[10px] text-text-muted font-mono">{previewFilename}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <button
                      onClick={handleDescargar}
                      disabled={isDownloading}
                      className="flex items-center gap-1.5 bg-accent text-sidebar text-[11px] font-bold px-3 py-2 rounded-xl cursor-pointer hover:brightness-110 transition-all disabled:opacity-60"
                    >
                      {isDownloading ? <RefreshCw size={12} className="animate-spin" /> : <Download size={12} />}
                      {isDownloading ? lbl("Preparando...", "Preparing...") : lbl("Descargar PDF", "Download PDF")}
                    </button>
                    {downloadedFilename && (
                      <p className="text-[9px] text-success mt-1 font-mono truncate max-w-[220px]">{downloadedFilename}</p>
                    )}
                  </div>
                </div>

                {/* Estructura del informe preview */}
                <div className="bg-background rounded-xl p-4 font-mono text-[11px] space-y-2">
                  <p className="text-text-primary font-bold text-[12px]">
                    INFORME {tipoLabel[reportTipo].toUpperCase()} — LOMLOE 2022 — QHUMA MÁLAGA
                  </p>
                  <p className="text-text-muted">Generado: {new Date().toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
                  <div className="border-t border-card-border my-2" />
                  {secciones.map((s) => (
                    <p key={s.n} className="text-text-secondary">
                      <span className="text-accent-text font-bold">{s.n}.</span> {s.titulo}
                    </p>
                  ))}
                  <div className="border-t border-card-border my-2" />
                  <p className="text-text-muted text-[10px]">
                    Generado por QHUMA OS · Normativa Real Decreto 217/2022 · {new Date().toLocaleDateString("es-ES")}
                  </p>
                </div>

                {/* Escala LOMLOE resumen */}
                <div className="grid grid-cols-4 gap-2 mt-4">
                  {escalasLOMLOE.map((e) => (
                    <div key={e.nivel} className={`rounded-xl p-3 ${e.bg}`}>
                      <p className={`text-[10px] font-bold ${e.text} mb-0.5`}>Nivel {e.nivel}</p>
                      <p className={`text-[9px] font-semibold ${e.text}`}>{e.etiqueta}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Informes recientes */}
          <div className="bg-card rounded-2xl border border-card-border p-5">
            <h3 className="text-[13px] font-semibold text-text-primary mb-3">{lbl("Informes recientes", "Recent reports")}</h3>
            <div className="space-y-2.5">
              {[
                { nombre: "Informe LOMLOE — Semana 3 — 1º ESO", tipo: "LOMLOE", fecha: "Hoy 10:30", tamaño: "245 KB" },
                { nombre: "Evaluación competencial trimestral — Todos los grupos", tipo: "Evaluación", fecha: "Ayer 16:15", tamaño: "1.2 MB" },
                { nombre: "Narrativa de progreso — Lucas García", tipo: "Individual", fecha: "Ayer 11:00", tamaño: "87 KB" },
                { nombre: "Resumen mensual IA — Febrero 2026", tipo: "IA", fecha: "1 mar", tamaño: "334 KB" },
                { nombre: "Datos para inspección educativa — T1 2026", tipo: "Inspección", fecha: "28 feb", tamaño: "2.1 MB" },
              ].map((r) => (
                <div key={r.nombre} className="flex items-center gap-3 p-3 bg-background rounded-xl hover:border hover:border-card-border transition-all">
                  <div className="w-8 h-8 rounded-lg bg-accent-light flex items-center justify-center flex-shrink-0">
                    <FileText size={14} className="text-accent-text" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-medium text-text-primary truncate">{r.nombre}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[9px] font-bold bg-background border border-card-border px-1.5 py-0.5 rounded-full text-text-muted">{r.tipo}</span>
                      <span className="text-[9px] text-text-muted">{r.fecha} · {r.tamaño}</span>
                    </div>
                  </div>
                  <button className="text-text-muted hover:text-accent-text transition-colors cursor-pointer">
                    <Download size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* A28 — Estado de licencias y facturación */}
          {(() => {
            const modulosLicencia = [
              { id: "base",    nombre: "Plataforma base",     incluido: true,  activo: true,  precio: 1200, uso: "312 alumnos activos", usoPct: 62 },
              { id: "ia",      nombre: "IA Mentor",           incluido: true,  activo: true,  precio: 600,  uso: "1.84M tokens/mes",    usoPct: 74 },
              { id: "capital", nombre: "QHUMA Capital",       incluido: false, activo: true,  precio: 240,  uso: "3 proyectos activos", usoPct: 30 },
              { id: "analytics",nombre: "Analytics Pro",      incluido: false, activo: true,  precio: 180,  uso: "28 docentes",         usoPct: 100 },
              { id: "lomloe",  nombre: "Informes LOMLOE",     incluido: false, activo: false, precio: 120,  uso: "No activo",           usoPct: 0 },
            ];
            const facturasHistorial = [
              { id: "f1", fecha: "15 dic 2025", concepto: "Licencia trimestral Q1",  importe: "€600",  estado: "Pagada",   estadoCfg: { bg: "bg-success-light", text: "text-success" } },
              { id: "f2", fecha: "15 sep 2025", concepto: "Licencia trimestral Q4",  importe: "€600",  estado: "Pagada",   estadoCfg: { bg: "bg-success-light", text: "text-success" } },
              { id: "f3", fecha: "15 jun 2025", concepto: "Licencia trimestral Q3",  importe: "€600",  estado: "Pagada",   estadoCfg: { bg: "bg-success-light", text: "text-success" } },
              { id: "f4", fecha: "15 jun 2026", concepto: "Licencia trimestral Q2",  importe: "€600",  estado: "Pendiente",estadoCfg: { bg: "bg-warning-light",  text: "text-warning"  } },
            ];
            const seatsUsados = 312;
            const seatsTotal = 500;
            const seatsPct = Math.round((seatsUsados / seatsTotal) * 100);
            const precioExtra = ampliacionSeats > 500 ? Math.round((ampliacionSeats - 500) * 4.8) : 0;

            return (
              <div className="bg-card rounded-2xl border border-card-border p-5">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Landmark size={15} className="text-accent-text" />
                    <h3 className="text-[14px] font-semibold text-text-primary">Estado de licencias y facturación</h3>
                  </div>
                  <button
                    onClick={() => setLicenciaExpanded((v) => !v)}
                    className="flex items-center gap-1.5 text-[11px] text-text-muted hover:text-accent-text transition-colors cursor-pointer"
                  >
                    {licenciaExpanded ? <ChevronDown size={14} /> : <ArrowUp size={14} />}
                    {licenciaExpanded ? "Colapsar" : "Ver detalle"}
                  </button>
                </div>

                {/* KPIs principales */}
                <div className="grid grid-cols-4 gap-3 mb-4">
                  <div className="bg-sidebar rounded-xl p-3 text-center">
                    <span className="text-[18px] font-bold text-white block">QHUMA Pro</span>
                    <span className="text-[9px] text-white/50">Plan activo</span>
                  </div>
                  <div className="bg-accent-light rounded-xl p-3 text-center">
                    <span className="text-[18px] font-bold text-accent-text block">1 sept 2026</span>
                    <span className="text-[9px] text-text-muted">Renovación</span>
                  </div>
                  <div className={`rounded-xl p-3 text-center ${seatsPct > 80 ? "bg-warning-light" : "bg-success-light"}`}>
                    <span className={`text-[18px] font-bold block ${seatsPct > 80 ? "text-warning" : "text-success"}`}>{seatsUsados}/{seatsTotal}</span>
                    <span className="text-[9px] text-text-muted">Licencias usadas ({seatsPct}%)</span>
                  </div>
                  <div className="bg-background rounded-xl p-3 text-center">
                    <span className="text-[18px] font-bold text-text-primary block">€600</span>
                    <span className="text-[9px] text-text-muted">Próx. factura · 15 jun</span>
                  </div>
                </div>

                {/* Barra de uso de licencias */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-semibold text-text-muted">Uso de licencias ({seatsPct}%)</span>
                    <span className="text-[10px] text-text-muted">{seatsTotal - seatsUsados} disponibles</span>
                  </div>
                  <div className="h-2.5 bg-background rounded-full overflow-hidden border border-card-border">
                    <div
                      className={`h-full rounded-full transition-all ${seatsPct > 80 ? "bg-warning" : "bg-success"}`}
                      style={{ width: `${seatsPct}%` }}
                    />
                  </div>
                </div>

                {licenciaExpanded && (
                  <>
                    {/* Tabla de módulos */}
                    <div className="mb-4">
                      <h4 className="text-[12px] font-semibold text-text-primary mb-2">Módulos activos</h4>
                      <div className="space-y-1.5">
                        {modulosLicencia.map((mod) => (
                          <div key={mod.id} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 ${mod.activo ? "bg-background" : "bg-background/50 opacity-60"}`}>
                            <div className={`w-3 h-3 rounded-full flex-shrink-0 ${mod.activo ? "bg-success" : "bg-text-muted/30"}`} />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-[12px] font-medium text-text-primary">{mod.nombre}</span>
                                <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${mod.incluido ? "bg-accent-light text-accent-text" : "bg-warning-light text-warning"}`}>
                                  {mod.incluido ? "Incluido" : "Add-on"}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 mt-0.5">
                                <div className="w-20 h-1 bg-card rounded-full overflow-hidden">
                                  <div className="h-full bg-accent-text rounded-full" style={{ width: `${mod.usoPct}%` }} />
                                </div>
                                <span className="text-[9px] text-text-muted">{mod.uso}</span>
                              </div>
                            </div>
                            <span className="text-[11px] font-bold text-text-primary flex-shrink-0">€{mod.precio}/año</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 flex items-center justify-between px-3 py-2 bg-sidebar rounded-xl">
                        <span className="text-[11px] font-semibold text-white">Total anual</span>
                        <span className="text-[14px] font-bold text-accent">€{modulosLicencia.filter((m) => m.activo).reduce((s, m) => s + m.precio, 0).toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Historial de facturación */}
                    <div className="mb-4">
                      <h4 className="text-[12px] font-semibold text-text-primary mb-2">Historial de facturación</h4>
                      <div className="space-y-1.5">
                        {facturasHistorial.map((f) => (
                          <div key={f.id} className="flex items-center gap-3 p-2.5 bg-background rounded-xl">
                            <div className="flex-1 min-w-0">
                              <p className="text-[11px] font-medium text-text-primary">{f.concepto}</p>
                              <span className="text-[9px] text-text-muted">{f.fecha}</span>
                            </div>
                            <span className="text-[12px] font-bold text-text-primary">{f.importe}</span>
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${f.estadoCfg.bg} ${f.estadoCfg.text}`}>{f.estado}</span>
                            <button
                              onClick={() => handleDescargarFactura(f.id, `factura_qhuma_${f.id}_${f.fecha.replace(/\s/g, "_")}`)}
                              className="flex-shrink-0 text-text-muted hover:text-accent-text transition-colors cursor-pointer"
                              title="Descargar factura"
                            >
                              {descargandoFactura === f.id ? <RefreshCw size={13} className="animate-spin" /> : <Download size={13} />}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Solicitar ampliación */}
                    {ampliacionSolicitada ? (
                      <div className="flex items-center gap-2 bg-success-light rounded-xl px-4 py-3">
                        <CheckCircle2 size={16} className="text-success" />
                        <div>
                          <p className="text-[12px] font-semibold text-success">Solicitud enviada correctamente</p>
                          <p className="text-[10px] text-text-muted">Recibirás una propuesta en 24-48h hábiles</p>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-background rounded-xl p-4 border border-card-border">
                        <h4 className="text-[12px] font-semibold text-text-primary mb-2">Solicitar ampliación de licencias</h4>
                        <div className="mb-3">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-[10px] text-text-muted">Nº de licencias</span>
                            <span className="text-[11px] font-bold text-text-primary">{ampliacionSeats} alumnos</span>
                          </div>
                          <input
                            type="range"
                            min={500}
                            max={1000}
                            step={50}
                            value={ampliacionSeats}
                            onChange={(e) => setAmpliacionSeats(parseInt(e.target.value))}
                            className="w-full accent-sidebar cursor-pointer"
                          />
                          <div className="flex justify-between text-[9px] text-text-muted mt-0.5">
                            <span>500</span>
                            <span>1.000</span>
                          </div>
                        </div>
                        {ampliacionSeats > 500 && (
                          <p className="text-[10px] text-text-muted mb-3">
                            Coste adicional estimado: <span className="font-bold text-text-primary">€{precioExtra}/año</span> (€4,80/alumno extra)
                          </p>
                        )}
                        <button
                          onClick={handleSolicitarAmpliacion}
                          disabled={ampliacionSeats <= 500 || solicitandoAmpliacion}
                          className="w-full bg-sidebar text-white py-2 rounded-xl text-[12px] font-semibold hover:brightness-110 transition-all cursor-pointer disabled:opacity-40 flex items-center justify-center gap-1.5"
                        >
                          {solicitandoAmpliacion ? (
                            <><RefreshCw size={12} className="animate-spin" />Solicitando...</>
                          ) : (
                            <>Solicitar ampliación a {ampliacionSeats} alumnos</>
                          )}
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })()}
        </div>
      )}
      {/* ─── TAB: INSPECCIÓN ─── */}
      {activeView === "inspection" && (() => {
        const inspeccionAlumnos = usuariosMock
          .filter((u) => u.rol === "Alumno")
          .map((u, i) => ({
            ...u,
            proyecto: i < 5 ? ["Airbnb Málaga", "Huerto Urbano Digital", "Podcast Escolar", "App Intercambio", "Estudio Animación"][i] : "Airbnb Málaga",
            progreso: [72, 88, 45, 91, 67, 54, 38, 80, 76, 62][i] ?? 60,
            evidencias: [9, 14, 6, 16, 11, 8, 5, 13, 10, 9][i] ?? 8,
            nivelLomloe: [3, 4, 2, 4, 3, 2, 1, 3, 3, 2][i] as 1 | 2 | 3 | 4 ?? 2,
          }));

        const nivelLomloeCfg: Record<number, { label: string; bg: string; text: string }> = {
          1: { label: "Inicio",        bg: "bg-urgent-light",  text: "text-urgent" },
          2: { label: "En proceso",    bg: "bg-warning-light", text: "text-warning" },
          3: { label: "Logro esp.",    bg: "bg-accent-light",  text: "text-accent-text" },
          4: { label: "Sobresaliente", bg: "bg-success-light", text: "text-success" },
        };

        const checklist = [
          { ok: true,  texto: "Programación curricular alineada con Real Decreto 217/2022 (ESO)" },
          { ok: true,  texto: "Evaluación por competencias LOMLOE — 8 áreas activas" },
          { ok: true,  texto: "Criterios de evaluación definidos por tarea y rúbrica de 4 niveles" },
          { ok: true,  texto: "Evidencias de aprendizaje digitales con control de entrega" },
          { ok: true,  texto: "Informe de progreso trimestral por alumno exportable" },
          { ok: true,  texto: "Ratio docente-alumno: 1:12 (dentro del límite normativo)" },
          { ok: false, texto: "Actas de evaluación firmadas por el claustro — pendiente T2" },
          { ok: true,  texto: "Atención a la diversidad: seguimiento activo de 3 alumnos en riesgo" },
          { ok: true,  texto: "Coordinación con familias: 100% con acceso al panel parental" },
          { ok: false, texto: "Memoria anual de curso — pendiente de redactar (entrega junio 2026)" },
        ];

        const cumplimiento = Math.round((checklist.filter((c) => c.ok).length / checklist.length) * 100);

        return (
          <div className="space-y-5">
            {/* KPIs de inspección */}
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: lbl("Alumnos activos","Active students"),          valor: "12",   sub: lbl("1º y 2º ESO","Year 7 & Year 8"),          bg: "bg-card", textV: "text-text-primary" },
                { label: lbl("Cumplimiento LOMLOE","LOMLOE compliance"),    valor: `${cumplimiento}%`, sub: "8/10 " + lbl("requisitos","requirements"), bg: "bg-success-light", textV: "text-success" },
                { label: lbl("Evidencias entregadas","Submitted evidence"), valor: "127",  sub: lbl("de 192 posibles","out of 192"),             bg: "bg-accent-light",  textV: "text-accent-text" },
                { label: lbl("Proyectos en curso","Active projects"),       valor: "14",   sub: lbl("4 colegios activos","4 active schools"),   bg: "bg-card", textV: "text-text-primary" },
              ].map((k) => (
                <div key={k.label} className={`${k.bg} rounded-2xl border border-card-border p-4`}>
                  <p className={`text-[28px] font-bold ${k.textV} leading-none mb-1`}>{k.valor}</p>
                  <p className="text-[11px] font-semibold text-text-primary">{k.label}</p>
                  <p className="text-[10px] text-text-muted">{k.sub}</p>
                </div>
              ))}
            </div>

            {/* Tabla de alumnos */}
            <div className="bg-card rounded-2xl border border-card-border p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Users size={15} className="text-accent-text" />
                  <h3 className="text-[14px] font-semibold text-text-primary">{lbl("Progreso por alumno","Student progress")} — {trimestreLabel["2"]}</h3>
                </div>
                <button className="flex items-center gap-1.5 bg-accent text-sidebar text-[11px] font-bold px-3 py-1.5 rounded-xl cursor-pointer hover:brightness-110 transition-all">
                  <Download size={12} />
                  {lbl("Exportar para inspección", "Export for inspection")}
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-card-border">
                      {[lbl("Alumno","Student"), lbl("Curso","Grade"), lbl("Proyecto","Project"), lbl("Progreso","Progress"), lbl("Evidencias","Evidence"), lbl("Nivel LOMLOE","LOMLOE Level"), lbl("Estado","Status")].map((h) => (
                        <th key={h} className="text-left text-[10px] font-bold text-text-muted uppercase tracking-wide py-2 px-2">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {inspeccionAlumnos.map((a) => {
                      const nlCfg = nivelLomloeCfg[a.nivelLomloe];
                      return (
                        <tr key={a.id} className="border-b border-card-border/50 hover:bg-background transition-colors">
                          <td className="py-2.5 px-2">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-sidebar text-white text-[9px] font-bold flex items-center justify-center flex-shrink-0">
                                {a.nombre.split(" ").map(n => n[0]).join("").slice(0, 2)}
                              </div>
                              <span className="text-[11px] font-medium text-text-primary">{a.nombre}</span>
                            </div>
                          </td>
                          <td className="py-2.5 px-2 text-[11px] text-text-muted">{a.curso}</td>
                          <td className="py-2.5 px-2 text-[11px] text-text-secondary truncate max-w-[140px]">{a.proyecto}</td>
                          <td className="py-2.5 px-2">
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-1.5 bg-background rounded-full overflow-hidden">
                                <div className="h-full rounded-full bg-accent-text" style={{ width: `${a.progreso}%` }} />
                              </div>
                              <span className="text-[10px] font-bold text-text-primary">{a.progreso}%</span>
                            </div>
                          </td>
                          <td className="py-2.5 px-2 text-[11px] text-text-secondary">{a.evidencias}/16</td>
                          <td className="py-2.5 px-2">
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${nlCfg.bg} ${nlCfg.text}`}>
                              {a.nivelLomloe} — {nlCfg.label}
                            </span>
                          </td>
                          <td className="py-2.5 px-2">
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${a.activo ? "bg-success-light text-success" : "bg-urgent-light text-urgent"}`}>
                              {a.activo ? lbl("Activo","Active") : lbl("Inactivo","Inactive")}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Checklist normativo */}
            <div className="bg-card rounded-2xl border border-card-border p-5">
              <div className="flex items-center gap-2 mb-4">
                <ClipboardCheck size={15} className="text-accent-text" />
                <h3 className="text-[14px] font-semibold text-text-primary">{lbl("Cumplimiento normativo — Real Decreto 217/2022", "Regulatory compliance — Royal Decree 217/2022")}</h3>
                <span className={`ml-auto text-[10px] font-bold px-2.5 py-1 rounded-full ${cumplimiento >= 80 ? "bg-success-light text-success" : "bg-warning-light text-warning"}`}>
                  {checklist.filter(c => c.ok).length}/{checklist.length} requisitos
                </span>
              </div>
              <div className="space-y-2">
                {checklist.map((item, i) => (
                  <div key={i} className={`flex items-start gap-3 p-3 rounded-xl ${item.ok ? "bg-success-light" : "bg-urgent-light"}`}>
                    {item.ok
                      ? <CheckCircle2 size={14} className="text-success flex-shrink-0 mt-0.5" />
                      : <AlertTriangle size={14} className="text-urgent flex-shrink-0 mt-0.5" />
                    }
                    <p className={`text-[11px] leading-relaxed ${item.ok ? "text-text-secondary" : "text-urgent"}`}>
                      {item.texto}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Documentos disponibles */}
            <div className="bg-card rounded-2xl border border-card-border p-5">
              <div className="flex items-center gap-2 mb-3">
                <FileText size={14} className="text-accent-text" />
                <h3 className="text-[13px] font-semibold text-text-primary">{lbl("Documentación para inspección", "Inspection documentation")}</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { nombre: "Programación didáctica completa — 2025-26",     estado: "listo" },
                  { nombre: "Evaluación competencial por alumno — T2",        estado: "listo" },
                  { nombre: "Rúbricas de evaluación — todas las tareas",      estado: "listo" },
                  { nombre: "Informe de atención a la diversidad",            estado: "listo" },
                  { nombre: "Actas de evaluación del claustro — T2",          estado: "pendiente" },
                  { nombre: "Memoria anual 2025-26",                          estado: "pendiente" },
                ].map((doc) => (
                  <div key={doc.nombre} className="flex items-center gap-3 bg-background rounded-xl p-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${doc.estado === "listo" ? "bg-success-light" : "bg-warning-light"}`}>
                      {doc.estado === "listo"
                        ? <Download size={13} className="text-success" />
                        : <Clock size={13} className="text-warning" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-medium text-text-primary leading-snug truncate">{doc.nombre}</p>
                      <span className={`text-[9px] font-bold ${doc.estado === "listo" ? "text-success" : "text-warning"}`}>
                        {doc.estado === "listo" ? lbl("Disponible para descarga","Available for download") : lbl("Pendiente de preparar","Pending preparation")}
                      </span>
                    </div>
                    {doc.estado === "listo" && (
                      <button className="text-text-muted hover:text-accent-text transition-colors cursor-pointer flex-shrink-0">
                        <Download size={13} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* A24 — Panel Integridad académica */}
            {(() => {
              const integridadAlertas = [
                {
                  id: "ia1",
                  alumno1: "Lucas García", alumno2: "Pablo Ruiz",
                  tarea: "Análisis de precios Airbnb Málaga",
                  similitud: 91,
                  competencia: "STEM",
                  fecha: "Hoy 09:42",
                },
                {
                  id: "ia2",
                  alumno1: "Sofía Torres", alumno2: "Ana Martín",
                  tarea: "Redacción del listing en inglés",
                  similitud: 83,
                  competencia: "CLC",
                  fecha: "Hoy 11:15",
                },
                {
                  id: "ia3",
                  alumno1: "Diego López", alumno2: "Carlos Rivera",
                  tarea: "Modelo financiero — punto de equilibrio",
                  similitud: 78,
                  competencia: "STEM",
                  fecha: "Ayer 16:30",
                },
                {
                  id: "ia4",
                  alumno1: "María Santos", alumno2: "Laura Sanz",
                  tarea: "Brand board de identidad visual",
                  similitud: 75,
                  competencia: "CCEC",
                  fecha: "Ayer 14:05",
                },
                {
                  id: "ia5",
                  alumno1: "Tomás Herrera", alumno2: "Valentina Cruz",
                  tarea: "Plantillas de comunicación con huéspedes",
                  similitud: 88,
                  competencia: "CE",
                  fecha: "8 mar",
                },
              ];

              const alertasVisibles = integridadAlertas.filter(
                (a) => !alertasIgnoradas.has(a.id)
              );
              const totalEsta = integridadAlertas.length;
              const revisadas = alertasRevisadas.size;
              const pendientes = alertasVisibles.filter((a) => !alertasRevisadas.has(a.id)).length;

              return (
                <div className="bg-card rounded-2xl border border-card-border p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Shield size={15} className="text-urgent" />
                    <h3 className="text-[14px] font-semibold text-text-primary">{lbl("Integridad académica", "Academic integrity")}</h3>
                    <span className="ml-auto text-[9px] font-bold bg-urgent-light text-urgent px-2 py-0.5 rounded-full">
                      {pendientes} {lbl("pendientes", "pending")}
                    </span>
                  </div>

                  {/* KPIs resumen */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {[
                      { label: lbl("Alertas esta semana", "Alerts this week"), valor: totalEsta, bg: "bg-background", textV: "text-text-primary" },
                      { label: lbl("Revisadas", "Reviewed"), valor: revisadas, bg: "bg-success-light", textV: "text-success" },
                      { label: lbl("Pendientes", "Pending"), valor: pendientes, bg: "bg-urgent-light", textV: "text-urgent" },
                    ].map((k) => (
                      <div key={k.label} className={`${k.bg} rounded-xl p-3 text-center border border-card-border`}>
                        <span className={`text-[22px] font-bold ${k.textV} block`}>{k.valor}</span>
                        <span className="text-[9px] text-text-muted">{k.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Lista de alertas */}
                  <div className="space-y-3">
                    {alertasVisibles.map((alerta) => {
                      const isRevisada = alertasRevisadas.has(alerta.id);
                      const isClarificando = solicitandoClarificacion === alerta.id;
                      const isClarificada = clarificacionEnviada.has(alerta.id);
                      const esUrgente = alerta.similitud > 85;

                      return (
                        <div
                          key={alerta.id}
                          className={`rounded-xl p-3.5 border transition-all ${
                            isRevisada ? "bg-success-light border-success/20 opacity-70" :
                            esUrgente ? "bg-urgent-light border-urgent/20" :
                            "bg-warning-light border-warning/20"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            {/* Avatares */}
                            <div className="flex items-center flex-shrink-0">
                              <div className="w-7 h-7 rounded-full bg-sidebar text-white text-[9px] font-bold flex items-center justify-center">
                                {alerta.alumno1.split(" ").map(n => n[0]).join("").slice(0,2)}
                              </div>
                              <div className="w-7 h-7 rounded-full bg-accent-text text-white text-[9px] font-bold flex items-center justify-center -ml-2">
                                {alerta.alumno2.split(" ").map(n => n[0]).join("").slice(0,2)}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                <p className="text-[12px] font-semibold text-text-primary truncate">
                                  {alerta.alumno1} · {alerta.alumno2}
                                </p>
                                <span className={`flex-shrink-0 text-[8px] font-bold px-1.5 py-0.5 rounded-full ${esUrgente ? "bg-urgent text-white" : "bg-warning text-white"}`}>
                                  {esUrgente ? lbl("Urgente", "Urgent") : lbl("Aviso", "Warning")}
                                </span>
                              </div>
                              <p className="text-[10px] text-text-secondary mb-1 truncate">{alerta.tarea}</p>
                              <div className="flex items-center gap-2 mb-2">
                                {/* Barra de similitud */}
                                <div className="flex-1 h-1.5 bg-card rounded-full overflow-hidden max-w-[100px]">
                                  <div
                                    className={`h-full rounded-full ${esUrgente ? "bg-urgent" : "bg-warning"}`}
                                    style={{ width: `${alerta.similitud}%` }}
                                  />
                                </div>
                                <span className={`text-[10px] font-bold ${esUrgente ? "text-urgent" : "text-warning"}`}>
                                  {alerta.similitud}% {lbl("similitud", "similarity")}
                                </span>
                                <span className="text-[8px] font-bold bg-sidebar/10 text-accent-text px-1.5 py-0.5 rounded-full">{alerta.competencia}</span>
                                <span className="text-[9px] text-text-muted ml-auto">{alerta.fecha}</span>
                              </div>
                              {/* Acciones */}
                              {!isRevisada && (
                                <div className="flex gap-1.5 flex-wrap">
                                  <button
                                    onClick={() => setAlertasRevisadas((prev) => new Set(prev).add(alerta.id))}
                                    className="text-[9px] font-semibold bg-success-light text-success border border-success/20 px-2 py-1 rounded-lg hover:bg-success/10 transition-all cursor-pointer"
                                  >
                                    {lbl("Marcar revisada", "Mark reviewed")}
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (isClarificando) return;
                                      setSolicitandoClarificacion(alerta.id);
                                      setTimeout(() => {
                                        setClarificacionEnviada((prev) => new Set(prev).add(alerta.id));
                                        setSolicitandoClarificacion(null);
                                      }, 900);
                                    }}
                                    className={`text-[9px] font-semibold border px-2 py-1 rounded-lg transition-all cursor-pointer ${
                                      isClarificada
                                        ? "bg-success-light text-success border-success/20"
                                        : "bg-card text-text-secondary border-card-border hover:border-accent-text/30"
                                    }`}
                                  >
                                    {isClarificando ? lbl("Enviando...", "Sending...") : isClarificada ? lbl("Notificación enviada", "Notification sent") : lbl("Solicitar aclaración", "Request clarification")}
                                  </button>
                                  <button
                                    onClick={() => setAlertasIgnoradas((prev) => new Set(prev).add(alerta.id))}
                                    className="text-[9px] font-semibold text-text-muted hover:text-urgent transition-colors cursor-pointer px-2 py-1"
                                  >
                                    {lbl("Ignorar", "Ignore")}
                                  </button>
                                </div>
                              )}
                              {isRevisada && (
                                <div className="flex items-center gap-1">
                                  <CheckCircle2 size={11} className="text-success" />
                                  <span className="text-[10px] text-success font-semibold">{lbl("Revisada", "Reviewed")}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {alertasVisibles.length === 0 && (
                      <div className="text-center py-6">
                        <CheckCircle2 size={24} className="text-success mx-auto mb-2" />
                        <p className="text-[12px] text-text-secondary">{lbl("Todas las alertas han sido gestionadas", "All alerts have been handled")}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        );
      })()}

      {/* ─── TAB: MÉTRICAS (A8 — AdminMetricas) ─── */}
      {activeView === "metrics" && (() => {
        const riesgoAlumnos = [
          { nombre: "Pablo Ruiz",     curso: "1º ESO", racha: 0,  evidencias: 2,  score: 15, nivel: "Alto" },
          { nombre: "Tomás Herrera",  curso: "2º ESO", racha: 2,  evidencias: 6,  score: 32, nivel: "Medio" },
          { nombre: "Carmen Vega",    curso: "1º ESO", racha: 5,  evidencias: 10, score: 64, nivel: "Bajo" },
        ];
        const engagementSemanal = [
          { semana: "Sem 1 Feb", activos: 68, total: 12 },
          { semana: "Sem 2 Feb", activos: 75, total: 12 },
          { semana: "Sem 3 Feb", activos: 72, total: 12 },
          { semana: "Sem 1 Mar", activos: 78, total: 12 },
        ];
        const comparativaColegios = [
          { nombre: "QHUMA Málaga", retencion: 96, engagement: 78, evidencias: 66, lomloe: 89 },
          { nombre: "QHUMA Madrid", retencion: 91, engagement: 71, evidencias: 58, lomloe: 83 },
        ];
        const metricas = [
          { nombre: "Retención", max: 100, color: "bg-success" },
          { nombre: "Engagement", max: 100, color: "bg-accent-text" },
          { nombre: "Evidencias %", max: 100, color: "bg-warning" },
          { nombre: "Cumpl. LOMLOE", max: 100, color: "bg-sidebar" },
        ];
        const riesgoNivelCfg: Record<string, { bg: string; text: string }> = {
          Alto:  { bg: "bg-urgent-light",  text: "text-urgent" },
          Medio: { bg: "bg-warning-light", text: "text-warning" },
          Bajo:  { bg: "bg-accent-light",  text: "text-accent-text" },
        };

        return (
          <div className="space-y-5">
            {/* KPIs globales */}
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: lbl("Tasa de retención","Retention rate"),      valor: "96%",  sub: lbl("+2% vs trimestre anterior","+2% vs previous term"), bg: "bg-success-light", textV: "text-success" },
                { label: lbl("Engagement semanal","Weekly engagement"),   valor: "78%",  sub: lbl("Alumnos activos hoy","Active students today"),     bg: "bg-accent-light",  textV: "text-accent-text" },
                { label: lbl("Cumplimiento LOMLOE","LOMLOE compliance"),  valor: "89%",  sub: lbl("8 competencias evaluadas","8 competencies assessed"), bg: "bg-card",        textV: "text-text-primary" },
                { label: lbl("Alumnos en riesgo","At-risk students"),     valor: "3",    sub: lbl("Scoring < 40 — intervenir","Score < 40 — intervene"), bg: "bg-urgent-light", textV: "text-urgent" },
              ].map((k) => (
                <div key={k.label} className={`${k.bg} rounded-2xl border border-card-border p-4`}>
                  <p className={`text-[28px] font-bold ${k.textV} leading-none mb-1`}>{k.valor}</p>
                  <p className="text-[11px] font-semibold text-text-primary">{k.label}</p>
                  <p className="text-[10px] text-text-muted">{k.sub}</p>
                </div>
              ))}
            </div>

            {/* Comparativa entre colegios + Engagement semanal */}
            <div className="flex gap-5">
              {/* Comparativa */}
              <div className="flex-1 bg-card rounded-2xl border border-card-border p-5">
                <h3 className="text-[14px] font-semibold text-text-primary mb-4">{lbl("Comparativa entre colegios QHUMA", "QHUMA schools comparison")}</h3>
                <div className="flex flex-col gap-4">
                  {metricas.map((metrica, mi) => {
                    const vals = comparativaColegios.map((c) => {
                      const arr = [c.retencion, c.engagement, c.evidencias, c.lomloe];
                      return arr[mi];
                    });
                    return (
                      <div key={metrica.nombre}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] font-medium text-text-secondary">{metrica.nombre}</span>
                        </div>
                        {comparativaColegios.map((col, ci) => (
                          <div key={col.nombre} className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] text-text-muted w-28 truncate">{col.nombre.replace("QHUMA ", "")}</span>
                            <div className="flex-1 h-2 rounded-full bg-background overflow-hidden">
                              <div
                                className={`h-full rounded-full ${metrica.color}`}
                                style={{ width: `${vals[ci]}%`, opacity: ci === 0 ? 1 : 0.6 }}
                              />
                            </div>
                            <span className="text-[10px] font-bold text-text-primary w-8 text-right">{vals[ci]}%</span>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* A13: Engagement semanal / diario con toggle */}
              {(() => {
                const actividadDiaria = [
                  { label: "Lun", activos: 71 },
                  { label: "Mar", activos: 78 },
                  { label: "Mié", activos: 82 },
                  { label: "Jue", activos: 75 },
                  { label: "Vie", activos: 68 },
                  { label: "Sáb", activos: 32 },
                  { label: "Dom", activos: 18 },
                ];
                const actividadMensual = [
                  { label: "Sem 1", activos: 68 },
                  { label: "Sem 2", activos: 75 },
                  { label: "Sem 3", activos: 72 },
                  { label: "Sem 4", activos: 78 },
                ];
                const datos = metricsVista === "semana" ? actividadDiaria : actividadMensual;
                const maxActivos = Math.max(...datos.map((d) => d.activos));
                return (
                  <div className="w-[280px] flex-shrink-0 bg-card rounded-2xl border border-card-border p-5">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-[14px] font-semibold text-text-primary">{lbl("Actividad", "Activity")}</h3>
                      <div className="flex bg-background rounded-lg p-0.5 gap-0.5">
                        <button
                          onClick={() => setMetricsVista("semana")}
                          className={`text-[9px] font-bold px-2 py-1 rounded-md cursor-pointer transition-all ${metricsVista === "semana" ? "bg-card text-text-primary shadow-sm" : "text-text-muted hover:text-text-secondary"}`}
                        >
                          {lbl("Semana", "Week")}
                        </button>
                        <button
                          onClick={() => setMetricsVista("mes")}
                          className={`text-[9px] font-bold px-2 py-1 rounded-md cursor-pointer transition-all ${metricsVista === "mes" ? "bg-card text-text-primary shadow-sm" : "text-text-muted hover:text-text-secondary"}`}
                        >
                          {lbl("Mes", "Month")}
                        </button>
                      </div>
                    </div>
                    <p className="text-[11px] text-text-muted mb-4">
                      {metricsVista === "semana" ? "% alumnos activos · últimos 7 días" : "% alumnos activos · últimas 4 semanas"}
                    </p>
                    <div className="flex items-end gap-2 h-32">
                      {datos.map((d) => {
                        const pct = Math.round((d.activos / maxActivos) * 100);
                        const isWeekend = metricsVista === "semana" && (d.label === "Sáb" || d.label === "Dom");
                        return (
                          <div key={d.label} className="flex-1 flex flex-col items-center gap-1">
                            <span className={`text-[9px] font-bold ${isWeekend ? "text-text-muted" : "text-accent-text"}`}>
                              {d.activos}%
                            </span>
                            <div className="w-full bg-background rounded-t-lg overflow-hidden flex-1 flex items-end">
                              <div
                                className={`w-full rounded-t-lg transition-all ${isWeekend ? "bg-text-muted/30" : "bg-accent-text/80"}`}
                                style={{ height: `${pct}%` }}
                              />
                            </div>
                            <span className="text-[8px] text-text-muted text-center leading-tight">{d.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* A18 — Análisis comparativo ampliado */}
            {(() => {
              const evolucionMensual: Record<"retencion" | "engagement" | "evidencias" | "lomloe", { mes: string; malaga: number; madrid: number }[]> = {
                retencion:  [{ mes: "Dic", malaga: 93, madrid: 88 }, { mes: "Ene", malaga: 94, madrid: 89 }, { mes: "Feb", malaga: 95, madrid: 90 }, { mes: "Mar", malaga: 96, madrid: 91 }],
                engagement: [{ mes: "Dic", malaga: 70, madrid: 65 }, { mes: "Ene", malaga: 73, madrid: 67 }, { mes: "Feb", malaga: 76, madrid: 70 }, { mes: "Mar", malaga: 78, madrid: 71 }],
                evidencias: [{ mes: "Dic", malaga: 55, madrid: 48 }, { mes: "Ene", malaga: 58, madrid: 52 }, { mes: "Feb", malaga: 62, madrid: 55 }, { mes: "Mar", malaga: 66, madrid: 58 }],
                lomloe:     [{ mes: "Dic", malaga: 84, madrid: 79 }, { mes: "Ene", malaga: 86, madrid: 80 }, { mes: "Feb", malaga: 88, madrid: 82 }, { mes: "Mar", malaga: 89, madrid: 83 }],
              };
              const comparativaCompetencias = [
                { comp: "CLC",   malaga: 72, madrid: 68 },
                { comp: "CPL",   malaga: 58, madrid: 63 },
                { comp: "STEM",  malaga: 85, madrid: 79 },
                { comp: "CD",    malaga: 88, madrid: 76 },
                { comp: "CPSAA", malaga: 74, madrid: 71 },
                { comp: "CC",    malaga: 68, madrid: 70 },
                { comp: "CE",    malaga: 90, madrid: 82 },
                { comp: "CCEC",  malaga: 55, madrid: 62 },
              ];
              const metricaLabels: Record<"retencion" | "engagement" | "evidencias" | "lomloe", string> = {
                retencion: "Retención", engagement: "Engagement", evidencias: "Evidencias %", lomloe: "Cumpl. LOMLOE",
              };
              const datosEvol = evolucionMensual[comparativaMetrica];
              const maxEvol = Math.max(...datosEvol.flatMap((d) => [d.malaga, d.madrid]));
              return (
                <div className="bg-card rounded-2xl border border-card-border p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <BarChart3 size={14} className="text-accent-text" />
                    <h3 className="text-[14px] font-semibold text-text-primary">{lbl("Análisis comparativo ampliado", "Extended comparative analysis")}</h3>
                    {/* Toggle de métrica */}
                    <div className="ml-auto flex gap-1 bg-background rounded-xl border border-card-border p-0.5">
                      {(["retencion", "engagement", "evidencias", "lomloe"] as const).map((m) => (
                        <button
                          key={m}
                          onClick={() => setComparativaMetrica(m)}
                          className={`text-[9px] font-bold px-2.5 py-1 rounded-lg cursor-pointer transition-all ${
                            comparativaMetrica === m ? "bg-sidebar text-white" : "text-text-muted hover:text-text-secondary"
                          }`}
                        >
                          {metricaLabels[m]}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-5">
                    {/* Evolución mensual side-by-side */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-[11px] font-semibold text-text-secondary">Evolución mensual · {metricaLabels[comparativaMetrica]}</span>
                        <div className="flex items-center gap-2 ml-auto">
                          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-sidebar" /><span className="text-[9px] text-text-muted">Málaga</span></div>
                          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-accent-text/50" /><span className="text-[9px] text-text-muted">Madrid</span></div>
                        </div>
                      </div>
                      <div className="flex items-end gap-3 h-28">
                        {datosEvol.map((d) => {
                          const hMalaga = Math.round((d.malaga / maxEvol) * 100);
                          const hMadrid = Math.round((d.madrid / maxEvol) * 100);
                          const diff = d.malaga - d.madrid;
                          return (
                            <div key={d.mes} className="flex-1 flex flex-col items-center gap-1">
                              <div className="flex items-end gap-1 h-20 w-full justify-center">
                                <div className="flex flex-col items-center gap-0.5 w-5">
                                  <span className="text-[8px] font-bold text-sidebar">{d.malaga}%</span>
                                  <div className="w-full bg-sidebar rounded-t-md" style={{ height: `${hMalaga}%`, minHeight: 4 }} />
                                </div>
                                <div className="flex flex-col items-center gap-0.5 w-5">
                                  <span className="text-[8px] font-bold text-accent-text/70">{d.madrid}%</span>
                                  <div className="w-full bg-accent-text/50 rounded-t-md" style={{ height: `${hMadrid}%`, minHeight: 4 }} />
                                </div>
                              </div>
                              <div className="flex flex-col items-center gap-0.5">
                                <span className="text-[8px] text-text-muted">{d.mes}</span>
                                <span className={`text-[8px] font-bold px-1 rounded ${diff > 0 ? "text-success bg-success-light" : diff < 0 ? "text-urgent bg-urgent-light" : "text-text-muted"}`}>
                                  {diff > 0 ? `+${diff}` : diff === 0 ? "=" : diff}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Radar competencias por colegio */}
                    <div className="w-[340px] flex-shrink-0">
                      <p className="text-[11px] font-semibold text-text-secondary mb-3">{lbl("Radar competencias LOMLOE", "LOMLOE competency radar")}</p>
                      <div className="space-y-1.5">
                        {comparativaCompetencias.map((c) => {
                          const diff = c.malaga - c.madrid;
                          const maxVal = Math.max(c.malaga, c.madrid);
                          return (
                            <div key={c.comp} className="flex items-center gap-2">
                              <span className="text-[9px] font-bold text-text-secondary w-10">{c.comp}</span>
                              <div className="flex-1 flex flex-col gap-0.5">
                                <div className="flex items-center gap-1">
                                  <div className="flex-1 h-1.5 bg-background rounded-full overflow-hidden">
                                    <div className="h-full bg-sidebar rounded-full" style={{ width: `${(c.malaga / maxVal) * 100}%` }} />
                                  </div>
                                  <span className="text-[8px] font-bold text-sidebar w-6 text-right">{c.malaga}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <div className="flex-1 h-1.5 bg-background rounded-full overflow-hidden">
                                    <div className="h-full bg-accent-text/50 rounded-full" style={{ width: `${(c.madrid / maxVal) * 100}%` }} />
                                  </div>
                                  <span className="text-[8px] font-bold text-accent-text/60 w-6 text-right">{c.madrid}</span>
                                </div>
                              </div>
                              <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 w-10 text-center ${
                                diff > 0 ? "bg-success-light text-success" : diff < 0 ? "bg-urgent-light text-urgent" : "bg-background text-text-muted"
                              }`}>
                                {diff > 0 ? `+${diff}` : diff === 0 ? "=" : `${diff}`}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex items-center gap-4 mt-3 pt-2 border-t border-card-border">
                        <div className="flex items-center gap-1"><div className="w-2 h-1.5 rounded-sm bg-sidebar" /><span className="text-[9px] text-text-muted">Málaga</span></div>
                        <div className="flex items-center gap-1"><div className="w-2 h-1.5 rounded-sm bg-accent-text/50" /><span className="text-[9px] text-text-muted">Madrid</span></div>
                        <span className="text-[9px] text-text-muted ml-auto">Badge = diferencia Mlg−Mad</span>
                      </div>
                    </div>
                  </div>
                  {/* A19 — Botones de exportación */}
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-card-border">
                    <button
                      onClick={() => {
                        setExportandoComparativa(true);
                        setTimeout(() => {
                          const rows: string[] = ["Colegio,Metrica,Dic,Ene,Feb,Mar"];
                          const metricas = ["retencion", "engagement", "evidencias", "lomloe"] as const;
                          const metricaLabelsLocal: Record<string, string> = { retencion: "Retención", engagement: "Engagement", evidencias: "Evidencias %", lomloe: "Cumpl. LOMLOE" };
                          const evMensual: Record<string, { mes: string; malaga: number; madrid: number }[]> = {
                            retencion:  [{ mes: "Dic", malaga: 93, madrid: 88 }, { mes: "Ene", malaga: 94, madrid: 89 }, { mes: "Feb", malaga: 95, madrid: 90 }, { mes: "Mar", malaga: 96, madrid: 91 }],
                            engagement: [{ mes: "Dic", malaga: 70, madrid: 65 }, { mes: "Ene", malaga: 73, madrid: 67 }, { mes: "Feb", malaga: 76, madrid: 70 }, { mes: "Mar", malaga: 78, madrid: 71 }],
                            evidencias: [{ mes: "Dic", malaga: 55, madrid: 48 }, { mes: "Ene", malaga: 58, madrid: 52 }, { mes: "Feb", malaga: 62, madrid: 55 }, { mes: "Mar", malaga: 66, madrid: 58 }],
                            lomloe:     [{ mes: "Dic", malaga: 84, madrid: 79 }, { mes: "Ene", malaga: 86, madrid: 80 }, { mes: "Feb", malaga: 88, madrid: 82 }, { mes: "Mar", malaga: 89, madrid: 83 }],
                          };
                          metricas.forEach((m) => {
                            const d = evMensual[m];
                            rows.push(`QHUMA Málaga,${metricaLabelsLocal[m]},${d[0].malaga},${d[1].malaga},${d[2].malaga},${d[3].malaga}`);
                            rows.push(`QHUMA Madrid,${metricaLabelsLocal[m]},${d[0].madrid},${d[1].madrid},${d[2].madrid},${d[3].madrid}`);
                          });
                          rows.push("");
                          rows.push("Colegio,CLC,CPL,STEM,CD,CPSAA,CC,CE,CCEC");
                          rows.push("QHUMA Málaga,72,58,85,88,74,68,90,55");
                          rows.push("QHUMA Madrid,68,63,79,76,71,70,82,62");
                          const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8;" });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url; a.download = "comparativa_colegios_QHUMA.csv"; a.click();
                          URL.revokeObjectURL(url);
                          setExportandoComparativa(false);
                          setComparativaExportada(true);
                          setTimeout(() => setComparativaExportada(false), 2500);
                        }, 600);
                      }}
                      disabled={exportandoComparativa}
                      className="flex items-center gap-2 bg-sidebar text-white text-[11px] font-semibold px-4 py-2 rounded-xl cursor-pointer hover:brightness-110 transition-all disabled:opacity-60"
                    >
                      {exportandoComparativa ? (
                        <><RefreshCw size={12} className="animate-spin" />{lbl("Generando…", "Generating…")}</>
                      ) : comparativaExportada ? (
                        <><Check size={12} className="text-success" />{lbl("CSV descargado", "CSV downloaded")}</>
                      ) : (
                        <><Download size={12} />{lbl("Exportar CSV comparativa", "Export comparative CSV")}</>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setCopiandoResumen(true);
                        const texto = [
                          "RESUMEN EJECUTIVO — COMPARATIVA QHUMA (Mar 2025)",
                          "================================================",
                          "RETENCIÓN: Málaga 96% vs Madrid 91% (+5pp)",
                          "ENGAGEMENT: Málaga 78% vs Madrid 71% (+7pp)",
                          "EVIDENCIAS: Málaga 66% vs Madrid 58% (+8pp)",
                          "CUMPL. LOMLOE: Málaga 89% vs Madrid 83% (+6pp)",
                          "",
                          "COMPETENCIAS DESTACADAS (Málaga > Madrid):",
                          "  CD  +12pp | CE  +8pp | STEM +6pp | CLC +4pp",
                          "",
                          "COMPETENCIAS A REFORZAR (Madrid > Málaga):",
                          "  CPL +5pp | CCEC +7pp | CC +2pp",
                          "",
                          "Conclusión: Málaga lidera en 5 de 8 competencias.",
                          "Recomendación: compartir metodología CE/CD con Madrid.",
                        ].join("\n");
                        navigator.clipboard.writeText(texto).then(() => {
                          setCopiandoResumen(false);
                          setResumenCopiado(true);
                          setTimeout(() => setResumenCopiado(false), 2500);
                        });
                      }}
                      disabled={copiandoResumen}
                      className="flex items-center gap-2 border border-card-border text-text-secondary text-[11px] font-semibold px-4 py-2 rounded-xl cursor-pointer hover:bg-background transition-all disabled:opacity-60"
                    >
                      {resumenCopiado ? (
                        <><Check size={12} className="text-success" />{lbl("Copiado al portapapeles", "Copied to clipboard")}</>
                      ) : (
                        <><Copy size={12} />{lbl("Copiar resumen ejecutivo", "Copy executive summary")}</>
                      )}
                    </button>
                  </div>
                </div>
              );
            })()}

            {/* Riesgo de abandono */}
            <div className="bg-card rounded-2xl border border-card-border p-5">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle size={15} className="text-warning" />
                <h3 className="text-[14px] font-semibold text-text-primary">{lbl("Predicción de riesgo de abandono", "Dropout risk prediction")}</h3>
                <span className="ml-auto text-[10px] text-text-muted bg-background px-2.5 py-1 rounded-full">
                  Scoring: racha × 3 + evidencias × 4 (máx 100)
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-card-border">
                      {[lbl("Alumno","Student"), lbl("Curso","Grade"), lbl("Racha (días)","Streak (days)"), lbl("Evidencias","Evidence"), lbl("Score riesgo","Risk score"), lbl("Nivel","Level"), lbl("Acción","Action")].map((h) => (
                        <th key={h} className="text-left text-[10px] font-bold text-text-muted uppercase tracking-wide py-2 px-2">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {riesgoAlumnos.map((al) => {
                      const cfg = riesgoNivelCfg[al.nivel];
                      return (
                        <tr key={al.nombre} className="border-b border-card-border/50 hover:bg-background transition-colors">
                          <td className="py-2.5 px-2">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-sidebar text-white text-[9px] font-bold flex items-center justify-center flex-shrink-0">
                                {al.nombre.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                              </div>
                              <span className="text-[11px] font-medium text-text-primary">{al.nombre}</span>
                            </div>
                          </td>
                          <td className="py-2.5 px-2 text-[11px] text-text-muted">{al.curso}</td>
                          <td className="py-2.5 px-2">
                            <span className={`text-[12px] font-bold ${al.racha === 0 ? "text-urgent" : al.racha < 5 ? "text-warning" : "text-success"}`}>
                              {al.racha}
                            </span>
                          </td>
                          <td className="py-2.5 px-2">
                            <div className="flex items-center gap-1.5">
                              <div className="w-12 h-1.5 bg-background rounded-full overflow-hidden">
                                <div className="h-full bg-accent-text rounded-full" style={{ width: `${(al.evidencias / 16) * 100}%` }} />
                              </div>
                              <span className="text-[10px] text-text-secondary">{al.evidencias}/16</span>
                            </div>
                          </td>
                          <td className="py-2.5 px-2">
                            <div className="flex items-center gap-1.5">
                              <div className="w-14 h-2 bg-background rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${al.score < 30 ? "bg-urgent" : al.score < 50 ? "bg-warning" : "bg-success"}`}
                                  style={{ width: `${al.score}%` }}
                                />
                              </div>
                              <span className="text-[11px] font-bold text-text-primary">{al.score}</span>
                            </div>
                          </td>
                          <td className="py-2.5 px-2">
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text}`}>
                              {al.nivel}
                            </span>
                          </td>
                          <td className="py-2.5 px-2">
                            <button className="text-[10px] font-medium text-accent-text hover:underline cursor-pointer">
                              {al.nivel === "Alto" ? lbl("Intervenir ahora","Intervene now") : al.nivel === "Medio" ? lbl("Hacer seguimiento","Follow up") : lbl("Monitorear","Monitor")}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 pt-4 border-t border-card-border">
                <p className="text-[11px] text-text-muted leading-relaxed">
                  <strong className="text-text-secondary">Metodología scoring:</strong> Racha de días activos × 3 + Evidencias entregadas × 4. Score {"<"} 30 = riesgo alto (contacto inmediato), 30-50 = riesgo medio (seguimiento semanal), {">"} 50 = riesgo bajo.
                </p>
              </div>
            </div>
            {/* A16: Top competencias por clase */}
            {(() => {
              const compData: Record<"1eso" | "2eso", Record<string, number>> = {
                "1eso": { CLC: 3.2, CPL: 2.8, STEM: 3.4, CD: 3.2, CPSAA: 3.1, CC: 3.1, CE: 3.3, CCEC: 2.7 },
                "2eso": { CLC: 3.5, CPL: 3.2, STEM: 3.1, CD: 3.6, CPSAA: 3.3, CC: 3.2, CE: 2.9, CCEC: 3.1 },
              };
              const comps = ["CLC", "CPL", "STEM", "CD", "CPSAA", "CC", "CE", "CCEC"];
              const datos = compData[compClaseVista];
              const maxVal = 4;
              const refLinePct = (3.0 / maxVal) * 100; // referencia nivel 3.0 (Logro esperado)
              return (
                <div className="bg-card rounded-2xl border border-card-border p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <BarChart3 size={15} className="text-accent-text" />
                    <h3 className="text-[14px] font-semibold text-text-primary">{lbl("Top competencias por clase", "Top competencies by class")}</h3>
                    <span className="text-[10px] text-text-muted ml-1">{lbl("Media LOMLOE (1–4) · referencia nivel 3.0", "LOMLOE average (1–4) · reference level 3.0")}</span>
                    <div className="ml-auto flex bg-background rounded-lg border border-card-border p-0.5 gap-0.5">
                      {(["1eso", "2eso"] as const).map((c) => (
                        <button
                          key={c}
                          onClick={() => setCompClaseVista(c)}
                          className={`text-[10px] font-bold px-3 py-1 rounded-md cursor-pointer transition-all ${
                            compClaseVista === c ? "bg-sidebar text-white" : "text-text-muted hover:text-text-secondary"
                          }`}
                        >
                          {c === "1eso" ? "1º ESO" : "2º ESO"}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Gráfico de barras con línea de referencia */}
                  <div className="relative">
                    <div className="flex items-end gap-3 h-40">
                      {comps.map((comp) => {
                        const val = datos[comp] ?? 0;
                        const pct = (val / maxVal) * 100;
                        const barColor = val >= 3.5 ? "bg-success" : val >= 3.0 ? "bg-accent-text" : val >= 2.0 ? "bg-warning" : "bg-urgent";
                        return (
                          <div key={comp} className="flex-1 flex flex-col items-center gap-1">
                            <span className={`text-[9px] font-bold tabular-nums ${val >= 3.0 ? "text-accent-text" : "text-warning"}`}>
                              {val.toFixed(1)}
                            </span>
                            <div className="w-full flex-1 bg-background rounded-t-lg overflow-hidden flex items-end">
                              <div
                                className={`w-full rounded-t-lg transition-all ${barColor}`}
                                style={{ height: `${pct}%` }}
                              />
                            </div>
                            <span className="text-[9px] font-bold text-text-secondary">{comp}</span>
                          </div>
                        );
                      })}
                    </div>
                    {/* Línea de referencia nivel 3.0 */}
                    <div
                      className="absolute left-0 right-0 border-t-2 border-dashed border-accent-text/50 pointer-events-none"
                      style={{ bottom: `calc(${refLinePct}% + 20px)` }}
                    >
                      <span className="absolute right-0 -top-4 text-[8px] font-bold text-accent-text bg-card px-1">
                        Nivel 3.0 (Logro esperado)
                      </span>
                    </div>
                  </div>
                  {/* Leyenda */}
                  <div className="flex items-center gap-4 mt-4 pt-3 border-t border-card-border">
                    {[
                      { label: "≥ 3.5 — Avanzado",         color: "bg-success" },
                      { label: "3.0–3.4 — Adquirido",       color: "bg-accent-text" },
                      { label: "2.0–2.9 — En proceso",      color: "bg-warning" },
                      { label: "< 2.0 — Iniciado",          color: "bg-urgent" },
                    ].map((l) => (
                      <div key={l.label} className="flex items-center gap-1.5">
                        <div className={`w-3 h-3 rounded-sm ${l.color}`} />
                        <span className="text-[9px] text-text-muted">{l.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* A23 — Actividad por franja horaria */}
            {(() => {
              const dias = ["Lun", "Mar", "Mié", "Jue", "Vie"];
              const franjas = [
                { label: "Mañana 8–10h",        key: "m1" },
                { label: "Media mañana 10–12h",  key: "m2" },
                { label: "Tarde 16–18h",         key: "t1" },
                { label: "Tarde-noche 18–20h",   key: "t2" },
              ];
              // Datos de actividad (%) por franja × día: [m1, m2, t1, t2] × [lun, mar, mié, jue, vie]
              const dataSemana: Record<string, number[][]> = {
                "semana": [
                  // lun, mar, mié, jue, vie  — filas = franja, cols = día
                  [68, 72, 65, 80, 55],  // m1 mañana
                  [85, 88, 82, 91, 78],  // m2 media mañana ← pico
                  [45, 50, 38, 55, 30],  // t1 tarde
                  [22, 25, 18, 28, 12],  // t2 tarde-noche
                ],
                "media": [
                  [62, 68, 60, 75, 52],
                  [80, 84, 78, 87, 74],
                  [42, 47, 35, 51, 28],
                  [20, 22, 16, 25, 10],
                ],
              };
              const data = dataSemana[franjaVista];

              // Detectar pico y valle
              let pico = { franja: "", dia: "", val: 0 };
              let valle = { franja: "", dia: "", val: 100 };
              data.forEach((row, fi) => row.forEach((val, di) => {
                if (val > pico.val)   pico   = { franja: franjas[fi].label, dia: dias[di], val };
                if (val < valle.val)  valle  = { franja: franjas[fi].label, dia: dias[di], val };
              }));

              // Recomendación: franja valle de media como ventana de mantenimiento
              const slotsPosibles = [
                "Viernes 18–20h",
                "Viernes 16–18h",
                "Miércoles 18–20h",
              ];

              return (
                <div className="bg-card rounded-2xl border border-card-border p-5 mt-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock size={14} className="text-text-primary" />
                    <h3 className="text-[14px] font-semibold text-text-primary">{lbl("Actividad por franja horaria", "Activity by time slot")}</h3>
                    {/* Toggle semana / media */}
                    <div className="ml-auto flex gap-1 bg-background rounded-xl border border-card-border p-0.5">
                      {(["semana", "media"] as const).map((v) => (
                        <button
                          key={v}
                          onClick={() => setFranjaVista(v)}
                          className={`px-3 py-1 rounded-lg text-[10px] font-semibold transition-all cursor-pointer ${franjaVista === v ? "bg-sidebar text-white" : "text-text-muted hover:text-text-secondary"}`}
                        >
                          {v === "semana" ? "Esta semana" : "Media 4 semanas"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Heatmap grid */}
                  <div className="overflow-x-auto mb-4">
                    <table className="w-full">
                      <thead>
                        <tr>
                          <th className="text-[9px] text-text-muted font-medium text-left pb-2 pr-3 w-36"></th>
                          {dias.map((d) => (
                            <th key={d} className="text-[10px] font-semibold text-text-secondary pb-2 text-center w-16">{d}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {franjas.map((franja, fi) => (
                          <tr key={franja.key}>
                            <td className="text-[10px] text-text-secondary font-medium py-1 pr-3 whitespace-nowrap">{franja.label}</td>
                            {data[fi].map((val, di) => {
                              const isPico  = pico.franja  === franja.label && pico.dia  === dias[di];
                              const isValle = valle.franja === franja.label && valle.dia === dias[di];
                              const opacity = Math.round((val / 100) * 8) / 10; // 0.0 – 0.8
                              return (
                                <td key={di} className="py-1 px-1 text-center">
                                  <div
                                    className={`rounded-lg h-10 flex flex-col items-center justify-center relative ${isPico ? "ring-2 ring-accent-text ring-offset-1" : isValle ? "ring-2 ring-urgent/40 ring-offset-1" : ""}`}
                                    style={{ backgroundColor: `rgba(31, 81, 76, ${opacity})` }}
                                    title={`${franja.label} · ${dias[di]}: ${val}%`}
                                  >
                                    <span className={`text-[11px] font-bold ${val > 50 ? "text-white" : "text-text-secondary"}`}>{val}%</span>
                                    {isPico && <span className="text-[7px] font-black text-accent absolute -top-1 left-1/2 -translate-x-1/2 bg-accent-text px-1 rounded-full">PICO</span>}
                                    {isValle && <span className="text-[7px] font-black text-urgent absolute -top-1 left-1/2 -translate-x-1/2 bg-urgent-light px-1 rounded-full">MIN</span>}
                                  </div>
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Anotaciones */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-success-light rounded-xl p-3 border border-success/20">
                      <p className="text-[10px] font-bold text-success mb-0.5">Pico de uso</p>
                      <p className="text-[12px] font-semibold text-text-primary">{pico.dia} · {pico.franja}</p>
                      <p className="text-[10px] text-text-muted">{pico.val}% de alumnos activos simultáneamente</p>
                    </div>
                    <div className="bg-urgent-light rounded-xl p-3 border border-urgent/20">
                      <p className="text-[10px] font-bold text-urgent mb-0.5">Franja de menor uso</p>
                      <p className="text-[12px] font-semibold text-text-primary">{valle.dia} · {valle.franja}</p>
                      <p className="text-[10px] text-text-muted">{valle.val}% de actividad — ventana óptima para mantenimiento</p>
                    </div>
                  </div>

                  {/* Leyenda */}
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-[9px] text-text-muted">Intensidad:</span>
                    {[10, 30, 50, 70, 90].map((v) => (
                      <div key={v} className="flex items-center gap-1">
                        <div className="w-5 h-3 rounded" style={{ backgroundColor: `rgba(31, 81, 76, ${Math.round((v / 100) * 8) / 10})` }} />
                        <span className="text-[8px] text-text-muted">{v}%</span>
                      </div>
                    ))}
                  </div>

                  {/* Programar mantenimiento */}
                  <div className="bg-background rounded-xl p-4 border border-card-border">
                    <div className="flex items-center gap-2 mb-3">
                      <Server size={12} className="text-text-muted" />
                      <span className="text-[11px] font-semibold text-text-primary">{lbl("Programar ventana de mantenimiento", "Schedule maintenance window")}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <select
                        value={mantenimientoSlot ?? ""}
                        onChange={(e) => { setMantenimientoSlot(e.target.value); setMantenimientoGuardado(null); }}
                        className="flex-1 text-[11px] bg-card border border-card-border rounded-lg px-3 py-2 text-text-secondary cursor-pointer"
                      >
                        <option value="">{lbl("Seleccionar franja horaria…", "Select time slot…")}</option>
                        {slotsPosibles.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => {
                          if (mantenimientoSlot) setMantenimientoGuardado(mantenimientoSlot);
                        }}
                        disabled={!mantenimientoSlot}
                        className={`flex items-center gap-1.5 text-[11px] font-bold px-4 py-2 rounded-xl transition-all cursor-pointer flex-shrink-0 ${
                          mantenimientoGuardado ? "bg-success-light text-success" : "bg-sidebar text-white hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed"
                        }`}
                      >
                        {mantenimientoGuardado ? <><CheckCircle2 size={12} /> {lbl("Guardado", "Saved")}</> : <><Save size={12} /> {lbl("Guardar", "Save")}</>}
                      </button>
                    </div>
                    {mantenimientoGuardado && (
                      <p className="text-[10px] text-success mt-2">
                        Mantenimiento programado para <strong>{mantenimientoGuardado}</strong> — se notificará a todos los usuarios con 24h de antelación.
                      </p>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* A26 — Rendimiento docente */}
            {(() => {
              const docentesData = [
                {
                  id: "d1", nombre: "Ana Martínez",    alumnos: 12, evidencias: 18, tiempoRespuesta: 2.1, usoIA: 87, satisfaccion: 4.8,
                  feedbacks: ["Revisó el modelo financiero de Lucas con comentarios detallados.", "Generó informe LOMLOE T2 para Pablo Ruiz.", "Lanzó misión flash para toda la clase."],
                  iaFavorita: "Generador de proyectos",
                },
                {
                  id: "d2", nombre: "Carlos Pérez",    alumnos: 14, evidencias: 14, tiempoRespuesta: 3.8, usoIA: 72, satisfaccion: 4.2,
                  feedbacks: ["Actualizó notas LOMLOE de 2º ESO.", "Revisó evidencias pendientes de Lucía Fernández.", "Añadió comentario en portfolio de Carmen Vega."],
                  iaFavorita: "Tutor chat (MentorIA)",
                },
                {
                  id: "d3", nombre: "Isabel Mora",     alumnos: 10, evidencias: 9, tiempoRespuesta: 4.5, usoIA: 61, satisfaccion: 3.9,
                  feedbacks: ["Lanzó sesión PitchLab con 2º ESO.", "Marcó hito completado: Demo Day.", "Envió recordatorio de entrega a 3 alumnos."],
                  iaFavorita: "Informes LOMLOE",
                },
                {
                  id: "d4", nombre: "Roberto Sánchez", alumnos: 11, evidencias: 11, tiempoRespuesta: 3.2, usoIA: 78, satisfaccion: 4.4,
                  feedbacks: ["Revisó plan de acción individual de 5 alumnos.", "Actualizó rúbricas del proyecto Airbnb.", "Comentó errores registrados de la semana."],
                  iaFavorita: "Tutor chat (MentorIA)",
                },
                {
                  id: "d5", nombre: "Patricia Gómez",  alumnos: 13, evidencias: 7, tiempoRespuesta: 5.1, usoIA: 44, satisfaccion: 3.2,
                  feedbacks: ["Revisó evidencias de Lucas García.", "Actualizó estado de proyecto Podcast.", "Envió informe familia de Tomás Herrera."],
                  iaFavorita: "Informes LOMLOE",
                },
                {
                  id: "d6", nombre: "Luis Fernández",  alumnos: 9, evidencias: 13, tiempoRespuesta: 2.8, usoIA: 91, satisfaccion: 4.6,
                  feedbacks: ["Generó 3 proyectos nuevos con IA.", "Revisó pitches del grupo de 1º ESO.", "Añadió recursos al proyecto App Guía."],
                  iaFavorita: "Generador de proyectos",
                },
              ];

              const avgSatisfaccion = (docentesData.reduce((s, d) => s + d.satisfaccion, 0) / docentesData.length).toFixed(1);
              const avgRespuesta = (docentesData.reduce((s, d) => s + d.tiempoRespuesta, 0) / docentesData.length).toFixed(1);
              const totalFeedbacks = docentesData.reduce((s, d) => s + d.evidencias, 0);

              const getBadge = (sat: number) => {
                if (sat >= 4.5) return { label: "Destacado", bg: "bg-success-light", text: "text-success" };
                if (sat >= 3.5) return { label: "En progreso", bg: "bg-accent-light", text: "text-accent-text" };
                return { label: "Apoyo", bg: "bg-warning-light", text: "text-warning" };
              };

              const renderStars = (val: number) => (
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={10}
                      className={i < Math.round(val) ? "text-warning" : "text-text-muted"}
                    />
                  ))}
                  <span className="text-[10px] font-bold text-text-primary ml-1">{val.toFixed(1)}</span>
                </div>
              );

              return (
                <div className="bg-card rounded-2xl border border-card-border p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Users size={15} className="text-text-primary" />
                      <h3 className="text-[14px] font-semibold text-text-primary">Rendimiento docente</h3>
                    </div>
                  </div>

                  {/* KPI bar */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-accent-light rounded-xl p-3 text-center">
                      <span className="text-[20px] font-bold text-accent-text block">{avgSatisfaccion}</span>
                      <span className="text-[9px] text-text-muted">Satisfacción media /5</span>
                    </div>
                    <div className="bg-background rounded-xl p-3 text-center">
                      <span className="text-[20px] font-bold text-text-primary block">{avgRespuesta}h</span>
                      <span className="text-[9px] text-text-muted">Tiempo medio respuesta</span>
                    </div>
                    <div className="bg-success-light rounded-xl p-3 text-center">
                      <span className="text-[20px] font-bold text-success block">{totalFeedbacks}</span>
                      <span className="text-[9px] text-text-muted">Feedbacks esta semana</span>
                    </div>
                  </div>

                  {/* Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-card-border">
                          <th className="text-[10px] font-bold text-text-muted pb-2 pr-3">Docente</th>
                          <th className="text-[10px] font-bold text-text-muted pb-2 pr-3 text-center">Alumnos</th>
                          <th className="text-[10px] font-bold text-text-muted pb-2 pr-3 text-center">Evidencias/sem</th>
                          <th className="text-[10px] font-bold text-text-muted pb-2 pr-3 text-center">Resp. (h)</th>
                          <th className="text-[10px] font-bold text-text-muted pb-2 pr-3 text-center">Uso IA %</th>
                          <th className="text-[10px] font-bold text-text-muted pb-2 pr-3">Satisfacción</th>
                          <th className="text-[10px] font-bold text-text-muted pb-2"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {docentesData.map((docente) => {
                          const badge = getBadge(docente.satisfaccion);
                          const isExp = docenteExpandido === docente.id;
                          return (
                            <>
                              <tr key={docente.id} className="border-b border-card-border/50 hover:bg-background transition-colors">
                                <td className="py-2.5 pr-3">
                                  <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-full bg-sidebar text-white text-[9px] font-bold flex items-center justify-center flex-shrink-0">
                                      {docente.nombre.split(" ").map(n => n[0]).slice(0,2).join("")}
                                    </div>
                                    <div>
                                      <span className="text-[11px] font-semibold text-text-primary block">{docente.nombre}</span>
                                      <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${badge.bg} ${badge.text}`}>{badge.label}</span>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-2.5 pr-3 text-center">
                                  <span className="text-[11px] font-semibold text-text-primary">{docente.alumnos}</span>
                                </td>
                                <td className="py-2.5 pr-3 text-center">
                                  <span className="text-[11px] font-semibold text-text-primary">{docente.evidencias}</span>
                                </td>
                                <td className="py-2.5 pr-3 text-center">
                                  <span className={`text-[11px] font-semibold ${docente.tiempoRespuesta <= 3 ? "text-success" : docente.tiempoRespuesta <= 4 ? "text-warning" : "text-urgent"}`}>
                                    {docente.tiempoRespuesta}h
                                  </span>
                                </td>
                                <td className="py-2.5 pr-3 text-center">
                                  <div className="flex items-center gap-1 justify-center">
                                    <div className="w-12 h-1.5 bg-background rounded-full overflow-hidden">
                                      <div
                                        className={`h-full rounded-full ${docente.usoIA >= 80 ? "bg-success" : docente.usoIA >= 60 ? "bg-accent-text" : "bg-warning"}`}
                                        style={{ width: `${docente.usoIA}%` }}
                                      />
                                    </div>
                                    <span className="text-[10px] text-text-muted">{docente.usoIA}%</span>
                                  </div>
                                </td>
                                <td className="py-2.5 pr-3">
                                  {renderStars(docente.satisfaccion)}
                                </td>
                                <td className="py-2.5">
                                  <div className="flex items-center gap-1.5">
                                    <button
                                      onClick={() => setDocenteExpandido(isExp ? null : docente.id)}
                                      className="flex items-center gap-1 text-[9px] font-bold text-accent-text bg-accent-light px-2 py-1 rounded-lg cursor-pointer hover:bg-accent/20 transition-all"
                                    >
                                      <Eye size={9} />
                                      {isExp ? "Ocultar" : "Ver detalle"}
                                    </button>
                                    <button
                                      onClick={() => handleReconocerLogro(docente.id)}
                                      disabled={!!reconociendoDocente || docenteReconocido.has(docente.id)}
                                      className={`flex items-center gap-1 text-[9px] font-bold px-2 py-1 rounded-lg cursor-pointer transition-all disabled:opacity-60 ${
                                        docenteReconocido.has(docente.id)
                                          ? "bg-success-light text-success"
                                          : "bg-sidebar text-white hover:brightness-110"
                                      }`}
                                    >
                                      {reconociendoDocente === docente.id
                                        ? <RefreshCw size={9} className="animate-spin" />
                                        : docenteReconocido.has(docente.id)
                                        ? <><CheckCircle2 size={9} /> Enviado</>
                                        : <><Trophy size={9} /> Reconocer</>}
                                    </button>
                                  </div>
                                </td>
                              </tr>
                              {isExp && (
                                <tr key={`${docente.id}-exp`}>
                                  <td colSpan={7} className="pb-3 pt-1">
                                    <div className="bg-background rounded-xl p-3 mx-1">
                                      <div className="grid grid-cols-2 gap-3">
                                        <div>
                                          <p className="text-[10px] font-bold text-text-secondary mb-2">Últimos 3 feedbacks dados</p>
                                          <div className="space-y-1.5">
                                            {docente.feedbacks.map((fb, i) => (
                                              <div key={i} className="flex items-start gap-2">
                                                <div className="w-1 h-1 rounded-full bg-accent-text mt-1.5 flex-shrink-0" />
                                                <span className="text-[10px] text-text-secondary leading-relaxed">{fb}</span>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                        <div>
                                          <p className="text-[10px] font-bold text-text-secondary mb-2">Funcionalidad IA más usada</p>
                                          <div className="flex items-center gap-2 bg-sidebar rounded-xl px-3 py-2">
                                            <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                                              <span className="text-accent text-[8px] font-bold">AI</span>
                                            </div>
                                            <span className="text-[11px] font-semibold text-white">{docente.iaFavorita}</span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })()}

            {/* A29 — Mapa de riesgo de abandono */}
            {(() => {
              const alumnos = [
                { nombre: "Lucas García",    iniciales: "LG", engagement: "alto",  progreso: "alto",  riesgo: "bajo"    },
                { nombre: "Sofía Torres",    iniciales: "ST", engagement: "alto",  progreso: "medio", riesgo: "bajo"    },
                { nombre: "Pablo Ruiz",      iniciales: "PR", engagement: "bajo",  progreso: "bajo",  riesgo: "critico" },
                { nombre: "María Santos",    iniciales: "MS", engagement: "alto",  progreso: "alto",  riesgo: "bajo"    },
                { nombre: "Diego López",     iniciales: "DL", engagement: "medio", progreso: "bajo",  riesgo: "warning" },
                { nombre: "Ana Martín",      iniciales: "AM", engagement: "alto",  progreso: "alto",  riesgo: "bajo"    },
                { nombre: "Carlos Rivera",   iniciales: "CR", engagement: "medio", progreso: "medio", riesgo: "warning" },
                { nombre: "Laura Sanz",      iniciales: "LS", engagement: "alto",  progreso: "medio", riesgo: "bajo"    },
                { nombre: "Tomás Herrera",   iniciales: "TH", engagement: "bajo",  progreso: "medio", riesgo: "warning" },
                { nombre: "Carla Vega",      iniciales: "CV", engagement: "medio", progreso: "alto",  riesgo: "bajo"    },
                { nombre: "Alejandro Pérez", iniciales: "AP", engagement: "bajo",  progreso: "bajo",  riesgo: "critico" },
                { nombre: "Valentina Cruz",  iniciales: "VC", engagement: "alto",  progreso: "alto",  riesgo: "bajo"    },
              ];

              // Grid 3×3: engaj (bajo/medio/alto) × progreso (alto/medio/bajo)
              const celdas: { eng: string; prog: string; label: string; tipo: string }[] = [
                { eng: "bajo",  prog: "alto",  label: "Bajo / Alto",   tipo: "warning" },
                { eng: "medio", prog: "alto",  label: "Medio / Alto",  tipo: "success" },
                { eng: "alto",  prog: "alto",  label: "Alto / Alto",   tipo: "success" },
                { eng: "bajo",  prog: "medio", label: "Bajo / Medio",  tipo: "warning" },
                { eng: "medio", prog: "medio", label: "Medio / Medio", tipo: "neutral" },
                { eng: "alto",  prog: "medio", label: "Alto / Medio",  tipo: "success" },
                { eng: "bajo",  prog: "bajo",  label: "Bajo / Bajo",   tipo: "critico" },
                { eng: "medio", prog: "bajo",  label: "Medio / Bajo",  tipo: "warning" },
                { eng: "alto",  prog: "bajo",  label: "Alto / Bajo",   tipo: "warning" },
              ];

              const tipoBg: Record<string, string> = {
                critico: "bg-urgent-light border border-urgent/40",
                warning: "bg-warning-light border border-warning/20",
                success: "bg-success-light border border-success/20",
                neutral: "bg-background border border-card-border",
              };
              const chipColor: Record<string, string> = {
                critico: "bg-urgent text-white",
                warning: "bg-warning text-white",
                success: "bg-success text-white",
                bajo: "bg-urgent text-white",
              };

              const criticos = alumnos.filter((a) => a.riesgo === "critico");
              const enWarning = alumnos.filter((a) => a.riesgo === "warning");

              const handleGenerarInforme = () => {
                setGenerandoRiesgoInforme(true);
                setTimeout(() => {
                  const filas = alumnos.map((a) => `<tr><td style="padding:6px 12px;border:1px solid #eee">${a.nombre}</td><td style="padding:6px 12px;border:1px solid #eee;text-align:center">${a.engagement}</td><td style="padding:6px 12px;border:1px solid #eee;text-align:center">${a.progreso}</td><td style="padding:6px 12px;border:1px solid #eee;text-align:center;font-weight:700;color:${a.riesgo === "critico" ? "#ef4444" : a.riesgo === "warning" ? "#f59e0b" : "#22c55e"}">${a.riesgo === "critico" ? "Crítico" : a.riesgo === "warning" ? "Atención" : "OK"}</td></tr>`).join("");
                  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Informe de Riesgo de Abandono — QHUMA OS</title><style>body{font-family:Inter,sans-serif;padding:32px;max-width:800px;margin:0 auto}h1{color:#141414}table{width:100%;border-collapse:collapse;margin-top:16px}th{background:#1f514c;color:white;padding:8px 12px;text-align:left}td{padding:6px 12px;border:1px solid #eee}</style></head><body><h1>Informe de riesgo de abandono escolar</h1><p style="color:#666">Generado: ${new Date().toLocaleDateString("es-ES")} · QHUMA Málaga · 1º ESO</p><h2>Zona crítica: ${criticos.length} alumno(s)</h2><p>${criticos.map((a) => a.nombre).join(", ")}</p><h2 style="margin-top:24px">Tabla completa</h2><table><thead><tr><th>Alumno</th><th>Engagement</th><th>Progreso</th><th>Riesgo</th></tr></thead><tbody>${filas}</tbody></table></body></html>`;
                  const blob = new Blob([html], { type: "text/html" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `informe_riesgo_abandono_${new Date().toISOString().slice(0,10)}.pdf`;
                  a.click();
                  URL.revokeObjectURL(url);
                  setGenerandoRiesgoInforme(false);
                  setRiesgoInformeGenerado(true);
                  setTimeout(() => setRiesgoInformeGenerado(false), 4000);
                }, 1300);
              };

              return (
                <div className="bg-card rounded-2xl border border-card-border p-5 mt-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <AlertTriangle size={14} className="text-urgent" />
                      <h3 className="text-[14px] font-semibold text-text-primary">Mapa de riesgo de abandono</h3>
                    </div>
                    <button
                      onClick={handleGenerarInforme}
                      disabled={generandoRiesgoInforme}
                      className="flex items-center gap-1.5 bg-sidebar text-white text-[10px] font-bold px-3 py-1.5 rounded-xl cursor-pointer hover:brightness-110 transition-all disabled:opacity-60"
                    >
                      {generandoRiesgoInforme ? <RefreshCw size={10} className="animate-spin" /> : <Download size={10} />}
                      {generandoRiesgoInforme ? "Generando…" : "Generar informe de riesgo"}
                    </button>
                  </div>

                  {riesgoInformeGenerado && (
                    <div className="flex items-center gap-2 bg-success-light border border-success/20 rounded-xl px-3 py-2 mb-4">
                      <CheckCircle2 size={12} className="text-success" />
                      <span className="text-[11px] font-semibold text-success">Informe de riesgo exportado correctamente</span>
                    </div>
                  )}

                  {/* Ejes del mapa */}
                  <div className="flex gap-3 mb-3">
                    <div className="flex-1 bg-background rounded-xl p-2 text-center">
                      <span className="text-[9px] text-text-muted font-semibold uppercase tracking-wide">→ Eje X: Engagement (bajo / medio / alto)</span>
                    </div>
                    <div className="bg-background rounded-xl p-2 text-center px-3">
                      <span className="text-[9px] text-text-muted font-semibold uppercase tracking-wide">↑ Eje Y: Progreso académico</span>
                    </div>
                  </div>

                  {/* Grid 3×3 */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {/* Fila alto (progreso) */}
                    {celdas.filter((c) => c.prog === "alto").map((celda) => {
                      const enCelda = alumnos.filter((a) => a.engagement === celda.eng && a.progreso === celda.prog);
                      return (
                        <div key={`${celda.eng}-${celda.prog}`} className={`rounded-xl p-2.5 min-h-[80px] ${tipoBg[celda.tipo]}`}>
                          <span className="text-[8px] text-text-muted block mb-1.5">{celda.label}</span>
                          <div className="flex flex-wrap gap-1">
                            {enCelda.map((a) => (
                              <span key={a.iniciales} className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${celda.tipo === "success" ? "bg-success text-white" : celda.tipo === "warning" ? "bg-warning text-white" : "bg-urgent text-white"}`} title={a.nombre}>
                                {a.iniciales}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                    {/* Fila medio (progreso) */}
                    {celdas.filter((c) => c.prog === "medio").map((celda) => {
                      const enCelda = alumnos.filter((a) => a.engagement === celda.eng && a.progreso === celda.prog);
                      return (
                        <div key={`${celda.eng}-${celda.prog}`} className={`rounded-xl p-2.5 min-h-[80px] ${tipoBg[celda.tipo]}`}>
                          <span className="text-[8px] text-text-muted block mb-1.5">{celda.label}</span>
                          <div className="flex flex-wrap gap-1">
                            {enCelda.map((a) => (
                              <span key={a.iniciales} className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${celda.tipo === "success" ? "bg-success text-white" : celda.tipo === "neutral" ? "bg-accent-text/20 text-accent-text" : "bg-warning text-white"}`} title={a.nombre}>
                                {a.iniciales}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                    {/* Fila bajo (progreso) — zona crítica */}
                    {celdas.filter((c) => c.prog === "bajo").map((celda) => {
                      const enCelda = alumnos.filter((a) => a.engagement === celda.eng && a.progreso === celda.prog);
                      const isCritico = celda.tipo === "critico";
                      return (
                        <div key={`${celda.eng}-${celda.prog}`} className={`rounded-xl p-2.5 min-h-[80px] ${tipoBg[celda.tipo]} ${isCritico ? "animate-pulse" : ""}`}>
                          <span className="text-[8px] text-text-muted block mb-1.5">{celda.label}</span>
                          {isCritico && <span className="text-[7px] font-bold text-urgent uppercase tracking-wide block mb-1">⚠ Zona crítica</span>}
                          <div className="flex flex-wrap gap-1">
                            {enCelda.map((a) => (
                              <span key={a.iniciales} className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${chipColor[celda.tipo] ?? "bg-warning text-white"}`} title={a.nombre}>
                                {a.iniciales}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Resumen */}
                  <div className="bg-urgent-light rounded-xl p-4 border border-urgent/20">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle size={12} className="text-urgent" />
                      <span className="text-[11px] font-bold text-urgent">{criticos.length} alumno(s) en zona crítica: {criticos.map((a) => a.nombre).join(", ")}</span>
                    </div>
                    <p className="text-[10px] font-semibold text-text-secondary mb-2">Acciones recomendadas:</p>
                    <ul className="space-y-1">
                      {["Contactar a familias de alumnos en zona crítica antes del viernes.", "Revisar carga de trabajo semanal y ajustar número de tareas activas.", "Programar sesión 1:1 de 15 min con cada alumno de zona crítica esta semana."].map((acc, i) => (
                        <li key={i} className="flex items-start gap-2 text-[10px] text-text-secondary">
                          <span className="w-3.5 h-3.5 rounded-full bg-urgent text-white text-[7px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                          {acc}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Leyenda */}
                  <div className="flex items-center gap-4 mt-3 flex-wrap">
                    <span className="text-[9px] text-text-muted">{enWarning.length} alumnos necesitan atención · {alumnos.length - criticos.length - enWarning.length} en zona segura</span>
                    {[{ color: "bg-urgent", label: "Crítico" }, { color: "bg-warning", label: "Atención" }, { color: "bg-success", label: "OK" }].map((l) => (
                      <div key={l.label} className="flex items-center gap-1">
                        <span className={`w-3 h-3 rounded-full ${l.color} inline-block`} />
                        <span className="text-[9px] text-text-muted">{l.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        );
      })()}
    </div>
  );
}
