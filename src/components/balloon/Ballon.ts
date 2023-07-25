import blue from '../../assets/balloons/blue.png';
import green from '../../assets/balloons/green.png';
import orange from '../../assets/balloons/orange.png';
import pink from '../../assets/balloons/pink.png';
import purple from '../../assets/balloons/purple.png';
import red from '../../assets/balloons/red.png';
import teal from '../../assets/balloons/teal.png';
import yellow from '../../assets/balloons/yellow.png';

export type BalloonMapType = {
  'blue': string;
  'green': string;
  'orange': string;
  'pink': string;
  'purple': string;
  'red': string;
  'teal': string;
  'yellow': string;
};

export type BalloonMapKey = keyof BalloonMapType;

const balloonMap: BalloonMapType = {
  blue,
  green,
  orange,
  pink,
  purple,
  red,
  teal,
  yellow
};

export type BalloonType = {
  action: (ctx: CanvasRenderingContext2D) => void;
  draw: (ctx: CanvasRenderingContext2D) => void;
  pop: () => void;
  inflate: (add: number) => void;
  score: (x: number) => void;
};

export function balloonFactory(xStare: number, yStart: number, size: number, color: BalloonMapKey, action: string) {
  let x = xStare;
  let y = yStart;
  let baseY = yStart;
  let width = 110 * size;
  let height = 340 * size;
  let increase = true;
  const pulseRate = .05;

  const balloon = new Image();
  balloon.src = balloonMap[color];

  const floatRight = (ctx: CanvasRenderingContext2D) => {
    x += .5;
    y = Math.sin(x / 50) * 50 + baseY;

    if (x > ctx.canvas.width + width) {
      x = Math.random() * 800 - 1000;
      baseY = Math.random() * ctx.canvas.height;
    }
  };

  const pulse = () => {
    if (increase) {
      width += pulseRate * 2;
      height -= pulseRate * 2;
      x -= pulseRate /2;
      y -= pulseRate /2;
    } else {
      width -= pulseRate * 2;
      height += pulseRate * 2;
      x += pulseRate /2;
      y += pulseRate /2;
    }

    if (width > 130) {
      increase = false;
    }

    if (width < 110) {
      increase = true;
    }
  };

  const draw = (ctx: CanvasRenderingContext2D) => {
    ctx.drawImage(balloon, x - width / 2, y - height / 2, width, height);
  };

  const actionMap = {
    floatRight,
    pulse,
    none: () => {},
  };

  const pop = () => {
  };

  const inflate = (add: number) => {
    width += add * 110;
    height += add * 340;
  }

  const score = (xIn: number) => {
    width = 10;
    height = 31;
    x = xIn;
    y = 31;
  }

  return {
    action: actionMap[action as keyof typeof actionMap],
    draw,
    pop,
    inflate,
    score,
  };
}
