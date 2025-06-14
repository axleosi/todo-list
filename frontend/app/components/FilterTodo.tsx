import React from 'react'

interface FilterTodoProps {
  setFilter: React.Dispatch<React.SetStateAction<'all' | 'active' | 'completed'>>;
  light: boolean;
}

const FilterTodo: React.FC<FilterTodoProps> = ({ setFilter, light }) => {
  return (
    <div
      className={`
        w-full max-w-[400px] flex flex-wrap items-center justify-between 
        gap-2 px-6 py-2.5 rounded-lg shadow-md 
        ${light ? 'bg-white text-black' : 'bg-[rgb(22,22,120)] text-white'}
      `}
    >
      <button
        className="flex-1 text-center text-sm py-1 px-2 hover:underline"
        onClick={() => setFilter('all')}
      >
        All
      </button>
      <button
        className="flex-1 text-center text-sm py-1 px-2 hover:underline"
        onClick={() => setFilter('active')}
      >
        Active
      </button>
      <button
        className="flex-1 text-center text-sm py-1 px-2 hover:underline"
        onClick={() => setFilter('completed')}
      >
        Completed
      </button>
    </div>
  );
};


export default FilterTodo