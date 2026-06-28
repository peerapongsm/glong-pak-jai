export type Disposition = 'didnt_happen' | 'happened_coped' | 'action';
export interface Worry {
  id: string;
  text: string;
  createdAt: number;            // epoch ms
  status: 'pending' | 'resolved';
  disposition?: Disposition;
  actionNote?: string;
  resolvedAt?: number;
}
export interface Settings {
  windowStart: string;          // "HH:MM" local
  windowMinutes: number;
  firstRunDone: boolean;
}
export const DEFAULT_SETTINGS: Settings = {
  windowStart: '19:00',
  windowMinutes: 20,
  firstRunDone: false,
};
