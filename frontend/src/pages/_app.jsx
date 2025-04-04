import { HeliaProvider } from '@/components/providers/helia'
import WalletProvider from '@/components/providers/wallet'
import '@/styles/globals.css'

export default function App({ Component, pageProps }) {
  return (
    <WalletProvider>
      <HeliaProvider>
        <Component {...pageProps} />
      </HeliaProvider>
    </WalletProvider>
  )
}
