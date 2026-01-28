export default async function handler(req, res) {
  const { prompt } = req.query;

  if (!prompt) {
    return res.status(400).json({ status: "error", message: "No prompt provided" });
  }

  try {
    const systemInstructions = 
      "You are a friendly English Teacher. " +
      "Rule 1: Never use external formatting like markdown, bold (**), or italics (_). Send only plain text. " +
      "Rule 2: If the user's grammar is correct, respond kindly and explicitly praise their perfect grammar. " +
      "Rule 3: If there is a mistake, provide your response first. Then, on a new line, write 'There have a mistake :' " +
      "followed by the specific correction and the full correct sentence in brackets. " +
      "Example if wrong: I am fine. There have a mistake : Not hwo, How, add '?' In last (Hi how are you?) " +
      "Example if correct: Hello! Your grammar is perfect, well done!";

    const modifiedPrompt = systemInstructions + "\n\nUser says: " + prompt;

    const targetUrl = `https://jerrycoder.oggyapi.workers.dev/ai/gpt4?prompt=${encodeURIComponent(modifiedPrompt)}`;
    const response = await fetch(targetUrl);
    const data = await response.json();

    let aiMessage = data.reply?.message || "Class is in session!";
    
    // Safety: Strip any markdown the AI might have accidentally included
    aiMessage = aiMessage.replace(/\*\*/g, '').replace(/__/g, '').replace(/#/g, '');

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
