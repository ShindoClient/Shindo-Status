import Link from 'next/link';
import styles from '../styles/NotFound.module.css';

export default function NotFoundPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>404 - Página não encontrada</h1>
      <p className={styles.text}>A página que você procura não existe.</p>
      <Link href="/" className={styles.button}>
        Voltar para a página principal
      </Link>
    </div>
  );
}