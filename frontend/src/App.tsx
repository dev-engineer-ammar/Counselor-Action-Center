import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ActionCenterPage } from './pages/ActionCenterPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
        <header className="bg-white border-b border-slate-200 h-16 sticky top-0 z-40 shadow-sm shadow-slate-100/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-6 w-2 bg-blue-600 rounded-sm" />
              <h1 className="text-md font-black uppercase tracking-wider text-slate-800">Student Action Center</h1>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-100 px-2.5 py-1 rounded-md">
              Counselor Action Center
            </span>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ActionCenterPage />
        </main>
      </div>
    </QueryClientProvider>
  );
};

export default App;