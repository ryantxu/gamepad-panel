import { PanelPlugin } from '@grafana/ui';
import { GamepadOptions, defaults } from './types';
import { GamepadPanel } from './GamepadPanel';
import { GamepadEditor } from './GamepadEditor';

export const plugin = new PanelPlugin<GamepadOptions>(GamepadPanel).setDefaults(defaults).setEditor(GamepadEditor);
