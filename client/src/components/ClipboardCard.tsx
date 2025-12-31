import { ClipboardItem } from '../api/clipboard';
import { formatDistanceToNow } from 'date-fns';
import { Copy, Pin, Trash2, FileText, Image, File, Code } from 'lucide-react';
import { zhCN } from 'date-fns/locale';

interface ClipboardCardProps {
  item: ClipboardItem;
  onCopy: (id: string, content: string) => void;
  onPin: (id: string, isPinned: boolean) => void;
  onDelete: (id: string) => void;
}

export const ClipboardCard = ({ item, onCopy, onPin, onDelete }: ClipboardCardProps) => {
  const getIcon = () => {
    switch (item.type) {
      case 'image':
        return <Image className="w-4 h-4" />;
      case 'file':
        return <File className="w-4 h-4" />;
      case 'html':
        return <Code className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const truncateContent = (content: string, maxLength = 200) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <div
      className={`
        group relative bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200
        border border-gray-200 p-4
        ${item.isPinned ? 'ring-2 ring-primary-400 bg-primary-50' : ''}
      `}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1 text-gray-400">
          {getIcon()}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true, locale: zhCN })}
            </span>
            {item.usageCount > 0 && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                使用 {item.usageCount} 次
              </span>
            )}
          </div>

          <p className="text-sm text-gray-900 whitespace-pre-wrap break-words">
            {truncateContent(item.content)}
          </p>

          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {item.tags.map((tag, index) => (
                <span
                  key={index}
                  className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onCopy(item._id, item.content)}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            title="复制"
          >
            <Copy className="w-4 h-4 text-gray-600" />
          </button>

          <button
            onClick={() => onPin(item._id, item.isPinned)}
            className={`p-2 hover:bg-gray-100 rounded-md transition-colors ${
              item.isPinned ? 'text-primary-600' : 'text-gray-600'
            }`}
            title={item.isPinned ? '取消固定' : '固定'}
          >
            <Pin className="w-4 h-4" fill={item.isPinned ? 'currentColor' : 'none'} />
          </button>

          <button
            onClick={() => onDelete(item._id)}
            className="p-2 hover:bg-red-50 rounded-md transition-colors"
            title="删除"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </div>
    </div>
  );
};
