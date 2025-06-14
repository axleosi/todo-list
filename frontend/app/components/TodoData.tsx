'use client'

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import FilterTodo from './FilterTodo';
import { useAuth } from '../context/AppContext';

interface TodoItem {
  _id: string;
  title: string;
  completed: boolean;
}

interface TodoDataProps {
  light: boolean;
}

const TodoData: React.FC<TodoDataProps> = ({ light }) => {
  const [todo, setTodo] = useState<TodoItem[]>([]);
  const [value, setValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const { token } = useAuth();

  // Memoize config so it only changes when token changes
  const config = useMemo(() => ({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }), [token]);

  const fetchTodos = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/todo', config);
      setTodo(res.data);
    } catch (err) {
      console.error('Fetch todos failed:', err);
    }
  }, [config]);

  const handleSubmit = async () => {
    if (!value.trim()) return;
    try {
      const res = await axios.post(
        'http://localhost:3000/api/todo',
        { title: value },
        config
      );
      setTodo((prev) => [res.data, ...prev]);
      setValue('');
    } catch (err) {
      console.error('Add todo failed:', err);
    }
  };

  const toggleCompletion = async (id: string, completed: boolean) => {
    try {
      const res = await axios.put(
        `http://localhost:3000/api/todo/${id}`,
        { completed: !completed },
        config
      );
      setTodo((prev) =>
        prev.map((t) => (t._id === id ? { ...t, completed: res.data.completed } : t))
      );
    } catch (err) {
      console.error('Toggle completion failed:', err);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3000/api/todo/${id}`, config);
      setTodo((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error('Delete todo failed:', err);
    }
  };

  const clearCompleted = async () => {
    const completed = todo.filter((t) => t.completed);
    for (const t of completed) {
      await deleteTodo(t._id);
    }
  };

  const filteredTodos = todo.filter((t) =>
    filter === 'all' ? true : filter === 'active' ? !t.completed : t.completed
  );

  const itemsLeft = todo.filter((t) => !t.completed).length;

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  return (
    <div className="flex flex-col items-center gap-2 w-full max-w-xl mx-auto box-border">
      {/* Input */}
      <div
        className={`flex items-center justify-start gap-3 px-8 py-3 w-full h-[60px] rounded-lg ${
          light ? 'bg-white text-black' : 'bg-blue-900 text-white'
        }`}
      >
        <button
          onClick={handleSubmit}
          className="h-5 w-5 rounded-full border border-current bg-transparent outline-none"
        />
        <input
          type="text"
          id="newTodo"
          name="newTodo"
          className={`bg-transparent border-none flex-1 outline-none ${
            isTyping ? (light ? 'text-black' : 'text-white') : ''
          }`}
          placeholder="Create a new todo..."
          onBlur={() => value === '' && setIsTyping(false)}
          onFocus={() => setIsTyping(true)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>

      {/* Todos */}
      {filteredTodos.length > 0 && (
        <div className="w-full">
          {filteredTodos.map((t) => (
            <div
              key={t._id}
              className={`flex items-center justify-between px-8 py-3 mt-1 w-full h-[60px] rounded-lg ${
                light ? 'bg-white text-black' : 'bg-blue-900 text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <button
                  className={`h-5 w-5 rounded-full border border-black bg-transparent bg-center bg-cover outline-none ${
                    t.completed ? 'bg-blue-500 bg-[url("/icon-check.svg")]' : ''
                  }`}
                  onClick={() => toggleCompletion(t._id, t.completed)}
                />
                <p className={t.completed ? 'line-through text-gray-500' : ''}>{t.title}</p>
              </div>
              <button
                onClick={() => deleteTodo(t._id)}
                className="outline-none border-none bg-transparent"
              >
                <img src="/icon-cross.svg" alt="Delete" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div
        className={`flex justify-between px-8 py-3 w-full h-[60px] rounded-lg ${
          light ? 'bg-white text-black' : 'bg-blue-900 text-white'
        }`}
      >
        <p>{itemsLeft} item(s) left</p>
        <button onClick={clearCompleted} className="underline">
          Clear completed
        </button>
      </div>

      <FilterTodo setFilter={setFilter} light={light} />
    </div>
  );
};

export default TodoData;
