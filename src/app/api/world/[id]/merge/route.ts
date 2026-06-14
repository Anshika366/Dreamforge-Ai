import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { source, payload } = await request.json();

    if (!id || !source || !payload) {
      return NextResponse.json({ error: 'World ID, merge source, and payload are required' }, { status: 400 });
    }

    const world = await db.world.findUnique({
      where: { id }
    });

    if (!world) {
      return NextResponse.json({ error: 'World not found' }, { status: 404 });
    }

    if (source === 'workiq') {
      // Merge characters
      if (payload.characters && Array.isArray(payload.characters)) {
        for (const char of payload.characters) {
          await db.character.create({
            data: {
              worldId: id,
              name: char.name || "Enterprise NPC",
              fantasyName: char.fantasyName || "Mage of Work",
              role: char.role || "Consultant",
              personality: char.personality || "Diligent worker.",
              memory: char.memory || [],
              backstory: char.backstory || "",
              voiceStyle: char.voiceStyle || ""
            }
          });
        }
      }

      // Merge quests
      if (payload.quests && Array.isArray(payload.quests)) {
        for (const q of payload.quests) {
          await db.quest.create({
            data: {
              worldId: id,
              title: q.title,
              description: q.description,
              reward: q.reward
            }
          });
        }
      }

      // Save relationship mappings to the progress record
      const progress = await db.worldProgress.findUnique({
        where: { worldId: id }
      });
      if (progress && payload.relationships) {
        // We can append relationships to discoveredCharacters or completedQuests or just save it
        // To be simple, let's update progress with relationships or print it in logs
      }

    } else if (source === 'foundryiq') {
      // Merge facts and timeline into World lore or story
      const existingLore = world.lore;
      const timelineStr = payload.timeline ? `\n\n[World Timeline]:\n${payload.timeline.map((t: any) => `- ${t.year}: ${t.event}`).join('\n')}` : '';
      const factsStr = payload.facts ? `\n\n[Foundry Facts]:\n${payload.facts.map((f: string) => `- ${f}`).join('\n')}` : '';
      
      await db.world.update({
        where: { id },
        data: {
          lore: `${existingLore}${timelineStr}${factsStr}`
        }
      });

    } else if (source === 'fabriciq') {
      // Merge fabric events and mechanics into puzzles JSON field
      let existingPuzzles: any = world.puzzles || {};
      if (typeof existingPuzzles === 'string') {
        try {
          existingPuzzles = JSON.parse(existingPuzzles);
        } catch(e) {
          existingPuzzles = {};
        }
      }

      const updatedPuzzles = {
        ...existingPuzzles,
        fabricMechanics: payload.mechanics,
        fabricEvents: payload.events
      };

      await db.world.update({
        where: { id },
        data: {
          puzzles: updatedPuzzles
        }
      });
    } else if (source === 'mcp') {
      // MCP full world overwrite / merge
      if (payload.title) {
        await db.world.update({
          where: { id },
          data: {
            title: payload.title,
            lore: payload.lore,
            story: payload.story
          }
        });
      }
    } else {
      return NextResponse.json({ error: 'Unsupported merge source' }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: `Successfully merged data from ${source} into the realm.` });

  } catch (error: any) {
    console.error("Error merging integration payload:", error);
    return NextResponse.json({ error: error.message || "Failed to merge data" }, { status: 500 });
  }
}
