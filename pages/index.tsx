import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import styles from '../styles/Home.module.css';
import {
  ALL_BENEFITS,
  getDisplayBenefits,
} from '../controllers/BenefitsController';

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

  const infos = [
    {
      label: 'Staff',
      color: '#ef4444',
    },
    {
      label: 'Diamond',
      color: '#22d3ee',
    },
    {
      label: 'Gold',
      color: '#fbbf24',
    },
    {
      label: 'Membro',
      color: '#a1a1aa',
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

  function InfoCard({
    counter,
    idx,
  }: {
    counter: typeof infos[0];
    idx: number;
  }) {
    const cardRef = useRef<HTMLDivElement>(null);
    const rafId = useRef<number | null>(null);
    const [lantern, setLantern] = useState(false);

    function handleMouseMove(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(() => {
        const card = cardRef.current;
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
        rafId.current = null;
      });
    }

    function handleMouseLeave() {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
      setLantern(false);
    }

    const benefits = getDisplayBenefits(counter.label);
    const isMember = counter.label === 'Membro';
    const isStaff = counter.label === 'Staff';
    const isGold = counter.label === 'Gold';
    const isDiamond = counter.label === 'Diamond';

    // Lista de benefícios que NÃO devem aparecer nesses cargos

    const hiddenForStaff = [
      'Participação em eventos regulares',
      'Acesso a eventos exclusivos',
      'Acesso a eventos especiais',
      'Acesso ao servidor Discord',
      'Suporte da comunidade',
      'Suporte prioritário',
      'Suporte dedicado',
      'Tag básica',
    ];

    const hiddenForDiamond = [
      'Participação em eventos regulares',
      'Acesso a ferramentas exclusivas',
      'Acesso ao servidor Discord',
      'Acesso a eventos especiais',
      'Funções administrativas',
      'Suporte da comunidade',
      'Suporte dedicado',
      'Tag básica',
    ];

    const hiddenForGold = [
      'Participação em eventos regulares',
      'Acesso a ferramentas exclusivas',
      'Acesso ao servidor Discord',
      'Funções administrativas',
      'Suporte da comunidade',
      'Suporte prioritário',
      'Tag básica',
    ];

    const hiddenForMember = [
      'Funções administrativas',
      'Acesso a ferramentas exclusivas',
      'Acesso a eventos especiais',
    ];

    // Ordena: presentes primeiro
    const presentBenefits = ALL_BENEFITS.filter(b => benefits.includes(b));
    const absentBenefits = ALL_BENEFITS.filter(b => !benefits.includes(b));
    let orderedBenefits = [...presentBenefits, ...absentBenefits];

    if (isStaff) {
      orderedBenefits = orderedBenefits.filter(
        b => !hiddenForStaff.includes(b)
      );
    }
    if (isDiamond) {
      orderedBenefits = orderedBenefits.filter(
        b => !hiddenForDiamond.includes(b)
      );
    }

    if (isGold) {
      orderedBenefits = orderedBenefits.filter(
        b => !hiddenForGold.includes(b)
      );
    }

    if (isMember) {
      orderedBenefits = orderedBenefits.filter(
        b => !hiddenForMember.includes(b)
      );
    }



    return (
      <div
        ref={cardRef}
        className={`${styles.card} ${lantern ? 'lantern-active' : ''} ${styles['card' + counter.label]}`}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setLantern(true)}
        onMouseLeave={handleMouseLeave}
      >
        <div className={styles.cardHeader} style={{ cursor: 'pointer', marginBottom: 16, paddingBottom: 8 }}>
          <span className={styles.cardLabel} style={{ color: counter.color }}>
            {counter.label}
          </span>
        </div>
        <p className={styles.cardp}>
          <span className={styles.cardDescriptionFirst}>
            Benefícios do {counter.label}:
            <br />
          </span>
          {/* Para cargos acima de membro, mostra linha de herança mais clean */}
          {!isMember && (
            <span className={styles.cardDescription} style={{ color: '#a1a1aa', fontStyle: 'italic' }}>
              Inclui todos os benefícios do Membro
              <br />
            </span>
          )}
          {orderedBenefits.map((benefit) => {
            const hasBenefit =
              (isMember && benefit === 'Tag básica') ||
              benefits.includes(benefit);
            // Para membro, não mostrar suporte prioritário/dedicado
            if (
              isMember &&
              (benefit === 'Suporte prioritário' ||
                benefit === 'Suporte dedicado')
            )
              return null;
            return (
              <span key={benefit} className={styles.cardDescription}>
                <span
                  style={{
                    color: hasBenefit ? counter.color : '#ef4444',
                    marginRight: 6,
                    verticalAlign: 'middle',
                  }}
                >
                  {hasBenefit ? (
                    // Check mark
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 20 20"
                      style={{ display: 'inline', verticalAlign: 'middle' }}
                    >
                      <path
                        fill="currentColor"
                        d="M7.629 15.314a1 1 0 0 1-1.414 0l-4.243-4.243a1 1 0 1 1 1.414-1.414l3.536 3.535 7.778-7.778a1 1 0 1 1 1.414 1.415l-8.485 8.485z"
                      />
                    </svg>
                  ) : (
                    // X mark SVG, exceto para "Tag básica" em membro
                    (!isMember || benefit !== 'Tag básica') && (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 20 20"
                        style={{ display: 'inline', verticalAlign: 'middle' }}
                      >
                        <path
                          fill="#ef4444"
                          d="M6 6l8 8M6 14L14 6"
                          stroke="#ef4444"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    )
                  )}
                </span>
                {benefit}
                <br />
              </span>
            );
          })}
        </p>
      </div>
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
      <div className={styles.info_cards}>
        {infos.map((infos, idx) => (
          <InfoCard
            key={infos.label}
            counter={infos}
            idx={idx}
          />
        ))}
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
