import { createResource, createEffect, createMemo, createSignal } from 'solid-js';

export function Icon(props) {
  const [isLoading, setIsLoading] = createSignal(true);
  const iconName = createMemo(() => props.name);

  const [svg, { refetch }] = createResource(iconName, async name => {
    setIsLoading(true);
    try {
      const response = await fetch(`/icons/${name}.svg`);
      if (!response.ok) throw new Error(`Failed to fetch icon: ${name}`);
      const svgText = await response.text();
      setIsLoading(false);
      return svgText;
    } catch (error) {
      console.error(`Failed to load icon: ${name}`, error);
      setIsLoading(false);
      return null;
    }
  });

  createEffect(() => {
    iconName(); // Track changes to iconName
    refetch(); // Force refetch when iconName changes
  });

  return (
    <span
      innerHTML={svg() || ''}
      {...props}
      style={{
        display: 'inline-block',
        width: props.size + 'px',
        height: props.size + 'px',
        visibility: isLoading() ? 'hidden' : 'visible',
        ...props.style
      }}
    />
  );
}
