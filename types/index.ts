export enum EVENT_TYPES {
  LOGIN = 'login',
  LOGOUT = 'logout',
  REGISTER = 'register',
  UPDATE = 'update',
  JOIN = 'join',
  LEAVE = 'leave',
  PING = 'ping',
}

export type ClientStatus = {
  uuid: string;
  name: string;
  accountType: string;
  eventType: string;
  timestamp: Date;
};
