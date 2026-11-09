import React, { useState, useEffect } from 'react';
import {
  Image, Copy, Check, ExternalLink, RefreshCw, Eye, X, Download
} from 'lucide-react';
import { apiClient } from '../apiClient';

export const MediaLibrary: React.FC = () => {
  const [files, setFiles] = useState<{ name: string; url: string; size: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await apiClient.request('/api/admin/media');
      setFiles(res.files);
    } catch (err) {
      console.error('Error fetching media:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleCopyPath = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
        <div>
          <h1 className="text-xl font-bold font-serif text-stone-900">
            Thư Viện Hình Ảnh & Tư Liệu Quà Tết (Media Assets)
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Quản lý toàn bộ hình ảnh sản phẩm trong suốt, poster sang trọng và logo chính hãng của thương hiệu
          </p>
        </div>

        <button
          onClick={fetchMedia}
          className="flex items-center gap-1.5 px-3 py-2 border border-stone-200 hover:bg-stone-50 rounded-xl text-stone-700 text-xs font-semibold transition cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 text-stone-500" />
          <span>Làm Mới Danh Sách</span>
        </button>
      </div>

      {/* Grid of images */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {loading ? (
          <div className="col-span-full py-12 text-center text-stone-400">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-stone-300" />
            Đang tải danh mục tư liệu hình ảnh...
          </div>
        ) : files.length === 0 ? (
          <div className="col-span-full py-12 text-center text-stone-400">
            Chưa có tệp hình ảnh nào trong thư mục media.
          </div>
        ) : (
          files.map((file) => (
            <div
              key={file.name}
              className="bg-white rounded-xl border border-stone-200/80 overflow-hidden shadow-xs hover:border-[#D4AF37] transition group flex flex-col justify-between"
            >
              {/* Thumbnail */}
              <div
                onClick={() => setPreviewImage(file.url)}
                className="h-36 bg-gradient-to-b from-stone-50 to-stone-100 flex items-center justify-center p-3 relative cursor-pointer overflow-hidden"
              >
                <img
                  src={file.url}
                  alt={file.name}
                  className="max-h-full max-w-full object-contain group-hover:scale-110 transition duration-300"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white">
                  <Eye className="w-5 h-5" />
                </div>
              </div>

              {/* Info & Copy */}
              <div className="p-3 bg-white space-y-2 border-t border-stone-100 text-xs">
                <div>
                  <span className="font-semibold text-stone-900 block truncate text-[11px]" title={file.name}>
                    {file.name}
                  </span>
                  <span className="text-[10px] text-stone-400">{file.size}</span>
                </div>

                <button
                  onClick={() => handleCopyPath(file.url)}
                  className={`w-full py-1.5 px-2 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition cursor-pointer ${
                    copiedUrl === file.url
                      ? 'bg-emerald-600 text-white'
                      : 'bg-stone-100 hover:bg-[#B52C32] hover:text-white text-stone-700'
                  }`}
                >
                  {copiedUrl === file.url ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedUrl === file.url ? 'Đã chép link' : 'Chép URL'}</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-2xl max-h-[85vh] bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col"
          >
            <div className="p-4 bg-stone-900 text-white flex items-center justify-between text-xs">
              <span className="font-mono truncate">{previewImage}</span>
              <button
                onClick={() => setPreviewImage(null)}
                className="p-1 hover:bg-stone-800 rounded-lg text-stone-300 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 bg-stone-100 flex items-center justify-center overflow-auto">
              <img
                src={previewImage}
                alt="Preview"
                className="max-h-[60vh] object-contain drop-shadow-xl"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
