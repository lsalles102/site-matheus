import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Trash2, MessageCircle, Loader2 } from "lucide-react";
import type { Appointment } from "@shared/schema";

interface AdminTableProps {
  appointments: Appointment[];
  isLoading: boolean;
  onUpdateAppointment: (id: number, data: Partial<Appointment>) => void;
  onDeleteAppointment: (id: number) => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

export default function AdminTable({
  appointments,
  isLoading,
  onUpdateAppointment,
  onDeleteAppointment,
  isUpdating,
  isDeleting,
}: AdminTableProps) {
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [editForm, setEditForm] = useState<Partial<Appointment>>({});

  const handleEdit = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setEditForm({
      name: appointment.name,
      phone: appointment.phone,
      email: appointment.email,
      appointmentDate: appointment.appointmentDate,
      appointmentTime: appointment.appointmentTime,
      deviceBrand: appointment.deviceBrand,
      deviceModel: appointment.deviceModel,
      serviceType: appointment.serviceType,
      status: appointment.status,
    });
  };

  const handleSaveEdit = () => {
    if (editingAppointment) {
      onUpdateAppointment(editingAppointment.id, editForm);
      setEditingAppointment(null);
      setEditForm({});
    }
  };

  const handleDelete = (appointment: Appointment) => {
    if (confirm(`Tem certeza que deseja excluir o agendamento de ${appointment.name}?`)) {
      onDeleteAppointment(appointment.id);
    }
  };

  const handleWhatsApp = (appointment: Appointment) => {
    const message = `Olá ${appointment.name}, confirmo seu agendamento para ${appointment.appointmentDate} às ${appointment.appointmentTime}. Global Tech.`;
    const phone = appointment.phone.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/55${phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      confirmado: "bg-green-100 text-green-800",
      cancelado: "bg-red-100 text-red-800",
      concluido: "bg-blue-100 text-blue-800",
    };
    return variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800";
  };

  const getServiceBadge = (serviceType: string) => {
    return serviceType === "premium" 
      ? "bg-purple-100 text-purple-800" 
      : "bg-gray-100 text-gray-800";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Carregando agendamentos...</span>
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Nenhum agendamento encontrado.</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead>Aparelho</TableHead>
              <TableHead>Data/Hora</TableHead>
              <TableHead>Serviço</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.map((appointment) => (
              <TableRow key={appointment.id} className="hover:bg-gray-50">
                <TableCell>
                  <div>
                    <div className="font-semibold text-gray-900">{appointment.name}</div>
                    <div className="text-sm text-gray-500">{appointment.email}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-gray-900">{appointment.phone}</div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-semibold text-gray-900">{appointment.deviceBrand}</div>
                    <div className="text-sm text-gray-500">{appointment.deviceModel}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {new Date(appointment.appointmentDate).toLocaleDateString('pt-BR')}
                    </div>
                    <div className="text-sm text-gray-500">{appointment.appointmentTime}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getServiceBadge(appointment.serviceType)}>
                    {appointment.serviceType === "premium" ? "Premium" : "Básica"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusBadge(appointment.status)}>
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex justify-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(appointment)}
                      disabled={isUpdating}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(appointment)}
                      disabled={isDeleting}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleWhatsApp(appointment)}
                      className="text-green-600 hover:text-green-700"
                    >
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingAppointment} onOpenChange={() => setEditingAppointment(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Agendamento</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nome</Label>
              <Input
                id="edit-name"
                value={editForm.name || ""}
                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Telefone</Label>
              <Input
                id="edit-phone"
                value={editForm.phone || ""}
                onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                value={editForm.email || ""}
                onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-date">Data</Label>
              <Input
                id="edit-date"
                type="date"
                value={editForm.appointmentDate || ""}
                onChange={(e) => setEditForm(prev => ({ ...prev, appointmentDate: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-time">Horário</Label>
              <Input
                id="edit-time"
                type="time"
                value={editForm.appointmentTime || ""}
                onChange={(e) => setEditForm(prev => ({ ...prev, appointmentTime: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={editForm.status || ""}
                onValueChange={(value) => setEditForm(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="confirmado">Confirmado</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                  <SelectItem value="concluido">Concluído</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 mt-6">
            <Button variant="outline" onClick={() => setEditingAppointment(null)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveEdit} disabled={isUpdating}>
              {isUpdating ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
