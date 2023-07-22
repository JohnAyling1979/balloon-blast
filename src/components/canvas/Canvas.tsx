import { createContext, useEffect, useState } from 'react';
import styles from './Canvas.module.css';

export const CanvasContext = createContext<CanvasRenderingContext2D | null>(null);

function Canvas({ children }: { children: React.ReactNode }) {
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas =  document.getElementById('canvas') as HTMLCanvasElement;

    if (canvas) {
      canvas.width = 800;
      canvas.height = 600;
      const context = canvas.getContext('2d');


      if (context) {
        setCtx(context);
      }
    }
  }, []);

  return (
    <div>
    <canvas id='canvas' className={styles.canvas} />
    {ctx && (
      <CanvasContext.Provider value={ctx}>
        {children}
      </CanvasContext.Provider>
    )}
    </div>
  );
}

export default Canvas;
