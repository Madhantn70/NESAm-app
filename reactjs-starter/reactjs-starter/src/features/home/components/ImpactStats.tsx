import React from 'react';
import { Users, Heart, Calendar, IndianRupee } from 'lucide-react';
import { useImpactStatsViewModel } from '../viewModels/useImpactStatsViewModel';
import { IconName } from '../models/view/home';

const iconMap: Record<IconName, React.ElementType> = {
  users: Users,
  heart: Heart,
  calendar: Calendar,
  rupee: IndianRupee
};

export function ImpactStats() {
  const { data, loading, error } = useImpactStatsViewModel();

  if (loading) {
    return (
      <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm w-full animate-pulse h-64">
        <div className="h-6 w-1/2 bg-gray-200 mx-auto rounded mb-8"></div>
        <div className="grid grid-cols-2 gap-4">
          {[1,2,3,4].map(i => (
             <div key={i} className="h-24 bg-gray-100 rounded-xl"></div>
          ))}
        </div>
      </section>
    );
  }

  if (error || !data) {
    return (
      <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm w-full text-center">
        <p className="text-red-500 text-sm">Failed to load statistics.</p>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm w-full">
      <h2 className="text-lg font-semibold text-gray-900 mb-6 text-center">
        Community Impact
      </h2>
      <div className="grid grid-cols-2 gap-4">
        {data.stats.map((stat, idx) => {
          const IconComponent = iconMap[stat.iconName];
          return (
            <div key={idx} className="bg-gray-50 rounded-xl p-4 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center mb-3">
                <IconComponent className="w-6 h-6 text-teal-600" strokeWidth={2} />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-xs text-gray-500 font-medium">{stat.label}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
