import WalletSection from "./wallet-section";
import styles from "./styles.module.css";
import { useWallet } from "@/hooks/useWallet";
import InfoSection from "./info-section";
import WallSection from "./wall-section";
import { useIpfsStorage } from "@/hooks/useIpfsStore";
import { useEffect } from "react";

export default function Home() {
    const { walletConnectionStatus } = useWallet();
        
    const { fetchIpfsData, storeIpfsData } = useIpfsStorage();

    // Example usage of fetchIpfsData
    useEffect(() => {
        const fetchData = async () => {
        try {
            console.log("Storing data...");
            const cid = await storeIpfsData({ hello: "world" });
            console.log("CID:", cid);
            console.log("Fetching data...");
            const data = await fetchIpfsData(cid);
            console.log("Fetched data:", data);
        }
        catch (error) {
            console.error("Error:", error);
        }
        }
        fetchData();
    }
    , []);
    


    return (
        <div className={styles.home}>
            <section className={styles.col1}>
                <WalletSection />
            </section>

            <section className={styles.col2}>
                {walletConnectionStatus === "connected"
                    ? <WallSection />
                    : <InfoSection />
                }
            </section>
        </div>
    )
}
