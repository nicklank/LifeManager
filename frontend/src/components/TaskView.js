import React, { useState, useEffect } from 'react';
import apiService from '../apiService';
import './TaskView.css';
import { useCalendar } from './CalendarContext';

const TaskView = () => {
    const { selectedDate, setSelectedDate } = useCalendar(); // Get selected date from CalendarContext
    const [newTask, setNewTask] = useState("");
    const [tasksByDate, setTasksByDate] = useState({});

    // Helper function to format date to YYYY-MM-DD without timezone shift (forcing UTC)
    const formatDateToYYYYMMDD = (date) => {
        const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        return utcDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    };

    // Calculate the Monday before (or on) the selected date
    const getStartOfWeek = (date) => {
        const day = date.getDay(); // 0 is Sunday, 1 is Monday, ..., 6 is Saturday
        const diff = date.getDate() - (day === 0 ? 6 : day - 1); // Adjust when day is Sunday (0)
        return new Date(date.setDate(diff));
    };

    // Calculate the Sunday after (or on) the selected date
    const getEndOfWeek = (startOfWeek) => {
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6); // Add 6 days to get to Sunday
        return endOfWeek;
    };

    // Generate the dates for the week (Monday to Sunday)
    const generateWeekDates = (startOfWeek) => {
        const weekDates = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i); // Increment day by day
            weekDates.push(date);
        }
        return weekDates;
    };

    // Fetch tasks for the week
    const fetchTasksForWeek = async (weekDates) => {
        const tasksByDateTemp = {};

        // Fetch tasks for each date in the week
        for (const date of weekDates) {
            const formattedDate = formatDateToYYYYMMDD(date);
            try {
                const tasks = await apiService.getTasksByDate(formattedDate);
                tasksByDateTemp[formattedDate] = tasks; // Store tasks keyed by date
            } catch (error) {
                console.error(`Error fetching tasks for date ${formattedDate}:`, error);
            }
        }

        setTasksByDate(tasksByDateTemp);
    };

    // Update tasks whenever selected date changes
    useEffect(() => {
        const correctedDate = new Date(selectedDate);
        correctedDate.setDate(correctedDate.getDate() + 1); // Adjust by one day to align

        const startOfWeek = getStartOfWeek(correctedDate);
        const endOfWeek = getEndOfWeek(startOfWeek);
        const weekDates = generateWeekDates(startOfWeek);

        fetchTasksForWeek(weekDates);
    }, [selectedDate]);

    const handleAddTask = async (date) => {
        if (newTask.trim()) {
            const formattedDate = formatDateToYYYYMMDD(date);
            try {
                const taskData = {
                    name: newTask,
                    completed: false,
                    date: formattedDate,
                };
                const response = await apiService.addTask(taskData);
                setTasksByDate(prevTasksByDate => ({
                    ...prevTasksByDate,
                    [formattedDate]: [...(prevTasksByDate[formattedDate] || []), response]
                }));
                setNewTask("");
            } catch (error) {
                console.error('Error adding task:', error);
            }
        }
    };

    const handleToggleCompletion = async (taskId, taskDate) => {
        try {
            const updatedTask = await apiService.toggleTaskCompletion(taskId);
            setTasksByDate(prevTasksByDate => ({
                ...prevTasksByDate,
                [taskDate]: prevTasksByDate[taskDate].map(task =>
                    task.id === taskId ? updatedTask : task
                ),
            }));
        } catch (error) {
            console.error('Error toggling task completion:', error);
        }
    };

    const handleDeleteTask = async (taskId, taskDate) => {
        try {
            await apiService.deleteTask(taskId);
            setTasksByDate(prevTasksByDate => ({
                ...prevTasksByDate,
                [taskDate]: prevTasksByDate[taskDate].filter(task => task.id !== taskId)
            }));
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const navigateWeek = (direction) => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
        setSelectedDate(formatDateToYYYYMMDD(newDate));
    };

    const resetToToday = () => {
        setSelectedDate(formatDateToYYYYMMDD(new Date()));
    };

    // Calculate the week range based on selected date
    const correctedDate = new Date(selectedDate);
    correctedDate.setDate(correctedDate.getDate() + 1); // Adjust by one day to align
    const startOfWeek = getStartOfWeek(correctedDate);
    const weekDates = generateWeekDates(startOfWeek);

    return (
        <div className="task-view-container">
            <div className="task-view-controls">
                <button onClick={() => navigateWeek('previous')}>Previous Week</button>
                <button onClick={resetToToday}>Reset to Today</button>
                <button onClick={() => navigateWeek('next')}>Next Week</button>
            </div>
            <h2>{`Week of ${startOfWeek.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`}</h2>
            <div className="task-table">
                {weekDates.map((date, index) => {
                    const formattedDate = formatDateToYYYYMMDD(date);
                    const tasks = tasksByDate[formattedDate] || [];
                    return (
                        <div className="task-table-row" key={index}>
                            <div className="task-table-cell date-cell">
                                {date.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0)}
                                <br />
                                {date.getDate()}
                            </div>
                            <div className="task-table-cell tasks-cell">
                                <ul className="task-list">
                                    {tasks.map(task => (
                                        <li key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                                            <span onClick={() => handleToggleCompletion(task.id, formattedDate)}>
                                                {task.name}
                                            </span>
                                            <button
                                                onClick={() => handleDeleteTask(task.id, formattedDate)}
                                                className="delete-task-button"
                                                aria-label="Delete task"
                                            >
                                                ❌
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                                <div className="task-input-container">
                                    <input
                                        type="text"
                                        value={newTask}
                                        onChange={(e) => setNewTask(e.target.value)}
                                        placeholder="Enter a new task..."
                                    />
                                    <button onClick={() => handleAddTask(date)}>Add Task</button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TaskView;
