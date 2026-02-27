// netlify/functions/verifyRecaptcha.cjs
exports.handler = async (event) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS"
  };

  // Preflight CORS
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ ok: false, success: false, msg: "Método no permitido" })
    };
  }

  try {
    // --- fetch fallback para runtimes sin global fetch ---
    let fetchFn = (typeof globalThis !== "undefined" && globalThis.fetch) || null;
    if (!fetchFn) {
      try {
        const pkgName = "node" + "-fetch";
        const mod = await import(pkgName).catch(() => null);
        fetchFn = (mod && (mod.default || mod)) || null;
      } catch (e) {
        fetchFn = null;
      }
    }

    if (!fetchFn) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ ok: false, success: false, msg: "Fetch no disponible en el runtime" })
      };
    }
    // --- end fallback ---

    const { token } = JSON.parse(event.body || "{}");

    if (!token) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ ok: false, success: false, msg: "Token faltante" })
      };
    }

    // Soportar ambos nombres de variable de entorno
    const secretKey =
      (process.env.RECAPTCHA_SECRET_KEY && process.env.RECAPTCHA_SECRET_KEY.trim()) ||
      (process.env.RECAPTCHA_SECRET && process.env.RECAPTCHA_SECRET.trim()) ||
      null;

    if (!secretKey) {
      console.error("Falta RECAPTCHA_SECRET_KEY / RECAPTCHA_SECRET en env vars");
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ ok: false, success: false, msg: "Server configuration error: missing recaptcha secret" })
      };
    }

    const params = new URLSearchParams();
    params.append('secret', secretKey);
    params.append('response', token);

    const recaptchaResp = await fetchFn('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      body: params
    });

    if (!recaptchaResp.ok) {
      const text = await recaptchaResp.text();
      console.error('Google reCAPTCHA returned non-200:', recaptchaResp.status, text);
      return {
        statusCode: 502,
        headers,
        body: JSON.stringify({ ok: false, success: false, msg: "Error contacting reCAPTCHA provider", status: recaptchaResp.status, detail: text })
      };
    }

    const recaptchaData = await recaptchaResp.json();
    console.log('reCAPTCHA verification result:', recaptchaData);

    const minScore = parseFloat(process.env.RECAPTCHA_MIN_SCORE || '0.5');

    if (!recaptchaData.success) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ ok: false, success: false, msg: "reCAPTCHA verification failed", data: recaptchaData })
      };
    }

    if (typeof recaptchaData.score !== 'undefined' && recaptchaData.score < minScore) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ ok: false, success: false, msg: "Recaptcha score too low", score: recaptchaData.score, minScore })
      };
    }

    // Si llegamos acá, reCAPTCHA fue validado correctamente.
    // NO enviamos EmailJS desde el servidor — devolvemos la verificación al cliente.
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ ok: true, success: true, msg: "reCAPTCHA validated", data: recaptchaData })
    };

  } catch (err) {
    console.error("verifyRecaptcha unexpected error:", err && (err.stack || err.message || err));
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ ok: false, success: false, msg: "Error interno del servidor", error: String(err) })
    };
  }
};
