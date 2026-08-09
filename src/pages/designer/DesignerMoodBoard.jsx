import { useState, useEffect } from 'react';
import { apiGetMoodBoard } from '../../api/api';
import Breadcrumb from '../../components/ui/Breadcrumb';

const DesignerMoodBoard = ({ navigateTo }) => {
  const [moodBoard, setMoodBoard] = useState([]);

  useEffect(() => {
    apiGetMoodBoard().then(setMoodBoard).catch(console.error);
  }, []);

  return (
    <div className="space-y-5 animate-fade-in">
      <Breadcrumb onClick={() => navigateTo('dashboard')} label="Dashboard" />
      <h2 className="text-[24px] font-extrabold text-slate-900 tracking-tight">Mood Board</h2>
      <p className="text-sm text-slate-500">SS25 Inspiration — Earth Tones & Heritage</p>
      <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4">
        {moodBoard.map((tile, i) => {
          if (tile.type === 'color') {
            const heights = ['h-32', 'h-40', 'h-36', 'h-28'];
            return (
              <div key={i} className={`${heights[i % 4]} rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer relative overflow-hidden break-inside-avoid animate-fade-in`} style={{ background: tile.color, animationDelay: `${i * 80}ms` }}>
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/40 to-transparent">
                  <p className="text-white text-sm font-semibold">{tile.label}</p>
                  <p className="text-white/70 text-xs font-mono">{tile.hex}</p>
                </div>
              </div>
            );
          }
          return (
            <div key={i} className="rounded-2xl p-5 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer break-inside-avoid animate-fade-in" style={{ background: tile.color, animationDelay: `${i * 80}ms` }}>
              <p className="text-sm font-medium text-slate-700 whitespace-pre-line">{tile.text}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DesignerMoodBoard;
