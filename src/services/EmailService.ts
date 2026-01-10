// Email service for handling mail operations

// Email service for handling mail operations
import type {EmailPayload, EmailResponse} from '../constants/Interfaces';

export class EmailService {
  private apiUrl: string = 'http://localhost:5000';

  async sendEmail(payload: EmailPayload): Promise<EmailResponse> {
    try {
      const response = await fetch(`${this.apiUrl}/api/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: this.setByTemplate(payload),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      return {
        success: true,
        message: 'Email envoyé avec succès',
      };
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email:', error);
      return {
        success: false,
        message: 'Erreur lors de l\'envoi de l\'email',
      };
    }
  }

  setByTemplate(payload: EmailPayload): string {
      return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb;">
      <div style="background-color: #dc2626; padding: 20px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 2px;">
          KODAK<span style="color: #facc15;">EXPRESS</span>
        </h1>
      </div>

      <div style="background-color: #ffffff; padding: 30px; border: 1px solid #e5e7eb;">
        <h2 style="color: #111827; margin-top: 0;">Merci pour votre commande, ${payload.name} !</h2>
        <p style="color: #4b5563; line-height: 1.6;">
          Nous avons bien reçu vos photos. Notre équipe va commencer le traitement de votre commande dès maintenant.
        </p>
        
        <div style="background-color: #fffbeb; border-left: 4px solid #facc15; padding: 15px; margin: 20px 0;">
          <p style="margin: 0; font-weight: bold; color: #92400e;">Détails de la demande :</p>
          <p style="margin: 5px 0 0 0; color: #4b5563;">${payload.orderDetailsUri}</p>
        </div>

        <p style="color: #4b5563;">Votre commande sera disponible en magasin sous 1 heure.</p>

        <div style="text-align: center; margin-top: 30px;">
          <a href="#" style="background-color: #facc15; color: #000000; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 9999px; display: inline-block;">
            Voir ma commande
          </a>
        </div>
      </div>

      <div style="background-color: #171717; padding: 20px; text-align: center; color: #9ca3af; font-size: 12px;">
        <p>© 2025 Kodak Express Franchise. Tous droits réservés.</p>
        <p>123 Avenue de la République, Paris</p>
      </div>
    </div>
  `;
  }
}

export default new EmailService();