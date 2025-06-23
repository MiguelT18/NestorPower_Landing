import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { email, nombre, telefono } = body;

    if (!email || !nombre) {
      return new Response(
        JSON.stringify({ error: "Faltan campos requeridos: email o nombre." }),
        { status: 400 }
      );
    }

    const brevoRes = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": import.meta.env.BREVO_API_KEY as string
      },
      body: JSON.stringify({
        email,
        attributes: {
          NOMBRE: nombre,
          TELEFONO: telefono
        },
        listIds: [2],
        updateEnabled: true, // si ya existe, lo actualiza
      })
    });

    if (!brevoRes.ok) {
      const errorData = await brevoRes.json();
      console.error("[BREVO] Error al agregar contacto:", errorData);
      return new Response(
        JSON.stringify({ error: "Falló la API de Brevo", details: errorData }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Contacto agregado a Brevo" }),
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[BREVO] Hubo un error al agregar el contacto", error);
    return new Response(
      JSON.stringify({ error: "Error interno del servidor", details: error?.message }),
      { status: 500 }
    );
  }
};