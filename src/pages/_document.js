import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <meta name="description" content="TeachGage - Improve Your Teaching with Honest, Anonymous Feedback" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
