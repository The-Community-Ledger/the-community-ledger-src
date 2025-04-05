import ConnectButton from "../connect-btn";
import Link from "next/link";


function Header() {
    return ( 
        <header style={{ display: 'flex', flexDirection: 'column' }}>
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

            {/* Nav bar below title */}
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