import React, { PureComponent } from 'react';
import { PanelEditorProps, Select } from '@grafana/ui';
import { SelectableValue } from '@grafana/data';

import { GamepadOptions, ShowType } from './types';

export class GamepadEditor extends PureComponent<PanelEditorProps<GamepadOptions>> {
  setShowType = (v: SelectableValue<ShowType>) => {
    this.props.onOptionsChange({ ...this.props.options, show: v.value! });
  };

  render() {
    const { options } = this.props;

    const showTypes = [
      { value: ShowType.panel_buttons, label: 'Buttons' },
      { value: ShowType.panel_stick, label: 'Stick' },
      { value: ShowType.wheel, label: 'Wheel' },
    ];

    return (
      <div>
        <Select width={12} options={showTypes} onChange={this.setShowType} value={showTypes.find(option => option.value === options.show)} />
      </div>
    );
  }
}
