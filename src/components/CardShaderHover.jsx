import React, { useEffect, useRef } from 'react';

/**
 * CardShaderHover
 * Ultra-elegant WebGL Thermal Heatmap with the 3 curated scientific variants:
 * 0. Isothermal: Topographic elevation contour lines & organic relief (Casa Italia)
 * 1. Convective: Smooth atmospheric laminar flow & rising fluid plumes (Français Pro)
 * 2. Quantum: Cellular particulate matrix & radiant dermal glow (Pure Esthétique)
 * 
 * Features:
 * - Mathematical SDF corner radius matching (0 border clip distortion)
 * - Analog film grain sensor noise
 * - Configurable anchor coordinates per card
 * - Runs ONLY on hover, 0% CPU/GPU overhead when idle
 * - ZERO re-renders on mouse move: native event tracking directly to GPU uniforms
 * - Single-pass WebGL context: no context recreation or flashing on hover
 */

const VARIANT_MAP = {
  isothermal: 0.0,
  convective: 1.0,
  quantum: 2.0,
  // Backwards-compatible aliases
  prismatic: 1.0,
  plasma: 0.0,
  radar: 0.0,
  infrared: 1.0,
};

// Module-level palettes (static, never recreated on render)
const PALETTES = {
  // 1. Solar Amber Horizon (Casa Italia, Français Pro)
  thermal: {
    c0: [0.02, 0.03, 0.07], // Deep nocturnal obsidian
    c1: [0.08, 0.12, 0.42], // Deep midnight cosmic navy
    c2: [0.60, 0.12, 0.22], // Deep crimson ember
    c3: [0.88, 0.28, 0.06], // Solar vermillion
    c4: [0.96, 0.62, 0.12], // Radiant amber
    c5: [1.00, 0.84, 0.45], // Solar gold core
  },
  // 2. Cosmic Atmospheric Cyan (Ottica Milano, Bazarum, FinCore DS)
  cyber: {
    c0: [0.02, 0.03, 0.08], // Deep space obsidian
    c1: [0.04, 0.14, 0.48], // Deep sapphire
    c2: [0.06, 0.36, 0.70], // Oceanic azure
    c3: [0.12, 0.68, 0.90], // Electric cyan
    c4: [0.45, 0.84, 0.96], // Brilliant sky
    c5: [0.85, 0.95, 0.98], // Luminous ice highlight
  },
  // 3. Deep Astral Ultraviolet & Solar Corona (Astraea)
  ultraviolet: {
    c0: [0.03, 0.02, 0.08],
    c1: [0.14, 0.06, 0.38],
    c2: [0.48, 0.12, 0.45],
    c3: [0.82, 0.24, 0.22],
    c4: [0.96, 0.64, 0.18],
    c5: [1.00, 0.88, 0.60],
  },
  // 4. Radiant Magma & Rose Gold (Pure Esthétique)
  magma: {
    c0: [0.03, 0.02, 0.06],
    c1: [0.18, 0.06, 0.24],
    c2: [0.62, 0.14, 0.28],
    c3: [0.92, 0.32, 0.20],
    c4: [0.98, 0.68, 0.26],
    c5: [1.00, 0.90, 0.65],
  },
  cobalt: {
    c0: [0.02, 0.03, 0.08],
    c1: [0.04, 0.14, 0.48],
    c2: [0.06, 0.36, 0.70],
    c3: [0.12, 0.68, 0.90],
    c4: [0.45, 0.84, 0.96],
    c5: [0.85, 0.95, 0.98],
  }
};

export default function CardShaderHover({ 
  colorMode = 'thermal', 
  variant = 'isothermal',
  anchor = { x: 0.5, y: 0.5 },
  seed = 0.0,
  isHovered = false, 
  borderRadius = 24 
}) {
  const canvasRef = useRef(null);
  const glRef = useRef(null);
  const uniformsRef = useRef(null);
  const startLoopRef = useRef(null);

  const variantVal = typeof variant === 'number' ? variant : (VARIANT_MAP[variant] ?? 0.0);

  // Detect touch / mobile devices where mouse hover is absent
  const isTouchDevice = typeof window !== 'undefined' && (
    'ontouchstart' in window || (navigator && navigator.maxTouchPoints > 0) || window.innerWidth < 1024
  );

  const stateRef = useRef({
    hover: 0,
    targetHover: 0,
    mouseX: 0.5,
    mouseY: 0.5,
    targetMouseX: 0.5,
    targetMouseY: 0.5,
    isRunning: false,
    isVisible: true,
    isTouch: isTouchDevice,
    radius: borderRadius,
    variant: variantVal,
    anchorX: anchor?.x ?? 0.5,
    anchorY: anchor?.y ?? 0.5,
    seed: seed
  });

  // Keep state in sync without re-creating WebGL program
  useEffect(() => {
    stateRef.current.radius = borderRadius;
  }, [borderRadius]);

  useEffect(() => {
    stateRef.current.variant = typeof variant === 'number' ? variant : (VARIANT_MAP[variant] ?? 0.0);
    stateRef.current.anchorX = anchor?.x ?? 0.5;
    stateRef.current.anchorY = anchor?.y ?? 0.5;
    stateRef.current.seed = seed;
  }, [variant, anchor?.x, anchor?.y, seed]);

  // Update palette uniform vectors without recompiling shaders
  useEffect(() => {
    const gl = glRef.current;
    const u = uniformsRef.current;
    if (gl && u) {
      const pal = PALETTES[colorMode] || PALETTES.thermal;
      gl.uniform3fv(u.uC0, pal.c0);
      gl.uniform3fv(u.uC1, pal.c1);
      gl.uniform3fv(u.uC2, pal.c2);
      gl.uniform3fv(u.uC3, pal.c3);
      gl.uniform3fv(u.uC4, pal.c4);
      gl.uniform3fv(u.uC5, pal.c5);
    }
  }, [colorMode]);

  // Handle external hover change
  useEffect(() => {
    stateRef.current.isTouch = isTouchDevice;
    stateRef.current.targetHover = isHovered ? 1.0 : (isTouchDevice ? 0.68 : 0.0);
    if ((isHovered || isTouchDevice) && !stateRef.current.isRunning && stateRef.current.isVisible) {
      stateRef.current.isRunning = true;
      if (startLoopRef.current) startLoopRef.current();
    }
  }, [isHovered, isTouchDevice]);

  // Main WebGL Lifecycle — runs ONCE on mount, NEVER recreates shaders on hover
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', {
      alpha: true,
      antialias: true,
      powerPreference: 'low-power',
      premultipliedAlpha: false
    }) || canvas.getContext('experimental-webgl');

    if (!gl) return;
    glRef.current = gl;

    const vsSource = `
      attribute vec2 a_position;
      varying vec2 v_uv;
      void main() {
        v_uv = (a_position + 1.0) * 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fsSource = `
      precision highp float;
      varying vec2 v_uv;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      uniform vec2 u_anchor;
      uniform float u_time;
      uniform float u_hover;
      uniform float u_radius;
      uniform float u_variant; // 0.0: isothermal, 1.0: convective, 2.0: quantum
      uniform float u_seed;
      uniform vec3 u_c0;
      uniform vec3 u_c1;
      uniform vec3 u_c2;
      uniform vec3 u_c3;
      uniform vec3 u_c4;
      uniform vec3 u_c5;

      // Mathematical Rounded Box Signed Distance Field
      float roundedBoxSDF(vec2 p, vec2 b, float r) {
        vec2 q = abs(p) - b + vec2(r);
        return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
      }

      // Fast Simplex 2D
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy));
        vec2 x0 = v - i + dot(i, C.xx);
        vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m; m = m*m;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
        vec3 g;
        g.x  = a0.x * x0.x + h.x * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
        for (int i = 0; i < 3; ++i) {
          v += a * snoise(p);
          p = rot * p * 2.1 + vec2(12.0);
          a *= 0.5;
        }
        return v;
      }

      // Smooth 5-stop thermal spectral color transfer function
      vec3 getThermalColor(float t, vec3 c0, vec3 c1, vec3 c2, vec3 c3, vec3 c4, vec3 c5) {
        if (t < 0.20) {
          float f = t / 0.20;
          return mix(c0, c1, smoothstep(0.0, 1.0, f));
        } else if (t < 0.45) {
          float f = (t - 0.20) / 0.25;
          return mix(c1, c2, smoothstep(0.0, 1.0, f));
        } else if (t < 0.70) {
          float f = (t - 0.45) / 0.25;
          return mix(c2, c3, smoothstep(0.0, 1.0, f));
        } else if (t < 0.88) {
          float f = (t - 0.70) / 0.18;
          return mix(c3, c4, smoothstep(0.0, 1.0, f));
        } else {
          float f = clamp((t - 0.88) / 0.12, 0.0, 1.0);
          return mix(c4, c5, smoothstep(0.0, 1.0, f));
        }
      }

      void main() {
        if (u_hover < 0.005) {
          gl_FragColor = vec4(0.0);
          return;
        }

        // 1. Mathematical Rounded Corner SDF Mask
        vec2 centerPos = gl_FragCoord.xy - u_resolution.xy * 0.5;
        float distToBox = roundedBoxSDF(centerPos, u_resolution.xy * 0.5, u_radius);
        float cornerAlpha = clamp(1.0 - smoothstep(-0.75, 0.75, distToBox), 0.0, 1.0);
        if (cornerAlpha <= 0.001) {
          discard;
        }

        // 2. Aspect-corrected UV Coordinates
        vec2 st = gl_FragCoord.xy / u_resolution.xy;
        float aspect = u_resolution.x / u_resolution.y;
        vec2 uv = vec2((st.x - 0.5) * aspect, st.y - 0.5);
        vec2 mouseUv = vec2((u_mouse.x - 0.5) * aspect, u_mouse.y - 0.5);
        vec2 anchorUv = vec2((u_anchor.x - 0.5) * aspect, u_anchor.y - 0.5);

        float t = (u_time + u_seed) * 0.32;

        // Fluid convection warp field
        vec2 warp = vec2(
          fbm(uv * 2.2 + vec2(t * 0.24, -t * 0.16)),
          fbm(uv * 2.2 + vec2(-t * 0.18, t * 0.28) + vec2(4.2, 7.8))
        );

        // Dynamic Interactive Mouse Heat Emitter
        float dMouse = length(uv + warp * 0.10 - mouseUv);
        float mouseHeat = exp(-dMouse * 3.8) * 0.65 + exp(-dMouse * 1.8) * 0.20;
        float pinpointCore = exp(-dMouse * 8.5) * 0.30;

        vec3 color = vec3(0.0);
        float temp = 0.0;

        if (u_variant < 0.5) {
          // =============================================================
          // VARIANT 0: ISOTHERMAL CONTOURS (Topographic Elevation Lines)
          // As featured on Casa Italia
          // =============================================================
          float dAnchor = length(uv + warp * 0.12 - anchorUv);
          float anchorHeat = exp(-dAnchor * 2.6) * 0.72 + exp(-dAnchor * 1.3) * 0.24;
          float ambient = fbm(uv * 1.5 + warp * 0.35 + vec2(t * 0.10)) * 0.18;
          temp = clamp(anchorHeat + mouseHeat + pinpointCore + ambient, 0.0, 1.0);

          color = getThermalColor(temp, u_c0, u_c1, u_c2, u_c3, u_c4, u_c5);

          // Precision Topographic Contour Bands
          float contourWave = fract(temp * 7.5);
          float contour = smoothstep(0.06, 0.0, abs(contourWave - 0.5));
          float subContour = smoothstep(0.03, 0.0, abs(fract(temp * 15.0) - 0.5)) * 0.5;
          float contourMask = smoothstep(0.15, 0.40, temp) * smoothstep(0.95, 0.70, temp);
          color += vec3(0.18, 0.14, 0.08) * (contour + subContour) * contourMask;

        } else if (u_variant < 1.5) {
          // =============================================================
          // VARIANT 1: CONVECTIVE LAMINAR (Atmospheric Fluid Convection & Rising Plume)
          // As featured on Français Pro
          // =============================================================
          float xDist = uv.x - anchorUv.x;
          float yDist = uv.y - anchorUv.y;
          // Ascending buoyant thermal plume
          float plume = exp(-abs(xDist) * 3.5) * smoothstep(-0.25, 0.85, yDist);

          // Laminar wavy convection currents
          float wave1 = sin(uv.x * 4.8 + t * 1.0 + fbm(uv * 2.2) * 1.6);
          float wave2 = cos(uv.x * 3.0 - t * 0.7 + uv.y * 3.8);
          float laminar = (wave1 * 0.5 + 0.5) * (wave2 * 0.5 + 0.5) * exp(-abs(uv.y) * 1.3);

          temp = clamp(plume * 0.55 + laminar * 0.35 + mouseHeat + pinpointCore + fbm(uv * 1.6 + vec2(0.0, -t * 0.35)) * 0.18, 0.0, 1.0);
          color = getThermalColor(temp, u_c0, u_c1, u_c2, u_c3, u_c4, u_c5);

          // Soft convection eddy wisps
          color += vec3(0.14, 0.10, 0.05) * smoothstep(0.60, 0.85, laminar);

        } else {
          // =============================================================
          // VARIANT 2: QUANTUM PARTICULATE (Cellular Particulate Matrix & Radiant Glow)
          // As featured on Pure Esthétique
          // =============================================================
          vec2 dQ = uv - anchorUv;
          float rQ = length(dQ);

          vec2 cellCoord = uv * 12.0 + vec2(t * 0.18, -t * 0.12);
          vec2 cellFrac = fract(cellCoord) - 0.5;
          float cellDist = length(cellFrac);
          float sparkRand = fract(sin(dot(floor(cellCoord), vec2(17.13, 43.71))) * 43758.54);
          float cellSpark = smoothstep(0.42, 0.0, cellDist) * (0.5 + 0.5 * sin(sparkRand * 6.28 + t * 2.8));

          float dermalBreathe = sin(rQ * 11.0 - t * 2.2) * 0.5 + 0.5;
          float baseHeat = exp(-rQ * 2.5) * 0.70 + fbm(uv * 1.8 + vec2(t * 0.14)) * 0.20;

          temp = clamp(baseHeat + mouseHeat + pinpointCore + cellSpark * 0.16 * exp(-rQ * 1.8), 0.0, 1.0);
          color = getThermalColor(temp, u_c0, u_c1, u_c2, u_c3, u_c4, u_c5);

          color += vec3(0.20, 0.14, 0.06) * cellSpark * exp(-rQ * 1.6) + vec3(0.08) * dermalBreathe * exp(-rQ * 2.2);
        }

        // Analog Film Grain / Sensor Noise
        float grain = fract(sin(dot(gl_FragCoord.xy + fract(u_time * 2.0), vec2(12.9898, 78.233))) * 43758.5453);
        color += (grain - 0.5) * 0.055;

        // Specular Caustic at Cursor Center
        float cursorGlow = exp(-length(uv - mouseUv) * 4.2) * 0.22;
        color += vec3(cursorGlow);

        // Final Subpixel Masked Alpha
        float alpha = u_hover * 0.82 * cornerAlpha;
        gl_FragColor = vec4(color, alpha);
      }
    `;

    function createShader(type, source) {
      const s = gl.createShader(type);
      gl.shaderSource(s, source);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.warn(gl.getShaderInfoLog(s));
        gl.deleteShader(s);
        return null;
      }
      return s;
    }

    const vs = createShader(gl.VERTEX_SHADER, vsSource);
    const fs = createShader(gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn(gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    const posBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );
    const aPos = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uniforms = {
      uRes: gl.getUniformLocation(program, 'u_resolution'),
      uMouse: gl.getUniformLocation(program, 'u_mouse'),
      uAnchor: gl.getUniformLocation(program, 'u_anchor'),
      uTime: gl.getUniformLocation(program, 'u_time'),
      uHover: gl.getUniformLocation(program, 'u_hover'),
      uRadius: gl.getUniformLocation(program, 'u_radius'),
      uVariant: gl.getUniformLocation(program, 'u_variant'),
      uSeed: gl.getUniformLocation(program, 'u_seed'),
      uC0: gl.getUniformLocation(program, 'u_c0'),
      uC1: gl.getUniformLocation(program, 'u_c1'),
      uC2: gl.getUniformLocation(program, 'u_c2'),
      uC3: gl.getUniformLocation(program, 'u_c3'),
      uC4: gl.getUniformLocation(program, 'u_c4'),
      uC5: gl.getUniformLocation(program, 'u_c5'),
    };
    uniformsRef.current = uniforms;

    // Initialize palette
    const initialPal = PALETTES[colorMode] || PALETTES.thermal;
    gl.uniform3fv(uniforms.uC0, initialPal.c0);
    gl.uniform3fv(uniforms.uC1, initialPal.c1);
    gl.uniform3fv(uniforms.uC2, initialPal.c2);
    gl.uniform3fv(uniforms.uC3, initialPal.c3);
    gl.uniform3fv(uniforms.uC4, initialPal.c4);
    gl.uniform3fv(uniforms.uC5, initialPal.c5);

    let animId = null;
    let startTime = performance.now();
    let currentDpr = 1.0;

    const handleResize = () => {
      const parent = canvas.parentElement;
      const rect = parent ? parent.getBoundingClientRect() : { width: 400, height: 300 };
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      currentDpr = dpr;
      const w = Math.floor(rect.width * dpr);
      const h = Math.floor(rect.height * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;
        gl.viewport(0, 0, w, h);
      }
    };
    handleResize();

    const render = (now) => {
      const state = stateRef.current;

      // Natural fluid ambient convection orbit for mobile / touch devices without mouse
      if (state.isTouch && !isHovered) {
        const elapsed = (now - startTime) * 0.001;
        state.targetMouseX = 0.5 + Math.sin(elapsed * 0.75) * 0.25;
        state.targetMouseY = 0.5 + Math.cos(elapsed * 0.55) * 0.22;
      }

      // Smooth hover lerp
      state.hover += (state.targetHover - state.hover) * 0.12;
      state.mouseX += (state.targetMouseX - state.mouseX) * 0.12;
      state.mouseY += (state.targetMouseY - state.mouseY) * 0.12;

      // Only draw when visible and hover is active
      if (state.hover > 0.005 && state.isVisible) {
        const elapsed = (now - startTime) * 0.001;
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.uniform2f(uniforms.uRes, canvas.width, canvas.height);
        gl.uniform2f(uniforms.uMouse, state.mouseX, state.mouseY);
        gl.uniform2f(uniforms.uAnchor, state.anchorX, 1.0 - state.anchorY);
        gl.uniform1f(uniforms.uTime, elapsed);
        gl.uniform1f(uniforms.uHover, state.hover);
        gl.uniform1f(uniforms.uRadius, state.radius * currentDpr);
        gl.uniform1f(uniforms.uVariant, state.variant);
        gl.uniform1f(uniforms.uSeed, state.seed);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
        animId = requestAnimationFrame(render);
      } else if (state.targetHover > 0.005) {
        // Still transitioning in
        animId = requestAnimationFrame(render);
      } else {
        // Idle: clear canvas once and stop requesting frames (0% CPU/GPU overhead)
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        state.isRunning = false;
        animId = null;
      }
    };

    const startLoop = () => {
      if (!animId) {
        animId = requestAnimationFrame(render);
      }
    };
    startLoopRef.current = startLoop;

    if (isHovered || isTouchDevice) {
      stateRef.current.isRunning = true;
      startLoop();
    }

    // Direct native DOM mousemove tracking on parent container (0 React re-renders)
    const parent = canvas.parentElement;
    const handleNativeMouseMove = (e) => {
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        stateRef.current.targetMouseX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        stateRef.current.targetMouseY = 1.0 - Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
      }
    };

    if (parent) {
      parent.addEventListener('mousemove', handleNativeMouseMove, { passive: true });
    }

    const observer = new IntersectionObserver(([entry]) => {
      stateRef.current.isVisible = entry.isIntersecting;
      if (entry.isIntersecting && stateRef.current.targetHover > 0.005 && !stateRef.current.isRunning) {
        stateRef.current.isRunning = true;
        startLoop();
      }
    }, { threshold: 0.1 });
    observer.observe(canvas);

    const resizeObserver = new ResizeObserver(() => handleResize());
    if (parent) {
      resizeObserver.observe(parent);
    }
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      if (parent) {
        parent.removeEventListener('mousemove', handleNativeMouseMove);
        resizeObserver.disconnect();
      }
      observer.disconnect();
      startLoopRef.current = null;
      if (gl) {
        gl.deleteProgram(program);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
        gl.deleteBuffer(posBuf);
      }
      glRef.current = null;
      uniformsRef.current = null;
    };
  }, [borderRadius]);

  return (
    <canvas
      ref={canvasRef}
      style={{ 
        borderRadius: `${borderRadius}px`
      }}
      className="absolute inset-0 pointer-events-none z-0 w-full h-full rounded-[24px] overflow-hidden mix-blend-screen opacity-90"
    />
  );
}
