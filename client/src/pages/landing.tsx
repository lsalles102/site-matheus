import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Crown, Check, Phone, Mail, MapPin, Calendar, Clock } from "lucide-react";
import BookingForm from "@/components/booking-form";
import WhatsAppButton from "@/components/whatsapp-button";

export default function Landing() {
  const [showBooking, setShowBooking] = useState(false);

  const scrollToBooking = () => {
    const bookingSection = document.getElementById('agendamento');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' });
      setShowBooking(true);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-lg border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Phone className="text-white w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Global Tech</h1>
                <p className="text-sm text-muted-foreground">Blindagem Líquida</p>
              </div>
            </div>
            <nav className="hidden md:flex space-x-6">
              <a href="#home" className="text-muted-foreground hover:text-primary transition-colors">Início</a>
              <a href="#servicos" className="text-muted-foreground hover:text-primary transition-colors">Serviços</a>
              <a href="#agendamento" className="text-muted-foreground hover:text-primary transition-colors">Agendar</a>
              <a href="#contato" className="text-muted-foreground hover:text-primary transition-colors">Contato</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="bg-gradient-to-br from-primary to-primary-dark text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Proteja seu celular com{" "}
              <span className="text-warning">tecnologia de blindagem líquida</span>
            </h2>
            <p className="text-xl md:text-2xl mb-8 text-muted-foreground opacity-90">
              Nanotecnologia avançada que oferece proteção invisível, resistência superior e alta durabilidade para sua tela
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-success hover:bg-green-600 text-white px-8 py-4 text-lg font-semibold shadow-lg transform hover:scale-105 transition-all"
                onClick={scrollToBooking}
              >
                <Calendar className="mr-2 h-5 w-5" />
                Agendar Agora
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-4 text-lg font-semibold"
              >
                Ver Como Funciona
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicos" className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Nossos Serviços de Blindagem
            </h3>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Tecnologia de ponta em nanotecnologia para proteger seu investimento
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Blindagem Básica */}
            <Card className="bg-secondary hover:shadow-xl transition-all duration-300 border-border">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center mb-6">
                  <Shield className="text-primary w-8 h-8" />
                </div>
                <h4 className="text-2xl font-bold text-foreground mb-4">Blindagem Básica</h4>
                <ul className="space-y-3 text-muted-foreground mb-6">
                  <li className="flex items-center">
                    <Check className="text-success mr-3 w-5 h-5" />
                    Proteção contra riscos e arranhões
                  </li>
                  <li className="flex items-center">
                    <Check className="text-success mr-3 w-5 h-5" />
                    Aplicação invisível
                  </li>
                  <li className="flex items-center">
                    <Check className="text-success mr-3 w-5 h-5" />
                    Durabilidade de 12 meses
                  </li>
                  <li className="flex items-center">
                    <Check className="text-success mr-3 w-5 h-5" />
                    Garantia contra defeitos
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Blindagem Premium */}
            <Card className="bg-gradient-to-br from-primary to-primary-dark text-white hover:shadow-xl transition-all duration-300 relative border-primary">
              <div className="absolute top-4 right-4 bg-warning text-black px-3 py-1 rounded-full text-sm font-semibold">
                Recomendado
              </div>
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mb-6">
                  <Crown className="text-warning w-8 h-8" />
                </div>
                <h4 className="text-2xl font-bold mb-4">Blindagem Premium</h4>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <Check className="text-success mr-3 w-5 h-5" />
                    Proteção contra impactos e quedas
                  </li>
                  <li className="flex items-center">
                    <Check className="text-success mr-3 w-5 h-5" />
                    Resistência a líquidos
                  </li>
                  <li className="flex items-center">
                    <Check className="text-success mr-3 w-5 h-5" />
                    Durabilidade de 24 meses
                  </li>
                  <li className="flex items-center">
                    <Check className="text-success mr-3 w-5 h-5" />
                    Garantia total de substituição
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Information Section */}
      <section id="contato" className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Nossa Localização
            </h3>
            <p className="text-xl text-muted-foreground">
              Venha nos visitar ou entre em contato conosco
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Information */}
            <div className="space-y-8">
              <div className="bg-background p-6 rounded-lg border border-border shadow-sm">
                <h4 className="text-xl font-semibold text-foreground mb-4 flex items-center">
                  <MapPin className="mr-3 text-primary w-5 h-5" />
                  Endereço
                </h4>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  R. Ten. Calixto, 100<br />
                  Turu, São Luís - MA<br />
                  CEP: 65066-410
                </p>
              </div>

              <div className="bg-background p-6 rounded-lg border border-border shadow-sm">
                <h4 className="text-xl font-semibold text-foreground mb-4 flex items-center">
                  <Phone className="mr-3 text-primary w-5 h-5" />
                  Telefone & WhatsApp
                </h4>
                <p className="text-muted-foreground text-lg">
                  (98) 99181-9204
                </p>
              </div>

              <div className="bg-background p-6 rounded-lg border border-border shadow-sm">
                <h4 className="text-xl font-semibold text-foreground mb-4 flex items-center">
                  <Clock className="mr-3 text-primary w-5 h-5" />
                  Horário de Funcionamento
                </h4>
                <div className="text-muted-foreground space-y-2">
                  <p><strong>Segunda a Sexta:</strong> 9h às 18h</p>
                  <p><strong>Sábado:</strong> 9h às 13h</p>
                  <p><strong>Domingo:</strong> Fechado</p>
                </div>
              </div>
            </div>

            {/* Google Maps Embed */}
            <div className="h-96 md:h-full min-h-[400px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3986.3890324716!2d-44.2618778!3d-2.5297855!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7f69a7a7a7a7a7a7%3A0x7a7a7a7a7a7a7a7a!2sR.%20Ten.%20Calixto%2C%20100%20-%20Turu%2C%20S%C3%A3o%20Lu%C3%ADs%20-%20MA%2C%2065066-410!5e0!3m2!1spt-BR!2sbr!4v1234567890123!5m2!1spt-BR!2sbr"
                width="100%"
                height="100%"
                style={{ border: 0, borderRadius: '8px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localização Global Tech - R. Ten. Calixto, 100 - Turu, São Luís - MA"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section id="agendamento" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Agende Seu Atendimento
              </h3>
              <p className="text-xl text-muted-foreground">
                Preencha o formulário e receba confirmação via WhatsApp
              </p>
            </div>

            <BookingForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary text-foreground py-16 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Phone className="text-white w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-foreground">Global Tech</h4>
                  <p className="text-muted-foreground">Blindagem Líquida</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                Protegendo seus dispositivos com a mais avançada tecnologia de nanotecnologia.
              </p>
            </div>

            <div>
              <h5 className="font-semibold mb-4 text-foreground">Serviços</h5>
              <ul className="space-y-2 text-muted-foreground">
                <li>Blindagem Básica</li>
                <li>Blindagem Premium</li>
                <li>Garantia Estendida</li>
                <li>Suporte Técnico</li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-4 text-foreground">Contato</h5>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center">
                  <Phone className="mr-2 w-4 h-4" /> (98) 99181-9204
                </li>
                <li className="flex items-center">
                  <Mail className="mr-2 w-4 h-4" /> contato@globaltech.com
                </li>
                <li className="flex items-center">
                  <MapPin className="mr-2 w-4 h-4" /> Turu, São Luís - MA
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-4 text-foreground">Horário de Funcionamento</h5>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center">
                  <Clock className="mr-2 w-4 h-4" /> Segunda - Sexta: 9h às 18h
                </li>
                <li>Sábado: 9h às 13h</li>
                <li>Domingo: Fechado</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-12 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 Global Tech. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      <WhatsAppButton />
    </div>
  );
}
