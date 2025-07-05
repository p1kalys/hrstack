import cron from 'node-cron';
import Event from '../models/Event';

cron.schedule('58 23 * * *', async () => {
    try {
        const now = new Date();
        await Event.deleteMany({ date: { $lt: now } });
        console.log('[CRON] Deleted events older than current date.');
    } catch (error) {
        console.error('[CRON] Failed to delete past events:', error);
    }
});
