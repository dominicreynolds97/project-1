const array1 = [[1,2,3,4,5],[6,7,8,9,10],[11,12,13,14,15]]

const array2 = [[],[],[],[],[]]

array1.forEach((e) => {
  e.forEach((e2, j) => {
    array2[j].push(e2)
  })
})

array2.splice(1,1)
array2.unshift([0,0,0])

array2.forEach((e,i) => {
  e.forEach((e2,j) => {
    array1[j][i] = e2
  })
})

console.log(array1)