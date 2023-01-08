import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta property="og:type" content="website" />
        <meta property="og:title" content="R621" />
        <meta property="og:url" content="https://r621.vercel.app" />
        <meta property="og:image" content="https://i.imgur.com/GTIZohq.png" />
        <meta property="og:description" content="Be careful. You might encounter something new..." />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
