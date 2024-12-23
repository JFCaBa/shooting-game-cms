import { useState } from 'react';
import { Users, Database, Award, History, Wallet, LogOut, Earth, Map as MapIcon } from 'lucide-react';
import PlayersList from '../resources/players/PlayersList';
import DronesList from '../resources/drones/DronesList';
import AchievementsList from '../resources/achievements/AchievementsList';
import RewardsList from '../resources/rewards/RewardsList';
import TokenBalancesList from '../resources/token-balances/TokenBalancesList';
import GameMap from '../resources/map/GameMap';
import GeoObjects from '../resources/geo-objects/GeoObjectsList';
import { useAuth } from '../../contexts/AuthContext';

const Layout = () => {
    const { logout } = useAuth();
    const [activeTab, setActiveTab] = useState('players');

    const navItems = [
        { id: 'players', icon: Users, label: 'Players' },
        { id: 'drones', icon: Database, label: 'Drones' },
        { id: 'achievements', icon: Award, label: 'Achievements' },
        { id: 'rewards', icon: History, label: 'Rewards' },
        { id: 'balances', icon: Wallet, label: 'Token Balances' },
        { id: 'geoObject', icon: Earth, label: 'Geo Objects' },
        { id: 'map', icon: MapIcon, label: 'Game Map' } 
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
            case 'geoObject':
                return <GeoObjects />;
            case 'map':                 
                return <GameMap />;
            default:
                return <PlayersList />;
        }
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="bg-white border-b">
                <div className="px-6 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Shooting Game CMS
                    </h1>
                    <button
                        onClick={logout}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                    >
                        <LogOut size={18} />
                        <span>Sign out</span>
                    </button>
                </div>
            </header>

            <div className="flex">
                {/* Sidebar */}
                <nav className="w-64 border-r min-h-screen bg-gray-50">
                    <ul className="py-4">
                        {navItems.map(({ id, icon: Icon, label }) => (
                            <li key={id}>
                                <button
                                    onClick={() => setActiveTab(id)}
                                    className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-colors ${
                                        activeTab === id
                                            ? 'bg-white text-blue-600 border-r-2 border-blue-600'
                                            : 'text-gray-700 hover:bg-white'
                                    }`}
                                >
                                    <Icon className="shrink-0" size={20} />
                                    <span className="text-sm font-medium">{label}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Main Content */}
                <main className="flex-1 p-6 bg-gray-50">
                    <div className="max-w-7xl mx-auto">
                        {renderContent()}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;