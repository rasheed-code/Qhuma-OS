import { PlayerLevel, EmergencyMission, Tribe, ToolOption, ProjectImpact } from "@/types";

export const playerLevel: PlayerLevel = {
  level: 4,
  title: "Digital Architect",
  xpCurrent: 340,
  xpRequired: 1000,
  nextTitle: "Airbnb CFO",
};

export const flashMission: EmergencyMission = {
  id: "fm-1",
  title: "Guest Review Response",
  description:
    "A guest just left a 3-star review complaining about unclear check-in instructions. Write a professional response and update your check-in guide to prevent this in the future.",
  xpReward: 35,
  timeLimit: 15,
};

export const currentTribe: Tribe = {
  name: "The Hosts",
  members: [
    {
      id: "1",
      name: "Lucas G.",
      avatar: "LG",
      role: "Lead Designer",
      isCurrentUser: true,
    },
    {
      id: "2",
      name: "Sof\u00eda M.",
      avatar: "SM",
      role: "Expert Learner",
      isCurrentUser: false,
      badge: "Expert Learner",
    },
    {
      id: "3",
      name: "Hugo N.",
      avatar: "HN",
      role: "Numbers Lead",
      isCurrentUser: false,
    },
    {
      id: "4",
      name: "Alba M.",
      avatar: "AM",
      role: "Content Writer",
      isCurrentUser: false,
    },
  ],
};

export const toolOptions: ToolOption[] = [
  { id: "canva", name: "Canva", icon: "Palette" },
  { id: "notion", name: "Notion", icon: "FileText" },
  { id: "sheets", name: "Sheets", icon: "Table" },
  { id: "html", name: "HTML/CSS", icon: "Code" },
];

export const projectImpact: ProjectImpact = {
  revenue: "\u20AC847/month",
  label: "Projected Revenue",
  guests: "32 guests/year",
  rating: "4.8\u2605 projected",
};

export const coinTransactions = [
  { id: "t1", type: "earned" as const, amount: 50, description: "Completed: Market Research", date: "Mon 8:30", taskId: "mon-1" },
  { id: "t2", type: "earned" as const, amount: 40, description: "Completed: Guest Demographics", date: "Mon 9:30", taskId: "mon-2" },
  { id: "t3", type: "earned" as const, amount: 60, description: "Completed: Pricing Analysis", date: "Mon 11:00", taskId: "mon-3" },
  { id: "t4", type: "earned" as const, amount: 50, description: "Completed: Legal Framework", date: "Mon 12:00", taskId: "mon-4" },
  { id: "t5", type: "earned" as const, amount: 40, description: "Completed: Team Brainstorm", date: "Mon 14:00", taskId: "mon-5" },
  { id: "t6", type: "earned" as const, amount: 20, description: "Completed: Daily Reflection", date: "Mon 15:00", taskId: "mon-6" },
  { id: "t7", type: "earned" as const, amount: 50, description: "Completed: Floor Plan", date: "Tue 8:30", taskId: "tue-1" },
  { id: "t8", type: "earned" as const, amount: 60, description: "Completed: Budget Planning", date: "Tue 9:30", taskId: "tue-2" },
  { id: "t9", type: "earned" as const, amount: 50, description: "Completed: Brand Identity", date: "Tue 11:00", taskId: "tue-3" },
  { id: "t10", type: "spent" as const, amount: -30, description: "Bought: Custom Avatar Border", date: "Tue 14:00" },
  { id: "t11", type: "earned" as const, amount: 50, description: "Completed: Guest Experience Map", date: "Tue 12:00", taskId: "tue-4" },
  { id: "t12", type: "earned" as const, amount: 50, description: "Completed: Property Description", date: "Tue 14:00", taskId: "tue-5" },
  { id: "t13", type: "earned" as const, amount: 30, description: "Completed: Peer Review", date: "Tue 15:00", taskId: "tue-6" },
  { id: "t14", type: "spent" as const, amount: -20, description: "Bought: Hint Token", date: "Wed 8:00" },
  { id: "t15", type: "earned" as const, amount: 60, description: "Completed: Landing Page Structure", date: "Wed 8:30", taskId: "wed-1" },
  { id: "t16", type: "earned" as const, amount: 50, description: "Completed: Landing Page Copy", date: "Wed 9:30", taskId: "wed-2" },
];

export const shopItems = [
  { id: "s1", name: "Skip a Task", price: 100, icon: "Zap", description: "Skip one upcoming task", owned: false },
  { id: "s2", name: "Custom Border", price: 30, icon: "Palette", description: "Unlock a custom avatar border", owned: true },
  { id: "s3", name: "Extra 10 min", price: 50, icon: "Timer", description: "+10 minutes on any task", owned: false },
  { id: "s4", name: "Tribe Boost", price: 75, icon: "Users", description: "+10% XP for your tribe today", owned: false },
  { id: "s5", name: "Hint Token", price: 20, icon: "Lightbulb", description: "Get a hint from Prof. Ana", owned: false },
  { id: "s6", name: "Theme Pack", price: 60, icon: "Sparkles", description: "Unlock a custom dashboard theme", owned: false },
];

export const achievements = [
  { id: "a1", name: "First Blood", description: "Complete your first task", icon: "Swords", unlocked: true, date: "Mon" },
  { id: "a2", name: "Speed Runner", description: "Finish a task 15 min early", icon: "Timer", unlocked: true, date: "Mon" },
  { id: "a3", name: "Perfect Day", description: "Complete all tasks in a day", icon: "Star", unlocked: true, date: "Mon" },
  { id: "a4", name: "Social Butterfly", description: "Give feedback to 3 peers", icon: "Users", unlocked: false },
  { id: "a5", name: "Money Maker", description: "Earn 500 Q-Coins total", icon: "Coins", unlocked: true, date: "Tue" },
  { id: "a6", name: "Flash Hero", description: "Complete 3 flash missions", icon: "Zap", unlocked: false },
];
