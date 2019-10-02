// Libraries
import React, { PureComponent, MouseEvent } from 'react';

export enum MouseEvtType {
  enter = 'enter',
  leave = 'leave',
  move = 'move',
  drag = 'drag',
  down = 'down',
  up = 'up',
}

interface MouseEventInfo {
  offsetX: number;
  percentX: number;
  event: MouseEvent;
}

export interface CanvasMouseCallback<T = any> extends MouseEventInfo {
  type: MouseEvtType;
  data?: T;
  start?: MouseEventInfo;
}

export interface Props<T = any> {
  width: number | string;
  height: number;

  draw: (ctx: CanvasRenderingContext2D, width: number, height: number, data?: T) => void;

  onMouseEvent: (info: CanvasMouseCallback<T>) => void;

  // Pass the data back on hover
  data?: T;

  // Pass through (force redraw)
  [key: string]: any;
}

export class CanvasElement<T> extends PureComponent<Props<T>> {
  private ref = React.createRef<HTMLCanvasElement>();
  private rect?: DOMRect | ClientRect;
  private down?: CanvasMouseCallback<T>;

  constructor(props: Props) {
    super(props);
  }

  componentDidMount() {
    this.requestDraw();
  }

  componentDidUpdate() {
    this.requestDraw();
  }

  requestDraw = () => {
    if (this.ref.current) {
      const canvas = this.ref.current;

      // Get the device pixel ratio, falling back to 1.
      const dpr = window.devicePixelRatio || 1;

      // Get the size of the canvas in CSS pixels.
      this.rect = canvas.getBoundingClientRect();

      // Give the canvas pixel dimensions of their CSS
      // size * the device pixel ratio.
      canvas.width = this.rect.width * dpr;
      canvas.height = this.rect.height * dpr;

      const ctx = canvas.getContext('2d')!;

      // Scale all drawing operations by the dpr, so you
      // don't have to worry about the difference.
      ctx.scale(dpr, dpr);

      // Draw with the original scale
      this.props.draw(ctx!, this.rect.width, this.rect.height, this.props.data);
    } else {
      console.log('No draw', this.props.data);
    }
  };

  sendMouseEvent = (type: MouseEvtType, event: MouseEvent): CanvasMouseCallback<T> | undefined => {
    const canvas = this.ref.current;
    if (!canvas || !this.rect) {
      return undefined;
    }
    const { offsetX } = event.nativeEvent;
    const percentX = offsetX / this.rect.width;
    const info = {
      type,
      offsetX,
      percentX,
      event,
      data: this.props.data,
      start: this.down,
    };
    this.props.onMouseEvent(info);
    return info;
  };

  onMouseEnter = (evt: MouseEvent) => {
    if (this.down && !evt.button) {
      this.down = undefined;
    }
    this.sendMouseEvent(MouseEvtType.enter, evt);
  };

  onMouseLeave = (evt: MouseEvent) => {
    this.sendMouseEvent(MouseEvtType.leave, evt);
  };

  onMouseMove = (evt: MouseEvent) => {
    if (this.down) {
      this.sendMouseEvent(MouseEvtType.drag, evt);
    } else {
      this.sendMouseEvent(MouseEvtType.move, evt);
    }
  };

  onMouseDown = (event: MouseEvent) => {
    const info = this.sendMouseEvent(MouseEvtType.down, event);
    if (info) {
      this.down = info;
    }
  };

  onMouseUp = (evt: MouseEvent) => {
    this.sendMouseEvent(MouseEvtType.up, evt);
    this.down = undefined;
  };

  render() {
    const { width, height } = this.props;
    return (
      <canvas
        ref={this.ref}
        style={{ width, height }}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        onMouseMove={this.onMouseMove}
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp}
      />
    );
  }
}
