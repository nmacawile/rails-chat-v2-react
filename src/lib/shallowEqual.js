export default function shallowEqual(obj1, obj2) {
  const obj1Keys = Object.keys(obj1);
  const obj2Keys = Object.keys(obj2);

  if (obj1Keys.length !== obj2Keys.length) return false;

  return obj1Keys.every((obj1Key) => obj1[obj1Key] === obj2[obj1Key]);
}
