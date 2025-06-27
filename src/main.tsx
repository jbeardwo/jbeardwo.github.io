// src/main.tsx (or src/index.tsx)
import React from 'react';
import ReactDOM from 'react-dom/client'; // For React 18+
import './index.css'; // Import global styles
import App from './App'; // Import your main App component

// Get the root DOM element where your React app will be mounted
const rootElement = document.getElementById('root');

// Ensure the root element exists before rendering
if (rootElement) {
  // Create a React root and render your App component
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("Root element with ID 'root' not found in the DOM.");
}
