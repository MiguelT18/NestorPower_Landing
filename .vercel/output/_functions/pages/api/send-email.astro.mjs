import path from 'path';
import fs from 'fs/promises';
import nodemailer from 'nodemailer';
import { chromium } from 'playwright';
export { renderers } from '../../renderers.mjs';

const POST = async ({ request }) => {
  try {
    const formData = await request.json();
    const templatePath = path.resolve("./src/lib/form.html");
    const template = await fs.readFile(templatePath, "utf8");
    const htmlForm = Object.entries(formData).map(([k, v]) => `<div class="question">${k}</div><div class="answer">${v}</div>`).join("");
    const finalHtml = template.replace("{{formulario}}", htmlForm);
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.setContent(finalHtml, { waitUntil: "load" });
    const pdfBuffer = await page.pdf({ format: "A4" });
    await browser.close();
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "miguel.teranj02@gmail.com",
        pass: "oyol jdig bcvi wuji"
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
          content: pdfBuffer,
          contentType: "application/pdf"
        }
      ]
    });
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error al generar o enviar el PDF:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Error al enviar el formulario." }),
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
