export enum AppState {
  INITIALLOADING = 'INITIALLOADING',
  IDLE = 'IDLE',
  SHUFFLING = 'SHUFFLING',
  REVEALED = 'REVEALED',
  ERROR = 'ERROR'
}

export interface FortuneData {
  cardName: string;
  text: string;
  imageUrl?: string;
}
