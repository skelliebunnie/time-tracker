// import { matchColor, defaults } from './colorFunctions'
const { matchColor, defaults } = require('./colorFunctions')

function paletteGenerator(coreColors='default', baseShades='default') {
  const shadesRange = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'];

  const defaultBaseShades = defaults.baseShades;

  const defaultCoreColors = defaults.coreColors;

  if(coreColors === null || coreColors === undefined || coreColors === 'default') {
    coreColors = defaultCoreColors
  }

  if(baseShades === null || baseShades === undefined || baseShades === 'default') {
    baseShades = defaultBaseShades;
  } 
  
  if(Array.isArray(baseShades)) {
    let baseShadesObj = {}

    baseShades.forEach((shade, index) => {
      if(shadesRange[index] !== undefined) {
        baseShadesObj[shadesRange[index]] = shade
      }
    });

    baseShades = baseShadesObj;
  }

  const colorKeys = Object.keys(coreColors)
  const shadeKeys = Object.keys(baseShades)

  let corePalette = {}

  for(var i = 0; i < colorKeys.length; i++) {
    const colorKey = colorKeys[i]

    corePalette[colorKey] = {}

    corePalette[colorKey].DEFAULT = coreColors[colorKey];
    corePalette[colorKey].main = coreColors[colorKey];

    for (var j = 0; j < shadeKeys.length; j++) {
      const shadeKey = shadeKeys[j]
      corePalette[colorKey][shadeKey] = matchColor(coreColors[colorKey], baseShades[shadeKey])
    }
  }

  return corePalette;
}

module.exports = paletteGenerator