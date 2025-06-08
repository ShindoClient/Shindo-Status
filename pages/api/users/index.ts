import type { NextApiRequest, NextApiResponse } from 'next';
import { ClientController } from '../../../controllers/ClientController';

type OnlineUser = {
  uuid: string;
  name: string;
  accountType: string;
  eventType: string;
  timestamp: string;
  online?: boolean;
  privileges?: string[];
};

type OnlineSummary = {
  staff: OnlineUser[];
  diamond: OnlineUser[];
  gold: OnlineUser[];
  member: OnlineUser[];
  total: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<OnlineSummary | { message: string }>
) {
  try {
    // Busca todos os usuários online
    const allClients = await ClientController.getAllStatus();
    const onlinePlayers: OnlineUser[] = Array.isArray(allClients)
      ? allClients
          .filter((p) => (p as any).online)
          .map((p) => ({
            uuid: (p as any).uuid ?? (p as any).id ?? '',
            name: (p as any).name ?? '',
            accountType: (p as any).accountType ?? '',
            eventType: (p as any).eventType ?? '',
            timestamp: (p as any).timestamp ?? '',
            online: (p as any).online,
            privileges: (p as any).privileges ?? [],
          }))
      : [];

    const staff: OnlineUser[] = [];
    const diamond: OnlineUser[] = [];
    const gold: OnlineUser[] = [];
    const member: OnlineUser[] = [];

    onlinePlayers.forEach((player) => {
      const privileges: string[] = Array.isArray(player.privileges)
        ? player.privileges.map((p: string) => p.toLowerCase())
        : [];
      if (privileges.includes('staff')) staff.push(player);
      else if (privileges.includes('diamond')) diamond.push(player);
      else if (privileges.includes('gold')) gold.push(player);
      else if (privileges.length === 0) member.push(player);
    });

    res.status(200).json({
      staff,
      diamond,
      gold,
      member,
      total: onlinePlayers.length,
    });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar usuários online.' });
  }
}