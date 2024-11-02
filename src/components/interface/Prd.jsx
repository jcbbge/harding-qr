// src/components/PRD.jsx
import { createMemo, Show } from 'solid-js';
import { marked } from 'marked';
import styles from './Prd.module.css';

const PRD = (props) => {
  const parsedMarkdownContent = createMemo(() => {
    if (props.md_content) {
      return marked(props.md_content);
    }
    return '';
  });

  const today = new Date().toISOString().split('T')[0];

  return (
    <div class={styles.prdWrapper}>
      <div class={styles.prdContainer}>
        <table class={styles.prdHeader}>
          <tbody>
            <tr>
              <td colspan="2" rowspan="2" class={styles.widthAuto}>
                <h1 class={styles.title}>{props.prd_title || 'Product Requirements Document'}</h1>
                <span class={styles.subtitle}>{props.prd_subtitle || `${props.company} - ${props.role}`}</span>
              </td>
              <th>Version</th>
              <td class={styles.widthMin}>v1.0</td>
            </tr>
            <tr>
              <th>Updated</th>
              <td class={styles.widthMin}><time>{today}</time></td>
            </tr>
            <tr>
              <th class={styles.widthMin}>Author</th>
              <td class={styles.widthAuto}>AI Generated</td>
              <th class={styles.widthMin}>Status</th>
              <td>Draft</td>
            </tr>
          </tbody>
        </table>
        
        <div class={styles.prdContent}>
          <Show 
            when={parsedMarkdownContent()} 
            fallback={<p>Loading PRD content...</p>}
          >
            <div class={styles.markdownContent} innerHTML={parsedMarkdownContent()} />
          </Show>
        </div>
        
        <table class={styles.prdFooter}>
          <tbody>
            <tr>
              <td>Confidential</td>
              <td class={styles.widthAuto}>{props.company} Internal Use Only</td>
              <td class={styles.widthMin}>Page 1 of 1</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PRD;
