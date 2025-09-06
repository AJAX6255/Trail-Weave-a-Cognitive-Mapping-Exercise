import React from 'react';
import { useStore } from '../store/gameStore';

interface SettingsPanelProps {
  onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ onClose }) => {
  const theme = useStore(state => state.theme);
  const unlocked = useStore(state => state.unlocked);
  const setTheme = useStore(state => state.setTheme);
  const toggleHighContrast = useStore(state => state.toggleHighContrast);
  const setFontSizeScale = useStore(state => state.setFontSizeScale);
  const unlockTheme = useStore(state => state.unlockTheme);
  
  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50" onClick={onClose}>
        <div className="bg-[var(--color-background)] text-[var(--color-text-main)] p-6 rounded-xl shadow-2xl w-11/12 max-w-sm" onClick={e => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-6 text-center">Settings</h2>
            <div className="flex flex-col gap-4">
                <label className="flex flex-col gap-1">
                    <span className="text-sm font-medium">Theme</span>
                    <select className="w-full h-12 px-4 border border-gray-300 rounded-lg bg-white cursor-pointer" value={theme.id} onChange={e => setTheme(e.target.value)}>
                        <option value="classic">Classic</option>
                        <option value="noir">Noir</option>
                        <option value="undersea" disabled={!unlocked.undersea}>Undersea {unlocked.undersea ? ' unlocked' : '(Locked)'}</option>
                        <option value="jungle" disabled={!unlocked.jungle}>Jungle {unlocked.jungle ? ' unlocked' : '(Locked)'}</option>
                    </select>
                </label>
                <button className="w-full h-12 border border-gray-300 rounded-lg bg-white transition-colors hover:bg-gray-100" onClick={toggleHighContrast}>
                    High Contrast: {theme.highContrast ? 'On' : 'Off'}
                </button>
                <div>
                    <span className="text-sm font-medium">Font Size</span>
                    <div className="grid grid-cols-3 gap-2 mt-1">
                        <button className="h-12 border border-gray-300 rounded-lg bg-white transition-colors hover:bg-gray-100" onClick={() => setFontSizeScale(1.0)}>1x</button>
                        <button className="h-12 border border-gray-300 rounded-lg bg-white transition-colors hover:bg-gray-100" onClick={() => setFontSizeScale(1.25)}>1.25x</button>
                        <button className="h-12 border border-gray-300 rounded-lg bg-white transition-colors hover:bg-gray-100" onClick={() => setFontSizeScale(1.5)}>1.5x</button>
                    </div>
                </div>
                <div className="border-t pt-4 mt-2">
                    <button className="w-full h-12 bg-blue-500 text-white rounded-lg transition-colors hover:bg-blue-600" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    </div>
  );
}

export default SettingsPanel;