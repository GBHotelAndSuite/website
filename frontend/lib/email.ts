import nodemailer from "nodemailer";
import { calculateNights, formatTime } from "@/lib/utils";

const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const smtpFrom = process.env.SMTP_FROM || smtpUser;

function createTransport() {
  if (!smtpUser || !smtpPass) return null;

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587", 10),
    secure: false,
    auth: { user: smtpUser, pass: smtpPass },
  });
}

export function sendBookingConfirmation(booking: {
  id: string;
  shareToken: string;
  guestName: string;
  guestEmail: string;
  checkIn: string;
  checkOut: string;
  checkInTime: string;
  checkOutTime: string;
  roomName: string;
  totalPrice: number;
}) {
  const transport = createTransport();
  if (!transport) {
    console.log(
      "SMTP not configured — skipping confirmation email for",
      booking.id,
    );
    return;
  }

  const nights = calculateNights(booking.checkIn, booking.checkOut);

  transport
    .sendMail({
      from: smtpFrom,
      to: booking.guestEmail,
      subject: `Booking Confirmed — ${booking.id}`,
      text: `Hi ${booking.guestName},

Your booking at GB Hotel and Suite has been confirmed.

Booking ID: ${booking.id}
Room: ${booking.roomName}
Check-in: ${booking.checkIn} (from ${formatTime(booking.checkInTime)})
Check-out: ${booking.checkOut} (by ${formatTime(booking.checkOutTime)})
Nights: ${nights}
Total: ₦${booking.totalPrice.toLocaleString()}

View your booking:
https://gbhotelandsuite.com/booking/confirmation?token=${booking.shareToken}

We will contact you to finalize your reservation. If you have any questions, please reach out.

GB Hotel and Suite
+234 809 000 1234
info@gbhotelandsuite.com`,
    })
    .then(() => console.log("Confirmation email sent to", booking.guestEmail))
    .catch((err) =>
      console.error("Failed to send confirmation email:", err),
    );
}
