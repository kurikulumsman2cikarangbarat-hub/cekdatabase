export async function onRequest(context) {
  const { env } = context;

  // Header untuk NocoDB
  const headers = {
    "xc-token": env.NOCODB_TOKEN,
    "Content-Type": "application/json"
  };

  try {
    // Mengambil data dari 3 tabel berbeda secara paralel
    const [resGuru, resUjian, resSoal] = await Promise.all([
      fetch(`${env.NOCODB_URL}${env.NOCODB_TABLE_DATA}`, { headers }),
      fetch(`${env.NOCODB_URL}${env.NOCODB_TABLE_UJIAN}`, { headers }),
      fetch(`${env.NOCODB_URL}${env.NOCODB_TABLE_BANK_SOAL}`, { headers })
    ]);

    const dataGuru = await resGuru.json();
    const dataUjian = await resUjian.json();
    const dataSoal = await resSoal.json();

    return new Response(JSON.stringify({
      guru: dataGuru,
      ujian: dataUjian,
      bank_soal: dataSoal
    }), {
      headers: { "Content-Type": "application/json" }
    });
    
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}