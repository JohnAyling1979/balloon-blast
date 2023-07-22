import sky from './assets/blue-sky/sky.jpg';
import { BalloonMapKey, balloonFactory } from './components/balloon/Ballon';

export const BALLOONS: BalloonMapKey[] = ['blue', 'green', 'orange', 'pink', 'purple', 'red', 'teal', 'yellow'];

export const getBalloons = (qty: number) => {
  const balloons = [];
  for (let i = 0; i < qty; i++) {
    const balloon = balloonFactory(
      Math.random() * 800 - 1000,
      Math.random() * 600,
      1,
      BALLOONS[Math.floor(Math.random() * BALLOONS.length)],
      'floatRight'
    );
    balloons.push(balloon);
  }

  return balloons;
}

export const getSky = () => {
  const skyImage = new Image();
  skyImage.src = sky;
  return skyImage;
}
