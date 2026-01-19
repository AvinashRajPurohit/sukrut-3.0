'use client';

import { useState } from 'react';

export default function Tabs({ tabs, defaultTab, children, className = '' }) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const activeTabContent = tabs.find(tab => tab.id === activeTab);

  return (
    <div className={className}>
      <div className="border-b border-slate-200 dark:border-slate-700 mb-6">
        <nav className="flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors cursor-pointer
                  ${activeTab === tab.id
                    ? 'border-[#E39A2E] text-[#E39A2E]'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                  }
                `}
              >
                {Icon && <Icon className="w-5 h-5" />}
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
      <div>
        {activeTabContent && activeTabContent.content}
      </div>
    </div>
  );
}
