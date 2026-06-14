import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { completedQuests, unlockedRegions, discoveredCharacters, playerInventory } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'World ID is required' }, { status: 400 });
    }

    // Upsert or update progress
    let progress = await db.worldProgress.findUnique({
      where: { worldId: id }
    });

    if (progress) {
      progress = await db.worldProgress.update({
        where: { worldId: id },
        data: {
          completedQuests: completedQuests ?? progress.completedQuests,
          unlockedRegions: unlockedRegions ?? progress.unlockedRegions,
          discoveredCharacters: discoveredCharacters ?? progress.discoveredCharacters,
          playerInventory: playerInventory ?? (progress as any).playerInventory
        }
      });
    } else {
      progress = await db.worldProgress.create({
        data: {
          worldId: id,
          completedQuests: completedQuests ?? [],
          unlockedRegions: unlockedRegions ?? [],
          discoveredCharacters: discoveredCharacters ?? [],
          playerInventory: playerInventory ?? []
        }
      });
    }

    return NextResponse.json({ message: 'Progress saved successfully', progress });
  } catch (error: any) {
    console.error("Error saving progress:", error);
    return NextResponse.json({ error: error.message || "Failed to save progress" }, { status: 500 });
  }
}
