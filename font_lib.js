
function getPixelIndex(ctx, x,y) {
    return (x + y * ctx.width)*4
}

function getFGLine(ctx, x, y, w) {
    var line = 0
    for (var dx = 0; dx < w; dx++) {
        line = line << 1
        var isFG = ctx.data[getPixelIndex(ctx, x+dx, y)] > 127
        if (isFG) {
            line++
        }
    }
    return line
}

function getFGArr(ctx, x, y, w, h) {
    var fgData = []
    for (var dy = 0; dy < h; dy++) {
        fgData.push(getFGLine(ctx, x, y+dy, w))
    }
    return fgData
}
function countBits(num) {
    let count = 0;
    while (num > 0) {
        if (num & 1) {
            count++;
        }
        num >>= 1;
    }
    return count;
}

function getFGDiff(arr1, arr2) {
    let totalDiff = 0;
    for (let i = 0; i < arr1.length; i++) {
        totalDiff += countBits(arr1[i] ^ arr2[i]);
    }
    return totalDiff;
}