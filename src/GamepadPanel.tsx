import React, { PureComponent } from 'react';
import { PanelProps } from '@grafana/ui';
import { CanvasElement, CanvasMouseCallback } from 'CanvasElement';
import { GamepadOptions, ShowType } from 'types';

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
    let panelX = -1;
    let panelY = -1;
    if (data && data.series) {
      for (const frame of data.series) {
        if (!frame.name) {
          continue;
        }

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

        // Panel X
        if (frame.name.startsWith('panel_GenericDesktopX')) {
          const v = frame.fields[1];
          if (v && v.name === 'value') {
            panelX = v.values.get(v.values.length - 1);
          }
        }
        // Panel X
        if (frame.name.startsWith('panel_GenericDesktopY')) {
          const v = frame.fields[1];
          if (v && v.name === 'value') {
            panelY = v.values.get(v.values.length - 1);
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
      ctx.fillText(`STICK: ${panelX} x ${panelY}`, 10, height / 2);
    }

    if (options.show === ShowType.wheel) {
      ctx.fillStyle = '#d8d9da';
      ctx.fillText(`WHEEL: ${wheelX}`, 10, height / 2);
    }

    // if (true) {
    //   ctx.fillStyle = '#d8d9da';
    //   ctx.fillText(`No events`, 10, height / 2);
    // }

    // const barheight = height / 2;
    // const textColor = '#d8d9da';
    // let idx = 0;
    // for (const event of info.events) {
    //   ctx.fillStyle = colors[++idx % colors.length];

    //   let x = event.x;
    //   if (x < 0) {
    //     x = 0;
    //     // TODO, add a note?
    //   }

    //   if (event.action === EventType.ParamsChanged) {
    //     ctx.fillRect(x, barheight, width, height - barheight);

    //     ctx.fillStyle = textColor;
    //     let txt = '';
    //     if (event.info && event.info.query) {
    //       txt = event.info.query;
    //     }

    //     ctx.textBaseline = 'bottom';
    //     ctx.fillText(txt, x + 5, height - 6);
    //   } else {
    //     ctx.fillRect(x, 0, width, height);

    //     ctx.fillStyle = textColor;
    //     let text = event.action;
    //     if (event.action === EventType.PageLoad) {
    //       if (event.info && event.info.query) {
    //         text = event.info.query;
    //         ctx.textBaseline = 'bottom';
    //         ctx.fillText(text, x + 5, height - 6);
    //       }

    //       text = event.key;
    //     }
    //     ctx.textBaseline = 'top';
    //     ctx.fillText(text, x + 5, 6);
    //   }
    // }
  };

  onMouseEvent = (info: CanvasMouseCallback<any>) => {
    console.log('MOUSE', info);
  };

  render() {
    return (
      <div>
        <CanvasElement {...this.props} data={this.props.data} width={600} height={300} draw={this.draw} onMouseEvent={this.onMouseEvent} />
      </div>
    );
  }
}
