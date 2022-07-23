// Function: orders alphabetically an array of elements or objects (include key param)
export default function alphabeticOrder(array, order, key) {
  if (!key)
    return array.sort((a, b) => {
      // Compare lower case letters
      let fa = a.toLowerCase(),
        fb = b.toLowerCase();

      // If callback returns:
      // -1 -> sort will put a then b
      //  1 -> sort will put b then a
      //  0 -> sort will leave them in their places
      if (order === "asc") {
        if (fa < fb) return -1;
        if (fa > fb) return 1;
      }
      if (order === "desc") {
        if (fa > fb) return -1;
        if (fa < fb) return 1;
      }
      return 0;
    });

  return array.sort((a, b) => {
    // If given an array of objects, will sort based on the key argument
    let fa = a[key].toLowerCase(),
      fb = b[key].toLowerCase();
    if (order === "asc") {
      if (fa < fb) return -1;
      if (fa > fb) return 1;
    }
    if (order === "desc") {
      if (fa > fb) return -1;
      if (fa < fb) return 1;
    }
    return 0;
  });
}
