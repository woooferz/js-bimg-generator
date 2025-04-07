
const ditherType = document.getElementById("ditherType")
const serpentineDither = document.getElementById("serpentineDither")

const paletteSelect = document.getElementById("paletteSelect")
const paletteInput = document.getElementById("paletteInput")

const fontSelect = document.getElementById("fontSelect")
const fontInput = document.getElementById("fontInput")
const sizeTypeInput = document.getElementById("size")
const sizeUnitsInput = document.getElementById("sizeUnits")
const sizeXInput = document.getElementById("sizeX")
const sizeYInput = document.getElementById("sizeY")

const formatInput = document.getElementById("format")

const processButton = document.getElementById("process")
const saveButton = document.getElementById("save")

const charRes = document.getElementById("charRes")

const image = document.getElementById("inputImage")
const canvas = document.getElementById("canvas")
const outputImage = document.getElementById("outputImage")

// https://stackoverflow.com/questions/3665115/how-to-create-a-file-in-memory-for-user-to-download-but-not-through-server
function download(filename, text) {
	var element = document.createElement('a');
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
	element.setAttribute('download', filename);

	element.style.display = 'none';
	document.body.appendChild(element);

	element.click();

	document.body.removeChild(element);
}

const defaultPalette = rgbArrToRgbTuples([
	0xf0f0f0, 0xf2b233, 0xe57fd8, 0x99b2f2, 
	0xdede6c, 0x7fcc19, 0xf2b2cc, 0x4c4c4c, 
	0x999999, 0x4c99b2, 0xb266e5, 0x3366cc, 
	0x7f664c, 0x57a64e, 0xcc4c4c, 0x111111
])

const fontMap = {
	blit: {"data":[[0,0,0],[2,0,0],[1,0,0],[3,0,0],[0,2,0],[2,2,0],[1,2,0],[3,2,0],[0,1,0],[2,1,0],[1,1,0],[3,1,0],[0,3,0],[2,3,0],[1,3,0],[3,3,0],[0,0,2],[2,0,2],[1,0,2],[3,0,2],[0,2,2],[2,2,2],[1,2,2],[3,2,2],[0,1,2],[2,1,2],[1,1,2],[3,1,2],[0,3,2],[2,3,2],[1,3,2],[3,3,2]],"charWidth":2,"charHeight":3},
	font: {"data":[[0,0,0,0,0,0,0,0,0,0,0],[0,56,68,108,68,84,68,56,0,0,0],[0,56,124,84,124,68,108,56,0,0,0],[0,0,40,124,124,124,56,16,0,0,0],[0,0,16,56,124,56,16,0,0,0,0],[0,16,56,16,124,124,16,56,0,0,0],[0,0,16,56,124,124,16,56,0,0,0],[0,0,0,24,60,60,24,0,0,0,0],[0,126,126,102,66,66,102,126,126,0,0],[0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0],[0,0,28,12,52,72,72,48,0,0,0],[0,56,68,68,68,56,16,56,16,0,0],[0,0,0,0,0,0,0,0,0,0,0],[0,0,60,36,60,32,96,96,0,0,0],[0,0,62,34,62,34,102,102,0,0,0],[0,0,64,112,124,112,64,0,0,0,0],[0,0,4,28,124,28,4,0,0,0,0],[0,16,56,124,16,16,124,56,16,0,0],[0,36,36,36,36,36,0,36,0,0,0],[0,60,84,84,52,20,20,20,0,0,0],[0,60,96,88,68,52,12,120,0,0,0],[0,0,0,0,0,0,60,60,0,0,0],[0,16,56,124,16,124,56,16,124,0,0],[0,16,56,124,16,16,16,16,0,0,0],[0,16,16,16,16,124,56,16,0,0,0],[0,0,16,24,124,24,16,0,0,0,0],[0,0,16,48,124,48,16,0,0,0,0],[0,0,0,0,0,64,64,124,0,0,0],[0,0,0,36,126,36,0,0,0,0,0],[0,0,16,16,56,56,124,0,0,0,0],[0,0,124,56,56,16,16,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0],[0,16,16,16,16,16,0,16,0,0,0],[0,20,20,40,0,0,0,0,0,0,0],[0,40,40,124,40,124,40,40,0,0,0],[0,16,60,64,56,4,120,16,0,0,0],[0,68,72,8,16,32,36,68,0,0,0],[0,16,40,16,52,88,72,52,0,0,0],[0,8,8,16,0,0,0,0,0,0,0],[0,12,16,32,32,32,16,12,0,0,0],[0,48,8,4,4,4,8,48,0,0,0],[0,0,0,36,24,36,0,0,0,0,0],[0,0,16,16,124,16,16,0,0,0,0],[0,0,0,0,0,0,16,16,16,0,0],[0,0,0,0,124,0,0,0,0,0,0],[0,0,0,0,0,0,16,16,0,0,0],[0,4,8,8,16,32,32,64,0,0,0],[0,56,68,76,84,100,68,56,0,0,0],[0,16,48,16,16,16,16,124,0,0,0],[0,56,68,4,24,32,68,124,0,0,0],[0,56,68,4,24,4,68,56,0,0,0],[0,12,20,36,68,124,4,4,0,0,0],[0,124,64,120,4,4,68,56,0,0,0],[0,24,32,64,120,68,68,56,0,0,0],[0,124,68,4,8,16,16,16,0,0,0],[0,56,68,68,56,68,68,56,0,0,0],[0,56,68,68,60,4,8,48,0,0,0],[0,0,16,16,0,0,16,16,0,0,0],[0,0,16,16,0,0,16,16,16,0,0],[0,4,8,16,32,16,8,4,0,0,0],[0,0,0,124,0,0,124,0,0,0,0],[0,32,16,8,4,8,16,32,0,0,0],[0,56,68,4,8,16,0,16,0,0,0],[0,60,66,90,90,94,64,60,0,0,0],[0,56,68,124,68,68,68,68,0,0,0],[0,120,68,120,68,68,68,120,0,0,0],[0,56,68,64,64,64,68,56,0,0,0],[0,120,68,68,68,68,68,120,0,0,0],[0,124,64,112,64,64,64,124,0,0,0],[0,124,64,112,64,64,64,64,0,0,0],[0,60,64,76,68,68,68,56,0,0,0],[0,68,68,124,68,68,68,68,0,0,0],[0,56,16,16,16,16,16,56,0,0,0],[0,4,4,4,4,4,68,56,0,0,0],[0,68,72,112,72,68,68,68,0,0,0],[0,64,64,64,64,64,64,124,0,0,0],[0,68,108,84,68,68,68,68,0,0,0],[0,68,100,84,76,68,68,68,0,0,0],[0,56,68,68,68,68,68,56,0,0,0],[0,120,68,120,64,64,64,64,0,0,0],[0,56,68,68,68,68,72,52,0,0,0],[0,120,68,120,68,68,68,68,0,0,0],[0,60,64,56,4,4,68,56,0,0,0],[0,124,16,16,16,16,16,16,0,0,0],[0,68,68,68,68,68,68,56,0,0,0],[0,68,68,68,68,40,40,16,0,0,0],[0,68,68,68,68,84,108,68,0,0,0],[0,68,40,16,40,68,68,68,0,0,0],[0,68,40,16,16,16,16,16,0,0,0],[0,124,4,8,16,32,64,124,0,0,0],[0,56,32,32,32,32,32,56,0,0,0],[0,64,32,32,16,8,8,4,0,0,0],[0,56,8,8,8,8,8,56,0,0,0],[0,16,40,68,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,124,0,0],[0,16,16,8,0,0,0,0,0,0,0],[0,0,0,56,4,60,68,60,0,0,0],[0,64,64,88,100,68,68,120,0,0,0],[0,0,0,56,68,64,68,56,0,0,0],[0,4,4,52,76,68,68,60,0,0,0],[0,0,0,56,68,124,64,60,0,0,0],[0,12,16,60,16,16,16,16,0,0,0],[0,0,0,60,68,68,60,4,120,0,0],[0,64,64,88,100,68,68,68,0,0,0],[0,16,0,16,16,16,16,16,0,0,0],[0,4,0,4,4,4,68,68,56,0,0],[0,32,32,36,40,48,40,36,0,0,0],[0,16,16,16,16,16,16,8,0,0,0],[0,0,0,104,84,84,68,68,0,0,0],[0,0,0,120,68,68,68,68,0,0,0],[0,0,0,56,68,68,68,56,0,0,0],[0,0,0,88,100,68,120,64,64,0,0],[0,0,0,52,76,68,60,4,4,0,0],[0,0,0,88,100,64,64,64,0,0,0],[0,0,0,60,64,56,4,120,0,0,0],[0,16,16,56,16,16,16,8,0,0,0],[0,0,0,68,68,68,68,60,0,0,0],[0,0,0,68,68,68,40,16,0,0,0],[0,0,0,68,68,84,84,60,0,0,0],[0,0,0,68,40,16,40,68,0,0,0],[0,0,0,68,68,68,60,4,120,0,0],[0,0,0,124,8,16,32,124,0,0,0],[0,12,16,16,32,16,16,12,0,0,0],[0,16,16,16,16,16,16,16,0,0,0],[0,48,8,8,4,8,8,48,0,0,0],[0,50,76,0,0,0,0,0,0,0,0],[0,36,72,18,36,72,18,36,72,18,0],[0,0,0,0,0,0,0,0,0,0,0],[240,240,240,240,0,0,0,0,0,0,0],[15,15,15,15,0,0,0,0,0,0,0],[254,254,254,254,0,0,0,0,0,0,0],[0,0,0,0,240,240,240,0,0,0,0],[240,240,240,240,240,240,240,0,0,0,0],[15,15,15,15,240,240,240,0,0,0,0],[255,255,255,255,240,240,240,0,0,0,0],[0,0,0,0,15,15,15,0,0,0,0],[240,240,240,240,15,15,15,0,0,0,0],[15,15,15,15,15,15,15,0,0,0,0],[255,255,255,255,15,15,15,0,0,0,0],[0,0,0,0,255,255,255,0,0,0,0],[240,240,240,240,255,255,255,0,0,0,0],[15,15,15,15,255,255,255,0,0,0,0],[255,255,255,255,255,255,255,0,0,0,0],[0,0,0,0,0,0,0,240,240,240,240],[240,240,240,240,0,0,0,240,240,240,240],[15,15,15,15,0,0,0,240,240,240,240],[255,255,255,255,0,0,0,240,240,240,240],[0,0,0,0,240,240,240,240,240,240,240],[240,240,240,240,240,240,240,240,240,240,240],[15,15,15,15,240,240,240,240,240,240,240],[255,255,255,255,240,240,240,240,240,240,240],[0,0,0,0,15,15,15,240,240,240,240],[240,240,240,240,15,15,15,240,240,240,240],[15,15,15,15,15,15,15,240,240,240,240],[127,127,127,127,15,15,15,240,240,240,240],[0,0,0,0,255,255,255,240,240,240,240],[240,240,240,240,255,255,255,240,240,240,240],[15,15,15,15,255,255,255,240,240,240,240],[255,255,255,255,255,255,255,240,240,240,240],[0,0,0,0,0,0,0,0,0,0,0],[0,16,0,16,16,16,16,16,0,0,0],[0,0,16,56,68,64,68,56,16,0,0],[0,24,36,32,120,32,32,124,0,0,0],[0,0,68,56,68,68,68,56,68,0,0],[0,68,40,124,16,124,16,16,0,0,0],[0,16,16,16,0,16,16,16,0,0,0],[0,60,96,88,68,52,12,120,0,0,0],[0,40,0,0,0,0,0,0,0,0,0],[0,0,60,74,82,82,74,60,0,0,0],[0,48,8,56,72,56,0,0,0,0,0],[0,0,0,20,40,80,40,20,0,0,0],[0,0,0,0,124,4,4,0,0,0,0],[0,0,0,0,124,0,0,0,0,0,0],[0,0,60,90,90,86,66,60,0,0,0],[0,124,0,0,0,0,0,0,0,0,0],[0,48,72,72,48,0,0,0,0,0,0],[0,0,16,16,124,16,16,0,124,0,0],[0,64,32,96,64,96,0,0,0,0,0],[0,96,32,96,32,96,0,0,0,0,0],[0,32,64,0,0,0,0,0,0,0,0],[0,0,0,68,68,68,68,122,64,64,0],[0,60,84,84,52,20,20,20,0,0,0],[0,0,0,0,24,24,0,0,0,0,0],[0,0,0,0,0,0,0,8,16,0,0],[0,32,96,32,32,112,0,0,0,0,0],[0,0,56,68,68,68,56,0,0,0,0],[0,0,0,80,40,20,40,80,0,0,0],[0,68,72,8,16,44,44,68,0,0,0],[0,68,72,8,16,36,40,76,0,0,0],[0,100,40,104,16,44,44,68,0,0,0],[0,16,0,16,32,64,68,56,0,0,0],[0,96,0,56,68,124,68,68,0,0,0],[0,12,0,56,68,124,68,68,0,0,0],[0,56,68,56,68,124,68,68,0,0,0],[0,40,80,56,68,124,68,68,0,0,0],[0,40,0,56,68,124,68,68,0,0,0],[0,16,0,56,68,124,68,68,0,0,0],[0,60,80,80,120,80,80,92,0,0,0],[0,56,68,64,64,68,56,8,16,0,0],[0,96,0,124,64,120,64,124,0,0,0],[0,12,0,124,64,120,64,124,0,0,0],[0,56,68,124,64,120,64,124,0,0,0],[0,40,0,124,64,120,64,124,0,0,0],[0,48,0,56,16,16,16,56,0,0,0],[0,24,0,56,16,16,16,56,0,0,0],[0,16,40,56,16,16,16,56,0,0,0],[0,40,0,56,16,16,16,56,0,0,0],[0,120,68,68,100,68,68,120,0,0,0],[0,20,40,68,100,84,76,68,0,0,0],[0,96,56,68,68,68,68,56,0,0,0],[0,12,56,68,68,68,68,56,0,0,0],[0,56,68,56,68,68,68,56,0,0,0],[0,40,80,56,68,68,68,56,0,0,0],[0,40,56,68,68,68,68,56,0,0,0],[0,0,68,40,16,40,68,0,0,0,0],[0,56,68,76,84,100,68,56,0,0,0],[0,96,0,68,68,68,68,56,0,0,0],[0,12,0,68,68,68,68,56,0,0,0],[0,16,40,0,68,68,68,56,0,0,0],[0,40,0,68,68,68,68,56,0,0,0],[0,12,0,68,40,16,16,16,0,0,0],[0,56,16,24,20,24,16,56,0,0,0],[0,120,68,88,68,68,68,88,64,0,0],[0,96,0,56,4,60,68,60,0,0,0],[0,12,0,56,4,60,68,60,0,0,0],[0,56,68,56,4,60,68,60,0,0,0],[0,40,80,56,4,60,68,60,0,0,0],[0,40,0,56,4,60,68,60,0,0,0],[0,16,0,56,4,60,68,60,0,0,0],[0,0,0,44,82,124,80,46,0,0,0],[0,0,56,68,64,68,56,8,16,0,0],[0,96,0,56,68,124,64,60,0,0,0],[0,12,0,56,68,124,64,60,0,0,0],[0,56,68,56,68,124,64,60,0,0,0],[0,40,0,56,68,124,64,60,0,0,0],[0,48,0,16,16,16,16,16,0,0,0],[0,24,0,16,16,16,16,16,0,0,0],[0,16,40,16,16,16,16,16,0,0,0],[0,40,0,16,16,16,16,16,0,0,0],[0,16,8,60,68,68,68,56,0,0,0],[0,40,80,120,68,68,68,68,0,0,0],[0,96,0,56,68,68,68,56,0,0,0],[0,12,0,56,68,68,68,56,0,0,0],[0,56,68,56,68,68,68,56,0,0,0],[0,40,80,56,68,68,68,56,0,0,0],[0,40,0,56,68,68,68,56,0,0,0],[0,0,16,0,124,0,16,0,0,0,0],[0,0,0,56,76,84,100,56,0,0,0],[0,96,0,68,68,68,68,60,0,0,0],[0,12,0,68,68,68,68,60,0,0,0],[0,16,40,0,68,68,68,60,0,0,0],[0,40,0,68,68,68,68,60,0,0,0],[0,12,0,68,68,68,60,4,120,0,0],[0,48,16,24,20,24,16,56,0,0,0],[0,40,0,68,68,68,60,4,120,0,0]],"charWidth":8,"charHeight":11},
	space: {"data": [[0]], "charWidth": 1, "charHeight": 1}
}

var getRgbFromTuple = function(tuple) {
	return (tuple[0] << 16) + (tuple[1] << 8) + tuple[2]
}

const formatMap = {
	"bimg": {
		supportsFonts: true, // if false, only supports space
		supportsPalettes: true, // if false, only supports default palette
		convert: function(charMap, palette) {
			var fileData = "{"
			if (palette != null) {
				fileData += "palette={"
				for (i in palette) {
					if (i == 0) {
						fileData += "[0]="
					}
					fileData += "{" + getRgbFromTuple(palette[i]) + "},"
				}
				fileData += "},"
			}
			fileData += "{"
			for (y in charMap) {
				fileData += "{\""
				// char
				for (x in charMap[y]) {
					var offset = 0
					if (fontSelect.value == "blit") {
						offset = 128
					} else if (fontSelect.value == "space") {
						offset = 32
					}
					fileData += "\\" + (charMap[y][x].char + offset)
				}
				fileData += "\",\""
				// fg
				for (x in charMap[y]) {
					fileData += charMap[y][x].fg.toString(16)
				}
				fileData += "\",\""
				// bg
				for (x in charMap[y]) {
					fileData += charMap[y][x].bg.toString(16)
				}
				fileData += "\"},"
			}
			fileData += "}}"
			return fileData
		}
	},
	"bbf": {
		supportsFonts: true,
		supportsPalettes: true,
	},
	"nfp": {
		supportsFonts: false,
		supportsPalettes: false,
	}
}

function updateVisibility() {
	var formatInfo = formatMap[formatInput.value]
	fontSelect.disabled = !formatInfo.supportsFonts
	if (!formatInfo.supportsFonts) {
		fontSelect.value = "space"
	}
	paletteSelect.disabled = !formatInfo.supportsPalettes
	if (!formatInfo.supportsPalettes) {
		paletteSelect.value = "default"
	}

	fontInput.hidden = fontSelect.value != "custom"
	paletteInput.hidden = paletteSelect.value != "custom"
	sizeUnitsInput.hidden = sizeTypeInput.value != "custom"
	sizeXInput.hidden = sizeTypeInput.value != "custom"
	sizeYInput.hidden = sizeTypeInput.value != "custom"
}

updateVisibility()
fontSelect.onchange = updateVisibility
formatInput.onchange = updateVisibility
sizeTypeInput.onchange = updateVisibility
paletteSelect.onchange = updateVisibility

var inputFilename

document.getElementById('imageSelect').onchange = function (event) {
	var selectedFile = event.target.files[0]
	var reader = new FileReader()

	inputFilename = selectedFile.name

	reader.onload = function(event) {
		image.src = event.target.result
	}
	
	reader.readAsDataURL(selectedFile)
}

var charMap
var paletteUsed

const monitorScale = 0.5

processButton.onclick = function() {
	var width = image.width
	var height = image.height
	var units = "chars"

	switch (sizeTypeInput.value) {
		case "term":
			units = "chars"
			width = 51
			height = 19
			break
		case "image":
			units = "pixels"
			break
		case "custom":
			width = sizeXInput.value
			height = sizeYInput.value
			units = sizeUnitsInput.value
			break
	}

	var font = fontMap[fontSelect.value]
	if (fontSelect.value == "custom") {
		font = JSON.parse(fontInput.value)
	}

	if (units == "monitors") {
		width = Math.round((64 * width - 20) / (6 * monitorScale))
        height = Math.round((64 * height - 20) / (9 * monitorScale))
		units = "chars"
	}
	if (units == "chars") {
		width *= font.charWidth
		height *= font.charHeight
		units = "pixels"
	}

	canvas.width = width
	canvas.height = height
	var ctx = canvas.getContext("2d")
	ctx.fillRect(0,0,canvas.width,canvas.height)
	ctx.drawImage(image, 0, 0, width, height)

	var palette

	if (paletteSelect.value == "default") {
		palette = defaultPalette
		paletteUsed = null
	}
	if (paletteSelect.value == "custom") {
		palette = JSON.parse(paletteInput.value)
		if (typeof(palette[1]) == "number") {
			palette = rgbArrToRgbTuples(palette)
		}
	}

	const quantizer = new RgbQuant({palette: palette, colors: 14})
	if (paletteSelect.value == "best") {
		quantizer.sample(canvas)
	}
	if (paletteSelect.value != "default") {
		paletteUsed = quantizer.palette(true, true)
	}

	charMap = fontize(quantizer, canvas, fontMap[fontSelect.value], ditherType.value, serpentineDither.checked)
	outputImage.src = canvas.toDataURL("image/png")

	charRes.innerHTML = charMap[0].length + "x" + charMap.length
}

saveButton.onclick = function() {
	var file = formatMap[formatInput.value].convert(charMap, paletteUsed)
	var blob = new Blob([file], {type: "text/plain;charset=utf-8"})
	
	saveAs(blob, inputFilename.substr(0, inputFilename.lastIndexOf('.')) + "." + formatInput.value)
}
