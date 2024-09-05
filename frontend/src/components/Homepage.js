import React, { useState } from 'react';
import HabitTracker from './HabitTracker';
import TaskView from './TaskView';
import Journal from './Journal';
import AdaptiveCalendar from './AdaptiveCalendar';
import { useCalendar } from './CalendarContext'; // Import the useCalendar hook
import './Homepage.css';

const Homepage = () => {
  const { selectedDate, changeDate } = useCalendar(); // Use the selectedDate from CalendarContext
  const [activeTab, setActiveTab] = useState('today');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Function to format the selected date for display in MST
  const formatDateForDisplay = (dateString) => {
    // Create a Date object from the date string in MST timezone
    const [year, month, day] = dateString.split('-'); // Split the 'YYYY-MM-DD' format
    const date = new Date(year, month - 1, day); // Create a new Date object (month is 0-based)

    const options = { month: 'long', day: 'numeric' }; // Formatting options for the date
    const formattedDate = date.toLocaleDateString('en-US', options); // e.g., "January 24"
    return { formattedDate, year };
  };

  const { formattedDate, year } = formatDateForDisplay(selectedDate);

  return (
        <div className="homepage-container">
            {/* Date display section */}
            <div className="date-display">
                <button className="arrow-button" onClick={() => changeDate(-1)}>◀</button>
                <div className="date-container">
                    <div className="date-display-large">{formattedDate}</div>
                    <div className="date-display-small">{year}</div>
                </div>
                <button className="arrow-button" onClick={() => changeDate(1)}>▶</button>
            </div>

            {/* Tab controls */}
            <div className="homepage-controls">
                <button onClick={() => handleTabChange('today')} className={activeTab === 'today' ? 'active' : ''}>Today</button>
                <button onClick={() => handleTabChange('week')} className={activeTab === 'week' ? 'active' : ''}>Week</button>
                <button onClick={() => handleTabChange('month')} className={activeTab === 'month' ? 'active' : ''}>Month</button>
            </div>

            {/* Main content based on the active tab */}
            <div className="homepage-content">
                {activeTab === 'today' && (
                    <div className="today-view">
                        <HabitTracker viewMode="default" />
                        <AdaptiveCalendar />
                        <Journal selectedDate={selectedDate} />
                    </div>
                )}
                {activeTab === 'week' && <TaskView />}
                {activeTab === 'month' && <HabitTracker viewMode="monthly" />}
            </div>
        </div>
    );
};

export default Homepage;
