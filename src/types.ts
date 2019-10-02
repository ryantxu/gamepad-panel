export enum ShowType {
  panel_buttons = 'buttons',
  panel_stick = 'stick',
  wheel = 'wheel',
}

export interface GamepadOptions {
  show: ShowType;
}

export const defaults: GamepadOptions = {
  show: ShowType.panel_buttons,
};
