import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useClipboard } from '../hooks/useClipboard';
import { useSocket } from '../hooks/useSocket';
import { ClipboardCard } from '../components/ClipboardCard';
import { clipboardApi } from '../api/clipboard';
import {
  Search,
  LogOut,
  Settings,
  TrendingUp,
  Cloud,
  Wifi,
  WifiOff,
  Plus
} from 'lucide-react';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { items, loadItems, copyToClipboard, togglePin, deleteItem, createItem } = useClipboard();
  const { isConnected } = useSocket();
  const [searchQuery, setSearchQuery] = useState('');
  const [mostUsed, setMostUsed] = useState([]);
  const [showMostUsed, setShowMostUsed] = useState(false);
  const [newContent, setNewContent] = useState('');

  useEffect(() => {
    loadItems();
    loadMostUsed();
  }, [loadItems]);

  const loadMostUsed = async () => {
    try {
      const response = await clipboardApi.getMostUsed(5);
      if (response.success) {
        setMostUsed(response.data);
      }
    } catch (error) {
      console.error('Failed to load most used:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      try {
        const response = await clipboardApi.search(query);
        // Handle search results
      } catch (error) {
        console.error('Search failed:', error);
      }
    }
  };

  const handleAddManual = async () => {
    if (newContent.trim()) {
      await createItem(newContent, 'text');
      setNewContent('');
    }
  };

  const filteredItems = searchQuery
    ? items.filter(item =>
        item.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : items;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">CS</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">ClipSync</h1>
                <p className="text-xs text-gray-500">欢迎, {user?.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100">
                {isConnected ? (
                  <>
                    <Wifi className="w-4 h-4 text-green-600" />
                    <span className="text-xs text-green-700">已连接</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-4 h-4 text-red-600" />
                    <span className="text-xs text-red-700">未连接</span>
                  </>
                )}
              </div>

              <button
                onClick={() => setShowMostUsed(!showMostUsed)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="高频使用"
              >
                <TrendingUp className="w-5 h-5 text-gray-600" />
              </button>

              <button
                onClick={() => navigate('/settings')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="设置"
              >
                <Settings className="w-5 h-5 text-gray-600" />
              </button>

              <button
                onClick={handleLogout}
                className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                title="退出登录"
              >
                <LogOut className="w-5 h-5 text-red-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search & Actions */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="搜索剪切板内容..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="手动添加内容..."
              className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              onKeyPress={(e) => e.key === 'Enter' && handleAddManual()}
            />
            <button
              onClick={handleAddManual}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              添加
            </button>
          </div>
        </div>

        {/* Most Used Section */}
        {showMostUsed && mostUsed.length > 0 && (
          <div className="mb-6 bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary-600" />
              高频使用
            </h2>
            <div className="grid gap-3">
              {mostUsed.map((item: any) => (
                <ClipboardCard
                  key={item._id}
                  item={item}
                  onCopy={copyToClipboard}
                  onPin={togglePin}
                  onDelete={deleteItem}
                />
              ))}
            </div>
          </div>
        )}

        {/* Clipboard Items */}
        <div className="space-y-3">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <Cloud className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">暂无剪切板内容</p>
              <p className="text-sm text-gray-400 mt-1">
                复制任何内容，系统会自动同步到这里
              </p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <ClipboardCard
                key={item._id}
                item={item}
                onCopy={copyToClipboard}
                onPin={togglePin}
                onDelete={deleteItem}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};
