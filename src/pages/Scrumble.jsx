import { createSignal, createEffect} from 'solid-js';
import NameGrid from '../components/interface/NameGrid';
import { action, useAction, useSubmission } from "@solidjs/router";

const Scrumble = () => {

  const handleLetterUnlock = () => {
    console.log('letter unlocked - inside Scrumble.jsx');
  };

  return (
    <div>
      <nav>
        <a href="/">homepage</a>
      </nav>  

      <h1>Scrumble Page</h1>
      <p>This is the Scrumble page</p>
      <NameGrid company={company()} role={role()} onLetterUnlock={handleLetterUnlock} />
    </div>
  );
};

export default Scrumble;
