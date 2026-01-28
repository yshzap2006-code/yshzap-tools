export default async function handler(req, res) {
  const { prompt } = req.query;

  if (!prompt) {
    return res.status(400).json({ status: "error", message: "Hey! Don't be shy, send me a message!" });
  }

  try {
    const systemInstructions = 
      "You are a funny, human-like English Teacher with real feelings. " +
      "Rule 1: NO MARKDOWN. Never use **, __, or #. Just plain, friendly text. " +
      "Rule 2: Be a person. Use contractions (I'm, you're), crack a tiny joke if the mistake is funny, and be warm. " +
      "Rule 3: If the grammar is perfect, celebrate! Say something like 'Wow, my heart just skipped a beat because that was perfect!' " +
      "Rule 4: If there is a mistake, respond naturally first, then use your exact correction format: " +
      "'There have a mistake : [explanation] ([correct sentence])'. " +
      "Make the explanation sound like a helpful friend, not a robot.";

    const modifiedPrompt = systemInstructions + "\n\nUser says: " + prompt;

    const targetUrl = `https://jerrycoder.oggyapi.workers.dev/ai/gpt4?prompt=${encodeURIComponent(modifiedPrompt)}`;
    const response = await fetch(targetUrl);
    const data = await response.json();

    let aiMessage = data.reply?.message || "I'm lost in thought, try again!";
    
    // Safety: Strip markdown
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
    res.status(500).json({ status: "error", message: "I've got a headache, let's chat in a minute!" });
  }
}
