export interface User {
  _id?: string;
  id?: string; // for compatibility with old data
  name: string;
  email: string;
  role: 'user' | 'admin';
  level: number;
  points: number;
  badges: Badge[];
  avatar?: string;
  joinedDate: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  unlockedAt?: string;
}

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'quiz' | 'guide';
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in minutes
  points: number;
  completed: boolean;
  progress: number; // 0-100
  thumbnail?: string;
  content?: string;
  videoUrl?: string;
  downloadUrl?: string;
}

export interface Quiz {
  id: string;
  title: string;
  questions: QuizQuestion[];
  timeLimit?: number;
  passingScore: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  type: 'bug' | 'question' | 'suggestion';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  userId: string;
  adminResponse?: string;
  adminId?: string;
}

export interface LiveSession {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: number;
  instructor: string;
  maxParticipants: number;
  registeredCount: number;
  isRegistered: boolean;
  meetingLink?: string;
}

export interface Leaderboard {
  rank: number;
  user: User;
  totalPoints: number;
  completedModules: number;
  badgeCount: number;
}
