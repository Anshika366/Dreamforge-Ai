import { create } from 'zustand';
import { getAudio } from '@/lib/audio';

export interface Character {
  id: string;
  worldId: string;
  name: string;
  fantasyName: string;
  role: string;
  personality: string;
  memory: any; // string[] or stringified JSON
  backstory: string;
  voiceStyle: string;
}

export interface Quest {
  id: string;
  worldId: string;
  title: string;
  description: string;
  reward: string;
}

export interface Region {
  id: string;
  worldId: string;
  name: string;
  description: string;
  difficulty: string;
  x: number;
  y: number;
}

export interface InventoryItem {
  id: string;
  worldId: string;
  name: string;
  rarity: string;
  description: string;
}

export interface Boss {
  id: string;
  worldId: string;
  name: string;
  title: string;
  weakness: string;
  description: string;
}

export interface WorldProgress {
  id: string;
  worldId: string;
  completedQuests: string[]; // array of completed quest IDs
  unlockedRegions: string[]; // array of unlocked region IDs
  discoveredCharacters: string[]; // array of discovered character IDs
  playerInventory: string[]; // array of gathered item names
}

export interface World {
  id: string;
  title: string;
  lore: string;
  story: Array<{ chapter: number; title: string; content: string }>;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

interface WorldState {
  worlds: any[];
  currentWorld: World | null;
  currentCharacters: Character[];
  currentQuests: Quest[];
  currentRegions: Region[];
  currentInventoryItems: InventoryItem[];
  currentBoss: Boss | null;
  currentProgress: WorldProgress | null;
  
  // Gameplay States
  playerInventory: string[]; // collected item names
  chatHistory: { [characterId: string]: ChatMessage[] };
  explorerLogs: string[];
  activeRegionId: string | null;
  
  loading: boolean;
  generating: boolean;
  error: string | null;

  // Audio state & actions
  isMuted: boolean;
  volume: number;
  ambientPlaying: boolean;
  toggleMute: () => void;
  setVolume: (vol: number) => void;
  startAmbient: () => void;
  stopAmbient: () => void;

  // Actions
  fetchWorlds: () => Promise<void>;
  fetchWorldDetails: (id: string) => Promise<any>;
  generateWorld: (text: string) => Promise<any>;
  regenerateWorld: (id: string) => Promise<any>;
  
  // Gameplay actions
  sendChatMessage: (characterId: string, text: string) => Promise<void>;
  clearChatHistory: (characterId: string) => void;
  completeQuest: (questId: string, rewardName: string) => void;
  unlockRegion: (regionId: string) => void;
  discoverCharacter: (characterId: string) => void;
  addExplorerLog: (log: string) => void;
  setActiveRegion: (regionId: string | null) => void;
  saveProgress: () => Promise<void>;
  addInventoryItem: (itemName: string) => void;
}

export const useWorldStore = create<WorldState>((set, get) => ({
  worlds: [],
  currentWorld: null,
  currentCharacters: [],
  currentQuests: [],
  currentRegions: [],
  currentInventoryItems: [],
  currentBoss: null,
  currentProgress: null,
  
  playerInventory: [],
  chatHistory: {},
  explorerLogs: ["Welcome to the Realm! Stand inside the safety zone or explore new regions."],
  activeRegionId: null,
  
  loading: false,
  generating: false,
  error: null,

  isMuted: false,
  volume: 0.5,
  ambientPlaying: false,

  toggleMute: () => {
    const audio = getAudio();
    const newMute = !get().isMuted;
    audio.setMute(newMute);
    set({ isMuted: newMute });
  },

  setVolume: (vol: number) => {
    const audio = getAudio();
    audio.setVolume(vol);
    set({ volume: vol });
  },

  startAmbient: () => {
    const audio = getAudio();
    audio.startAmbient();
    set({ ambientPlaying: true });
  },

  stopAmbient: () => {
    const audio = getAudio();
    audio.stopAmbient();
    set({ ambientPlaying: false });
  },

  fetchWorlds: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch('/api/world/list');
      if (!res.ok) throw new Error('Failed to fetch worlds');
      const data = await res.json();
      set({ worlds: data, loading: false });
    } catch (err: any) {
      set({ error: err.message || 'An error occurred', loading: false });
    }
  },

  fetchWorldDetails: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`/api/world/${id}`);
      if (!res.ok) throw new Error('Failed to fetch world details');
      const data = await res.json();
      
      // Parse progress lists from database Json structure
      let completedQuests: string[] = [];
      let unlockedRegions: string[] = [];
      let discoveredCharacters: string[] = [];
      let playerInventory: string[] = [];

      if (data.progress) {
        completedQuests = Array.isArray(data.progress.completedQuests) 
          ? data.progress.completedQuests 
          : JSON.parse(data.progress.completedQuests || '[]');
        unlockedRegions = Array.isArray(data.progress.unlockedRegions) 
          ? data.progress.unlockedRegions 
          : JSON.parse(data.progress.unlockedRegions || '[]');
        discoveredCharacters = Array.isArray(data.progress.discoveredCharacters) 
          ? data.progress.discoveredCharacters 
          : JSON.parse(data.progress.discoveredCharacters || '[]');
        playerInventory = Array.isArray(data.progress.playerInventory)
          ? data.progress.playerInventory
          : JSON.parse(data.progress.playerInventory || '[]');
      }

      // Load Chat History from LocalStorage
      const localChats = localStorage.getItem('dreamforge_chats');
      const parsedChats = localChats ? JSON.parse(localChats) : {};

      // Fallback/sync with LocalStorage if DB inventory is empty
      if (playerInventory.length === 0) {
        const localInv = localStorage.getItem(`dreamforge_inventory_${id}`);
        playerInventory = localInv ? JSON.parse(localInv) : [];
      }

      set({
        currentWorld: data.world,
        currentCharacters: data.characters,
        currentQuests: data.quests,
        currentRegions: data.regions,
        currentInventoryItems: data.inventoryItems,
        currentBoss: data.boss,
        currentProgress: {
          id: data.progress?.id || '',
          worldId: id,
          completedQuests,
          unlockedRegions,
          discoveredCharacters,
          playerInventory
        },
        chatHistory: parsedChats,
        playerInventory: playerInventory,
        activeRegionId: unlockedRegions[0] || null,
        loading: false
      });
      return data;
    } catch (err: any) {
      set({ error: err.message || 'An error occurred', loading: false });
      return null;
    }
  },

  generateWorld: async (text: string) => {
    set({ generating: true, error: null });
    try {
      const res = await fetch('/api/world/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error('Failed to generate fantasy world');
      const data = await res.json();
      
      set((state) => ({
        worlds: [data.world, ...state.worlds],
        generating: false,
      }));
      return data.world;
    } catch (err: any) {
      set({ error: err.message || 'An error occurred during generation', generating: false });
      return null;
    }
  },

  regenerateWorld: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`/api/world/${id}/regenerate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (!res.ok) throw new Error('Failed to regenerate world');
      const data = await res.json();

      // Clear local persistence for this world
      localStorage.removeItem(`dreamforge_inventory_${id}`);
      
      // Parse lists
      const completedQuests = Array.isArray(data.progress.completedQuests) ? data.progress.completedQuests : [];
      const unlockedRegions = Array.isArray(data.progress.unlockedRegions) ? data.progress.unlockedRegions : [];
      const discoveredCharacters = Array.isArray(data.progress.discoveredCharacters) ? data.progress.discoveredCharacters : [];

      set({
        currentWorld: data.world,
        currentCharacters: data.characters,
        currentQuests: data.quests,
        currentRegions: data.regions,
        currentInventoryItems: data.inventoryItems,
        currentBoss: data.boss,
        currentProgress: {
          id: data.progress.id,
          worldId: id,
          completedQuests,
          unlockedRegions,
          discoveredCharacters,
          playerInventory: []
        },
        playerInventory: [],
        activeRegionId: unlockedRegions[0] || null,
        explorerLogs: ["The realm has been completely re-forged! A new reality begins now."],
        loading: false
      });
      return data;
    } catch (err: any) {
      set({ error: err.message || 'Failed to regenerate world', loading: false });
      return null;
    }
  },

  sendChatMessage: async (characterId: string, text: string) => {
    const userMsg: ChatMessage = {
      id: Math.random().toString(36).substring(2, 9),
      role: 'user',
      content: text,
      createdAt: new Date().toLocaleTimeString()
    };

    // Update local state first (user side message)
    set((state) => {
      const currentHistory = state.chatHistory[characterId] || [];
      const updatedHistory = [...currentHistory, userMsg];
      const newChats = {
        ...state.chatHistory,
        [characterId]: updatedHistory
      };
      localStorage.setItem('dreamforge_chats', JSON.stringify(newChats));
      return { chatHistory: newChats };
    });

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ characterId, message: text }),
      });
      if (!res.ok) throw new Error('NPC is unresponsive.');
      const data = await res.json();

      const assistantMsg: ChatMessage = {
        id: Math.random().toString(36).substring(2, 9),
        role: 'assistant',
        content: data.reply,
        createdAt: new Date().toLocaleTimeString()
      };

      // Append assistant response
      set((state) => {
        const currentHistory = state.chatHistory[characterId] || [];
        const updatedHistory = [...currentHistory, assistantMsg];
        const newChats = {
          ...state.chatHistory,
          [characterId]: updatedHistory
        };
        localStorage.setItem('dreamforge_chats', JSON.stringify(newChats));
        return { chatHistory: newChats };
      });

    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: Math.random().toString(36).substring(2, 9),
        role: 'assistant',
        content: `*${err.message || 'NPC connection interrupted.'}*`,
        createdAt: new Date().toLocaleTimeString()
      };

      set((state) => {
        const currentHistory = state.chatHistory[characterId] || [];
        const updatedHistory = [...currentHistory, errorMsg];
        const newChats = {
          ...state.chatHistory,
          [characterId]: updatedHistory
        };
        return { chatHistory: newChats };
      });
    }
  },

  clearChatHistory: (characterId: string) => {
    set((state) => {
      const newChats = { ...state.chatHistory };
      delete newChats[characterId];
      localStorage.setItem('dreamforge_chats', JSON.stringify(newChats));
      return { chatHistory: newChats };
    });
  },

  completeQuest: (questId: string, rewardName: string) => {
    const state = get();
    const progress = state.currentProgress;
    const worldId = state.currentWorld?.id;

    if (!progress || !worldId) return;

    // Avoid duplicates
    if (progress.completedQuests.includes(questId)) return;

    const newCompleted = [...progress.completedQuests, questId];
    const newInventory = [...state.playerInventory, rewardName];

    // Sync to LocalStorage
    localStorage.setItem(`dreamforge_inventory_${worldId}`, JSON.stringify(newInventory));

    set((state) => ({
      currentProgress: {
        ...progress,
        completedQuests: newCompleted,
        playerInventory: newInventory
      },
      playerInventory: newInventory
    }));

    get().addExplorerLog(`🏆 QUEST COMPLETE: You resolved a bottleneck and received: [${rewardName}]`);
    get().saveProgress();
  },

  unlockRegion: (regionId: string) => {
    const progress = get().currentProgress;
    if (!progress) return;

    if (progress.unlockedRegions.includes(regionId)) return;

    const newUnlocked = [...progress.unlockedRegions, regionId];
    set({
      currentProgress: {
        ...progress,
        unlockedRegions: newUnlocked
      }
    });

    const reg = get().currentRegions.find(r => r.id === regionId);
    if (reg) {
      get().addExplorerLog(`🗺️ REGION DISCOVERED: You scaled new heights and entered the [${reg.name}] region!`);
    }
    get().saveProgress();
  },

  discoverCharacter: (characterId: string) => {
    const progress = get().currentProgress;
    if (!progress) return;

    if (progress.discoveredCharacters.includes(characterId)) return;

    const newDiscovered = [...progress.discoveredCharacters, characterId];
    set({
      currentProgress: {
        ...progress,
        discoveredCharacters: newDiscovered
      }
    });
    get().saveProgress();
  },

  addExplorerLog: (log: string) => {
    set((state) => ({
      explorerLogs: [log, ...state.explorerLogs].slice(0, 50) // Cap log list length
    }));
  },

  setActiveRegion: (regionId: string | null) => {
    set({ activeRegionId: regionId });
  },

  saveProgress: async () => {
    const { currentProgress, currentWorld } = get();
    if (!currentProgress || !currentWorld) return;
    try {
      await fetch(`/api/world/${currentWorld.id}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          completedQuests: currentProgress.completedQuests,
          unlockedRegions: currentProgress.unlockedRegions,
          discoveredCharacters: currentProgress.discoveredCharacters,
          playerInventory: currentProgress.playerInventory
        })
      });
    } catch (e) {
      console.error("Failed to persist progress to database", e);
    }
  },

  addInventoryItem: (itemName: string) => {
    const state = get();
    const progress = state.currentProgress;
    const worldId = state.currentWorld?.id;

    if (!progress || !worldId) return;

    // Avoid duplicate items
    if (state.playerInventory.includes(itemName)) return;

    const newInventory = [...state.playerInventory, itemName];

    // Sync to LocalStorage
    localStorage.setItem(`dreamforge_inventory_${worldId}`, JSON.stringify(newInventory));

    set((state) => ({
      currentProgress: {
        ...progress,
        playerInventory: newInventory
      },
      playerInventory: newInventory
    }));

    get().addExplorerLog(`🎒 LOOT: You gained the rare item: [${itemName}]!`);
    get().saveProgress();
  }
}));
