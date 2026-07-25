// Vision-analysis fixtures for the two real sample trucks.
//
// These are the results a vision model would return for the uploaded photos of
// two "HR" fleet vehicles (a Fuso rigid flatbed and an Isuzu FRR pantech). The
// bounding boxes are hand-placed to sit on the real trucks; the readings (tyre
// model/size, plate, colour, axle count) are taken from what's actually visible
// in the frames. It's a convincing stand-in for a live model — swap this module
// for a real inference call and the UI doesn't change.

export type DetectionKind =
  | "vehicle"
  | "tyre"
  | "plate"
  | "component"
  | "load"
  | "hazard";

// Bounding box as fractions (0..1) of the image, top-left origin.
export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Detection {
  id: string;
  kind: DetectionKind;
  label: string;
  confidence: number; // 0..1
  box: Box;
}

export interface AnalysisImage {
  src: string;
  caption: string;
  detections: Detection[];
}

export interface Attribute {
  label: string;
  value: string;
  confidence?: number;
  tone?: "ok" | "watch" | "flag";
  hint?: string;
}

export interface VehicleAnalysis {
  id: string;
  vehicleLabel: string; // "what truck is this"
  make: string;
  bodyType: string;
  colour: string;
  colourHex: string;
  images: AnalysisImage[];
  attributes: Attribute[];
  video?: { src: string; poster: string; caption: string };
  modelNote: string;
}

export const ANALYSIS: Record<string, VehicleAnalysis> = {
  // ---------------- Truck A — Fuso rigid flatbed ----------------
  truckA: {
    id: "truckA",
    vehicleLabel: "Heavy rigid: flatbed tray",
    make: "Mitsubishi Fuso (heavy rigid)",
    bodyType: "Flatbed tray, loaded",
    colour: "White",
    colourHex: "#e9e9e6",
    images: [
      {
        src: "/samples/truck-a.jpg",
        caption: "Side profile · full vehicle",
        detections: [
          { id: "a-veh", kind: "vehicle", label: "Rigid truck", confidence: 0.98, box: { x: 0.1, y: 0.38, w: 0.83, h: 0.3 } },
          { id: "a-cab", kind: "component", label: "Cab", confidence: 0.95, box: { x: 0.75, y: 0.38, w: 0.19, h: 0.22 } },
          { id: "a-load", kind: "load", label: "Load: crates & cages", confidence: 0.88, box: { x: 0.13, y: 0.4, w: 0.55, h: 0.15 } },
          { id: "a-rear", kind: "tyre", label: "Rear tandem axles", confidence: 0.93, box: { x: 0.3, y: 0.55, w: 0.17, h: 0.12 } },
          { id: "a-front", kind: "tyre", label: "Steer tyre", confidence: 0.92, box: { x: 0.78, y: 0.55, w: 0.09, h: 0.12 } },
        ],
      },
      {
        src: "/samples/truck-a-tyre.jpg",
        caption: "Steer tyre · tread inspection",
        detections: [
          { id: "t-tyre", kind: "tyre", label: "Tyre", confidence: 0.99, box: { x: 0.13, y: 0.28, w: 0.84, h: 0.66 } },
          { id: "t-tread", kind: "component", label: "Tread ~7.4mm · ~72%", confidence: 0.86, box: { x: 0.16, y: 0.33, w: 0.22, h: 0.57 } },
          { id: "t-size", kind: "plate", label: "11R22.5 · M711", confidence: 0.9, box: { x: 0.23, y: 0.54, w: 0.15, h: 0.11 } },
        ],
      },
    ],
    attributes: [
      { label: "Vehicle", value: "Rigid truck (flatbed)", confidence: 0.98 },
      { label: "Make", value: "Mitsubishi Fuso", confidence: 0.82, hint: "Read from the front grille badge in a related frame." },
      { label: "Colour", value: "White", confidence: 0.97 },
      { label: "Axles", value: "3 (6×4, tandem drive)", confidence: 0.9 },
      { label: "Tyre", value: "Bridgestone V-STEEL M711", confidence: 0.88, hint: "Model moulded on the sidewall." },
      { label: "Tyre size", value: "11R22.5 radial", confidence: 0.91 },
      { label: "Tread", value: "~7.4 mm · ~72% left", tone: "ok", confidence: 0.86, hint: "Well above the 1.6 mm minimum. Healthy." },
      { label: "Plate", value: "Not in frame, request front/rear shot", tone: "watch", hint: "Side profile doesn't show a plate. Tier 2 asks the operator for it." },
      { label: "Load restraint", value: "Straps visible, one corner unclear", tone: "watch", confidence: 0.64 },
    ],
    modelNote:
      "Model: vision-detect v0 (demo fixture). Boxes and readings taken from the operator's uploaded photos.",
  },

  // ---------------- Truck B — Isuzu FRR pantech ----------------
  truckB: {
    id: "truckB",
    vehicleLabel: "Medium rigid: pantech / curtain-side",
    make: "Isuzu FRR (F-series)",
    bodyType: "Pantech with curtain-side, loaded",
    colour: "White",
    colourHex: "#ededea",
    images: [
      {
        src: "/samples/truck-b.jpg",
        caption: "Front 3/4 · full vehicle",
        detections: [
          { id: "b-veh", kind: "vehicle", label: "Rigid truck", confidence: 0.98, box: { x: 0.29, y: 0.31, w: 0.6, h: 0.49 } },
          { id: "b-cab", kind: "component", label: "Cab & windscreen", confidence: 0.94, box: { x: 0.31, y: 0.4, w: 0.28, h: 0.2 } },
          { id: "b-grille", kind: "component", label: "ISUZU grille", confidence: 0.9, box: { x: 0.33, y: 0.51, w: 0.17, h: 0.08 } },
          { id: "b-plate", kind: "plate", label: "Plate · XB·25JG", confidence: 0.79, box: { x: 0.33, y: 0.585, w: 0.11, h: 0.045 } },
          { id: "b-tyre", kind: "tyre", label: "Steer tyre", confidence: 0.9, box: { x: 0.52, y: 0.61, w: 0.1, h: 0.13 } },
          { id: "b-load", kind: "load", label: "Load: barriers under tarp", confidence: 0.85, box: { x: 0.62, y: 0.31, w: 0.27, h: 0.3 } },
        ],
      },
    ],
    video: {
      src: "/samples/clip.mp4",
      poster: "/samples/clip-poster.jpg",
      caption: "Walk-around video · plate & front confirmed",
    },
    attributes: [
      { label: "Vehicle", value: "Rigid truck (pantech)", confidence: 0.98 },
      { label: "Make / model", value: "Isuzu FRR (F-series)", confidence: 0.9, hint: "ISUZU grille + 'FRR' cab badge." },
      { label: "Colour", value: "White", confidence: 0.98 },
      { label: "Plate", value: "XB·25JG (QLD)", tone: "ok", confidence: 0.79, hint: "Read from the front plate in the walk-around video." },
      { label: "Axles", value: "2 (4×2)", confidence: 0.92 },
      { label: "Body", value: "Curtain-side, barriers loaded", confidence: 0.85 },
      { label: "Steer tyre", value: "~55%, request closer shot", tone: "watch", confidence: 0.58, hint: "Only partially visible; a direct tread photo would confirm." },
      { label: "Genuineness", value: "Video matches photo, no reuse", tone: "ok", confidence: 0.94 },
    ],
    modelNote:
      "Model: vision-detect v0 (demo fixture). Plate read from the uploaded walk-around video; boxes from the front photo.",
  },
};

export function getAnalysis(id?: string): VehicleAnalysis | null {
  if (!id) return null;
  return ANALYSIS[id] ?? null;
}
