import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: "Todos los campos son obligatorios." },
        { status: 400 }
      );
    }

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS || process.env.SMTP_PASS === "TU_APP_PASSWORD_AQUI") {
      return NextResponse.json(
        { error: "El servicio de correo no está configurado. Contacta al administrador." },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const destinatario = process.env.CONTACT_EMAIL || "sproyectorunaflow@proton.me";

    const mailOptions = {
      from: `"${name.trim()} vía Runa Flow" <${process.env.SMTP_USER}>`,
      to: destinatario,
      replyTo: `"${name.trim()}" <${email.trim()}>`,
      subject: `[Runa Flow] Nueva señal de: ${name.trim()}`,
      html: `
        <div style="background-color: #000000; padding: 40px 20px; font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #09090b; border: 1px solid #27272a; border-radius: 12px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
            
            <!-- Top Accent Line -->
            <div style="height: 4px; background-color: #22c55e;"></div>

            <!-- Header -->
            <div style="padding: 40px 30px 20px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 900; letter-spacing: 6px; text-transform: uppercase; font-style: italic;">
                RUNA FLOW
              </h1>
              <p style="margin: 12px 0 0; color: #ea580c; font-size: 10px; letter-spacing: 3px; text-transform: uppercase; font-weight: 700;">
                Sistema de Monitoreo
              </p>
            </div>

            <!-- Content -->
            <div style="padding: 20px 30px 40px;">
              
              <!-- Sender Block -->
              <div style="background-color: #18181b; border-left: 3px solid #22c55e; padding: 20px; margin-bottom: 24px; border-radius: 0 8px 8px 0;">
                <p style="margin: 0 0 6px; color: #71717a; font-size: 10px; text-transform: uppercase; letter-spacing: 1px;">Remitente</p>
                <p style="margin: 0 0 4px; color: #ffffff; font-size: 18px; font-weight: 700;">${name.trim()}</p>
                <a href="mailto:${email.trim()}" style="color: #ea580c; font-size: 14px; text-decoration: none; font-weight: 500;">${email.trim()}</a>
              </div>

              <!-- Message Block -->
              <div style="background-color: #111111; border: 1px solid #27272a; border-radius: 8px; padding: 24px;">
                <p style="margin: 0 0 16px; color: #71717a; font-size: 10px; text-transform: uppercase; letter-spacing: 1px;">Contenido del Mensaje</p>
                <p style="margin: 0; color: #e4e4e7; font-size: 15px; line-height: 1.7; white-space: pre-wrap;">${message.trim()}</p>
              </div>

            </div>

            <!-- Footer -->
            <div style="background-color: #050505; border-top: 1px solid #27272a; padding: 24px; text-align: center;">
              <p style="margin: 0; color: #52525b; font-size: 10px; text-transform: uppercase; letter-spacing: 2px;">
                Polifonía Films • Runa Flow © ${new Date().getFullYear()}
              </p>
              <p style="margin: 10px 0 0; color: #3f3f46; font-size: 10px; font-style: italic;">
                Responde directamente a este correo para contactar al usuario.
              </p>
            </div>

          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error sending email:", err);
    return NextResponse.json(
      { error: "Error al enviar el mensaje. Verifica la configuración SMTP." },
      { status: 500 }
    );
  }
}