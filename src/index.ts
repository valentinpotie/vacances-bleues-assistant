import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import WebSocket from "ws";
import OpenAI from "openai";
import "dotenv/config";

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

const sessionCreate = {
  type: "session.create",
  session: {
    instructions: "You are a support agent.",
    model: "gpt-4o-realtime-preview-2025-06-03",
  },
} as const;

const responseCreate = {
  type: "response.create",
  response: {
    instructions: "Say to the user 'Thank you for calling, how can I help you'",
  },
} as const;

type RealtimeIncomingCall = {
  type: "realtime.incoming.call";
  data: { wss_url: string };
};

async function websocketTask(uri: string): Promise<void> {
  const ws = new WebSocket(uri, {
    headers: { Authorization: `Bearer ${OPENAI_API_KEY}` },
  });

  ws.on("open", () => {
    ws.send(JSON.stringify(responseCreate));
  });

  ws.on("message", (data) => {
    const text = typeof data === "string" ? data : data.toString("utf8");
    console.log("Received from WebSocket:", text);
  });

  ws.on("error", (err) => {
    console.error("WebSocket error:", err);
  });

  ws.on("close", (code, reason) => {
    console.log("WebSocket closed:", code, reason?.toString?.());
  });
}

function startWebsocketClient(wsUrl: string) {
  websocketTask(wsUrl).catch((e) =>
    console.error("WebSocket task failed:", e)
  );
}

app.get("/health", async (req: Request, res: Response ) => {
  return res.status(200).send("health ok");
});

app.post("/", async (req: Request, res: Response) => {
  try {
    // The OpenAI SDK expects the raw body and request headers
    const event = await client.webhooks.unwrap(
      req.body.toString("utf8"), 
      req.headers as Record<string, string>,
      WEBHOOK_SECRET
    );

    if ((event as unknown as RealtimeIncomingCall).type === "realtime.incoming.call") {
      const { wss_url } = (event as unknown as RealtimeIncomingCall).data;
      startWebsocketClient(wss_url);

      // Return session.create and include Authorization header
      res.set("Authorization", `Bearer ${OPENAI_API_KEY}`);
      return res.status(200).json(sessionCreate);
    }

    return res.sendStatus(200);
  } catch (err: any) {
    const msg = String(err?.message ?? "");
    if (
      err?.name === "InvalidWebhookSignatureError" ||
      msg.toLowerCase().includes("invalid signature")
    ) {
      console.error("Invalid signature", err);
      return res.status(400).send("Invalid signature");
    }
    console.error("Webhook handler error:", err);
    return res.status(500).send("Server error");
  }
});

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
