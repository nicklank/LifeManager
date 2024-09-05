import React, { useState, useEffect } from 'react';
import apiService from '../apiService';
import './Journal.css';
import { useCalendar } from './CalendarContext';

const Journal = () => {
    const { selectedDate } = useCalendar();
    const [journalEntry, setJournalEntry] = useState("");
    const [entryId, setEntryId] = useState(null); // Store the ID of the journal entry

    useEffect(() => {
        const fetchJournalEntry = async () => {
            try {
                console.log('Fetching journal entry for date:', selectedDate);
                const response = await apiService.getJournalEntryByDate(selectedDate);
                console.log('API Response:', response);

                if (response && response.entry_text !== undefined) {
                    setJournalEntry(response.entry_text || "");
                    setEntryId(response.id); // Store the ID of the fetched entry
                    console.log('Journal entry ID set:', response.id);
                } else {
                    setJournalEntry("");
                    setEntryId(null); // Reset the ID if no entry is found
                    console.log('No journal entry found for this date.');
                }
            } catch (error) {
                console.error('Error fetching journal entry:', error);
            }
        };

        fetchJournalEntry();
    }, [selectedDate]);

    const handleSaveJournalEntry = async () => {
        try {
            const journalData = {
                entry_text: journalEntry,
                date: selectedDate,
            };

            if (entryId) {
                // If an entry exists, update it
                const response = await apiService.updateJournalEntry(entryId, journalData);
                console.log('Journal entry updated:', response);
            } else {
                // If no entry exists, create a new one
                const response = await apiService.createOrUpdateJournalEntry(journalData);
                setEntryId(response.id); // Set the new ID after creation
                console.log('Journal entry created:', response);
            }
        } catch (error) {
            console.error('Error saving journal entry:', error);
        }
    };

    return (
        <div className="journal-container">
            <textarea
                value={journalEntry}
                onChange={(e) => setJournalEntry(e.target.value)}
                placeholder="Write your thoughts here..."
            />
            <button onClick={handleSaveJournalEntry}>Save Entry</button>
        </div>
    );
};

export default Journal;
