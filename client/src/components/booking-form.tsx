import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Calendar, CheckCircle, AlertCircle } from "lucide-react";

const bookingSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  phone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
  email: z.string().email("Email inválido"),
  appointmentDate: z.string().min(1, "Data é obrigatória"),
  appointmentTime: z.string().min(1, "Horário é obrigatório"),
  deviceBrand: z.string().min(1, "Marca é obrigatória"),
  deviceModel: z.string().min(1, "Modelo é obrigatório"),
  serviceType: z.enum(["basica", "premium"], {
    required_error: "Tipo de serviço é obrigatório",
  }),
  serviceLocation: z.enum(["loja", "domicilio"], {
    required_error: "Local do serviço é obrigatório",
  }),
  address: z.string().optional(),
}).refine((data) => {
  if (data.serviceLocation === "domicilio" && (!data.address || data.address.trim() === "")) {
    return false;
  }
  return true;
}, {
  message: "Endereço é obrigatório para atendimento a domicílio",
  path: ["address"],
});

type BookingFormData = z.infer<typeof bookingSchema>;

const availableTimes = [
  "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"
];

const deviceBrands = [
  "Apple", "Samsung", "Motorola", "Xiaomi", "LG", "Huawei", "Outro"
];

export default function BookingForm() {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [whatsappLink, setWhatsappLink] = useState<string>("");
  const [availabilityStatus, setAvailabilityStatus] = useState<{
    checking: boolean;
    available: boolean | null;
    message: string;
  }>({ checking: false, available: null, message: "" });
  const { toast } = useToast();

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      appointmentDate: "",
      appointmentTime: "",
      deviceBrand: "",
      deviceModel: "",
      serviceType: undefined,
      serviceLocation: undefined,
      address: "",
    },
  });

  const bookingMutation = useMutation({
    mutationFn: async (data: BookingFormData) => {
      const response = await apiRequest("/api/appointments", {
        method: "POST",
        body: data,
      });
      return await response.json();
    },
    onSuccess: (data) => {
      setShowSuccessModal(true);
      setWhatsappLink(data.whatsappLink || "");
      form.reset();
      toast({
        title: "Agendamento confirmado!",
        description: data.message,
      });
    },
    onError: (error) => {
      toast({
        title: "Erro no agendamento",
        description: error.message || "Ocorreu um erro ao processar seu agendamento.",
        variant: "destructive",
      });
    },
  });

  // Função para verificar disponibilidade
  const checkAvailability = async (date: string, time: string) => {
    if (!date || !time) return;
    
    setAvailabilityStatus({ checking: true, available: null, message: "Verificando disponibilidade..." });
    
    try {
      const response = await fetch(`/api/appointments/check-availability?date=${date}&time=${time}`);
      const data = await response.json();
      
      if (data.available) {
        setAvailabilityStatus({
          checking: false,
          available: true,
          message: "✓ Horário disponível!"
        });
      } else {
        setAvailabilityStatus({
          checking: false,
          available: false,
          message: "✗ Este horário já está ocupado. Escolha outro horário."
        });
      }
    } catch (error) {
      setAvailabilityStatus({
        checking: false,
        available: false,
        message: "Erro ao verificar disponibilidade."
      });
    }
  };

  // Verificar disponibilidade quando data ou hora mudarem
  useEffect(() => {
    const date = form.watch("appointmentDate");
    const time = form.watch("appointmentTime");
    
    if (date && time) {
      checkAvailability(date, time);
    } else {
      setAvailabilityStatus({ checking: false, available: null, message: "" });
    }
  }, [form.watch("appointmentDate"), form.watch("appointmentTime")]);

  const onSubmit = (data: BookingFormData) => {
    if (availabilityStatus.available === false) {
      toast({
        title: "Horário indisponível",
        description: "Por favor, escolha um horário disponível.",
        variant: "destructive",
      });
      return;
    }
    bookingMutation.mutate(data);
  };

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 11) {
      return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (cleaned.length >= 7) {
      return cleaned.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else if (cleaned.length >= 3) {
      return cleaned.replace(/(\d{2})(\d{0,5})/, '($1) $2');
    }
    return cleaned;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    form.setValue("phone", formatted);
  };

  return (
    <>
      <Card className="bg-card shadow-xl border-border">
        <CardContent className="p-8">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Nome e Telefone */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo *</Label>
                <Input
                  id="name"
                  {...form.register("name")}
                  className="focus:ring-2 focus:ring-primary"
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-red-600">{form.formState.errors.name.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">WhatsApp *</Label>
                <Input
                  id="phone"
                  type="tel"
                  {...form.register("phone")}
                  onChange={handlePhoneChange}
                  className="focus:ring-2 focus:ring-primary"
                />
                {form.formState.errors.phone && (
                  <p className="text-sm text-red-600">{form.formState.errors.phone.message}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">E-mail *</Label>
              <Input
                id="email"
                type="email"
                {...form.register("email")}
                className="focus:ring-2 focus:ring-primary"
              />
              {form.formState.errors.email && (
                <p className="text-sm text-red-600">{form.formState.errors.email.message}</p>
              )}
            </div>

            {/* Data e Hora */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="appointmentDate">Data do Atendimento *</Label>
                <Input
                  id="appointmentDate"
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  {...form.register("appointmentDate")}
                  className="focus:ring-2 focus:ring-primary text-white bg-gray-800 border-gray-600 [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:brightness-200"
                />
                {form.formState.errors.appointmentDate && (
                  <p className="text-sm text-red-600">{form.formState.errors.appointmentDate.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label>Horário *</Label>
                <Select onValueChange={(value) => form.setValue("appointmentTime", value)}>
                  <SelectTrigger className="focus:ring-2 focus:ring-primary">
                    <SelectValue placeholder="Selecione o horário" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTimes.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.appointmentTime && (
                  <p className="text-sm text-red-600">{form.formState.errors.appointmentTime.message}</p>
                )}
              </div>
            </div>

            {/* Indicador de Disponibilidade */}
            {availabilityStatus.message && (
              <div className={`p-3 rounded-lg flex items-center gap-2 ${
                availabilityStatus.checking 
                  ? "bg-blue-50 text-blue-700 border border-blue-200" 
                  : availabilityStatus.available 
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
              }`}>
                {availabilityStatus.checking ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                ) : availabilityStatus.available ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <span className="text-sm font-medium">{availabilityStatus.message}</span>
              </div>
            )}

            {/* Marca e Modelo */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Marca do Aparelho *</Label>
                <Select onValueChange={(value) => form.setValue("deviceBrand", value)}>
                  <SelectTrigger className="focus:ring-2 focus:ring-primary">
                    <SelectValue placeholder="Selecione a marca" />
                  </SelectTrigger>
                  <SelectContent>
                    {deviceBrands.map((brand) => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.deviceBrand && (
                  <p className="text-sm text-red-600">{form.formState.errors.deviceBrand.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="deviceModel">Modelo do Aparelho *</Label>
                <Input
                  id="deviceModel"
                  {...form.register("deviceModel")}
                  placeholder="Ex: iPhone 14 Pro Max"
                  className="focus:ring-2 focus:ring-primary"
                />
                {form.formState.errors.deviceModel && (
                  <p className="text-sm text-red-600">{form.formState.errors.deviceModel.message}</p>
                )}
              </div>
            </div>

            {/* Tipo de Serviço */}
            <div className="space-y-4">
              <Label>Tipo de Blindagem *</Label>
              <RadioGroup
                onValueChange={(value) => form.setValue("serviceType", value as "basica" | "premium")}
                className="grid md:grid-cols-2 gap-4"
              >
                <div className="flex items-center space-x-2 p-4 border-2 border-border rounded-xl hover:border-primary transition-all cursor-pointer">
                  <RadioGroupItem value="basica" id="basica" />
                  <div className="flex-1">
                    <Label htmlFor="basica" className="cursor-pointer">
                      <div className="font-semibold text-foreground">Blindagem Básica</div>
                      <div className="text-sm text-muted-foreground">Proteção essencial</div>
                    </Label>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 p-4 border-2 border-border rounded-xl hover:border-primary transition-all cursor-pointer">
                  <RadioGroupItem value="premium" id="premium" />
                  <div className="flex-1">
                    <Label htmlFor="premium" className="cursor-pointer">
                      <div className="font-semibold text-foreground">Blindagem Premium</div>
                      <div className="text-sm text-muted-foreground">Proteção completa</div>
                    </Label>
                  </div>
                </div>
              </RadioGroup>
              {form.formState.errors.serviceType && (
                <p className="text-sm text-red-600">{form.formState.errors.serviceType.message}</p>
              )}
            </div>

            {/* Local do Serviço */}
            <div className="space-y-4">
              <Label>Local do Atendimento *</Label>
              <RadioGroup
                onValueChange={(value) => form.setValue("serviceLocation", value as "loja" | "domicilio")}
                className="grid md:grid-cols-2 gap-4"
              >
                <div className="flex items-center space-x-2 p-4 border-2 border-border rounded-xl hover:border-primary transition-all cursor-pointer">
                  <RadioGroupItem value="loja" id="loja" />
                  <div className="flex-1">
                    <Label htmlFor="loja" className="cursor-pointer">
                      <div className="font-semibold text-foreground">Na Loja</div>
                      <div className="text-sm text-muted-foreground">Compareça à nossa loja</div>
                    </Label>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 p-4 border-2 border-border rounded-xl hover:border-primary transition-all cursor-pointer">
                  <RadioGroupItem value="domicilio" id="domicilio" />
                  <div className="flex-1">
                    <Label htmlFor="domicilio" className="cursor-pointer">
                      <div className="font-semibold text-foreground">A Domicílio</div>
                      <div className="text-sm text-muted-foreground">Atendimento no seu endereço</div>
                    </Label>
                  </div>
                </div>
              </RadioGroup>
              {form.formState.errors.serviceLocation && (
                <p className="text-sm text-red-600">{form.formState.errors.serviceLocation.message}</p>
              )}
            </div>

            {/* Endereço - só aparece se for domicílio */}
            {form.watch("serviceLocation") === "domicilio" && (
              <div className="space-y-2">
                <Label htmlFor="address">Endereço Completo *</Label>
                <Input
                  id="address"
                  {...form.register("address")}
                  placeholder="Rua, número, bairro, cidade, CEP"
                  className="focus:ring-2 focus:ring-primary"
                />
                {form.formState.errors.address && (
                  <p className="text-sm text-red-600">{form.formState.errors.address.message}</p>
                )}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary-dark text-white py-4 text-lg font-semibold shadow-lg transform hover:scale-105 transition-all"
              disabled={bookingMutation.isPending}
            >
              <Calendar className="mr-2 h-5 w-5" />
              {bookingMutation.isPending ? "Processando..." : "Confirmar Agendamento"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="text-center">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <DialogTitle className="text-2xl font-bold text-gray-900">
              Agendamento Confirmado!
            </DialogTitle>
          </DialogHeader>
          <p className="text-gray-600 mb-6">
            Clique no botão abaixo para receber a confirmação via WhatsApp com todos os detalhes do seu agendamento.
          </p>
          <div className="space-y-3">
            {whatsappLink && (
              <Button
                onClick={() => window.open(whatsappLink, '_blank')}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 font-semibold"
              >
                📱 Confirmar via WhatsApp
              </Button>
            )}
            <Button 
              onClick={() => setShowSuccessModal(false)} 
              variant="outline"
              className="w-full"
            >
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
