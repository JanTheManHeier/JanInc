/**
 * Fluid Aurora Borealis & Basketball Seams — WebGL2 background.
 * Usage:
 *   <canvas id="aurora"></canvas>
 *   <script src="/assets/aurora-basketball-shader.js"></script>
 *   <script>const aurora = AuroraBasketball.mount('#aurora');</script>
 * Optional: AuroraBasketball.mount(canvas, { intensity: 1.15, pixelRatio: 1.5 }).
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
  uniform float uIntensity;
  out vec4 fragColor;

  #define PI 3.14159265359

  mat2 rot(float a) {
    float c = cos(a), s = sin(a);
    return mat2(c, -s, s, c);
  }

  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 345.45));
    p += dot(p, p + 34.345);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash21(i), hash21(i + vec2(1,0)), f.x),
               mix(hash21(i + vec2(0,1)), hash21(i + vec2(1)), f.x), f.y);
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = .5;
    mat2 turn = rot(.58);
    for (int i = 0; i < 6; i++) {
      value += noise(p) * amplitude;
      p = turn * p * 2.03 + vec2(13.7, 9.2);
      amplitude *= .5;
    }
    return value;
  }

  vec3 palette(float t) {
    vec3 orange = vec3(.961, .510, .169);
    vec3 cyan = vec3(.192, .804, .812);
    vec3 ice = vec3(.463, .733, 1.0);
    vec3 violet = vec3(.608, .318, .878);
    t = fract(t);
    if (t < .28) return mix(cyan, ice, t / .28);
    if (t < .62) return mix(ice, violet, (t - .28) / .34);
    return mix(violet, orange, (t - .62) / .38);
  }

  float seamCircle(vec2 p, vec2 center, float radius, float width) {
    float d = abs(length(p - center) - radius);
    return 1.0 - smoothstep(width, width + fwidth(d) * 1.5, d);
  }

  float ballSeams(vec2 p, vec2 center, float radius, float angle) {
    vec2 b = rot(angle) * (p - center);
    float mask = 1.0 - smoothstep(radius, radius + .025, length(b));
    float edge = seamCircle(b, vec2(0), radius, .012);
    float vertical = 1.0 - smoothstep(.012, .022, abs(b.x + .28 * sin(b.y * 3.2 / radius)));
    float horizontal = 1.0 - smoothstep(.012, .022, abs(b.y + .25 * sin(b.x * 3.0 / radius)));
    float arcA = seamCircle(b, vec2(radius * 1.02, 0), radius * 1.22, .014);
    float arcB = seamCircle(b, vec2(-radius * 1.02, 0), radius * 1.22, .014);
    return edge + mask * max(max(vertical, horizontal), max(arcA, arcB));
  }

  float starField(vec2 p) {
    vec2 id = floor(p * 85.0);
    vec2 gv = fract(p * 85.0) - .5;
    float h = hash21(id);
    float star = 1.0 - smoothstep(.018, .06, length(gv));
    return star * step(.965, h) * (.45 + .55 * sin(uTime * (1.0 + h * 3.0) + h * 20.0));
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution.xy;
    vec2 p = uv * 2.0 - 1.0;
    p.x *= uResolution.x / uResolution.y;
    vec2 mouse = uMouse * 2.0 - 1.0;
    mouse.x *= uResolution.x / uResolution.y;

    float t = uTime * .12;
    vec2 wind = (mouse - p) * .045;
    float mouseWake = exp(-length(p - mouse) * 1.4);
    p += wind * mouseWake * sin(uTime * 1.4 + p.y * 8.0);

    vec3 rayOrigin = vec3(0.0, 0.0, -3.1);
    vec3 rayDirection = normalize(vec3(p * vec2(.88, .72), 1.55));
    vec3 color = vec3(.012, .018, .029);
    float accumulated = 0.0;

    // Volumetric FBM curtain: layered slices produce a raymarched, folded aurora.
    for (int i = 0; i < 34; i++) {
      float depth = float(i) / 33.0;
      vec3 pos = rayOrigin + rayDirection * (1.1 + depth * 4.6);
      vec2 domain = vec2(pos.x * .72, pos.z * .29 + pos.y * .22);
      domain.x += t * (1.0 + depth);
      float warp = fbm(domain * 1.3 + vec2(t, -t * .7));
      float folds = sin(pos.x * 3.4 + warp * 6.5 - t * 7.0);
      folds += .6 * sin(pos.x * 7.1 - pos.z * .8 + warp * 3.0);
      float curtainY = .35 + .34 * folds + (mouse.x * .12);
      float ribbon = exp(-abs(pos.y - curtainY) * (5.5 + depth * 2.0));
      ribbon *= smoothstep(.08, .68, warp);
      ribbon *= (1.0 - accumulated) * .092;
      vec3 glow = palette(depth * .42 + warp * .45 + t * .2);
      color += glow * ribbon * (1.2 + mouseWake * .65) * uIntensity;
      accumulated += ribbon;
    }

    // Vertical ion rays and soft horizon bloom.
    float rays = pow(max(0.0, fbm(vec2(p.x * 3.0 + t, t)) - .45), 2.0);
    rays *= smoothstep(-.85, .7, p.y) * smoothstep(1.1, -.4, p.y);
    color += palette(p.x * .11 + t) * rays * 1.3 * uIntensity;
    color += vec3(.03, .12, .18) * exp(-abs(p.y + .58) * 5.0);

    // Three drifting, translucent basketball seam constellations.
    vec2 c1 = vec2(sin(t * 2.1) * .7 - .45, .20 + cos(t * 1.7) * .13);
    vec2 c2 = vec2(cos(t * 1.4) * 1.05 + .55, -.34 + sin(t * 1.9) * .09);
    vec2 c3 = vec2(sin(t) * .5, .72 + cos(t * 1.3) * .05);
    float seam1 = ballSeams(p, c1, .34, t * 1.8);
    float seam2 = ballSeams(p, c2, .48, -t * 1.2);
    float seam3 = ballSeams(p, c3, .18, t * 2.4);
    float seamPulse = .65 + .35 * sin(uTime * 2.3);
    color += vec3(.961, .510, .169) * seam1 * .64 * seamPulse;
    color += vec3(.463, .733, 1.0) * seam2 * .34;
    color += vec3(.608, .318, .878) * seam3 * .48;

    // Wind-driven electric filaments.
    float filament = abs(sin((p.y + fbm(p * 2.1 + t) * .34) * 21.0));
    filament = pow(1.0 - filament, 18.0);
    filament *= smoothstep(1.15, -.8, abs(p.x - mouse.x));
    color += palette(t + p.y * .16) * filament * .16 * (1.0 + mouseWake);

    float stars = starField(uv + vec2(t * .004, 0));
    color += vec3(.86, .93, 1.0) * stars * (1.0 - accumulated);
    color += hash21(gl_FragCoord.xy + uTime) * .012;

    float vignette = smoothstep(1.5, .28, length(p * vec2(.68, .9)));
    color *= .42 + .58 * vignette;
    color = color / (color + vec3(.72));
    color = pow(color, vec3(.82));
    fragColor = vec4(color, 1.0);
  }`;

  function compile(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const message = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw new Error(`Aurora Basketball shader compile error: ${message}`);
    }
    return shader;
  }

  function mount(target, options = {}) {
    const canvas = typeof target === 'string' ? document.querySelector(target) : target;
    if (!canvas) throw new Error('AuroraBasketball: canvas not found');
    const gl = canvas.getContext('webgl2', { antialias: false, alpha: options.alpha ?? false });
    if (!gl) throw new Error('AuroraBasketball requires WebGL2');

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
      time: gl.getUniformLocation(program, 'uTime'),
      intensity: gl.getUniformLocation(program, 'uIntensity')
    };
    const pointer = { x: .5, y: .5, tx: .5, ty: .5 };
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
      pointer.x += (pointer.tx - pointer.x) * .055;
      pointer.y += (pointer.ty - pointer.y) * .055;
      gl.viewport(0, 0, width, height);
      gl.useProgram(program);
      gl.uniform2f(uniforms.resolution, width, height);
      gl.uniform2f(uniforms.mouse, pointer.x, pointer.y);
      gl.uniform1f(uniforms.time, (now - started) * .001);
      gl.uniform1f(uniforms.intensity, options.intensity || 1);
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

  root.AuroraBasketball = { mount, vertexShader, fragmentShader };
})(window);
