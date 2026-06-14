import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ error: 'World ID is required' }, { status: 400 });
    }

    // Fetch the existing world to get title and description/lore
    const world = await db.world.findUnique({
      where: { id },
      include: {
        characters: true,
        quests: true,
        regions: true,
        inventoryItems: true,
        bosses: true,
        progress: true
      }
    });

    if (!world) {
      return NextResponse.json({ error: 'World not found' }, { status: 404 });
    }

    const titleText = world.title.toLowerCase();
    const loreText = world.lore.toLowerCase();
    const combinedText = `${titleText} ${loreText}`;

    // Re-run heuristics based on original text content
    let realmName = world.title;
    let themeDescription = world.lore;
    let characters = [];
    let quests = [];
    let regions = [];
    let inventoryItems = [];
    let boss = null;
    let storyChapters = [];

    if (
      combinedText.includes("code") || 
      combinedText.includes("bug") || 
      combinedText.includes("software") || 
      combinedText.includes("program") || 
      combinedText.includes("developer") || 
      combinedText.includes("git") || 
      combinedText.includes("api") || 
      combinedText.includes("database") ||
      combinedText.includes("server") ||
      combinedText.includes("techoria")
    ) {
      realmName = "Techoria";
      themeDescription = "A soaring sky-archipelago where coding syntax manifests as elemental magic. Floating stacks of memory hover over dark server chasms, and compiling errors materialize as wild glitch-sprites.";
      
      storyChapters = [
        { chapter: 1, title: "The Blue Screen Eclipse [V2]", content: "The sky turned cold and neon blue as the stack overflow temple began leaking memory daemon spirits. Archmage Jonas recognized the signs of an impending crash." },
        { chapter: 2, title: "Debugging the Underworld [V2]", content: "Armed with his debugger tome, Archmage Jonas descended into the compiler depths, dodging glitch-sprites to bypass the boundary exceptions." },
        { chapter: 3, title: "The Garbage Collector's Staff [V2]", content: "With a final swipe of his legendary staff, Jonas purged the memory leaks and compiled a clean universe, restoring harmony to Techoria." }
      ];

      characters = [
        {
          name: "Lead Engineer",
          fantasyName: "Grand Archmage Jonas the Compiler",
          role: "Wizard of Rust",
          personality: "Obsessive about code syntax, speaks in compiler error warnings, and wields the Staff of Garbage Collection.",
          memory: ["Launch project history", "Authentication bug", "Deployment plan"],
          backstory: "Once a simple scribe who learned to weave compiler runes, he now governs the Floating Stack Overflow Temple.",
          voiceStyle: "Speaks with formal precision, quoting line numbers and throwing exceptions."
        },
        {
          name: "Project Manager",
          fantasyName: "Scrum Master Vaelor",
          role: "Agile Timekeeper",
          personality: "Always holding an hourglass, setting sprint goals for the party, and trying to estimate mana costs in story points.",
          memory: ["Backlog details", "Sprint timeline", "Velocity chart metrics"],
          backstory: "Appointed by the High Council to manage adventure deliverables and ensure heroes stay on-schedule.",
          voiceStyle: "Always talks in sprint terms, estimating time and planning daily updates."
        },
        {
          name: "QA Specialist",
          fantasyName: "Tracker Elara the Bug-Hunter",
          role: "Rogue Sentry",
          personality: "Sharp-eyed, quiet, loves to break things just to see how they work, and carries a pouch of glitch-repelling salt.",
          memory: ["Regression checklist", "Boundary check exceptions", "Glitch nesting grounds"],
          backstory: "Trained in the outer digital deserts to spot irregularities and exceptions before they manifest as monsters.",
          voiceStyle: "Skeptical, brief, details edge-case risks."
        }
      ];

      quests = [
        {
          title: "The Great Memory Leak",
          description: "Cleanse the Floating Stack Overflow Temple of the memory-eating daemon before it consumes the realm's active memory banks.",
          reward: "Garbage Collector Staff"
        },
        {
          title: "The Git Merge Conflict",
          description: "Mediate a dispute between two rival developer factions whose branches have diverged so severely that the fabric of reality is tearing.",
          reward: "Ring of Silent Commits"
        },
        {
          title: "Reboot the World Router",
          description: "Ascend to the highest peak in the cloud layer and power cycle the Router Obelisk to restore connection.",
          reward: "Deployment Crystal"
        }
      ];

      regions = [
        { name: "Crystal Caves (Auth)", description: "Glistening server crystal node tunnels powered by session credentials.", difficulty: "Easy", x: 150, y: 120 },
        { name: "Titan Forge (Infra)", description: "Where raw infrastructure and physical server nodes are beaten into compiler steel.", difficulty: "Medium", x: 320, y: 280 },
        { name: "Sky Fortress (Deploy)", description: "The high-altitude compiler deployment dome hovering in the cloud network.", difficulty: "Hard", x: 500, y: 150 },
        { name: "Oracle Peaks (Analytics)", description: "Steep peaks where scrying pools analyze data query aggregates.", difficulty: "Medium", x: 280, y: 80 }
      ];

      inventoryItems = [
        { name: "Staff of Garbage Collection", rarity: "Epic", description: "Deletes redundant processes and clears path debris." },
        { name: "Ring of Silent Commits", rarity: "Rare", description: "Allows safe bypass of code gate guards without alarms." },
        { name: "Deployment Crystal", rarity: "Legendary", description: "A glowing gemstone containing a compiled, executable universe." }
      ];

      boss = {
        name: "Omni Glitch, the Stack-Overflow",
        title: "The Lord of Broken Pointers",
        weakness: "Garbage Collection",
        description: "A terrifying colossal monster composed of blue-screen static, infinite loops, and red compiler error highlights."
      };
    } else if (
      combinedText.includes("sale") || 
      combinedText.includes("revenue") || 
      combinedText.includes("finance") || 
      combinedText.includes("money") || 
      combinedText.includes("quarter") || 
      combinedText.includes("customer") ||
      combinedText.includes("budget") ||
      combinedText.includes("profit") ||
      combinedText.includes("aurum")
    ) {
      realmName = "Aurum Ridge";
      themeDescription = "A sprawling gold-veined mountain range ruled by financial dragons and accountant wizards, where profit margins dictate the flow of gravity and quarterly audits are conducted with broadswords.";
      
      storyChapters = [
        { chapter: 1, title: "The Ledger Drought [V2]", content: "The gold veins in the mountain began drying up as expenses inflated. Chancellor Balin feared bankruptcy for the whole kingdom." },
        { chapter: 2, title: "Auditing the Dragon's Den [V2]", content: "Balin set out to inspect the cost-overrun drake's hoard in the deep vaults, battling budget-draining slimes along the way." },
        { chapter: 3, title: "Reversing the Churn [V2]", content: "Balin successfully cast a cost-containment spell, locking down expenses and stabilizing the currency value of Aurum Ridge." }
      ];

      characters = [
        {
          name: "Sales Executive",
          fantasyName: "Sir Gareth Gold-Tongue",
          role: "Bard of the Deal",
          personality: "Extremely charming, wearing heavy gold-lined velvet. Speaks entirely in pitch deck terminology.",
          memory: ["Pitch deck targets", "Client conversion metrics", "Lead contact directory"],
          backstory: "Rose from a tavern singer to the chief negotiator of the Merchant Guild, closing deals with high-tier lords.",
          voiceStyle: "Charismatic, salesy, uses buzzwords and enthusiastic pitches."
        },
        {
          name: "Chief Financial Officer",
          fantasyName: "Alchemist Balin the Auditor",
          role: "Gold Dragon Accountant",
          personality: "Speaks with absolute mathematical precision, hoards spreadsheets in scroll form, and can turn copper into high-interest investments.",
          memory: ["Quarterly expense ledger", "Dragon-gold reserve status", "Corporate tax exemptions"],
          backstory: "A long-lived dragon who prefers ledger auditing to physical gold hoarding, keeping the guild treasury safe.",
          voiceStyle: "Analytical, dry, cites numbers, tax clauses, and percentages."
        },
        {
          name: "Customer Support Manager",
          fantasyName: "Shield-maiden Freya of the Frontline",
          role: "Guardian of Relations",
          personality: "Patient but unyielding, wears runic armor designed to absorb negative energy, and carries a mace of ticketing.",
          memory: ["Customer retention stats", "Complaint tickets database", "Loyalty spell formulas"],
          backstory: "A defender who protects merchants from disgruntled clients and resolves disputes with diplomatic shields.",
          voiceStyle: "Patient, polite, uses conflict resolution phrasing."
        }
      ];

      quests = [
        {
          title: "Slay the Cost-Overrun Drake",
          description: "Hunt down the greedy crimson drake nesting in the treasury that has been inflating quarterly expenses with its fire-breath.",
          reward: "Ledger of Tax Exemption"
        },
        {
          title: "The Churn Rate Ritual",
          description: "Banish the Churn Spirit that has been whisking customers away to competitor kingdoms by casting a Customer Retention Spell.",
          reward: "Amulet of Customer Loyalty"
        },
        {
          title: "Secure the Seed Round",
          description: "Convince the Council of Venture Angel-Kings to invest their dragon-gold in the kingdom's new floating harvest airships.",
          reward: "Platinum Venture Scroll"
        }
      ];

      regions = [
        { name: "Tax Haven Dungeon (Auth)", description: "A labyrinth of vaults locked behind secure digital accounting keys.", difficulty: "Easy", x: 150, y: 120 },
        { name: "Audit Mines (Infra)", description: "High-yield gold mines where workers shovel coins into massive spreadsheets.", difficulty: "Medium", x: 320, y: 280 },
        { name: "Venture Capital Tower (Deploy)", description: "A soaring tower of solid platinum where seed rounds are blessed by angel kings.", difficulty: "Hard", x: 500, y: 150 },
        { name: "Ledger Peaks (Analytics)", description: "High cliffs where ledger scroll graphs project future yield rates.", difficulty: "Medium", x: 280, y: 80 }
      ];

      inventoryItems = [
        { name: "Ledger of Tax Exemption", rarity: "Epic", description: "Shields you from expense increases and legal audits." },
        { name: "Amulet of Customer Loyalty", rarity: "Rare", description: "Binds merchant prices to a permanent discount rate." },
        { name: "Platinum Venture Scroll", rarity: "Legendary", description: "A contract signed by Venture Angel-Kings granting infinite backing." }
      ];

      boss = {
        name: "Inflation, the Gold-Eating Behemoth",
        title: "Devourer of Reserves",
        weakness: "Tax Auditing",
        description: "A colossal void beast that eats gold coins, causing the value of your currency to plummet."
      };
    } else if (
      combinedText.includes("marketing") || 
      combinedText.includes("creative") || 
      combinedText.includes("design") || 
      combinedText.includes("brand") || 
      combinedText.includes("campaign") || 
      combinedText.includes("social") ||
      combinedText.includes("content") ||
      combinedText.includes("art") ||
      combinedText.includes("aetheria")
    ) {
      realmName = "Aetheria of Dreams";
      themeDescription = "A sky-realm of neon clouds and glowing canvases, where thoughts instantly become physical objects and public opinion determines which islands float and which plunge.";
      
      storyChapters = [
        { chapter: 1, title: "The Silenced Slogans [V2]", content: "The wind stopped carrying slogans, and the scrying pools went dark. Arch-Druidess Lyra sensed a critical lack of user impressions." },
        { chapter: 2, title: "The Redesign Trial [V2]", content: "Pixel-Weaver Kaelen fought off clickbait mimics in the design studio core to restore clean layout margins and visual alignment." },
        { chapter: 3, title: "The Campaign Spell [V2]", content: "Lyra cast a massive viral campaign spell across the clouds, flooding scrying pools with engagement and saving the realm." }
      ];

      characters = [
        {
          name: "Marketing Lead",
          fantasyName: "Arch-Druidess Lyra of the Loudspeaker",
          role: "Viral Spellcaster",
          personality: "Always speaking in headlines, dressing in flashy peacock feathers, and aiming to make every spell go viral across scrying-pools.",
          memory: ["Campaign slogans", "Viral spread rates", "Public scrying directories"],
          backstory: "Harnessed the power of the social winds to project messages across kingdoms, creating instant trends.",
          voiceStyle: "Excited, loud, speaks in slogans and catchy headlines."
        },
        {
          name: "UX/UI Designer",
          fantasyName: "Pixel-Weaver Kaelen",
          role: "Aesthetic Shaper",
          personality: "Obsessive about color palettes and alignment, wears glass lenses that show gridlines, and hates poorly formatted spell scrolls.",
          memory: ["Color scheme palettes", "Margin grid guidelines", "Aesthetic feedback logs"],
          backstory: "Wears enchanted spectacles that align elements in physical space. Spends days tweaking scroll borders.",
          voiceStyle: "Particular, detail-focused, complains about bad formatting and spacing."
        },
        {
          name: "Content Writer",
          fantasyName: "Scribe Thomas the Word-Smith",
          role: "Lore Spinner",
          personality: "Caffeinated, carrying a quill of infinite ink, writes dramatic stories about mundane items to increase engagement.",
          memory: ["Trending tags list", "Ballad draft ideas", "Audience review records"],
          backstory: "Known for writing stories so compelling that they conjure physical objects out of thin air.",
          voiceStyle: "Chatty, descriptive, uses adjectives and metaphors."
        }
      ];

      quests = [
        {
          title: "The Engagement Drought",
          description: "Investigate why the magical beacon of social interactions is dimming and rejuvenate it with a viral campaign spell.",
          reward: "Cloak of Influence"
        },
        {
          title: "Redesign the Castle Portal",
          description: "Redraw the user flow portal to the royal treasury so peasants don't get lost and abandon their carts halfway.",
          reward: "Stylus of Divine Pixels"
        },
        {
          title: "Exorcise the Clickbait Mimic",
          description: "Hunt the clickbait mimics that lure travelers into dangerous traps with sensational signs.",
          reward: "Clickbait Net"
        }
      ];

      regions = [
        { name: "Focus Group Crypts (Auth)", description: "Crypts where users must complete survey spells to gain authorization.", difficulty: "Easy", x: 150, y: 120 },
        { name: "Design Studio (Infra)", description: "Neon workshops where layouts are painted directly into the atmosphere.", difficulty: "Medium", x: 320, y: 280 },
        { name: "Viral Summit (Deploy)", description: "The highest floating peak where new slogans are shouted into the ether.", difficulty: "Hard", x: 500, y: 150 },
        { name: "Analytics Prism (Analytics)", description: "A floating prism mapping click-through impressions as streaks of light.", difficulty: "Medium", x: 280, y: 80 }
      ];

      inventoryItems = [
        { name: "Stylus of Divine Pixels", rarity: "Epic", description: "Enables you to redraw visual borders and bypass lock-doors." },
        { name: "Cloak of Influence", rarity: "Rare", description: "Increases charisma, making merchants friendly and trade cheaper." },
        { name: "Clickbait Net", rarity: "Common", description: "A net used to trap clickbait mimics and harness raw attention." }
      ];

      boss = {
        name: "The Algorithm, Lord of Attention",
        title: "The Shifting Mirror",
        weakness: "Aesthetic Design",
        description: "A shifting geometric structure of gears and mirrors that alters reality trends on a whim."
      };
    } else {
      // Fallback: Kingdom of Process
      realmName = "Kingdom of Process";
      themeDescription = "A highly regulated kingdom of iron and steam, where every path is a flowchart, every action requires a signed permit, and red-tape minotaurs guard the administrative labyrinths.";
      
      storyChapters = [
        { chapter: 1, title: "The Red-Tape Bottleneck [V2]", content: "Forms piled high in the registry as the administrative minotaurs refused passage, bottlenecking the cargo paths." },
        { chapter: 2, title: "Logistics in the Mud [V2]", content: "Dwarf Hadrin fought to clear the carriage pathways of slimes, optimizing supply routes through the thick mud." },
        { chapter: 3, title: "SOP Restored [V2]", content: "High Chancellor Reginald signed the standard operating procedures, resetting the flowchart and restoring order to the kingdom." }
      ];

      characters = [
        {
          name: "Operations Director",
          fantasyName: "High Chancellor Reginald of the Flow",
          role: "Master of Workflows",
          personality: "Demands strict adherence to standard operating procedures, wears a golden stopwatch, and loves efficiency diagrams.",
          memory: ["SOP regulations", "Flowchart guidelines", "Timekeeping logs"],
          backstory: "Appointed to audit all activities. Refuses to enter any dungeon without a signed quest form in triplicate.",
          voiceStyle: "Bureaucratic, rule-abiding, dry, demands forms."
        },
        {
          name: "Human Resources Lead",
          fantasyName: "Arbitrator Elena the Harmonizer",
          role: "Elven Mediator",
          personality: "Calm, soft-spoken, specializes in dispute resolution and team-building runes.",
          memory: ["Resolution handbooks", "Conflict runes formula", "Team feedback notes"],
          backstory: "Negotiated peace between the elven rangers and the mountain giants using standard guild policy guides.",
          voiceStyle: "Calm, polite, therapeutic, focused on teamwork and feedback."
        },
        {
          name: "Logistics Manager",
          fantasyName: "Guildmaster Hadrin the Pack-Master",
          role: "Dwarven Supply Warden",
          personality: "Pragmatic, gruff, and manages supply carriages with mathematical precision.",
          memory: ["Carriage weight inventory", "Supply route coordinates", "Goblin threat levels"],
          backstory: "Spent forty years defending supply wagons from trolls. Knows every carriage route in the kingdom.",
          voiceStyle: "Gruff, practical, complains about delay costs and bad weather."
        }
      ];

      quests = [
        {
          title: "Untangle the Red-Tape Labyrinth",
          description: "Navigate the deep administrative dungeons of the palace to get the Grand Chancellor's signature on a questing license in triplicate.",
          reward: "Certificate of Compliance"
        },
        {
          title: "The Supply Chain Ambush",
          description: "Rescue a caravan of iron gears and parchment scrolls from mountain bandits before operations halt at the guild factories.",
          reward: "Logistics Boots"
        },
        {
          title: "Exterminate the Overhead Slime",
          description: "Clear out the overhead slimes that are slowly draining resources from the local guild hall without adding any visible value.",
          reward: "Sandglass of Efficiency"
        }
      ];

      regions = [
        { name: "Registry Labyrinth (Auth)", description: "Labyrinth where signed permissions are verified to pass guards.", difficulty: "Easy", x: 150, y: 120 },
        { name: "Steam Assembly (Infra)", description: "Giant iron factories hammering out clockwork workflows.", difficulty: "Medium", x: 320, y: 280 },
        { name: "Dispatch Arch (Deploy)", description: "Steam-rail terminal where completed processes are launched.", difficulty: "Hard", x: 500, y: 150 },
        { name: "Flowchart Cliffs (Analytics)", description: "Steep slate cliffs carved with flowcharts tracking kingdom efficiency.", difficulty: "Medium", x: 280, y: 80 }
      ];

      inventoryItems = [
        { name: "Certificate of Compliance", rarity: "Epic", description: "Allows you to bypass process locks without signed forms." },
        { name: "Logistics Boots", rarity: "Rare", description: "Dwarven steel boots that increase speed in muddy areas." },
        { name: "Sandglass of Efficiency", rarity: "Legendary", description: "Speeds up wait times and shortens task cooldowns." }
      ];

      boss = {
        name: "Bureaucracy, the Red-Tape Hydra",
        title: "Warden of the Archives",
        weakness: "Compliance Certificates",
        description: "A massive dragon draped in paper forms and iron chains. Slaying one head only causes two new forms to be filled out."
      };
    }

    // Wipe child rows (Prisma handles onDelete: Cascade where applicable, but we clean them explicitly or let cascade handle it)
    // Characters, Quests, Regions, InventoryItems, Bosses, WorldProgress will be deleted by Cascade relation.
    // However, we can perform explicit cleanup if needed. Here, let's update the world details.
    
    // Update the parent world title, lore, and story
    await db.world.update({
      where: { id },
      data: {
        title: realmName,
        lore: themeDescription,
        story: storyChapters,
        // Wipe children and create new ones (for Prisma, we delete previous characters first, or update)
        characters: { deleteMany: {} },
        quests: { deleteMany: {} },
        regions: { deleteMany: {} },
        inventoryItems: { deleteMany: {} },
        bosses: { deleteMany: {} }
      }
    });

    // Re-create the sub-elements
    const updatedWorld = await db.world.update({
      where: { id },
      data: {
        characters: {
          create: characters.map(c => ({
            name: c.name,
            fantasyName: c.fantasyName,
            role: c.role,
            personality: c.personality,
            memory: c.memory,
            backstory: c.backstory,
            voiceStyle: c.voiceStyle
          }))
        },
        quests: {
          create: quests
        },
        regions: {
          create: regions
        },
        inventoryItems: {
          create: inventoryItems
        },
        bosses: {
          create: [boss]
        }
      },
      include: {
        characters: true,
        regions: true,
        quests: true,
        inventoryItems: true,
        bosses: true,
        progress: true
      }
    });

    const firstRegId = updatedWorld.regions[0]?.id || "";
    const firstCharId = updatedWorld.characters[0]?.id || "";

    // Reset progress
    let progress;
    if (updatedWorld.progress) {
      progress = await db.worldProgress.update({
        where: { worldId: id },
        data: {
          completedQuests: [],
          unlockedRegions: firstRegId ? [firstRegId] : [],
          discoveredCharacters: firstCharId ? [firstCharId] : []
        }
      });
    } else {
      progress = await db.worldProgress.create({
        data: {
          worldId: id,
          completedQuests: [],
          unlockedRegions: firstRegId ? [firstRegId] : [],
          discoveredCharacters: firstCharId ? [firstCharId] : []
        }
      });
    }

    return NextResponse.json({
      world: {
        id: updatedWorld.id,
        title: updatedWorld.title,
        lore: updatedWorld.lore,
        story: updatedWorld.story,
        createdAt: updatedWorld.createdAt
      },
      characters: updatedWorld.characters,
      quests: updatedWorld.quests,
      regions: updatedWorld.regions,
      inventoryItems: updatedWorld.inventoryItems,
      boss: updatedWorld.bosses[0] || null,
      progress: progress
    });

  } catch (error: any) {
    console.error("Error regenerating world:", error);
    return NextResponse.json({ error: error.message || "Failed to regenerate world" }, { status: 500 });
  }
}
