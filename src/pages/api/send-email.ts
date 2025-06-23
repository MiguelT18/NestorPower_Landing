import type { APIRoute } from "astro";
import path from "path";
import fs from "fs/promises";
import nodemailer from "nodemailer";
import fetch from "node-fetch";

const API2PDF_KEY = import.meta.env.API2PDF_KEY;
const SMTP_PASSWORD = import.meta.env.SMTP_GMAIL_PASSWORD;

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.json();

    // Leer la plantilla HTML
    const templatePath = path.resolve("./src/lib/form.html");
    const template = await fs.readFile(templatePath, "utf8");

    // Inyectar respuestas al HTML
    const htmlForm = Object.entries(formData)
      .map(
        ([k, v]) =>
          `<div class="question">${k}</div><div class="answer">${v}</div>`
      )
      .join("");

    const finalHtml = template.replace("{{formulario}}", htmlForm);

    // Validar HTML generado (opcional, útil para debug)
    if (!finalHtml.includes("<html") || !finalHtml.includes("</html>")) {
      throw new Error("HTML generado inválido");
    }

    // Llamar a Api2Pdf para generar el PDF
    const apiRes = await fetch("https://v2.api2pdf.com/chrome/html", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": API2PDF_KEY,
      },
      body: JSON.stringify({
        html: finalHtml,
        inlinePdf: true,
        fileName: "resumen-formulario.pdf",
      }),
    });

    const apiJson = await apiRes.json() as { success: boolean; pdf: string; };
    console.log("API2PDF Response:", apiJson);

    if (!apiJson.success || !apiJson.pdf) {
      throw new Error("Error en la generación del PDF con Api2Pdf");
    }

    // Soporte para base64 o URL
    let pdfBuffer: Buffer;
    if (apiJson.pdf.startsWith("http")) {
      const pdfRes = await fetch(apiJson.pdf);
      if (!pdfRes.ok) throw new Error("Error al descargar el PDF");
      const arrayBuffer = await pdfRes.arrayBuffer();
      pdfBuffer = Buffer.from(arrayBuffer);
    } else {
      pdfBuffer = Buffer.from(apiJson.pdf, "base64");
    }

    // Configuración del SMTP con Gmail
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "miguel.teranj02@gmail.com",
        pass: SMTP_PASSWORD,
      },
    });

    // Enviar email con el PDF
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
  } catch (error) {
    console.error("Error al generar o enviar el PDF:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Error al enviar el formulario.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
