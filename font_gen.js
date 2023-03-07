var charWidth = 8
var charHeight = 11
var charXOffset = 0
var charYOffset = 0
var charsWide = 16
var charsHigh = 16
var imageWidth = (charWidth + charXOffset)*charsWide
var imageHeight = (charHeight + charYOffset)*charsHigh

function process() {
	boundingCtx.fillStyle = "black"
    boundingCtx.fillRect(0,0,imageWidth,imageHeight)
    boundingCtx.drawImage(charImage, 0, 0)

	processCtx.fillStyle = "black"
    processCtx.fillRect(0,0,imageWidth,imageHeight)
    processCtx.drawImage(charImage, 0, 0)
    var charData = processCtx.getImageData(0,0,imageWidth,imageHeight)
    
    boundingCtx.fillStyle = "red"
    boundingCtx.strokeStyle = "red"
    forEachChar(charsWide, charsHigh, charWidth, charHeight, charXOffset, charYOffset, 
    function(x,y) {
        boundingCtx.strokeRect(x, y, charWidth, charHeight)
    })

    var pixelmap = [] // int[char][y]
    forEachChar(charsWide, charsHigh, charWidth, charHeight, charXOffset, charYOffset, 
    function(x,y) {
        pixelmap.push(getFGArr(charData, x, y, charWidth, charHeight))
    })

    outputLabel.value = JSON.stringify({
        data: pixelmap,
        charWidth: charWidth,
        charHeight: charHeight,
    })
}

function updateSizes() {
    imageWidth = (charWidth + charXOffset)*charsWide
    imageHeight = (charHeight + charYOffset)*charsHigh
    boundingCanvas.width = imageWidth
    boundingCanvas.height = imageHeight
    processCanvas.width = imageWidth
    processCanvas.height = imageHeight
    process()
}

const charWidthSlider = document.getElementById('charWidth')
charWidthSlider.oninput = function () {
    charWidth = parseInt(this.value)
    updateSizes()
}

const charHeightSlider = document.getElementById('charHeight')
charHeightSlider.oninput = function () {
    charHeight = parseInt(this.value)
    updateSizes()
}

const charXOffsetSlider = document.getElementById('charXOffset')
charXOffsetSlider.oninput = function () {
    charXOffset = parseInt(this.value)
    updateSizes()
}

const charYOffsetSlider = document.getElementById('charYOffset')
charYOffsetSlider.oninput = function () {
    charYOffset = parseInt(this.value)
    updateSizes()
}

const charsWideSlider = document.getElementById('charsWide')
charsWideSlider.oninput = function () {
    charsWide = parseInt(this.value)
    updateSizes()
}

const charsHighSlider = document.getElementById('charsHigh')
charsHighSlider.oninput = function () {
    charsHigh = parseInt(this.value)
    updateSizes()
}

const outputLabel = document.getElementById("output")

const boundingCanvas = document.getElementById('bounding')
const processCanvas = document.getElementById("processCanvas")
const processButton = document.getElementById("process")

const boundingCtx = boundingCanvas.getContext("2d")
const processCtx = processCanvas.getContext("2d")


var charImage = document.getElementById("image");

document.getElementById('imageInput').onchange = function (event) {
	var selectedFile = event.target.files[0]
	var reader = new FileReader()

	reader.onload = function(event) {
		charImage.src = event.target.result
	}
	
	reader.readAsDataURL(selectedFile)
}

function forEachChar(w, h, cw, ch, ox, oy, fun) {
    var totalCharWidth = cw+ox
    var totalCharHeight = ch+oy
    for (var y = 0; y < h; y++ ) {
        for (var x = 0; x < w; x++) {
            fun(x*totalCharWidth,y*totalCharHeight)
        }
    }

}


processButton.onclick = process

// document.getElementsByTagName('body')[0].appendChild(charCanvas)
