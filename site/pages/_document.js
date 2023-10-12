import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                <link rel="icon" href="/img/favicon.ico" />
                <title>eMarket</title>
            </Head>
            <body className='bg-amber-100'>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}
