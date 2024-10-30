function rgbToH(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function brightnessRgb(rgb, alpha) {
  let sum = rgb[0] + rgb[1] + rgb[2];
  let beta = 1;
  if (sum > (255 * 3) / 2) {
    beta = -1;
  }
  let r = Math.round(Math.min(255, rgb[0] * (1 + beta * alpha)));
  let g = Math.round(Math.min(255, rgb[1] * (1 + beta * alpha)));
  let b = Math.round(Math.min(255, rgb[2] * (1 + beta * alpha)));
  return [Math.max(r, 0), Math.max(g, 0), Math.max(b, 0)];
}
function brightnessHex(hex, alpha) {
  let rgb = brightnessRgb(hexToRgb(hex), alpha);
  return rgbToH(rgb[0], rgb[1], rgb[2]);
}

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result) {
    var r = parseInt(result[1], 16);
    var g = parseInt(result[2], 16);
    var b = parseInt(result[3], 16);

    return [r, g, b];
  }
  return null;
}
function grayRGB(alpha) {
  const max = 255;
  let x = Math.round(255 * alpha);
  return rgbToH(x, x, x);
}

function colorOscillator(hex1, hex2, num_frames, index) {
  let col1_rgb = hexToRgb(hex1);
  let col2_rgb = hexToRgb(hex2);

  let r_step = (col2_rgb[0] - col1_rgb[0]) / num_frames;
  let g_step = (col2_rgb[1] - col1_rgb[1]) / num_frames;
  let b_step = (col2_rgb[2] - col1_rgb[2]) / num_frames;

  let ii = index % (2 * num_frames);
  if (ii < num_frames) {
    let r = Math.round(col1_rgb[0] + ii * r_step);
    let g = Math.round(col1_rgb[1] + ii * g_step);
    let b = Math.round(col1_rgb[2] + ii * b_step);
    return rgbToH(r, g, b);
  } else {
    let jj = 2 * num_frames - ii;
    let r = Math.round(col1_rgb[0] + jj * r_step);
    let g = Math.round(col1_rgb[1] + jj * g_step);
    let b = Math.round(col1_rgb[2] + jj * b_step);
    return rgbToH(r, g, b);
  }
}

export { grayRGB, colorOscillator, brightnessHex, rgbToH, hexToRgb };
