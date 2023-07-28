import { useState } from "react";
import styles from './Atributes.module.css';

function Atributes({canvasWidth}: {canvasWidth: number}) {
  const [show, setShow] = useState(false);

  if (!show) {
    return (
      <div className={styles.buttonContainer} style={{ minWidth: canvasWidth}}>
        <button className={styles.button} onClick={() => setShow(true)}>Credits</button>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.closeButtonContainer}>
        <button className={styles.closeButton} onClick={() => setShow(false)}>X</button>
      </div>
      <div className={styles.credits}>
        Credits
      </div>
      <div>
        <div>Balloon Font: <a href="https://www.fontspace.com/ji-solid-balloon-caps-font-f5466">Solid Balloon Caps</a></div>
      </div>
      <div>
        Balloons: <a href="https://www.vecteezy.com/vector-art/5007767-shiny-colorful-balloons-set-isolate">Cartoon Balloon Vectors by Vecteezy</a>
      </div>
      <div>
        Buttons: <a href="https://www.freepik.com/free-vector/colorful-game-buttons-set_12953007.htm#query=game%20buttons&position=20&from_view=keyword&track=ais">Image by jcomp</a> on Freepik
      </div>
      <div className={styles.music}>
        Music:
      </div>
      <div>
        <div>"Balloon Game" Kevin MacLeod <a href="https://incompetech.com/music/royalty-free/music.html" target="_blank" rel="noreferrer">incompetech.com</a></div>
        <a href="http://creativecommons.org/licenses/by/4.0/">Licensed under Creative Commons: By Attribution 4.0 License</a>
      </div>

      <div>
        <div>"Newer Wave" Kevin MacLeod <a href="https://incompetech.com/music/royalty-free/music.html" target="_blank" rel="noreferrer">incompetech.com</a></div>
        <a href="http://creativecommons.org/licenses/by/4.0/">Licensed under Creative Commons: By Attribution 4.0 License</a>
      </div>
      <div>
        <div>"Robobozo" Kevin MacLeod <a href="https://incompetech.com/music/royalty-free/music.html" target="_blank" rel="noreferrer">incompetech.com</a></div>
        <a href="http://creativecommons.org/licenses/by/4.0/">Licensed under Creative Commons: By Attribution 4.0 License</a>
      </div>
      <div>
        <div>"Raving Energy" Kevin MacLeod <a href="https://incompetech.com/music/royalty-free/music.html" target="_blank" rel="noreferrer">incompetech.com</a></div>
        <a href="http://creativecommons.org/licenses/by/4.0/">Licensed under Creative Commons: By Attribution 4.0 License</a>
      </div>
      <div>
        <div>"Balloon Game" Kevin MacLeod <a href="https://incompetech.com/music/royalty-free/music.html" target="_blank" rel="noreferrer">incompetech.com</a></div>
        <a href="http://creativecommons.org/licenses/by/4.0/">Licensed under Creative Commons: By Attribution 4.0 License</a>
      </div>
      <div>
        <div>"Nowhere Land" Kevin MacLeod <a href="https://incompetech.com/music/royalty-free/music.html" target="_blank" rel="noreferrer">incompetech.com</a></div>
        <a href="http://creativecommons.org/licenses/by/4.0/">Licensed under Creative Commons: By Attribution 4.0 License</a>
      </div>
      <div className={styles.music}>
        SFX:
      </div>
      <div>
        <div>"Balloon Pop" Aesterial-Arts <a target="_blank" rel="noreferrer" href="https://freesound.org/people/Aesterial-Arts/sounds/633835/">freesound.org</a></div>
        <a href="http://creativecommons.org/licenses/by/4.0/">Licensed under Creative Commons: By Attribution 4.0 License</a>
      </div>
      <div>
        <div>"Balloon Boy.20" crabhead <a target="_blank" rel="noreferrer" href="https://freesound.org/people/crabhead/sounds/265228/">freesound.org</a></div>
        <a href="http://creativecommons.org/licenses/by/4.0/">Licensed under Creative Commons: By Attribution 4.0 License</a>
      </div>
      <div>
        <div>"Beeps 18" Greencouch <a target="_blank" rel="noreferrer" href="https://freesound.org/people/Greencouch/sounds/124900/">freesound.org</a></div>
        <a href="http://creativecommons.org/licenses/by/4.0/">Licensed under Creative Commons: By Attribution 4.0 License</a>
      </div>
      <div>
        <div>"AI, No" MATRIXXX_ <a target="_blank" rel="noreferrer" href="https://freesound.org/people/MATRIXXX_/sounds/453137/">freesound.org</a></div>
        <a href="http://creativecommons.org/licenses/by/4.0/">Licensed under Creative Commons: By Attribution 4.0 License</a>
      </div>
      <div>
        <div>"Beep 3" anthonychartier2020 <a target="_blank" rel="noreferrer" href="https://freesound.org/people/anthonychartier2020/sounds/560188/">freesound.org</a></div>
        <a href="http://creativecommons.org/licenses/by/4.0/">Licensed under Creative Commons: By Attribution 4.0 License</a>
      </div>
      <div>
        <div>"UI Confirmation Alert, C3.wav" InspectorJ <a target="_blank" rel="noreferrer" href="https://freesound.org/people/InspectorJ/sounds/403017/">freesound.org</a></div>
        <a href="http://creativecommons.org/licenses/by/4.0/">Licensed under Creative Commons: By Attribution 4.0 License</a>
      </div>
    </div>
  );
}

export default Atributes;
