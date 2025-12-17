import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "localhost",
    port: parseInt(process.env.SMTP_PORT || "1025"),
    secure: false,
    ignoreTLS: true,
});

const FROM_EMAIL = process.env.SMTP_FROM || "noreply@locker.local";

/**
 * Format a date for display in emails
 */
const formatDate = (date) => {
    return new Date(date).toLocaleString("fr-FR", {
        dateStyle: "long",
        timeStyle: "short",
    });
};

/**
 * Send password reset email
 */
export const sendPasswordResetEmail = async (email, resetToken, baseUrl) => {
    const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;

    const mailOptions = {
        from: FROM_EMAIL,
        to: email,
        subject: "Réinitialisation de votre mot de passe - Locker",
        html: `
      <h2>Réinitialisation de mot de passe</h2>
      <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
      <p>Cliquez sur le lien ci-dessous pour définir un nouveau mot de passe :</p>
      <p><a href="${resetUrl}">Réinitialiser mon mot de passe</a></p>
      <p>Ce lien expirera dans 1 heure.</p>
      <p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
    `,
    };

    return transporter.sendMail(mailOptions);
};

/**
 * Send reservation confirmation email
 */
export const sendReservationConfirmedEmail = async (
    email,
    reservation,
    locker
) => {
    const mailOptions = {
        from: FROM_EMAIL,
        to: email,
        subject: `Réservation confirmée - Casier n°${locker.number} - Locker`,
        html: `
      <h2>Réservation confirmée !</h2>
      <p>Votre réservation a bien été enregistrée.</p>
      <table style="border-collapse: collapse; margin: 20px 0;">
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Casier</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">n°${
              locker.number
          } - ${locker.location}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Taille</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${locker.size}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Début</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${formatDate(
              reservation.startDate
          )}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Fin</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${formatDate(
              reservation.endDate
          )}</td>
        </tr>
      </table>
      <p><strong>Rappel :</strong> Pensez à libérer votre casier avant la fin de la réservation pour éviter son expiration automatique.</p>
    `,
    };

    return transporter.sendMail(mailOptions);
};

/**
 * Send reservation cancelled/returned email
 */
export const sendReservationReturnedEmail = async (
    email,
    reservation,
    locker
) => {
    const mailOptions = {
        from: FROM_EMAIL,
        to: email,
        subject: `Casier rendu - Casier n°${locker.number} - Locker`,
        html: `
      <h2>Casier rendu avec succès</h2>
      <p>Votre réservation a été annulée et le casier est maintenant disponible.</p>
      <table style="border-collapse: collapse; margin: 20px 0;">
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Casier</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">n°${
              locker.number
          } - ${locker.location}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Date de retour</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${formatDate(
              new Date()
          )}</td>
        </tr>
      </table>
      <p>Merci d'avoir utilisé notre service !</p>
    `,
    };

    return transporter.sendMail(mailOptions);
};

/**
 * Send reminder email before reservation expires
 */
export const sendReservationReminderEmail = async (
    email,
    reservation,
    locker
) => {
    const mailOptions = {
        from: FROM_EMAIL,
        to: email,
        subject: `⏰ Rappel - Votre casier expire bientôt - Casier n°${locker.number} - Locker`,
        html: `
      <h2>⏰ Votre réservation expire bientôt !</h2>
      <p>Votre réservation pour le casier suivant arrive à expiration dans moins d'une heure :</p>
      <table style="border-collapse: collapse; margin: 20px 0;">
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Casier</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">n°${
              locker.number
          } - ${locker.location}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Taille</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${locker.size}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Date d'expiration</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${formatDate(
              reservation.endDate
          )}</td>
        </tr>
      </table>
      <p><strong>Action requise :</strong> Pensez à libérer votre casier avant l'expiration pour éviter une libération automatique.</p>
      <p>Si vous avez terminé, vous pouvez annuler votre réservation depuis votre espace personnel.</p>
    `,
    };

    return transporter.sendMail(mailOptions);
};

/**
 * Send reservation expired email
 */
export const sendReservationExpiredEmail = async (
    email,
    reservation,
    locker
) => {
    const mailOptions = {
        from: FROM_EMAIL,
        to: email,
        subject: `Réservation expirée - Casier n°${locker.number} - Locker`,
        html: `
      <h2>Votre réservation a expiré</h2>
      <p>Votre réservation pour le casier suivant a expiré :</p>
      <table style="border-collapse: collapse; margin: 20px 0;">
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Casier</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">n°${
              locker.number
          } - ${locker.location}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Date d'expiration</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${formatDate(
              reservation.endDate
          )}</td>
        </tr>
      </table>
      <p>Le casier est maintenant disponible pour d'autres utilisateurs.</p>
      <p>Si vous avez encore besoin d'un casier, vous pouvez effectuer une nouvelle réservation.</p>
    `,
    };

    return transporter.sendMail(mailOptions);
};

export default transporter;
