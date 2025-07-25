import { db, admin } from '@/firebase/firebase';
import { UpdateData } from '@/types';
import { EVENT_TYPES } from '@/types';
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
      throw new Error(`[API] Erro ao buscar status dos clientes: ${err}`);
    }
  }

  static async handleClientEvent(
    uuid: string,
    name: string,
    accountType: string,
    eventType: string
  ) {
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
      throw new Error(`[API] Erro ao registrar evento do cliente: ${err}`);
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

  private static async updateExistingUser(
    userRef: FirebaseFirestore.DocumentReference,
    eventType: string
  ) {
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
        lastJoin:
          eventType === EVENT_TYPES.JOIN
            ? admin.firestore.FieldValue.serverTimestamp()
            : null,
        lastLeave:
          eventType === EVENT_TYPES.LEAVE
            ? admin.firestore.FieldValue.serverTimestamp()
            : null,
      },
      { merge: true }
    );
  }

  private static getUpdateDataForEvent(eventType: string): UpdateData {
    const updateData: UpdateData = {};

    if (eventType === EVENT_TYPES.JOIN) {
      updateData.lastJoin = admin.firestore.FieldValue.serverTimestamp();
      updateData.online = true;
    } else if (eventType === EVENT_TYPES.LEAVE) {
      updateData.lastLeave = admin.firestore.FieldValue.serverTimestamp();
      updateData.online = false;
    }

    return updateData;
  }

  static async updateLastSeen(uuid: string) {
    const userRef = db.collection(this.COLLECTION).doc(uuid);
    const snapshot = await userRef.get();

    if (!snapshot.exists) {
      throw new Error(`Usuário ${uuid} não encontrado`);
    }

    await userRef.update({
      lastSeen: admin.firestore.FieldValue.serverTimestamp(),
      online: true // garante que esteja online após o ping
    });
  }

  static async markOfflineIfInactive(thresholdMs: number) {
    const now = Date.now();
    const snapshot = await db.collection(this.COLLECTION).get();

    snapshot.forEach(async (doc) => {
      const data = doc.data();
      const lastSeen = data.lastSeen?.toDate?.() || null;

      if (lastSeen && now - lastSeen.getTime() > thresholdMs && data.online) {
        await db.collection(this.COLLECTION).doc(doc.id).update({
          online: false
        });
        console.log(`[KEEPALIVE] ${doc.id} marcado como offline`);
      }
    });
  }
}
