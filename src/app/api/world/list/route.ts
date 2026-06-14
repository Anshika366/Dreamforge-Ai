import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // Check if database has any worlds. If it's a real empty database, auto-seed the sample worlds.
    const initialWorlds = await db.world.findMany();
    if (initialWorlds.length === 0) {
      console.log("Database is empty. Seeding required sample worlds...");
      
      // 1. Seed Techoria
      await db.world.create({
        data: {
          title: 'Techoria',
          lore: JSON.stringify({
            description: 'A sprawling technological wonderland where coding syntax manifests as elemental magic and servers serve as massive ancient temples. Floating stacks of code hover in the air, and programmers are wizards who debug structural anomalies using legendary compilers.',
            boss: {
              name: "Omni Glitch, the Stack-Overflow",
              description: "A terrifying colossal monster composed of blue-screen static, infinite loops, and red compiler error highlights.",
              hp: 2500,
              abilities: ["Infinite Recursive Loop", "Blue Screen of Despair", "Memory Dump Wave"]
            },
            mapUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=60"
          }),
          characters: {
            create: [
              {
                name: "Lead Developer",
                fantasyName: "Archmage Jonas the Compiler",
                role: "Wizard of Rust",
                personality: "Obsessive about code syntax, constantly debugging his spellbook, speaks in cryptic code templates and drinks strictly caffeinated mana potions."
              }
            ]
          },
          quests: {
            create: [
              {
                title: "The Great Memory Leak",
                description: "Cleanse the Floating Stack Overflow Temple of the memory-eating daemon before it consumes the world memory reserves.",
                reward: "Garbage Collector Staff (+15 Debugging)"
              }
            ]
          }
        }
      });

      // 2. Seed Kingdom of Innovation
      await db.world.create({
        data: {
          title: 'Kingdom of Innovation',
          lore: JSON.stringify({
            description: 'An empire built upon floating gears, clockwork automation, and steam-driven airships. In this realm, innovators are noble knights, patents are sacred scriptures, and the ultimate quest is to discover the infinite energy core.',
            boss: {
              name: "The Boiler Overlord",
              description: "A gigantic mechanical beast that vents high-pressure steam and shoots heat-seeking brass gears.",
              hp: 2000,
              abilities: ["High-Pressure Steam Blast", "Clockwork Crush", "Overheat Vents"]
            },
            mapUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=60"
          }),
          characters: {
            create: [
              {
                name: "Operations Manager",
                fantasyName: "Lady Gearsmith Sarah",
                role: "Steam-Airship Captain",
                personality: "Brave, highly analytical, always tinkering with steam-powered gears, and believes that efficiency is the highest honor."
              }
            ]
          },
          quests: {
            create: [
              {
                title: "Assemble the Oracle Engine",
                description: "Retrieve three mythical golden steam valves from the automated mines to power the mechanical oracle and receive the Patent of Destiny.",
                reward: "Steam Jetpack and 500 Gold Guilders"
              }
            ]
          }
        }
      });

      // 3. Seed Cyber Realm
      await db.world.create({
        data: {
          title: 'Cyber Realm',
          lore: JSON.stringify({
            description: 'A neon-drenched dystopia where artificial spirits govern vast data networks. Cybernetic heroes fight for digital freedom against greedy conglomerates, hacking their way through mainframe nodes with light-up plasma blades.',
            boss: {
              name: "Net-Phantom Overlord",
              description: "A digital apparition that manipulates bandwidth speeds and corrupts memory frames.",
              hp: 2200,
              abilities: ["Bandwidth Throttle", "Memory Corruption Spike", "Glitch Proxy Summon"]
            },
            mapUrl: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&auto=format&fit=crop&q=60"
          }),
          characters: {
            create: [
              {
                name: "Security Officer",
                fantasyName: "Byte-Blade Ronin Alex",
                role: "Netrunner Ronin",
                personality: "Cynical, fast-talking, lives on the network fringe, and wields a plasma saber that slicing through firewall projections."
              }
            ]
          },
          quests: {
            create: [
              {
                title: "Hack the Mainframe Core",
                description: "Infiltrate the Megacorp digital vault and bypass five security nodes to copy the ancient open-source blueprints of creation.",
                reward: "Root Access Admin Keycard"
              }
            ]
          }
        }
      });
    }

    const worlds = await db.world.findMany({
      include: {
        characters: true,
        quests: true
      }
    });

    // Parse the lore column back into structured objects if applicable
    const parsedWorlds = worlds.map(w => {
      let description = w.lore;
      let boss = null;
      let mapUrl = "";
      
      try {
        if (w.lore.startsWith('{')) {
          const parsed = JSON.parse(w.lore);
          description = parsed.description;
          boss = parsed.boss;
          mapUrl = parsed.mapUrl;
        }
      } catch (e) {
        // Fallback if lore is plain text
      }

      return {
        id: w.id,
        title: w.title,
        lore: description,
        createdAt: w.createdAt,
        characters: w.characters,
        quests: w.quests,
        boss: boss || {
          name: "The Chaos Overlord",
          description: "A dark entity composed of unformatted logs and broken dreams.",
          hp: 1200,
          abilities: ["Syntax Screamer", "Stack Overflow Blast"]
        },
        mapUrl: mapUrl || "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=60"
      };
    });

    return NextResponse.json(parsedWorlds);
  } catch (error: any) {
    console.error("Error listing worlds:", error);
    return NextResponse.json({ error: error.message || "Failed to list worlds" }, { status: 500 });
  }
}
