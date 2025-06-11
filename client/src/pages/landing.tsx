import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Shield,
  Crown,
  Check,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
} from "lucide-react";
import BookingForm from "@/components/booking-form";
import WhatsAppButton from "@/components/whatsapp-button";

export default function Landing() {
  const [showBooking, setShowBooking] = useState(false);

  const scrollToBooking = () => {
    const bookingSection = document.getElementById("agendamento");
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: "smooth" });
      setShowBooking(true);
    }
  };

  return (
    <div className="min-h-screen bg-background nano-pattern">
      {/* Header */}
      <header className="bg-card/90 backdrop-blur-md shadow-lg border-b border-primary/20 sticky top-0 z-40 fade-in">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img
                src="/logo.png"
                alt="Logo"
                className="h-16 w-auto object-contain"
              />
            </div>

            {/* Logo Central */}
            <div className="hidden md:flex items-center justify-center flex-1 mx-8">
              <img
                src="/logo.png"
                alt="Logo"
                className="h-24 w-auto object-contain"
              />
            </div>

            <nav className="hidden md:flex space-x-8">
              <a
                href="#home"
                className="text-gray-light hover:text-cyan transition-colors duration-300 font-medium"
              >
                Início
              </a>
              <a
                href="#servicos"
                className="text-gray-light hover:text-cyan transition-colors duration-300 font-medium"
              >
                Serviços
              </a>
              <a
                href="#agendamento"
                className="text-gray-light hover:text-cyan transition-colors duration-300 font-medium"
              >
                Agendar
              </a>
              <a
                href="#contato"
                className="text-gray-light hover:text-cyan transition-colors duration-300 font-medium"
              >
                Contato
              </a>
            </nav>

            <div className="flex items-center space-x-4">
              {/* Logo Mobile */}
              <div className="md:hidden">
                <img
                  src="/logo.png"
                  alt="Logo"
                  className="h-14 w-auto object-contain"
                />
              </div>

              {/* Mobile Menu Button */}
              <button className="md:hidden p-2 text-gray-light hover:text-cyan transition-colors">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        id="home"
        className="relative bg-gradient-to-br from-dark-blue via-primary/20 to-primary-dark text-white py-24 hexagon-pattern overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-dark-blue/90 to-transparent"></div>
        <div className="relative container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center slide-up">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-6 md:mb-8 leading-tight tracking-tight">
              Proteja seu celular com{" "}
              <span className="text-cyan glow">
                tecnologia de blindagem líquida
              </span>
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl mb-8 md:mb-12 text-gray-light leading-relaxed max-w-3xl mx-auto px-4">
              Blindagem líquida com carbono e titânio que aumenta a resistência
              da tela em 15x contra riscos e impactos
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center px-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-cyan to-primary hover:from-primary hover:to-cyan text-dark-blue px-8 sm:px-10 py-4 sm:py-5 text-lg sm:text-xl font-bold shadow-2xl transform hover:scale-105 transition-all duration-300 glow float w-full sm:w-auto"
                onClick={scrollToBooking}
              >
                <Calendar className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6" />
                Agendar Agora
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-cyan text-cyan hover:bg-cyan hover:text-dark-blue px-8 sm:px-10 py-4 sm:py-5 text-lg sm:text-xl font-bold transition-all duration-300 w-full sm:w-auto"
                onClick={() =>
                  window.open("https://wa.me/5598991819204", "_blank")
                }
              >
                <Phone className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6" />
                WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section
        id="servicos"
        className="py-16 md:py-24 bg-card/50 backdrop-blur-sm"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-20 fade-in">
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-white-pure mb-4 md:mb-6 tracking-tight">
              Nossos Serviços de Blindagem
            </h3>
            <p className="text-lg sm:text-xl text-gray-light max-w-3xl mx-auto leading-relaxed px-4">
              Tecnologia de ponta em nanotecnologia para proteger seu
              investimento
            </p>
          </div>

          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10 max-w-7xl mx-auto px-4">
            {/* Blindagem Básica */}
            <Card className="bg-card/80 backdrop-blur-md hover:shadow-2xl hover:shadow-cyan/20 transition-all duration-500 border-2 border-primary/30 hover:border-cyan slide-up transform hover:scale-105">
              <CardContent className="p-6 md:p-8 lg:p-10">
                <div className="w-20 h-20 bg-gradient-to-br from-primary/30 to-cyan/30 rounded-2xl flex items-center justify-center mb-8 glow">
                  <Shield className="text-cyan w-10 h-10" />
                </div>
                <h4 className="text-2xl md:text-3xl font-bold text-white-pure mb-4 md:mb-6">
                  Blindagem Básica
                </h4>
                <ul className="space-y-3 md:space-y-4 text-gray-light mb-6 md:mb-8">
                  <li className="flex items-center text-base md:text-lg">
                    <Check className="text-cyan mr-3 md:mr-4 w-5 h-5 md:w-6 md:h-6 flex-shrink-0" />
                    Proteção contra riscos e impactos
                  </li>
                  <li className="flex items-center text-base md:text-lg">
                    <Check className="text-cyan mr-3 md:mr-4 w-5 h-5 md:w-6 md:h-6 flex-shrink-0" />
                    Aplicação invisível
                  </li>
                  <li className="flex items-center text-base md:text-lg">
                    <Check className="text-cyan mr-3 md:mr-4 w-5 h-5 md:w-6 md:h-6 flex-shrink-0" />
                    Durabilidade de 12 meses
                  </li>
                  <li className="flex items-center text-base md:text-lg">
                    <Check className="text-cyan mr-3 md:mr-4 w-5 h-5 md:w-6 md:h-6 flex-shrink-0" />
                    Aplicação apenas no vidro frontal
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Blindagem Premium */}
            <Card className="bg-gradient-to-br from-cyan/20 to-primary/20 backdrop-blur-md hover:shadow-2xl hover:shadow-cyan/30 transition-all duration-500 relative border-2 border-cyan glow slide-up transform hover:scale-105">
              <div className="absolute top-4 md:top-6 right-4 md:right-6 bg-gradient-to-r from-cyan to-primary text-dark-blue px-3 md:px-4 py-1 md:py-2 rounded-full text-xs md:text-sm font-bold">
                Recomendado
              </div>
              <CardContent className="p-6 md:p-8 lg:p-10">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-cyan/30 to-primary/30 rounded-2xl flex items-center justify-center mb-6 md:mb-8 glow">
                  <Crown className="text-cyan w-8 h-8 md:w-10 md:h-10" />
                </div>
                <h4 className="text-2xl md:text-3xl font-bold text-white-pure mb-4 md:mb-6">
                  Blindagem Premium
                </h4>
                <ul className="space-y-3 md:space-y-4 text-gray-light mb-6 md:mb-8">
                  <li className="flex items-center text-base md:text-lg">
                    <Check className="text-cyan mr-3 md:mr-4 w-5 h-5 md:w-6 md:h-6 flex-shrink-0" />
                    Proteção contra riscos e impactos
                  </li>
                  <li className="flex items-center text-base md:text-lg">
                    <Check className="text-cyan mr-3 md:mr-4 w-5 h-5 md:w-6 md:h-6 flex-shrink-0" />
                    Aplicação invisível
                  </li>
                  <li className="flex items-center text-base md:text-lg">
                    <Check className="text-cyan mr-3 md:mr-4 w-5 h-5 md:w-6 md:h-6 flex-shrink-0" />
                    Durabilidade de 12 meses
                  </li>
                  <li className="flex items-center text-base md:text-lg">
                    <Check className="text-cyan mr-3 md:mr-4 w-5 h-5 md:w-6 md:h-6 flex-shrink-0" />
                    Aplicação vidro frontal, traseiro e câmeras
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Novo Card - Vantagens Técnicas */}
            <Card className="bg-card/80 backdrop-blur-md hover:shadow-2xl hover:shadow-cyan/20 transition-all duration-500 border-2 border-primary/30 hover:border-cyan slide-up transform hover:scale-105">
              <CardContent className="p-6 md:p-8 lg:p-10">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-primary/30 to-cyan/30 rounded-2xl flex items-center justify-center mb-6 md:mb-8 glow">
                  <Check className="text-cyan w-8 h-8 md:w-10 md:h-10" />
                </div>
                <h4 className="text-2xl md:text-3xl font-bold text-white-pure mb-4 md:mb-6">
                  Vantagens Técnicas
                </h4>
                <ul className="space-y-3 md:space-y-4 text-gray-light mb-6 md:mb-8">
                  <li className="flex items-center text-base md:text-lg">
                    <Check className="text-cyan mr-3 md:mr-4 w-5 h-5 md:w-6 md:h-6 flex-shrink-0" />
                    Não altera a originalidade do aparelho
                  </li>
                  <li className="flex items-center text-base md:text-lg">
                    <Check className="text-cyan mr-3 md:mr-4 w-5 h-5 md:w-6 md:h-6 flex-shrink-0" />
                    Não altera a qualidade das câmeras
                  </li>
                  <li className="flex items-center text-base md:text-lg">
                    <Check className="text-cyan mr-3 md:mr-4 w-5 h-5 md:w-6 md:h-6 flex-shrink-0" />
                    Não perde a garantia do fabricante
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Information Section */}
      <section
        id="contato"
        className="py-16 md:py-24 bg-gradient-to-b from-background to-card"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-20 fade-in">
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-white-pure mb-4 md:mb-6 tracking-tight">
              Nossa Localização
            </h3>
            <p className="text-lg sm:text-xl text-gray-light leading-relaxed px-4">
              Venha nos visitar ou entre em contato conosco
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12 max-w-6xl mx-auto px-4">
            {/* Contact Information */}
            <div className="space-y-6 md:space-y-8 slide-up">
              <div className="bg-card/80 backdrop-blur-md p-6 md:p-8 rounded-2xl border-2 border-primary/30 shadow-lg hover:shadow-cyan/20 transition-all duration-300">
                <h4 className="text-xl md:text-2xl font-bold text-white-pure mb-4 md:mb-6 flex items-center">
                  <MapPin className="mr-3 md:mr-4 text-cyan w-5 h-5 md:w-6 md:h-6 flex-shrink-0" />
                  Endereço
                </h4>
                <p className="text-gray-light text-lg md:text-xl leading-relaxed">
                  R. Ten. Calixto, 100 Ouro Minas Center
                  <br />
                  Turu, São Luís - MA
                  <br />
                  CEP: 65066-410
                </p>
              </div>

              <div className="bg-card/80 backdrop-blur-md p-6 md:p-8 rounded-2xl border-2 border-primary/30 shadow-lg hover:shadow-cyan/20 transition-all duration-300">
                <h4 className="text-xl md:text-2xl font-bold text-white-pure mb-4 md:mb-6 flex items-center">
                  <Phone className="mr-3 md:mr-4 text-cyan w-5 h-5 md:w-6 md:h-6 flex-shrink-0" />
                  Telefone & WhatsApp
                </h4>
                <p className="text-gray-light text-lg md:text-xl">
                  (98) 99181-9204
                </p>
              </div>

              <div className="bg-card/80 backdrop-blur-md p-6 md:p-8 rounded-2xl border-2 border-primary/30 shadow-lg hover:shadow-cyan/20 transition-all duration-300">
                <h4 className="text-xl md:text-2xl font-bold text-white-pure mb-4 md:mb-6 flex items-center">
                  <Clock className="mr-3 md:mr-4 text-cyan w-5 h-5 md:w-6 md:h-6 flex-shrink-0" />
                  Horário de Funcionamento
                </h4>
                <div className="text-gray-light space-y-2 md:space-y-3 text-base md:text-lg">
                  <p>
                    <strong className="text-white-pure">
                      Segunda a Sexta:
                    </strong>{" "}
                    9h às 18h
                  </p>
                  <p>
                    <strong className="text-white-pure">Sábado:</strong> 9h às
                    13h
                  </p>
                  <p>
                    <strong className="text-white-pure">Domingo:</strong>{" "}
                    Fechado
                  </p>
                </div>
              </div>
            </div>

            {/* Google Maps Embed */}
            <div className="h-96 md:h-full min-h-[400px] slide-up">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3986.3890324716!2d-44.2618778!3d-2.5297855!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7f69a7a7a7a7a7a7%3A0x7a7a7a7a7a7a7a7a!2sR.%20Ten.%20Calixto%2C%20100%20-%20Turu%2C%20S%C3%A3o%20Lu%C3%ADs%20-%20MA%2C%2065066-410!5e0!3m2!1spt-BR!2sbr!4v1234567890123!5m2!1spt-BR!2sbr"
                width="100%"
                height="100%"
                style={{ border: 0, borderRadius: "16px" }}
                className="shadow-2xl shadow-cyan/20 border-2 border-cyan/30"
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
      <section
        id="agendamento"
        className="py-16 md:py-24 bg-gradient-to-b from-card to-background nano-pattern"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12 md:mb-16 fade-in">
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-white-pure mb-4 md:mb-6 tracking-tight">
                Agende Seu Atendimento
              </h3>
              <p className="text-lg sm:text-xl text-gray-light leading-relaxed px-4">
                Preencha o formulário e receba confirmação via WhatsApp
              </p>
            </div>

            <div className="slide-up">
              <BookingForm />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-t from-dark-blue to-card text-white-pure py-12 md:py-20 border-t border-cyan/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 md:gap-10">
            <div className="fade-in">
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan to-primary rounded-xl flex items-center justify-center glow">
                  <Phone className="text-white w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-white-pure">
                    Global Tech
                  </h4>
                  <p className="text-cyan font-medium">Blindagem Líquida</p>
                </div>
              </div>
              <p className="text-gray-light text-lg leading-relaxed">
                Protegendo seus dispositivos com a mais avançada tecnologia de
                carbono e titânio.
              </p>
            </div>

            <div className="fade-in">
              <h5 className="font-bold mb-6 text-white-pure text-xl">
                Serviços
              </h5>
              <ul className="space-y-3 text-gray-light text-lg">
                <li className="hover:text-cyan transition-colors">
                  Blindagem Básica
                </li>
                <li className="hover:text-cyan transition-colors">
                  Blindagem Premium
                </li>
                <li className="hover:text-cyan transition-colors">
                  Durabilidade 12 meses
                </li>
                <li className="hover:text-cyan transition-colors">
                  Aplicação invisível
                </li>
              </ul>
            </div>

            <div className="fade-in">
              <h5 className="font-bold mb-6 text-white-pure text-xl">
                Contato
              </h5>
              <ul className="space-y-4 text-gray-light text-lg">
                <li className="flex items-center hover:text-cyan transition-colors">
                  <Phone className="mr-3 w-5 h-5 text-cyan" /> (98) 99181-9204
                </li>
                <li className="flex items-center hover:text-cyan transition-colors">
                  <Mail className="mr-3 w-5 h-5 text-cyan" />
                  globaltechdivineia@gmail.com
                </li>
                <li className="flex items-center hover:text-cyan transition-colors">
                  <MapPin className="mr-3 w-5 h-5 text-cyan" /> Turu, São Luís -
                  MA
                </li>
              </ul>
            </div>

            <div className="fade-in">
              <h5 className="font-bold mb-6 text-white-pure text-xl">
                Horário de Funcionamento
              </h5>
              <ul className="space-y-3 text-gray-light text-lg">
                <li className="flex items-center">
                  <Clock className="mr-3 w-5 h-5 text-cyan" />
                  <span>
                    <strong className="text-white-pure">
                      Segunda - Sexta:
                    </strong>{" "}
                    9h às 18h
                  </span>
                </li>
                <li>
                  <strong className="text-white-pure">Sábado:</strong> 9h às 13h
                </li>
                <li>
                  <strong className="text-white-pure">Domingo:</strong> Fechado
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-cyan/30 mt-16 pt-8 text-center text-gray-light">
            <p className="text-lg">
              &copy; 2024 Global Tech. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>

      <WhatsAppButton />
    </div>
  );
}
