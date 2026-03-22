// Minimal QR Code generator — renders to canvas, no dependencies
// Based on the QR code specification (ISO 18004), version 2 (25x25), ECC level M
(function () {
  'use strict';

  // Pre-computed QR code matrix for "https://janinc.no/SpisSlank/"
  // Version 2-M, 25x25 modules, alphanumeric + byte mode
  // Generated offline — no runtime encoding needed
  function generateQR(canvas, url) {
    var size = 25;
    var modules = encode(url);
    var scale = Math.floor(canvas.width / (size + 8)); // quiet zone of 4 on each side
    var offset = Math.floor((canvas.width - size * scale) / 2);
    var ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Rounded rect background for QR
    var qrSize = size * scale + scale * 2;
    var qrOffset = offset - scale;
    ctx.fillStyle = '#ffffff';
    roundRect(ctx, qrOffset, qrOffset, qrSize, qrSize, scale);

    // Modules
    for (var y = 0; y < size; y++) {
      for (var x = 0; x < size; x++) {
        if (modules[y * size + x]) {
          ctx.fillStyle = '#1a1a2e';
          ctx.fillRect(offset + x * scale, offset + y * scale, scale, scale);
        }
      }
    }
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.fill();
  }

  // ===== QR encoding engine (Version 1-6, ECC L/M) =====
  var GF = (function () {
    var exp = new Array(256), log = new Array(256);
    var v = 1;
    for (var i = 0; i < 256; i++) {
      exp[i] = v;
      log[v] = i;
      v <<= 1;
      if (v >= 256) v ^= 0x11d;
    }
    return {
      exp: exp, log: log,
      mul: function (a, b) { return a === 0 || b === 0 ? 0 : exp[(log[a] + log[b]) % 255]; }
    };
  })();

  function polyMul(a, b) {
    var r = new Array(a.length + b.length - 1);
    for (var i = 0; i < r.length; i++) r[i] = 0;
    for (var i = 0; i < a.length; i++)
      for (var j = 0; j < b.length; j++)
        r[i + j] ^= GF.mul(a[i], b[j]);
    return r;
  }

  function rsGenPoly(n) {
    var p = [1];
    for (var i = 0; i < n; i++)
      p = polyMul(p, [1, GF.exp[i]]);
    return p;
  }

  function rsEncode(data, ecLen) {
    var gen = rsGenPoly(ecLen);
    var msg = new Array(data.length + ecLen);
    for (var i = 0; i < data.length; i++) msg[i] = data[i];
    for (var i = data.length; i < msg.length; i++) msg[i] = 0;
    for (var i = 0; i < data.length; i++) {
      var coef = msg[i];
      if (coef !== 0) {
        for (var j = 0; j < gen.length; j++)
          msg[i + j] ^= GF.mul(gen[j], coef);
      }
    }
    return msg.slice(data.length);
  }

  // Version/ECC info: [version, size, totalCodewords, ecPerBlock, numBlocks, dataCodewords]
  var VERSIONS = {
    '1-M': [1, 21, 26, 10, 1, 16],
    '2-M': [2, 25, 44, 16, 1, 28],
    '3-M': [3, 29, 70, 26, 1, 44],
    '4-M': [4, 33, 100, 18, 2, 40],  // 2 blocks, 20 data each
    '5-M': [5, 37, 134, 24, 2, 43],  // 2 blocks
    '6-M': [6, 41, 172, 16, 4, 68],  // 4 blocks, 17 data each
  };

  // Alignment pattern centers by version
  var ALIGN = { 2: [6, 18], 3: [6, 22], 4: [6, 26], 5: [6, 30], 6: [6, 34] };

  function encode(text) {
    var data = encodeData(text);
    var ver = data.version;
    var info = VERSIONS[ver + '-M'];
    var size = info[1];
    var grid = new Array(size * size);
    var reserved = new Array(size * size);
    for (var i = 0; i < grid.length; i++) { grid[i] = 0; reserved[i] = false; }

    // Place finder patterns
    placeFinder(grid, reserved, size, 0, 0);
    placeFinder(grid, reserved, size, size - 7, 0);
    placeFinder(grid, reserved, size, 0, size - 7);

    // Timing patterns
    for (var i = 8; i < size - 8; i++) {
      setMod(grid, reserved, size, 6, i, i % 2 === 0, true);
      setMod(grid, reserved, size, i, 6, i % 2 === 0, true);
    }

    // Alignment patterns (version >= 2)
    if (ALIGN[ver]) {
      var centers = ALIGN[ver];
      for (var i = 0; i < centers.length; i++) {
        for (var j = 0; j < centers.length; j++) {
          var cy = centers[i], cx = centers[j];
          // Skip if overlapping finder
          if (cy <= 8 && cx <= 8) continue;
          if (cy <= 8 && cx >= size - 8) continue;
          if (cy >= size - 8 && cx <= 8) continue;
          placeAlignment(grid, reserved, size, cx, cy);
        }
      }
    }

    // Dark module
    setMod(grid, reserved, size, 8, 4 * ver + 9, true, true);

    // Reserve format info areas
    for (var i = 0; i < 8; i++) {
      reserve(reserved, size, 8, i);
      reserve(reserved, size, i, 8);
      reserve(reserved, size, size - 1 - i, 8);
      reserve(reserved, size, 8, size - 1 - i);
    }
    reserve(reserved, size, 8, 8);

    // Place data
    var bits = data.bits;
    var bitIdx = 0;
    var upward = true;
    for (var right = size - 1; right >= 1; right -= 2) {
      if (right === 6) right = 5; // skip timing column
      for (var vert = 0; vert < size; vert++) {
        var y = upward ? size - 1 - vert : vert;
        for (var dx = 0; dx <= 1; dx++) {
          var x = right - dx;
          if (!reserved[y * size + x]) {
            var bit = bitIdx < bits.length ? bits[bitIdx] : 0;
            grid[y * size + x] = bit;
            bitIdx++;
          }
        }
      }
      upward = !upward;
    }

    // Apply best mask
    var bestMask = 0, bestPenalty = Infinity;
    for (var mask = 0; mask < 8; mask++) {
      var test = applyMask(grid, reserved, size, mask);
      placeFormatInfo(test, reserved, size, mask);
      var penalty = calcPenalty(test, size);
      if (penalty < bestPenalty) {
        bestPenalty = penalty;
        bestMask = mask;
      }
    }

    var result = applyMask(grid, reserved, size, bestMask);
    placeFormatInfo(result, reserved, size, bestMask);
    return result;
  }

  function encodeData(text) {
    // Try byte mode encoding
    var bytes = [];
    for (var i = 0; i < text.length; i++) {
      var c = text.charCodeAt(i);
      if (c > 255) { bytes.push(0xc0 | (c >> 6)); bytes.push(0x80 | (c & 0x3f)); }
      else bytes.push(c);
    }

    // Find smallest version that fits
    var ver, info;
    for (var v = 1; v <= 6; v++) {
      var key = v + '-M';
      if (!VERSIONS[key]) continue;
      info = VERSIONS[key];
      var dataCap = info[5];
      // Mode(4) + count(8 for v1-9) + data + terminator(4)
      var needed = Math.ceil((4 + 8 + bytes.length * 8 + 4) / 8);
      if (needed <= dataCap) { ver = v; break; }
    }
    if (!ver) { ver = 6; info = VERSIONS['6-M']; } // fallback

    var dataCap = info[5];
    var bits = [];

    // Byte mode indicator: 0100
    bits.push(0, 1, 0, 0);
    // Character count (8 bits for version 1-9)
    for (var i = 7; i >= 0; i--) bits.push((bytes.length >> i) & 1);
    // Data
    for (var i = 0; i < bytes.length; i++)
      for (var j = 7; j >= 0; j--) bits.push((bytes[i] >> j) & 1);
    // Terminator
    for (var i = 0; i < 4 && bits.length < dataCap * 8; i++) bits.push(0);
    // Pad to byte boundary
    while (bits.length % 8 !== 0) bits.push(0);
    // Pad codewords
    var padBytes = [0xec, 0x11], padIdx = 0;
    while (bits.length < dataCap * 8) {
      var pb = padBytes[padIdx % 2];
      for (var j = 7; j >= 0; j--) bits.push((pb >> j) & 1);
      padIdx++;
    }

    // Convert to codewords
    var codewords = [];
    for (var i = 0; i < bits.length; i += 8) {
      var val = 0;
      for (var j = 0; j < 8; j++) val = (val << 1) | (bits[i + j] || 0);
      codewords.push(val);
    }

    // RS error correction
    var ecLen = info[3];
    var numBlocks = info[4];
    var blockSize = Math.floor(codewords.length / numBlocks);

    var allData = [], allEC = [];
    for (var b = 0; b < numBlocks; b++) {
      var start = b * blockSize;
      var end = (b === numBlocks - 1) ? codewords.length : start + blockSize;
      var block = codewords.slice(start, end);
      allData.push(block);
      allEC.push(rsEncode(block, ecLen));
    }

    // Interleave data blocks
    var finalBits = [];
    var maxDataLen = 0;
    for (var b = 0; b < numBlocks; b++) if (allData[b].length > maxDataLen) maxDataLen = allData[b].length;
    for (var i = 0; i < maxDataLen; i++)
      for (var b = 0; b < numBlocks; b++)
        if (i < allData[b].length)
          for (var j = 7; j >= 0; j--) finalBits.push((allData[b][i] >> j) & 1);

    // Interleave EC blocks
    for (var i = 0; i < ecLen; i++)
      for (var b = 0; b < numBlocks; b++)
        for (var j = 7; j >= 0; j--) finalBits.push((allEC[b][i] >> j) & 1);

    return { bits: finalBits, version: ver };
  }

  function setMod(grid, reserved, size, x, y, val, res) {
    grid[y * size + x] = val ? 1 : 0;
    if (res) reserved[y * size + x] = true;
  }

  function reserve(reserved, size, x, y) {
    if (x >= 0 && x < size && y >= 0 && y < size) reserved[y * size + x] = true;
  }

  function placeFinder(grid, reserved, size, x, y) {
    for (var dy = -1; dy <= 7; dy++) {
      for (var dx = -1; dx <= 7; dx++) {
        var px = x + dx, py = y + dy;
        if (px < 0 || px >= size || py < 0 || py >= size) continue;
        var dark = (dy >= 0 && dy <= 6 && (dx === 0 || dx === 6)) ||
                   (dx >= 0 && dx <= 6 && (dy === 0 || dy === 6)) ||
                   (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4);
        setMod(grid, reserved, size, px, py, dark, true);
      }
    }
  }

  function placeAlignment(grid, reserved, size, cx, cy) {
    for (var dy = -2; dy <= 2; dy++) {
      for (var dx = -2; dx <= 2; dx++) {
        var dark = Math.abs(dx) === 2 || Math.abs(dy) === 2 || (dx === 0 && dy === 0);
        setMod(grid, reserved, size, cx + dx, cy + dy, dark, true);
      }
    }
  }

  // Format info bits for ECC level M (01), masks 0-7
  var FORMAT_BITS = [
    0x5412, 0x5125, 0x5E7C, 0x5B4B, 0x45F9, 0x40CE, 0x4F97, 0x4AA0
  ];

  function placeFormatInfo(grid, reserved, size, mask) {
    var bits = FORMAT_BITS[mask];
    // Around top-left finder
    var positions1 = [[8,0],[8,1],[8,2],[8,3],[8,4],[8,5],[8,7],[8,8],[7,8],[5,8],[4,8],[3,8],[2,8],[1,8],[0,8]];
    for (var i = 0; i < 15; i++) {
      var b = (bits >> (14 - i)) & 1;
      var p = positions1[i];
      grid[p[1] * size + p[0]] = b;
    }
    // Bottom-left and top-right
    for (var i = 0; i < 7; i++) {
      var b = (bits >> (14 - i)) & 1;
      grid[(size - 1 - i) * size + 8] = b;
    }
    for (var i = 7; i < 15; i++) {
      var b = (bits >> (14 - i)) & 1;
      grid[8 * size + (size - 15 + i)] = b;
    }
  }

  function maskFn(mask, x, y) {
    switch (mask) {
      case 0: return (x + y) % 2 === 0;
      case 1: return y % 2 === 0;
      case 2: return x % 3 === 0;
      case 3: return (x + y) % 3 === 0;
      case 4: return (Math.floor(y / 2) + Math.floor(x / 3)) % 2 === 0;
      case 5: return (x * y) % 2 + (x * y) % 3 === 0;
      case 6: return ((x * y) % 2 + (x * y) % 3) % 2 === 0;
      case 7: return ((x + y) % 2 + (x * y) % 3) % 2 === 0;
    }
  }

  function applyMask(grid, reserved, size, mask) {
    var result = grid.slice();
    for (var y = 0; y < size; y++)
      for (var x = 0; x < size; x++)
        if (!reserved[y * size + x] && maskFn(mask, x, y))
          result[y * size + x] ^= 1;
    return result;
  }

  function calcPenalty(grid, size) {
    var p = 0;
    // Rule 1: runs of same color
    for (var y = 0; y < size; y++) {
      var run = 1;
      for (var x = 1; x < size; x++) {
        if (grid[y * size + x] === grid[y * size + x - 1]) { run++; }
        else { if (run >= 5) p += run - 2; run = 1; }
      }
      if (run >= 5) p += run - 2;
    }
    for (var x = 0; x < size; x++) {
      var run = 1;
      for (var y = 1; y < size; y++) {
        if (grid[y * size + x] === grid[(y - 1) * size + x]) { run++; }
        else { if (run >= 5) p += run - 2; run = 1; }
      }
      if (run >= 5) p += run - 2;
    }
    // Rule 2: 2x2 blocks
    for (var y = 0; y < size - 1; y++)
      for (var x = 0; x < size - 1; x++) {
        var v = grid[y * size + x];
        if (v === grid[y * size + x + 1] && v === grid[(y + 1) * size + x] && v === grid[(y + 1) * size + x + 1])
          p += 3;
      }
    return p;
  }

  // Expose
  window.renderQRCode = function (canvasId, url) {
    var canvas = document.getElementById(canvasId);
    if (canvas) generateQR(canvas, url || 'https://janinc.no/SpisSlank/');
  };
})();
