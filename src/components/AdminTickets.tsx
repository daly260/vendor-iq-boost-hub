import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

interface Ticket {
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  priority: string;
  createdAt: string;
}

const AdminTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/tickets');
      if (!res.ok) throw new Error('Failed to fetch tickets');
      const data = await res.json();
      const ticketsWithId = data.map((t: any) => ({ ...t, id: t._id }));
      setTickets(ticketsWithId);
    } catch (err) {
      console.error('❌ Fetch tickets error:', err);
      toast({
        title: 'Erreur',
        description: 'Impossible de récupérer les tickets.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (ticketId: string, newStatus: string) => {
    console.log(`🟡 Updating status for ticket ${ticketId} to ${newStatus}`);
    try {
      const res = await fetch(`http://localhost:3001/tickets/${ticketId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        const errData = await res.json();
        console.error('❌ Update status server error:', errData);
        throw new Error(errData.error || 'Failed to update status');
      }
      const updatedTicket = await res.json();
      console.log('✅ Status updated:', updatedTicket);
      toast({
        title: 'Succès',
        description: 'Statut mis à jour'
      });
      fetchTickets();
    } catch (err: any) {
      console.error('❌ Update status error:', err);
      toast({
        title: 'Erreur',
        description: `Impossible de mettre à jour le statut: ${err.message || ''}`,
        variant: 'destructive'
      });
    }
  };

  const deleteTicket = async (ticketId: string) => {
    if (!confirm('Voulez-vous vraiment supprimer ce ticket ?')) return;
    try {
      const res = await fetch(`http://localhost:3001/tickets/${ticketId}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete ticket');
      toast({
        title: 'Succès',
        description: 'Ticket supprimé'
      });
      fetchTickets();
    } catch (err) {
      console.error('❌ Delete ticket error:', err);
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer le ticket',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestion des Tickets (Admin)</h1>
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <table className="w-full border-collapse border">
          <thead>
            <tr>
              <th className="border p-2">Titre</th>
              <th className="border p-2">Type</th>
              <th className="border p-2">Statut</th>
              <th className="border p-2">Priorité</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id} className="hover:bg-gray-100">
                <td className="border p-2">{ticket.title}</td>
                <td className="border p-2">{ticket.type}</td>
                <td className="border p-2">
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
                </td>
                <td className="border p-2">{ticket.priority}</td>
                <td className="border p-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteTicket(ticket.id)}
                  >
                    Supprimer
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminTickets;
    