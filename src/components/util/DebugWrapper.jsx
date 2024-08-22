
import { createEffect } from 'solid-js';

const DebugWrapper = (props) => {
  createEffect(() => {
    console.log("dbugger:", props.label, props.value);
  });

  return <>{props.children}</>;
};

export default DebugWrapper;