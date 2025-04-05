import ConnectButton from "../connect-btn";


function Header() {
    return ( 
        <header style={{ borderBottom: '1px solid #eaeaea', display: 'flex', flexDirection: 'column' }}>
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
                <div style={{width: '200px', display: 'flex', justifyContent: 'flex-end' }}>
                    <ConnectButton />
                </div>
            </div>
        </header>
     );
}

export default Header;