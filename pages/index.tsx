import Image from 'next/image';

export default function Home() {
  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <h1>ShindoClient - Página de Status</h1>
      <Image
        src="/assets/logo.png"
        alt="Minha Imagem"
        width={300}
        height={300}
      />
    </div>
  );
}
