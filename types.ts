
export type GameStatus = 'idle' | 'playing' | 'solved';

export interface FamilyMember {
  name: string;
  role: string;
  icon: string;
  color: string;
}

export interface Tile {
  id: number;
  content: string;
  isCorrect: boolean;
}
