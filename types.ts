export enum DanceStyle {
  Ballet = 'Ballet',
  Contemporary = 'Contemporary',
  Jazz = 'Jazz',
  HipHop = 'Hip Hop',
  KPop = 'K-Pop'
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}

export interface RoutineStep {
  count: string; // e.g., "1-2" or "3 & 4"
  action: string;
  technicalNote: string;
  styleFocus: DanceStyle;
}

export interface GeneratedRoutine {
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  vibe: string;
  steps: RoutineStep[];
  musicSuggestion: string;
}

export type ViewState = 'home' | 'coach' | 'generator' | 'library';
