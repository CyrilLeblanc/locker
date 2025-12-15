import Reservation from '../models/reservation.js';
import Locker from '../models/locker.js';
import { sendReservationExpiredEmail, sendReservationReminderEmail } from './mailer.js';

const EXPIRATION_CHECK_INTERVAL = 60 * 1000; // Check every minute
const REMINDER_CHECK_INTERVAL = 5 * 60 * 1000; // Check every 5 minutes

/**
 * Process reservation reminders:
 * - Send reminder email 1 hour before expiration
 * - Mark reservation as reminderSent to avoid duplicates
 */
async function processReservationReminders() {
  try {
    const reservationsNeedingReminder = await Reservation.findNeedingReminder();
    
    console.log(`[Jobs] Processing ${reservationsNeedingReminder.length} reminder(s)`);

    if (reservationsNeedingReminder.length === 0) {
      return;
    }

    for (const reservation of reservationsNeedingReminder) {
      // Send reminder email
      try {
        await sendReservationReminderEmail(reservation.user.email, reservation, reservation.locker);
        console.log(`[Jobs] Reminder email sent to ${reservation.user.email} for locker ${reservation.locker.number}`);
        
        // Mark as sent
        reservation.reminderSent = true;
        await reservation.save();
      } catch (emailErr) {
        console.error(`[Jobs] Failed to send reminder email:`, emailErr.message);
      }
    }
  } catch (error) {
    console.error('[Jobs] Error processing reservation reminders:', error);
  }
}

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
  processReservationReminders();
  
  // Then run periodically
  setInterval(processExpiredReservations, EXPIRATION_CHECK_INTERVAL);
  setInterval(processReservationReminders, REMINDER_CHECK_INTERVAL);
}

export { processExpiredReservations, processReservationReminders };
