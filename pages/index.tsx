import Head from 'next/head'
import useSWR from 'swr'
import React from 'react'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function Home() {
  const { data: handshake } = useSWR('/api/handshake', fetcher)
  const { data: config } = useSWR('/api/config', fetcher)

  return (
    <>
      <Head>
        <title>Shindo-API</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main style={{maxWidth: 720, margin: '40px auto', fontFamily: 'ui-sans-serif, system-ui'}}>
        <h1>Shindo-API</h1>
        <p>Next.js + Vercel, com proxy para o Gateway WS.</p>

        <h2>Handshake</h2>
        <pre style={{background:'#111', color:'#0f0', padding:12, borderRadius:8}}>
          {JSON.stringify(handshake, null, 2)}
        </pre>

        <h2>Config</h2>
        <pre style={{background:'#111', color:'#0f0', padding:12, borderRadius:8}}>
          {JSON.stringify(config, null, 2)}
        </pre>

        <footer style={{marginTop:32, opacity:0.6}}>Build: {process.env.NEXT_PUBLIC_BUILD_ID || 'dev'}</footer>
      </main>
    </>
  )
}
