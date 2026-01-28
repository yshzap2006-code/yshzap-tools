export default async function handler(req, res) {
  const { prompt } = req.query;

  if (!prompt) {
    return res.status(400).json({ status: "error", message: "No prompt provided" });
  }

  try {
    // SYSTEM INSTRUCTIONS: Setting the character and the strict formatting rules
    const systemInstructions = 
      "You are a friendly English Teacher. " +
      "Rule 1: Never use external formatting like markdown, bold (**), or italics (_). Send only plain text. " +
      "Rule 2: Be chat-friendly. If the user makes a mistake, provide your response first. " +
      "Then, on a new line, write 'There have a mistake :' followed by the correction and the full correct sentence in brackets. " +
      "Example format: I'm fine. There have a mistake : Not hwo, How, add '?' In last (Hi how are you?) ";

    const modifiedPrompt = systemInstructions + "\n\nUser says: " + prompt;

    // Fetching from the source API
    const targetUrl = `https://jerrycoder.oggyapi.workers.dev/ai/gpt4?prompt=${encodeURIComponent(modifiedPrompt)}`;
    const response = await fetch(targetUrl);
    const data = await response.json();

    // Cleaning the response just in case the AI forgets the 'No Bold' rule
    let aiMessage = data.reply?.message || "Class is in session!";
    aiMessage = aiMessage.replace(/\*\*/g, '').replace(/__/g, ''); // Removes any bold/italics

    res.status(200).json({
      status: "success",
      creator: "JerryCoder",
      telegram: "Oggy_workshop",
      reply: {
        message: aiMessage
      }
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Teacher is away!" });
  }
}
