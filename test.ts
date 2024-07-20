var arr = [1,2,3]

// arr.forEach((a, index) => {
//   if(index === 1) {
//     arr.splice(index, 1, ...[8,9]);
// console.log(index, arr)
//   }
//   console.log(a)
// })

for (let index = 0; index < arr.length; index++) {
  const element = arr[index];
  if(index === 1) {

    // arr[index] = null;
    delete arr[index];

    arr.splice(index, 1, ...[8,9]);
  }

  console.log(element)

}