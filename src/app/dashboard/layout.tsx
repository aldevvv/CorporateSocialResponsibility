// app/dashboard/layout.tsx
import { ReactNode } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import AuthProvider from './components/AuthProvider'; // Wrapper untuk session provider

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex flex-1 flex-col lg:ml-72"> {/* lg:ml-72 = margin-left sebesar lebar sidebar di desktop */}
          <Header />
          <main className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100/50 p-4 lg:p-6 pt-16 lg:pt-6">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AuthProvider>
  );
}