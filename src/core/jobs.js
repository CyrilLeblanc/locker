import Reservation from '../models/reservation.js';
import Locker from '../models/locker.js';
import { sendReservationExpiredEmail } from './mailer.js';

const EXPIRATION_CHECK_INTERVAL = 60 * 1000; // Check every minute

/**
 * Process expired reservations:
 * - Update reservation status to 'expired'
 * - Set locker status back to 'available'
 */
async function processExpiredReservations() {
  try {
    const expiredReservations = await Reservation.findExpired();
    
    console.log(`[Jobs] Processing ${expiredReservations.length} expired reservation(s)`);

    if (expiredReservations.length === 0) {
      return;
    }


    for (const reservation of expiredReservations) {
      // Update reservation status
      reservation.status = 'expired';
      await reservation.save();

      // Set locker back to available
      await Locker.findByIdAndUpdate(reservation.locker._id, { status: 'available' });

      // Send expiration email
      try {
        await sendReservationExpiredEmail(reservation.user.email, reservation, reservation.locker);
        console.log(`[Jobs] Expiration email sent to ${reservation.user.email}`);
      } catch (emailErr) {
        console.error(`[Jobs] Failed to send expiration email:`, emailErr.message);
      }

      console.log(`[Jobs] Reservation ${reservation._id} expired - Locker ${reservation.locker.number} now available`);
    }
  } catch (error) {
    console.error('[Jobs] Error processing expired reservations:', error);
  }
}

/**
 * Start the background job scheduler
 */
export function startBackgroundJobs() {
  console.log('[Jobs] Starting background job scheduler');
  
  // Run immediately on startup
  processExpiredReservations();
  
  // Then run periodically
  setInterval(processExpiredReservations, EXPIRATION_CHECK_INTERVAL);
}

export { processExpiredReservations };
