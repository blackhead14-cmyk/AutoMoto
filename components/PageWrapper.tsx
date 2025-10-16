
import React from 'react';

interface PageWrapperProps {
  title: string;
  children: React.ReactNode;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ title, children }) => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-surface sticky top-0 z-10 p-4 shadow-md">
        <h1 className="text-2xl font-bold text-text-primary text-center">{title}</h1>
      </header>
      <main className="p-4">
        {children}
      </main>
    </div>
  );
};

export default PageWrapper;
