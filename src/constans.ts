import zero from './assets/balloons/0.png';
import one from './assets/balloons/1.png';
import two from './assets/balloons/1.png';
import three from './assets/balloons/2.png';
import four from './assets/balloons/3.png';
import five from './assets/balloons/4.png';
import six from './assets/balloons/5.png';
import seven from './assets/balloons/6.png';
import sky from './assets/blue-sky/sky.jpg';

export const BALLOONS = [zero, one, two, three, four, five, six, seven];

export const getBalloons = (qty: number) => {
  const balloons = [];
  for (let i = 0; i < qty; i++) {
    const balloon = new Image();
    balloon.src = BALLOONS[i % 8];
    balloons.push(balloon);
  }

  return balloons;
}

export const getSky = () => {
  const skyImage = new Image();
  skyImage.src = sky;
  return skyImage;
}
