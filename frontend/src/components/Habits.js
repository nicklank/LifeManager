// src/components/Habits.js
import React, { useState, useEffect } from 'react';
import { getHabits, updateHabit, deleteHabit } from '..src/apiService';

const Habits = () => {
  const [habits, setHabits] = useState([]);

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      const response = await getHabits();
      setHabits(response.data);
    } catch (error) {
      console.error('Error fetching habits:', error);
    }
  };

  const handleUpdateHabit = async (id, updatedHabit) => {
    try {
      await updateHabit(id, updatedHabit);
      setHabits(habits.map(habit => (habit.id === id ? updatedHabit : habit)));
    } catch (error) {
      console.error('Error updating habit:', error);
    }
  };

  const handleDeleteHabit = async (id) => {
    try {
      await deleteHabit(id);
      setHabits(habits.filter(habit => habit.id !== id));
    } catch (error) {
      console.error('Error deleting habit:', error);
    }
  };

  return (
    <div>
      <ul>
        {habits.map(habit => (
          <li key={habit.id}>
            <input
              type="text"
              value={habit.name}
              onChange={(e) =>
                handleUpdateHabit(habit.id, { ...habit, name: e.target.value })
              }
            />
            <button onClick={() => handleDeleteHabit(habit.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Habits;
