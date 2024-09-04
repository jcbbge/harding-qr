import { createSignal, createEffect } from 'solid-js';
import NameGrid from '../components/interface/NameGrid';
import { action, useAction, useSubmission } from '@solidjs/router';

const Scrumble = () => {
  const [timeLeft, setTimeLeft] = createSignal(60); // 60 seconds = 1 minute

  let timerInterval;

  // Start the timer
  timerInterval = setInterval(() => {
    setTimeLeft(prev => {
      if (prev <= 0) {
        clearInterval(timerInterval);
        return 0;
      }
      return prev - 1;
    });
  }, 1000);

  const handleLetterUnlock = () => {
    console.log('letter unlocked - inside Scrumble.jsx');
  };
  // Format time as MM:SS
  const formattedTime = () => {
    const minutes = Math.floor(timeLeft() / 60);
    const seconds = timeLeft() % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <div class="top-column">
        <NameGrid
          company={company()}
          role={role()}
          onLetterUnlock={handleLetterUnlock}
        />
      </div>
      {/* <div class="timer-container">
        <div id="timer">{formattedTime()}</div>
      </div> */}
      <div class="bottom-column">
        <p>Scrumble #92734</p>
      </div>
    </>
  );
};

export default Scrumble;
