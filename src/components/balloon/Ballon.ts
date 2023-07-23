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


export function balloonFactory(xStare: number, yStart: number, size: number, color: BalloonMapKey, action: string) {
  let x = xStare;
  let y = yStart;
  let baseY = yStart;
  let width = 120 * size;
  let height = 240 * size;
  let increase = true;
  const pulseRate = .25;

  const balloon = new Image();
  balloon.src = balloonMap[color];

  const floatRight = (ctx: CanvasRenderingContext2D) => {
    x += .5;
    y = Math.sin(x / 50) * 50 + baseY;

    if (x > ctx.canvas.width) {
      x = Math.random() * 800 - 1000;
      baseY = Math.random() * ctx.canvas.height;
    }
  };

  const pulse = () => {
    if (increase) {
      width += pulseRate;
      height += pulseRate * 2;
      x -= pulseRate /2;
      y -= pulseRate /2;
    } else {
      width -= pulseRate;
      height -= pulseRate * 2;
      x += pulseRate /2;
      y += pulseRate /2;
    }

    if (width > 150) {
      increase = false;
    }

    if (width < 120) {
      increase = true;
    }
  };

  const draw = (ctx: CanvasRenderingContext2D) => {
    ctx.drawImage(balloon, x, y, width, height);
  };

  const actionMap = {
    floatRight,
    pulse
  };

  return {
    action: actionMap[action as keyof typeof actionMap],
    draw,
  };
}
