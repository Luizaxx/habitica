// TODO move to client

export default function percent (x, y, dir) {
  if (y === 0) {
    return 0;
  }

  let roundFn;
  switch (dir) {
    case 'up':
      roundFn = Math.ceil;
      break;
    case 'down':
      roundFn = Math.floor;
      break;
    default:
      roundFn = Math.round;
  }

  return Math.max(0, roundFn((x / y) * 100));
}
