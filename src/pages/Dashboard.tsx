import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpen, Trophy, TrendingUp, Clock, Users, Star,
  Play, Download, Brain, Calendar, Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ProgressBar from '@/components/ProgressBar';
import BadgeDisplay from '@/components/BadgeDisplay';
import LevelProgress from '@/components/LevelProgress';
import { useAuth } from '@/pages/AuthContext';

const Dashboard = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [liveSessions, setLiveSessions] = useState<any[]>([]);
  const [progress, setProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Replace currentUser.id with the actual logged-in user id if available
  const userId = currentUser?.id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token) throw new Error("No token found. Please login.");

        const userRes = await fetch("http://localhost:3001/backend/dashboard/user", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const modulesRes = await fetch("http://localhost:3001/backend/dashboard/modules", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const sessionsRes = await fetch("http://localhost:3001/backend/dashboard/live-sessions", {
          headers: { Authorization: `Bearer ${token}` }
        });

        // If any request failed, handle the error
        if (!userRes.ok) throw new Error(`User fetch failed: ${userRes.status}`);
        if (!modulesRes.ok) throw new Error(`Modules fetch failed: ${modulesRes.status}`);
        if (!sessionsRes.ok) throw new Error(`Sessions fetch failed: ${sessionsRes.status}`);

        const userData = await userRes.json();
        const modulesData = await modulesRes.json();
        const sessionsData = await sessionsRes.json();

        setCurrentUser(userData);
        setModules(modulesData);
        setLiveSessions(sessionsData);
      } catch (err: any) {
        console.error("❌ Error loading dashboard data", err);
        if (err.message.includes("401")) {
          alert("Votre session a expiré. Veuillez vous reconnecter.");
          // navigate('/login'); // if using react-router
        }
      }
    };

    async function fetchProgress() {
      if (!userId) return;
      try {
        const response = await fetch(`/backend/progress/${userId}`);
        const data = await response.json();
        setProgress(data);
      } catch (error) {
        console.error('Error fetching progress:', error);
        setProgress([]);
      }
    }

    fetchData();
    fetchProgress();
  }, [token, userId]);


  useEffect(() => {
    if (!userId) return;
    async function fetchData() {
      try {
        const [modulesRes, progressRes] = await Promise.all([
          fetch('/modules'),
          fetch(`/backend/progress/${userId}`)
        ]);
        const modulesData = await modulesRes.json();
        const progressData = await progressRes.json();
        // Debug logging
        console.log('Modules:', modulesData);
        console.log('Progress:', progressData);
        // Merge progress into modules
        const modulesWithProgress = modulesData.map(m => {
          const moduleProgresses = progressData.filter(
            pr => String(pr.moduleId) === String(m._id) || String(pr.moduleId) === String(m.id)
          );
          const p = moduleProgresses.length > 0
            ? moduleProgresses.reduce((max, curr) => (curr.progress > max.progress ? curr : max), moduleProgresses[0])
            : null;
          console.log('Module:', m.title, 'Progress:', p ? p.progress : 0, 'ModuleId:', m._id, 'ProgressModuleId:', p ? p.moduleId : 'none');
          return {
            ...m,
            completed: p ? p.progress >= 100 : false,
            progress: p ? p.progress : 0,
            completedAt: p ? p.completedAt : null
          };
        });
        setModules(modulesWithProgress);
      } catch (e) {
        setModules([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [userId]);


  if (!currentUser) {
    return <div className="p-6">Chargement...</div>;
  }

  // Remove old nextLevelPoints calculation
  // const nextLevelPoints = (currentUser.level + 1) * 500;
  // const levelProgress = Math.min(100, Math.round((currentUser.points / nextLevelPoints) * 100));

  // Prioritize in-progress, then not-started, exclude completed
  const modulesWithProgress = modules.map(m => {
    const moduleProgresses = progress.filter(
      pr => String(pr.moduleId) === String(m._id) || String(pr.moduleId) === String(m.id)
    );
    const p = moduleProgresses.length > 0
      ? moduleProgresses.reduce((max, curr) => (curr.progress > max.progress ? curr : max), moduleProgresses[0])
      : null;
    return {
      ...m,
      completed: p ? p.progress >= 100 : false,
      progress: p ? p.progress : 0,
      completedAt: p ? p.completedAt : null
    };
  });

  // Use modulesWithProgress for ALL summary calculations
  const completedModulesList = modulesWithProgress.filter(m => m.completed);
  const completedModules = completedModulesList.length;
  const totalModules = modulesWithProgress.length;
  const completionRate = totalModules > 0 ? (completedModules / totalModules) * 100 : 0;
  const totalStudyMinutes = completedModulesList.reduce((sum, m) => sum + (m.duration || 0), 0);
  const totalStudyHours = Math.floor(totalStudyMinutes / 60);
  const totalStudyMinutesRemainder = totalStudyMinutes % 60;
  const totalStudyTimeStr = `${totalStudyHours > 0 ? totalStudyHours + 'h ' : ''}${totalStudyMinutesRemainder}min`;

  // Find the next upcoming live session
  const now = new Date();
  const upcomingSessions = liveSessions.filter(s => {
    // Try to parse date/time
    let sessionDate = s.startDateTime ? new Date(s.startDateTime) : (s.date ? new Date(s.date) : null);
    if (!sessionDate) return false;
    return sessionDate > now;
  });
  upcomingSessions.sort((a, b) => {
    const aDate = a.startDateTime ? new Date(a.startDateTime) : (a.date ? new Date(a.date) : new Date(0));
    const bDate = b.startDateTime ? new Date(b.startDateTime) : (b.date ? new Date(b.date) : new Date(0));
    return aDate.getTime() - bDate.getTime();
  });
  const nextSession = upcomingSessions[0];

  // Deduplicate by module _id
  const seen = new Set();
  const recentModules = [];
  for (const m of modulesWithProgress) {
    const id = String(m._id || m.id);
    if (!seen.has(id)) {
      seen.add(id);
      recentModules.push(m);
    }
    if (recentModules.length >= 3) break;
  }

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

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="p-6 space-y-6">
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
                Salut {currentUser.name} ! 👋
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
                <p className="text-2xl font-bold">{(currentUser.badges && Array.isArray(currentUser.badges)) ? currentUser.badges.length : 0}</p>
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
                <p className="text-2xl font-bold">{totalStudyTimeStr}</p>
              </div>
              <Clock className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <LevelProgress
            currentLevel={currentUser.level}
            currentPoints={currentUser.points}
          />

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
                <div
                  key={module._id || module.id}
                  className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                  onClick={() => navigate('/learning')}
                >
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

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-fun-yellow" />
                <span>Tes Badges</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {currentUser.badges.map((badge: any) => (
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

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-vibrant-red" />
                <span>Prochaine Session Live</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {nextSession ? (
                <div className="space-y-3">
                  <h3 className="font-semibold">{nextSession.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{nextSession.description}</p>
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="h-4 w-4" />
                    <span>{nextSession.startDateTime
                      ? new Date(nextSession.startDateTime).toLocaleString('fr-FR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : nextSession.date + (nextSession.time ? ' à ' + nextSession.time : '')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Users className="h-4 w-4" />
                    <span>{nextSession.registeredCount}/{nextSession.maxParticipants} inscrits</span>
                  </div>
                  <Link to="/live-sessions">
                    <Button className="w-full bg-wamia-orange hover:opacity-90">
                      {nextSession.isRegistered ? 'Rejoindre' : 'S\'inscrire'}
                    </Button>
                  </Link>
                </div>
              ) : (
                <div>Aucune session à venir</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
