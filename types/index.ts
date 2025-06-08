export enum EVENT_TYPES {
  LOGIN = 'login',
  LOGOUT = 'logout',
  REGISTER = 'register',
  UPDATE = 'update',
  JOIN = 'join',
  LEAVE = 'leave',
  PING = 'ping',
}

export type ApiError = {
  message: string;
  code?: string;
  status?: number;
};

export type ClientStatus = {
  uuid: string;
  name: string;
  accountType: string;
  eventType: string;
  timestamp: Date;
};

export type UpdateData = {
  lastJoin?: FirebaseFirestore.FieldValue;
  lastLeave?: FirebaseFirestore.FieldValue;
  online?: boolean;
};
