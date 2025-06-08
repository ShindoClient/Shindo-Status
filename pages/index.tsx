import Image from 'next/image';
import { useEffect, useState } from 'react';

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
  const [players, setPlayers] = useState<ClientStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState<PlayerGroups>({
    staff: [],
    diamond: [],
    gold: [],
    member: [],
  });

  useEffect(() => {
    async function fetchPlayers() {
      try {
        const res = await fetch('/api/client-status');
        const data = await res.json();
        const onlinePlayers: ClientStatus[] = Array.isArray(data)
          ? data.filter((p) => p.online)
          : [];
        setPlayers(onlinePlayers);

        // Agrupamento por privilégios usando accountType
        const staff: ClientStatus[] = [];
        const diamond: ClientStatus[] = [];
        const gold: ClientStatus[] = [];
        const member: ClientStatus[] = [];

        onlinePlayers.forEach((player) => {
          const privilege = (player.accountType || '').toLowerCase();
          if (privilege === 'staff') staff.push(player);
          else if (privilege === 'diamond') diamond.push(player);
          else if (privilege === 'gold') gold.push(player);
          else member.push(player);
        });

        setGroups({ staff, diamond, gold, member });
      } catch {
        setPlayers([]);
        setGroups({ staff: [], diamond: [], gold: [], member: [] });
      } finally {
        setLoading(false);
      }
    }
    fetchPlayers();
  }, []);

  // Função para renderizar número estilo relógio digital
  function DigitalNumber({ value, color }: { value: number; color: string }) {
    return (
      <span
        style={{
          fontFamily: "'Orbitron', 'Courier New', monospace",
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

  // SVG de ícone online
  function OnlineIcon({ color = '#38ff8e' }) {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" style={{ marginLeft: 8, verticalAlign: 'middle' }}>
        <circle cx="12" cy="12" r="10" fill={color} stroke="#18181b" strokeWidth="2" />
        <circle cx="12" cy="12" r="5" fill={color} />
      </svg>
    );
  }

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

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh',
        background: '#18181b',
        color: '#f4f4f5',
        fontFamily: 'Segoe UI, Arial, sans-serif',
        padding: '32px 8px',
      }}
    >
      {/* Card do título */}
      <div
        style={{
          background: '#23232b',
          borderRadius: '18px',
          boxShadow: '0 4px 24px #0006',
          padding: '24px 32px',
          maxWidth: '480px',
          width: '100%',
          margin: '0 auto 32px auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <h1
          style={{
            color: '#fbbf24',
            marginBottom: 2,
            letterSpacing: 2,
            fontSize: '1.4rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            background: 'linear-gradient(90deg, #fbbf24 40%, #f59e42 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 2px 12px #000a, 0 1px 0 #fff2',
            textAlign: 'center',
            width: '100%',
            padding: '8px 0',
            margin: '0 0 0 0',
            fontFamily: "'Orbitron', 'Courier New', monospace",
            lineHeight: 1.1,
            transition: 'all 0.2s',
          }}
        >
          ShindoClient - Página de Status
        </h1>
      </div>
      {/* Logo separada */}
      <div style={{ margin: '0 0 32px 0', display: 'flex', justifyContent: 'center' }}>
        <Image
          src="/assets/logo.png"
          alt="Logo"
          width={180}
          height={180}
          style={{
            borderRadius: '16px',
            background: '#23232b',
            padding: '8px',
            boxShadow: '0 4px 24px #0004',
          }}
        />
      </div>
      {/* Cards dos grupos */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          alignItems: 'center',
          width: '100%',
          marginBottom: '32px',
        }}
      >
        {counters.map((counter) => (
          <div
            key={counter.label}
            style={{
              background: '#23232b',
              borderRadius: '18px',
              boxShadow: '0 4px 24px #0006',
              padding: '24px 20px',
              minWidth: '320px',
              maxWidth: '340px',
              width: '340px',
              margin: '0 auto',
              border: `2px solid ${counter.color}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'stretch',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: 0,
                width: '100%',
                justifyContent: 'space-between',
              }}
            >
              <span
                style={{
                  color: counter.color,
                  fontWeight: 700,
                  fontSize: '1.2rem',
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                  minWidth: 90,
                  textAlign: 'left',
                  flex: '0 0 90px',
                }}
              >
                {counter.label}
              </span>
              <div style={{ flex: '1 1 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <DigitalNumber value={counter.value} color={counter.color} />
              </div>
              <span style={{ flex: '0 0 40px', display: 'flex', justifyContent: 'flex-end' }}>
                <OnlineIcon color={counter.iconColor} />
              </span>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, width: '100%' }}>
              {loading ? (
                <li style={{ color: '#a1a1aa', textAlign: 'center' }}>Carregando...</li>
              ) : (
                counter.list.map((player) => (
                  <li
                    key={player.uuid}
                    style={{
                      background: '#27272a',
                      margin: '0 0 10px 0',
                      borderRadius: '8px',
                      padding: '10px 12px',
                      color: '#f4f4f5',
                      boxShadow: '0 2px 8px #0002',
                      fontSize: '1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                    }}
                  >
                    <strong style={{ color: counter.color }}>{player.name}</strong>
                    <span style={{ color: '#a1a1aa', fontSize: '0.95rem' }}>({player.accountType})</span>
                  </li>
                ))
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
