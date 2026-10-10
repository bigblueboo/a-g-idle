/** Earth as boxes. Good enough to recognise from a rotating globe of 160 tiles. */
interface Region {
  name: string;
  lat: [number, number];
  lon: [number, number];
  /** Millions of people. */
  pop: number;
  /** Biosphere value, 0–1. */
  bio: number;
}

export const REGIONS: readonly Region[] = [
  { name: "Alaska", lat: [55, 72], lon: [-170, -130], pop: 1, bio: 0.8 },
  { name: "Western Canada", lat: [49, 70], lon: [-130, -95], pop: 8, bio: 0.9 },
  { name: "Eastern Canada", lat: [45, 62], lon: [-95, -55], pop: 20, bio: 0.8 },
  { name: "Greenland", lat: [60, 83], lon: [-55, -20], pop: 0.06, bio: 0.6 },
  { name: "US West", lat: [32, 49], lon: [-125, -105], pop: 70, bio: 0.6 },
  { name: "US Plains", lat: [30, 49], lon: [-105, -88], pop: 90, bio: 0.5 },
  { name: "US East", lat: [25, 47], lon: [-88, -67], pop: 150, bio: 0.5 },
  { name: "Mexico", lat: [15, 32], lon: [-117, -87], pop: 130, bio: 0.6 },
  { name: "Caribbean", lat: [8, 23], lon: [-87, -60], pop: 60, bio: 0.8 },
  { name: "Amazon", lat: [-15, 5], lon: [-75, -45], pop: 30, bio: 1 },
  { name: "Andes", lat: [-40, 5], lon: [-82, -65], pop: 80, bio: 0.8 },
  { name: "Brazilian coast", lat: [-30, -5], lon: [-55, -35], pop: 150, bio: 0.6 },
  { name: "Southern Cone", lat: [-55, -22], lon: [-75, -53], pop: 70, bio: 0.6 },
  { name: "Iberia", lat: [36, 44], lon: [-10, 3], pop: 55, bio: 0.5 },
  { name: "British Isles", lat: [50, 59], lon: [-11, 2], pop: 70, bio: 0.4 },
  { name: "Western Europe", lat: [43, 55], lon: [-5, 15], pop: 180, bio: 0.4 },
  { name: "Scandinavia", lat: [55, 71], lon: [5, 30], pop: 25, bio: 0.8 },
  { name: "Central Europe", lat: [45, 55], lon: [15, 30], pop: 100, bio: 0.5 },
  { name: "Eastern Europe", lat: [45, 60], lon: [30, 45], pop: 90, bio: 0.5 },
  { name: "Mediterranean", lat: [36, 45], lon: [3, 30], pop: 120, bio: 0.5 },
  { name: "Maghreb", lat: [28, 37], lon: [-12, 12], pop: 90, bio: 0.4 },
  { name: "Sahara", lat: [18, 30], lon: [-17, 35], pop: 2, bio: 0.2 },
  { name: "Sahel", lat: [10, 18], lon: [-17, 40], pop: 150, bio: 0.5 },
  { name: "Gulf of Guinea", lat: [4, 10], lon: [-15, 10], pop: 200, bio: 0.7 },
  { name: "Congo", lat: [-10, 5], lon: [10, 30], pop: 120, bio: 1 },
  { name: "East Africa", lat: [-12, 12], lon: [30, 52], pop: 250, bio: 0.8 },
  { name: "Southern Africa", lat: [-35, -10], lon: [12, 40], pop: 150, bio: 0.7 },
  { name: "Madagascar", lat: [-26, -12], lon: [43, 51], pop: 30, bio: 0.9 },
  { name: "Arabia", lat: [12, 32], lon: [35, 60], pop: 90, bio: 0.2 },
  { name: "Anatolia and Persia", lat: [25, 42], lon: [26, 63], pop: 250, bio: 0.4 },
  { name: "Central Asia", lat: [35, 55], lon: [45, 90], pop: 80, bio: 0.4 },
  { name: "Western Siberia", lat: [55, 75], lon: [60, 100], pop: 3, bio: 0.8 },
  { name: "Eastern Siberia", lat: [50, 75], lon: [100, 180], pop: 3, bio: 0.8 },
  { name: "Gangetic Plain", lat: [20, 35], lon: [68, 90], pop: 700, bio: 0.4 },
  { name: "Southern India", lat: [8, 20], lon: [72, 88], pop: 400, bio: 0.6 },
  { name: "Tibet", lat: [27, 40], lon: [75, 100], pop: 20, bio: 0.6 },
  { name: "North China Plain", lat: [35, 50], lon: [100, 125], pop: 400, bio: 0.4 },
  { name: "Yangtze basin", lat: [20, 35], lon: [100, 122], pop: 600, bio: 0.5 },
  { name: "Mekong", lat: [5, 22], lon: [95, 110], pop: 300, bio: 0.8 },
  { name: "Malay Archipelago", lat: [-10, 7], lon: [95, 140], pop: 350, bio: 0.9 },
  { name: "Korea", lat: [34, 43], lon: [124, 131], pop: 80, bio: 0.5 },
  { name: "Japan", lat: [31, 45], lon: [129, 146], pop: 125, bio: 0.6 },
  { name: "Philippines", lat: [5, 19], lon: [117, 127], pop: 115, bio: 0.8 },
  { name: "Western Australia", lat: [-35, -12], lon: [112, 130], pop: 3, bio: 0.6 },
  { name: "Eastern Australia", lat: [-39, -10], lon: [130, 154], pop: 23, bio: 0.7 },
  { name: "New Zealand", lat: [-47, -34], lon: [166, 179], pop: 5, bio: 0.9 },
  { name: "New Guinea", lat: [-10, 0], lon: [130, 151], pop: 15, bio: 1 },
  { name: "Antarctica", lat: [-90, -65], lon: [-180, 180], pop: 0, bio: 0.5 },
];

export const TILE_COUNT = 160;

export function regionAt(lat: number, lon: number): Region | undefined {
  return REGIONS.find((r) => lat >= r.lat[0] && lat <= r.lat[1] && lon >= r.lon[0] && lon <= r.lon[1]);
}

/** Evenly spread points on a sphere. */
export function fibonacciSphere(n: number): { lat: number; lon: number }[] {
  const golden = Math.PI * (3 - Math.sqrt(5));
  const out: { lat: number; lon: number }[] = [];
  for (let i = 0; i < n; i++) {
    const y = 1 - (2 * (i + 0.5)) / n;
    const lat = (Math.asin(y) * 180) / Math.PI;
    const lon = ((((i * golden) % (2 * Math.PI)) * 180) / Math.PI + 540) % 360 - 180;
    out.push({ lat, lon });
  }
  return out;
}

export function seaName(lat: number, lon: number): string {
  if (lat > 66) return "Arctic Ocean";
  if (lat < -55) return "Southern Ocean";
  if (lon > 20 && lon < 115 && lat < 25) return "Indian Ocean";
  if (lon < -30 && lon > -100) return lat > 0 ? "North Atlantic" : "South Atlantic";
  if (lon >= -100 && lon < -30) return lat > 0 ? "North Atlantic" : "South Atlantic";
  return lat > 0 ? "North Pacific" : "South Pacific";
}
