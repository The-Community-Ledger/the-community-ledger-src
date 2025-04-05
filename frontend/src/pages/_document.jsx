import Header from '@/components/common/header'
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Header />
        <div style={{ height: '100px'}}></div>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
