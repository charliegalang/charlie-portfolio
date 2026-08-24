import React from 'react';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-theme-primary text-theme-primary flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Admin Dashboard</h1>
        <p className="text-theme-secondary">Welcome to your portfolio management area.</p>
        <a href="/" className="mt-8 inline-block px-6 py-2 bg-[#EAB308] text-black rounded-full font-bold">
          Back to Portfolio
        </a>
      </div>
    </div>
  );
};

export default Dashboard;
