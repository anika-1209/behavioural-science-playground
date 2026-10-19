import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { sharer } from './lib/share';
import './styles/global.css';

// Retry any agreed first plays that couldn't be sent last time (offline, for example).
void sharer.flushAnswers();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
