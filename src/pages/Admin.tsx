
import React, { useState } from 'react';
import { 
  Users, 
  Video, 
  HelpCircle, 
  TicketIcon, 
  BarChart3, 
  Plus,
  Edit,
  Trash2,
  Eye,
  MessageSquare,
  Archive,
  X,
  Bell,
  Play
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { learningModules, users, tickets, liveSessionsData } from '@/data/mockData';

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [newTicketCount, setNewTicketCount] = useState(3);
  const { toast } = useToast();

  const tabs = [
    { id: 'dashboard', label: '📊 Tableau de bord', icon: BarChart3 },
    { id: 'videos', label: '📹 Vidéos', icon: Video },
    { id: 'quiz', label: '❓ Quiz', icon: HelpCircle },
    { id: 'users', label: '👥 Vendeurs', icon: Users },
    { id: 'tickets', label: '🎫 Tickets', icon: TicketIcon },
    { id: 'live', label: '📺 Sessions Live', icon: Play },
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-wamia-orange">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Vendeurs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-wamia-dark">{users.length}</div>
            <p className="text-xs text-green-600 mt-1">+12% ce mois</p>
          </CardContent>
        </Card>

        <Card className="border-wamia-teal">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Modules Actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-wamia-dark">{learningModules.length}</div>
            <p className="text-xs text-blue-600 mt-1">8 vidéos, 4 quiz</p>
          </CardContent>
        </Card>

        <Card className="border-wamia-red">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Tickets Ouverts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-wamia-dark">{tickets.filter(t => t.status === 'open').length}</div>
            <p className="text-xs text-red-600 mt-1">{newTicketCount} nouveaux</p>
          </CardContent>
        </Card>

        <Card className="border-wamia-blue">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Taux de Complétion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-wamia-dark">78%</div>
            <p className="text-xs text-green-600 mt-1">+5% cette semaine</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-title text-wamia-dark">Activité Récente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
              <div className="w-2 h-2 bg-wamia-orange rounded-full"></div>
              <span className="font-body text-sm">Marie Dubois a terminé "Optimisation des annonces"</span>
              <span className="text-xs text-gray-500 ml-auto">Il y a 2h</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-teal-50 rounded-lg">
              <div className="w-2 h-2 bg-wamia-teal rounded-full"></div>
              <span className="font-body text-sm">Nouveau ticket ouvert par Jean Martin</span>
              <span className="text-xs text-gray-500 ml-auto">Il y a 4h</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-wamia-blue rounded-full"></div>
              <span className="font-body text-sm">Session live "Stratégies de prix" programmée</span>
              <span className="text-xs text-gray-500 ml-auto">Il y a 6h</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderVideos = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-title text-wamia-dark">Gestion des Vidéos</h2>
        <Button className="bg-wamia-orange hover:bg-orange-600 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Vidéo
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Durée</TableHead>
                <TableHead>Vues</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {learningModules.filter(m => m.type === 'video').map((video) => (
                <TableRow key={video.id}>
                  <TableCell className="font-medium">{video.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-wamia-teal text-wamia-teal">
                      {video.category}
                    </Badge>
                  </TableCell>
                  <TableCell>{video.duration} min</TableCell>
                  <TableCell>1,234</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="border-wamia-blue text-wamia-blue">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="border-wamia-orange text-wamia-orange">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="border-wamia-red text-wamia-red">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  const renderQuiz = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-title text-wamia-dark">Gestion des Quiz</h2>
        <Button className="bg-wamia-teal hover:bg-teal-600 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Quiz
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {learningModules.filter(m => m.type === 'quiz').map((quiz) => (
          <Card key={quiz.id} className="border-l-4 border-l-wamia-teal">
            <CardHeader>
              <CardTitle className="text-lg font-title">{quiz.title}</CardTitle>
              <CardDescription>{quiz.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Difficulté:</span>
                  <Badge 
                    variant="outline" 
                    className={`
                      ${quiz.difficulty === 'beginner' ? 'border-green-500 text-green-600' : ''}
                      ${quiz.difficulty === 'intermediate' ? 'border-wamia-orange text-wamia-orange' : ''}
                      ${quiz.difficulty === 'advanced' ? 'border-wamia-red text-wamia-red' : ''}
                    `}
                  >
                    {quiz.difficulty === 'beginner' ? 'Débutant' : 
                     quiz.difficulty === 'intermediate' ? 'Intermédiaire' : 'Avancé'}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Points:</span>
                  <span className="font-semibold text-wamia-dark">{quiz.points} pts</span>
                </div>
                <div className="flex space-x-2 mt-4">
                  <Button size="sm" variant="outline" className="border-wamia-blue text-wamia-blue flex-1">
                    <Edit className="h-4 w-4 mr-1" />
                    Modifier
                  </Button>
                  <Button size="sm" variant="outline" className="border-wamia-red text-wamia-red">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-title text-wamia-dark">Progression des Vendeurs</h2>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendeur</TableHead>
                <TableHead>Niveau</TableHead>
                <TableHead>Points XP</TableHead>
                <TableHead>Badges</TableHead>
                <TableHead>Progression</TableHead>
                <TableHead>Dernière Activité</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <img 
                        src={user.avatar} 
                        alt={user.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-wamia-orange text-white">
                      Niveau {user.level}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold text-wamia-dark">
                    {user.points.toLocaleString()} XP
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      {user.badges.slice(0, 3).map((badge) => (
                        <div 
                          key={badge.id}
                          className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
                          style={{ backgroundColor: badge.color }}
                          title={badge.name}
                        >
                          {badge.icon}
                        </div>
                      ))}
                      {user.badges.length > 3 && (
                        <span className="text-xs text-gray-500">+{user.badges.length - 3}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-wamia-teal h-2 rounded-full" 
                        style={{ width: `${Math.min((user.points % 1000) / 10, 100)}%` }}
                      ></div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    Il y a 2 jours
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  const renderTickets = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-title text-wamia-dark">Gestion des Tickets</h2>
        <div className="flex space-x-2">
          <Button variant="outline" className="border-wamia-blue text-wamia-blue">
            Filtrer
          </Button>
          {newTicketCount > 0 && (
            <div className="relative">
              <Bell className="h-5 w-5 text-wamia-red" />
              <span className="absolute -top-2 -right-2 bg-wamia-red text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {newTicketCount}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {tickets.map((ticket) => (
          <Card key={ticket.id} className={`border-l-4 ${
            ticket.status === 'open' ? 'border-l-wamia-red' :
            ticket.status === 'in-progress' ? 'border-l-wamia-orange' :
            'border-l-wamia-teal'
          }`}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg font-title">{ticket.title}</CardTitle>
                <Badge 
                  variant="outline"
                  className={`
                    ${ticket.status === 'open' ? 'border-wamia-red text-wamia-red' : ''}
                    ${ticket.status === 'in-progress' ? 'border-wamia-orange text-wamia-orange' : ''}
                    ${ticket.status === 'resolved' ? 'border-wamia-teal text-wamia-teal' : ''}
                  `}
                >
                  {ticket.status === 'open' ? 'Ouvert' :
                   ticket.status === 'in-progress' ? 'En cours' : 'Résolu'}
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <Badge 
                  variant="outline"
                  className={`text-xs
                    ${ticket.type === 'bug' ? 'border-red-400 text-red-600' : ''}
                    ${ticket.type === 'question' ? 'border-blue-400 text-blue-600' : ''}
                    ${ticket.type === 'suggestion' ? 'border-green-400 text-green-600' : ''}
                  `}
                >
                  {ticket.type === 'bug' ? '🐞 Bug' :
                   ticket.type === 'question' ? '❓ Question' : '💡 Suggestion'}
                </Badge>
                <Badge 
                  variant="outline"
                  className={`text-xs
                    ${ticket.priority === 'high' ? 'border-wamia-red text-wamia-red' : ''}
                    ${ticket.priority === 'medium' ? 'border-wamia-orange text-wamia-orange' : ''}
                    ${ticket.priority === 'low' ? 'border-gray-400 text-gray-600' : ''}
                  `}
                >
                  {ticket.priority === 'high' ? 'Haute' :
                   ticket.priority === 'medium' ? 'Moyenne' : 'Basse'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">{ticket.description}</p>
              <div className="text-xs text-gray-500 mb-4">
                Créé le {new Date(ticket.createdAt).toLocaleDateString('fr-FR')}
              </div>
              <div className="flex space-x-2">
                <Button size="sm" className="bg-wamia-blue hover:bg-blue-600 text-white flex-1">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Répondre
                </Button>
                <Button size="sm" variant="outline" className="border-wamia-teal text-wamia-teal">
                  <Archive className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" className="border-wamia-red text-wamia-red">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderLiveSessions = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-title text-wamia-dark">Sessions Live</h2>
        <Button className="bg-wamia-red hover:bg-red-600 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Session
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {liveSessionsData.map((session) => (
          <Card key={session.id} className="border-l-4 border-l-wamia-red">
            <CardHeader>
              <CardTitle className="font-title">{session.title}</CardTitle>
              <CardDescription>{session.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-semibold">{session.date} à {session.time}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Durée:</span>
                  <span className="font-semibold">{session.duration} min</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Instructeur:</span>
                  <span className="font-semibold">{session.instructor}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Participants:</span>
                  <span className="font-semibold">{session.registeredCount}/{session.maxParticipants}</span>
                </div>
                <div className="flex space-x-2 mt-4">
                  <Button size="sm" className="bg-wamia-orange hover:bg-orange-600 text-white flex-1">
                    <Edit className="h-4 w-4 mr-1" />
                    Modifier
                  </Button>
                  <Button size="sm" variant="outline" className="border-wamia-red text-wamia-red">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-title text-wamia-dark mb-2">
            🛠️ Administration Wamia
          </h1>
          <p className="text-gray-600 font-body">
            Gérez votre plateforme de formation pour vendeurs
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-wamia-orange text-wamia-orange'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                    {tab.id === 'tickets' && newTicketCount > 0 && (
                      <span className="bg-wamia-red text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {newTicketCount}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="min-h-96">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'videos' && renderVideos()}
          {activeTab === 'quiz' && renderQuiz()}
          {activeTab === 'users' && renderUsers()}
          {activeTab === 'tickets' && renderTickets()}
          {activeTab === 'live' && renderLiveSessions()}
        </div>
      </div>
    </div>
  );
};

export default Admin;
