function drawImage(size) {
    for (let i = 0; i < size; i++) {
      let row = "";
      for (let j = 0; j < size; j++) {
        if ((i + j) % 2 === 0) {
          row += "* ";
        } else {
          row += "# ";
        }
      }
      console.log(row.trim());
    }
  }
  
  drawImage(5);
  console.log("\n");
  drawImage(7);
  