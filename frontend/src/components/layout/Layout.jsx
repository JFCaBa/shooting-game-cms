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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="px-4 py-3">
          <h1 className="text-2xl">Shooting Game CMS</h1>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 border-r min-h-screen">
          <ul className="py-2">
            {navItems.map(({ id, icon: Icon, label }) => (
              <li key={id}>
                <button
                  onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-left transition-colors ${
                    activeTab === id 
                      ? 'bg-gray-100'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <Icon className="shrink-0" size={20} />
                  <span className="text-base">{label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Layout;