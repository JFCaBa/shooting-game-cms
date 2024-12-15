import { useState } from 'react';
import { Users, Database, Award, History, Wallet } from 'lucide-react';
import PlayersList from '../resources/players/PlayersList';
import DronesList from '../resources/drones/DronesList';
import AchievementsList from '../resources/achievements/AchievementsList';
import RewardsList from '../resources/rewards/RewardsList';
import TokenBalancesList from '../resources/token-balances/TokenBalancesList';

const Layout = () => {
  const [activeTab, setActiveTab] = useState('players');

  const navItems = [
    { id: 'players', icon: Users, label: 'Players' },
    { id: 'drones', icon: Database, label: 'Drones' },
    { id: 'achievements', icon: Award, label: 'Achievements' },
    { id: 'rewards', icon: History, label: 'Rewards' },
    { id: 'balances', icon: Wallet, label: 'Token Balances' }
  ];

  const renderContent = () => {
    switch(activeTab) {
      case 'players':
        return <PlayersList />;
      case 'drones':
        return <DronesList />;
      case 'achievements':
        return <AchievementsList />;
      case 'rewards':
        return <RewardsList />;
      case 'balances':
        return <TokenBalancesList />;
      default:
        return <PlayersList />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-semibold text-gray-900">Shooting Game CMS</h1>
        </div>
      </header>

      <div className="flex h-[calc(100vh-64px)]">
        {/* Sidebar */}
        <nav className="w-64 bg-white border-r border-gray-200 py-4">
          <ul className="space-y-1 px-2">
            {navItems.map(({ id, icon: Icon, label }) => (
              <li key={id}>
                <button
                  onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === id 
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={18} />
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Layout;