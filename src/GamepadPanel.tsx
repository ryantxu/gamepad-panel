import React, { PureComponent } from 'react';
import { PanelProps } from '@grafana/ui';
import { CanvasElement, CanvasMouseCallback } from 'CanvasElement';
import { GamepadOptions, ShowType, Joystick } from 'types';

interface Props extends PanelProps<GamepadOptions> {}

export class GamepadPanel extends PureComponent<Props> {
  getButtonColor = (index: number): string => {
    switch (index) {
      case 1:
      case 2:
      case 3:
      case 6:
      case 7:
      case 8:
        return '#c562f0'; // pink

      case 4:
      case 5:
      case 9:
      case 10:
        return '#f0970a'; // orange
    }

    return '#CC0000';
  };

  draw = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const { data, options } = this.props;
    const btn: boolean[] = [];
    const on = false;
    let wheelX = -1;
    const joyR: Joystick = { x: 0, y: 0, z: 0 };
    const joyB: Joystick = { x: 0, y: 0, z: 0 };
    if (data && data.series) {
      for (const frame of data.series) {
        if (!frame.name) {
          continue;
        }

        // Buttons by Index
        if (frame.name.startsWith('panel_Button')) {
          const v = frame.fields[1];
          if (v && v.name === 'value') {
            if (v.values.get(v.values.length - 1)) {
              const idx = parseInt(frame.name.substr('panel_Button'.length), 10);
              btn[idx] = true;
            }
          }
        }

        // Wheel X
        if (frame.name.startsWith('wheel_GenericDesktopX')) {
          const v = frame.fields[1];
          if (v && v.name === 'value') {
            wheelX = v.values.get(v.values.length - 1);
          }
        }

        // Panel Joysticks
        if (frame.name.startsWith('panel_GenericDesktop')) {
          const v = frame.fields[1];
          if (v && v.name === 'value') {
            const val = (v.values.get(v.values.length - 1) - 128) / 128.0;
            const inUse = val !== 0;
            const name = frame.name.substring('panel_GenericDesktop'.length);
            switch (name) {
              case 'X':
                joyB.x = val;
                if (inUse) {
                  joyB.inUse = true;
                }
                break;
              case 'Y':
                joyB.y = val;
                if (inUse) {
                  joyB.inUse = true;
                }
                break;
              case 'Z':
                joyB.z = val;
                if (inUse) {
                  joyB.inUse = true;
                }
                break;
              case 'Rx':
                joyR.x = val;
                if (inUse) {
                  joyR.inUse = true;
                }
                break;
              case 'Ry':
                joyR.y = val;
                if (inUse) {
                  joyR.inUse = true;
                }
                break;
              case 'Rz':
                joyR.z = val;
                if (inUse) {
                  joyR.inUse = true;
                }
                break;
            }
          }
        }
      }
    }

    if (on) {
      console.log('CLICK', btn);
    }

    // Clear the background
    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, width, height);

    ctx.lineWidth = 1;
    ctx.font = '14px "Open Sans", Helvetica, Arial, sans-serif';

    if (options.show === ShowType.panel_buttons) {
      const radius = 18;

      let x = 50;
      let y = 50;

      for (let i = 1; i <= 10; i++) {
        if (i === 6) {
          x = 50;
          y += 80;
        }

        // Purple 1-8
        ctx.fillStyle = btn[i] ? this.getButtonColor(i) : '#CCCCCC';
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();

        x += 80;
      }

      x = 50;
      y = 220;
      for (let i = 11; i <= 16; i++) {
        // Yellow
        ctx.fillStyle = btn[i] ? '#ded828' : '#CCCCCC';
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();

        if (i % 2 === 0) {
          x += 70;
          y = 220;
        } else {
          y += 80;
        }
      }
    }

    if (options.show === ShowType.panel_stick) {
      ctx.fillStyle = '#d8d9da';
      const centerY = height / 2;
      const centerX = width / 2;
      const radius = Math.min(centerX, centerY) * 0.8;

      let joy = joyR;
      let color = '#111';
      if (joyB.inUse) {
        joy = joyB;
        color = '#00F';
      } else if (joyR.inUse) {
        joy = joyR;
        color = '#F00';
      }

      ctx.save();
      ctx.fillStyle = color;
      // ctx.fillText(`${JSON.stringify(joy)} ` + inUse, 10, 20);

      ctx.translate(centerX, centerY);
      ctx.translate(radius * joy.x, radius * joy.y);

      ctx.rotate((Math.PI / 180) * (35 * joy.z));
      ctx.beginPath();
      ctx.arc(0, 0, 40, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#CCC';
      ctx.fillRect(-5, -35, 10, 70);

      ctx.restore();
    }

    if (options.show === ShowType.wheel) {
      ctx.fillStyle = '#d8d9da';
      ctx.fillText(`WHEEL: ${wheelX}`, 10, height / 2);
    }
  };

  onMouseEvent = (info: CanvasMouseCallback<any>) => {
    console.log('MOUSE', info);
  };

  render() {
    return (
      <div>
        <CanvasElement {...this.props} data={this.props.data} width={'100%'} draw={this.draw} onMouseEvent={this.onMouseEvent} />
      </div>
    );
  }
}
