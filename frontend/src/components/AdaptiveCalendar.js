import React, { useEffect, useState } from 'react';
import './AdaptiveCalendar.css';
import { getTasksByDate, updateTaskTime } from '../apiService'; // Import the updateTaskTime function
import { useCalendar } from './CalendarContext'; // Import the useCalendar hook

const AdaptiveCalendar = () => {
    const { selectedDate } = useCalendar(); // Get the selectedDate from CalendarContext
    const [tasks, setTasks] = useState([]);
    const [draggedTask, setDraggedTask] = useState(null); // State to keep track of the dragged task

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const fetchedTasks = await getTasksByDate(selectedDate); // Use selectedDate from CalendarContext
                setTasks(fetchedTasks);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        };

        fetchTasks();
    }, [selectedDate]); // Re-fetch tasks when selectedDate changes

    const handleDragStart = (task) => {
        setDraggedTask(task); // Set the dragged task
    };

    const handleDrop = async (event, timeSlot) => {
        event.preventDefault(); // Prevent default behavior

        if (draggedTask) {
            try {
                // Update the task with the new time slot
                await updateTaskTime(draggedTask.id, { time: timeSlot });
                // Refresh the tasks
                const updatedTasks = await getTasksByDate(selectedDate);
                setTasks(updatedTasks);
                setDraggedTask(null); // Clear the dragged task
            } catch (error) {
                console.error('Error updating task time:', error);
            }
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault(); // Allow drop
        event.target.classList.add('drag-over');
    };

    const handleDragLeave = (event) => {
        event.preventDefault();
        event.target.classList.remove('drag-over');
    };

    // Generating time slots from 7 AM to 11 PM
    const timeSlots = Array.from({ length: 17 }, (_, i) => {
        const hour = 7 + i;
        return hour > 12 ? `${hour - 12} PM` : `${hour} AM`;
    });

    return (
        <div className="adaptive-calendar-container">
            <table className="adaptive-calendar-table">
                <thead>
                    <tr>
                        <th>Time</th>
                        <th>Tasks</th>
                    </tr>
                </thead>
                <tbody>
                    {timeSlots.map((slot, index) => (
                        <tr key={index}>
                            <td
                                className="time-slot"
                                onDrop={(event) => handleDrop(event, slot)}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                            >
                                {slot}
                            </td>
                            {index === 0 && (
                                <td
                                    className="task-slot"
                                    rowSpan={timeSlots.length}
                                >
                                    {tasks.map((task) => (
                                        <div
                                            key={task.id}
                                            className={`task-item ${task.completed ? 'completed' : ''}`}
                                            draggable
                                            onDragStart={() => handleDragStart(task)}
                                        >
                                            <span>{task.name}</span> {/* Wrapping the task name with a span */}
                                        </div>
                                    ))}
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdaptiveCalendar;
