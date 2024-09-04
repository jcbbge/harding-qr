import { createEffect, onError } from 'solid-js';

const DebugWrapper = props => {
  createEffect(() => {
    console.log('Debug:', props.label, props.value);
  });

  onError(err => {
    console.error(`Error in ${props.label}:`, err);
  });

  return <>{props.children}</>;
};

export default DebugWrapper;
