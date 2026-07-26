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

// A detection inside a video keyframe. `id` is stable across a video's whole
// keyframe list (e.g. every "cab" entry uses id "cab") so the player can
// smoothly glide a box from its position in one keyframe to its position in
// the next, rather than popping.
export interface VideoDetection {
  id: string;
  kind: DetectionKind;
  label: string;
  confidence: number;
  box: Box;
}

export interface VideoKeyframe {
  t: number; // seconds into playback this keyframe becomes active
  detections: VideoDetection[];
}

// Hand-verified detections at several timestamps through the walk-around
// footage (frames were extracted and reviewed directly). Playback interpolates
// smoothly between them. This is deliberately not a live model — the point is
// accurate, stable boxes for a demo, not a research project in on-device CV.
export interface VideoAnalysis {
  src: string;
  poster: string;
  caption: string;
  keyframes: VideoKeyframe[];
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
  video?: VideoAnalysis;
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
        caption: "Side profile / full vehicle",
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
        caption: "Steer tyre / tread inspection",
        detections: [
          { id: "t-tyre", kind: "tyre", label: "Tyre", confidence: 0.99, box: { x: 0.13, y: 0.28, w: 0.84, h: 0.66 } },
          { id: "t-tread", kind: "component", label: "Tread ~7.4mm / ~72%", confidence: 0.86, box: { x: 0.16, y: 0.33, w: 0.22, h: 0.57 } },
          { id: "t-size", kind: "plate", label: "11R22.5 / M711", confidence: 0.9, box: { x: 0.23, y: 0.54, w: 0.15, h: 0.11 } },
        ],
      },
    ],
    video: {
      src: "/samples/IMG_2318.mp4",
      poster: "/samples/truck-a-video-poster.jpg",
      caption: "Walk-around video / full vehicle, load & tandem tyres",
      // Frames were extracted from the actual clip every ~1s and reviewed
      // directly; playback interpolates continuously between these poses. A
      // part keeps the same id only while continuously visible — see the
      // header comment in video-detect.tsx for why.
      keyframes: [
        {
          t: 0,
          detections: [
            { id: "vehicle", kind: "vehicle", label: "Rigid truck", confidence: 0.96, box: { x: 0.14, y: 0.28, w: 0.56, h: 0.58 } },
            { id: "cab", kind: "component", label: "Cab", confidence: 0.94, box: { x: 0.46, y: 0.28, w: 0.22, h: 0.4 } },
            { id: "tyre-1", kind: "tyre", label: "Steer tyre", confidence: 0.92, box: { x: 0.5, y: 0.68, w: 0.1, h: 0.16 } },
            { id: "tyre-2", kind: "tyre", label: "Rear tandem", confidence: 0.91, box: { x: 0.24, y: 0.68, w: 0.14, h: 0.14 } },
            { id: "load", kind: "load", label: "Load: crates & cages", confidence: 0.88, box: { x: 0.16, y: 0.36, w: 0.3, h: 0.3 } },
          ],
        },
        {
          t: 1,
          detections: [
            { id: "vehicle", kind: "vehicle", label: "Rigid truck", confidence: 0.96, box: { x: 0.13, y: 0.27, w: 0.58, h: 0.59 } },
            { id: "cab", kind: "component", label: "Cab", confidence: 0.94, box: { x: 0.47, y: 0.27, w: 0.22, h: 0.41 } },
            { id: "tyre-1", kind: "tyre", label: "Steer tyre", confidence: 0.92, box: { x: 0.51, y: 0.67, w: 0.1, h: 0.16 } },
            { id: "tyre-2", kind: "tyre", label: "Rear tandem", confidence: 0.91, box: { x: 0.24, y: 0.67, w: 0.14, h: 0.15 } },
            { id: "load", kind: "load", label: "Load: crates & cages", confidence: 0.88, box: { x: 0.16, y: 0.35, w: 0.31, h: 0.3 } },
          ],
        },
        {
          t: 2,
          detections: [
            { id: "vehicle", kind: "vehicle", label: "Rigid truck", confidence: 0.96, box: { x: 0.13, y: 0.26, w: 0.6, h: 0.6 } },
            { id: "cab", kind: "component", label: "Cab", confidence: 0.94, box: { x: 0.47, y: 0.26, w: 0.23, h: 0.42 } },
            { id: "tyre-1", kind: "tyre", label: "Steer tyre", confidence: 0.92, box: { x: 0.52, y: 0.66, w: 0.1, h: 0.17 } },
            { id: "tyre-2", kind: "tyre", label: "Rear tandem", confidence: 0.91, box: { x: 0.23, y: 0.66, w: 0.15, h: 0.15 } },
            { id: "load", kind: "load", label: "Load: crates & cages", confidence: 0.88, box: { x: 0.15, y: 0.34, w: 0.32, h: 0.31 } },
          ],
        },
        {
          t: 3,
          detections: [
            { id: "vehicle", kind: "vehicle", label: "Rigid truck", confidence: 0.96, box: { x: 0.12, y: 0.25, w: 0.62, h: 0.62 } },
            { id: "cab", kind: "component", label: "Cab", confidence: 0.94, box: { x: 0.48, y: 0.25, w: 0.24, h: 0.43 } },
            { id: "tyre-1", kind: "tyre", label: "Steer tyre", confidence: 0.92, box: { x: 0.53, y: 0.65, w: 0.11, h: 0.18 } },
            { id: "tyre-2", kind: "tyre", label: "Rear tandem", confidence: 0.91, box: { x: 0.22, y: 0.65, w: 0.15, h: 0.16 } },
            { id: "load", kind: "load", label: "Load: crates & cages", confidence: 0.88, box: { x: 0.14, y: 0.32, w: 0.34, h: 0.32 } },
          ],
        },
        {
          t: 4,
          detections: [
            { id: "vehicle", kind: "vehicle", label: "Rigid truck", confidence: 0.96, box: { x: 0.11, y: 0.22, w: 0.66, h: 0.65 } },
            { id: "cab", kind: "component", label: "Cab", confidence: 0.94, box: { x: 0.5, y: 0.22, w: 0.26, h: 0.45 } },
            { id: "tyre-1", kind: "tyre", label: "Steer tyre", confidence: 0.92, box: { x: 0.55, y: 0.63, w: 0.12, h: 0.19 } },
            { id: "tyre-2", kind: "tyre", label: "Rear tandem", confidence: 0.91, box: { x: 0.2, y: 0.63, w: 0.16, h: 0.17 } },
            { id: "load", kind: "load", label: "Load: crates & cages", confidence: 0.88, box: { x: 0.13, y: 0.3, w: 0.35, h: 0.33 } },
          ],
        },
        {
          t: 5,
          detections: [
            { id: "vehicle", kind: "vehicle", label: "Rigid truck", confidence: 0.96, box: { x: 0.1, y: 0.2, w: 0.68, h: 0.66 } },
            { id: "cab", kind: "component", label: "Cab", confidence: 0.94, box: { x: 0.51, y: 0.2, w: 0.27, h: 0.46 } },
            { id: "tyre-1", kind: "tyre", label: "Steer tyre", confidence: 0.92, box: { x: 0.56, y: 0.61, w: 0.13, h: 0.2 } },
            { id: "tyre-2", kind: "tyre", label: "Rear tandem", confidence: 0.91, box: { x: 0.19, y: 0.61, w: 0.17, h: 0.18 } },
            { id: "load", kind: "load", label: "Load: crates & cages", confidence: 0.88, box: { x: 0.12, y: 0.28, w: 0.36, h: 0.34 } },
          ],
        },
        {
          t: 6,
          detections: [
            { id: "vehicle", kind: "vehicle", label: "Rigid truck", confidence: 0.96, box: { x: 0.08, y: 0.16, w: 0.75, h: 0.7 } },
            { id: "cab", kind: "component", label: "Cab", confidence: 0.94, box: { x: 0.53, y: 0.16, w: 0.29, h: 0.5 } },
            { id: "tyre-1", kind: "tyre", label: "Steer tyre", confidence: 0.92, box: { x: 0.58, y: 0.6, w: 0.13, h: 0.21 } },
            { id: "tyre-2", kind: "tyre", label: "Rear tandem", confidence: 0.91, box: { x: 0.17, y: 0.6, w: 0.17, h: 0.19 } },
            { id: "load", kind: "load", label: "Load: crates & cages", confidence: 0.88, box: { x: 0.1, y: 0.24, w: 0.4, h: 0.38 } },
          ],
        },
        {
          t: 7,
          detections: [
            { id: "vehicle", kind: "vehicle", label: "Rigid truck", confidence: 0.96, box: { x: 0.06, y: 0.12, w: 0.85, h: 0.75 } },
            { id: "cab", kind: "component", label: "Cab", confidence: 0.94, box: { x: 0.56, y: 0.12, w: 0.32, h: 0.53 } },
            { id: "tyre-1", kind: "tyre", label: "Steer tyre", confidence: 0.92, box: { x: 0.6, y: 0.6, w: 0.13, h: 0.2 } },
            { id: "tyre-2", kind: "tyre", label: "Rear tandem", confidence: 0.91, box: { x: 0.16, y: 0.6, w: 0.17, h: 0.19 } },
            { id: "load", kind: "load", label: "Load: crates & cages", confidence: 0.88, box: { x: 0.07, y: 0.2, w: 0.46, h: 0.42 } },
          ],
        },
        {
          t: 8,
          detections: [
            { id: "vehicle", kind: "vehicle", label: "Rigid truck", confidence: 0.96, box: { x: 0, y: 0.05, w: 1, h: 0.85 } },
            { id: "cab", kind: "component", label: "Cab", confidence: 0.94, box: { x: 0.6, y: 0, w: 0.4, h: 0.75 } },
            { id: "tyre-2", kind: "tyre", label: "Rear tandem", confidence: 0.91, box: { x: 0.02, y: 0.55, w: 0.2, h: 0.33 } },
            { id: "load", kind: "load", label: "Load: crates & cages", confidence: 0.88, box: { x: 0.04, y: 0.15, w: 0.55, h: 0.5 } },
          ],
        },
        {
          t: 9,
          detections: [
            { id: "vehicle", kind: "vehicle", label: "Rigid truck", confidence: 0.96, box: { x: 0, y: 0.05, w: 1, h: 0.85 } },
            { id: "cab", kind: "component", label: "Cab", confidence: 0.94, box: { x: 0.68, y: 0, w: 0.32, h: 0.55 } },
            { id: "tyre-2", kind: "tyre", label: "Rear tandem", confidence: 0.91, box: { x: 0.03, y: 0.55, w: 0.2, h: 0.33 } },
            { id: "load", kind: "load", label: "Load: crates & cages", confidence: 0.88, box: { x: 0.05, y: 0.15, w: 0.55, h: 0.5 } },
          ],
        },
        {
          t: 10,
          detections: [
            { id: "vehicle", kind: "vehicle", label: "Rigid truck", confidence: 0.96, box: { x: 0, y: 0.05, w: 1, h: 0.85 } },
            { id: "tyre-2", kind: "tyre", label: "Rear tandem", confidence: 0.91, box: { x: 0.04, y: 0.55, w: 0.2, h: 0.32 } },
            { id: "load", kind: "load", label: "Load: crates & cages", confidence: 0.88, box: { x: 0.05, y: 0.12, w: 0.85, h: 0.55 } },
          ],
        },
        {
          t: 11,
          detections: [
            { id: "vehicle", kind: "vehicle", label: "Rigid truck", confidence: 0.96, box: { x: 0, y: 0.05, w: 1, h: 0.85 } },
            { id: "tyre-2", kind: "tyre", label: "Rear tandem", confidence: 0.91, box: { x: 0.03, y: 0.55, w: 0.22, h: 0.33 } },
            { id: "load", kind: "load", label: "Load: crates & cages", confidence: 0.88, box: { x: 0.05, y: 0.12, w: 0.85, h: 0.55 } },
          ],
        },
        {
          t: 12,
          detections: [
            { id: "vehicle", kind: "vehicle", label: "Rigid truck", confidence: 0.96, box: { x: 0, y: 0.05, w: 1, h: 0.85 } },
            { id: "tyre-2", kind: "tyre", label: "Rear tandem", confidence: 0.91, box: { x: 0.04, y: 0.57, w: 0.24, h: 0.34 } },
            { id: "load", kind: "load", label: "Load: crates & cages", confidence: 0.88, box: { x: 0.06, y: 0.1, w: 0.85, h: 0.55 } },
          ],
        },
        {
          t: 13,
          detections: [
            { id: "vehicle", kind: "vehicle", label: "Rigid truck", confidence: 0.96, box: { x: 0, y: 0.05, w: 1, h: 0.85 } },
            { id: "tyre-2", kind: "tyre", label: "Rear tandem", confidence: 0.91, box: { x: 0.03, y: 0.58, w: 0.24, h: 0.34 } },
            { id: "load", kind: "load", label: "Load: crates & cages", confidence: 0.88, box: { x: 0.05, y: 0.08, w: 0.85, h: 0.55 } },
          ],
        },
        {
          t: 14,
          detections: [
            { id: "vehicle", kind: "vehicle", label: "Rigid truck", confidence: 0.96, box: { x: 0, y: 0.05, w: 1, h: 0.85 } },
            { id: "tyre-2", kind: "tyre", label: "Rear tandem", confidence: 0.91, box: { x: 0.04, y: 0.58, w: 0.25, h: 0.35 } },
            { id: "load", kind: "load", label: "Load: crates & cages", confidence: 0.88, box: { x: 0.06, y: 0.08, w: 0.85, h: 0.55 } },
          ],
        },
        {
          t: 15,
          detections: [
            { id: "vehicle", kind: "vehicle", label: "Rigid truck", confidence: 0.96, box: { x: 0, y: 0.05, w: 1, h: 0.85 } },
            { id: "tyre-2", kind: "tyre", label: "Rear tandem", confidence: 0.91, box: { x: 0.06, y: 0.58, w: 0.26, h: 0.35 } },
            { id: "load", kind: "load", label: "Load: crates & cages", confidence: 0.88, box: { x: 0.06, y: 0.08, w: 0.8, h: 0.55 } },
          ],
        },
        {
          t: 16,
          detections: [
            { id: "vehicle", kind: "vehicle", label: "Rigid truck", confidence: 0.96, box: { x: 0, y: 0, w: 1, h: 1 } },
            { id: "tyre-2", kind: "tyre", label: "Rear tandem", confidence: 0.91, box: { x: 0.1, y: 0.55, w: 0.28, h: 0.38 } },
            { id: "load", kind: "load", label: "Load: crates & cages", confidence: 0.88, box: { x: 0, y: 0.08, w: 0.75, h: 0.55 } },
          ],
        },
        {
          t: 17,
          detections: [
            { id: "vehicle", kind: "vehicle", label: "Rigid truck", confidence: 0.96, box: { x: 0, y: 0, w: 1, h: 1 } },
            { id: "tyre-2", kind: "tyre", label: "Rear tandem", confidence: 0.91, box: { x: 0.2, y: 0.55, w: 0.3, h: 0.4 } },
            { id: "load", kind: "load", label: "Load: crates & cages", confidence: 0.88, box: { x: 0, y: 0.08, w: 0.65, h: 0.55 } },
          ],
        },
        {
          t: 18,
          detections: [
            { id: "vehicle", kind: "vehicle", label: "Rigid truck", confidence: 0.96, box: { x: 0, y: 0, w: 1, h: 1 } },
            { id: "tyre-2", kind: "tyre", label: "Rear tandem", confidence: 0.91, box: { x: 0.32, y: 0.55, w: 0.32, h: 0.4 } },
            { id: "load", kind: "load", label: "Load: crates & cages", confidence: 0.88, box: { x: 0, y: 0.08, w: 0.55, h: 0.52 } },
          ],
        },
        {
          t: 19,
          detections: [
            { id: "vehicle", kind: "vehicle", label: "Rigid truck", confidence: 0.96, box: { x: 0, y: 0, w: 1, h: 1 } },
            { id: "tyre-2", kind: "tyre", label: "Rear tandem", confidence: 0.91, box: { x: 0.42, y: 0.55, w: 0.32, h: 0.38 } },
            { id: "load", kind: "load", label: "Load: crates & cages", confidence: 0.88, box: { x: 0, y: 0.08, w: 0.5, h: 0.52 } },
          ],
        },
        {
          t: 20,
          detections: [
            { id: "vehicle", kind: "vehicle", label: "Rigid truck", confidence: 0.96, box: { x: 0, y: 0.08, w: 0.95, h: 0.8 } },
            { id: "tyre-2", kind: "tyre", label: "Rear tandem", confidence: 0.91, box: { x: 0.55, y: 0.58, w: 0.3, h: 0.36 } },
            { id: "load", kind: "load", label: "Load: crates & cages", confidence: 0.88, box: { x: 0.02, y: 0.12, w: 0.48, h: 0.52 } },
          ],
        },
        {
          t: 21,
          detections: [
            { id: "vehicle", kind: "vehicle", label: "Rigid truck", confidence: 0.96, box: { x: 0.05, y: 0.08, w: 0.9, h: 0.8 } },
            { id: "tyre-2", kind: "tyre", label: "Rear tandem", confidence: 0.91, box: { x: 0.58, y: 0.55, w: 0.3, h: 0.36 } },
            { id: "load", kind: "load", label: "Load: crates & cages", confidence: 0.88, box: { x: 0.05, y: 0.1, w: 0.4, h: 0.42 } },
          ],
        },
        {
          t: 22,
          detections: [
            { id: "vehicle", kind: "vehicle", label: "Rigid truck", confidence: 0.96, box: { x: 0.08, y: 0.08, w: 0.82, h: 0.8 } },
            { id: "tyre-2", kind: "tyre", label: "Rear tandem", confidence: 0.91, box: { x: 0.52, y: 0.55, w: 0.3, h: 0.36 } },
            { id: "load", kind: "load", label: "Load: crates & cages", confidence: 0.88, box: { x: 0.08, y: 0.1, w: 0.38, h: 0.42 } },
          ],
        },
        {
          t: 23,
          detections: [
            { id: "vehicle", kind: "vehicle", label: "Rigid truck", confidence: 0.96, box: { x: 0.1, y: 0.08, w: 0.78, h: 0.78 } },
            { id: "tyre-2", kind: "tyre", label: "Rear tandem", confidence: 0.91, box: { x: 0.48, y: 0.55, w: 0.3, h: 0.36 } },
            { id: "load", kind: "load", label: "Load: crates & cages", confidence: 0.88, box: { x: 0.1, y: 0.1, w: 0.36, h: 0.42 } },
          ],
        },
        {
          t: 24,
          detections: [
            { id: "vehicle", kind: "vehicle", label: "Rigid truck", confidence: 0.96, box: { x: 0.12, y: 0.08, w: 0.75, h: 0.78 } },
            { id: "tyre-2", kind: "tyre", label: "Rear tandem", confidence: 0.91, box: { x: 0.46, y: 0.55, w: 0.3, h: 0.35 } },
            { id: "load", kind: "load", label: "Load: crates & cages", confidence: 0.88, box: { x: 0.12, y: 0.1, w: 0.36, h: 0.42 } },
          ],
        },
        {
          t: 25,
          detections: [
            { id: "vehicle", kind: "vehicle", label: "Rigid truck", confidence: 0.96, box: { x: 0.14, y: 0.08, w: 0.72, h: 0.78 } },
            { id: "tyre-2", kind: "tyre", label: "Rear tandem", confidence: 0.91, box: { x: 0.45, y: 0.55, w: 0.3, h: 0.35 } },
            { id: "load", kind: "load", label: "Load: crates & cages", confidence: 0.88, box: { x: 0.14, y: 0.1, w: 0.38, h: 0.42 } },
          ],
        },
      ],
    },
    attributes: [
      { label: "Vehicle", value: "Rigid truck (flatbed)", confidence: 0.98 },
      { label: "Make", value: "Mitsubishi Fuso", confidence: 0.82, hint: "Read from the front grille badge in a related frame." },
      { label: "Colour", value: "White", confidence: 0.97 },
      { label: "Axles", value: "3 (6×4, tandem drive)", confidence: 0.9 },
      { label: "Tyre", value: "Bridgestone V-STEEL M711", confidence: 0.88, hint: "Model moulded on the sidewall." },
      { label: "Tyre size", value: "11R22.5 radial", confidence: 0.91 },
      { label: "Tread", value: "~7.4 mm / ~72% left", tone: "ok", confidence: 0.86, hint: "Well above the 1.6 mm minimum. Healthy." },
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
        caption: "Front 3/4 / full vehicle",
        detections: [
          { id: "b-veh", kind: "vehicle", label: "Rigid truck", confidence: 0.98, box: { x: 0.29, y: 0.31, w: 0.6, h: 0.49 } },
          { id: "b-cab", kind: "component", label: "Cab & windscreen", confidence: 0.94, box: { x: 0.31, y: 0.4, w: 0.28, h: 0.2 } },
          { id: "b-grille", kind: "component", label: "ISUZU grille", confidence: 0.9, box: { x: 0.33, y: 0.51, w: 0.17, h: 0.08 } },
          { id: "b-plate", kind: "plate", label: "Plate / XB 25JG", confidence: 0.79, box: { x: 0.33, y: 0.585, w: 0.11, h: 0.045 } },
          { id: "b-tyre", kind: "tyre", label: "Steer tyre", confidence: 0.9, box: { x: 0.52, y: 0.61, w: 0.1, h: 0.13 } },
          { id: "b-load", kind: "load", label: "Load: barriers under tarp", confidence: 0.85, box: { x: 0.62, y: 0.31, w: 0.27, h: 0.3 } },
        ],
      },
    ],
    video: {
      src: "/samples/IMG_2332.mp4",
      poster: "/samples/truck-b-video-poster.jpg",
      caption: "Walk-around video / pantech, cab, load & plate",
      // Frames were extracted from the actual clip every ~1s and reviewed
      // directly; playback interpolates continuously between these poses. The
      // steer tyre and curtain-side load each get two ids (-a / -b) because
      // the camera passes the front of the truck partway through: the near
      // side goes out of view and a different physical wheel/box becomes the
      // new near side. Reusing one id across that gap would slide the box
      // across the truck body instead of fading out and back in.
      keyframes: [
        {
          t: 0,
          detections: [
            { id: "vehicle", kind: "vehicle", label: "Rigid truck", confidence: 0.97, box: { x: 0.32, y: 0.02, w: 0.6, h: 0.85 } },
            { id: "plate", kind: "plate", label: "Plate", confidence: 0.62, box: { x: 0.5, y: 0.75, w: 0.14, h: 0.07 } },
          ],
        },
        {
          t: 1,
          detections: [
            { id: "vehicle", kind: "vehicle", label: "Rigid truck", confidence: 0.97, box: { x: 0.34, y: 0.03, w: 0.58, h: 0.83 } },
            { id: "plate", kind: "plate", label: "Plate", confidence: 0.62, box: { x: 0.5, y: 0.75, w: 0.14, h: 0.07 } },
          ],
        },
        {
          t: 2,
          detections: [
            { id: "vehicle", kind: "vehicle", label: "Rigid truck", confidence: 0.97, box: { x: 0.36, y: 0.05, w: 0.55, h: 0.8 } },
            { id: "plate", kind: "plate", label: "Plate", confidence: 0.62, box: { x: 0.51, y: 0.76, w: 0.14, h: 0.07 } },
          ],
        },
        {
          t: 3,
          detections: [
            { id: "vehicle", kind: "vehicle", label: "Rigid truck", confidence: 0.97, box: { x: 0.37, y: 0.06, w: 0.52, h: 0.78 } },
            { id: "plate", kind: "plate", label: "Plate", confidence: 0.62, box: { x: 0.51, y: 0.76, w: 0.13, h: 0.07 } },
          ],
        },
        {
          t: 4,
          detections: [
            { id: "vehicle", kind: "vehicle", label: "Rigid truck", confidence: 0.97, box: { x: 0.38, y: 0.08, w: 0.5, h: 0.75 } },
            { id: "plate", kind: "plate", label: "Plate", confidence: 0.62, box: { x: 0.52, y: 0.76, w: 0.13, h: 0.06 } },
          ],
        },
        {
          t: 5,
          detections: [
            { id: "vehicle", kind: "vehicle", label: "Rigid truck", confidence: 0.97, box: { x: 0.39, y: 0.09, w: 0.48, h: 0.73 } },
            { id: "plate", kind: "plate", label: "Plate", confidence: 0.62, box: { x: 0.52, y: 0.76, w: 0.13, h: 0.06 } },
          ],
        },
        {
          t: 6,
          detections: [
            { id: "vehicle", kind: "vehicle", label: "Rigid truck", confidence: 0.97, box: { x: 0.35, y: 0.08, w: 0.52, h: 0.75 } },
            { id: "plate", kind: "plate", label: "Plate", confidence: 0.62, box: { x: 0.5, y: 0.75, w: 0.13, h: 0.06 } },
          ],
        },
        {
          t: 7,
          detections: [
            { id: "vehicle", kind: "vehicle", label: "Rigid truck", confidence: 0.97, box: { x: 0.3, y: 0.08, w: 0.58, h: 0.75 } },
            { id: "plate", kind: "plate", label: "Plate", confidence: 0.62, box: { x: 0.47, y: 0.73, w: 0.13, h: 0.06 } },
          ],
        },
        {
          t: 8,
          detections: [
            { id: "vehicle", kind: "vehicle", label: "Rigid truck", confidence: 0.97, box: { x: 0.2, y: 0.08, w: 0.68, h: 0.75 } },
            { id: "load-a", kind: "load", label: "Load: barriers under tarp", confidence: 0.85, box: { x: 0.42, y: 0.2, w: 0.42, h: 0.4 } },
          ],
        },
        {
          t: 9,
          detections: [
            { id: "vehicle", kind: "vehicle", label: "Rigid truck", confidence: 0.97, box: { x: 0.18, y: 0.08, w: 0.7, h: 0.75 } },
            { id: "load-a", kind: "load", label: "Load: barriers under tarp", confidence: 0.85, box: { x: 0.4, y: 0.2, w: 0.44, h: 0.4 } },
            { id: "tyre-rear", kind: "tyre", label: "Rear tyre", confidence: 0.85, box: { x: 0.65, y: 0.68, w: 0.14, h: 0.18 } },
          ],
        },
        {
          t: 10,
          detections: [
            { id: "vehicle", kind: "vehicle", label: "Rigid truck", confidence: 0.97, box: { x: 0.15, y: 0.08, w: 0.75, h: 0.75 } },
            { id: "load-a", kind: "load", label: "Load: barriers under tarp", confidence: 0.85, box: { x: 0.4, y: 0.2, w: 0.45, h: 0.4 } },
            { id: "tyre-rear", kind: "tyre", label: "Rear tyre", confidence: 0.85, box: { x: 0.68, y: 0.68, w: 0.14, h: 0.18 } },
          ],
        },
        {
          t: 11,
          detections: [
            { id: "vehicle", kind: "vehicle", label: "Rigid truck", confidence: 0.97, box: { x: 0.12, y: 0.08, w: 0.8, h: 0.75 } },
            { id: "load-a", kind: "load", label: "Load: barriers under tarp", confidence: 0.85, box: { x: 0.42, y: 0.22, w: 0.44, h: 0.4 } },
            { id: "tyre-rear", kind: "tyre", label: "Rear tyre", confidence: 0.85, box: { x: 0.7, y: 0.66, w: 0.14, h: 0.2 } },
          ],
        },
        {
          t: 12,
          detections: [
            { id: "vehicle", kind: "vehicle", label: "Rigid truck", confidence: 0.97, box: { x: 0.1, y: 0.08, w: 0.85, h: 0.78 } },
            { id: "cab", kind: "component", label: "Cab", confidence: 0.94, box: { x: 0.1, y: 0.3, w: 0.15, h: 0.3 } },
            { id: "load-a", kind: "load", label: "Load: barriers under tarp", confidence: 0.85, box: { x: 0.42, y: 0.22, w: 0.45, h: 0.42 } },
            { id: "tyre-a", kind: "tyre", label: "Steer tyre", confidence: 0.87, box: { x: 0.12, y: 0.65, w: 0.09, h: 0.18 } },
            { id: "tyre-rear", kind: "tyre", label: "Rear tyre", confidence: 0.85, box: { x: 0.75, y: 0.65, w: 0.13, h: 0.2 } },
          ],
        },
        {
          t: 13,
          detections: [
            { id: "vehicle", kind: "vehicle", label: "Rigid truck", confidence: 0.97, box: { x: 0.12, y: 0.08, w: 0.82, h: 0.76 } },
            { id: "cab", kind: "component", label: "Cab", confidence: 0.94, box: { x: 0.12, y: 0.28, w: 0.17, h: 0.32 } },
            { id: "load-a", kind: "load", label: "Load: barriers under tarp", confidence: 0.85, box: { x: 0.44, y: 0.24, w: 0.44, h: 0.4 } },
            { id: "tyre-a", kind: "tyre", label: "Steer tyre", confidence: 0.87, box: { x: 0.14, y: 0.65, w: 0.1, h: 0.19 } },
            { id: "tyre-rear", kind: "tyre", label: "Rear tyre", confidence: 0.85, box: { x: 0.76, y: 0.65, w: 0.13, h: 0.2 } },
          ],
        },
        {
          t: 14,
          detections: [
            { id: "vehicle", kind: "vehicle", label: "Rigid truck", confidence: 0.97, box: { x: 0.13, y: 0.08, w: 0.82, h: 0.76 } },
            { id: "cab", kind: "component", label: "Cab", confidence: 0.94, box: { x: 0.13, y: 0.27, w: 0.18, h: 0.33 } },
            { id: "load-a", kind: "load", label: "Load: barriers under tarp", confidence: 0.85, box: { x: 0.45, y: 0.25, w: 0.44, h: 0.4 } },
            { id: "tyre-a", kind: "tyre", label: "Steer tyre", confidence: 0.87, box: { x: 0.15, y: 0.65, w: 0.1, h: 0.2 } },
            { id: "tyre-rear", kind: "tyre", label: "Rear tyre", confidence: 0.85, box: { x: 0.76, y: 0.65, w: 0.13, h: 0.2 } },
          ],
        },
        {
          t: 15,
          detections: [
            { id: "vehicle", kind: "vehicle", label: "Rigid truck", confidence: 0.97, box: { x: 0.13, y: 0.08, w: 0.83, h: 0.77 } },
            { id: "cab", kind: "component", label: "Cab", confidence: 0.94, box: { x: 0.14, y: 0.27, w: 0.19, h: 0.34 } },
            { id: "load-a", kind: "load", label: "Load: barriers under tarp", confidence: 0.85, box: { x: 0.46, y: 0.26, w: 0.44, h: 0.4 } },
            { id: "tyre-a", kind: "tyre", label: "Steer tyre", confidence: 0.87, box: { x: 0.16, y: 0.65, w: 0.1, h: 0.21 } },
            { id: "tyre-rear", kind: "tyre", label: "Rear tyre", confidence: 0.85, box: { x: 0.76, y: 0.65, w: 0.13, h: 0.2 } },
          ],
        },
        {
          t: 16,
          detections: [
            { id: "vehicle", kind: "vehicle", label: "Rigid truck", confidence: 0.97, box: { x: 0.12, y: 0.08, w: 0.85, h: 0.78 } },
            { id: "cab", kind: "component", label: "Cab", confidence: 0.94, box: { x: 0.13, y: 0.2, w: 0.24, h: 0.45 } },
            { id: "load-a", kind: "load", label: "Load: barriers under tarp", confidence: 0.85, box: { x: 0.46, y: 0.22, w: 0.46, h: 0.44 } },
            { id: "tyre-a", kind: "tyre", label: "Steer tyre", confidence: 0.87, box: { x: 0.17, y: 0.66, w: 0.11, h: 0.22 } },
            { id: "tyre-rear", kind: "tyre", label: "Rear tyre", confidence: 0.85, box: { x: 0.77, y: 0.65, w: 0.13, h: 0.2 } },
          ],
        },
        {
          t: 17,
          detections: [
            { id: "vehicle", kind: "vehicle", label: "Rigid truck", confidence: 0.97, box: { x: 0.1, y: 0.06, w: 0.85, h: 0.8 } },
            { id: "cab", kind: "component", label: "Cab", confidence: 0.94, box: { x: 0.12, y: 0.16, w: 0.28, h: 0.5 } },
            { id: "load-a", kind: "load", label: "Load: barriers under tarp", confidence: 0.85, box: { x: 0.48, y: 0.2, w: 0.44, h: 0.46 } },
            { id: "tyre-a", kind: "tyre", label: "Steer tyre", confidence: 0.87, box: { x: 0.18, y: 0.68, w: 0.12, h: 0.23 } },
          ],
        },
        {
          t: 18,
          detections: [
            { id: "vehicle", kind: "vehicle", label: "Rigid truck", confidence: 0.97, box: { x: 0.1, y: 0.05, w: 0.85, h: 0.85 } },
            { id: "cab", kind: "component", label: "Cab", confidence: 0.94, box: { x: 0.12, y: 0.1, w: 0.34, h: 0.55 } },
            { id: "load-a", kind: "load", label: "Load: barriers under tarp", confidence: 0.85, box: { x: 0.55, y: 0.18, w: 0.4, h: 0.46 } },
            { id: "tyre-a", kind: "tyre", label: "Steer tyre", confidence: 0.87, box: { x: 0.22, y: 0.7, w: 0.14, h: 0.24 } },
          ],
        },
        {
          t: 19,
          detections: [
            { id: "vehicle", kind: "vehicle", label: "Rigid truck", confidence: 0.97, box: { x: 0.12, y: 0.04, w: 0.82, h: 0.88 } },
            { id: "cab", kind: "component", label: "Cab", confidence: 0.94, box: { x: 0.14, y: 0.08, w: 0.38, h: 0.58 } },
            { id: "load-a", kind: "load", label: "Load: barriers under tarp", confidence: 0.85, box: { x: 0.62, y: 0.16, w: 0.32, h: 0.44 } },
            { id: "tyre-a", kind: "tyre", label: "Steer tyre", confidence: 0.87, box: { x: 0.26, y: 0.7, w: 0.15, h: 0.24 } },
          ],
        },
        {
          t: 20,
          detections: [
            { id: "vehicle", kind: "vehicle", label: "Rigid truck", confidence: 0.97, box: { x: 0.15, y: 0.04, w: 0.78, h: 0.88 } },
            { id: "cab", kind: "component", label: "Cab", confidence: 0.94, box: { x: 0.16, y: 0.06, w: 0.42, h: 0.58 } },
            { id: "load-a", kind: "load", label: "Load: barriers under tarp", confidence: 0.85, box: { x: 0.7, y: 0.15, w: 0.25, h: 0.42 } },
            { id: "tyre-a", kind: "tyre", label: "Steer tyre", confidence: 0.87, box: { x: 0.3, y: 0.7, w: 0.16, h: 0.24 } },
          ],
        },
        {
          t: 21,
          detections: [
            { id: "vehicle", kind: "vehicle", label: "Rigid truck", confidence: 0.97, box: { x: 0.18, y: 0.04, w: 0.75, h: 0.88 } },
            { id: "cab", kind: "component", label: "Cab", confidence: 0.94, box: { x: 0.2, y: 0.05, w: 0.45, h: 0.6 } },
            { id: "tyre-a", kind: "tyre", label: "Steer tyre", confidence: 0.87, box: { x: 0.34, y: 0.7, w: 0.16, h: 0.24 } },
          ],
        },
        {
          t: 22,
          detections: [
            { id: "vehicle", kind: "vehicle", label: "Rigid truck", confidence: 0.97, box: { x: 0.2, y: 0.03, w: 0.72, h: 0.9 } },
            { id: "cab", kind: "component", label: "Cab", confidence: 0.94, box: { x: 0.22, y: 0.04, w: 0.48, h: 0.62 } },
            { id: "tyre-a", kind: "tyre", label: "Steer tyre", confidence: 0.87, box: { x: 0.36, y: 0.7, w: 0.17, h: 0.25 } },
          ],
        },
        {
          t: 23,
          detections: [
            { id: "vehicle", kind: "vehicle", label: "Rigid truck", confidence: 0.97, box: { x: 0.22, y: 0.02, w: 0.68, h: 0.92 } },
            { id: "cab", kind: "component", label: "Cab", confidence: 0.94, box: { x: 0.24, y: 0.03, w: 0.5, h: 0.65 } },
          ],
        },
        {
          t: 24,
          detections: [
            { id: "vehicle", kind: "vehicle", label: "Rigid truck", confidence: 0.97, box: { x: 0.26, y: 0.1, w: 0.5, h: 0.8 } },
            { id: "cab", kind: "component", label: "Cab", confidence: 0.94, box: { x: 0.28, y: 0.14, w: 0.44, h: 0.55 } },
            { id: "grille", kind: "component", label: "ISUZU grille", confidence: 0.9, box: { x: 0.36, y: 0.53, w: 0.28, h: 0.14 } },
            { id: "plate", kind: "plate", label: "Plate", confidence: 0.62, box: { x: 0.4, y: 0.72, w: 0.14, h: 0.07 } },
          ],
        },
        {
          t: 25,
          detections: [
            { id: "vehicle", kind: "vehicle", label: "Rigid truck", confidence: 0.97, box: { x: 0.25, y: 0.08, w: 0.52, h: 0.82 } },
            { id: "cab", kind: "component", label: "Cab", confidence: 0.94, box: { x: 0.27, y: 0.12, w: 0.46, h: 0.57 } },
            { id: "grille", kind: "component", label: "ISUZU grille", confidence: 0.9, box: { x: 0.36, y: 0.55, w: 0.28, h: 0.14 } },
            { id: "plate", kind: "plate", label: "Plate / XB 25JG", confidence: 0.93, box: { x: 0.4, y: 0.78, w: 0.16, h: 0.08 } },
          ],
        },
        {
          t: 26,
          detections: [
            { id: "vehicle", kind: "vehicle", label: "Rigid truck", confidence: 0.97, box: { x: 0.26, y: 0.08, w: 0.5, h: 0.82 } },
            { id: "cab", kind: "component", label: "Cab", confidence: 0.94, box: { x: 0.28, y: 0.12, w: 0.45, h: 0.56 } },
            { id: "grille", kind: "component", label: "ISUZU grille", confidence: 0.9, box: { x: 0.36, y: 0.54, w: 0.28, h: 0.14 } },
            { id: "plate", kind: "plate", label: "Plate / XB 25JG", confidence: 0.93, box: { x: 0.4, y: 0.78, w: 0.16, h: 0.08 } },
          ],
        },
        {
          t: 27,
          detections: [
            { id: "vehicle", kind: "vehicle", label: "Rigid truck", confidence: 0.97, box: { x: 0.2, y: 0.05, w: 0.7, h: 0.85 } },
            { id: "cab", kind: "component", label: "Cab", confidence: 0.94, box: { x: 0.35, y: 0.08, w: 0.45, h: 0.58 } },
            { id: "tyre-b", kind: "tyre", label: "Steer tyre", confidence: 0.87, box: { x: 0.38, y: 0.7, w: 0.16, h: 0.24 } },
          ],
        },
        {
          t: 28,
          detections: [
            { id: "vehicle", kind: "vehicle", label: "Rigid truck", confidence: 0.97, box: { x: 0.1, y: 0.05, w: 0.85, h: 0.85 } },
            { id: "cab", kind: "component", label: "Cab", confidence: 0.94, box: { x: 0.48, y: 0.08, w: 0.4, h: 0.58 } },
            { id: "load-b", kind: "load", label: "Load: barriers under tarp", confidence: 0.84, box: { x: 0.05, y: 0.2, w: 0.35, h: 0.46 } },
            { id: "tyre-b", kind: "tyre", label: "Steer tyre", confidence: 0.87, box: { x: 0.55, y: 0.7, w: 0.16, h: 0.24 } },
          ],
        },
        {
          t: 29,
          detections: [
            { id: "vehicle", kind: "vehicle", label: "Rigid truck", confidence: 0.97, box: { x: 0.08, y: 0.05, w: 0.88, h: 0.85 } },
            { id: "cab", kind: "component", label: "Cab", confidence: 0.94, box: { x: 0.5, y: 0.08, w: 0.4, h: 0.58 } },
            { id: "load-b", kind: "load", label: "Load: barriers under tarp", confidence: 0.84, box: { x: 0.03, y: 0.15, w: 0.4, h: 0.5 } },
            { id: "tyre-b", kind: "tyre", label: "Steer tyre", confidence: 0.87, box: { x: 0.58, y: 0.7, w: 0.16, h: 0.24 } },
          ],
        },
        {
          t: 30,
          detections: [
            { id: "vehicle", kind: "vehicle", label: "Rigid truck", confidence: 0.97, box: { x: 0.06, y: 0.04, w: 0.9, h: 0.86 } },
            { id: "cab", kind: "component", label: "Cab", confidence: 0.94, box: { x: 0.5, y: 0.06, w: 0.4, h: 0.58 } },
            { id: "load-b", kind: "load", label: "Load: barriers under tarp", confidence: 0.84, box: { x: 0.02, y: 0.13, w: 0.42, h: 0.52 } },
            { id: "tyre-b", kind: "tyre", label: "Steer tyre", confidence: 0.87, box: { x: 0.6, y: 0.72, w: 0.16, h: 0.24 } },
          ],
        },
        {
          t: 31,
          detections: [
            { id: "vehicle", kind: "vehicle", label: "Rigid truck", confidence: 0.97, box: { x: 0.05, y: 0.04, w: 0.9, h: 0.86 } },
            { id: "cab", kind: "component", label: "Cab", confidence: 0.94, box: { x: 0.5, y: 0.05, w: 0.4, h: 0.58 } },
            { id: "load-b", kind: "load", label: "Load: barriers under tarp", confidence: 0.84, box: { x: 0.02, y: 0.12, w: 0.44, h: 0.53 } },
            { id: "tyre-b", kind: "tyre", label: "Steer tyre", confidence: 0.87, box: { x: 0.6, y: 0.72, w: 0.16, h: 0.24 } },
          ],
        },
      ],
    },
    attributes: [
      { label: "Vehicle", value: "Rigid truck (pantech)", confidence: 0.98 },
      { label: "Make / model", value: "Isuzu FRR (F-series)", confidence: 0.9, hint: "ISUZU grille + 'FRR' cab badge." },
      { label: "Colour", value: "White", confidence: 0.98 },
      { label: "Plate", value: "XB 25JG (QLD)", tone: "ok", confidence: 0.79, hint: "Read from the front plate in the walk-around video." },
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
