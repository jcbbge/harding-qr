import * as TablerIcons from '@tabler/icons';

export function Icon(props) {
  const IconComponent = TablerIcons[props.name];
  return (
    <IconComponent
      width={props.size || 24}
      height={props.size || 24}
      stroke={props.stroke || 'currentColor'}
      stroke-width={1.5}
      {...props}
    />
  );
}
