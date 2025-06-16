
import { User, Badge, LearningModule, Ticket, LiveSession, Leaderboard } from '../types';

export const currentUser: User = {
  id: '1',
  name: 'Sophie Martin',
  email: 'sophie@example.com',
  role: 'vendor',
  level: 7,
  points: 2350,
  badges: [
    {
      id: '1',
      name: 'Premier Pas',
      description: 'Complété ton premier module',
      icon: '🎯',
      color: 'text-vibrant-green',
      unlockedAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Marathonien',
      description: 'Complété 10 modules',
      icon: '🏃‍♀️',
      color: 'text-vibrant-blue',
      unlockedAt: '2024-02-20'
    },
    {
      id: '3',
      name: 'Quiz Master',
      description: 'Score parfait sur 5 quiz',
      icon: '🧠',
      color: 'text-vibrant-purple',
      unlockedAt: '2024-03-10'
    }
  ],
  avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5bb?w=150&h=150&fit=crop&crop=face',
  joinedDate: '2024-01-01'
};

export const learningModules: LearningModule[] = [
  {
    id: '1',
    title: 'Optimisation des Annonces',
    description: 'Apprends à créer des annonces qui convertissent',
    type: 'video',
    category: 'Marketing',
    difficulty: 'beginner',
    duration: 25,
    points: 100,
    completed: true,
    progress: 100,
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop',
    videoUrl: 'https://example.com/video1'
  },
  {
    id: '2',
    title: 'Gestion des Stocks Avancée',
    description: 'Maîtrise la gestion automatisée des stocks',
    type: 'guide',
    category: 'Logistique',
    difficulty: 'intermediate',
    duration: 45,
    points: 150,
    completed: false,
    progress: 60,
    downloadUrl: 'https://example.com/guide.pdf'
  },
  {
    id: '3',
    title: 'Quiz: Stratégies de Prix',
    description: 'Teste tes connaissances sur la tarification',
    type: 'quiz',
    category: 'Stratégie',
    difficulty: 'intermediate',
    duration: 15,
    points: 75,
    completed: false,
    progress: 0
  },
  {
    id: '4',
    title: 'Analytics et KPIs',
    description: 'Comprendre et utiliser les données de vente',
    type: 'video',
    category: 'Analytics',
    difficulty: 'advanced',
    duration: 35,
    points: 200,
    completed: false,
    progress: 20,
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop'
  },
  {
    id: '5',
    title: 'A+ Content Creation',
    description: 'Créer du contenu premium pour tes produits',
    type: 'video',
    category: 'Marketing',
    difficulty: 'advanced',
    duration: 40,
    points: 180,
    completed: false,
    progress: 0,
    thumbnail: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=300&h=200&fit=crop'
  }
];

export const tickets: Ticket[] = [
  {
    id: '1',
    title: 'Bug dans le module de facturation',
    description: 'Impossible de générer les factures depuis hier',
    type: 'bug',
    status: 'in-progress',
    priority: 'high',
    createdAt: '2024-06-15T10:30:00Z',
    updatedAt: '2024-06-15T14:20:00Z',
    userId: '1',
    adminResponse: 'Nous travaillons sur ce problème, correction prévue demain.'
  },
  {
    id: '2',
    title: 'Comment utiliser les promotions flash ?',
    description: 'Je voudrais comprendre comment configurer des promotions temporaires',
    type: 'question',
    status: 'resolved',
    priority: 'medium',
    createdAt: '2024-06-14T16:45:00Z',
    updatedAt: '2024-06-14T18:30:00Z',
    userId: '1',
    adminResponse: 'Voici le guide complet pour les promotions flash: [lien]'
  },
  {
    id: '3',
    title: 'Suggestion: Dark mode',
    description: 'Serait-il possible d\'ajouter un mode sombre à l\'interface ?',
    type: 'suggestion',
    status: 'open',
    priority: 'low',
    createdAt: '2024-06-13T09:15:00Z',
    updatedAt: '2024-06-13T09:15:00Z',
    userId: '1'
  }
];

export const liveSessions: LiveSession[] = [
  {
    id: '1',
    title: 'Masterclass: Stratégies de Black Friday',
    description: 'Prépare-toi pour la saison haute avec nos experts',
    date: '2024-06-20',
    time: '14:00',
    duration: 90,
    instructor: 'Marie Dubois',
    maxParticipants: 100,
    registeredCount: 67,
    isRegistered: true,
    meetingLink: 'https://meet.example.com/blackfriday'
  },
  {
    id: '2',
    title: 'Q&A: Nouveautés Plateforme',
    description: 'Questions/réponses sur les dernières fonctionnalités',
    date: '2024-06-22',
    time: '16:30',
    duration: 60,
    instructor: 'Thomas Bernard',
    maxParticipants: 50,
    registeredCount: 23,
    isRegistered: false
  },
  {
    id: '3',
    title: 'Atelier: Optimisation SEO',
    description: 'Améliore le référencement de tes produits',
    date: '2024-06-25',
    time: '10:00',
    duration: 120,
    instructor: 'Lucie Chen',
    maxParticipants: 30,
    registeredCount: 28,
    isRegistered: false
  }
];

export const leaderboard: Leaderboard[] = [
  {
    rank: 1,
    user: {
      id: '2',
      name: 'Alexandre Moreau',
      email: 'alex@example.com',
      role: 'vendor',
      level: 12,
      points: 4580,
      badges: [],
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      joinedDate: '2023-11-15'
    },
    totalPoints: 4580,
    completedModules: 23,
    badgeCount: 8
  },
  {
    rank: 2,
    user: {
      id: '3',
      name: 'Emma Laurent',
      email: 'emma@example.com',
      role: 'vendor',
      level: 10,
      points: 3890,
      badges: [],
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      joinedDate: '2023-12-01'
    },
    totalPoints: 3890,
    completedModules: 19,
    badgeCount: 6
  },
  {
    rank: 3,
    user: currentUser,
    totalPoints: 2350,
    completedModules: 12,
    badgeCount: 3
  },
  {
    rank: 4,
    user: {
      id: '4',
      name: 'Lucas Petit',
      email: 'lucas@example.com',
      role: 'vendor',
      level: 6,
      points: 1920,
      badges: [],
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      joinedDate: '2024-02-10'
    },
    totalPoints: 1920,
    completedModules: 8,
    badgeCount: 2
  }
];

export const badges: Badge[] = [
  {
    id: '1',
    name: 'Premier Pas',
    description: 'Complété ton premier module',
    icon: '🎯',
    color: 'text-vibrant-green'
  },
  {
    id: '2',
    name: 'Marathonien',
    description: 'Complété 10 modules',
    icon: '🏃‍♀️',
    color: 'text-vibrant-blue'
  },
  {
    id: '3',
    name: 'Quiz Master',
    description: 'Score parfait sur 5 quiz',
    icon: '🧠',
    color: 'text-vibrant-purple'
  },
  {
    id: '4',
    name: 'Perfectionniste',
    description: 'Complété un module à 100%',
    icon: '⭐',
    color: 'text-fun-yellow'
  },
  {
    id: '5',
    name: 'Rapide comme l\'éclair',
    description: 'Terminé un quiz en moins de 5 minutes',
    icon: '⚡',
    color: 'text-vibrant-orange'
  },
  {
    id: '6',
    name: 'Collaborateur',
    description: 'Participé à 3 sessions live',
    icon: '🤝',
    color: 'text-fun-cyan'
  },
  {
    id: '7',
    name: 'Expert',
    description: 'Atteint le niveau 10',
    icon: '👑',
    color: 'text-vibrant-pink'
  },
  {
    id: '8',
    name: 'Mentor',
    description: 'Aidé 5 autres vendeurs',
    icon: '🧑‍🏫',
    color: 'text-vibrant-red'
  }
];
