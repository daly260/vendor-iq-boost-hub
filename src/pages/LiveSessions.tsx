
import React, { useState } from 'react';
import { Calendar, Clock, Users, Video, UserCheck, ExternalLink, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { liveSessions } from '@/data/mockData';
import { toast } from '@/hooks/use-toast';

const LiveSessions = () => {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'registered'>('all');

  const filteredSessions = liveSessions.filter(session => {
    if (filter === 'upcoming') {
      return new Date(session.date) >= new Date();
    }
    if (filter === 'registered') {
      return session.isRegistered;
    }
    return true;
  });

  const handleRegister = (sessionId: string) => {
    const session = liveSessions.find(s => s.id === sessionId);
    if (session) {
      toast({
        title: session.isRegistered ? "Désinscription confirmée" : "Inscription confirmée !",
        description: session.isRegistered 
          ? "Vous avez été désinscrit de cette session" 
          : `Vous êtes maintenant inscrit à "${session.title}". Vous recevrez un email de confirmation.`,
      });
    }
  };

  const handleJoinSession = (sessionId: string) => {
    const session = liveSessions.find(s => s.id === sessionId);
    if (session?.meetingLink) {
      window.open(session.meetingLink, '_blank');
      toast({
        title: "Redirection vers la session",
        description: "Vous allez être redirigé vers la session live !",
      });
    }
  };

  const isSessionLive = (date: string, time: string) => {
    const sessionDateTime = new Date(`${date}T${time}`);
    const now = new Date();
    const sessionEnd = new Date(sessionDateTime.getTime() + 2 * 60 * 60 * 1000); // +2 heures
    return now >= sessionDateTime && now <= sessionEnd;
  };

  const isSessionToday = (date: string) => {
    const sessionDate = new Date(date);
    const today = new Date();
    return sessionDate.toDateString() === today.toDateString();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-rainbow bg-clip-text text-transparent mb-4">
          📺 Sessions Live & Webinaires
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Rejoins nos experts pour des formations en direct et des sessions Q&A exclusives !
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-3">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
              className={filter === 'all' ? 'bg-gradient-rainbow text-white' : ''}
            >
              Toutes les sessions
            </Button>
            <Button
              variant={filter === 'upcoming' ? 'default' : 'outline'}
              onClick={() => setFilter('upcoming')}
              className={filter === 'upcoming' ? 'bg-gradient-rainbow text-white' : ''}
            >
              <Calendar className="h-4 w-4 mr-2" />
              À venir
            </Button>
            <Button
              variant={filter === 'registered' ? 'default' : 'outline'}
              onClick={() => setFilter('registered')}
              className={filter === 'registered' ? 'bg-gradient-rainbow text-white' : ''}
            >
              <UserCheck className="h-4 w-4 mr-2" />
              Mes inscriptions
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sessions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSessions.map((session) => {
          const isLive = isSessionLive(session.date, session.time);
          const isToday = isSessionToday(session.date);
          const isFull = session.registeredCount >= session.maxParticipants;
          
          return (
            <Card 
              key={session.id} 
              className={`group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
                isLive ? 'ring-2 ring-vibrant-red animate-pulse-glow' : ''
              } ${isToday ? 'border-vibrant-blue border-2' : ''}`}
            >
              <CardHeader className="relative">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {isLive && (
                        <Badge className="bg-vibrant-red text-white animate-pulse">
                          <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                            <span>EN DIRECT</span>
                          </div>
                        </Badge>
                      )}
                      {isToday && !isLive && (
                        <Badge className="bg-vibrant-blue text-white">
                          <Calendar className="h-3 w-3 mr-1" />
                          Aujourd'hui
                        </Badge>
                      )}
                      {session.isRegistered && (
                        <Badge className="bg-vibrant-green text-white">
                          <UserCheck className="h-3 w-3 mr-1" />
                          Inscrit
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg group-hover:text-vibrant-blue transition-colors">
                      {session.title}
                    </CardTitle>
                  </div>
                  <Video className="h-6 w-6 text-vibrant-purple" />
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-gray-600 dark:text-gray-400">{session.description}</p>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="h-4 w-4 text-vibrant-blue" />
                    <span>{new Date(session.date).toLocaleDateString('fr-FR', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm">
                    <Clock className="h-4 w-4 text-vibrant-green" />
                    <span>{session.time} • {session.duration} minutes</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm">
                    <Users className="h-4 w-4 text-vibrant-orange" />
                    <span>{session.registeredCount}/{session.maxParticipants} participants</span>
                  </div>
                  
                  <div className="text-sm">
                    <span className="font-medium">Animateur:</span> {session.instructor}
                  </div>
                </div>

                {/* Progress bar for registration */}
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-rainbow h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(session.registeredCount / session.maxParticipants) * 100}%` }}
                  />
                </div>

                <div className="flex space-x-2">
                  {isLive && session.isRegistered ? (
                    <Button 
                      onClick={() => handleJoinSession(session.id)}
                      className="flex-1 bg-vibrant-red hover:bg-red-600 text-white animate-pulse"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Rejoindre maintenant
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleRegister(session.id)}
                      disabled={isFull && !session.isRegistered}
                      className={`flex-1 ${
                        session.isRegistered 
                          ? 'bg-gray-500 hover:bg-gray-600' 
                          : 'bg-gradient-rainbow hover:opacity-90'
                      } ${isFull && !session.isRegistered ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {session.isRegistered ? (
                        <>
                          <UserCheck className="h-4 w-4 mr-2" />
                          Se désinscrire
                        </>
                      ) : isFull ? (
                        'Complet'
                      ) : (
                        <>
                          <UserCheck className="h-4 w-4 mr-2" />
                          S'inscrire
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredSessions.length === 0 && (
        <div className="text-center py-12">
          <Video className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
            Aucune session trouvée
          </h3>
          <p className="text-gray-500">
            {filter === 'upcoming' 
              ? "Aucune session programmée pour le moment. Revenez bientôt !"
              : filter === 'registered'
              ? "Vous n'êtes inscrit à aucune session pour le moment."
              : "Aucune session disponible actuellement."
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default LiveSessions;
