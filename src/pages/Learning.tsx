import React, { useState, useEffect } from 'react';
import { Search, Filter, Play, Download, Brain, Clock, Star, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ProgressBar from '@/components/ProgressBar';
import { useAuth } from '@/pages/AuthContext';

const Learning = () => {
  const { user: currentUser } = useAuth();
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [progressList, setProgressList] = useState([]);
  const [videos, setVideos] = useState([]);
  const userId = currentUser?._id;

  const categories = ['all', 'Marketing', 'Logistique', 'Stratégie', 'Analytics'];
  const types = ['all', 'video', 'guide', 'quiz'];
  const difficulties = ['all', 'beginner', 'intermediate', 'advanced'];

  useEffect(() => {
    fetch('/backend/modules')
      .then(res => res.json())
      .then(data => { setModules(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!userId) return;
    fetch(`/backend/progress/${userId}`)
      .then(res => res.json())
      .then(setProgressList);
  }, [userId]);

  const filteredModules = modules.filter(module => {
    const matchesSearch = module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         module.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || module.category === selectedCategory;
    const matchesType = selectedType === 'all' || module.type === selectedType;
    const matchesDifficulty = selectedDifficulty === 'all' || module.difficulty === selectedDifficulty;

    return matchesSearch && matchesCategory && matchesType && matchesDifficulty;
  });

  const getModuleIcon = (type: string) => {
    switch (type) {
      case 'video': return <Play className="h-5 w-5" />;
      case 'guide': return <Download className="h-5 w-5" />;
      case 'quiz': return <Brain className="h-5 w-5" />;
      default: return <BookOpen className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'bg-vibrant-blue text-white';
      case 'guide': return 'bg-vibrant-green text-white';
      case 'quiz': return 'bg-vibrant-purple text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-vibrant-green text-white';
      case 'intermediate': return 'bg-vibrant-orange text-white';
      case 'advanced': return 'bg-vibrant-red text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const handleModuleClick = (moduleId: string) => {
    console.log(`Opening module ${moduleId}`);
    // Future: Navigate or open module detail
  };

  function getVideoProgress(moduleId) {
    const progress = progressList.find(p => p.moduleId === moduleId);
    return progress ? progress.progress : 0;
  }

  async function markVideoComplete(moduleId) {
    await fetch('/backend/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        moduleId,
        status: 'completed',
        progress: 100,
        completedAt: new Date()
      })
    });
    // Refresh progress
    const res = await fetch(`/backend/progress/${userId}`);
    setProgressList(await res.json());
  }

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-rainbow bg-clip-text text-transparent mb-4">
          🚀 Centre d'Apprentissage
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Développe tes compétences et booste tes ventes avec nos formations interactives !
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg border-0 focus:ring-2 focus:ring-vibrant-blue"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="py-2 px-3 bg-gray-100 dark:bg-gray-700 rounded-lg border-0 focus:ring-2 focus:ring-vibrant-blue"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'Toutes catégories' : cat}
                </option>
              ))}
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="py-2 px-3 bg-gray-100 dark:bg-gray-700 rounded-lg border-0 focus:ring-2 focus:ring-vibrant-blue"
            >
              {types.map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'Tous types' : 
                   type === 'video' ? 'Vidéos' :
                   type === 'guide' ? 'Guides' : 'Quiz'}
                </option>
              ))}
            </select>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="py-2 px-3 bg-gray-100 dark:bg-gray-700 rounded-lg border-0 focus:ring-2 focus:ring-vibrant-blue"
            >
              {difficulties.map(diff => (
                <option key={diff} value={diff}>
                  {diff === 'all' ? 'Tous niveaux' :
                   diff === 'beginner' ? 'Débutant' :
                   diff === 'intermediate' ? 'Intermédiaire' : 'Avancé'}
                </option>
              ))}
            </select>

            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedType('all');
                setSelectedDifficulty('all');
              }}
              className="flex items-center space-x-2"
            >
              <Filter className="h-4 w-4" />
              <span>Reset</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModules.map((module) => (
          <Card 
            key={module._id} 
            className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden"
            onClick={() => handleModuleClick(module._id)}
          >
            {module.thumbnail && (
              <div className="h-48 bg-cover bg-center relative overflow-hidden">
                <img 
                  src={module.thumbnail} 
                  alt={module.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute top-4 right-4">
                  <Badge className={getTypeColor(module.type)}>
                    <div className="flex items-center space-x-1">
                      {getModuleIcon(module.type)}
                      <span className="capitalize">{module.type}</span>
                    </div>
                  </Badge>
                </div>
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">{module.duration}min</span>
                  </div>
                </div>
              </div>
            )}

            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-3">
                <Badge className={getDifficultyColor(module.difficulty)}>
                  {module.difficulty === 'beginner' ? 'Débutant' :
                   module.difficulty === 'intermediate' ? 'Intermédiaire' : 'Avancé'}
                </Badge>
                <div className="flex items-center space-x-1 text-vibrant-orange">
                  <Star className="h-4 w-4" />
                  <span className="font-semibold">{module.points}</span>
                </div>
              </div>

              <h3 className="text-lg font-semibold mb-2 group-hover:text-vibrant-blue transition-colors">
                {module.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                {module.description}
              </p>

              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Progression</span>
                  <span className="font-semibold">{Math.round(module.progress)}%</span>
                </div>
                <ProgressBar 
                  progress={module.progress}
                  color={module.completed ? 'green' : 'blue'}
                />
              </div>

              <div className="mt-4 flex justify-between items-center">
                <Badge variant="outline" className="text-xs">
                  {module.category}
                </Badge>
                <Button 
                  size="sm" 
                  className={`${module.completed ? 'bg-vibrant-green' : 'bg-gradient-rainbow'} hover:opacity-90`}
                >
                  {module.completed ? '✓ Terminé' : 
                   module.progress > 0 ? 'Continuer' : 'Commencer'}
                </Button>
              </div>

              {module.type === 'video' && (
                <div className="mt-4">
                  {Array.isArray(videos) && videos.map(video => (
                    <div key={video._id} className="mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold">{video.title}</span>
                        <span className="text-xs text-gray-500">{video.duration} min</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => {/* Open video in modal or new page */}}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          {getVideoProgress(video._id) === 100 ? 'Revoir' : 'Regarder'}
                        </Button>
                        <div className="text-xs text-gray-500">
                          Progress: {getVideoProgress(video._id)}%
                          {getVideoProgress(video._id) === 100 ? (
                            <span className="text-green-500 ml-2">✔ Terminé</span>
                          ) : (
                            <button 
                              onClick={() => markVideoComplete(video._id)} 
                              className="text-vibrant-blue ml-2"
                            >
                              Marquer comme terminé
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredModules.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
            Aucun module trouvé
          </h3>
          <p className="text-gray-500">
            Essayez de modifier vos filtres pour trouver d'autres contenus.
          </p>
        </div>
      )}
    </div>
  );
};

export default Learning;
