
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Trophy, 
  TrendingUp, 
  Clock, 
  Users, 
  Star,
  Play,
  Download,
  Brain,
  Calendar,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ProgressBar from '@/components/ProgressBar';
import BadgeDisplay from '@/components/BadgeDisplay';
import LevelProgress from '@/components/LevelProgress';
import { currentUser, learningModules, liveSessionsData } from '@/data/mockData';

const Dashboard = () => {
  const recentModules = learningModules.slice(0, 3);
  const nextLevelPoints = (currentUser.level + 1) * 500;
  const completedModules = learningModules.filter(m => m.completed).length;
  const totalModules = learningModules.length;
  const completionRate = (completedModules / totalModules) * 100;

  const getModuleIcon = (type: string) => {
    switch (type) {
      case 'video': return <Play className="h-5 w-5" />;
      case 'guide': return <Download className="h-5 w-5" />;
      case 'quiz': return <Brain className="h-5 w-5" />;
      default: return <BookOpen className="h-5 w-5" />;
    }
  };

  const getModuleColor = (type: string) => {
    switch (type) {
      case 'video': return 'text-vibrant-blue';
      case 'guide': return 'text-vibrant-green';
      case 'quiz': return 'text-vibrant-purple';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-wamia-orange rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name}
              className="w-16 h-16 rounded-full border-4 border-white shadow-lg"
            />
            <div>
              <h1 className="text-2xl font-bold">
                Salut {currentUser.name.split(' ')[0]} ! 👋
              </h1>
              <p className="opacity-90">Prêt à booster tes ventes aujourd'hui ?</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{currentUser.points.toLocaleString()}</div>
            <div className="text-sm opacity-90">points totaux</div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-vibrant-blue text-white border-0 hover:scale-105 transition-transform duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Modules Complétés</p>
                <p className="text-2xl font-bold">{completedModules}/{totalModules}</p>
              </div>
              <BookOpen className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-vibrant-green text-white border-0 hover:scale-105 transition-transform duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Taux de Réussite</p>
                <p className="text-2xl font-bold">{Math.round(completionRate)}%</p>
              </div>
              <TrendingUp className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-vibrant-orange text-white border-0 hover:scale-105 transition-transform duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">Badges Débloqués</p>
                <p className="text-2xl font-bold">{currentUser.badges.length}</p>
              </div>
              <Trophy className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-vibrant-pink text-white border-0 hover:scale-105 transition-transform duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-pink-100">Temps d'Étude</p>
                <p className="text-2xl font-bold">12h</p>
              </div>
              <Clock className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Level Progress */}
        <div className="lg:col-span-2 space-y-6">
          <LevelProgress
            currentLevel={currentUser.level}
            currentPoints={currentUser.points}
            nextLevelPoints={nextLevelPoints}
          />

          {/* Recent Modules */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-vibrant-orange" />
                  <span>Continue ton apprentissage</span>
                </CardTitle>
                <Link to="/learning">
                  <Button variant="outline" size="sm">Voir tout</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentModules.map((module) => (
                <div key={module.id} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                  <div className={`p-2 rounded-lg bg-white shadow-sm ${getModuleColor(module.type)}`}>
                    {getModuleIcon(module.type)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{module.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{module.description}</p>
                    <div className="mt-2">
                      <ProgressBar 
                        progress={module.progress} 
                        color={module.completed ? 'green' : 'blue'}
                        className="max-w-xs"
                      />
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1 text-vibrant-orange">
                      <Star className="h-4 w-4" />
                      <span className="font-semibold">{module.points}</span>
                    </div>
                    <div className="text-sm text-gray-500">{module.duration}min</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Badges */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-fun-yellow" />
                <span>Tes Badges</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {currentUser.badges.map((badge) => (
                  <BadgeDisplay key={badge.id} badge={badge} size="md" />
                ))}
              </div>
              <Link to="/leaderboard">
                <Button variant="outline" className="w-full mt-4">
                  Voir tous les badges
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Next Live Session */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-vibrant-red" />
                <span>Prochaine Session Live</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {liveSessionsData.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold">{liveSessionsData[0].title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{liveSessionsData[0].description}</p>
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="h-4 w-4" />
                    <span>{liveSessionsData[0].date} à {liveSessionsData[0].time}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Users className="h-4 w-4" />
                    <span>{liveSessionsData[0].registeredCount}/{liveSessionsData[0].maxParticipants} inscrits</span>
                  </div>
                  <Link to="/live-sessions">
                    <Button className="w-full bg-wamia-orange hover:opacity-90">
                      {liveSessionsData[0].isRegistered ? 'Rejoindre' : 'S\'inscrire'}
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
