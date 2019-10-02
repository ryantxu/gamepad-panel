import React, { PureComponent } from 'react';
import { PanelProps, PanelPlugin } from '@grafana/ui';
import { CanvasElement, CanvasMouseCallback } from 'CanvasElement';

export class MyPanel extends PureComponent<PanelProps> {

  getButtonColor = (index:number):string => {
    switch(index) {
      case 1:
      case 2:
      case 3:
          case 6:
          case 7:
          case 8:
          return "#c562f0"; // pink

          case 4:
              case 5:
                  case 9:
                      case 10:
                          return "#f0970a"; // orange
    }

    return "#CC0000";
  }


  draw = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Clear the background
    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, width, height);

    ctx.lineWidth = 1;
    ctx.font = '14px "Open Sans", Helvetica, Arial, sans-serif';

    const radius = 18;

    let x = 50;
    let y = 50;

    for(let i=1; i<=10; i++) {
      if(i===6) {
        x = 50;
        y += 80;
      }

      // Purple 1-8
      ctx.fillStyle = this.getButtonColor(i);
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI*2, true);
      ctx.closePath();
      ctx.fill();

      x+= 80;
    }

    x = 50;
    y = 220;
    for(let i=11; i<=16; i++) {
      // Purple 1-8
      ctx.fillStyle = '#ded828';
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI*2, true);
      ctx.closePath();
      ctx.fill();

      if(i%2 == 0) {
        x += 70;
        y = 220;
      }
      else {
        y += 80;
      }
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

export const plugin = new PanelPlugin(MyPanel);
