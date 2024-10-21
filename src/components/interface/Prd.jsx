// src/components/PRD.jsx
import { createMemo, Show, createEffect } from 'solid-js';
import { marked } from 'marked';
import styles from './Prd.module.css';

const PRD = (props) => {
  console.log('PRD: Component rendering with props:', props); // Debug log

  const parsedMarkdownContent = createMemo(() => {
    console.log('PRD: Parsing Markdown content, raw content:', props.md_content); // Debug log
    if (props.md_content) {
      const parsed = marked(props.md_content);
      console.log('PRD: Parsed Markdown content:', parsed); // Debug log
      return parsed;
    }
    console.log('PRD: No Markdown content available');
    return '';
  });

  createEffect(() => {
    console.log('PRD: Effect running, current parsed content:', parsedMarkdownContent()); // Debug log
  });

  const today = new Date().toISOString().split('T')[0];

  return (
    <div class={styles.prdContainer}>
      <table class={styles.prdHeader}>
        <tbody>
          <tr>
            <td colspan="2" rowspan="2" class={styles.widthAuto}>
              <h1 class={styles.title}>Product Requirements Document</h1>
              <span class={styles.subtitle}>{props.company} - {props.role}</span>
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
          <div innerHTML={parsedMarkdownContent()} />
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
  );
};

export default PRD;
