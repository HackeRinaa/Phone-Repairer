const MIN_RADIUS = 7.5;
const MAX_RADIUS = 15;
const DEPTH = 2;
const LEFT_COLOR = "6366f1";
const RIGHT_COLOR = "8b5cf6";
const NUM_POINTS = 2500;

type Point = {
  idx: number;
  position: [number, number, number];
  color: string;
};

const getGradientStop = (ratio: number): string => {
  ratio = Math.max(0, Math.min(1, ratio));

  const c0 = LEFT_COLOR.match(/.{1,2}/g)?.map((oct) => parseInt(oct, 16) * (1 - ratio)) || [];
  const c1 = RIGHT_COLOR.match(/.{1,2}/g)?.map((oct) => parseInt(oct, 16) * ratio) || [];
  const ci = [0, 1, 2].map((i) => Math.min(Math.round((c0[i] || 0) + (c1[i] || 0)), 255));
  
  return `#${ci.reduce((a, v) => (a << 8) + v, 0).toString(16).padStart(6, "0")}`;
};

const calculateColor = (x: number): string => {
  const maxDiff = MAX_RADIUS * 2;
  const distance = x + MAX_RADIUS;
  const ratio = distance / maxDiff;
  return getGradientStop(ratio);
};

const randomFromInterval = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

export const pointsInner: Point[] = Array.from({ length: NUM_POINTS }, (_, k) => k + 1).map((num) => {
  const randomRadius = randomFromInterval(MIN_RADIUS, MAX_RADIUS);
  const randomAngle = Math.random() * Math.PI * 2;

  const x = Math.cos(randomAngle) * randomRadius;
  const y = Math.sin(randomAngle) * randomRadius;
  const z = randomFromInterval(-DEPTH, DEPTH);

  return {
    idx: num,
    position: [x, y, z],
    color: calculateColor(x),
  };
});

export const pointsOuter: Point[] = Array.from({ length: NUM_POINTS / 4 }, (_, k) => k + 1).map((num) => {
  const randomRadius = randomFromInterval(MIN_RADIUS / 2, MAX_RADIUS * 2);
  const angle = Math.random() * Math.PI * 2;

  const x = Math.cos(angle) * randomRadius;
  const y = Math.sin(angle) * randomRadius;
  const z = randomFromInterval(-DEPTH * 10, DEPTH * 10);

  return {
    idx: num,
    position: [x, y, z],
    color: calculateColor(x),
  };
});
