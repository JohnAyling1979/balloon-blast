import blue from '../../assets/buttons/blue.png';
import green from '../../assets/buttons/green.png';
import purple from '../../assets/buttons/purple.png';
import red from '../../assets/buttons/red.png';
import blueLit from '../../assets/buttons/blue-lit.png';
import greenLit from '../../assets/buttons/green-lit.png';
import purpleLit from '../../assets/buttons/purple-lit.png';
import redLit from '../../assets/buttons/red-lit.png';

export type ButtonMapType = {
  'blue': string;
  'blueLit': string;
  'green': string;
  'greenLit': string;
  'purple': string;
  'purpleLit': string;
  'red': string;
  'redLit': string;
};

export type ButtonMapKey = keyof ButtonMapType;

const buttonMap: ButtonMapType = {
  blue,
  blueLit,
  green,
  greenLit,
  purple,
  purpleLit,
  red,
  redLit,
};

export type ButtonType = {
  action: () => void;
  draw: (ctx: CanvasRenderingContext2D) => void;
  pressed: () => void;
};

export function buttonFactory(
  xStart: number,
  yStart: number,
  size: number,
  color: ButtonMapKey,
) {
  let x = xStart;
  let y = yStart;
  let width = 64 * size;
  let height = 68 * size;
  let isPressed = false;
  let timer = 0;


  const frameSpeed = 20;
  const frame1 = new Image();
  const frame2 = new Image();

  frame1.src = buttonMap[color];
  frame2.src = buttonMap[color + 'Lit' as ButtonMapKey];

  const frames = [
    frame1,
    frame2,
  ]

  let frame = frames[0];

  const draw = (ctx: CanvasRenderingContext2D) => {
    ctx.drawImage(frame, x - width / 2, y - height / 2, width, height);
  }

  const action = () => {
    if (timer > frameSpeed) {
      isPressed = false;
      timer = 0;
      frame = frames[0];
    }

    if (isPressed) {
      timer++;
    }
  }

  const pressed = () => {
    isPressed = true;
    frame = frames[1];
    timer = 0;
  }

  return {
    action,
    draw,
    pressed,
  }
}