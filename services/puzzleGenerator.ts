import type { Puzzle, PuzzleGenerationParams, Node } from '../types';
import { geometry } from './geometry';

// Seedable PRNG using xmur3 and mulberry32
const xmur3 = (str: string) => {
    let h = 1779033703 ^ str.length;
    for (let i = 0; i < str.length; i++) {
        h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
        h = h << 13 | h >>> 19;
    }
    return () => {
        h = Math.imul(h ^ h >>> 16, 2246822507);
        h = Math.imul(h ^ h >>> 13, 3266489909);
        return (h ^= h >>> 16) >>> 0;
    };
};

const mulberry32 = (a: number) => () => {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
};

export function generatePuzzle(params: PuzzleGenerationParams): Puzzle | null {
  const { pairsCount, width, height, padding, minSeparation, seed } = params;
  
  const prng = mulberry32(xmur3(seed)());

  const order: string[] = [];
  for (let i = 1; i <= pairsCount; i++) {
    order.push(String(i));
    order.push(String.fromCharCode(64 + i));
  }

  const nodes: Node[] = [];
  const edges: { p1: Node; p2: Node }[] = [];
  
  const MAX_PLACEMENT_ATTEMPTS = 50;
  const MAX_BACKTRACK_ATTEMPTS = 500;
  let totalBacktrackAttempts = 0;

  for (let i = 0; i < order.length; i++) {
    let placed = false;
    let placementAttempts = 0;

    while (!placed && placementAttempts < MAX_PLACEMENT_ATTEMPTS) {
      placementAttempts++;
      const newNode: Node = {
        id: `${order[i]}-${seed}`,
        label: order[i],
        x: Math.floor(prng() * (width - padding * 2)) + padding,
        y: Math.floor(prng() * (height - padding * 2)) + padding,
      };

      let isTooClose = false;
      for (const existingNode of nodes) {
        if (geometry.distance(newNode, existingNode) < minSeparation) {
          isTooClose = true;
          break;
        }
      }
      if (isTooClose) continue;

      let hasCrossing = false;
      if (i > 0) {
        const prevNode = nodes[i - 1];
        for (let j = 0; j < edges.length - 1; j++) { // Don't check against the last edge
            if (geometry.segmentsIntersect(edges[j].p1, edges[j].p2, prevNode, newNode)) {
                hasCrossing = true;
                break;
            }
        }
      }
      if (hasCrossing) continue;

      // If all checks pass, place the node
      nodes.push(newNode);
      if (i > 0) {
        edges.push({ p1: nodes[i-1], p2: newNode });
      }
      placed = true;
    }

    if (!placed) {
      // Backtrack
      if (i > 0) {
        i -= 2; // This will effectively retry placing the previous node
        nodes.pop();
        if (edges.length > 0) edges.pop();
        
        totalBacktrackAttempts++;
        if (totalBacktrackAttempts > MAX_BACKTRACK_ATTEMPTS) {
            console.error("Failed to generate puzzle: Maximum backtrack attempts exceeded.");
            return null;
        }
      } else {
         console.error("Failed to place the very first node.");
         return null;
      }
    }
  }
  
  // Transform nodes array into the Record<string, Node> format
  const nodesRecord: Record<string, Node> = {};
  const finalOrder: string[] = [];
  nodes.forEach(node => {
      nodesRecord[node.id] = node;
      finalOrder.push(node.id);
  });
  
  return {
    id: `puzzle-${seed}`,
    nodes: nodesRecord,
    order: finalOrder,
  };
}