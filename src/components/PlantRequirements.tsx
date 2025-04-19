
import React from 'react';
import { ArrowRight, CloudSun, Thermometer } from 'lucide-react';

const PlantRequirements = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold mb-6">Plant requirements</h2>
      
      {/* Pot and Soil row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-zinc-900 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span role="img" aria-label="pot" className="text-2xl">🪴</span>
            <span className="text-xl text-white">Pot</span>
          </div>
          <ArrowRight className="text-gray-400" />
        </div>
        
        <div className="bg-zinc-900 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span role="img" aria-label="soil" className="text-2xl">🌱</span>
            <span className="text-xl text-white">Soil</span>
          </div>
          <ArrowRight className="text-gray-400" />
        </div>
      </div>

      {/* Lighting */}
      <div className="bg-zinc-900 rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CloudSun className="w-6 h-6 text-yellow-300" />
            <div>
              <p className="text-xl text-white">Lighting</p>
              <p className="text-emerald-400">Part sun</p>
            </div>
          </div>
          <ArrowRight className="text-gray-400" />
        </div>
      </div>

      {/* Humidity */}
      <div className="bg-zinc-900 rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span role="img" aria-label="humidity" className="text-2xl">💧</span>
            <div>
              <p className="text-xl text-white">Humidity</p>
              <p className="text-emerald-400">High (&gt;60%)</p>
            </div>
          </div>
          <ArrowRight className="text-gray-400" />
        </div>
      </div>

      {/* Hardiness zone */}
      <div className="bg-zinc-900 rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span role="img" aria-label="hardiness zone" className="text-2xl">🗺️</span>
            <div>
              <p className="text-xl text-white">Hardiness zone</p>
              <p className="text-emerald-400">10a - 11b</p>
            </div>
          </div>
          <ArrowRight className="text-gray-400" />
        </div>
      </div>

      {/* Temperature */}
      <div className="bg-zinc-900 rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Thermometer className="w-6 h-6 text-blue-400" />
            <div>
              <p className="text-xl text-white">Temperature</p>
              <p className="text-emerald-400">73°F - 95°F</p>
            </div>
          </div>
          <ArrowRight className="text-gray-400" />
        </div>
      </div>
    </div>
  );
};

export default PlantRequirements;
