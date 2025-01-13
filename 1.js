function Hitungbarang(kualitas, qty) {
  let harga = 0;
  let potongan = 0;

  if (kualitas === "A") {
    harga = 4550;
    if (qty > 13) {
      potongan = 231 * qty;
    }
  } else if (kualitas === "B") {
    harga = 5330;
    if (qty > 7) {
      potongan = (23 / 100) * harga * qty;
    }
  } else if (kualitas === "C") {
    harga = 8653;
    potongan = 0;
  } 

  let totalHarga = harga * qty;
  let totalBayar = totalHarga - potongan;

  console.log(`- Total harga barang : ${totalHarga}`);
  console.log(`- Potongan : ${potongan}`);
  console.log(`- Total yang harus dibayar : ${totalBayar}`);
}

Hitungbarang("A", 14);
