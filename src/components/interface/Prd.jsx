// src/components/PRD.jsx
import { createMemo, Show, For } from 'solid-js';
import { marked } from 'marked';
import styles from './Prd.module.css';
import { useTheme } from '../../contexts/ThemeContext';

const PRD = (props) => {
  const [theme] = useTheme();

  const parsedMarkdownContent = createMemo(() => {
    if (props.md_content) {
      return marked(props.md_content);
    }
    return '';
  });

  const today = new Date().toISOString().split('T')[0];

  const footerIcons = [
    {
      svg: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      ),
      href: 'mailto:' + ['abc', 'joshuarussell.xyz'].join('@') + 
           '?subject=Hello%20Joshua&body=' + 
           encodeURIComponent(`Hey Joshua, I loved your website and I want to make a spot for you on my team...`),
      alt: 'Send email',
      text: 'Email Joshua'
    },
    {
      svg: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
          <path d="M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12z" />
          <path d="M16 3v4" />
          <path d="M8 3v4" />
          <path d="M4 11h16" />
          <path d="M11 15h1" />
          <path d="M12 15v3" />
        </svg>
      ),
      href: 'https://cal.com/joshuarussell/30min',
      alt: 'Schedule',
      text: 'Meet with Joshua'
    },
    {
      svg: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect x="2" y="9" width="4" height="12" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      ),
      href: 'https://www.linkedin.com/in/joshua-g-b2430b11b/',
      alt: 'LinkedIn',
      text: 'Connect w/ Joshua'
    },
    {
      svg: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
          <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
          <path d="M7 11l5 5l5 -5" />
          <path d="M12 4l0 12" />
        </svg>
      ),
      href: 'https://docs.google.com/document/d/1vTBwufdUAmp0oU3Z6FzdY350lA5zSZFCzs-_prPSiaw/export?format=pdf',
      alt: 'Download Resume',
      text: 'Download Joshua\'s Resume'
    }
  ];

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
        <table class={styles.prdHeader}>
          <tbody>
            <tr>
              <For each={footerIcons}>
                {(icon) => (
                  <td class={styles.equalWidth}>
                    <a
                      href={icon.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      class={styles.iconLink}
                      aria-label={icon.alt}
                    >
                      <div class={styles.icon}>
                        {icon.svg}
                      </div>
                      <span>{icon.text}</span>
                    </a>
                  </td>
                )}
              </For>
            </tr>
            <tr>
              <td class={styles.widthMin}>Confidential</td>
              <td colspan="2" class={styles.widthAuto}>{props.company} Internal Use Only</td>
              <td class={styles.widthMin}>Page 1 of 1</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PRD;
