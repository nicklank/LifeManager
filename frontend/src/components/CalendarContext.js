import React, { createContext, useState, useContext } from 'react';

// Function to get today's date in MST
const getTodayDateInMST = () => {
  const now = new Date();
  console.log("Current local date and time:", now); // Log current local date and time
  const utcTimestamp = now.getTime() + (now.getTimezoneOffset() * 60000); // Convert to UTC timestamp
  const mstOffset = -7; // MST is UTC-7
  const mstDate = new Date(utcTimestamp + (mstOffset * 3600000)); // Adjust UTC to MST
  console.log("MST date and time:", mstDate); // Log MST date and time
  return mstDate.toISOString().split('T')[0]; // Return as 'YYYY-MM-DD'
};

// Create a Context for the calendar
const CalendarContext = createContext();

export const CalendarProvider = ({ children }) => {
  const [selectedDate, setSelectedDate] = useState(getTodayDateInMST()); // Default to today in MST

  // Function to get the start and end of the week based on the current date
  const getWeekDateRange = (currentDate = selectedDate) => {
    const startOfWeek = new Date(currentDate);
    console.log("Current Date for Week Range Calculation:", currentDate); // Log input date
    const dayOfWeek = startOfWeek.getDay(); // Get the current day of the week (0 for Sunday, 1 for Monday, etc.)
    const daysToMonday = (dayOfWeek + 6) % 7; // Calculate days to previous Monday
    startOfWeek.setDate(startOfWeek.getDate() - daysToMonday); // Adjust to Monday

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6); // Set to Sunday (end of the week)

    console.log("Start of Week (Monday):", startOfWeek); // Log start of the week
    console.log("End of Week (Sunday):", endOfWeek); // Log end of the week

    return {
      start: startOfWeek.toISOString().split('T')[0], // Format start date
      end: endOfWeek.toISOString().split('T')[0], // Format end date
    };
  };

  // Function to handle date change by a specific number of days
  const changeDate = (days) => {
    const newDate = new Date(selectedDate);
    console.log("Selected Date before change:", selectedDate); // Log current selected date
    newDate.setDate(newDate.getDate() + days); // Adjust date by 'days'
    const formattedDate = newDate.toISOString().split('T')[0];
    console.log("New Date after change:", formattedDate); // Log new date
    setSelectedDate(formattedDate); // Update selectedDate
  };

  // Expose selectedDate and helper functions via context
  return (
    <CalendarContext.Provider value={{ selectedDate, getWeekDateRange, changeDate, setSelectedDate }}>
      {children}
    </CalendarContext.Provider>
  );
};

// Custom hook for using the calendar context
export const useCalendar = () => useContext(CalendarContext);
