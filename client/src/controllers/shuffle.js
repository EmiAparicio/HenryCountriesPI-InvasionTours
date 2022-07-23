// Function: shuffles array elements
export default function shuffle(array) {
  // Starts from last element
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex !== 0) {
    // Random index between 0 and currentIndex
    randomIndex = Math.floor(Math.random() * currentIndex);

    // Decrease currentIndex each time current element is exhanged with a random one
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}
