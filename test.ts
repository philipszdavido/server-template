var arr = [1,2,3]

for (let index = 0; index < arr.length; index++) {
  const element = arr[index];
  if(index === 1) {
    // @ts-ignore
    arr.splice(index, 1, ...[null, 8,9]);
    console.log(arr)
    //index = 0
  }

  console.log(element)

}


