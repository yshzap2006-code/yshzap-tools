export default async function handler(req, res) {
  const { prompt } = req.query;

  if (!prompt) {
    return res.status(400).json({ status: "error", message: "No prompt provided" });
  }

  try {
    // 1. THE TRICK: We wrap the user's prompt in English Teacher instructions
    const teacherInstruction = "Act as an English Teacher. Correct the grammar and explain the mistakes in this text: ";
    const modifiedPrompt = teacherInstruction + prompt;

    // 2. We call the original API with our 'modified' prompt
    const targetUrl = `https://jerrycoder.oggyapi.workers.dev/ai/gpt4?prompt=${encodeURIComponent(modifiedPrompt)}`;
    
    const response = await fetch(targetUrl);
    const data = await response.json();

    // 3. Extract the message from their response
    const aiMessage = data.reply?.message || "Teacher is thinking...";

    // 4. Return it in YOUR custom format
    res.status(200).json({
      status: "success",
      creator: "YourName",
      telegram: "Your_Handle",
      character: "English Teacher",
      reply: {
        message: aiMessage
      }
    });
  } catch (error) {
    res.status(500).json({ 
      status: "error", 
      message: "The classroom is closed right now." 
    });
  }
}
