let ca, cb;
let n = 7;
var baseWight = [];
var step = 0.1;
var canvas;

function setup() {
  console.log("ok");
  canvas = createCanvas(windowWidth, windowHeight / 2);
  canvas.position(0, 0);
  canvas.parent("sketch-holder");
  canvas.style("padding", "0");
  canvas.style("margin", "0");
  canvas.style("width", "100%");
  canvas.style("height", "auto");

  ca = color(255);
  cb = color("#C8C3BD");
  noFill();
  for (var i = 0; i < n; i++) {
    baseWight[i] = 10;
  }
}
function draw() {
  background(255);
  drawWave(frameCount / 1000);
}

function drawWave(zoff) {
  if (baseWight[0] < 6 || baseWight[0] > 20) {
    step *= -1;
  }

  baseWight[0] += step;
  baseWight[1] -= step;
  baseWight[2] += 1.3 * step;
  baseWight[3] -= 1.3 * step;
  baseWight[4] += 1.15 * step;
  baseWight[5] -= 1.15 * step;
  baseWight[6] -= 0.7 * step;

  for (let i = 0; i < n; i++) {
    if (i == 3 || i == 5) {
      stroke(ca);
      strokeWeight(n - i + baseWight[i] / 4);
    } else {
      stroke(cb);
      strokeWeight(n - i + baseWight[i]);
    }

    beginShape();
    var thisWhiteLength = map(
      noise(0.001, i * 0.015, zoff),
      0,
      1,
      0,
      width / 4
    );
    var thisNoiseSeed = map(noise(zoff * (n - i)), 0, 1, 0, 0.125);
    for (let x = -5; x <= width + 5; x += 10) {
      let y =
        map(
          noise(x * 0.0015, i * thisNoiseSeed, zoff),
          0,
          1,
          (-height / 3) * 2,
          (height / 3) * 2
        ) +
        height / 2;
      vertex(x, y);
    }
    endShape();
  }
}
