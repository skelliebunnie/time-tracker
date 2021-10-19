// import { paletteGenerator } from 'colorFunctions'
const paletteGenerator = require('./paletteGenerator')

const twcolors = require('tailwindcss/colors');

const colors = {
  primary:    '#c3922e',
  secondary:  '#2A7F62',
  accent:     '#1C3144',
  neutral:    '#A2AEBB',
}

const shades = twcolors.grey;

const corePalette = paletteGenerator(colors, shades, 'default');

const palette = {
	primary: {
		...corePalette.primary,
		mainGradient: `radial-gradient(ellipse at 20% 30%, ${corePalette.accent.main}, ${corePalette.primary.main}`,
		contrastText: corePalette.accent.main,
	},
	secondary: {
		...corePalette.secondary,
		contrastText: corePalette.neutral.main,
	},
	accent: { ...corePalette.accent },
	neutral: { ...corePalette.neutral },
	background: { paper: corePalette.neutral.main },
	info: twcolors.sky,
	success: twcolors.lime,
	warn: twcolors.amber,
	error: twcolors.rose,
	dark: corePalette.neutral[900],
	light: corePalette.neutral[100]
}

//export default palette
module.exports = palette
