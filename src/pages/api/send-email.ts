import type { APIRoute } from "astro";
import path from "path";
import fs from "fs/promises";
import nodemailer from "nodemailer";

const API2PDF_KEY = import.meta.env.API2PDF_KEY;
const SMTP_PASSWORD = import.meta.env.SMTP_GMAIL_PASSWORD;

export const POST: APIRoute = async ({ request }) => {
  try {
    // Validar variables de entorno
    if (!API2PDF_KEY) throw new Error("API2PDF_KEY no está definida");
    if (!SMTP_PASSWORD) throw new Error("SMTP_GMAIL_PASSWORD no está definido");

    const formData = await request.json();

    // Confirmar ruta absoluta y existencia del template
    const templatePath = path.resolve("./src/lib/form.html");
    const template = await fs.readFile(templatePath, "utf8");

    const htmlForm = Object.entries(formData)
      .map(([k, v]) => `<div class="question">${k}</div><div class="answer">${v}</div>`)
      .join("");
    const finalHtml = template.replace("{{formulario}}", htmlForm);

    if (!finalHtml.includes("<html") || !finalHtml.includes("</html>")) {
      throw new Error("HTML generado inválido");
    }

    // Usar fetch global si está disponible
    const fetchFn = globalThis.fetch || (await import("node-fetch")).default;

    const apiRes = await fetchFn("https://v2.api2pdf.com/chrome/html", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: API2PDF_KEY,
      },
      body: JSON.stringify({
        html: finalHtml,
        inlinePdf: true,
        fileName: "resumen-formulario.pdf",
      }),
    });

    if (!apiRes.ok) {
      const errText = await apiRes.text();
      throw new Error(`Error API2PDF: ${apiRes.status} - ${errText}`);
    }

    const apiJson = await apiRes.json() as { success: boolean; pdf?: string; };

    if (!apiJson.success || !apiJson.pdf) {
      throw new Error("Error en la generación del PDF con Api2Pdf");
    }

    let pdfBuffer: Buffer;
    if (apiJson.pdf.startsWith("http")) {
      const pdfRes = await fetchFn(apiJson.pdf);
      if (!pdfRes.ok) throw new Error("Error al descargar el PDF desde URL");
      const arrayBuffer = await pdfRes.arrayBuffer();
      pdfBuffer = Buffer.from(arrayBuffer);
    } else {
      pdfBuffer = Buffer.from(apiJson.pdf, "base64");
    }

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
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
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
