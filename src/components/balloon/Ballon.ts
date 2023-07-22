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
  const width = 120 * size;
  const height = 240 * size;

  const balloon = new Image();
  balloon.src = balloonMap[color];

  const floatRight = (ctx: CanvasRenderingContext2D) => {
    x += .5;

    if (x > ctx.canvas.width) {
      x = Math.random() * 800 - 1000;
      y = Math.random() * ctx.canvas.height;
    }
  };

  const draw = (ctx: CanvasRenderingContext2D) => {
    ctx.drawImage(balloon, x, Math.sin(x / 50) * 50 + y, width, height);
  };

  const actionMap = {
    floatRight,
  };

  return {
    action: actionMap[action as keyof typeof actionMap],
    draw,
  };
}
