/**
 * Configuration de l'Assistant de Réservation Vacances Bleues
 *
 * Ce fichier permet de personnaliser facilement votre assistant sans modifier
 * le code principal. Dupliquez ce fichier en 'config.ts' et adaptez-le à vos besoins.
 */

export const CONFIG = {
  // Informations sur l'hôtel
  hotel: {
    nom: "Vacances Bleues",
    description: "Chaîne d'hôtels premium en bord de mer",
  },

  // Types de chambres disponibles
  chambres: [
    {
      id: "standard",
      nom: "Chambre Standard",
      capacite: 2,
      prix_base: 89,
      description: "Chambre confortable avec toutes les commodités essentielles",
      equipements: ["Wi-Fi gratuit", "Climatisation", "TV écran plat", "Salle de bain privée"]
    },
    {
      id: "familiale",
      nom: "Chambre Familiale",
      capacite: 4,
      prix_base: 139,
      description: "Spacieuse chambre idéale pour les familles",
      equipements: ["Wi-Fi gratuit", "Climatisation", "TV écran plat", "Coin salon", "Kitchenette"]
    },
    {
      id: "suite_vue_mer",
      nom: "Suite Vue Mer",
      capacite: 2,
      prix_base: 179,
      description: "Suite luxueuse avec vue panoramique sur la mer",
      equipements: ["Wi-Fi gratuit", "Climatisation", "TV écran plat", "Balcon privé", "Minibar", "Baignoire jacuzzi"]
    }
  ],

  // Paramètres de l'assistant vocal
  assistant: {
    // Voix disponibles : alloy, echo, fable, onyx, nova, shimmer
    voix: "alloy",

    // Langue principale
    langue: "français",

    // Message d'accueil personnalisé
    message_accueil: "Bonjour et bienvenue chez Vacances Bleues ! Je suis votre assistant de réservation. Comment puis-je vous aider aujourd'hui ?",

    // Ton de l'assistant (sera inclus dans les instructions)
    personnalite: "chaleureux, professionnel et efficace",
  },

  // Options de réservation
  reservation: {
    // Durée minimale de séjour (en nuits)
    duree_min: 1,

    // Durée maximale de séjour (en nuits)
    duree_max: 30,

    // Délai minimum de réservation (en jours)
    // Par exemple : 1 = peut réserver pour demain, 0 = peut réserver pour aujourd'hui
    delai_reservation_min: 0,

    // Activer la vérification de disponibilité en temps réel
    verification_disponibilite: false, // Pour l'instant en mode démo

    // Demander une carte de crédit pour garantir la réservation
    demander_carte_credit: false,
  },

  // Services additionnels proposables
  services: [
    { id: "petit_dejeuner", nom: "Petit-déjeuner", prix: 15 },
    { id: "parking", nom: "Parking sécurisé", prix: 10 },
    { id: "animaux", nom: "Animaux acceptés", prix: 20 },
    { id: "lit_bebe", nom: "Lit bébé", prix: 0 },
    { id: "transfert_aeroport", nom: "Transfert aéroport", prix: 45 },
  ],

  // Notifications
  notifications: {
    // Envoyer un email de confirmation
    email_confirmation: true,

    // Email de destination pour les notifications internes
    email_admin: "reservations@vacancesbleues.fr",

    // Envoyer un SMS de confirmation
    sms_confirmation: false,
  },

  // Intégrations externes (pour développement futur)
  integrations: {
    // PMS (Property Management System)
    pms: {
      actif: false,
      type: "mews", // mews, opera, protel, etc.
      api_url: "",
      api_key: "",
    },

    // Système de paiement
    paiement: {
      actif: false,
      provider: "stripe", // stripe, paypal, etc.
      api_key: "",
    },
  }
};

/**
 * Fonction utilitaire pour générer la description des chambres
 * pour les instructions de l'assistant
 */
export function genererDescriptionChambres(): string {
  return CONFIG.chambres
    .map(c => `- ${c.nom} (${c.capacite} personnes) - À partir de ${c.prix_base}€/nuit`)
    .join('\n    ');
}

/**
 * Fonction utilitaire pour générer les enum des types de chambres
 * pour les fonctions OpenAI
 */
export function getTypesChambres(): string[] {
  return CONFIG.chambres.map(c => c.id);
}

/**
 * Fonction pour obtenir les informations d'une chambre par ID
 */
export function getChambreParId(id: string) {
  return CONFIG.chambres.find(c => c.id === id);
}

/**
 * Fonction pour calculer le prix total d'un séjour
 */
export function calculerPrixSejour(
  type_chambre: string,
  date_arrivee: string,
  date_depart: string,
  services_additionnels: string[] = []
): number {
  const chambre = getChambreParId(type_chambre);
  if (!chambre) return 0;

  // Calculer le nombre de nuits
  const arrivee = new Date(date_arrivee);
  const depart = new Date(date_depart);
  const nuits = Math.ceil((depart.getTime() - arrivee.getTime()) / (1000 * 60 * 60 * 24));

  // Prix de base
  let total = chambre.prix_base * nuits;

  // Ajouter les services additionnels
  services_additionnels.forEach(service_id => {
    const service = CONFIG.services.find(s => s.id === service_id);
    if (service) {
      total += service.prix * nuits;
    }
  });

  return total;
}
