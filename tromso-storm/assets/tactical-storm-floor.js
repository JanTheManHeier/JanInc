/**
 * Tactical Storm Floor — WebGL2 background.
 * Usage:
 *   <canvas id="storm-floor"></canvas>
 *   <script src="/assets/tactical-storm-floor.js"></script>
 *   <script>const floor = TacticalStormFloor.mount('#storm-floor');</script>
 * Call floor.destroy() when the canvas is removed.
 */
(function (root) {
  'use strict';

  const vertexShader = `#version 300 es
  in vec2 aPosition;
  void main() { gl_Position = vec4(aPosition, 0.0, 1.0); }`;

  const fragmentShader = `#version 300 es
  precision highp float;

  uniform vec2 uResolution;
  uniform vec2 uMouse;
  uniform float uTime;
  out vec4 fragColor;

  #define PI 3.14159265359

  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash21(i), hash21(i + vec2(1,0)), f.x),
               mix(hash21(i + vec2(0,1)), hash21(i + vec2(1)), f.x), f.y);
  }

  float line(float d, float width) {
    return 1.0 - smoothstep(width, width + fwidth(d) * 1.7, abs(d));
  }

  float segment(vec2 p, vec2 a, vec2 b) {
    vec2 pa = p - a, ba = b - a;
    float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    return length(pa - ba * h);
  }

  float courtMarkings(vec2 p) {
    float ink = 0.0;
    ink = max(ink, line(abs(p.x) - 5.15, .035));
    ink = max(ink, line(abs(p.y) - 8.75, .035));
    ink = max(ink, line(p.y, .03));
    ink = max(ink, line(length(p) - 1.8, .035));

    vec2 hoop = vec2(0.0, 7.15);
    ink = max(ink, line(length(p - hoop) - .24, .035));
    ink = max(ink, line(segment(p, vec2(-.9, 8.75), vec2(-.9, 4.95)), .035));
    ink = max(ink, line(segment(p, vec2(.9, 8.75), vec2(.9, 4.95)), .035));
    ink = max(ink, line(segment(p, vec2(-.9, 4.95), vec2(.9, 4.95)), .035));
    ink = max(ink, line(length(p - vec2(0, 4.95)) - 1.8, .04) * step(4.95, p.y));
    ink = max(ink, line(length(p - hoop) - 6.75, .045) * step(0.0, 7.15 - p.y));

    vec2 hoop2 = -hoop;
    ink = max(ink, line(length(p - hoop2) - .24, .035));
    ink = max(ink, line(segment(p, vec2(-.9,-8.75), vec2(-.9,-4.95)), .035));
    ink = max(ink, line(segment(p, vec2(.9,-8.75), vec2(.9,-4.95)), .035));
    ink = max(ink, line(segment(p, vec2(-.9,-4.95), vec2(.9,-4.95)), .035));
    ink = max(ink, line(length(p - vec2(0,-4.95)) - 1.8, .04) * step(p.y, -4.95));
    return ink;
  }

  vec3 auroraPalette(float x) {
    vec3 cyan = vec3(.192, .804, .812);
    vec3 ice = vec3(.463, .733, 1.0);
    vec3 violet = vec3(.608, .318, .878);
    return x < .5 ? mix(cyan, ice, x * 2.0) : mix(ice, violet, (x - .5) * 2.0);
  }

  void main() {
    vec2 q = gl_FragCoord.xy / uResolution.xy;
    vec2 ndc = q * 2.0 - 1.0;
    ndc.x *= uResolution.x / uResolution.y;

    // Camera ray intersecting an infinite hardwood plane.
    vec3 ro = vec3(0.0, 5.1, -10.5);
    vec3 target = vec3(0.0, 0.0, 2.0);
    vec3 forward = normalize(target - ro);
    vec3 right = normalize(cross(forward, vec3(0,1,0)));
    vec3 up = cross(right, forward);
    vec3 rd = normalize(forward + right * ndc.x * .72 + up * ndc.y * .72);
    float hit = -ro.y / rd.y;
    vec3 world = ro + rd * hit;
    vec2 p = world.xz;
    float visible = step(0.0, hit);

    // Long northern hardwood planks with subtle wet-storm reflectivity.
    float plank = floor((p.x + 40.0) / .42);
    float grain = noise(vec2(p.x * 2.4, p.y * .28));
    grain += .45 * noise(vec2(p.x * 7.0 + plank, p.y * .9));
    float boardGap = 1.0 - smoothstep(.015, .032, abs(fract((p.x + 40.0) / .42) - .5));
    float crossGap = 1.0 - smoothstep(.012, .025, abs(fract((p.y + mod(plank, 4.0) * 1.37) / 2.74) - .5));
    vec3 wood = mix(vec3(.038, .048, .063), vec3(.095, .117, .148), grain * .58);
    wood *= .78 + .22 * boardGap;
    wood *= .92 + .08 * crossGap;

    float markings = courtMarkings(p);
    float pulse = .72 + .28 * sin(uTime * 2.2 + p.y * .8);
    vec3 neon = mix(vec3(.96, .98, 1.0), vec3(.463, .733, 1.0), .45 + .35 * pulse);
    float lineGlow = courtMarkings(p + vec2(sin(uTime + p.y) * .015, 0.0));

    // Pointer spotlight is projected into the same court plane.
    vec2 mouseNdc = uMouse * 2.0 - 1.0;
    mouseNdc.x *= uResolution.x / uResolution.y;
    vec3 mouseRay = normalize(forward + right * mouseNdc.x * .72 + up * mouseNdc.y * .72);
    float mouseHit = -ro.y / mouseRay.y;
    vec2 mouseP = (ro + mouseRay * mouseHit).xz;
    float spotDist = length((p - mouseP) * vec2(1.0, .68));
    float spotlight = exp(-spotDist * .42) * step(0.0, mouseHit);

    // Concentric electrical shockwaves and branching tactical energy.
    float waveRadius = mod(uTime * 2.7, 12.0);
    float ripple = exp(-abs(spotDist - waveRadius) * 5.0) * exp(-waveRadius * .09);
    ripple += .55 * exp(-abs(spotDist - mod(uTime * 2.7 + 4.0, 12.0)) * 7.0);
    float electric = pow(max(0.0, sin(p.x * 2.2 + noise(p * .8 + uTime) * 5.0)), 22.0);
    electric *= exp(-abs(p.y - mouseP.y) * .19) * spotlight;

    float tacticalGrid = line(fract(p.x * .5) - .5, .008) + line(fract(p.y * .5) - .5, .008);
    tacticalGrid *= .05 + .12 * spotlight;

    vec3 color = wood;
    color += neon * markings * (1.25 + pulse * .45);
    color += vec3(.20, .70, 1.0) * lineGlow * .18;
    color += auroraPalette(fract(spotDist * .12 - uTime * .08)) * spotlight * .28;
    color += vec3(.19, .80, .81) * ripple * .75;
    color += vec3(.96, .51, .17) * electric * .8;
    color += vec3(.46, .73, 1.0) * tacticalGrid;

    // Horizon haze, back-wall storm and cinematic vignette.
    float horizon = pow(1.0 - max(0.0, -rd.y), 8.0);
    color += vec3(.08, .17, .25) * horizon * .9;
    float vignette = smoothstep(1.32, .25, length(ndc * vec2(.72, .86)));
    color *= (.24 + .76 * vignette) * visible;
    color += hash21(gl_FragCoord.xy + uTime) * .018;
    color = color / (color + vec3(.86));
    color = pow(color, vec3(.88));
    fragColor = vec4(color, 1.0);
  }`;

  function compile(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const message = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw new Error(`Tactical Storm shader compile error: ${message}`);
    }
    return shader;
  }

  function mount(target, options = {}) {
    const canvas = typeof target === 'string' ? document.querySelector(target) : target;
    if (!canvas) throw new Error('TacticalStormFloor: canvas not found');
    const gl = canvas.getContext('webgl2', { antialias: false, alpha: options.alpha ?? false });
    if (!gl) throw new Error('TacticalStormFloor requires WebGL2');

    const program = gl.createProgram();
    gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, vertexShader));
    gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, fragmentShader));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const uniforms = {
      resolution: gl.getUniformLocation(program, 'uResolution'),
      mouse: gl.getUniformLocation(program, 'uMouse'),
      time: gl.getUniformLocation(program, 'uTime')
    };
    const pointer = { x: .5, y: .55, tx: .5, ty: .55 };
    const onPointer = (event) => {
      const rect = canvas.getBoundingClientRect();
      pointer.tx = (event.clientX - rect.left) / rect.width;
      pointer.ty = 1 - (event.clientY - rect.top) / rect.height;
    };
    canvas.addEventListener('pointermove', onPointer, { passive: true });

    let frame = 0;
    let alive = true;
    const started = performance.now();
    const render = (now) => {
      if (!alive) return;
      const dpr = Math.min(options.pixelRatio || devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const height = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      pointer.x += (pointer.tx - pointer.x) * .075;
      pointer.y += (pointer.ty - pointer.y) * .075;
      gl.viewport(0, 0, width, height);
      gl.useProgram(program);
      gl.uniform2f(uniforms.resolution, width, height);
      gl.uniform2f(uniforms.mouse, pointer.x, pointer.y);
      gl.uniform1f(uniforms.time, (now - started) * .001);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      frame = requestAnimationFrame(render);
    };
    frame = requestAnimationFrame(render);

    return {
      canvas,
      destroy() {
        alive = false;
        cancelAnimationFrame(frame);
        canvas.removeEventListener('pointermove', onPointer);
        gl.deleteBuffer(buffer);
        gl.deleteProgram(program);
      }
    };
  }

  root.TacticalStormFloor = { mount, vertexShader, fragmentShader };
})(window);
