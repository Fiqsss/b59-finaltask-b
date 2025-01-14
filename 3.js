function drawImage(size) {
  if (size % 2 === 0) {
    console.log("Masukkan ukuran pola dengan bilangan ganjil!");
    return;
  }

  var mid = (size - 1) / 2;

  for (var i = 0; i < size; i++) {
    var row = "";

    for (var j = 0; j < size; j++) {
      if (i === mid || j === mid) {
        row += "* ";
      } else {
        row += "# ";
      }
    }

    console.log(row);
  }
}


drawImage(5);
console.log("\n");
drawImage(7);
