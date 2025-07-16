import React, { useState, useEffect } from 'react';
import {
  Users, Video, HelpCircle, TicketIcon, BarChart3, Play, Edit, Trash2, Calendar, BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [newTicketCount, setNewTicketCount] = useState(3);
  const { toast } = useToast();

  // State for backend data
  const [quizzes, setQuizzes] = useState([]);
  const [liveSessions, setLiveSessions] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Video CRUD state
  const [videos, setVideos] = useState([]);
  const [editVideo, setEditVideo] = useState(null);

  const tabs = [
    { id: 'dashboard', label: ' Tableau de bord', icon: BarChart3 },
    { id: 'videos', label: ' Vidéos', icon: Video },
    { id: 'quiz', label: ' Quiz', icon: HelpCircle },
    { id: 'users', label: ' Vendeurs', icon: Users },
    { id: 'tickets', label: ' Tickets', icon: TicketIcon },
    { id: 'live', label: ' Sessions Live', icon: Play },
  ];

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [quizzesRes, liveRes, usersRes] = await Promise.all([
          fetch('/modules?type=quiz'),
          fetch('/live-sessions'),
          fetch('/users')
        ]);
        setQuizzes(await quizzesRes.json());
        setLiveSessions(await liveRes.json());
        setUsers(await usersRes.json());
      } catch (e) {
        // handle error
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Fetch videos on mount
  useEffect(() => {
    async function fetchVideos() {
      try {
        const res = await fetch('/backend/modules?type=video');
        const data = await res.json();
        setVideos(Array.isArray(data) ? data : []);
      } catch {
        setVideos([]);
      }
    }
    fetchVideos();
  }, []);

  // Tickets logic
  const [tickets, setTickets] = useState<any[]>([]);
  const [openTicketCount, setOpenTicketCount] = useState(0);
  const [loadingTickets, setLoadingTickets] = useState(false);

  useEffect(() => {
    if (activeTab === 'tickets') {
      fetchTickets();
    }
  }, [activeTab]);

  useEffect(() => {
    async function fetchTickets() {
      try {
        const res = await fetch('http://localhost:3001/tickets');
        const data = await res.json();
        // Map MongoDB _id to id for React keys and requests
        const ticketsWithId = data.map((t: any) => ({ ...t, id: t._id }));
        setTickets(ticketsWithId);
        const newCount = ticketsWithId.filter((t) => t.status === 'open').length;
        setNewTicketCount(newCount);
        setOpenTicketCount(ticketsWithId.filter(t => t.status === 'open').length);
      } catch (err) {
        console.error(err);
        toast({ title: 'Erreur', description: 'Impossible de charger les tickets', variant: 'destructive' });
      } finally {
        setLoadingTickets(false);
      }
    }
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoadingTickets(true);
    try {
      const res = await fetch('http://localhost:3001/tickets');
      const data = await res.json();
      // Map MongoDB _id to id for React keys and requests
      const ticketsWithId = data.map((t: any) => ({ ...t, id: t._id }));
      setTickets(ticketsWithId);
      const newCount = ticketsWithId.filter((t) => t.status === 'open').length;
      setNewTicketCount(newCount);
    } catch (err) {
      console.error(err);
      toast({ title: 'Erreur', description: 'Impossible de charger les tickets', variant: 'destructive' });
    } finally {
      setLoadingTickets(false);
    }
  };

  const sendAdminResponse = async (ticketId: string, text: string) => {
    if (!text.trim()) {
      toast({ title: 'Erreur', description: 'Réponse vide', variant: 'destructive' });
      return;
    }
    try {
      const res = await fetch(`http://localhost:3001/tickets/${ticketId}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender: 'admin', text })
      });
      if (!res.ok) throw new Error();
      toast({ title: 'Réponse envoyée' });
      fetchTickets();
    } catch {
      toast({ title: 'Erreur', description: 'Échec de l\'envoi', variant: 'destructive' });
    }
  };

  const updateStatus = async (ticketId: string, newStatus: string) => {
    try {
      const res = await fetch(`http://localhost:3001/tickets/${ticketId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error();
      toast({ title: 'Statut mis à jour' });
      fetchTickets();
    } catch {
      toast({ title: 'Erreur', description: 'Impossible de mettre à jour le statut', variant: 'destructive' });
    }
  };

  const deleteTicket = async (ticketId: string) => {
    if (!confirm('Voulez-vous vraiment supprimer ce ticket ?')) return;
    try {
      const res = await fetch(`http://localhost:3001/tickets/${ticketId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      toast({ title: 'Ticket supprimé' });
      fetchTickets();
    } catch {
      toast({ title: 'Erreur', description: 'Impossible de supprimer le ticket', variant: 'destructive' });
    }
  };

  // Add state for dialog visibility and form data
  const [showAddVideo, setShowAddVideo] = useState(false);
  const [showAddQuiz, setShowAddQuiz] = useState(false);
  const [showAddSession, setShowAddSession] = useState(false);
  const [showAddVendor, setShowAddVendor] = useState(false);

  type FormDataType = {
    title?: string;
    description?: string;
    videoUrl?: string;
    category?: string;
    difficulty?: string;
    points?: number | string;
    duration?: number | string;
    thumbnail?: string;
    quizUrl?: string;
    name?: string;
    email?: string;
    password?: string;
    startDateTime?: string;
    endDateTime?: string;
    instructor?: string;
    maxParticipants?: number | string;
    link?: string;
    question?: string;
    choices?: string[];
    correctAnswer?: string;
    relatedModuleId?: string;
    [key: string]: any;
  };

  const [formData, setFormData] = useState<FormDataType>({});

  // Add, edit, delete session handlers
  const [editSession, setEditSession] = useState(null);

  // Add state for editing vendor
  const [editVendor, setEditVendor] = useState(null);

  // Add handlers for opening/closing dialogs and submitting forms
  const handleAdd = (type) => {
    setFormData({});
    if (type === 'video') setShowAddVideo(true);
    if (type === 'quiz') setShowAddQuiz(true);
    if (type === 'session') setShowAddSession(true);
    if (type === 'vendor') setShowAddVendor(true);
  };
  const handleClose = () => {
    setShowAddVideo(false);
    setShowAddQuiz(false);
    setShowAddSession(false);
    setShowAddVendor(false);
  };
  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const DIFFICULTY_MAP = {
    beginner: 'Débutant',
    intermediate: 'Intermédiaire',
    advanced: 'Avancé',
    'Débutant': 'Débutant',
    'Intermédiaire': 'Intermédiaire',
    'Avancé': 'Avancé',
  };
  const handleSubmit = async (type) => {
    let url = '';
    let body = {};
    let method = 'POST';
    if (type === 'video') {
      url = '/backend/modules';
      body = {
        ...formData,
        type: 'video',
        difficulty: DIFFICULTY_MAP[formData.difficulty] || formData.difficulty,
        points: Number(formData.points) || 0,
        duration: Number(formData.duration) || 0,
        completed: false,
        progress: 0,
      };
      if (
        !formData || typeof formData !== 'object' ||
        !formData.title ||
        !formData.description ||
        !formData.videoUrl ||
        !formData.points ||
        !formData.category ||
        !formData.difficulty
      ) {
        alert('Veuillez remplir tous les champs obligatoires.');
        return;
      }
    } else if (type === 'quiz') {
      if (formData._id || formData.id) {
        // Editing existing quiz
        url = `/modules/${formData._id || formData.id}`;
        method = 'PUT';
        body = { ...formData, type: 'quiz' };
      } else {
        // Creating new quiz
        url = '/modules';
        method = 'POST';
        body = { ...formData, type: 'quiz' };
      }
    } else if (type === 'session') {
      url = '/live-sessions';
      body = formData;
    } else if (type === 'vendor') {
      url = '/register';
      body = { ...formData };
    }
    console.log('Submitting:', body);
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    let err = null;
    try {
      if (!res.ok) err = await res.json();
    } catch (e) {
      err = { error: 'Erreur inconnue' };
    }
    if (!res.ok) {
      alert('Erreur: ' + (err.error || 'Impossible d\'ajouter.'));
      return;
    }
    handleClose();
    window.location.reload(); // Reload to fetch new data
  };
  const handleEditSession = async (id, sessionData) => {
    await fetch(`/live-sessions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sessionData),
    });
    window.location.reload();
  };
  const handleDeleteSession = async (id) => {
    await fetch(`/live-sessions/${id}`, { method: 'DELETE' });
    window.location.reload();
  };
  const handleEditVendor = async (id, vendorData) => {
    try {
      const res = await fetch(`/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vendorData),
      });
      if (!res.ok) throw new Error('Failed to update vendor');
      const updatedVendor = await res.json();
      setUsers(users.map(user => user._id === id ? updatedVendor : user));
      setEditVendor(null);
      toast({ title: 'Vendeur mis à jour', description: 'Les informations du vendeur ont été mises à jour.' });
    } catch (error) {
      toast({ title: 'Erreur', description: 'Impossible de mettre à jour le vendeur.', variant: 'destructive' });
    }
  };
  const handleDeleteVendor = async (id) => {
    if (!confirm('Voulez-vous vraiment supprimer ce vendeur ?')) return;
    try {
      const res = await fetch(`/users/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete vendor');
      setUsers(users.filter(user => user._id !== id));
      toast({ title: 'Vendeur supprimé' });
    } catch (err) {
      toast({ title: 'Erreur', description: 'Impossible de supprimer le vendeur', variant: 'destructive' });
    }
  };

  // Add state for editing video
  const [editVideoState, setEditVideoState] = useState(null);

  // Add state for learning stats and period selector
  const [learningStats, setLearningStats] = useState({ perDay: [], perWeek: [], perMonth: [] });
  const [statsLoading, setStatsLoading] = useState(true);
  const [period, setPeriod] = useState('perDay');

  useEffect(() => {
    async function fetchStats() {
      setStatsLoading(true);
      try {
        const res = await fetch('http://localhost:3001/progress/stats/learning-minutes');
        const data = await res.json();
        setLearningStats(data);
      } catch (err) {
        setLearningStats({ perDay: [], perWeek: [], perMonth: [] });
      } finally {
        setStatsLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="p-6 space-y-6">
      {/* Tab Navigation */}
      <nav className="flex space-x-4 mb-6 border-b border-gray-300 dark:border-gray-700">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-3 py-2 -mb-px font-medium border-b-2 ${
                isActive
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{tab.label}</span>
              {tab.id === 'tickets' && newTicketCount > 0 && (
                <Badge className="ml-1 bg-red-600 text-white rounded-full px-2 py-0.5 text-xs">
                  {newTicketCount}
                </Badge>
              )}
            </button>
          );
        })}
      </nav>

      {/* Tickets Tab Content */}
      {activeTab === 'tickets' && (
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Tickets Support</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingTickets ? (
              <p>Chargement des tickets...</p>
            ) : tickets.length === 0 ? (
              <p>Aucun ticket trouvé.</p>
            ) : (
              <div className="space-y-4">
                {tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className={`p-4 rounded-lg border ${
                      ticket.status === 'open' ? 'border-blue-400 bg-blue-50' :
                      ticket.status === 'in-progress' ? 'border-yellow-400 bg-yellow-50' :
                      ticket.status === 'resolved' ? 'border-green-400 bg-green-50' :
                      'border-gray-300 bg-gray-100'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg">{ticket.title}</h3>
                      <Select
                        value={ticket.status}
                        onValueChange={(val) => updateStatus(ticket.id, val)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="open">Ouvert</SelectItem>
                          <SelectItem value="in-progress">En cours</SelectItem>
                          <SelectItem value="resolved">Résolu</SelectItem>
                          <SelectItem value="closed">Fermé</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-2">{ticket.description}</p>
                    <div className="space-y-1 max-h-56 overflow-auto mb-3">
                      {ticket.messages.map((m: any, i: number) => (
                        <div
                          key={i}
                          className={`p-2 rounded ${
                            m.sender === 'admin'
                              ? 'bg-blue-100 dark:bg-blue-900/20 border-l-4 border-blue-600'
                              : 'bg-green-100 dark:bg-green-900/20 border-l-4 border-green-600'
                          }`}
                        >
                          <p className="text-sm font-semibold mb-1">
                            {m.sender === 'admin' ? 'Réponse Admin :' : 'Message Utilisateur :'}
                          </p>
                          <p className="text-sm">{m.text}</p>
                          <div className="text-xs text-gray-500 mt-1">{new Date(m.createdAt).toLocaleString()}</div>
                        </div>
                      ))}
                    </div>
                    <Textarea
                      rows={2}
                      placeholder="Répondre au ticket..."
                      value={ticket.responseDraft}
                      onChange={(e) =>
                        setTickets((prev) =>
                          prev.map((t) =>
                            t.id === ticket.id ? { ...t, responseDraft: e.target.value } : t
                          )
                        )
                      }
                    />
                    <div className="flex justify-between items-center mt-2">
                      <Button
                        size="sm"
                        className="bg-gradient-rainbow hover:opacity-90 text-white"
                        onClick={() => sendAdminResponse(ticket.id, ticket.responseDraft)}
                      >
                        Envoyer la réponse
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteTicket(ticket.id)}
                      >
                        Supprimer
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Videos Tab Content */}
      {activeTab === 'videos' && (
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Gestion des Vidéos</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => handleAdd('video')} className="mb-4">
              Ajouter une vidéo
            </Button>
            {videos.length === 0 ? (
              <p>Aucune vidéo trouvée.</p>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                {/* Video List Section */}
                {videos.map((video) => (
                  <div key={video._id} style={{ width: 300, border: '1px solid #eee', borderRadius: 8, padding: 16, background: '#fafbfc', boxShadow: '0 2px 8px #0001', marginBottom: 16 }}>
                    <h4 style={{ margin: 0 }}>{video.title}</h4>
                    <p style={{ color: '#666', fontSize: 14 }}>{video.description}</p>
                    {video.thumbnail && <img src={video.thumbnail} alt={video.title} style={{ width: '100%', borderRadius: 4, marginBottom: 8 }} />}
                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                      <button
                        onClick={() => setEditVideo(video)}
                        style={{ background: '#0070f3', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 4, cursor: 'pointer' }}
                      >
                        Modifier
                      </button>
                      <button
                        onClick={async () => { await fetch(`/backend/modules/${video._id}`, { method: 'DELETE' }); setVideos(videos.filter(v => v._id !== video._id)); }}
                        style={{ background: '#e53e3e', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 4, cursor: 'pointer' }}
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {editVideo && (
              <div style={{
                position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
              }}>
                <div style={{ background: '#fff', borderRadius: 8, padding: 32, minWidth: 320, boxShadow: '0 2px 16px #0002' }}>
                  <h3 style={{ marginTop: 0 }}>Modifier la vidéo</h3>
                  <input name="title" value={editVideo.title || ''} onChange={e => setEditVideo({ ...editVideo, title: e.target.value })} placeholder="Titre" style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 4, border: '1px solid #ccc' }} />
                  <input name="description" value={editVideo.description || ''} onChange={e => setEditVideo({ ...editVideo, description: e.target.value })} placeholder="Description" style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 4, border: '1px solid #ccc' }} />
                  <input name="videoUrl" value={editVideo.videoUrl || ''} onChange={e => setEditVideo({ ...editVideo, videoUrl: e.target.value })} placeholder="URL de la vidéo (videoUrl)" style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 4, border: '1px solid #ccc' }} />
                  <input name="thumbnail" value={editVideo.thumbnail || ''} onChange={e => setEditVideo({ ...editVideo, thumbnail: e.target.value })} placeholder="URL de la miniature (thumbnail)" style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 4, border: '1px solid #ccc' }} />
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <button onClick={async () => { await fetch(`/backend/modules/${editVideo._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editVideo) }); setEditVideo(null); const res = await fetch('/backend/modules?type=video'); setVideos(await res.json()); }} style={{ background: '#0070f3', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 4, cursor: 'pointer' }}>Enregistrer</button>
                    <button onClick={() => setEditVideo(null)} style={{ background: '#aaa', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 4, cursor: 'pointer' }}>Annuler</button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Quizzes Tab Content */}
      {activeTab === 'quiz' && (
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Gestion des Quiz</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => handleAdd('quiz')} className="mb-4">
              Ajouter un quiz
            </Button>
            {quizzes.length === 0 ? (
              <p>Aucun quiz trouvé.</p>
            ) : (
              <div className="space-y-4">
                {quizzes.map((quiz) => (
                  <div key={quiz._id || quiz.id} className="p-4 rounded-lg border border-gray-300 bg-gray-50">
                    <h3 className="font-semibold text-lg">{quiz.title}</h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-2">{quiz.description}</p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="text-xs rounded-full bg-blue-100 text-blue-800 px-3 py-1">
                        Quiz
                      </span>
                      <span className="text-xs rounded-full bg-green-100 text-green-800 px-3 py-1">
                        {quiz.points} points
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <Button
                        size="sm"
                        className="bg-gradient-rainbow hover:opacity-90 text-white mr-2"
                        onClick={() => {
                          setFormData({
                            ...quiz,
                            choices: Array.isArray(quiz.choices) ? quiz.choices.join(', ') : quiz.choices || '',
                            relatedModuleId: quiz.relatedModuleId || ''
                          });
                          setShowAddQuiz(true);
                        }}
                      >
                        Modifier
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={async () => {
                          if (window.confirm('Voulez-vous vraiment supprimer ce quiz ?')) {
                            await fetch(`/modules/${quiz._id || quiz.id}`, { method: 'DELETE' });
                            setQuizzes(quizzes.filter(q => (q._id || q.id) !== (quiz._id || quiz.id)));
                          }
                        }}
                      >
                        Supprimer
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Vendors Tab Content */}
      {activeTab === 'users' && (
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Gestion des Vendeurs</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => handleAdd('vendor')} className="mb-4">
              Ajouter un vendeur
            </Button>
            {users.length === 0 ? (
              <p>Aucun vendeur trouvé.</p>
            ) : (
              <div className="overflow-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nom
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map(vendor => (
                      <tr key={vendor._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {vendor.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {vendor.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <Button
                            size="sm"
                            className="bg-gradient-rainbow hover:opacity-90 text-white mr-2"
                            onClick={() => setEditVendor(vendor)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Modifier
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteVendor(vendor._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            Supprimer
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Live Sessions Tab Content */}
      {activeTab === 'live' && (
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Gestion des Sessions Live</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => handleAdd('session')} className="mb-4">
              Ajouter une session live
            </Button>
            {liveSessions.length === 0 ? (
              <p>Aucune session live trouvée.</p>
            ) : (
              <div className="space-y-4">
                {liveSessions.map((session) => (
                  <Card key={session._id || session.id} className="border-l-4 border-l-wamia-red">
                    <CardHeader>
                      <CardTitle className="font-title">{session.title}</CardTitle>
                      <CardDescription>{session.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-2">
                          <span className="text-xs rounded-full bg-blue-100 text-blue-800 px-3 py-1">
                            Session Live
                          </span>
                        </div>
                        <div>
                          <strong>Participants inscrits :</strong>
                          <ul>
                            {(session.registeredUsers && session.registeredUsers.length > 0)
                              ? session.registeredUsers.map((userId, idx) => {
                                  const user = users.find(u => String(u._id) === String(userId));
                                  return <li key={userId}>{user ? `${user.name || user.email || user._id}` : userId}</li>;
                                })
                              : <li>Aucun inscrit</li>}
                          </ul>
                        </div>
                        <div className="flex justify-between items-center mt-4">
                          <Button
                            size="sm"
                            className="bg-gradient-rainbow hover:opacity-90 text-white"
                            onClick={() => window.open(session.link, '_blank')}
                          >
                            Rejoindre la session
                          </Button>
                          <div className="flex space-x-2">
                            <Button size="sm" className="bg-wamia-orange hover:bg-orange-600 text-white flex-1" onClick={() => setEditSession(session)}>
                              <Edit className="h-4 w-4 mr-1" />
                              Modifier
                            </Button>
                            <Button size="sm" variant="outline" className="border-wamia-red text-wamia-red" onClick={() => handleDeleteSession(session._id || session.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Add Video Modal */}
      {showAddVideo && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ overflowY: 'auto' }}>
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 className="text-lg font-semibold mb-4">Ajouter une vidéo</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Titre
                </label>
                <input
                  name="title"
                  onChange={handleFormChange}
                  className="block w-full border border-gray-300 rounded-md p-2"
                  placeholder="Titre de la vidéo"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  onChange={handleFormChange}
                  className="block w-full border border-gray-300 rounded-md p-2"
                  placeholder="Description de la vidéo"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL de la vidéo
                </label>
                <input
                  name="videoUrl"
                  onChange={handleFormChange}
                  className="block w-full border border-gray-300 rounded-md p-2"
                  placeholder="https://exemple.com/ma-video"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Catégorie
                </label>
                <select
                  name="category"
                  onChange={handleFormChange}
                  className="block w-full border border-gray-300 rounded-md p-2"
                  required
                >
                  <option value="">Catégorie</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Logistique">Logistique</option>
                  <option value="Stratégie">Stratégie</option>
                  <option value="Analytics">Analytics</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Difficulté
                </label>
                <select
                  name="difficulty"
                  onChange={handleFormChange}
                  className="block w-full border border-gray-300 rounded-md p-2"
                  required
                >
                  <option value="">Difficulté</option>
                  <option value="beginner">Débutant</option>
                  <option value="intermediate">Intermédiaire</option>
                  <option value="advanced">Avancé</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Points
                </label>
                <input
                  name="points"
                  type="number"
                  onChange={handleFormChange}
                  className="block w-full border border-gray-300 rounded-md p-2"
                  placeholder="Nombre de points"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Durée
                </label>
                <input
                  name="duration"
                  placeholder="Durée (minutes)"
                  type="number"
                  value={formData.duration || ''}
                  onChange={handleFormChange}
                  className="block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL de la miniature
                </label>
                <input
                  name="thumbnail"
                  onChange={handleFormChange}
                  className="block w-full border border-gray-300 rounded-md p-2"
                  placeholder="https://exemple.com/ma-miniature"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button
                onClick={() => handleSubmit('video')}
                className="bg-gradient-rainbow hover:opacity-90 text-white"
              >
                Ajouter la vidéo
              </Button>
              <Button
                onClick={handleClose}
                variant="outline"
                className="text-gray-700 border-gray-300 hover:bg-gray-100"
              >
                Annuler
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Quiz Modal */}
      {showAddQuiz && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Ajouter un quiz</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Titre
                </label>
                <input
                  name="title"
                  value={formData.title || ''}
                  onChange={handleFormChange}
                  className="block w-full border border-gray-300 rounded-md p-2"
                  placeholder="Titre du quiz"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description || ''}
                  onChange={handleFormChange}
                  className="block w-full border border-gray-300 rounded-md p-2"
                  placeholder="Description du quiz"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Module associé
                </label>
                <select
                  name="relatedModuleId"
                  value={formData.relatedModuleId || ''}
                  onChange={handleFormChange}
                  className="block w-full border border-gray-300 rounded-md p-2"
                  required
                >
                  <option value="">Sélectionner un module</option>
                  {videos.map((mod) => (
                    <option key={mod._id} value={mod._id}>{mod.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Question (QSM)
                </label>
                <input
                  name="question"
                  value={formData.question || ''}
                  onChange={handleFormChange}
                  className="block w-full border border-gray-300 rounded-md p-2"
                  placeholder="Question du quiz"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Choix (séparés par des virgules)
                </label>
                <input
                  name="choices"
                  value={Array.isArray(formData.choices) ? formData.choices.join(', ') : (formData.choices || '')}
                  onChange={e => setFormData({ ...formData, choices: e.target.value.split(',').map(s => s.trim()) })}
                  className="block w-full border border-gray-300 rounded-md p-2"
                  placeholder="ex: Rouge, Bleu, Vert, Jaune"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bonne réponse (doit correspondre à un des choix)
                </label>
                <input
                  name="correctAnswer"
                  value={formData.correctAnswer || ''}
                  onChange={handleFormChange}
                  className="block w-full border border-gray-300 rounded-md p-2"
                  placeholder="Bonne réponse"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Points
                </label>
                <input
                  name="points"
                  type="number"
                  value={formData.points || ''}
                  onChange={handleFormChange}
                  className="block w-full border border-gray-300 rounded-md p-2"
                  placeholder="Nombre de points"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button
                onClick={() => handleSubmit('quiz')}
                className="bg-gradient-rainbow hover:opacity-90 text-white"
              >
                {formData._id || formData.id ? 'Modifier le quiz' : 'Ajouter le quiz'}
              </Button>
              <Button
                onClick={handleClose}
                variant="outline"
                className="text-gray-700 border-gray-300 hover:bg-gray-100"
              >
                Annuler
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Vendor Modal */}
      {showAddVendor && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Ajouter un vendeur</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom
                </label>
                <input
                  name="name"
                  onChange={handleFormChange}
                  className="block w-full border border-gray-300 rounded-md p-2"
                  placeholder="Nom du vendeur"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  onChange={handleFormChange}
                  className="block w-full border border-gray-300 rounded-md p-2"
                  placeholder="Email du vendeur"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mot de passe
                </label>
                <input
                  name="password"
                  type="password"
                  onChange={handleFormChange}
                  className="block w-full border border-gray-300 rounded-md p-2"
                  placeholder="Mot de passe"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button
                onClick={() => handleSubmit('vendor')}
                className="bg-gradient-rainbow hover:opacity-90 text-white"
              >
                Ajouter le vendeur
              </Button>
              <Button
                onClick={handleClose}
                variant="outline"
                className="text-gray-700 border-gray-300 hover:bg-gray-100"
              >
                Annuler
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Session Modal */}
      {showAddSession && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Ajouter une session live</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Titre
                </label>
                <input
                  name="title"
                  onChange={handleFormChange}
                  className="block w-full border border-gray-300 rounded-md p-2"
                  placeholder="Titre de la session"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  onChange={handleFormChange}
                  className="block w-full border border-gray-300 rounded-md p-2"
                  placeholder="Description de la session"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date et Heure de Début
                </label>
                <input
                  name="startDateTime"
                  type="datetime-local"
                  onChange={handleFormChange}
                  className="block w-full border border-gray-300 rounded-md p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date et Heure de Fin
                </label>
                <input
                  name="endDateTime"
                  type="datetime-local"
                  onChange={handleFormChange}
                  className="block w-full border border-gray-300 rounded-md p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Intervenant
                </label>
                <input
                  name="instructor"
                  onChange={handleFormChange}
                  className="block w-full border border-gray-300 rounded-md p-2"
                  placeholder="Nom de l'intervenant"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre max de participants
                </label>
                <input
                  name="maxParticipants"
                  placeholder="Nombre max de participants"
                  type="number"
                  onChange={handleFormChange}
                  className="block w-full border border-gray-300 rounded-md p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lien de la session
                </label>
                <input
                  name="link"
                  onChange={handleFormChange}
                  className="block w-full border border-gray-300 rounded-md p-2"
                  placeholder="https://exemple.com/ma-session-live"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button
                onClick={() => handleSubmit('session')}
                className="bg-gradient-rainbow hover:opacity-90 text-white"
              >
                Ajouter la session
              </Button>
              <Button
                onClick={handleClose}
                variant="outline"
                className="text-gray-700 border-gray-300 hover:bg-gray-100"
              >
                Annuler
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Session Modal */}
      {editSession && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Modifier la session</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Titre
                </label>
                <input
                  name="title"
                  value={editSession.title}
                  onChange={e => setEditSession({ ...editSession, title: e.target.value })}
                  className="block w-full border border-gray-300 rounded-md p-2"
                  placeholder="Titre de la session"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={editSession.description}
                  onChange={e => setEditSession({ ...editSession, description: e.target.value })}
                  className="block w-full border border-gray-300 rounded-md p-2"
                  placeholder="Description de la session"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date et Heure de Début
                </label>
                <input
                  name="startDateTime"
                  type="datetime-local"
                  value={editSession.startDateTime}
                  onChange={e => setEditSession({ ...editSession, startDateTime: e.target.value })}
                  className="block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date et Heure de Fin
                </label>
                <input
                  name="endDateTime"
                  type="datetime-local"
                  value={editSession.endDateTime}
                  onChange={e => setEditSession({ ...editSession, endDateTime: e.target.value })}
                  className="block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Intervenant
                </label>
                <input
                  name="instructor"
                  value={editSession.instructor}
                  onChange={e => setEditSession({ ...editSession, instructor: e.target.value })}
                  className="block w-full border border-gray-300 rounded-md p-2"
                  placeholder="Nom de l'intervenant"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre max de participants
                </label>
                <input
                  name="maxParticipants"
                  placeholder="Nombre max de participants"
                  type="number"
                  value={editSession.maxParticipants}
                  onChange={e => setEditSession({ ...editSession, maxParticipants: e.target.value })}
                  className="block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lien de la session
                </label>
                <input
                  name="link"
                  value={editSession.link || ''}
                  onChange={e => setEditSession({ ...editSession, link: e.target.value })}
                  className="block w-full border border-gray-300 rounded-md p-2"
                  placeholder="https://exemple.com/ma-session-live"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button
                onClick={async () => { await handleEditSession(editSession._id || editSession.id, editSession); setEditSession(null); }}
                className="bg-gradient-rainbow hover:opacity-90 text-white"
              >
                Enregistrer
              </Button>
              <Button
                onClick={() => setEditSession(null)}
                variant="outline"
                className="text-gray-700 border-gray-300 hover:bg-gray-100"
              >
                Annuler
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Vendor Modal */}
      {editVendor && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Modifier le vendeur</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom
                </label>
                <input
                  name="name"
                  value={editVendor.name || ''}
                  onChange={e => setEditVendor({ ...editVendor, name: e.target.value })}
                  className="block w-full border border-gray-300 rounded-md p-2"
                  placeholder="Nom du vendeur"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  value={editVendor.email || ''}
                  onChange={e => setEditVendor({ ...editVendor, email: e.target.value })}
                  className="block w-full border border-gray-300 rounded-md p-2"
                  placeholder="Email du vendeur"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mot de passe
                </label>
                <input
                  name="password"
                  type="password"
                  onChange={e => setEditVendor({ ...editVendor, password: e.target.value })}
                  className="block w-full border border-gray-300 rounded-md p-2"
                  placeholder="Mot de passe"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button
                onClick={async () => {
                  await fetch(`/backend/users/${editVendor._id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: editVendor.name, email: editVendor.email, role: editVendor.role }),
                  });
                  setEditVendor(null);
                  // Refetch users after update
                  const res = await fetch('/backend/users');
                  setUsers(await res.json());
                }}
                className="bg-gradient-rainbow hover:opacity-90 text-white"
              >
                Enregistrer
              </Button>
              <Button
                onClick={() => setEditVendor(null)}
                variant="outline"
                className="text-gray-700 border-gray-300 hover:bg-gray-100"
              >
                Annuler
              </Button>
            </div>
          </div>
        </div>
      )}

      {activeTab !== 'tickets' && (
        activeTab === 'dashboard' ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Utilisateurs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{users.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Modules Vidéo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{videos.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Quiz</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{quizzes.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Sessions Live</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{liveSessions.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Tickets</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{tickets.length}</div>
                  <div className="text-sm text-gray-500">Total</div>
                  <div className="text-lg text-blue-600">{openTicketCount} ouverts</div>
                </CardContent>
              </Card>
            </div>
            <div className="my-8">
              <h2 className="text-xl font-bold mb-4">Moyenne de minutes apprises</h2>
              <select value={period} onChange={e => setPeriod(e.target.value)} className="mb-4">
                <option value="perDay">Jour</option>
                <option value="perWeek">Semaine</option>
                <option value="perMonth">Mois</option>
              </select>
              {statsLoading ? (
                <div>Chargement du graphique...</div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={learningStats[period]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis label={{ value: "Minutes", angle: -90, position: "insideLeft" }} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="average" name="Moyenne" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-20">
            <p>Contenu pour l'onglet "{activeTab}" sera bientôt disponible.</p>
          </div>
        )
      )}
    </div>
  );
};

export default Admin;
