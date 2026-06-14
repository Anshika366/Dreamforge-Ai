import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

let prisma: PrismaClient;

// Determine if we should use the mock database fallback.
// This triggers if DATABASE_URL is not set.
const useMock = typeof window === 'undefined' ? !process.env.DATABASE_URL : true;

interface MockWorld {
  id: string;
  title: string;
  lore: string;
  story: any; // Json
  comic: any; // Json
  puzzles: any; // Json
  createdAt: Date;
}

interface MockCharacter {
  id: string;
  worldId: string;
  name: string;
  fantasyName: string;
  role: string;
  personality: string;
  memory: any; // Json
  backstory: string;
  voiceStyle: string;
}

interface MockQuest {
  id: string;
  worldId: string;
  title: string;
  description: string;
  reward: string;
}

interface MockRegion {
  id: string;
  worldId: string;
  name: string;
  description: string;
  difficulty: string;
  x: number;
  y: number;
}

interface MockInventoryItem {
  id: string;
  worldId: string;
  name: string;
  rarity: string;
  description: string;
}

interface MockBoss {
  id: string;
  worldId: string;
  name: string;
  title: string;
  weakness: string;
  description: string;
}

interface MockWorldProgress {
  id: string;
  worldId: string;
  completedQuests: any; // Json
  unlockedRegions: any; // Json
  discoveredCharacters: any; // Json
  playerInventory: any; // Json
}

interface MockChatMessage {
  id: string;
  characterId: string;
  role: string;
  content: string;
  createdAt: Date;
}

// In-memory lists of default mock data
let mockWorlds: MockWorld[] = [
  {
    id: 'techoria',
    title: 'Techoria',
    lore: 'A sprawling technological wonderland where coding syntax manifests as elemental magic and servers serve as massive ancient temples.',
    story: [
      { chapter: 1, title: "The Blue Screen Eclipse", content: "The sky turned cold and neon blue as the stack overflow temple began leaking memory daemon spirits." },
      { chapter: 2, title: "Debugging the Underworld", content: "Jonas descended into the compiler depths to bypass the boundary exceptions." },
      { chapter: 3, title: "The Garbage Collector's Staff", content: "With a swipe of his legendary staff, Jonas purged the memory daemon, restoring clean execution." }
    ],
    comic: [
      {
        panel: 1,
        type: "Problem",
        narrative: "A strange neon blue smog begins leaking from the Compiler Core, threatening to freeze all active processes in Techoria.",
        dialogue: "Jonas: 'The heap memory is overflowing! If we don't dump the garbage registers soon, the system will lock up completely!'"
      },
      {
        panel: 2,
        type: "Conflict",
        narrative: "A colossal memory daemon, Omni Glitch, emerges from the static cloud, blocking the gates of the Stack-Overflow Temple.",
        dialogue: "Omni Glitch: 'I AM THE EXCEPTION! THERE IS NO REFERENCE TO RESCUE YOU!'"
      },
      {
        panel: 3,
        type: "Investigation",
        narrative: "Jonas runs a diagnostics spell, scanning the database logs to find the daemon's weakness.",
        dialogue: "Jonas: 'Its form is unstable... it's held together by dead pointers. A simple sweep of memory garbage collection will tear it apart!'"
      },
      {
        panel: 4,
        type: "Solution",
        narrative: "Wielding the legendary Staff of Garbage Collection, Jonas executes a full sweep sweep, purging all unreferenced daemon nodes.",
        dialogue: "Jonas: 'System.gc();! Purge!'"
      },
      {
        panel: 5,
        type: "Ending",
        narrative: "The blue smoke clears. Memory leaks are plugged, and Techoria returns to a stable green status.",
        dialogue: "Jonas: 'Deployment successful. Status: 200 OK. Rest easy, compilers.'"
      }
    ],
    puzzles: {
      puzzles: [
        {
          id: "puzzle-1",
          title: "The Null Reference Lock",
          description: "The first gate of the escape room is sealed by a floating code fragment. You must find the missing variable reference that is causing a crash.",
          challenge: "Identify the variable that must be instantiated before calling `.processData()` in the sequence: `DataParser parser; parser.processData();`",
          answer: "parser = new DataParser()",
          hint: "You must allocate memory for the parser object before invoking its methods!"
        },
        {
          id: "puzzle-2",
          title: "The Port Collision Riddle",
          description: "A steam valve is whistling. It's trying to run on an occupied network address. You must find the free port to route the steam safely.",
          challenge: "If ports 80, 443, and 8080 are currently bound to active daemons, which standard port should you configure the new dev server to listen on? (Options: 3000, 80, 443)",
          answer: "3000",
          hint: "Common web development servers run on port 3000."
        }
      ],
      finalBossPuzzle: {
        title: "The Megacorp Mainframe Decryption",
        description: "To unlock the final door and escape, you must decipher the security master key using your collected business knowledge.",
        challenge: "Decrypt this base64 string: 'RmluZSBZdXIgQnVncyE=' which translates to our tech team's ultimate mantra.",
        answer: "Find Your Bugs!",
        hint: "Try decoding it using a base64 decoder tool, or think of the ultimate goal of QA testing."
      }
    },
    createdAt: new Date(Date.now() - 3600000 * 24),
  },
  {
    id: 'kingdom-of-innovation',
    title: 'Kingdom of Innovation',
    lore: 'An empire built upon floating gears, clockwork automation, and steam-driven airships.',
    story: [
      { chapter: 1, title: "The Cold Valves", content: "The clockwork oracle ceased to rotate as its golden valves were stolen." },
      { chapter: 2, title: "Clash in the Clockwork Mines", content: "Lady Gearsmith Sarah fought clockwork security droids to retrieve the valves." },
      { chapter: 3, title: "Oracle Awake", content: "The valves were restored and the Oracle predicted an era of infinite energy." }
    ],
    comic: [
      {
        panel: 1,
        type: "Problem",
        narrative: "The Great Oracle Cog snaps under pressure, bringing the entire automation network of the Kingdom to a screeching halt.",
        dialogue: "Sarah: 'The torque calculations were off! The gears are locking!'"
      },
      {
        panel: 2,
        type: "Conflict",
        narrative: "Steam-powered rogue droids take control of the mining tunnels, guarding the replacement cogs.",
        dialogue: "Rogue Droid: 'Unauthorized entry detected. Priority: Protect resources.'"
      },
      {
        panel: 3,
        type: "Investigation",
        narrative: "Sarah analyzes the mechanical stress logs to design a reinforced gear pattern.",
        dialogue: "Sarah: 'If we alloy the titanium brass with copper, the gears won't shear under maximum pressure!'"
      },
      {
        panel: 4,
        type: "Solution",
        narrative: "Sarah runs a steam-blast override, disabling the rogue droids and retrieving the core alloy valves.",
        dialogue: "Sarah: 'Venting steam pressure now! Hold on!'"
      },
      {
        panel: 5,
        type: "Ending",
        narrative: "The Oracle rotates smoothly once more, powering the clockwork city in a golden sunset.",
        dialogue: "Sarah: 'Optimal efficiency restored. Another day, another gear.'"
      }
    ],
    puzzles: {
      puzzles: [
        {
          id: "puzzle-1",
          title: "The Valve Pressure Puzzle",
          description: "A steam line is over-pressurized. You must balance the pressure levels.",
          challenge: "If pressure exceeds 150 PSI, the valve bursts. The current pressure is 180 PSI. Opening release valve A drops it by 20 PSI, and valve B drops it by 15 PSI. Which valves should you open to drop the pressure below 150 PSI?",
          answer: "A and B",
          hint: "Drop it by at least 31 PSI. Try combining release valves."
        }
      ],
      finalBossPuzzle: {
        title: "The Clockwork Key",
        description: "Decipher the gear ratio combination to restart the Oracle core.",
        challenge: "What is the gear ratio required if the input gear has 12 teeth and the output gear has 36 teeth? (Format: input:output, e.g., 1:3)",
        answer: "1:3",
        hint: "Divide both sides by 12."
      }
    },
    createdAt: new Date(Date.now() - 3600000 * 12),
  },
  {
    id: 'cyber-realm',
    title: 'Cyber Realm',
    lore: 'A neon-drenched dystopia where artificial spirits govern vast data networks.',
    story: [
      { chapter: 1, title: "The Packet Heist", content: "Netrunner Ronin Alex breached the megacorp network node." },
      { chapter: 2, title: "Firewall Overload", content: "The light-up plasma sabers clashed with sentinel programs." },
      { chapter: 3, title: "Data Liberated", content: "The open source blueprint was successfully beamed to the free networks." }
    ],
    comic: [
      {
        panel: 1,
        type: "Problem",
        narrative: "Megacorp activates a sweeping firewall purge, seeking to erase all street netrunners' access nodes.",
        dialogue: "Alex: 'Our connection is dropping! They are wiping the logs!'"
      },
      {
        panel: 2,
        type: "Conflict",
        narrative: "A massive security mainframe entity, Sentinel-01, starts scanning the local network sector.",
        dialogue: "Sentinel-01: 'Intruders found. Executing deletion subroutines.'"
      },
      {
        panel: 3,
        type: "Investigation",
        narrative: "Alex triggers a debug console, tracing the server's telemetry path.",
        dialogue: "Alex: 'Their handshake protocol has a latency window. We can sneak in a bypass payload!'"
      },
      {
        panel: 4,
        type: "Solution",
        narrative: "Alex fires a custom script through the handshake delay, overriding the firewall configuration.",
        dialogue: "Alex: 'Payload sent. Security protocols disabled!'"
      },
      {
        panel: 5,
        type: "Ending",
        narrative: "The sector light turns green. The network remains free and decentralized.",
        dialogue: "Alex: 'We are in the clear. Network state: Active.'"
      }
    ],
    puzzles: {
      puzzles: [
        {
          id: "puzzle-1",
          title: "The Handshake Latency",
          description: "Crack the latency time delay puzzle to bypass the scanner.",
          challenge: "If the scanner polls every 500ms and the payload takes 200ms to execute, what is the maximum delay (in ms) you can wait before starting the payload after a scan to avoid detection? (Enter number)",
          answer: "300",
          hint: "Subtract the execution time from the scanner polling interval."
        }
      ],
      finalBossPuzzle: {
        title: "Mainframe Core Password",
        description: "Decrypt the mainframe root password.",
        challenge: "What is the binary representation of the decimal number 10? (Enter 4 bits, e.g. 0101)",
        answer: "1010",
        hint: "8 + 2 = 10"
      }
    },
    createdAt: new Date(Date.now() - 3600000 * 2),
  }
];

let mockCharacters: MockCharacter[] = [
  {
    id: 'char-1',
    worldId: 'techoria',
    name: 'Lead Developer',
    fantasyName: 'Archmage Jonas the Compiler',
    role: 'Wizard of Rust',
    personality: 'Obsessive about code syntax, constantly debugging his spellbook, speaks in cryptic code templates and drinks strictly caffeinated mana potions.',
    memory: ["Launch project history", "Authentication bug", "Deployment plan"],
    backstory: "Once a simple scribe who learned to weave compiler runes, he now governs the Floating Stack Overflow Temple.",
    voiceStyle: "Speaks with formal precision, often quoting line numbers and throwing exceptions."
  },
  {
    id: 'char-2',
    worldId: 'kingdom-of-innovation',
    name: 'Operations Manager',
    fantasyName: 'Lady Gearsmith Sarah',
    role: 'Steam-Airship Captain',
    personality: 'Brave, highly analytical, always tinkering with steam-powered gears, and believes that efficiency is the highest honor.',
    memory: ["Process efficiency logs", "Valves inventory list", "Airship schematics"],
    backstory: "Built her first steam airship at age ten. Now serves as the High Admiral of the Gear Guild fleet.",
    voiceStyle: "Direct, confident, uses nautical and mechanical metaphors."
  },
  {
    id: 'char-3',
    worldId: 'cyber-realm',
    name: 'Security Officer',
    fantasyName: 'Byte-Blade Ronin Alex',
    role: 'Netrunner Ronin',
    personality: 'Cynical, fast-talking, lives on the network fringe, and wields a plasma saber that slicing through firewall projections.',
    memory: ["Firewall access tokens", "Mainframe coordinates", "Corporate decryption keys"],
    backstory: "An ex-corporate security officer who went rogue after uncovering the mainframe blueprint conspiracy.",
    voiceStyle: "Sarcastic, street-smart, uses hacking slang."
  }
];

let mockQuests: MockQuest[] = [
  {
    id: 'quest-1',
    worldId: 'techoria',
    title: 'The Great Memory Leak',
    description: 'Cleanse the Floating Stack Overflow Temple of the memory-eating daemon before it consumes the world memory reserves.',
    reward: 'Garbage Collector Staff'
  },
  {
    id: 'quest-2',
    worldId: 'kingdom-of-innovation',
    title: 'Assemble the Oracle Engine',
    description: 'Retrieve three mythical golden steam valves from the automated mines to power the mechanical oracle.',
    reward: 'Steam Jetpack'
  },
  {
    id: 'quest-3',
    worldId: 'cyber-realm',
    title: 'Hack the Mainframe Core',
    description: 'Infiltrate the Megacorp digital vault and bypass security nodes to copy the blueprints.',
    reward: 'Root Access Admin Keycard'
  }
];

let mockRegions: MockRegion[] = [
  { id: 'reg-1', worldId: 'techoria', name: 'Crystal Caves', description: 'Glistening server crystal node tunnels.', difficulty: 'Easy', x: 150, y: 120 },
  { id: 'reg-2', worldId: 'techoria', name: 'Titan Forge', description: 'Where raw infrastructure is beaten into compiler steel.', difficulty: 'Medium', x: 320, y: 280 },
  { id: 'reg-3', worldId: 'techoria', name: 'Sky Fortress', description: 'The high-altitude compiler deployment dome.', difficulty: 'Hard', x: 500, y: 150 }
];

let mockInventoryItems: MockInventoryItem[] = [
  { id: 'item-1', worldId: 'techoria', name: 'Staff of Garbage Collection', rarity: 'Epic', description: 'Deletes redundant processes instantly.' },
  { id: 'item-2', worldId: 'techoria', name: 'Ring of Silent Commits', rarity: 'Rare', description: 'Allows safe commits without code reviews.' }
];

let mockBosses: MockBoss[] = [
  {
    id: 'boss-1',
    worldId: 'techoria',
    name: 'Omni Glitch, the Stack-Overflow',
    title: 'The Lord of Broken Pointers',
    weakness: 'Garbage Collection',
    description: 'A terrifying colossal monster composed of blue-screen static, infinite loops, and red compiler error highlights.'
  }
];

let mockProgresses: MockWorldProgress[] = [
  { id: 'prog-1', worldId: 'techoria', completedQuests: [], unlockedRegions: ['reg-1'], discoveredCharacters: ['char-1'], playerInventory: [] }
];

let mockChatMessages: MockChatMessage[] = [];

const delay = (ms = 100) => new Promise((resolve) => setTimeout(resolve, ms));

const mockDb = {
  world: {
    findMany: async (args?: any) => {
      await delay();
      return mockWorlds.map(w => ({
        ...w,
        characters: mockCharacters.filter(c => c.worldId === w.id),
        quests: mockQuests.filter(q => q.worldId === w.id),
        regions: mockRegions.filter(r => r.worldId === w.id),
        inventoryItems: mockInventoryItems.filter(i => i.worldId === w.id),
        bosses: mockBosses.filter(b => b.worldId === w.id),
        progress: mockProgresses.find(p => p.worldId === w.id)
      }));
    },
    findUnique: async (args: { where: { id: string }, include?: any }) => {
      await delay();
      const world = mockWorlds.find(w => w.id === args.where.id);
      if (!world) return null;
      
      const response: any = { ...world };
      if (args.include?.characters) {
        response.characters = mockCharacters.filter(c => c.worldId === args.where.id);
      }
      if (args.include?.quests) {
        response.quests = mockQuests.filter(q => q.worldId === args.where.id);
      }
      if (args.include?.regions) {
        response.regions = mockRegions.filter(r => r.worldId === args.where.id);
      }
      if (args.include?.inventoryItems) {
        response.inventoryItems = mockInventoryItems.filter(i => i.worldId === args.where.id);
      }
      if (args.include?.bosses) {
        response.bosses = mockBosses.filter(b => b.worldId === args.where.id);
      }
      if (args.include?.progress) {
        response.progress = mockProgresses.find(p => p.worldId === args.where.id) || null;
      }
      return response;
    },
    create: async (args: { data: any }) => {
      await delay();
      const id = args.data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.random().toString(36).substring(2, 6);
      const newWorld: MockWorld = {
        id,
        title: args.data.title,
        lore: args.data.lore,
        story: args.data.story || [],
        comic: args.data.comic || [],
        puzzles: args.data.puzzles || {},
        createdAt: new Date()
      };
      
      mockWorlds.unshift(newWorld);
      
      if (args.data.characters?.create) {
        args.data.characters.create.forEach((c: any) => {
          mockCharacters.push({
            id: `char-${Math.random().toString(36).substring(2, 6)}`,
            worldId: id,
            name: c.name,
            fantasyName: c.fantasyName,
            role: c.role,
            personality: c.personality,
            memory: c.memory || [],
            backstory: c.backstory || "",
            voiceStyle: c.voiceStyle || ""
          });
        });
      }
      
      if (args.data.quests?.create) {
        args.data.quests.create.forEach((q: any) => {
          mockQuests.push({
            id: `quest-${Math.random().toString(36).substring(2, 6)}`,
            worldId: id,
            title: q.title,
            description: q.description,
            reward: q.reward
          });
        });
      }

      if (args.data.regions?.create) {
        args.data.regions.create.forEach((r: any) => {
          mockRegions.push({
            id: `reg-${Math.random().toString(36).substring(2, 6)}`,
            worldId: id,
            name: r.name,
            description: r.description,
            difficulty: r.difficulty || "Easy",
            x: r.x || 100,
            y: r.y || 100
          });
        });
      }

      if (args.data.inventoryItems?.create) {
        args.data.inventoryItems.create.forEach((iItem: any) => {
          mockInventoryItems.push({
            id: `item-${Math.random().toString(36).substring(2, 6)}`,
            worldId: id,
            name: iItem.name,
            rarity: iItem.rarity || "Common",
            description: iItem.description
          });
        });
      }

      if (args.data.bosses?.create) {
        args.data.bosses.create.forEach((b: any) => {
          mockBosses.push({
            id: `boss-${Math.random().toString(36).substring(2, 6)}`,
            worldId: id,
            name: b.name,
            title: b.title,
            weakness: b.weakness,
            description: b.description
          });
        });
      }

      const newProg: MockWorldProgress = {
        id: `prog-${Math.random().toString(36).substring(2, 6)}`,
        worldId: id,
        completedQuests: [],
        unlockedRegions: mockRegions.filter(r => r.worldId === id).slice(0, 1).map(r => r.id),
        discoveredCharacters: mockCharacters.filter(c => c.worldId === id).slice(0, 1).map(c => c.id),
        playerInventory: []
      };
      mockProgresses.push(newProg);

      return {
        ...newWorld,
        characters: mockCharacters.filter(c => c.worldId === id),
        quests: mockQuests.filter(q => q.worldId === id),
        regions: mockRegions.filter(r => r.worldId === id),
        inventoryItems: mockInventoryItems.filter(i => i.worldId === id),
        bosses: mockBosses.filter(b => b.worldId === id),
        progress: newProg
      };
    },
    delete: async (args: { where: { id: string } }) => {
      await delay();
      mockWorlds = mockWorlds.filter(w => w.id !== args.where.id);
      mockCharacters = mockCharacters.filter(c => c.worldId !== args.where.id);
      mockQuests = mockQuests.filter(q => q.worldId !== args.where.id);
      mockRegions = mockRegions.filter(r => r.worldId !== args.where.id);
      mockInventoryItems = mockInventoryItems.filter(i => i.worldId !== args.where.id);
      mockBosses = mockBosses.filter(b => b.worldId !== args.where.id);
      mockProgresses = mockProgresses.filter(p => p.worldId !== args.where.id);
      return { id: args.where.id };
    },
    update: async (args: { where: { id: string }, data: any }) => {
      await delay();
      const idx = mockWorlds.findIndex(w => w.id === args.where.id);
      if (idx !== -1) {
        mockWorlds[idx] = {
          ...mockWorlds[idx],
          ...args.data
        };
        return mockWorlds[idx];
      }
      return null;
    }
  },
  character: {
    findMany: async (args?: any) => {
      await delay();
      if (args?.where?.worldId) {
        return mockCharacters.filter(c => c.worldId === args.where.worldId);
      }
      return mockCharacters;
    },
    create: async (args: { data: MockCharacter }) => {
      await delay();
      const newChar = { ...args.data, id: args.data.id || `char-${Math.random().toString(36).substring(2, 6)}` };
      mockCharacters.push(newChar);
      return newChar;
    }
  },
  quest: {
    findMany: async (args?: any) => {
      await delay();
      if (args?.where?.worldId) {
        return mockQuests.filter(q => q.worldId === args.where.worldId);
      }
      return mockQuests;
    },
    create: async (args: { data: MockQuest }) => {
      await delay();
      const newQuest = { ...args.data, id: args.data.id || `quest-${Math.random().toString(36).substring(2, 6)}` };
      mockQuests.push(newQuest);
      return newQuest;
    }
  },
  region: {
    findMany: async (args?: any) => {
      await delay();
      if (args?.where?.worldId) {
        return mockRegions.filter(r => r.worldId === args.where.worldId);
      }
      return mockRegions;
    },
    create: async (args: { data: MockRegion }) => {
      await delay();
      const newReg = { ...args.data, id: args.data.id || `reg-${Math.random().toString(36).substring(2, 6)}` };
      mockRegions.push(newReg);
      return newReg;
    }
  },
  inventoryItem: {
    findMany: async (args?: any) => {
      await delay();
      if (args?.where?.worldId) {
        return mockInventoryItems.filter(i => i.worldId === args.where.worldId);
      }
      return mockInventoryItems;
    },
    create: async (args: { data: MockInventoryItem }) => {
      await delay();
      const newItem = { ...args.data, id: args.data.id || `item-${Math.random().toString(36).substring(2, 6)}` };
      mockInventoryItems.push(newItem);
      return newItem;
    }
  },
  boss: {
    findMany: async (args?: any) => {
      await delay();
      if (args?.where?.worldId) {
        return mockBosses.filter(b => b.worldId === args.where.worldId);
      }
      return mockBosses;
    },
    create: async (args: { data: MockBoss }) => {
      await delay();
      const newBoss = { ...args.data, id: args.data.id || `boss-${Math.random().toString(36).substring(2, 6)}` };
      mockBosses.push(newBoss);
      return newBoss;
    }
  },
  worldProgress: {
    findUnique: async (args: { where: { worldId: string } }) => {
      await delay();
      return mockProgresses.find(p => p.worldId === args.where.worldId) || null;
    },
    create: async (args: { data: MockWorldProgress }) => {
      await delay();
      const newProg = { ...args.data, id: args.data.id || `prog-${Math.random().toString(36).substring(2, 6)}` };
      mockProgresses.push(newProg);
      return newProg;
    },
    update: async (args: { where: { worldId: string }, data: any }) => {
      await delay();
      const idx = mockProgresses.findIndex(p => p.worldId === args.where.worldId);
      if (idx !== -1) {
        mockProgresses[idx] = {
          ...mockProgresses[idx],
          ...args.data
        };
        return mockProgresses[idx];
      }
      return null;
    }
  },
  chatMessage: {
    findMany: async (args?: any) => {
      await delay();
      if (args?.where?.characterId) {
        return mockChatMessages.filter(m => m.characterId === args.where.characterId);
      }
      return mockChatMessages;
    },
    create: async (args: { data: any }) => {
      await delay();
      const newMsg: MockChatMessage = {
        id: `msg-${Math.random().toString(36).substring(2, 6)}`,
        characterId: args.data.characterId,
        role: args.data.role,
        content: args.data.content,
        createdAt: new Date()
      };
      mockChatMessages.push(newMsg);
      return newMsg;
    }
  }
};

if (!useMock) {
  try {
    const connectionString = process.env.DATABASE_URL;
    if (process.env.NODE_ENV === 'production') {
      const pool = new Pool({ connectionString });
      const adapter = new PrismaPg(pool);
      prisma = new PrismaClient({ adapter });
    } else {
      const globalWithPrisma = global as typeof globalThis & {
        prisma?: PrismaClient;
        prismaPool?: Pool;
      };
      if (!globalWithPrisma.prisma) {
        const pool = new Pool({ connectionString });
        const adapter = new PrismaPg(pool);
        globalWithPrisma.prismaPool = pool;
        globalWithPrisma.prisma = new PrismaClient({ adapter });
      }
      prisma = globalWithPrisma.prisma;
    }
  } catch (e) {
    console.warn("Prisma failed to initialize, falling back to mock database.", e);
  }
}

export const db = new Proxy({} as any, {
  get(target, prop) {
    if (useMock || !prisma) {
      return (mockDb as any)[prop];
    }
    return (prisma as any)[prop];
  }
}) as unknown as PrismaClient;
