// tailwind.config.js
const twcolors = require('tailwindcss/colors');
let palette = require('./utils/palette');

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
		fontFamily: {
      'sans': ['Muli', 'ui-sans-serif', 'system-ui'],
      'body': ['"Nunito Sans"', 'ui-sans-serif', 'system-ui']
    },
    variants: {
    	transitionProperty: ['responsive', 'motion-safe', 'motion-reduce'],
	    extend: {
	      cursor: ['hover', 'focus'],
	      borderWidth: ['hover', 'focus'],
	      transitionProperty: {
	      	'width': 'width',
	      	'height': 'height'
	      }
	    }
	  },
	  extend: {
      fontSize: {
      	'xxs':  '0.5rem',
      	'10xl': '10rem',
      	'12xl': '12rem',
      	'14xl': '14rem',
      	'16xl': '16rem',
      	'18xl': '18rem',
      	'20xl': '20rem',
      	'25xl': '25rem',
      	'30xl': '30rem',
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
      minHeight: {
    		'0': '0',
    		'1/4': '25vh',
	      '1/2': '50vh',
	      '3/4': '75vh',
    	},
      cursor: {
        crosshair: 'crosshair',
        grab: 'grab',
        help: 'help',
        'zoom-in': 'zoom-in',
        'zoom-out': 'zoom-out'
      },
      strokeWidth: {
      	'8': '8',
      	'16': '16'
      },
      fill: {
      	transparent: 'transparent'
      }
    },
  },
  plugins: [],
}