import React from 'react';

const CounterDisplay = ({ count, loading }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-2 text-center">Current Count</h2>
      <div className="text-5xl font-bold text-purple-600 text-center">
        {loading ? '...' : count}
      </div>
    </div>
  );
};

export default CounterDisplay;