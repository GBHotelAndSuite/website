import nodemailer from "nodemailer";
import { calculateNights, formatTime } from "@/lib/utils";

const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const smtpFrom = process.env.SMTP_FROM || smtpUser;

const STATUS_LABELS: Record<string, string> = {
  confirmed: "Confirmed",
  checked_in: "Checked In",
  checked_out: "Checked Out",
  cancelled: "Cancelled",
  no_show: "No Show",
};

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

export function sendAdminNewBookingNotification(
  hotelEmail: string,
  booking: {
    id: string;
    guestName: string;
    guestEmail: string;
    guestPhone: string | null;
    checkIn: string;
    checkOut: string;
    roomName: string;
    totalPrice: number;
    notes: string | null;
  },
) {
  const transport = createTransport();
  if (!transport) {
    console.log("SMTP not configured — skipping admin notification");
    return;
  }

  const nights = calculateNights(booking.checkIn, booking.checkOut);

  transport
    .sendMail({
      from: smtpFrom,
      to: hotelEmail,
      subject: `New Booking — ${booking.id} — ${booking.guestName}`,
      text: `A new booking has been placed.

Booking ID: ${booking.id}
Guest: ${booking.guestName}
Email: ${booking.guestEmail}
Phone: ${booking.guestPhone || "—"}
Room: ${booking.roomName}
Check-in: ${booking.checkIn}
Check-out: ${booking.checkOut}
Nights: ${nights}
Total: ₦${booking.totalPrice.toLocaleString()}
Notes: ${booking.notes || "—"}

Manage booking:
https://gbhotelandsuite.com/admin/bookings/${booking.id}`,
    })
    .then(() => console.log("Admin notification sent to", hotelEmail))
    .catch((err) =>
      console.error("Failed to send admin notification:", err),
    );
}

export function sendBookingStatusChange(
  to: string,
  role: "guest" | "admin",
  booking: {
    id: string;
    guestName: string;
    status: string;
    roomName: string;
    checkIn: string;
    checkOut: string;
    totalPrice: number;
    shareToken: string | null;
  },
) {
  const transport = createTransport();
  if (!transport) {
    console.log("SMTP not configured — skipping status change email");
    return;
  }

  const label = STATUS_LABELS[booking.status] || booking.status;

  if (role === "guest") {
    const guestLink = booking.shareToken
      ? `\nView your booking:\nhttps://gbhotelandsuite.com/booking/confirmation?token=${booking.shareToken}\n`
      : "";
    transport
      .sendMail({
        from: smtpFrom,
        to,
        subject: `Booking ${booking.id} — Status Updated`,
        text: `Hi ${booking.guestName},

The status of your booking at GB Hotel and Suite has been updated.

Booking ID: ${booking.id}
Room: ${booking.roomName}
Status: ${label}
Check-in: ${booking.checkIn}
Check-out: ${booking.checkOut}
Total: ₦${booking.totalPrice.toLocaleString()}
${guestLink}
If you have any questions, please reach out.

GB Hotel and Suite
+234 809 000 1234
info@gbhotelandsuite.com`,
      })
      .then(() => console.log("Status change email sent to guest", to))
      .catch((err) =>
        console.error("Failed to send status change email to guest:", err),
      );
  } else {
    transport
      .sendMail({
        from: smtpFrom,
        to,
        subject: `Booking ${booking.id} — ${booking.guestName} — Status: ${label}`,
        text: `Booking status has been updated.

Booking ID: ${booking.id}
Guest: ${booking.guestName}
Room: ${booking.roomName}
Status: ${label}
Check-in: ${booking.checkIn}
Check-out: ${booking.checkOut}
Total: ₦${booking.totalPrice.toLocaleString()}

Manage booking:
https://gbhotelandsuite.com/admin/bookings/${booking.id}`,
      })
      .then(() => console.log("Status change email sent to admin", to))
      .catch((err) =>
        console.error("Failed to send status change email to admin:", err),
      );
  }
}
