// tailwind.config.js
const twcolors = require('tailwindcss/colors');

const shades = {
  50 : '#fafafa', 
  100: '#f5f5f5',
  200: '#eeeeee',
  300: '#e0e0e0',
  400: '#bdbdbd',
  500: '#9e9e9e',
  600: '#757575',
  700: '#616161',
  800: '#424242',
  900: '#212121',
};
const shadeKeys = Object.keys(shades);

const colors = {
	'primary': 		'#C4F7A1',
	'secondary': 	'#7EA3CC',
	'tertiary': 	'#D7CEB2',
	'accent': 		'#FE654F',
	'neutral': 		'#535657'
}
const colorKeys = Object.keys(colors);

let palette = {}
for(var i = 0; i < colorKeys.length; i++) {
	const name = colorKeys[i];
	const color = colors[name];
	palette[name] = [];

	for(var x = 0; x < shadeKeys.length; x++) {
		const value = shadeKeys[x];
		const shade = shades[value];

		palette[name][value] = matchColor(color, shade);
	}
}

function hue2rgb(p, q, t) {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
};

function rgbToHSL(r,g,b) {
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
}

function hslToRGB(h, s, l) {
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

function hexToRGB(hex) {
	if(hex === undefined) return [0,0,0];
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
}

function rgbToHex(r,g,b) {
	r = Math.round(r);
  g = Math.round(g);
  b = Math.round(b);

  return `#${r.toString(16).toUpperCase().padStart(2, "0")}${g
    .toString(16)
    .toUpperCase()
    .padStart(2, "0")}${b.toString(16).toUpperCase().padStart(2, "0")}`;
}

function hexToHSL(hex) {
	const rgb = hexToRGB(hex);
  return rgbToHSL(rgb[0], rgb[1], rgb[2]);
}

function matchColor(hex, compHex) {
	const HSL = hexToHSL(hex);
  const compHSL = hexToHSL(compHex);

  const newRGB = hslToRGB(HSL[0], HSL[1], compHSL[2]);

  return rgbToHex(newRGB[0], newRGB[1], newRGB[2]);
}

module.exports = {
 purge: [
  './src/**/*.html',
  './src/**/*.js',
 ],
  darkMode: 'class', // or 'media' or false
  theme: { 
  	colors: {
  		...palette,
			info: twcolors.sky,
			success: twcolors.lime,
			warn: twcolors.amber,
			error: twcolors.rose,
			dark: palette.neutral[900],
			light: palette.neutral[100]
		},
    extend: {
      fontFamily: {
        'sans': ['Muli', 'ui-sans-serif', 'system-ui'],
        'body': ['Muli', 'ui-sans-serif', 'system-ui']
      },
      minWidth: {
        '0': '0',
        '1/4': '25%',
        '1/3': '33%',
        '2/5': '45%',
        '1/2': '50%',
        '3/4': '75%',
        'full': '100%',
        'min': 'min-content',
        'max': 'max-content'
      },
      cursor: {
        crosshair: 'crosshair',
        grab: 'grab',
        'zoom-in': 'zoom-in',
        'zoom-out': 'zoom-out',
        help: 'help'
      }
    },
    variants: {
	    extend: {
	      cursor: ['hover', 'focus'],
	      borderWidth: ['hover', 'focus']
	    },
	  },
  },
  variants: {},
  plugins: [],
}