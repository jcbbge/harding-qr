import { createSignal, onMount, onCleanup, ErrorBoundary } from 'solid-js';
import { ThemeProvider } from './contexts/ThemeContext';

import ThemeSwitcher from './components/interface/ThemeSwitcher';
import AppearanceToggle from './components/interface/AppearanceToggle';
import NameGrid from './components/interface/NameGrid';
import "./App.css";

const [company, setCompany] = createSignal('');
const [role, setRole] = createSignal('');
const [timeLeft, setTimeLeft] = createSignal(60); // 60 seconds = 1 minute

function App(){

    let timerInterval;

    onMount(() => {
        const urlPath = window.location.pathname;
        let pathSegments = urlPath.split('/').filter(Boolean);
    
        if( pathSegments.length >= 2 ){
            console.log({urlPath, pathSegments});
            setCompany(pathSegments[0]);
            setRole(pathSegments[1]);
        }

        // Start the timer
        timerInterval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 0) {
                    clearInterval(timerInterval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    });

    onCleanup(() => {
        // window.removeEventListener("wheel", handleScroll);
        // window.removeEventListener("scroll", handleScroll);
        window.removeEventListener("keydown", handleScroll);
        clearInterval(timerInterval); // Clear the timer interval
    });

    function handleLetterUnlock(){
        console.log('letter unlocked - inside app.jsx');
    }

    // Format time as MM:SS
    const formattedTime = () => {
        const minutes = Math.floor(timeLeft() / 60);
        const seconds = timeLeft() % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <ThemeProvider>
            <ErrorBoundary fallback={(err) => <div>Error: {err}</div>}>
                <div class="theme-controls">
                    <ThemeSwitcher></ThemeSwitcher>
                    <AppearanceToggle></AppearanceToggle>
                </div>
                <div class="timer-container">
                    <div id="timer">{formattedTime()}</div>
                </div>
                <div class="top-column">
                    <NameGrid company={company()} role={role()} onLetterUnlock={handleLetterUnlock}></NameGrid>
                </div>
                <div class="bottom-column">
                    <h1>Welcome to my portfolio</h1>
                    <p>This is a portfolio for my work</p>
                </div>
            </ErrorBoundary>
        </ThemeProvider>
    );
}

export default App;