import { createContext, useContext, useEffect, useState } from "react";
import { createHelia } from "helia";
import { dagJson } from "@helia/dag-json";

// Create a React context for Helia
const HeliaContext = createContext(null);

/**
 * HeliaProvider component
 * This component sets up the Helia instance and DAG service, and provides them to the component tree via context.
 * 
 * @param {React.ReactNode} children - The child components that will have access to the Helia context.
 */
export function HeliaProvider({ children }) {
    const [helia, setHelia] = useState(null); // State to store the Helia instance
    const [dagService, setDagService] = useState(null); // State to store the DAG service

    useEffect(() => {
        // Function to initialize Helia and the DAG service
        const setup = async () => {
            const helia = await createHelia({}); // Create a new Helia instance
            const dagService = dagJson(helia); // Create a DAG service using the Helia instance

            setHelia(helia); // Store the Helia instance in state
            setDagService(dagService); // Store the DAG service in state
        };
        setup(); // Call the setup function
    }, []); // Empty dependency array ensures this runs only once

    return (
        // Provide the Helia instance and DAG service to the component tree
        <HeliaContext.Provider value={{ helia, dagService }}>
            {children}
        </HeliaContext.Provider>
    );
}

/**
 * useHelia hook
 * This hook allows components to access the Helia instance and DAG service from the context.
 * 
 * @returns {{ helia: object, dagService: object }} - The Helia instance and DAG service.
 * @throws {Error} - If the hook is used outside of a HeliaProvider.
 */
export function useHelia() {
    const context = useContext(HeliaContext); // Access the Helia context
    if (!context) {
        // Throw an error if the hook is used outside of a HeliaProvider
        throw new Error("useHelia must be used within a HeliaProvider");
    }
    return context; // Return the Helia instance and DAG service
}