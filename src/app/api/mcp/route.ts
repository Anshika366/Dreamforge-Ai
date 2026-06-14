import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Heuristics for prompt text
    const lowerPrompt = prompt.toLowerCase();
    let title = "Techoria";
    let theme = "A soaring sky-archipelago where coding syntax manifests as elemental magic.";
    let category = "tech";

    if (lowerPrompt.includes("revenue") || lowerPrompt.includes("sales") || lowerPrompt.includes("finance")) {
      title = "Aurum Ridge";
      theme = "A gold-veined mountain range ruled by financial dragons and accountant wizards.";
      category = "finance";
    } else if (lowerPrompt.includes("marketing") || lowerPrompt.includes("creative") || lowerPrompt.includes("design")) {
      title = "Aetheria of Dreams";
      theme = "A sky-realm of neon clouds and glowing canvases where public opinion governs gravity.";
      category = "creative";
    }

    // Mock MCP Tool outputs
    const generateWorldOutput = {
      title,
      lore: theme,
      regions: [
        { name: "Crystal Caves (Auth)", description: "Glistening server crystal node tunnels.", difficulty: "Easy", x: 150, y: 120 },
        { name: "Titan Forge (Infra)", description: "Where raw infrastructure server nodes are forged.", difficulty: "Medium", x: 320, y: 280 }
      ]
    };

    const generateCharacterOutput = [
      {
        name: "Lead Engineer",
        fantasyName: "Grand Archmage Jonas the Compiler",
        role: "Wizard of Rust",
        personality: "Obsessive about code syntax, speaks in compiler error warnings.",
        memory: ["Launch project history", "Authentication bug", "Deployment plan"]
      },
      {
        name: "QA Specialist",
        fantasyName: "Tracker Elara the Bug-Hunter",
        role: "Rogue Sentry",
        personality: "Quiet, loves to break things, carries a pouch of glitch-repelling salt.",
        memory: ["Regression checklist", "Boundary check exceptions"]
      }
    ];

    const generateStoryOutput = [
      { chapter: 1, title: "The Blue Screen Eclipse", content: "The sky turned cold and neon blue as the stack overflow temple began leaking memory daemon spirits." },
      { chapter: 2, title: "Debugging the Underworld", content: "Armed with his debugger, Archmage Jonas descended into the compiler depths to bypass the boundary exceptions." }
    ];

    const generateComicOutput = [
      { panel: 1, type: "Problem", narrative: "A strange neon blue smog begins leaking from the Compiler Core, threatening to freeze all active processes.", dialogue: "Jonas: 'The heap memory is overflowing!'" },
      { panel: 2, type: "Conflict", narrative: "A colossal memory daemon, Omni Glitch, emerges from the static cloud, blocking the gates.", dialogue: "Omni Glitch: 'I AM THE EXCEPTION!'" }
    ];

    const generateEscapeRoomOutput = {
      puzzles: [
        {
          id: "puz-1",
          title: "The Null Reference Lock",
          description: "The first gate is sealed by a floating code fragment. Find the missing reference.",
          challenge: "Identify the variable that must be instantiated before calling `.processData()`: `DataParser parser; parser.processData();`",
          answer: "parser = new DataParser()",
          hint: "Allocate memory before invoking methods."
        }
      ],
      finalBossPuzzle: {
        title: "The Megacorp Mainframe Decryption",
        description: "Decipher the security master key using your collected business knowledge.",
        challenge: "Decrypt this base64 string: 'RmluZSBZdXIgQnVncyE='",
        answer: "Find Your Bugs!",
        hint: "It translates to our tech team's ultimate mantra."
      }
    };

    const mappings = [
      { reality: "Authentication Bug", fantasy: "Dark Curse" },
      { reality: "Server Outage", fantasy: "Crystal Core Collapse" },
      { reality: "Database Leak", fantasy: "Memory Daemon Leak" },
      { reality: "System Log", fantasy: "Scrying Stone Records" }
    ];

    const responsePayload = {
      prompt,
      timestamp: new Date().toLocaleTimeString(),
      status: "Success",
      toolRuns: [
        { tool: "generate_world", status: "Success", durationMs: 450, output: generateWorldOutput },
        { tool: "generate_character", status: "Success", durationMs: 320, output: generateCharacterOutput },
        { tool: "generate_story", status: "Success", durationMs: 280, output: generateStoryOutput },
        { tool: "generate_comic", status: "Success", durationMs: 380, output: generateComicOutput },
        { tool: "generate_escape_room", status: "Success", durationMs: 310, output: generateEscapeRoomOutput }
      ],
      mappings,
      generatedWorld: {
        title: title,
        lore: theme,
        story: generateStoryOutput,
        comic: generateComicOutput,
        puzzles: generateEscapeRoomOutput,
        characters: generateCharacterOutput,
        quests: [
          { title: "The Great Memory Leak", description: "Cleanse the Floating Stack Overflow Temple of the memory-eating daemon.", reward: "Garbage Collector Staff" }
        ],
        regions: generateWorldOutput.regions,
        inventoryItems: [
          { name: "Staff of Garbage Collection", rarity: "Epic", description: "Deletes redundant processes instantly." }
        ],
        boss: {
          name: "Omni Glitch, the Stack-Overflow",
          title: "The Lord of Broken Pointers",
          weakness: "Garbage Collection",
          description: "A colossal monster composed of blue-screen static and loops."
        }
      }
    };

    return NextResponse.json(responsePayload);

  } catch (error: any) {
    console.error("Error executing MCP Simulation:", error);
    return NextResponse.json({ error: error.message || "Failed to execute MCP tools" }, { status: 500 });
  }
}
