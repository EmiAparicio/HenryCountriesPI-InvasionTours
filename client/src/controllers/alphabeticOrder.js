export default function alphabeticOrder(array, order, key) {
  if (!key)
    return array.sort((a, b) => {
      let fa = a.toLowerCase(),
        fb = b.toLowerCase();
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
