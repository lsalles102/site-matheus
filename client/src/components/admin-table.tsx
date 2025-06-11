import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Edit, Trash2, MessageCircle, Loader2, Search, Download, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getQueryFn, apiRequest } from "@/lib/queryClient";
import type { Appointment } from "@shared/schema";

export default function AdminTable() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [filters, setFilters] = useState({
    search: "",
    brand: "all",
    date: "",
    status: "all",
  });

  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [editForm, setEditForm] = useState<Partial<Appointment>>({});

  // Query para buscar agendamentos
  const { data: appointments = [], isLoading, refetch } = useQuery<Appointment[]>({
    queryKey: ["/api/admin/appointments", filters],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  // Mutation para atualizar agendamento
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Appointment> }) => {
      const response = await apiRequest("PUT", `/api/admin/appointments/${id}`, data);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/appointments"] });
      toast({
        title: "Agendamento atualizado",
        description: "Agendamento atualizado com sucesso",
      });
      setEditingAppointment(null);
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar",
        description: error.message || "Erro interno do servidor",
        variant: "destructive",
      });
    },
  });

  // Mutation para deletar agendamento
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/admin/appointments/${id}`);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/appointments"] });
      toast({
        title: "Agendamento excluído",
        description: "Agendamento excluído com sucesso",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao excluir",
        description: error.message || "Erro interno do servidor",
        variant: "destructive",
      });
    },
  });

  // Mutation para exportar dados
  const exportMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/admin/appointments/export", {
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Erro ao exportar dados");
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "agendamentos.csv";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
    onError: (error: any) => {
      toast({
        title: "Erro na exportação",
        description: error.message || "Erro interno do servidor",
        variant: "destructive",
      });
    },
  });

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
    if (editingAppointment && editForm) {
      updateMutation.mutate({ id: editingAppointment.id, data: editForm });
    }
  };

  const handleDelete = (appointment: Appointment) => {
    if (confirm(`Tem certeza que deseja excluir o agendamento de ${appointment.name}?`)) {
      deleteMutation.mutate(appointment.id);
    }
  };

  const handleWhatsApp = (appointment: Appointment) => {
    const message = `Olá ${appointment.name}, seu agendamento está confirmado para ${appointment.appointmentDate} às ${appointment.appointmentTime}. Global Tech.`;
    const url = `https://wa.me/55${appointment.phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const handleFilterChange = (key: string, value: string) => {
    // Convert "all" back to empty string for backend compatibility
    const filterValue = value === "all" ? "" : value;
    setFilters(prev => ({ ...prev, [key]: filterValue }));
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      confirmado: "default",
      cancelado: "destructive",
      concluido: "secondary",
    } as const;
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || "default"}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gerenciamento de Agendamentos</CardTitle>
          <CardDescription>
            Visualize e gerencie todos os agendamentos da Global Tech
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filtros */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-[200px]">
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Nome, telefone ou email..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="brand">Marca</Label>
              <Select value={filters.brand} onValueChange={(value) => handleFilterChange("brand", value)}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="iPhone">iPhone</SelectItem>
                  <SelectItem value="Samsung">Samsung</SelectItem>
                  <SelectItem value="Xiaomi">Xiaomi</SelectItem>
                  <SelectItem value="Motorola">Motorola</SelectItem>
                  <SelectItem value="Outros">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="confirmado">Confirmado</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                  <SelectItem value="concluido">Concluído</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end gap-2">
              <Button onClick={() => refetch()} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Atualizar
              </Button>
              <Button 
                onClick={() => exportMutation.mutate()} 
                variant="outline" 
                size="sm"
                disabled={exportMutation.isPending}
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>

          {/* Tabela */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Dispositivo</TableHead>
                  <TableHead>Serviço</TableHead>
                  <TableHead>Endereço</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                      <p className="mt-2 text-gray-500">Carregando agendamentos...</p>
                    </TableCell>
                  </TableRow>
                ) : (appointments as Appointment[]).length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <p className="text-gray-500">Nenhum agendamento encontrado</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  (appointments as Appointment[]).map((appointment: Appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{appointment.name}</p>
                          <p className="text-sm text-gray-500">{appointment.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{appointment.phone}</TableCell>
                      <TableCell>
                        <div>
                          <p>{appointment.appointmentDate}</p>
                          <p className="text-sm text-gray-500">{appointment.appointmentTime}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p>{appointment.deviceBrand}</p>
                          <p className="text-sm text-gray-500">{appointment.deviceModel}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <Badge variant={appointment.serviceType === "premium" ? "default" : "secondary"}>
                            {appointment.serviceType}
                          </Badge>
                          <p className="text-sm text-gray-500 mt-1">
                            {appointment.serviceLocation === "domicilio" ? "A Domicílio" : "Na Loja"}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          {appointment.serviceLocation === "domicilio" ? (
                            <p className="text-sm text-gray-600 truncate" title={appointment.address ?? ""}>
                              {appointment.address ?? "Endereço não informado"}
                            </p>
                          ) : (
                            <p className="text-sm text-gray-500">Na loja</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleWhatsApp(appointment)}
                          >
                            <MessageCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(appointment)}
                            disabled={updateMutation.isPending}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(appointment)}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog de Edição */}
      <Dialog open={!!editingAppointment} onOpenChange={(open) => !open && setEditingAppointment(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Agendamento</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Nome</Label>
              <Input
                id="edit-name"
                value={editForm.name || ""}
                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="edit-phone">Telefone</Label>
              <Input
                id="edit-phone"
                value={editForm.phone || ""}
                onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="edit-status">Status</Label>
              <Select value={editForm.status || ""} onValueChange={(value) => setEditForm(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="confirmado">Confirmado</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                  <SelectItem value="concluido">Concluído</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={handleSaveEdit} disabled={updateMutation.isPending} className="flex-1">
                {updateMutation.isPending ? "Salvando..." : "Salvar"}
              </Button>
              <Button variant="outline" onClick={() => setEditingAppointment(null)} className="flex-1">
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}