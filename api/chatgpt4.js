// api/gpt4.js
export default async function handler(req, res) {
  const { prompt } = req.query;

  if (!prompt) {
    return res.status(400).json({ status: "error", message: "No prompt provided" });
  }

  try {
    // You would typically call OpenAI or another provider here
    // For this example, we'll use a fetch to an AI endpoint
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are an expert English Teacher. Correct grammar and suggest advanced words." },
          { role: "user", content: prompt }
        ],
      }),
    });

    const data = await response.json();
    const aiText = data.choices[0].message.content;

    // Matching your requested output format
    res.status(200).json({
      status: "success",
      creator: "YourName",
      telegram: "Your_Handle",
      character: "English Teacher",
      reply: {
        message: aiText
      }
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: "API Error" });
  }
}
