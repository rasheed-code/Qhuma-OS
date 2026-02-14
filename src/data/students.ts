import { Student, ClassStudent, Alert, ChatMessage } from "@/types";

export const currentStudent: Student = {
  name: "Lucas García",
  avatar: "LG",
  class: "1º ESO",
  qcoins: 340,
  xpTotal: 2840,
  xpWeek: 680,
  streak: 12,
  evidencesSubmitted: 9,
  evidencesTotal: 16,
};

export const chatMessages: ChatMessage[] = [
  {
    id: "1",
    sender: "teacher",
    senderName: "Prof. Ana",
    message:
      "Great work on the landing page, Lucas! The layout is very clean. One suggestion: add a section about the neighborhood.",
    time: "9:45 AM",
    read: true,
  },
  {
    id: "2",
    sender: "student",
    senderName: "Lucas",
    message:
      "Thanks! Should I include a map or just a text description of the area?",
    time: "10:02 AM",
    read: true,
  },
  {
    id: "3",
    sender: "teacher",
    senderName: "Prof. Ana",
    message:
      "A map would be ideal — you can use that for tomorrow's guest routes task too. Two birds, one stone!",
    time: "10:15 AM",
    read: true,
  },
  {
    id: "4",
    sender: "student",
    senderName: "Lucas",
    message: "Smart! I'll start on the hygiene protocol now and add the map later.",
    time: "10:20 AM",
    read: true,
  },
  {
    id: "5",
    sender: "teacher",
    senderName: "Prof. Ana",
    message:
      "Perfect. Remember for the hygiene protocol: think about it from a guest's perspective. What would make YOU feel safe?",
    time: "11:05 AM",
    read: false,
  },
];

export const classStudents: ClassStudent[] = [
  {
    id: "1",
    name: "Lucas García",
    avatar: "LG",
    progress: 72,
    status: "on_track",
    currentTask: "Guest Comms System",
    evidencesSubmitted: 9,
  },
  {
    id: "2",
    name: "Sofía Martín",
    avatar: "SM",
    progress: 85,
    status: "excelling",
    currentTask: "Profitability Calculation",
    evidencesSubmitted: 11,
  },
  {
    id: "3",
    name: "Pablo Ruiz",
    avatar: "PR",
    progress: 45,
    status: "needs_attention",
    currentTask: "Landing Page (behind)",
    evidencesSubmitted: 5,
  },
  {
    id: "4",
    name: "María López",
    avatar: "ML",
    progress: 78,
    status: "on_track",
    currentTask: "Guest Comms System",
    evidencesSubmitted: 10,
  },
  {
    id: "5",
    name: "Daniel Torres",
    avatar: "DT",
    progress: 92,
    status: "excelling",
    currentTask: "Tax Simulation",
    evidencesSubmitted: 12,
  },
  {
    id: "6",
    name: "Carmen Vega",
    avatar: "CV",
    progress: 60,
    status: "on_track",
    currentTask: "Landing Page Copy",
    evidencesSubmitted: 8,
  },
  {
    id: "7",
    name: "Alejandro Díaz",
    avatar: "AD",
    progress: 38,
    status: "needs_attention",
    currentTask: "Market Research (behind)",
    evidencesSubmitted: 4,
  },
  {
    id: "8",
    name: "Valentina Sánchez",
    avatar: "VS",
    progress: 80,
    status: "on_track",
    currentTask: "Profitability Calculation",
    evidencesSubmitted: 10,
  },
  {
    id: "9",
    name: "Hugo Navarro",
    avatar: "HN",
    progress: 70,
    status: "on_track",
    currentTask: "Guest Comms System",
    evidencesSubmitted: 9,
  },
  {
    id: "10",
    name: "Lucía Fernández",
    avatar: "LF",
    progress: 88,
    status: "excelling",
    currentTask: "Tax Simulation",
    evidencesSubmitted: 11,
  },
  {
    id: "11",
    name: "Martín Ramos",
    avatar: "MR",
    progress: 55,
    status: "on_track",
    currentTask: "Guest Comms System",
    evidencesSubmitted: 7,
  },
  {
    id: "12",
    name: "Alba Moreno",
    avatar: "AM",
    progress: 75,
    status: "on_track",
    currentTask: "Profitability Calculation",
    evidencesSubmitted: 9,
  },
];

export const teacherAlerts: Alert[] = [
  {
    id: "1",
    type: "urgent",
    student: "Pablo Ruiz",
    message:
      "Still on Monday's landing page task. Hasn't submitted any evidence since Tuesday.",
    time: "8:30 AM",
  },
  {
    id: "2",
    type: "warning",
    student: "Alejandro Díaz",
    message:
      "Struggling with profitability calculations. May need 1:1 math support.",
    time: "9:15 AM",
  },
  {
    id: "3",
    type: "success",
    student: "Daniel Torres",
    message:
      "Already working on tax simulation — 2 tasks ahead of schedule. Consider advanced challenge.",
    time: "10:00 AM",
  },
  {
    id: "4",
    type: "success",
    student: "Sofía Martín",
    message:
      "Excellent landing page. Peer-nominated for best design. Portfolio quality work.",
    time: "Yesterday",
  },
];
