import axios from 'axios';

const API_URL = 'http://localhost:8000/api/';

// Habit API calls
export const getHabits = async () => {
    try {
        const response = await axios.get(`${API_URL}habits/`);
        console.log('Habits fetched:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching habits:', error);
        throw error;
    }
};

export const createHabit = async (habit) => {
    try {
        const response = await axios.post(`${API_URL}habits/`, habit);
        console.log('Habit created:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error creating habit:', error);
        throw error;
    }
};

export const updateHabit = async (id, habit) => {
    try {
        const response = await axios.put(`${API_URL}habits/${id}/`, habit);
        console.log('Habit updated:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error updating habit:', error);
        throw error;
    }
};

export const deleteHabit = async (id) => {
    try {
        await axios.delete(`${API_URL}habits/${id}/`);
        console.log(`Habit with ID ${id} deleted`);
    } catch (error) {
        console.error('Error deleting habit:', error);
        throw error;
    }
};

// Habit entry API calls
export const getHabitEntriesByDate = async (date) => {
    try {
        const response = await axios.get(`${API_URL}habit-entries/?date=${date}`);
        console.log(`Habit entries for date ${date} fetched:`, response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching habit entries:', error);
        throw error;
    }
};

export const getHabitEntriesByDateRange = async (startDate, endDate) => {
    try {
        const response = await axios.get(`${API_URL}habit-entries/?start_date=${startDate}&end_date=${endDate}`);
        console.log(`Habit entries from ${startDate} to ${endDate} fetched:`, response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching habit entries:', error);
        throw error;
    }
};

export const createHabitEntry = async (habitEntry) => {
    try {
        const response = await axios.post(`${API_URL}habit-entries/`, habitEntry);
        console.log('Habit entry created:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error creating habit entry:', error);
        throw error;
    }
};

export const updateHabitEntry = async (id, habitEntry) => {
    try {
        const response = await axios.put(`${API_URL}habit-entries/${id}/`, habitEntry);
        console.log('Habit entry updated:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error updating habit entry:', error);
        throw error;
    }
};

export const deleteHabitEntry = async (id) => {
    try {
        await axios.delete(`${API_URL}habit-entries/${id}/`);
        console.log(`Habit entry with ID ${id} deleted`);
    } catch (error) {
        console.error('Error deleting habit entry:', error);
        throw error;
    }
};

// Task API calls
export const getTasksByDate = async (date) => {
    console.log(`Requesting tasks for date: ${date}`); // Log the date sent
    try {
        const response = await axios.get(`${API_URL}tasks/?date=${date}`);
        console.log(`Tasks for date ${date} fetched:`, response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching tasks:', error);
        throw error;
    }
};

export const getTasksByDateRange = async (startDate, endDate) => {
    try {
        const response = await axios.get(`${API_URL}tasks/?start_date=${startDate}&end_date=${endDate}`);
        console.log(`Tasks from ${startDate} to ${endDate} fetched:`, response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching tasks:', error);
        throw error;
    }
};

export const addTask = async (task) => {
    try {
        const response = await axios.post(`${API_URL}tasks/`, task);
        console.log('Task added:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error adding task:', error);
        throw error;
    }
};

export const toggleTaskCompletion = async (id) => {
    try {
        const response = await axios.patch(`${API_URL}tasks/${id}/`, { completed: true });
        console.log('Task completion toggled:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error toggling task completion:', error);
        throw error;
    }
};

export const updateTask = async (id, task) => {
    try {
        const response = await axios.put(`${API_URL}tasks/${id}/`, task);
        console.log('Task updated:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error updating task:', error);
        throw error;
    }
};

export const deleteTask = async (id) => {
    try {
        await axios.delete(`${API_URL}tasks/${id}/`);
        console.log(`Task with ID ${id} deleted`);
    } catch (error) {
        console.error('Error deleting task:', error);
        throw error;
    }
};

// Update task time slot API call
export const updateTaskTime = async (taskId, updatedData) => {
    try {
        const response = await axios.put(`${API_URL}tasks/${taskId}/`, updatedData);
        console.log('Task time updated:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error updating task time:', error);
        throw error;
    }
};

// Journal API calls
export const getJournalEntryByDate = async (date) => {
    try {
        const response = await axios.get(`${API_URL}journal-entries/?date=${date}`);
        const entry = response.data.length > 0 ? response.data[0] : null;
        console.log(`Journal entry for date ${date} fetched:`, entry);
        return entry;
    } catch (error) {
        console.error('Error fetching journal entry:', error);
        throw error;
    }
};

export const createOrUpdateJournalEntry = async (entry) => {
    try {
        const existingEntry = await getJournalEntryByDate(entry.date);
        if (existingEntry) {
            // If entry exists, update it
            const response = await axios.put(`${API_URL}journal-entries/${existingEntry.id}/`, entry);
            console.log('Journal entry updated:', response.data);
            return response.data;
        } else {
            // If entry does not exist, create a new one
            const response = await axios.post(`${API_URL}journal-entries/`, entry);
            console.log('Journal entry created:', response.data);
            return response.data;
        }
    } catch (error) {
        console.error('Error creating or updating journal entry:', error);
        throw error;
    }
};

export const updateJournalEntry = async (id, entry) => {
    try {
        const response = await axios.put(`${API_URL}journal-entries/${id}/`, entry);
        console.log('Journal entry updated:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error updating journal entry:', error);
        throw error;
    }
};

export const deleteJournalEntry = async (id) => {
    try {
        await axios.delete(`${API_URL}journal-entries/${id}/`);
        console.log(`Journal entry with ID ${id} deleted`);
    } catch (error) {
        console.error('Error deleting journal entry:', error);
        throw error;
    }
};

export default {
    getHabits,
    createHabit,
    updateHabit,
    deleteHabit,
    getHabitEntriesByDate,
    getHabitEntriesByDateRange,
    createHabitEntry,
    updateHabitEntry,
    deleteHabitEntry,
    getTasksByDate,
    getTasksByDateRange,
    addTask,
    toggleTaskCompletion,
    updateTask,
    deleteTask,
    updateTaskTime, // Export the updated function
    getJournalEntryByDate,
    createOrUpdateJournalEntry,
    updateJournalEntry,
    deleteJournalEntry,
};
