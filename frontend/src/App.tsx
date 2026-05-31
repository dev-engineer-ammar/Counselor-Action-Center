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
      <div className="min-h-screen bg-[#f6f8fb] text-slate-900 font-sans antialiased">
        <header className="bg-white/95 backdrop-blur border-b border-slate-200 h-16 sticky top-0 z-40 shadow-sm shadow-slate-100/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-slate-950 text-white grid place-items-center text-sm font-black shadow-sm">
                ZA
              </div>
              <div>
                <h1 className="text-sm sm:text-base font-black uppercase tracking-wider text-slate-900">Student Action Center</h1>
                <p className="hidden sm:block text-xs font-medium text-slate-500">Counselor workload and student risk view</p>
              </div>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-md">
              Live Workspace
            </span>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <ActionCenterPage />
        </main>
      </div>
    </QueryClientProvider>
  );
};

export default App;
