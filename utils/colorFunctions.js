const defaults = {
  baseShades: {
    50: '#fafafa', //'#fafafa',
    100: '#f5f5f5', // '#f4f4f5',
    200: '#eeeeee', // '#e4e4e7',
    300: '#e0e0e0', // '#d4d4d8',
    400: '#bdbdbd', // '#a1a1aa',
    500: '#9e9e9e', // '#71717a',
    600: '#757575', // '#52525b',
    700: '#616161', // '#3f3f46',
    800: '#424242', // '#27272a',
    900: '#212121', // '#18181b',
  },

  coreColors: {
    primary: 		'#9FB1BC',
    secondary: 	'#AA767C',
    accent: 		'#ECFFB0',
    neutral: 		'#23231A',
  }
}

let palette = require('../utils/palette').default;

if(palette === undefined) palette = defaults.baseShades;
if(palette.dark === undefined) palette.dark = defaults.baseShades[900];
if(palette.light === undefined) palette.light = defaults.baseShades[100];

/**
 * CONTRAST, COLOR ADJUSTMENT & MATCHING
 */
const matchColor =  (hex, compHex) => {
  const HSL = hexToHSL(hex);
  const compHSL = hexToHSL(compHex);

  const newRGB = hslToRGB(HSL[0], HSL[1], compHSL[2]);

  return rgbToHex(newRGB[0], newRGB[1], newRGB[2]);
};

// https://codepen.io/davidhalford/pen/ywEva?editors=0010
const contrastColor = (hex) => {
  if (hex === undefined) return;
  hex = hex.replace("#", "");
  /*
    From this W3C document: http://www.webmasterworld.com/r.cgi?f=88&d=9769&url=http://www.w3.org/TR/AERT#color-contrast
  	
    Color brightness is determined by the following formula: 
    ((Red value X 299) + (Green value X 587) + (Blue value X 114)) / 1000
    
    I know this could be more compact, but I think this is easier to read/explain.
  */

  const threshold = 130; /* about half of 256. Lower threshold equals more dark text on dark background  */

  const hRed = parseInt(hex.substring(0, 2), 16);
  const hGreen = parseInt(hex.substring(2, 4), 16);
  const hBlue = parseInt(hex.substring(4, 6), 16);

  const cBrightness = (hRed * 299 + hGreen * 587 + hBlue * 114) / 1000;
  if (cBrightness > threshold) {
    return palette.dark;
  } else {
    return palette.light;
  }
};

// https://stackoverflow.com/a/60880664
const adjustColor = (hex, percent, alpha) => {
  if (hex === undefined) return;

  // strip the leading # if it's there
  hex = hex.toString().replace("#", "");
  alpha = alpha !== undefined ? parseInt(alpha, 16) : "FF";

  // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
  if (hex.length === 3) {
    hex = hex.replace(/(.)/g, "$1$1");
  }

  if (hex.length > 6) {
    alpha = parseInt(hex.substr(6, 2), 16);
  }

  let r = parseInt(hex.substr(0, 2), 16);
  let g = parseInt(hex.substr(2, 2), 16);
  let b = parseInt(hex.substr(4, 2), 16);

  const calculatedPercent = (100 + percent) / 100;

  r = Math.round(Math.min(255, Math.max(0, r * calculatedPercent)));
  g = Math.round(Math.min(255, Math.max(0, g * calculatedPercent)));
  b = Math.round(Math.min(255, Math.max(0, b * calculatedPercent)));

  const newRGB = `${r.toString(16).toUpperCase()}${g
    .toString(16)
    .toUpperCase()}${b.toString(16).toUpperCase()}${alpha}`.padStart(6, "0");

  return "#" + newRGB;
};

/**
 * CONVERSION (rgb -> hex, hex -> rgb, etc.)
 */
const rgbToHex = (r, g, b) => {
  r = Math.round(r);
  g = Math.round(g);
  b = Math.round(b);

  return `#${r.toString(16).toUpperCase().padStart(2, "0")}${g
    .toString(16)
    .toUpperCase()
    .padStart(2, "0")}${b.toString(16).toUpperCase().padStart(2, "0")}`;
};

const hexToRGB = (hex) => {
  hex = hex.toString().replace("#", "");

  // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
  if (hex.length === 3) {
    hex = hex.replace(/(.)/g, "$1$1");
  }

  return [
    parseInt(hex.substr(0, 2), 16),
    parseInt(hex.substr(2, 2), 16),
    parseInt(hex.substr(4, 2), 16)
  ];
};
// RGB -> HSL / HSL -> RGB: http://jsfiddle.net/sangdol/euSLy/4/
/**
 * Converts an RGB color value to HSL. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and l in the set [0, 1].
 *
 * @param   Number  r       The red color value
 * @param   Number  g       The green color value
 * @param   Number  b       The blue color value
 * @return  Array           The HSL representation
 */
const rgbToHSL = (r, g, b) => {
  r /= 255;
  g /= 255;
  b /= 255;
  // (r /= 255), (g /= 255), (b /= 255);
  var max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  var h,
    s,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
      default:
        h = 0;
        break;
    }
    h /= 6;
  }

  return [h, s, l];
};

const hexToHSL = (hex) => {
  const rgb = hexToRGB(hex);
  return rgbToHSL(rgb[0], rgb[1], rgb[2]);
};

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  l       The lightness
 * @return  Array           The RGB representation
 * 
 * hue2rgb pulled from hslToRGB for separate use
 */
const hue2rgb = (p, q, t) => {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
};

const hslToRGB = (h, s, l) => {
  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    let p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

module.exports = {
  matchColor,
  contrastColor,
  adjustColor,
  hexToRGB,
  rgbToHex,
  rgbToHSL,
  hexToHSL,
  hue2rgb,
  hslToRGB,
  defaults
}