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
  pop: (ctx: CanvasRenderingContext2D, slot: number) => void;
  inflate: (add: number) => void;
  score: (slot: number) => void;
  isAnimating: () => boolean;
};

export function balloonFactory(xStare: number, yStart: number, size: number, color: BalloonMapKey, action: string) {
  let x = xStare;
  let y = yStart;
  let baseY = y;
  let width = Math.round(110 * size) % 2 === 0 ? Math.round(110 * size) : Math.round(110 * size) + 1;
  let height = Math.round(340 * size) % 2 === 0 ? Math.round(340 * size) : Math.round(340 * size) + 1;
  let increase = true;

  let targetX = x;
  let targetY = y;
  let targetWidth = width;
  let targetHeight = height;

  const pulseRate = .05;

  const balloon = new Image();
  balloon.src = balloonMap[color];

  const floatRight = (ctx: CanvasRenderingContext2D) => {
    if (x > ctx.canvas.width + width) {
      x = Math.random() * 800 - (800 + width);
      baseY = Math.random() * ctx.canvas.height;
    }

    x += .5;
    y = Math.sin(x / 50) * 50 + baseY;

    targetX = x;
    targetY = y;
  };

  const pulse = () => {
    if (increase) {
      width += pulseRate * 2;
      height -= pulseRate * 2;
      x -= pulseRate / 2;
      y -= pulseRate / 2;
    } else {
      width -= pulseRate * 2;
      height += pulseRate * 2;
      x += pulseRate /2;
      y += pulseRate /2;
    }

    targetWidth = width;
    targetHeight = height;
    targetX = x;
    targetY = y;

    if (width > 130) {
      increase = false;
    }

    if (width < 110) {
      increase = true;
    }
  };

  const draw = (ctx: CanvasRenderingContext2D) => {
    ctx.drawImage(balloon, x - width / 2, y - height / 2, width, height);
    if (width < targetWidth) {
      width += 1;
    }
    if (height < targetHeight) {
      height += 2;
    }

    if (width > targetWidth) {
      width -= 1;
    }
    if (height > targetHeight) {
      height -= 2;
    }

    if (x < targetX) {
      x += 2;
    }
    if (y < targetY) {
      y += 2;
    }
    if (x > targetX) {
      x -= 2;
    }
    if (y > targetY) {
      y -= 2;
    }
  };

  const actionMap = {
    floatRight,
    pulse,
    none: () => {},
  };

  const pop = (ctx: CanvasRenderingContext2D, slot: number) => {
    targetWidth = 10;
    targetHeight =32;
    targetX = ctx.canvas.width - slot * 20;
    targetY = 32;
  };

  const inflate = (add: number) => {
    targetWidth += Math.round(add * 110) % 2 === 0 ? Math.round(add * 110) : Math.round(add * 110) + 1;
    targetHeight += Math.round(add * 340) % 2 === 0 ? Math.round(add * 340) : Math.round(add * 340) + 1;
  }

  const score = (slot: number) => {
    targetWidth = 10;
    targetHeight = 32;
    targetX = slot * 20;
    targetY = 32;
  }

  const isAnimating = () => {
    return (
      Math.floor(width) !== Math.floor(targetWidth) ||
      Math.floor(height) !== Math.floor(targetHeight) ||
      Math.floor(x) !== Math.floor(targetX) ||
      Math.floor(y) !== Math.floor(targetY)
    );
  }

  return {
    action: actionMap[action as keyof typeof actionMap],
    draw,
    pop,
    inflate,
    score,
    isAnimating
  };
}
