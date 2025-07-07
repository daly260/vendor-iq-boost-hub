import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, Play, Download, Brain, Clock, Star, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ProgressBar from '@/components/ProgressBar';
import { useAuth } from '@/pages/AuthContext';

// @ts-ignore
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: any;
  }
}

const YouTubePlayerModal = ({ videoUrl, open, onClose, userId, moduleId, onProgressUpdate, lastWatchedTime }) => {
  const playerRef = useRef(null);
  const [player, setPlayer] = useState(null);
  const [lastSentProgress, setLastSentProgress] = useState(0);
  const intervalRef = useRef(null);

  // Extract YouTube video ID from URL
  const match = videoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/#\s]{11})/);
  const videoId = match ? match[1] : null;

  useEffect(() => {
    if (!open || !videoId) return;
    // Load YouTube IFrame API if not already loaded
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
    }
    // Wait for YT to be ready
    let lastBackendSent = 0;
    const onYouTubeIframeAPIReady = () => {
      if (playerRef.current && !player) {
        const ytPlayer = new window.YT.Player(playerRef.current, {
          videoId,
          events: {
            onReady: (event) => {
              if (lastWatchedTime && lastWatchedTime > 0) {
                event.target.seekTo(lastWatchedTime, true);
              }
            },
            onStateChange: (event) => {
              if (event.data === window.YT.PlayerState.PLAYING) {
                if (!intervalRef.current) {
                  intervalRef.current = setInterval(async () => {
                    const current = ytPlayer.getCurrentTime();
                    const duration = ytPlayer.getDuration();
                    if (duration > 0) {
                      const percent = Math.floor((current / duration) * 100);
                      if (onProgressUpdate) {
                        onProgressUpdate(percent); // update UI instantly
                      }
                      // Send to backend every 5 seconds or on 100%
                      const now = Date.now();
                      if (percent === 100 || now - lastBackendSent > 5000) {
                        lastBackendSent = now;
                        await fetch('http://localhost:3001/backend/progress', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            userId,
                            moduleId,
                            status: percent === 100 ? 'completed' : 'in-progress',
                            progress: percent,
                            completedAt: percent === 100 ? new Date() : undefined,
                            lastWatchedTime: current
                          })
                        });
                      }
                    }
                  }, 500);
                }
              } else if (event.data === window.YT.PlayerState.ENDED) {
                setLastSentProgress(100);
                fetch('http://localhost:3001/backend/progress', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    userId,
                    moduleId,
                    status: 'completed',
                    progress: 100,
                    completedAt: new Date(),
                    lastWatchedTime: ytPlayer.getDuration()
                  })
                });
                if (onProgressUpdate) onProgressUpdate(100);
                clearInterval(intervalRef.current);
                intervalRef.current = null;
              } else if (event.data === window.YT.PlayerState.PAUSED || event.data === window.YT.PlayerState.BUFFERING) {
                if (intervalRef.current) {
                  clearInterval(intervalRef.current);
                  intervalRef.current = null;
                }
              }
            },
          },
        });
        setPlayer(ytPlayer);
      }
    };
    if (window.YT && window.YT.Player) {
      onYouTubeIframeAPIReady();
    } else {
      window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (player) player.destroy && player.destroy();
      setPlayer(null);
    };
    // eslint-disable-next-line
  }, [open, videoId, lastWatchedTime]);

  if (!open) return null;
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: 8, padding: 24, position: 'relative', maxWidth: 800, width: '90vw' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 8, right: 8, fontSize: 24, background: 'none', border: 'none', cursor: 'pointer' }}>&times;</button>
        {videoId ? (
          <div>
            <div ref={playerRef} id="ytplayer-embed" style={{ width: 720, height: 405 }} />
          </div>
        ) : (
          <div>Invalid YouTube URL</div>
        )}
      </div>
    </div>
  );
};

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
  const [playerModalOpen, setPlayerModalOpen] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState("");
  const [currentModuleId, setCurrentModuleId] = useState("");
  const [claimedModules, setClaimedModules] = useState([]);
  const userId = currentUser?._id;

  const categories = ['all', 'Marketing', 'Logistique', 'Stratégie', 'Analytics'];
  const types = ['all', 'video', 'guide', 'quiz'];
  const niveaux = ['Débutant', 'Intermédiaire', 'Avancé'];

  useEffect(() => {
    fetch('/backend/modules')
      .then(res => res.json())
      .then(data => { 
        setModules(data); 
        setLoading(false);
        console.log('Modules loaded:', data);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!userId) return;
    fetch(`http://localhost:3001/backend/progress/${userId}`)
      .then(res => res.json())
      .then(data => {
        setProgressList(data);
        console.log('ProgressList loaded:', data);
      });
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
    // Compare as strings to avoid type mismatch
    const progress = progressList.find(p => String(p.moduleId) === String(moduleId));
    return progress ? progress.progress : 0;
  }

  function getVideoStatus(moduleId) {
    const progress = progressList.find(p => String(p.moduleId) === String(moduleId));
    if (!progress) return 'not-started';
    if (progress.progress >= 100) return 'completed';
    if (progress.progress > 0) return 'in-progress';
    return 'not-started';
  }

  async function markVideoComplete(moduleId) {
    await fetch('http://localhost:3001/backend/progress', {
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
    const res = await fetch(`http://localhost:3001/backend/progress/${userId}`);
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
              <option value="">Tous niveaux</option>
              {niveaux.map(niveau => (
                <option key={niveau} value={niveau}>{niveau}</option>
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
                  {module.difficulty}
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
                  <span className="font-semibold">{getVideoProgress(module._id)}%</span>
                </div>
                <ProgressBar 
                  progress={getVideoProgress(module._id)}
                  color={getVideoStatus(module._id) === 'completed' ? 'green' : 'blue'}
                />
              </div>

              <div className="mt-4 flex justify-between items-center">
                <Badge variant="outline" className="text-xs">
                  {module.category}
                </Badge>
                <Button 
                  size="sm" 
                  className={`${getVideoStatus(module._id) === 'completed' ? 'bg-vibrant-green' : 'bg-gradient-rainbow'} hover:opacity-90`}
                  onClick={async (e) => {
                    e.stopPropagation();
                    if (getVideoStatus(module._id) !== 'completed') {
                      if (getVideoProgress(module._id) === 0) {
                        await fetch('http://localhost:3001/backend/progress', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            userId,
                            moduleId: module._id,
                            status: 'in-progress',
                            progress: 1,
                            startedAt: new Date()
                          })
                        });
                        const res = await fetch(`http://localhost:3001/backend/progress/${userId}`);
                        setProgressList(await res.json());
                      }
                      if (module.videoUrl) {
                        setCurrentVideoUrl(module.videoUrl);
                        setCurrentModuleId(module._id);
                        setPlayerModalOpen(true);
                      } else if (module.link) {
                        setCurrentVideoUrl(module.link);
                        setCurrentModuleId(module._id);
                        setPlayerModalOpen(true);
                      }
                    }
                  }}
                  disabled={getVideoStatus(module._id) === 'completed'}
                >
                  {getVideoStatus(module._id) === 'completed' ? '✓ Terminé' :
                   getVideoProgress(module._id) > 0 ? 'Continuer' : 'Commencer'}
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

              {getVideoStatus(module._id) === 'completed' && !claimedModules.includes(module._id) && (
                <Button
                  size="sm"
                  className="bg-vibrant-green mt-2"
                  onClick={async (e) => {
                    e.stopPropagation();
                    const res = await fetch('http://localhost:3001/backend/progress/claim-points', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ userId, moduleId: module._id })
                    });
                    if (res.ok) {
                      setClaimedModules([...claimedModules, module._id]);
                      alert('Points claimed!');
                    } else {
                      const data = await res.json();
                      alert(data.error || 'Failed to claim points');
                    }
                  }}
                >
                  Réclamer les points
                </Button>
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

      <YouTubePlayerModal
        videoUrl={currentVideoUrl}
        open={playerModalOpen}
        onClose={() => setPlayerModalOpen(false)}
        userId={userId}
        moduleId={currentModuleId}
        lastWatchedTime={(() => {
          const progress = progressList.find(p => String(p.moduleId) === String(currentModuleId));
          return progress ? progress.lastWatchedTime : 0;
        })()}
        onProgressUpdate={async (percent) => {
          const res = await fetch(`http://localhost:3001/backend/progress/${userId}`);
          setProgressList(await res.json());
        }}
      />
    </div>
  );
};

export default Learning;
