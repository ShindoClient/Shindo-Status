import { db, admin } from '@/firebase/firebase';

type ClientStatus = {
  uuid: string;
  name: string;
  accountType: string;
  eventType: string;
  timestamp: Date;
};

enum EVENT_TYPES {
  LOGIN = 'login',
  LOGOUT = 'logout',
  REGISTER = 'register',
  UPDATE = 'update',
  JOIN = 'join',
  LEAVE = 'leave',
}

export class ClientController {
  private static readonly COLLECTION = 'users';

  static async getAllStatus() {
    try {
      const snapshot = await db.collection(this.COLLECTION).get();
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (err) {
      console.error('[API] Erro ao buscar status dos clientes:', err);
      throw err;
    }
  }

  static async handleClientEvent(uuid: string, name: string, accountType: string, eventType: string) {
    const userRef = db.collection(this.COLLECTION).doc(uuid);
    const snapshot = await userRef.get();

    try {
      if (snapshot.exists) {
        await this.updateExistingUser(userRef, eventType);
      } else {
        await this.createNewUser(userRef, { name, accountType, eventType });
      }

      return { success: true };
    } catch (err) {
      console.error('[API] Erro ao registrar evento do cliente:', err);
      throw err;
    }
  }

  static async getStatusByUuid(uuid: string) {
    const userRef = await db.collection(this.COLLECTION).doc(uuid);
    const snapshot = await userRef.get();

    if (!snapshot.exists) {
      return null;
    }

    return snapshot.data();
  }

  private static async updateExistingUser(userRef: FirebaseFirestore.DocumentReference, eventType: string) {
    const updateData = this.getUpdateDataForEvent(eventType);
    await userRef.update(updateData);
  }

  private static async createNewUser(
    userRef: FirebaseFirestore.DocumentReference,
    data: { name: string; accountType: string; eventType: string }
  ) {
    const { name, accountType, eventType } = data;
    await userRef.set(
      {
        name,
        accountType,
        privileges: [],
        online: eventType === EVENT_TYPES.JOIN,
        lastJoin: eventType === EVENT_TYPES.JOIN ? admin.firestore.FieldValue.serverTimestamp() : null,
        lastLeave: eventType === EVENT_TYPES.LEAVE ? admin.firestore.FieldValue.serverTimestamp() : null,
      },
      { merge: true }
    );
  }

  private static getUpdateDataForEvent(eventType: string) {
    const updateData: any = {};

    if (eventType === EVENT_TYPES.JOIN) {
      updateData.lastJoin = admin.firestore.FieldValue.serverTimestamp();
      updateData.online = true;
    } else if (eventType === EVENT_TYPES.LEAVE) {
      updateData.lastLeave = admin.firestore.FieldValue.serverTimestamp();
      updateData.online = false;
    }

    return updateData;
  }
}
