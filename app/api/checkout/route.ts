import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { order_id, gross_amount, items, customer_details } = body;

    // 1. Ambil Server Key
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    
    if (!serverKey) {
      console.error("❌ Error: MIDTRANS_SERVER_KEY tidak ditemukan di .env.local");
      throw new Error("Server Key Midtrans tidak ditemukan!");
    }

    // 2. PROTEKSI HARGA: Midtrans IDR tidak boleh desimal (No Cents)
    // Kita bulatkan total dan harga item agar Midtrans tidak menolak transaksi
    const finalGrossAmount = Math.round(gross_amount);
    
    const validatedItems = items.map((item: any) => ({
      ...item,
      price: Math.round(item.price), // Pastikan harga satuan juga bulat
    }));

    // 3. Konversi Server Key ke Base64
    const base64ServerKey = Buffer.from(serverKey + ':').toString('base64');

    // 4. Request ke Midtrans Sandbox
    const midtransResponse = await fetch('https://app.sandbox.midtrans.com/snap/v1/transactions', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Basic ${base64ServerKey}`,
      },
      body: JSON.stringify({
        transaction_details: {
          order_id: order_id,
          gross_amount: finalGrossAmount, // Menggunakan angka yang sudah dibulatkan
        },
        item_details: validatedItems, // Menggunakan item dengan harga bulat
        customer_details: customer_details,
      }),
    });

    const data = await midtransResponse.json();
    
    if (!midtransResponse.ok) {
      console.error("❌ Midtrans API Error:", data);
      throw new Error(data.error_messages ? data.error_messages[0] : 'Gagal membuat transaksi Midtrans');
    }

    // 5. Kirim Token Snap ke Frontend
    return NextResponse.json({ token: data.token });

  } catch (error: any) {
    console.error("🚨 Backend Checkout Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}