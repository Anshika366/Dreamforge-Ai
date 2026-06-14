import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ error: 'World ID is required' }, { status: 400 });
    }

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

    // Handle missing progress gracefully (e.g. for mock data or legacy rows)
    let progress = world.progress;
    if (!progress) {
      const firstRegId = world.regions[0]?.id || "";
      const firstCharId = world.characters[0]?.id || "";
      
      try {
        // Try creating it in the DB
        progress = await db.worldProgress.create({
          data: {
            worldId: world.id,
            completedQuests: [],
            unlockedRegions: firstRegId ? [firstRegId] : [],
            discoveredCharacters: firstCharId ? [firstCharId] : [],
            playerInventory: []
          }
        });
      } catch (e) {
        // Mock fallback if DB write fails or in-memory
        progress = {
          id: 'temp-prog',
          worldId: world.id,
          completedQuests: [] as any,
          unlockedRegions: (firstRegId ? [firstRegId] : []) as any,
          discoveredCharacters: (firstCharId ? [firstCharId] : []) as any,
          playerInventory: [] as any
        };
      }
    }

    // Structure response according to unified Phase 2 payload
    return NextResponse.json({
      world: {
        id: world.id,
        title: world.title,
        lore: world.lore,
        story: world.story || [],
        comic: (world as any).comic || [],
        puzzles: (world as any).puzzles || {},
        createdAt: world.createdAt
      },
      characters: world.characters,
      quests: world.quests,
      regions: world.regions,
      inventoryItems: world.inventoryItems,
      boss: world.bosses[0] || {
        id: 'default-boss',
        worldId: world.id,
        name: "Omni Glitch, the Stack-Overflow",
        title: "The Lord of Broken Pointers",
        weakness: "Garbage Collection",
        description: "A terrifying colossal monster composed of blue-screen static and loops."
      },
      progress: progress
    });

  } catch (error: any) {
    console.error("Error fetching world details:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch world details" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { title } = await request.json();

    if (!id || !title) {
      return NextResponse.json({ error: 'World ID and title are required' }, { status: 400 });
    }

    const updatedWorld = await db.world.update({
      where: { id },
      data: { title }
    });

    return NextResponse.json({ message: 'World renamed successfully', world: updatedWorld });
  } catch (error: any) {
    console.error("Error renaming world:", error);
    return NextResponse.json({ error: error.message || "Failed to rename world" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'World ID is required' }, { status: 400 });
    }

    await db.world.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'World deleted successfully' });
  } catch (error: any) {
    console.error("Error deleting world:", error);
    return NextResponse.json({ error: error.message || "Failed to delete world" }, { status: 500 });
  }
}
