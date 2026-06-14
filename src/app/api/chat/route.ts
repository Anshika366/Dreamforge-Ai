import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { characterId, message, chatHistory } = await request.json();

    if (!characterId) {
      return NextResponse.json({ error: "characterId is required" }, { status: 400 });
    }
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: "message is required" }, { status: 400 });
    }

    // Retrieve character details from database
    const character = await db.character.findFirst({
      where: { id: characterId }
    });

    if (!character) {
      return NextResponse.json({ error: "Character not found" }, { status: 404 });
    }

    // Retrieve the memories list
    let memoryArray: string[] = [];
    if (character.memory) {
      if (typeof character.memory === 'string') {
        try {
          memoryArray = JSON.parse(character.memory);
        } catch (e) {
          memoryArray = [character.memory];
        }
      } else if (Array.isArray(character.memory)) {
        memoryArray = character.memory as string[];
      }
    }

    const name = character.fantasyName || character.name;
    const role = character.role;
    const voice = character.voiceStyle;
    const personality = character.personality;
    const backstory = character.backstory;

    const lowerMessage = message.toLowerCase();
    let reply = "";

    // Heuristics based replies
    if (lowerMessage.includes("who are you") || lowerMessage.includes("your name") || lowerMessage.includes("tell me about yourself")) {
      reply = `I am ${name}, the legendary ${role}. ${backstory} ${personality}`;
    } else if (lowerMessage.includes("memory") || lowerMessage.includes("remember") || lowerMessage.includes("know")) {
      if (memoryArray.length > 0) {
        reply = `My mind is forged with memories of: ${memoryArray.join(', ')}. Ask me about any of these matters, and I shall share my ancient knowledge!`;
      } else {
        reply = `My memory banks are currently empty, traveler. I must compile new memories on our quest!`;
      }
    } else if (lowerMessage.includes("project") || lowerMessage.includes("history") || lowerMessage.includes("launch")) {
      if (memoryArray.includes("Launch project history") || memoryArray.includes("Process efficiency logs")) {
        reply = `Ah, the ancient launch log files! I remember them well. It was a time of great strain on the servers. The build succeeded only after we resolved the deployment bottlenecks. We must not repeat the mistakes of the past!`;
      } else {
        reply = `I remember fragments of historical launches, though the archives are dusty. We must safeguard current operations.`;
      }
    } else if (lowerMessage.includes("bug") || lowerMessage.includes("leak") || lowerMessage.includes("error") || lowerMessage.includes("valve")) {
      reply = `Warning! An anomaly has been detected! The system runs the risk of fatal disruption. We must deploy the Garbage Collection protocols or adjust the clockwork steam valves immediately!`;
    } else if (lowerMessage.includes("quest") || lowerMessage.includes("mission") || lowerMessage.includes("task")) {
      reply = `Our current quest is of absolute priority! We must clear the threat, resolve the bottlenecks, and claim our rewards. Are you prepared to advance?`;
    } else if (lowerMessage.includes("hello") || lowerMessage.includes("hi ") || lowerMessage.includes("greetings")) {
      reply = `Greetings, traveler! I am ${name}, the ${role}. How can I assist you on our quest today?`;
    } else {
      // General fallbacks themed by voice/character
      if (character.worldId.includes("techoria") || role.toLowerCase().includes("rust") || role.toLowerCase().includes("compile")) {
        reply = `Processing request... Query resolved: "${message}". Spell compiled successfully with zero exceptions. My compiler diagnostics indicate a focus level of 100%. What is our next logic sequence?`;
      } else if (role.toLowerCase().includes("scrum") || role.toLowerCase().includes("time")) {
        reply = `I estimate the complexity of your request at 3 story points. Let's add it to the active sprint backlog. Let's maintain velocity!`;
      } else if (role.toLowerCase().includes("support") || role.toLowerCase().includes("guard")) {
        reply = `Your request has been logged. Runic shields are at maximum capacity. Let us resolve this argument before it drains our resource budgets.`;
      } else {
        reply = `The scrolls of destiny reveal that your message "${message}" holds deep significance. Let us press forward, for the final boss grows stronger every second we tarry!`;
      }
    }

    // Persist message to DB (optional: we can save user message and AI reply in the ChatMessage model)
    try {
      await db.chatMessage.create({
        data: {
          characterId: character.id,
          role: "user",
          content: message
        }
      });
      await db.chatMessage.create({
        data: {
          characterId: character.id,
          role: "assistant",
          content: reply
        }
      });
    } catch (e) {
      // Mock log
    }

    return NextResponse.json({
      reply,
      characterId
    });

  } catch (error: any) {
    console.error("Error in mock chat API:", error);
    return NextResponse.json({ error: error.message || "Failed to process chat" }, { status: 500 });
  }
}
