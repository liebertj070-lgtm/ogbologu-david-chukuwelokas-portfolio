export type QualityMode = 'auto' | 'high' | 'medium' | 'low';
export type ResolvedQuality = 'high' | 'medium' | 'low';

export type ZoneId =
  | 'hero'
  | 'about'
  | 'design'
  | 'build'
  | 'create'
  | 'experience'
  | 'contact';

export interface ZoneWaypoint {
  id: ZoneId;
  label: string;
  shortLabel: string;
  scrollProgress: number;
  cameraPos: [number, number, number];
  lookAt: [number, number, number];
}

export interface FocusTarget {
  id: string;
  type: 'case-study' | 'media' | 'device' | 'jutima';
  cameraPos: [number, number, number];
  lookAt: [number, number, number];
}

export interface ImageSlot {
  slotId: string;
  label: string;
  aspect: string;
  /** Replace null with '/slots/IMG-XX.jpg' (or imported asset) once supplied */
  src: string | null;
  caption?: string;
}
