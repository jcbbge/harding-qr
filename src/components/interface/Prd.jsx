// src/components/PRD.jsx
import { marked } from 'marked';

const PRD = (props) => {
  console.log('PRD: Props', props);
  const htmlContent = () => marked(props.content);

  return (
    <div class="prd-container">
      <div innerHTML={htmlContent()} />
      <p>PRD data goes here...</p>
    </div>
  );
};

export default PRD;