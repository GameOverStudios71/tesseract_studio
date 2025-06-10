
import React from 'react';
import LayoutEditor from './components/LayoutEditor';
import { ThemeProvider } from './contexts/ThemeContext';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <div className="h-screen bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
        <LayoutEditor />
      </div>
    </ThemeProvider>
  );
};

export default App;