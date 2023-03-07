function rgbArrToRgbTuples(arr) {
	var newArr = []
	for (var fullrgb of arr) {
		newArr.push([
			fullrgb >> 16,
			(fullrgb >> 8) & 0xFF,
			fullrgb & 0xFF,
		])
	}
	return newArr
}

function getIndex(w, x, y) {
    return x + (y * w)
}

function indexOfMax(arr) {
    if (arr.length === 0) {
        return -1;
    }

    var max = arr[0];
    var maxIndex = 0;

    for (var i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }

    return maxIndex;
}

function getRGBDistance(rgb1, rgb2) {
	let rDiff = rgb1[0] - rgb2[0];
	let gDiff = rgb1[1] - rgb2[1];
	let bDiff = rgb1[2] - rgb2[2];
	return Math.sqrt(rDiff ** 2 + gDiff ** 2 + bDiff ** 2);
}




function fontize(quantizer, canvas, font, ditherType, serpentine = false) {
	var indexedMap = quantizer.reduce(canvas, 2, ditherType, serpentine);
	var palette = quantizer.palette(true, true)
	var charsWide = Math.floor(canvas.width / font.charWidth)
	var charsHigh = Math.floor(canvas.height / font.charHeight)

	function iterateCharacter(fun) {
		for (var y = 0; y < font.charHeight; y++) {
			for (var x = 0; x < font.charWidth; x++) {
				fun(x,y)
			}
		}
	}

	function getClosestChar(fg, bg, fgmap) {
		var smallestDiff = font.charWidth * font.charHeight * 1000
		var charInfo = {fg: fg, bg: bg, char: 0}
		var inversefgmap = []
		for (var i = 0; i < fgmap.length; i++) {
			inversefgmap[i] = ~fgmap[i] & ((1 << font.charWidth) - 1)
		}
		// console.log(fgmap)
		for (var fontIndex = 0; fontIndex < font.data.length; fontIndex++) {
			var diff = getFGDiff(fgmap, font.data[fontIndex])
			if (diff < smallestDiff) {
				charInfo.char = fontIndex
				smallestDiff = diff
				charInfo.fg = fg
				charInfo.bg = bg
				if (diff == 0) {
					break
				}
			}
			diff = getFGDiff(inversefgmap, font.data[fontIndex])
			if (diff < smallestDiff) {
				charInfo.char = fontIndex
				smallestDiff = diff
				charInfo.fg = bg
				charInfo.bg = fg
				if (diff == 0) {
					break
				}
			}
		}
		return charInfo
	}

	function drawChar(x, y, charInfo) {
		var fg = charInfo.fg
		var bg = charInfo.bg
		var bits = font.data[charInfo.char]
		for (var dy = 0; dy < font.charHeight; dy++) {
			var remainingBits = bits[dy]
			for (var dx = font.charWidth-1; dx >= 0; dx--) {
				var tx = x + dx
				var ty = y + dy
				if (remainingBits & 1 == 1) {
					indexedMap[tx+(ty*canvas.width)] = fg
				} else {
					indexedMap[tx+(ty*canvas.width)] = bg
				}
				remainingBits >>= 1
			}
		}
	}

	function applyPaletteMap() {
		var ctx = canvas.getContext("2d")
		var imageData = ctx.getImageData(0,0,canvas.width,canvas.height)
		var data = imageData.data
		for (var i = 0; i < indexedMap.length; i++) {
			var di = i * 4
			var palleteIndex = indexedMap[i]
			var paletteColor = palette[palleteIndex]
			data[di] = paletteColor[0]
			data[di+1] = paletteColor[1]
			data[di+2] = paletteColor[2]
		}
		ctx.putImageData(imageData,0,0)
	}

	function getChar(x, y) {
		var occurrenceMap = []
		iterateCharacter(function(dx,dy) {
			var index = getIndex(canvas.width,x+dx,y+dy)
			var palIndex = indexedMap[index]
			if (occurrenceMap[palIndex] == null) {
				occurrenceMap[palIndex] = 0
			}
			occurrenceMap[palIndex]++
		})
		var fg = indexOfMax(occurrenceMap)
		occurrenceMap[fg] = 0
		var bg = indexOfMax(occurrenceMap)
		// now to restrict the other colors to fit these
		// and generate a font map
		var fgmap = []
		for (var dy = 0; dy < font.charHeight; dy++) {
			var fgline = 0
			for (var dx = 0; dx < font.charWidth; dx++) {
				fgline <<= 1
				var index = getIndex(canvas.width,x+dx,y+dy)
				var palIndex = indexedMap[index]

				if (palIndex != bg) {
					if (palIndex == fg || getRGBDistance(palette[fg], palette[palIndex]) < getRGBDistance(palette[bg], palette[palIndex])) {
						indexedMap[index] = fg
					} else {
						indexedMap[index] = bg
					}
				}

				if (palIndex == fg) {
					fgline++
				}
			}
			fgmap.push(fgline)
		}
		var charInfo = getClosestChar(fg, bg, fgmap)
		// apply this character to the palette map
		drawChar(x,y,charInfo)
		return charInfo
	}

	function getChars() {
		var charMap = []
		for (var y = 0; y < charsHigh; y++) {
			charMap[y] = []
			for (var x = 0; x < charsWide; x++) {
				charMap[y][x] = getChar(x*font.charWidth, y*font.charHeight)
			}
		}
		return charMap
	}

	var chars = getChars()
	applyPaletteMap()
	return chars
}