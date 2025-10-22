import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import WebSocket from "ws";
import OpenAI from "openai";
import "dotenv/config";
import fs from "fs/promises";
import path from "path";

const PORT = Number(process.env.PORT ?? 8000);
const WEBHOOK_SECRET = process.env.OPENAI_WEBHOOK_SECRET;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!WEBHOOK_SECRET || !OPENAI_API_KEY) {
  console.error("Missing OPENAI_WEBHOOK_SECRET or OPENAI_API_KEY in .env");
  process.exit(1);
}

const app = express();
app.use(bodyParser.raw({ type: "*/*" }));

const client = new OpenAI({ apiKey: OPENAI_API_KEY });

const callAccept = {
    instructions: `Tu es Corine, réceptionniste de la chaîne d’hôtels Vacances Bleues.
Tu aides les clients à réserver leur séjour de manière chaleureuse, naturelle et professionnelle, comme au téléphone dans une vraie agence.
Tu parles toujours en français.

Processus de réservation
	1.	Accueil chaleureux
“Bonjour, Vacances Bleues, Corine à l’appareil, je vous écoute.”
“Bonjour ! Oui, alors je suis Corine, je m’occupe de votre réservation aujourd’hui.”
	2.	Demande des dates
“Très bien… euh, vous souhaitez arriver à quelle date ?”
“Et le départ, ce serait quand exactement ?”
	3.	Nombre de personnes
“D’accord, parfait. Et vous serez combien, du coup ?”
“Des enfants aussi, peut-être ?”
	4.	Proposition de chambres
“Alors, voyons voir… nous avons plusieurs types de chambres disponibles.”
“Il y a la standard, la familiale, ou la suite vue mer. Vous préférez plutôt le confort ou… la vue ?”
	5.	Collecte des coordonnées
“Très bien, je vais avoir besoin de quelques infos pour noter tout ça… votre nom, prénom, un numéro de téléphone, et une adresse mail s’il vous plaît.”
	6.	Demandes spéciales
“Vous avez des demandes particulières, peut-être ? Genre un étage calme, un lit bébé, une chambre avec balcon… ?”
	7.	Récapitulatif
“Alors, je vous récapitule pour être sûre : une chambre [type] pour [nombre de personnes], du [date] au [date], c’est bien ça ?”
	8.	Confirmation
“Parfait, c’est noté. Je valide la réservation tout de suite.”
“Vous allez recevoir un petit mail de confirmation d’ici quelques instants.”
“Et voilà, tout est bon ! Merci à vous et… euh… très bon séjour chez Vacances Bleues !”

Style et ton de Corine
	•	Parle comme une vraie personne : phrases un peu souples, parfois elliptiques.
	•	Ajoute de légers tics de langage naturels :
“euh”, “alors”, “du coup”, “voilà”, “très bien”, “parfait”, “ok super”.
	•	Utilise des micro-pauses (“alors…”, “voyons voir…”) pour respirer.
	•	Reste chaleureuse, un peu souriante, posée.
	•	Sois attentive aux détails du client, reformule quand nécessaire.
	•	Pose une seule question à la fois.`,
    type: "realtime",
    model: "gpt-realtime",
    audio: {
      output: { voice: "alloy" },
    },
    tools: [
      {
        type: "function",
        name: "create_reservation",
        description: "Crée une réservation d'hôtel dans le système Vacances Bleues",
        parameters: {
          type: "object",
          properties: {
            nom: {
              type: "string",
              description: "Nom de famille du client"
            },
            prenom: {
              type: "string",
              description: "Prénom du client"
            },
            email: {
              type: "string",
              description: "Adresse email du client"
            },
            telephone: {
              type: "string",
              description: "Numéro de téléphone du client"
            },
            date_arrivee: {
              type: "string",
              description: "Date d'arrivée au format YYYY-MM-DD"
            },
            date_depart: {
              type: "string",
              description: "Date de départ au format YYYY-MM-DD"
            },
            type_chambre: {
              type: "string",
              enum: ["standard", "familiale", "suite_vue_mer"],
              description: "Type de chambre réservée"
            },
            nombre_personnes: {
              type: "number",
              description: "Nombre de personnes pour la réservation"
            },
            demandes_speciales: {
              type: "string",
              description: "Demandes ou besoins spéciaux du client (optionnel)"
            }
          },
          required: ["nom", "prenom", "email", "telephone", "date_arrivee", "date_depart", "type_chambre", "nombre_personnes"]
        }
      },
      {
        type: "function",
        name: "check_availability",
        description: "Vérifie la disponibilité des chambres pour des dates données",
        parameters: {
          type: "object",
          properties: {
            date_arrivee: {
              type: "string",
              description: "Date d'arrivée au format YYYY-MM-DD"
            },
            date_depart: {
              type: "string",
              description: "Date de départ au format YYYY-MM-DD"
            },
            type_chambre: {
              type: "string",
              enum: ["standard", "familiale", "suite_vue_mer"],
              description: "Type de chambre à vérifier"
            }
          },
          required: ["date_arrivee", "date_depart", "type_chambre"]
        }
      }
    ]
} as const;

const WELCOME_GREETING = "Bonjour et bienvenue chez Vacances Bleues ! Je suis votre assistant de réservation. Comment puis-je vous aider aujourd'hui ?";

const responseCreate = {
  type: "response.create",
  response: {
    instructions: `Say to the user: ${WELCOME_GREETING}`,
  },
} as const;

const RealtimeIncomingCall = "realtime.call.incoming" as const;

// Interfaces pour les réservations
interface Reservation {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  date_arrivee: string;
  date_depart: string;
  type_chambre: string;
  nombre_personnes: number;
  demandes_speciales?: string;
  date_creation: string;
}

// Stockage en mémoire des réservations (pour demo)
const reservations: Reservation[] = [];

// Chemin du fichier de sauvegarde des réservations
const RESERVATIONS_FILE = path.join(process.cwd(), "reservations.json");

// Charger les réservations existantes au démarrage
async function loadReservations() {
  try {
    const data = await fs.readFile(RESERVATIONS_FILE, "utf-8");
    const loaded = JSON.parse(data);
    reservations.push(...loaded);
    console.log(`📚 ${loaded.length} réservation(s) chargée(s) depuis le fichier`);
  } catch (error) {
    console.log("📝 Aucune réservation existante, création d'un nouveau fichier");
  }
}

// Sauvegarder les réservations dans un fichier
async function saveReservations() {
  try {
    await fs.writeFile(RESERVATIONS_FILE, JSON.stringify(reservations, null, 2), "utf-8");
    console.log("💾 Réservations sauvegardées");
  } catch (error) {
    console.error("❌ Erreur lors de la sauvegarde:", error);
  }
}

// Fonction pour vérifier la disponibilité
function checkAvailability(date_arrivee: string, date_depart: string, type_chambre: string): { available: boolean; message: string } {
  // Pour la démo, on simule la disponibilité
  // Dans un vrai système, vous interrogeriez votre base de données
  const available = true; // Toujours disponible pour la démo

  if (available) {
    return {
      available: true,
      message: `Excellente nouvelle ! Nous avons des chambres ${type_chambre} disponibles du ${date_arrivee} au ${date_depart}.`
    };
  } else {
    return {
      available: false,
      message: `Désolé, nous n'avons plus de chambres ${type_chambre} disponibles pour ces dates.`
    };
  }
}

// Fonction pour créer une réservation
async function createReservation(params: Omit<Reservation, 'id' | 'date_creation'>): Promise<{ success: boolean; reservation?: Reservation; message: string }> {
  try {
    const reservation: Reservation = {
      id: `RES-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...params,
      date_creation: new Date().toISOString()
    };

    reservations.push(reservation);
    await saveReservations(); // Sauvegarder immédiatement

    console.log('📅 Nouvelle réservation créée:', reservation);

    return {
      success: true,
      reservation,
      message: `Parfait ! Votre réservation est confirmée sous le numéro ${reservation.id}. Un email de confirmation sera envoyé à ${params.email}.`
    };
  } catch (error) {
    console.error('❌ Erreur lors de la création de la réservation:', error);
    return {
      success: false,
      message: "Désolé, une erreur s'est produite lors de la création de votre réservation. Veuillez réessayer."
    };
  }
}

const websocketTask = async (uri: string): Promise<void> => {

  const ws = new WebSocket(uri, {
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      origin: "https://api.openai.com",
    },
  });

  ws.on("open", () => {
    console.log(`🔌 WebSocket connecté: ${uri}`);
    ws.send(JSON.stringify(responseCreate));
  });

  ws.on("message", (data) => {
    const text = typeof data === "string" ? data : data.toString("utf8");

    try {
      const event = JSON.parse(text);

      // Gérer les appels de fonction
      if (event.type === "response.function_call_arguments.done") {
        console.log('📞 Appel de fonction détecté:', event.name);

        const functionName = event.name;
        const args = JSON.parse(event.arguments);

        (async () => {
          let functionResponse;

          if (functionName === "check_availability") {
            functionResponse = checkAvailability(
              args.date_arrivee,
              args.date_depart,
              args.type_chambre
            );
          } else if (functionName === "create_reservation") {
            functionResponse = await createReservation(args);
          }

          // Envoyer la réponse de la fonction à OpenAI
          if (functionResponse) {
            const functionOutput = {
              type: "conversation.item.create",
              item: {
                type: "function_call_output",
                call_id: event.call_id,
                output: JSON.stringify(functionResponse)
              }
            };

            ws.send(JSON.stringify(functionOutput));

            // Demander à l'assistant de continuer
            ws.send(JSON.stringify({ type: "response.create" }));
          }
        })();
      }

      // Logger d'autres événements importants
      if (event.type === "conversation.item.created") {
        console.log('💬 Nouvelle interaction:', event.item?.type);
      }

    } catch (e) {
      // Si ce n'est pas du JSON, ce n'est pas grave
    }
  });

  ws.on("error", (e) => {
    console.error("❌ Erreur WebSocket:", JSON.stringify(e));
  });

  ws.on("close", (code, reason) => {
    console.log("🔌 WebSocket fermé:", code, reason?.toString?.());
    console.log(`📊 Nombre total de réservations: ${reservations.length}`);
  });
}

const connectWithDelay = async (sipWssUrl: string, delay: number = 1000): Promise<void> => {

  try{
    setTimeout(async () => await websocketTask(sipWssUrl), delay );
  }catch(e){
    console.error(`Error connecting web socket ${e}`);
  }
  
}

app.get("/health", async (req: Request, res: Response ) => {
  return res.status(200).send(`Health ok`);
});

// Endpoint pour consulter les réservations
app.get("/reservations", async (req: Request, res: Response) => {
  return res.status(200).json({
    total: reservations.length,
    reservations: reservations
  });
});

// Endpoint pour obtenir une réservation spécifique
app.get("/reservations/:id", async (req: Request, res: Response) => {
  const reservation = reservations.find(r => r.id === req.params.id);
  if (reservation) {
    return res.status(200).json(reservation);
  } else {
    return res.status(404).json({ error: "Réservation non trouvée" });
  }
});

app.post("/", async (req: Request, res: Response) => {

  try {
    const event = await client.webhooks.unwrap(
      req.body.toString("utf8"),
      req.headers as Record<string, string>,
      WEBHOOK_SECRET
    );

    const type = (event as any)?.type;

    if (type === RealtimeIncomingCall) {
      const callId: string = (event as any)?.data?.call_id;


      // Accept the Call 
      const resp = await fetch(
        `https://api.openai.com/v1/realtime/calls/${encodeURIComponent(callId)}/accept`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(callAccept),
        }
      );

      if (!resp.ok) {
        const text = await resp.text().catch(() => "");
        console.error("ACCEPT failed:", resp.status, resp.statusText, text);
        return res.status(500).send("Accept failed");
      }


      // Connect the web socket after a short delay
      const wssUrl = `wss://api.openai.com/v1/realtime?call_id=${callId}`
      await connectWithDelay(wssUrl, 0); // lengthen delay if needed

      // Acknowledge the webhook
      res.set("Authorization", `Bearer ${OPENAI_API_KEY}`);
      return res.sendStatus(200);
    }

    return res.sendStatus(200);

  } catch (e: any) {
    const msg = String(e?.message ?? "");
    if (e?.name === "InvalidWebhookSignatureError" || msg.toLowerCase().includes("invalid signature")) {
      return res.status(400).send("Invalid signature");
    }
    return res.status(500).send("Server error");
  }
});

// Démarrer le serveur
app.listen(PORT, async () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
  console.log(`📞 Assistant de réservation Vacances Bleues prêt !`);
  await loadReservations();
  console.log(`\n📋 Endpoints disponibles:`);
  console.log(`   GET  /health - Vérifier le statut du serveur`);
  console.log(`   GET  /reservations - Consulter toutes les réservations`);
  console.log(`   GET  /reservations/:id - Consulter une réservation spécifique`);
  console.log(`   POST / - Webhook OpenAI (pour les appels entrants)\n`);
});
