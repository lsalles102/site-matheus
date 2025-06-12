// Configurações de SEO baseadas na região da loja
export interface StoreRegionConfig {
  region: string;
  city: string;
  state: string;
  businessName: string;
  phone?: string;
  address?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

// Configuração padrão - pode ser alterada baseada na região detectada ou configuração do usuário
export const defaultStoreConfig: StoreRegionConfig = {
  region: "SP",
  city: "São Paulo",
  state: "São Paulo",
  businessName: "TechRepair SP",
  phone: "(11) 99999-9999",
  address: "Rua da Tecnologia, 123 - Centro, São Paulo - SP",
  coordinates: {
    latitude: -23.5505,
    longitude: -46.6333
  }
};

// Configurações específicas para diferentes regiões
export const regionConfigs: Record<string, StoreRegionConfig> = {
  "sao-paulo": {
    region: "SP",
    city: "São Paulo",
    state: "São Paulo",
    businessName: "TechRepair São Paulo",
    phone: "(11) 99999-9999",
    address: "Rua da Tecnologia, 123 - Centro, São Paulo - SP",
    coordinates: { latitude: -23.5505, longitude: -46.6333 }
  },
  "rio-de-janeiro": {
    region: "RJ", 
    city: "Rio de Janeiro",
    state: "Rio de Janeiro",
    businessName: "TechRepair Rio",
    phone: "(21) 99999-9999",
    address: "Av. Copacabana, 456 - Copacabana, Rio de Janeiro - RJ",
    coordinates: { latitude: -22.9068, longitude: -43.1729 }
  },
  "belo-horizonte": {
    region: "MG",
    city: "Belo Horizonte", 
    state: "Minas Gerais",
    businessName: "TechRepair BH",
    phone: "(31) 99999-9999",
    address: "Rua dos Reparos, 789 - Centro, Belo Horizonte - MG",
    coordinates: { latitude: -19.9191, longitude: -43.9386 }
  },
  "salvador": {
    region: "BA",
    city: "Salvador",
    state: "Bahia", 
    businessName: "TechRepair Salvador",
    phone: "(71) 99999-9999",
    address: "Av. Sete de Setembro, 321 - Pelourinho, Salvador - BA",
    coordinates: { latitude: -12.9714, longitude: -38.5014 }
  }
};

export function getStoreConfig(regionKey?: string): StoreRegionConfig {
  if (regionKey && regionConfigs[regionKey]) {
    return regionConfigs[regionKey];
  }
  return defaultStoreConfig;
}

export function generateSEOContent(config: StoreRegionConfig) {
  const services = "assistência técnica, reparo de celular, conserto de smartphone, manutenção de dispositivos móveis";
  
  return {
    home: {
      title: `${config.businessName} - Assistência Técnica de Celulares em ${config.city}`,
      description: `Assistência técnica especializada em celulares e smartphones em ${config.city}, ${config.state}. Reparo rápido e confiável com garantia. Atendimento em loja e domicílio.`,
      keywords: `assistência técnica ${config.city}, reparo celular ${config.city}, conserto smartphone ${config.region}, ${config.businessName}, manutenção celular ${config.state}`
    },
    booking: {
      title: `Agendar Reparo - ${config.businessName} | ${config.city}`,
      description: `Agende seu reparo de celular online em ${config.city}. Atendimento rápido e profissional. Escolha entre atendimento na loja ou domicílio em ${config.city} e região.`,
      keywords: `agendar reparo ${config.city}, agendamento assistência técnica ${config.region}, ${services} ${config.city}`
    },
    admin: {
      title: `Painel Administrativo - ${config.businessName}`,
      description: `Painel de controle para gerenciamento de agendamentos e serviços da ${config.businessName} em ${config.city}.`,
      keywords: `admin ${config.businessName}, painel controle, gerenciamento agendamentos`
    }
  };
}