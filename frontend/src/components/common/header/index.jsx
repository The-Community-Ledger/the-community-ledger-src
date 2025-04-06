import ConnectButton from "../connect-btn";
import Link from "next/link";
import { useSmartContract } from "@/hooks/useSmartContract";
import { useWallet } from "@/hooks/useWallet";
import { useEffect, useState } from "react";


function Header() {
    const { getSmartContract } = useSmartContract();
    const { walletConnectionStatus, walletAddress } = useWallet()
    const [ balance, setBalance ] = useState();

    useEffect(() => {
        const fetchBalance = async () => {
            const contract = getSmartContract("JOURNALCREDIT");
            if (!contract) return;
            const balance = await contract.balanceOf(walletAddress);
            setBalance(balance);
        }
        if (walletConnectionStatus === "connected") {
            fetchBalance();
        }
    }
    , [walletConnectionStatus]);

    return ( 
        <header style={{ display: 'flex', flexDirection: 'column', position:"fixed", backgroundColor: "white", boxShadow: "0 4px 4px rgba(0, 0, 0, 0.05)",
             width: '100%', top:0, zIndex: 1000 }}>
            <div
                style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem 2rem',
                position: 'relative',
                width: '100%',
                }}
            >
                {/* Left spacer */}
                <div style={{ width: '200px' }}></div>

                {/* Center title */}
                <div style={{ flex: 1, textAlign: 'center' }}>
                    <h1 style={{ margin: 0, fontFamily: 'Gloock' }}>The Community Ledger.</h1>
                </div>

                {/* Right: Connect Button */}
                <div style={{width: '200px', display: 'flex', justifyContent: 'flex-end'}}>
                    <ConnectButton />
                </div>
            </div>

            {/* Nav bar below title */}
            <div
                style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'relative',
                }}
            >
                <div style={{ width: '200px' }}></div>
                <nav
                    style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignContent: 'flex-start',
                    gap: '2rem',
                    padding: '0.rem 0 0rem',
                    fontSize: '1rem',
                    height: '2rem',
                    }}
                >
                    <NavItem label="Issues" href="/issues" />
                    <NavItem label="Explore" href="/explore" />
                    <NavItem label="Submit" href="/submit" />
                    <NavItem label="About" href="/about" />
                </nav>
                <div style={{
                     width: '200px', 
                     display: 'flex', 
                     justifyContent: 'center',
                     height: '2rem',
                     alignContent: 'flex-start', }}>
                    {walletConnectionStatus === "connected" && (
                        <div style={{ display: 'flex', justifyContent: 'flex-end', fontSize: '1rem', paddingRight: '1rem' }}>
                            <p style={{ margin: 0, color: 'color(srgb 0.580392 0.619608 0.619608)', fontWeight:'400'}}>{balance && parseFloat(balance).toFixed(8)} JCR</p>
                        </div>
                    )}
                </div>
            </div>
        </header>
     );
}


function NavItem({ label, href }) {
    return (
      <Link href={href} passHref legacyBehavior>
          <a
          style={{
              textDecoration: 'none',
              color: '#333',
              fontWeight: '500',
              paddingBottom: '0.25rem',
              height: '1.2rem',
          }}
          >
          {label}
          </a>
      </Link>
    )
  }

export default Header;