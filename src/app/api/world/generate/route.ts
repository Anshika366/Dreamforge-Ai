import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { text } = await request.json();
    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text content is required' }, { status: 400 });
    }

    const lowerText = text.toLowerCase();
    
    // Default values
    let realmName = "Kingdom of Process";
    let themeDescription = "A highly regulated kingdom of iron and steam, where every path is a flowchart, every action requires a signed permit, and red-tape minotaurs guard the administrative labyrinths.";
    let characters: any[] = [];
    let quests: any[] = [];
    let regions: any[] = [];
    let inventoryItems: any[] = [];
    let boss: any = null;
    let storyChapters: any[] = [];
    let comic: any[] = [];
    let puzzles: any = {};

    // Heuristic analysis
    if (
      lowerText.includes("code") || 
      lowerText.includes("bug") || 
      lowerText.includes("software") || 
      lowerText.includes("program") || 
      lowerText.includes("developer") || 
      lowerText.includes("git") || 
      lowerText.includes("api") || 
      lowerText.includes("database") ||
      lowerText.includes("server")
    ) {
      realmName = "Techoria";
      themeDescription = "A soaring sky-archipelago where coding syntax manifests as elemental magic. The realm is governed by Queen Aurora, who is attempting to safeguard the realm from the Dark Curse and Crystal Core lockouts.";
      
      storyChapters = [
        { chapter: 1, title: "The Authentication Curse", content: "A dark fog rolled over the Login Crypts, casting the Authentication Curse upon the travelers. Queen Aurora called upon Mage Arkon to debug the core protocols." },
        { chapter: 2, title: "The Crystal Core Collapse", content: "A sudden server outage crash shook the archipelago, leading to a Crystal Core Collapse. Mage Arkon descended into the compiler depth tunnels with his legendary Staff of Uptime." },
        { chapter: 3, title: "The Dragon Tax Crisis", content: "With revenues dropping and the Dragon Tax Crisis draining the realm's treasury gold, Queen Aurora launched a secure refactoring spell to purge the Technical Debt Monster." }
      ];

      comic = [
        { panel: 1, type: "Problem", narrative: "The Authentication Curse sweeps across the Login Crypts, freezing traveler login keys.", dialogue: "Queen Aurora: 'Mage Arkon, compile a security patch! The system is locking up!'" },
        { panel: 2, type: "Conflict", narrative: "A menacing void beast, the Technical Debt Monster, rises from legacy code blocks to devour active threads.", dialogue: "Technical Debt Monster: 'I AM THE ACCUMULATION OF UNMERGED BRANCHES!'" },
        { panel: 3, type: "Investigation", narrative: "Arkon scans the stack trace, finding that the Crystal Core Collapse is leaking memory.", dialogue: "Mage Arkon: 'Its stability is failing! We must run a full refactoring spell to fix this database breach!'" },
        { panel: 4, type: "Solution", narrative: "Queen Aurora wields the Refactoring Wand, purging duplicate nodes and optimizing the compiled universe.", dialogue: "Queen Aurora: 'Format: production-ready! Deploy!'" },
        { panel: 5, type: "Ending", narrative: "The dragon tax collector retreats, memory leakages are plugged, and Techoria compiles cleanly.", dialogue: "Mage Arkon: 'System status: 200 OK. Uptime restored to 99.99%.'" }
      ];

      puzzles = {
        puzzles: [
          {
            id: "puz-1",
            title: "The Null Reference Lock",
            description: "The first gate of the escape room is sealed by a floating code fragment. You must find the missing variable reference that is causing a crash.",
            challenge: "Identify the variable that must be instantiated before calling `.processData()` in the sequence: `DataParser parser; parser.processData();`",
            answer: "parser = new DataParser()",
            hint: "You must allocate memory for the parser object before invoking its methods!"
          },
          {
            id: "puz-2",
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
      };

      characters = [
        {
          name: "Queen Aurora",
          fantasyName: "Queen Aurora the Arch-Architect",
          role: "Ruler of the Realm",
          personality: "Strategic, determined, seeking to optimize the kingdom's uptime. Speaks in system specifications.",
          memory: ["Microservices migration history", "Authentication bug", "Strategic sprint roadmap"],
          backstory: "Guided Techoria through the great microservices migration and successfully deployed the first server obelisk.",
          voiceStyle: "Speaks with noble authority, using terms like scalability, architecture, and uptime."
        },
        {
          name: "Mage Arkon",
          fantasyName: "High Mage Arkon of the Core",
          role: "Wizard of Rust",
          personality: "Wise, patient, always checking compilation logs and throwing memory warnings.",
          memory: ["Portal rune registers", "Garbage collection spells", "Crystal core status"],
          backstory: "Hand-carved the first compiler runes to power the kingdom's portals, governing the Stack Overflow Temple.",
          voiceStyle: "Wise, formal, speaking in diagnostics indexes and memory codes."
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
          title: "Lift the Authentication Curse",
          description: "Solve the heap overflow bugs in the login gateways to allow travelers to authenticate safely.",
          reward: "Refactoring Wand"
        },
        {
          title: "Resolve the Crystal Core Collapse",
          description: "Banish the glitch-sprites to restore server uptime stability.",
          reward: "Compiler Shield of Uptime"
        },
        {
          title: "Mediate the Dragon Tax Crisis",
          description: "Optimize the kingdom's economy and transaction rates to offset the revenue drop.",
          reward: "Golden KPI Ledger"
        }
      ];

      regions = [
        { name: "Authentication Crypts (Auth)", description: "Glistening server crystal node tunnels powered by session credentials.", difficulty: "Easy", x: 150, y: 120 },
        { name: "Crystal Core Vault (Infra)", description: "Where raw infrastructure and physical server nodes are beaten into compiler steel.", difficulty: "Medium", x: 320, y: 280 },
        { name: "Revenue Ridge (Deploy)", description: "The high-altitude compiler deployment dome hovering in the cloud network.", difficulty: "Hard", x: 500, y: 150 },
        { name: "Oracle Peaks (Analytics)", description: "Steep peaks where scrying pools analyze data query aggregates.", difficulty: "Medium", x: 280, y: 80 }
      ];

      inventoryItems = [
        { name: "Refactoring Wand", rarity: "Epic", description: "Deletes redundant processes and clears path debris." },
        { name: "Compiler Shield of Uptime", rarity: "Rare", description: "Allows safe bypass of code gate guards without alarms." },
        { name: "Golden KPI Ledger", rarity: "Legendary", description: "A glowing gemstone containing a compiled, executable universe." }
      ];

      boss = {
        name: "Technical Debt Monster",
        title: "The Accumulator of Unfixed Bugs",
        weakness: "Refactoring",
        description: "A terrifying colossal monster composed of legacy spaghetti code, duplicate functions, and unmerged branches."
      };
    } else if (
      lowerText.includes("sale") || 
      lowerText.includes("revenue") || 
      lowerText.includes("finance") || 
      lowerText.includes("money") || 
      lowerText.includes("quarter") || 
      lowerText.includes("customer") ||
      lowerText.includes("budget") ||
      lowerText.includes("profit")
    ) {
      realmName = "Aurum Ridge";
      themeDescription = "A sprawling gold-veined mountain range ruled by financial dragons and accountant wizards, where profit margins dictate the flow of gravity and quarterly audits are conducted with broadswords.";
      
      storyChapters = [
        { chapter: 1, title: "The Ledger Drought", content: "The gold veins in the mountain began drying up as expenses inflated. Chancellor Balin feared bankruptcy for the whole kingdom." },
        { chapter: 2, title: "Auditing the Dragon's Den", content: "Balin set out to inspect the cost-overrun drake's hoard in the deep vaults, battling budget-draining slimes along the way." },
        { chapter: 3, title: "Reversing the Churn", content: "Balin successfully cast a cost-containment spell, locking down expenses and stabilizing the currency value of Aurum Ridge." }
      ];

      comic = [
        { panel: 1, type: "Problem", narrative: "The golden values in the Aurum Ridge vaults begin to fade as overhead costs skyrocket, threatening bankruptcy.", dialogue: "Balin: 'Our quarterly expenses are growing exponentially! The reserves cannot sustain this burn rate!'" },
        { panel: 2, type: "Conflict", narrative: "A gold-devouring beast, the Inflation Behemoth, nests on the vault entrance, eating up the treasury coins.", dialogue: "Behemoth: 'YOUR GOLD WILL DEPRECIATE TO ZERO!'" },
        { panel: 3, type: "Investigation", narrative: "Sir Gareth pitches a deal to local dwarven bankers, collecting financial telemetry to locate tax write-offs.", dialogue: "Gareth: 'We don't need a bailout, we need an audit! There are hidden deductions in our travel expenses!'" },
        { panel: 4, type: "Solution", narrative: "Balin casts a Ledger Audit Spell, exposing tax shelters and cutting duplicate expenditures, which starves the Behemoth.", dialogue: "Balin: 'Exemptions applied! Discretionary funding revoked!'" },
        { panel: 5, type: "Ending", narrative: "The gold returns to its solid, glittering form. Budget lines are balanced, and the Aurum Ridge economy is saved.", dialogue: "Gareth: 'The deal is closed. Return: 15% ROI. Let's record the earnings.'" }
      ];

      puzzles = {
        puzzles: [
          {
            id: "puz-1",
            title: "The Balance Sheet Equation",
            description: "The vault ledger is out of balance. You must solve the basic accounting equation to unlock the treasure drawer.",
            challenge: "If Assets = $500,000 and Owner's Equity = $200,000, what must Liabilities be? (Do not include dollar signs or commas, e.g., 300000)",
            answer: "300000",
            hint: "Assets = Liabilities + Owner's Equity. Subtract Equity from Assets."
          },
          {
            id: "puz-2",
            title: "The Churn Reduction Lock",
            description: "The door is shutting as client retention rates fall. You must enter the correct retention calculation.",
            challenge: "If you started the quarter with 100 customers and lost 5, what is your Customer Retention Rate as a percentage? (Enter only the number, e.g. 95)",
            answer: "95",
            hint: "Subtract the percentage lost from 100."
          }
        ],
        finalBossPuzzle: {
          title: "The Dragon's Audit Decryption",
          description: "Unlock the gold vault by entering the ultimate financial metric representing financial health.",
          challenge: "Decrypt this anagram to find the metric: 'TET EIN MCNOE' (Hint: Revenue minus Expenses)",
          answer: "Net Income",
          hint: "Two words. It is what remains after all costs are paid."
        }
      };

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
      lowerText.includes("marketing") || 
      lowerText.includes("creative") || 
      lowerText.includes("design") || 
      lowerText.includes("brand") || 
      lowerText.includes("campaign") || 
      lowerText.includes("social") ||
      lowerText.includes("content") ||
      lowerText.includes("art")
    ) {
      realmName = "Aetheria of Dreams";
      themeDescription = "A sky-realm of neon clouds and glowing canvases, where thoughts instantly become physical objects and public opinion determines which islands float and which plunge.";
      
      storyChapters = [
        { chapter: 1, title: "The Silenced Slogans", content: "The wind stopped carrying slogans, and the scrying pools went dark. Arch-Druidess Lyra sensed a critical lack of user impressions." },
        { chapter: 2, title: "The Redesign Trial", content: "Pixel-Weaver Kaelen fought off clickbait mimics in the design studio core to restore clean layout margins and visual alignment." },
        { chapter: 3, title: "The Campaign Spell", content: "Lyra cast a massive viral campaign spell across the clouds, flooding scrying pools with engagement and saving the realm." }
      ];

      comic = [
        { panel: 1, type: "Problem", narrative: "Engagement clouds around Aetheria start fading as user impressions hit a historical low, isolating the floating islands.", dialogue: "Lyra: 'We are dropping out of the recommendations! If we don't boost our impressions, our islands will sink!'" },
        { panel: 2, type: "Conflict", narrative: "The Algorithm, a shifting beast of mirrors and weights, shifts the feeds to shadowban Aetheria's broadcasts.", dialogue: "The Algorithm: 'AESTHETIC IS TRIVIAL. COMPLY WITH THE CLICKS.'" },
        { panel: 3, type: "Investigation", narrative: "Kaelen does a UX audit of the main portal, detecting overlapping margins and terrible alignment causing drop-offs.", dialogue: "Kaelen: 'The users aren't ignoring us—they are getting stuck in the sign-up funnel!'" },
        { panel: 4, type: "Solution", narrative: "Lyra releases a viral redesign campaign, while Kaelen repositions margins. Instantly, click-through rates skyrocket.", dialogue: "Lyra: 'Behold! A clean responsive design with high-impact color palettes!'" },
        { panel: 5, type: "Ending", narrative: "Aetheria's neon clouds burn bright again. Conversion reaches 100%, and the sky islands float higher than ever.", dialogue: "Kaelen: 'Everything is perfectly aligned. Rest easy, design templates.'" }
      ];

      puzzles = {
        puzzles: [
          {
            id: "puz-1",
            title: "The Grid Alignment Lock",
            description: "The UI grid layout is broken, locking the designer's chest. You must align the template.",
            challenge: "Which CSS property is used to align flex items along the main axis? (e.g., justify-content, align-items)",
            answer: "justify-content",
            hint: "It aligns items horizontally in a row-oriented flex container."
          },
          {
            id: "puz-2",
            title: "The Click-Through Calculation",
            description: "The advertising portal needs a conversion rate calibration.",
            challenge: "If a campaign receives 1000 impressions and yields 50 clicks, what is the Click-Through Rate (CTR) as a percentage? (Enter number only, e.g. 5)",
            answer: "5",
            hint: "Clicks divided by Impressions multiplied by 100."
          }
        ],
        finalBossPuzzle: {
          title: "The Ultimate Creative Motto",
          description: "Unlock the final canvas by entering the standard placeholder text used in typography design.",
          challenge: "What is the first two words of the traditional placeholder text beginning with 'Lorem...'?",
          answer: "Lorem Ipsum",
          hint: "It's the classic Latin dummy text used by designers."
        }
      };

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
      storyChapters = [
        { chapter: 1, title: "The Red-Tape Bottleneck", content: "Forms piled high in the registry as the administrative minotaurs refused passage, bottlenecking the cargo paths." },
        { chapter: 2, title: "Logistics in the Mud", content: "Dwarf Hadrin fought to clear the carriage pathways of slimes, optimizing supply routes through the thick mud." },
        { chapter: 3, title: "SOP Restored", content: "High Chancellor Reginald signed the standard operating procedures, resetting the flowchart and restoring order to the kingdom." }
      ];

      comic = [
        { panel: 1, type: "Problem", narrative: "Piles of unsigned paperwork form giant walls in the Registry Labyrinth, causing supply wagons to grind to a halt.", dialogue: "Reginald: 'This is an unauthorized delay! We must route these forms through channels immediately!'" },
        { panel: 2, type: "Conflict", narrative: "Bureaucracy, the Red-Tape Hydra, blocks the main gate, breathing compliance audits and demanding receipts.", dialogue: "Hydra: 'YOU LACK THE TRIPLICATE SIGNS! REJECTED!'" },
        { panel: 3, type: "Investigation", narrative: "Hadrin traces the bottleneck paths, finding that a single rogue slime is holding up the stamps in sector 4.", dialogue: "Hadrin: 'If we bypass the sub-committee step, we can clear this backlog in half the time!'" },
        { panel: 4, type: "Solution", narrative: "Reginald signs a Compliance Waiver, while Hadrin slays the bottleneck slime, automating the stamp processing.", dialogue: "Reginald: 'Triplicate audit bypassed! Approval granted!'" },
        { panel: 5, type: "Ending", narrative: "Wagons stream through the gates, gears start turning, and operations return to maximum efficiency.", dialogue: "Hadrin: 'Caravans moving. Efficiency up 40%. Keep the logs updated.'" }
      ];

      puzzles = {
        puzzles: [
          {
            id: "puz-1",
            title: "The Bottleneck Path Lock",
            description: "The shipping dock gate is blocked by a cargo schedule bottleneck.",
            challenge: "In a pipeline of tasks where step A takes 5 mins, step B (bottleneck) takes 20 mins, and step C takes 5 mins, what is the maximum throughput rate in units per hour? (Enter number)",
            answer: "3",
            hint: "Throughput is limited by the bottleneck step (20 mins per unit). How many units can pass in 60 mins?"
          },
          {
            id: "puz-2",
            title: "The Form Triplicate Code",
            description: "Enter the required document department code to authorize the shipment.",
            challenge: "Which standard operations acronym refers to a detailed step-by-step description of how to perform a routine activity? (Hint: 3 letters)",
            answer: "SOP",
            hint: "Standard Operating Procedure."
          }
        ],
        finalBossPuzzle: {
          title: "The Master Blueprint Lock",
          description: "Enter the name of the popular visual representation of a process sequence involving shapes and arrows.",
          challenge: "Spell the 9-letter word for a diagram of the sequence of movements or actions of people or things involved in a complex system.",
          answer: "flowchart",
          hint: "Starts with 'f' and ends with 't'. It has boxes and diamonds connected by arrows."
        }
      };

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

    // Save this new world to DB
    const newWorld = await db.world.create({
      data: {
        title: realmName,
        lore: themeDescription,
        story: storyChapters,
        comic: comic,
        puzzles: puzzles,
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
      }
    });

    // Fetch details to get IDs
    const createdWorld = await db.world.findUnique({
      where: { id: newWorld.id },
      include: { characters: true, regions: true, quests: true, bosses: true, inventoryItems: true }
    });

    if (!createdWorld) {
      throw new Error("Failed to create and verify new world.");
    }

    const firstRegId = createdWorld.regions[0]?.id || "";
    const firstCharId = createdWorld.characters[0]?.id || "";

    // Establish the initial Progress record
    const progress = await db.worldProgress.create({
      data: {
        worldId: newWorld.id,
        completedQuests: [],
        unlockedRegions: firstRegId ? [firstRegId] : [],
        discoveredCharacters: firstCharId ? [firstCharId] : [],
        playerInventory: []
      }
    });

    // Return the response matching the requested API format
    return NextResponse.json({
      world: {
        id: createdWorld.id,
        title: createdWorld.title,
        lore: createdWorld.lore,
        story: createdWorld.story,
        comic: createdWorld.comic,
        puzzles: createdWorld.puzzles,
        createdAt: createdWorld.createdAt
      },
      characters: createdWorld.characters,
      quests: createdWorld.quests,
      regions: createdWorld.regions,
      inventoryItems: createdWorld.inventoryItems,
      boss: createdWorld.bosses[0] || null,
      progress: progress
    });

  } catch (error: any) {
    console.error("Error generating world:", error);
    return NextResponse.json({ error: error.message || "Failed to generate world" }, { status: 500 });
  }
}
