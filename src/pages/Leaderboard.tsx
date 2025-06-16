
import React, { useState } from 'react';
import { Trophy, Medal, Crown, Star, TrendingUp, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import BadgeDisplay from '@/components/BadgeDisplay';
import { leaderboard, badges, currentUser } from '@/data/mockData';

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'badges'>('leaderboard');

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="h-6 w-6 text-fun-yellow" />;
      case 2: return <Medal className="h-6 w-6 text-gray-400" />;
      case 3: return <Medal className="h-6 w-6 text-vibrant-orange" />;
      default: return <span className="text-lg font-bold text-gray-500">#{rank}</span>;
    }
  };

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-gradient-to-r from-fun-yellow to-vibrant-orange';
      case 2: return 'bg-gradient-to-r from-gray-300 to-gray-400';
      case 3: return 'bg-gradient-to-r from-vibrant-orange to-vibrant-red';
      default: return 'bg-gray-100 dark:bg-gray-800';
    }
  };

  const currentUserRank = leaderboard.find(entry => entry.user.id === currentUser.id);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-rainbow bg-clip-text text-transparent mb-4">
          🏆 Classements & Badges
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Découvre où tu te situes et débloques de nouveaux badges !
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg max-w-md mx-auto">
        <Button
          variant={activeTab === 'leaderboard' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('leaderboard')}
          className={`flex-1 ${activeTab === 'leaderboard' ? 'bg-gradient-rainbow text-white' : ''}`}
        >
          <Trophy className="h-4 w-4 mr-2" />
          Classement
        </Button>
        <Button
          variant={activeTab === 'badges' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('badges')}
          className={`flex-1 ${activeTab === 'badges' ? 'bg-gradient-rainbow text-white' : ''}`}
        >
          <Star className="h-4 w-4 mr-2" />
          Badges
        </Button>
      </div>

      {activeTab === 'leaderboard' && (
        <div className="space-y-6">
          {/* Current User Stats */}
          {currentUserRank && (
            <Card className="bg-gradient-ocean text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img 
                        src={currentUser.avatar} 
                        alt={currentUser.name}
                        className="w-16 h-16 rounded-full border-4 border-white"
                      />
                      <div className="absolute -bottom-2 -right-2 bg-white text-vibrant-blue rounded-full w-8 h-8 flex items-center justify-center font-bold">
                        #{currentUserRank.rank}
                      </div>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">Ta Position</h2>
                      <p className="opacity-90">{currentUser.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{currentUserRank.totalPoints.toLocaleString()}</div>
                    <div className="text-sm opacity-90">points</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Top 3 Podium */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {leaderboard.slice(0, 3).map((entry) => (
              <Card 
                key={entry.user.id} 
                className={`${getRankBg(entry.rank)} ${entry.rank === 1 ? 'md:order-2 transform md:scale-105' : entry.rank === 2 ? 'md:order-1' : 'md:order-3'} text-white border-0 hover:scale-105 transition-transform duration-200`}
              >
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-3">
                    {getRankIcon(entry.rank)}
                  </div>
                  <img 
                    src={entry.user.avatar} 
                    alt={entry.user.name}
                    className="w-16 h-16 rounded-full mx-auto mb-3 border-4 border-white"
                  />
                  <h3 className="font-bold text-lg">{entry.user.name}</h3>
                  <p className="text-sm opacity-90 mb-3">Niveau {entry.user.level}</p>
                  <div className="space-y-1">
                    <div className="text-xl font-bold">{entry.totalPoints.toLocaleString()}</div>
                    <div className="text-xs opacity-75">points</div>
                    <div className="text-sm">{entry.completedModules} modules • {entry.badgeCount} badges</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Full Leaderboard */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Classement Complet</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaderboard.map((entry) => (
                  <div 
                    key={entry.user.id}
                    className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                      entry.user.id === currentUser.id 
                        ? 'bg-gradient-ocean text-white' 
                        : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-8">
                        {getRankIcon(entry.rank)}
                      </div>
                      <img 
                        src={entry.user.avatar} 
                        alt={entry.user.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <h3 className="font-semibold">{entry.user.name}</h3>
                        <p className={`text-sm ${entry.user.id === currentUser.id ? 'text-blue-100' : 'text-gray-500'}`}>
                          Niveau {entry.user.level}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{entry.totalPoints.toLocaleString()} pts</div>
                      <div className={`text-sm ${entry.user.id === currentUser.id ? 'text-blue-100' : 'text-gray-500'}`}>
                        {entry.completedModules} modules • {entry.badgeCount} badges
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'badges' && (
        <div className="space-y-6">
          {/* User Badges */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-fun-yellow" />
                <span>Tes Badges ({currentUser.badges.length}/{badges.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {currentUser.badges.map((badge) => (
                  <div key={badge.id} className="text-center">
                    <BadgeDisplay badge={badge} size="lg" />
                    <h3 className="font-semibold mt-2">{badge.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">{badge.description}</p>
                    {badge.unlockedAt && (
                      <p className="text-xs text-vibrant-green mt-1">
                        Débloqué le {new Date(badge.unlockedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* All Available Badges */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Tous les Badges Disponibles</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {badges.map((badge) => {
                  const isUnlocked = currentUser.badges.some(userBadge => userBadge.id === badge.id);
                  return (
                    <div key={badge.id} className="text-center">
                      <BadgeDisplay 
                        badge={badge} 
                        size="lg" 
                        unlocked={isUnlocked}
                      />
                      <h3 className={`font-semibold mt-2 ${!isUnlocked ? 'text-gray-400' : ''}`}>
                        {badge.name}
                      </h3>
                      <p className={`text-xs mt-1 ${!isUnlocked ? 'text-gray-400' : 'text-gray-500'}`}>
                        {badge.description}
                      </p>
                      {!isUnlocked && (
                        <p className="text-xs text-vibrant-orange mt-1 font-semibold">
                          🔒 À débloquer
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
