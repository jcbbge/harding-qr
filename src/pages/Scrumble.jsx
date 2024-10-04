import { createSignal, createEffect } from 'solid-js';
import NameGrid from '../components/interface/NameGrid';
import { action, useAction, useSubmission } from '@solidjs/router';

const Scrumble = () => {
  const [timeLeft, setTimeLeft] = createSignal(60); // 60 seconds = 1 minute
  const [heroUnlocked, setHeroUnlocked] = createSignal(false);

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
  function handleAllLettersMatched() {
    setHeroUnlocked(true);
    console.log('All letters matched, hero section unlocked');
  }
  // Format time as MM:SS
  const formattedTime = () => {
    const minutes = Math.floor(timeLeft() / 60);
    const seconds = timeLeft() % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const wordList = ['DEBUG', 'QUEUE', 'MERGE'];

  return (
    <div class="main-content">
      <div class={`snap-container ${heroUnlocked() ? 'unlocked' : ''}`}>
        <section class="snap-section hero-section">
            <h1>Scrumble #72438</h1>
          <div class="name-grid-container">
            <NameGrid
              company={company()}
              role={role()}
              onLetterUnlock={handleLetterUnlock}
              onAllLettersMatched={handleAllLettersMatched}
              wordList={wordList}
            />
          </div>
          <div class="timer-container">
            <div id="timer">Time: {formattedTime()}</div>
          </div>
          <div class="score-container">
            <div id="score">Score: 1000</div>
          </div>
          <div class="level-container">
            <div id="level">Difficulty: med</div>
          </div>
        </section>
        <section class="snap-section">
          <h2>Section 2</h2>
          <p>Content for section 2 goes here.</p>
        </section>
        <section class="snap-section">
          <h2>Section 3</h2>
          <p>Content for section 3 goes here.</p>
        </section>
      </div>
    </div>
  );
};

export default Scrumble;
