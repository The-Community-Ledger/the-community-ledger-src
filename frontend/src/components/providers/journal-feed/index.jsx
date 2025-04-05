import { createContext, useContext, useEffect, useState } from "react";

const JournalFeedContext = createContext(null);


export function JournalFeedProvider({ children }) {
    const [ issues, setIssues ] = useState([]);
    const [ articles, setArticles ] = useState([]);  

    return (
        <JournalFeedContext.Provider value={{ issues, articles }}>
            {children}
        </JournalFeedContext.Provider>
    );
};

export function useJournalFeed() {
    const context = useContext(JournalFeedContext);
    if (!context) {
        throw new Error("useJournalFeed must be used within a JournalFeedProvider");
    }
    return context; 
}