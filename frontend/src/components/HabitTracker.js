import React, { useState, useEffect } from 'react';
import { getHabits, createHabit, deleteHabit, createHabitEntry, updateHabitEntry } from '../apiService';
import './HabitTracker.css';
import './TaskView.css';
import { useCalendar } from './CalendarContext'; // Import the custom hook

const HabitTracker = ({ viewMode = 'default' }) => {
  const { selectedDate, setSelectedDate, changeDate } = useCalendar(); // Use context value
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [editStatus, setEditStatus] = useState({ habitId: null, date: null });


  useEffect(() => {
    fetchHabits();
  }, [selectedDate]); // Fetch habits when selectedDate changes

  const fetchHabits = async () => {
    try {
      const response = await getHabits();
      setHabits(response);
    } catch (error) {
      console.error('Error fetching habits:', error);
    }
  };

  const addHabit = async (e) => {
    e.preventDefault();

    if (!newHabit.trim()) {
      console.log('Habit name cannot be empty');
      return;
    }

    const habit = { name: newHabit, description: '' };

    try {
      const response = await createHabit(habit);
      setHabits([...habits, response]);
      setNewHabit('');
    } catch (error) {
      console.error('Error creating habit:', error);
    }
  };

  const deleteHabitById = async (habitId) => {
    try {
      await deleteHabit(habitId);
      setHabits(habits.filter(habit => habit.id !== habitId));
    } catch (error) {
      console.error('Error deleting habit:', error);
    }
  };

  const handleToggle = async (habitId, date) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    const entry = habit.entries ? habit.entries.find(e => e.date === date) : null;

    if (entry) {
      try {
        const response = await updateHabitEntry(entry.id, { ...entry, completed: !entry.completed });
        const updatedHabits = habits.map(h => {
          if (h.id === habitId) {
            return { ...h, entries: h.entries.map(e => e.id === entry.id ? response : e) };
          }
          return h;
        });
        setHabits(updatedHabits);
      } catch (error) {
        console.error('Error updating habit entry:', error);
      }
    } else {
      try {
        const response = await createHabitEntry({ habit: habitId, date, completed: true });
        const updatedHabits = habits.map(h => {
          if (h.id === habitId) {
            return { ...h, entries: [...(h.entries || []), response] };
          }
          return h;
        });
        setHabits(updatedHabits);
      } catch (error) {
        console.error('Error creating habit entry:', error);
      }
    }
  };

  const getStatusSymbol = (status, customValue) => {
    return status ? customValue || '✔️' : '';
  };

  const handleDateChange = (days) => {
    changeDate(days); // Use changeDate from context
  };

  const handleDateInputChange = (e) => {
    const newDate = new Date(e.target.value).toISOString().split('T')[0];
    setSelectedDate(newDate); // Update selectedDate in context
  };

  const handleDoubleClick = (habitId, date) => {
    setEditStatus({ habitId, date });
  };

  const handleInputChange = (e, habitId, date) => {
    const value = e.target.value.charAt(0);
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    const entry = habit.entries ? habit.entries.find(e => e.date === date) : null;

    if (entry) {
      const updatedEntry = { ...entry, customValue: value, completed: true };
      updateHabitEntry(entry.id, updatedEntry)
        .then(response => {
          const updatedHabits = habits.map(h => {
            if (h.id === habitId) {
              return { ...h, entries: h.entries.map(e => e.id === entry.id ? response : e) };
            }
            return h;
          });
          setHabits(updatedHabits);
          setEditStatus({ habitId: null, date: null });
        })
        .catch(error => console.error('Error updating habit entry:', error));
    } else {
      const newEntry = { habit: habitId, date, customValue: value, completed: true };
      createHabitEntry(newEntry)
        .then(response => {
          const updatedHabits = habits.map(h => {
            if (h.id === habitId) {
              return { ...h, entries: [...(h.entries || []), response] };
            }
            return h;
          });
          setHabits(updatedHabits);
          setEditStatus({ habitId: null, date: null });
        })
        .catch(error => console.error('Error creating habit entry:', error));
    }
  };

  const renderDefaultView = () => (
    <div>
      <table className="habit-table">
        <thead>
          <tr>
            <th>Habit</th>
            <th>Status</th>
            {isEditMode && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {habits.length > 0 ? habits.map(habit => {
            const entry = habit.entries ? habit.entries.find(e => e.date === selectedDate) : null;
            const isCompleted = entry ? entry.completed : false;
            const customValue = entry ? entry.customValue : '';
            return (
              <tr key={habit.id}>
                <td>{habit.name}</td>
                <td onDoubleClick={() => handleDoubleClick(habit.id, selectedDate)}>
                  {editStatus.habitId === habit.id && editStatus.date === selectedDate ? (
                    <input
                      type="text"
                      value={customValue}
                      onChange={(e) => handleInputChange(e, habit.id, selectedDate)}
                      maxLength="2"
                      autoFocus
                      className="small-input"
                    />
                  ) : (
                    <button
                      className={`status-button ${isCompleted ? 'completed' : 'not-completed'}`}
                      onClick={() => handleToggle(habit.id, selectedDate)}
                    >
                      {getStatusSymbol(isCompleted, customValue)}
                    </button>
                  )}
                </td>
                {isEditMode && (
                  <td>
                    <button onClick={() => deleteHabitById(habit.id)}>Delete</button>
                  </td>
                )}
              </tr>
            );
          }) : <tr><td colSpan={isEditMode ? "3" : "2"}>No habits found</td></tr>}
        </tbody>
      </table>
    </div>
  );

  const renderMonthView = () => {
    const [year, month] = selectedDate.split('-').map(Number);
    const daysInMonth = new Date(year, month, 0).getDate();
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    return (
      <div>
        <table className="habit-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Day</th>
              {habits.map(habit => (
                <th key={habit.id}>{habit.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {daysArray.map(day => {
              const date = new Date(year, month - 1, day).toISOString().split('T')[0];
              return (
                <tr key={day}>
                  <td>{day}</td>
                  <td>{new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}</td>
                  {habits.map(habit => {
                    const entry = habit.entries ? habit.entries.find(e => e.date === date) : null;
                    return (
                      <td key={habit.id}>
                        <button
                          className={`status-button ${entry?.completed ? 'completed' : 'not-completed'}`}
                          onClick={() => handleToggle(habit.id, date)}
                        >
                          {getStatusSymbol(entry?.completed, entry?.customValue)}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="habit-tracker">
      <form onSubmit={addHabit}>
        <input
          type="text"
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
          placeholder="New Habit"
        />
        <button type="submit">Add Habit</button>
      </form>
      {viewMode === 'default' ? renderDefaultView() : renderMonthView()}
    </div>
  );
};

export default HabitTracker;
