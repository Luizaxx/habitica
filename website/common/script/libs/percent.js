// TODO move to client

export default function percent (x, y, dir) {
  // Sem total (y = 0) a porcentagem é indefinida (divisão por zero geraria
  // Infinity/NaN); por convenção retornamos 0.
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
