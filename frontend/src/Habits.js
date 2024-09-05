// src/Habits.js
import React, { useState, useEffect } from 'react';
import { getHabits, createHabit, updateHabit, deleteHabit } from './apiService';

const Habits = () => {
    const [habits, setHabits] = useState([]);
    const [newHabit, setNewHabit] = useState('');

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

    const handleCreateHabit = async () => {
        if (newHabit.trim()) {
            try {
                const response = await createHabit({ name: newHabit });
                setHabits([...habits, response.data]);
                setNewHabit('');
            } catch (error) {
                console.error('Error creating habit:', error);
            }
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



export default Habits;
