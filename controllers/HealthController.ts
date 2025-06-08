export class HealthController {
  static async check() {
    return { success: true, ping: true };
  }
}
