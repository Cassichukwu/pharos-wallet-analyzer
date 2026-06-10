const Jimp = require("jimp").Jimp;

async function generateLogo() {
  const SIZE = 480;
  const image = new Jimp({ width: SIZE, height: SIZE, color: 0x0A0F1Eff });

  // Outer ring
  for (let angle = 0; angle < 360; angle += 0.1) {
    const rad = (angle * Math.PI) / 180;
    const x = Math.round(240 + 225 * Math.cos(rad));
    const y = Math.round(240 + 225 * Math.sin(rad));
    for (let t = -3; t <= 3; t++) {
      if (x + t >= 0 && x + t < SIZE) image.setPixelColor(0x00D4FFff, x + t, y);
      if (y + t >= 0 && y + t < SIZE) image.setPixelColor(0x00D4FFff, x, y + t);
    }
  }

  // Bars
  const bars = [
    { x: 160, y: 230, w: 25, h: 70 },
    { x: 195, y: 200, w: 25, h: 100 },
    { x: 230, y: 215, w: 25, h: 85 },
    { x: 265, y: 175, w: 25, h: 125 },
  ];
  bars.forEach((bar) => {
    for (let bx = bar.x; bx < bar.x + bar.w; bx++) {
      for (let by = bar.y; by < bar.y + bar.h; by++) {
        image.setPixelColor(0x00D4FFff, bx, by);
      }
    }
  });

  // Base line
  for (let x = 150; x < 305; x++) {
    image.setPixelColor(0x00D4FFff, x, 302);
    image.setPixelColor(0x00D4FFff, x, 303);
  }

  // Magnifier circle
  for (let angle = 0; angle < 360; angle += 0.5) {
    const rad = (angle * Math.PI) / 180;
    const x = Math.round(268 + 28 * Math.cos(rad));
    const y = Math.round(200 + 28 * Math.sin(rad));
    for (let t = -2; t <= 2; t++) {
      if (x + t >= 0 && x + t < SIZE) image.setPixelColor(0xFFD700ff, x + t, y);
      if (y + t >= 0 && y + t < SIZE) image.setPixelColor(0xFFD700ff, x, y + t);
    }
  }

  // Magnifier handle
  for (let i = 0; i < 22; i++) {
    image.setPixelColor(0xFFD700ff, 290 + i, 222 + i);
    image.setPixelColor(0xFFD700ff, 291 + i, 222 + i);
    image.setPixelColor(0xFFD700ff, 290 + i, 223 + i);
  }

  await image.write("logo.png");
  console.log("Logo saved as logo.png");
}

generateLogo().catch(console.error);