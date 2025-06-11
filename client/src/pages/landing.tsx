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
    <div className="min-h-screen bg-background nano-pattern">
      {/* Header */}
      <header className="bg-card/90 backdrop-blur-md shadow-lg border-b border-primary/20 sticky top-0 z-40 fade-in">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center glow">
                <Phone className="text-white w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white-pure tracking-tight">Global Tech</h1>
                <p className="text-sm text-cyan font-medium">Blindagem Líquida</p>
              </div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#home" className="text-gray-light hover:text-cyan transition-colors duration-300 font-medium">Início</a>
              <a href="#servicos" className="text-gray-light hover:text-cyan transition-colors duration-300 font-medium">Serviços</a>
              <a href="#agendamento" className="text-gray-light hover:text-cyan transition-colors duration-300 font-medium">Agendar</a>
              <a href="#contato" className="text-gray-light hover:text-cyan transition-colors duration-300 font-medium">Contato</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative bg-gradient-to-br from-dark-blue via-primary/20 to-primary-dark text-white py-24 hexagon-pattern overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-dark-blue/90 to-transparent"></div>
        <div className="relative container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center slide-up">
            <h2 className="text-5xl md:text-7xl font-black mb-8 leading-tight tracking-tight">
              Proteja seu celular com{" "}
              <span className="text-cyan glow">tecnologia de blindagem líquida</span>
            </h2>
            <p className="text-xl md:text-2xl mb-12 text-gray-light leading-relaxed max-w-3xl mx-auto">
              Nanotecnologia avançada que oferece proteção invisível, resistência superior e alta durabilidade para sua tela
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-cyan to-primary hover:from-primary hover:to-cyan text-dark-blue px-10 py-5 text-xl font-bold shadow-2xl transform hover:scale-105 transition-all duration-300 glow float"
                onClick={scrollToBooking}
              >
                <Calendar className="mr-3 h-6 w-6" />
                Agendar Agora
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-cyan text-cyan hover:bg-cyan hover:text-dark-blue px-10 py-5 text-xl font-bold transition-all duration-300"
              >
                Ver Como Funciona
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicos" className="py-24 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20 fade-in">
            <h3 className="text-4xl md:text-5xl font-black text-white-pure mb-6 tracking-tight">
              Nossos Serviços de Blindagem
            </h3>
            <p className="text-xl text-gray-light max-w-3xl mx-auto leading-relaxed">
              Tecnologia de ponta em nanotecnologia para proteger seu investimento
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto">
            {/* Blindagem Básica */}
            <Card className="bg-card/80 backdrop-blur-md hover:shadow-2xl hover:shadow-cyan/20 transition-all duration-500 border-2 border-primary/30 hover:border-cyan slide-up transform hover:scale-105">
              <CardContent className="p-10">
                <div className="w-20 h-20 bg-gradient-to-br from-primary/30 to-cyan/30 rounded-2xl flex items-center justify-center mb-8 glow">
                  <Shield className="text-cyan w-10 h-10" />
                </div>
                <h4 className="text-3xl font-bold text-white-pure mb-6">Blindagem Básica</h4>
                <ul className="space-y-4 text-gray-light mb-8">
                  <li className="flex items-center text-lg">
                    <Check className="text-cyan mr-4 w-6 h-6" />
                    Proteção contra riscos e arranhões
                  </li>
                  <li className="flex items-center text-lg">
                    <Check className="text-cyan mr-4 w-6 h-6" />
                    Aplicação invisível
                  </li>
                  <li className="flex items-center text-lg">
                    <Check className="text-cyan mr-4 w-6 h-6" />
                    Durabilidade de 12 meses
                  </li>
                  <li className="flex items-center text-lg">
                    <Check className="text-cyan mr-4 w-6 h-6" />
                    Garantia contra defeitos
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Blindagem Premium */}
            <Card className="bg-gradient-to-br from-cyan/20 to-primary/20 backdrop-blur-md hover:shadow-2xl hover:shadow-cyan/30 transition-all duration-500 relative border-2 border-cyan glow slide-up transform hover:scale-105">
              <div className="absolute top-6 right-6 bg-gradient-to-r from-cyan to-primary text-dark-blue px-4 py-2 rounded-full text-sm font-bold">
                Recomendado
              </div>
              <CardContent className="p-10">
                <div className="w-20 h-20 bg-gradient-to-br from-cyan/30 to-primary/30 rounded-2xl flex items-center justify-center mb-8 glow">
                  <Crown className="text-cyan w-10 h-10" />
                </div>
                <h4 className="text-3xl font-bold text-white-pure mb-6">Blindagem Premium</h4>
                <ul className="space-y-4 text-gray-light mb-8">
                  <li className="flex items-center text-lg">
                    <Check className="text-cyan mr-4 w-6 h-6" />
                    Proteção contra impactos e quedas
                  </li>
                  <li className="flex items-center text-lg">
                    <Check className="text-cyan mr-4 w-6 h-6" />
                    Resistência a líquidos
                  </li>
                  <li className="flex items-center text-lg">
                    <Check className="text-cyan mr-4 w-6 h-6" />
                    Durabilidade de 24 meses
                  </li>
                  <li className="flex items-center text-lg">
                    <Check className="text-cyan mr-4 w-6 h-6" />
                    Garantia total de substituição
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Information Section */}
      <section id="contato" className="py-24 bg-gradient-to-b from-background to-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20 fade-in">
            <h3 className="text-4xl md:text-5xl font-black text-white-pure mb-6 tracking-tight">
              Nossa Localização
            </h3>
            <p className="text-xl text-gray-light leading-relaxed">
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
