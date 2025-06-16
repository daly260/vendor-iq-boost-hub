
import React, { useState } from 'react';
import { Plus, Bug, HelpCircle, MessageSquare, Clock, CheckCircle, AlertCircle, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { tickets } from '@/data/mockData';
import { toast } from '@/hooks/use-toast';

const Tickets = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '' as 'bug' | 'question' | 'suggestion' | ''
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'bug': return <Bug className="h-4 w-4" />;
      case 'question': return <HelpCircle className="h-4 w-4" />;
      case 'suggestion': return <MessageSquare className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'bug': return 'bg-vibrant-red text-white';
      case 'question': return 'bg-vibrant-blue text-white';
      case 'suggestion': return 'bg-vibrant-green text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <Clock className="h-4 w-4" />;
      case 'in-progress': return <AlertCircle className="h-4 w-4" />;
      case 'resolved': return <CheckCircle className="h-4 w-4" />;
      case 'closed': return <X className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-vibrant-orange text-white';
      case 'in-progress': return 'bg-vibrant-blue text-white';
      case 'resolved': return 'bg-vibrant-green text-white';
      case 'closed': return 'bg-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-4 border-vibrant-red';
      case 'medium': return 'border-l-4 border-vibrant-orange';
      case 'low': return 'border-l-4 border-vibrant-green';
      default: return 'border-l-4 border-gray-300';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.type) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive"
      });
      return;
    }

    // Simuler la création du ticket
    toast({
      title: "Ticket créé !",
      description: "Votre ticket a été envoyé avec succès. Nous vous répondrons rapidement !",
    });

    setFormData({ title: '', description: '', type: '' });
    setIsDialogOpen(false);
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'bug': return '🐞 Bug';
      case 'question': return '❓ Question';
      case 'suggestion': return '💬 Suggestion';
      default: return type;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'open': return 'Ouvert';
      case 'in-progress': return 'En cours';
      case 'resolved': return 'Résolu';
      case 'closed': return 'Fermé';
      default: return status;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-rainbow bg-clip-text text-transparent">
            🎫 Support & Assistance
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Besoin d'aide ? Créez un ticket et notre équipe vous répondra rapidement !
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-rainbow hover:opacity-90">
              <Plus className="h-4 w-4 mr-2" />
              Nouveau Ticket
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Créer un nouveau ticket</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="type">Type de demande</Label>
                <Select value={formData.type} onValueChange={(value: 'bug' | 'question' | 'suggestion') => setFormData({...formData, type: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bug">🐞 Signaler un bug</SelectItem>
                    <SelectItem value="question">❓ Poser une question</SelectItem>
                    <SelectItem value="suggestion">💬 Faire une suggestion</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="title">Titre</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Décrivez votre problème en quelques mots"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Décrivez votre problème en détail..."
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Annuler
                </Button>
                <Button type="submit" className="bg-gradient-rainbow hover:opacity-90">
                  Créer le ticket
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-vibrant-blue to-vibrant-purple text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Tickets Ouverts</p>
                <p className="text-2xl font-bold">{tickets.filter(t => t.status === 'open').length}</p>
              </div>
              <Clock className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-vibrant-orange to-vibrant-red text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">En Cours</p>
                <p className="text-2xl font-bold">{tickets.filter(t => t.status === 'in-progress').length}</p>
              </div>
              <AlertCircle className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-vibrant-green to-fun-cyan text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Résolus</p>
                <p className="text-2xl font-bold">{tickets.filter(t => t.status === 'resolved').length}</p>
              </div>
              <CheckCircle className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tickets List */}
      <Card>
        <CardHeader>
          <CardTitle>Mes Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <div 
                key={ticket.id}
                className={`p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer ${getPriorityColor(ticket.priority)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <Badge className={getTypeColor(ticket.type)}>
                        <div className="flex items-center space-x-1">
                          {getTypeIcon(ticket.type)}
                          <span>{getTypeLabel(ticket.type)}</span>
                        </div>
                      </Badge>
                      <Badge className={getStatusColor(ticket.status)}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(ticket.status)}
                          <span>{getStatusLabel(ticket.status)}</span>
                        </div>
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <h3 className="font-semibold text-lg mb-2">{ticket.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-3">{ticket.description}</p>
                    
                    {ticket.adminResponse && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border-l-4 border-vibrant-blue">
                        <p className="text-sm font-semibold text-vibrant-blue mb-1">Réponse de l'équipe :</p>
                        <p className="text-sm">{ticket.adminResponse}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-right text-sm text-gray-500">
                    <div>#{ticket.id}</div>
                    <div>Priorité: {ticket.priority}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {tickets.length === 0 && (
            <div className="text-center py-12">
              <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                Aucun ticket pour le moment
              </h3>
              <p className="text-gray-500 mb-4">
                Créez votre premier ticket si vous avez besoin d'aide !
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Tickets;
