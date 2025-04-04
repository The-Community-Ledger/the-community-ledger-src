import { createContext, useContext, useEffect, useState } from "react";
import { createHelia } from "helia";
import { dagJson } from "@helia/dag-json";

const HeliaContext = createContext(null);

export function HeliaProvider({ children }) {
    const [helia, setHelia] = useState(null);
    const [dagService, setDagService] = useState(null);

    useEffect(() => {
        const setup = async () => {
            const helia = await createHelia({}); 
            const dagService = dagJson(helia);

            setHelia(helia);
            setDagService(dagService);
        }
        setup();
    }
    , []);

    return (
        <HeliaContext.Provider value={{ helia, dagService }}>
            {children}
        </HeliaContext.Provider>
    );
}
            
export function useHelia() {
    const context = useContext(HeliaContext);
    if (!context) {
        throw new Error("useHelia must be used within a HeliaProvider");
    }
    return context;
}