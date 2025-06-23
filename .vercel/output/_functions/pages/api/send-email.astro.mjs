import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import nodemailer from 'nodemailer';
export { renderers } from '../../renderers.mjs';

const SMTP_PASSWORD = "oyol jdig bcvi wuji";
const POST = async ({ request }) => {
  try {
    if (!SMTP_PASSWORD) ;
    const formData = await request.json();
    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage([595, 842]);
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const margin = 50;
    let yPosition = height - margin;
    const title = "Resumen del formulario";
    page.drawText(title, {
      x: margin,
      y: yPosition,
      size: 20,
      font: fontBold,
      color: rgb(0, 0.53, 0.71)
    });
    yPosition -= 40;
    for (const [question, answer] of Object.entries(formData)) {
      page.drawText(`${question}:`, {
        x: margin,
        y: yPosition,
        size: 14,
        font: fontBold,
        color: rgb(0.2, 0.2, 0.2)
      });
      yPosition -= 18;
      const text = typeof answer === "string" ? answer : JSON.stringify(answer);
      page.drawText(text, {
        x: margin + 10,
        y: yPosition,
        size: 12,
        font,
        color: rgb(0, 0, 0)
      });
      yPosition -= 30;
      if (yPosition < margin + 30) {
        yPosition = height - margin;
        page = pdfDoc.addPage([595, 842]);
      }
    }
    const pdfBytes = await pdfDoc.save();
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "miguel.teranj02@gmail.com",
        pass: SMTP_PASSWORD
      }
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
          contentType: "application/pdf"
        }
      ]
    });
    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error al generar o enviar el PDF:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || "Error al enviar el formulario."
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
