interface WhatsAppMessage {
  phone: string;
  message: string;
}

export class WhatsAppService {
  /**
   * Gera um link do WhatsApp para enviar mensagem diretamente
   */
  static generateWhatsAppLink(phone: string, message: string): string {
    // Remove caracteres especiais do telefone, mantendo apenas números
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Adiciona código do país se não tiver (assume Brasil +55)
    const phoneWithCountry = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
    
    // Codifica a mensagem para URL
    const encodedMessage = encodeURIComponent(message);
    
    return `https://wa.me/${phoneWithCountry}?text=${encodedMessage}`;
  }

  /**
   * Formata mensagem de confirmação de agendamento
   */
  static formatConfirmationMessage(appointment: {
    customerName: string;
    service: string;
    date: string;
    time: string;
    brand?: string;
  }): string {
    const { customerName, service, date, time, brand } = appointment;
    
    const brandText = brand ? ` para ${brand}` : '';
    
    return `🔧 *CONFIRMAÇÃO DE AGENDAMENTO* 🔧

Olá ${customerName}! 

Seu agendamento foi confirmado com sucesso:

📅 *Data:* ${new Date(date).toLocaleDateString('pt-BR')}
⏰ *Horário:* ${time}
🛠️ *Serviço:* ${service}${brandText}

Em caso de dúvidas ou necessidade de reagendamento, entre em contato conosco.

Obrigado pela preferência! 🚗💙`;
  }

  /**
   * Gera link completo do WhatsApp com mensagem de confirmação
   */
  static generateConfirmationLink(phone: string, appointment: {
    customerName: string;
    service: string;
    date: string;
    time: string;
    brand?: string;
  }): string {
    const message = this.formatConfirmationMessage(appointment);
    return this.generateWhatsAppLink(phone, message);
  }

  /**
   * Simula envio automático abrindo o WhatsApp Web (apenas para demonstração)
   */
  static async sendConfirmationMessage(appointment: {
    customerPhone: string;
    customerName: string;
    service: string;
    date: string;
    time: string;
    brand?: string;
  }): Promise<{ success: boolean; whatsappLink: string }> {
    try {
      const whatsappLink = this.generateConfirmationLink(appointment.customerPhone, {
        customerName: appointment.customerName,
        service: appointment.service,
        date: appointment.date,
        time: appointment.time,
        brand: appointment.brand,
      });

      // Em uma implementação real, aqui você poderia integrar com APIs como:
      // - WhatsApp Business API (pago)
      // - Baileys (biblioteca Node.js gratuita)
      // - Outras soluções de automação

      console.log(`WhatsApp confirmation link generated for ${appointment.customerName}: ${whatsappLink}`);

      return {
        success: true,
        whatsappLink
      };
    } catch (error) {
      console.error('Erro ao gerar link do WhatsApp:', error);
      return {
        success: false,
        whatsappLink: ''
      };
    }
  }
}