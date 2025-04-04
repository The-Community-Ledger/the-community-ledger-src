import { useEffect, useState } from 'react';
import { CID } from 'multiformats/cid';
import { useHelia } from '@/components/providers/helia';

// Custom hook for interacting with IPFS storage
export function useIpfsStorage() {
    const { dagService } = useHelia(); // Access the DAG service from the Helia provider
    const [isFetching, setIsFetching] = useState(true); // State to track if data is being fetched
    const [isStoring, setIsStoring] = useState(false); // State to track if data is being stored

    // Function to fetch data from IPFS using a CID
    const fetchIpfsData = async (cid) => {
        setIsFetching(true); // Set fetching state to true
        if (!cid) {
            console.error('CID is required to fetch data from IPFS'); // Log error if CID is not provided
            return null; // Return null if no CID is provided
        }
        if (typeof cid === 'string') {
            const cidObj = CID.parse(cid); 
        } else {
            const cidObj = cid;
        }

        try {

            const cidObj = CID.parse(cid); // Parse the CID string into a CID object
            const data = await dagService.get(cidObj); // Fetch data from IPFS
            return data; // Return the fetched data
        } catch (error) {
            console.error('Error fetching IPFS data:', error); // Log any errors
            throw error; // Rethrow the error for the caller to handle
        } finally {
            setIsFetching(false); // Set fetching state to false
        }
    }

    // Function to store data in IPFS and return the CID
    const storeIpfsData = async (data) => {
        setIsStoring(true); // Set storing state to true
        try {
            const cid = await dagService.add(data); // Store data in IPFS and get the CID
            return cid.toString(); // Return the CID of the stored data
        } catch (error) {
            console.error('Error storing IPFS data:', error); // Log any errors
            throw error; // Rethrow the error for the caller to handle
        } finally {
            setIsStoring(false); // Set storing state to false
        }
    }

    // Return the functions and state variables for use in components
    return {
        fetchIpfsData,
        storeIpfsData,
        isFetching,
        isStoring
    }
}