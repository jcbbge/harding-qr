import { createSignal } from 'solid-js';
import { useParams } from '@solidjs/router';
import NameGrid from '../components/interface/NameGrid';

const Roleco = props => {
  const [role, setRole] = createSignal(props.role);
  const [company, setCompany] = createSignal(props.company);
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

  const params = useParams();
  const handleLetterUnlock = () => {
    console.log('letter unlocked - inside Roleco.jsx');
  };
  // Format time as MM:SS
  const formattedTime = () => {
    const minutes = Math.floor(timeLeft() / 60);
    const seconds = timeLeft() % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <div class="timer-container">
        <div id="timer">{formattedTime()}</div>
      </div>
      <div class="top-column">
        <NameGrid company={company()} role={role()} onLetterUnlock={handleLetterUnlock} />
      </div>
      <div class="bottom-column">
        <p>This is the Roleco page</p>
        <h5>Role: {role()}</h5>
        <h5>Company: {company()}</h5>
      </div>
    </>
  );
};

export default Roleco;
