import React from 'react';

const CounterControls = ({ onIncrement, onDecrement, loading }) => {
  return (
    <div className="flex gap-4 mt-6">
      <button
        onClick={onDecrement}
        disabled={loading}
        className="flex-1 bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 font-semibold"
      >
        Decrement
      </button>
      <button
        onClick={onIncrement}
        disabled={loading}
        className="flex-1 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 font-semibold"
      >
        Increment
      </button>
    </div>
  );
};

export default CounterControls;