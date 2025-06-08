import Image from 'next/image';
import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';

type ClientStatus = {
  uuid: string;
  name: string;
  accountType: string;
  eventType: string;
  timestamp: string;
  online?: boolean;
};

type PlayerGroups = {
  staff: ClientStatus[];
  diamond: ClientStatus[];
  gold: ClientStatus[];
  member: ClientStatus[];
};

export default function Home() {
  const [groups, setGroups] = useState<PlayerGroups>({
    staff: [],
    diamond: [],
    gold: [],
    member: [],
  });
  const [loading, setLoading] = useState(true);
  const [openIndexes, setOpenIndexes] = useState<boolean[]>([false, false, false, false]);

  useEffect(() => {
    async function fetchPlayers() {
      try {
        const res = await fetch('/api/users');
        const data = await res.json();
        setGroups({
          staff: data.staff ?? [],
          diamond: data.diamond ?? [],
          gold: data.gold ?? [],
          member: data.member ?? [],
        });
      } catch {
        setGroups({ staff: [], diamond: [], gold: [], member: [] });
      } finally {
        setLoading(false);
      }
    }
    fetchPlayers();
  }, []);

  const counters = [
    {
      label: 'Staff',
      color: '#ef4444',
      value: groups.staff.length,
      iconColor: '#ef4444',
      list: groups.staff,
    },
    {
      label: 'Diamond',
      color: '#22d3ee',
      value: groups.diamond.length,
      iconColor: '#22d3ee',
      list: groups.diamond,
    },
    {
      label: 'Gold',
      color: '#fbbf24',
      value: groups.gold.length,
      iconColor: '#fbbf24',
      list: groups.gold,
    },
    {
      label: 'Membro',
      color: '#a1a1aa',
      value: groups.member.length,
      iconColor: '#a1a1aa',
      list: groups.member,
    },
  ];

  function DigitalNumber({ value, color }: { value: number; color: string }) {
    return (
      <span
        style={{
          fontFamily: "var(--font-digital)",
          background: '#18181b',
          color,
          borderRadius: '6px',
          padding: '2px 12px',
          fontSize: '2rem',
          letterSpacing: '2px',
          boxShadow: '0 2px 8px #0006',
          margin: '0 8px',
          border: `2px solid ${color}`,
          display: 'inline-block',
          minWidth: '48px',
        }}
      >
        {value}
      </span>
    );
  }

  function OnlineIcon({ color = '#38ff8e' }) {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" style={{ marginLeft: 8, verticalAlign: 'middle' }}>
        <circle cx="12" cy="12" r="10" fill={color} stroke="#18181b" strokeWidth="2" />
        <circle cx="12" cy="12" r="5" fill={color} />
      </svg>
    );
  }

  function PlayerCard({
    counter,
    idx,
    open,
    setOpen,
  }: {
    counter: typeof counters[0];
    idx: number;
    open: boolean;
    setOpen: (open: boolean) => void;
  }) {
    return (
      <div
        className={`${styles.playerCard} ${styles['playerCard' + counter.label]}`}
      >
        <div
          className={styles.cardHeader}
          onClick={() => {
            if (counter.list.length > 0) setOpen(!open);
          }}
          style={{
            cursor: counter.list.length > 0 ? 'pointer' : 'default',
            marginBottom: open && counter.list.length > 0 ? 16 : 0,
            paddingBottom: open && counter.list.length > 0 ? 8 : 0,
          }}
        >
          <span className={styles.cardLabel} style={{ color: counter.color }}>
            {counter.label}
          </span>
          <div className={styles.cardCounter}>
            <DigitalNumber value={counter.value} color={counter.color} />
          </div>
          <span className={styles.cardIcon}>
            <OnlineIcon color={counter.iconColor} />
            {counter.list.length > 0 && (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                style={{
                  marginLeft: 8,
                  transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s',
                  fill: '#a1a1aa',
                }}
              >
                <path d="M7 10l5 5 5-5z" />
              </svg>
            )}
          </span>
        </div>
        {open && counter.list.length > 0 && (
          <ul className={styles.cardList}>
            {counter.list.map((player) => (
              <li className={styles.cardListItem} key={player.uuid}>
                <strong style={{ color: counter.color }}>{player.name}</strong>
                <span style={{ color: '#a1a1aa', fontSize: '0.95rem' }}>({player.accountType})</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.titleCard}>
        <h1 className={styles.title}>ShindoClient - Página de Status</h1>
      </div>
      <div className={styles.logoWrapper}>
        <Image
          src="/assets/logo.png"
          alt="Logo"
          width={180}
          height={180}
          className={styles.logo}
        />
      </div>
      <div className={styles.cardsRow}>
        {counters.map((counter, idx) => (
          <PlayerCard
            key={counter.label}
            counter={counter}
            idx={idx}
            open={openIndexes[idx] || false}
            setOpen={(open) => {
              setOpenIndexes((prev) => {
                const copy = [...prev];
                copy[idx] = open;
                return copy;
              });
            }}
          />
        ))}
      </div>
    </div>
  );
}
