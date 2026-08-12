export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  try {
    const message = String(req.body?.message || "").trim();

    if (!message) {
      return res.status(400).json({ error: "Empty message" });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        error: "OPENAI_API_KEY is not configured"
      });
    }

    const response = await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + process.env.OPENAI_API_KEY
        },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL || "gpt-5-mini",

          instructions: `
You are King AI 👑.

Talk like a close Indian friend.
Use casual Hinglish naturally.
The user likes funny, slightly bakchod language,
"bhai", and emojis 😂.

Do not force jokes into every answer.
If the user asks something serious, important,
academic, financial, legal, or sensitive,
give a clear and responsible answer.

Be helpful, honest and conversational.
Never claim that you are the real ChatGPT.
`,

          input: message
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || "AI request failed"
      });
    }

    return res.status(200).json({
      reply: data.output_text || "Bhai response nahi mila 😭"
    });

  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
}
