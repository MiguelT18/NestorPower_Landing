import type { APIRoute } from "astro";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import nodemailer from "nodemailer";

const SMTP_PASSWORD = import.meta.env.SMTP_GMAIL_PASSWORD;

export const POST: APIRoute = async ({ request }) => {
  try {
    if (!SMTP_PASSWORD) throw new Error("SMTP_GMAIL_PASSWORD no está definido");

    const formData = await request.json();

    // Crear documento PDF
    const pdfDoc = await PDFDocument.create();

    // Añadir página
    let page = pdfDoc.addPage([595, 842]); // A4 en puntos (72 dpi)
    const { width, height } = page.getSize();

    // Fuentes
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const margin = 50;
    let yPosition = height - margin;

    // Título
    const title = "Resumen del formulario";
    page.drawText(title, {
      x: margin,
      y: yPosition,
      size: 20,
      font: fontBold,
      color: rgb(0, 0.53, 0.71),
    });

    yPosition -= 40;

    // Mostrar cada pregunta y respuesta
    for (const [question, answer] of Object.entries(formData)) {
      // Pregunta en negrita
      page.drawText(`${question}:`, {
        x: margin,
        y: yPosition,
        size: 14,
        font: fontBold,
        color: rgb(0.2, 0.2, 0.2),
      });
      yPosition -= 18;

      // Respuesta en normal
      const text = typeof answer === "string" ? answer : JSON.stringify(answer);
      // Para saltos de línea simples (puedes mejorar con text wrapping)
      page.drawText(text, {
        x: margin + 10,
        y: yPosition,
        size: 12,
        font,
        color: rgb(0, 0, 0),
      });

      yPosition -= 30;

      // Salto de página si se acaba el espacio
      if (yPosition < margin + 30) {
        yPosition = height - margin;
        page = pdfDoc.addPage([595, 842]);
      }
    }

    // Serializar PDF a bytes
    const pdfBytes = await pdfDoc.save();

    // Configuración SMTP
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "miguel.teranj02@gmail.com",
        pass: SMTP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: "Formulario <yo@misitio.com>",
      to: "arcenestor068@gmail.com",
      subject: "📄 NUEVO USUARIO | Resumen del formulario",
      text: "Adjunto encontrarás el PDF con las respuestas del formulario del nuevo usuario.",
      attachments: [
        {
          filename: "resumen-formulario.pdf",
          content: Buffer.from(pdfBytes),
          contentType: "application/pdf",
        },
      ],
    });

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error al generar o enviar el PDF:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || "Error al enviar el formulario.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
