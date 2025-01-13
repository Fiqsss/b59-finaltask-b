function bubbleSort(arr) {
    
    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          let temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
        }
      }
    }
  
    return arr;
  }
  
  let array = [20, 12, 35, 11, 17, 9, 58, 23, 69, 21];
  
  let sortedArray = bubbleSort(array);
  console.log("Array setelah diurutkan:", sortedArray);
  