import React from 'react';

const StatCard = ({ icon, value, label, customStyles }) => {
  return (
    <div className="bg-white rounded-md shadow-sm flex overflow-hidden">
      <div className={`flex items-center justify-center w-16 h-16 ${customStyles || 'bg-green-600'}`}>
        {icon}
      </div>
      <div className="p-4 flex flex-col justify-center">
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-xs text-gray-600 uppercase tracking-wider">{label}</div>
      </div>
    </div>
  );
};

export default StatCard;