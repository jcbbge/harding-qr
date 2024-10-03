import { createSignal, createEffect } from 'solid-js';
import styles from './AnimatedLetter.module.css';

const AnimatedLetter = (props) => {
  const [currentLetter, setCurrentLetter] = createSignal(props.currentLetter);
  const [newLetter, setNewLetter] = createSignal(props.newLetter);
  const [animationClass, setAnimationClass] = createSignal('');

  createEffect(() => {
    console.log('Effect triggered. Current state:', {
      currentLetter: currentLetter(),
      newLetter: newLetter(),
      direction: props.direction
    });

    if (props.newLetter !== currentLetter()) {
      console.log('Letter changed. Initiating animation.');
      
      setCurrentLetter(currentLetter());
      setNewLetter(props.newLetter);
      setAnimationClass(props.direction > 0 ? styles.rollDown : styles.rollUp);
      
      console.log('Animation class set:', animationClass());

      // Update the displayed letter after the animation
      setTimeout(() => {
        console.log('Timeout callback. Updating displayed letter.');
        setCurrentLetter(newLetter());
        console.log('New current letter:', currentLetter());

        setAnimationClass('');
        console.log('Animation class removed.');
      }, 300); // Adjust this value to match your desired animation duration
    }
  });

  return (
    <div class={styles.letterContainer}>
      <div class={`${styles.letterWrapper} ${animationClass()}`}>
        <span class={styles.letter}>{props.direction > 0 ? newLetter() : currentLetter()}</span>
        <span class={styles.letter}>{props.direction > 0 ? currentLetter() : newLetter()}</span>
      </div>
    </div>
  );
};

export default AnimatedLetter;