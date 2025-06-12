import { useEffect } from "react";

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  region?: string;
  city?: string;
  businessName?: string;
  service?: string;
}

export default function SEOHead({
  title,
  description,
  keywords,
  region,
  city,
  businessName = "TechRepair",
  service = "assistência técnica de celulares"
}: SEOHeadProps) {
  
  useEffect(() => {
    // Definir título da página
    if (title) {
      document.title = title;
    }

    // Remover meta tags existentes
    const existingMetas = document.querySelectorAll('meta[data-seo="true"]');
    existingMetas.forEach(meta => meta.remove());

    // Adicionar novas meta tags
    const metaTags = [
      { name: "description", content: description },
      { name: "keywords", content: keywords },
      { name: "author", content: businessName },
      { name: "robots", content: "index, follow" },
      
      // Open Graph
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: businessName },
      
      // Local SEO
      { name: "geo.region", content: region },
      { name: "geo.placename", content: city },
      { name: "geo.position", content: "" }, // Pode ser adicionado coordenadas depois
      { name: "ICBM", content: "" }, // Pode ser adicionado coordenadas depois
      
      // Twitter Cards
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ];

    metaTags.forEach(({ name, property, content }) => {
      if (content) {
        const meta = document.createElement("meta");
        meta.setAttribute("data-seo", "true");
        if (name) meta.setAttribute("name", name);
        if (property) meta.setAttribute("property", property);
        meta.setAttribute("content", content);
        document.head.appendChild(meta);
      }
    });

    // Adicionar dados estruturados JSON-LD para SEO local
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": businessName,
      "description": description,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": city,
        "addressRegion": region,
        "addressCountry": "BR"
      },
      "telephone": "",
      "url": window.location.origin,
      "openingHours": "Mo,Tu,We,Th,Fr 09:00-18:00",
      "serviceArea": {
        "@type": "GeoCircle",
        "geoMidpoint": {
          "@type": "GeoCoordinates",
          "latitude": "",
          "longitude": ""
        },
        "geoRadius": "50000"
      },
      "areaServed": [region, city],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": `Serviços de ${service}`,
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Manutenção Básica",
              "description": "Serviços básicos de reparo para dispositivos móveis"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Manutenção Premium",
              "description": "Serviços completos e avançados de reparo para dispositivos móveis"
            }
          }
        ]
      }
    };

    // Remover script JSON-LD existente
    const existingScript = document.querySelector('script[data-seo="structured-data"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Adicionar novo script JSON-LD
    const script = document.createElement("script");
    script.setAttribute("data-seo", "structured-data");
    script.setAttribute("type", "application/ld+json");
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);

  }, [title, description, keywords, region, city, businessName, service]);

  return null;
}