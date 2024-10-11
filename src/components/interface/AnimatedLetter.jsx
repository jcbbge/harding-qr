import { createSignal, createEffect } from 'solid-js';
import styles from './AnimatedLetter.module.css';

const AnimatedLetter = (props) => {
	console.log('AnimatedLetter: Component rendered with props', props);

	const [currentLetter, setCurrentLetter] = createSignal(props.currentLetter);
	const [newLetter, setNewLetter] = createSignal(props.newLetter);
	const [animationClass, setAnimationClass] = createSignal('');
	const [animationSpeed, setAnimationSpeed] = createSignal('velocity1');

	createEffect(() => {
		if (props.newLetter !== currentLetter()) {
			console.log(`AnimatedLetter: Letter changing from ${currentLetter()} to ${props.newLetter}, direction: ${props.direction}`);
			
			setNewLetter(props.newLetter);
			const newAnimationClass = props.direction > 0 ? styles.rollDown : styles.rollUp;
			console.log(`AnimatedLetter: Setting animation class to ${newAnimationClass}`);
			setAnimationClass(newAnimationClass);
			setAnimationSpeed(styles[`velocity${props.speed}`]);
			
			setTimeout(() => {
				setCurrentLetter(props.newLetter);
				setAnimationClass('');
				console.log('AnimatedLetter: Animation completed, class reset');
			}, 300);
		}
	});

	return (
		<div class={styles.letterContainer}>
			<div class={`${styles.letterWrapper}`}>
				<span class={`styles.letter ${animationClass()} ${animationSpeed()}`}>{currentLetter()}</span>
				<span class={`styles.letter ${animationClass()} ${animationSpeed()}`}>{newLetter()}</span>
			</div>
		</div>
	);
};

export default AnimatedLetter;