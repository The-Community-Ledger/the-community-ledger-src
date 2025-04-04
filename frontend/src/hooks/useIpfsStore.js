import { useEffect, useState } from 'react';
import { CID } from 'multiformats/cid';
import { useHelia } from '@/components/providers/helia';


export default function useIpfsStorage()  {
    const { dagService } = useHelia();
    const [isFetching, setIsFetching] = useState(true);
    const [isStoring, setIsStoring] = useState(false);

    const fetchIpfsData = async (cid) => {
        setIsFetching(true);
        try {
            const cidObj = CID.parse(cid);
            const data = await dagService.get(cidObj);
            return data;
        } catch (error) {
            console.error('Error fetching IPFS data:', error);
            throw error;
        } finally {
            setIsFetching(false);
        }
    }
    
    const storeIpfsData = async (data) => {
        setIsStoring(true);
        try {
            const cid = await dagService.put(data);
            return cid;
        } catch (error) {
            console.error('Error storing IPFS data:', error);
            throw error;
        } finally {
            setIsStoring(false);
        }
    }

    return {
        fetchIpfsData,
        storeIpfsData,
        isFetching,
        isStoring
    }
}