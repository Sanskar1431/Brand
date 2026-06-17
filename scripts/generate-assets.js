const fs = require("fs");
const path = require("path");

// Function to generate a point cloud representing "PRINCE"
function generateLogoPoints() {
  const points = [];
  const targetCount = 800;
  
  // Define segment samplers for letters
  // Each letter is defined in a [-0.5, 0.5] width, [-1, 1] height box
  const letters = [
    // P
    (t) => {
      if (t < 0.5) {
        // Vertical line
        return { x: -0.3, y: -1 + (t / 0.5) * 2 };
      } else {
        // Top loop (semicircle on top half)
        const angle = -Math.PI / 2 + ((t - 0.5) / 0.5) * Math.PI;
        return {
          x: -0.3 + Math.cos(angle) * 0.4,
          y: 0.5 + Math.sin(angle) * 0.5
        };
      }
    },
    // R
    (t) => {
      if (t < 0.4) {
        // Vertical line
        return { x: -0.3, y: -1 + (t / 0.4) * 2 };
      } else if (t < 0.7) {
        // Top loop
        const angle = -Math.PI / 2 + ((t - 0.4) / 0.3) * Math.PI;
        return {
          x: -0.3 + Math.cos(angle) * 0.4,
          y: 0.5 + Math.sin(angle) * 0.5
        };
      } else {
        // Diagonal leg
        const progress = (t - 0.7) / 0.3;
        return {
          x: -0.3 + progress * 0.6,
          y: 0 - progress * 1
        };
      }
    },
    // I
    (t) => {
      if (t < 0.6) {
        // Vertical core
        return { x: 0, y: -1 + (t / 0.6) * 2 };
      } else if (t < 0.8) {
        // Top cap
        return { x: -0.3 + ((t - 0.6) / 0.2) * 0.6, y: 1 };
      } else {
        // Bottom cap
        return { x: -0.3 + ((t - 0.8) / 0.2) * 0.6, y: -1 };
      }
    },
    // N
    (t) => {
      if (t < 0.35) {
        // Left vertical
        return { x: -0.4, y: -1 + (t / 0.35) * 2 };
      } else if (t < 0.7) {
        // Right vertical
        return { x: 0.4, y: -1 + ((t - 0.35) / 0.35) * 2 };
      } else {
        // Diagonal bridge
        const progress = (t - 0.7) / 0.3;
        return { x: -0.4 + progress * 0.8, y: 1 - progress * 2 };
      }
    },
    // C
    (t) => {
      // Curve opening to the right
      const angle = 0.5 + t * 5.3; // theta from ~0.5 to ~5.8 radians
      return {
        x: Math.cos(angle) * 0.4 + 0.1,
        y: Math.sin(angle) * 0.9
      };
    },
    // E
    (t) => {
      if (t < 0.4) {
        // Vertical stem
        return { x: -0.3, y: -1 + (t / 0.4) * 2 };
      } else if (t < 0.6) {
        // Top bar
        return { x: -0.3 + ((t - 0.4) / 0.2) * 0.6, y: 1 };
      } else if (t < 0.8) {
        // Middle bar
        return { x: -0.3 + ((t - 0.6) / 0.2) * 0.5, y: 0 };
      } else {
        // Bottom bar
        return { x: -0.3 + ((t - 0.8) / 0.2) * 0.6, y: -1 };
      }
    }
  ];

  const pointsPerLetter = Math.floor(targetCount / letters.length);
  const letterSpacing = 1.3;
  const totalWidth = (letters.length - 1) * letterSpacing;
  const startX = -totalWidth / 2;

  // Generate points
  for (let l = 0; l < letters.length; l++) {
    const letterXOffset = startX + l * letterSpacing;
    const sampler = letters[l];

    for (let p = 0; p < pointsPerLetter; p++) {
      const t = p / (pointsPerLetter - 1);
      const coord2d = sampler(t);
      
      // Add a slight jitter/noise for luxury point-cloud organic feel
      const jitterX = (Math.random() - 0.5) * 0.04;
      const jitterY = (Math.random() - 0.5) * 0.04;
      const jitterZ = (Math.random() - 0.5) * 0.05;

      points.push({
        x: coord2d.x + letterXOffset + jitterX,
        y: coord2d.y + jitterY,
        z: jitterZ
      });
    }
  }

  // Fill up remaining spots with random points distributed near letters to hit exact budget
  while (points.length < targetCount) {
    const randomLetter = Math.floor(Math.random() * letters.length);
    const letterXOffset = startX + randomLetter * letterSpacing;
    const t = Math.random();
    const coord2d = letters[randomLetter](t);
    points.push({
      x: coord2d.x + letterXOffset + (Math.random() - 0.5) * 0.1,
      y: coord2d.y + (Math.random() - 0.5) * 0.1,
      z: (Math.random() - 0.5) * 0.1
    });
  }

  return points;
}

// Function to generate base64 circular soft glow PNG
function generateGlowTexture() {
  // 32x32 transparent PNG base64 representation of a radial soft white glow
  return "iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH6AYXEQoQKyC6eQAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkQuY4AAAAe0lEQVRYw+2WwQ2AMAwDbf+dBegIVmEElqBNlKiNlKAldv1lH+ecbNsnzjmH2q0E/O05cEICwAlpACcgAJyQBnACAsAJaQAnIACckAZwAgLACWkAJyAAnJAGcAICwAlpACcgAJyQBnACAsAJCcBr6KqV4FmZf3g/GMB37Dk+gAOMvscHZ6+qY2yD96sAAAAASUVORK5CYII=";
}

const modelsDir = path.join(__dirname, "..", "public", "models");
const texturesDir = path.join(__dirname, "..", "public", "textures");

if (!fs.existsSync(modelsDir)) fs.mkdirSync(modelsDir, { recursive: true });
if (!fs.existsSync(texturesDir)) fs.mkdirSync(texturesDir, { recursive: true });

// Save logo points
const points = generateLogoPoints();
fs.writeFileSync(path.join(modelsDir, "logo-points.json"), JSON.stringify(points, null, 2), "utf-8");
console.log(`Generated ${points.length} points for PRINCE silhouette in public/models/logo-points.json`);

// Save glow texture PNG
const buffer = Buffer.from(generateGlowTexture(), "base64");
fs.writeFileSync(path.join(texturesDir, "glow.png"), buffer);
console.log("Generated 32x32 radial glow sprite in public/textures/glow.png");
