import React, { useEffect, useRef } from 'react';

/**
 * CardShaderHover
 * Ultra-elegant WebGL Thermal Heatmap with 7 specialized scientific/artistic variants:
 * 0. Isothermal: Topographic contour lines & elevation relief
 * 1. Prismatic: Refractive optical dispersion & lens chromatic aberration
 * 2. Plasma: Coronal magnetic vortex & swirling plasma filaments
 * 3. Radar: Concentric telemetry sonar pulses & rotating radar sweep
 * 4. Convective: Atmospheric laminar flow & rising geothermal plume
 * 5. Infrared: FLIR industrial thermography, dual-pole sensor & raster grid
 * 6. Quantum: Cellular particulate dispersion & radiant dermal glow
 * 
 * Features:
 * - Mathematical SDF corner radius matching (0 border clip distortion)
 * - Analog film grain sensor noise
 * - Configurable anchor coordinates per card
 * - Runs ONLY on hover, 0% CPU/GPU overhead when idle
 */

const VARIANT_MAP = {
  isothermal: 0.0,
  prismatic: 1.0,
  plasma: 2.0,
  radar: 3.0,
  convective: 4.0,
  infrared: 5.0,
  quantum: 6.0,
};

export default function CardShaderHover({ 
  colorMode = 'thermal', 
  variant = 'isothermal',
  anchor = { x: 0.5, y: 0.5 },
  seed = 0.0,
  isHovered = false, 
  mousePos = { x: 0.5, y: 0.5 },
  borderRadius = 24 
}) {
  const canvasRef = useRef(null);

  const variantVal = typeof variant === 'number' ? variant : (VARIANT_MAP[variant] ?? 0.0);

  const stateRef = useRef({
    hover: 0,
    targetHover: 0,
    mouseX: 0.5,
    mouseY: 0.5,
    targetMouseX: 0.5,
    targetMouseY: 0.5,
    isRunning: false,
    isVisible: true,
    radius: borderRadius,
    variant: variantVal,
    anchorX: anchor?.x ?? 0.5,
    anchorY: anchor?.y ?? 0.5,
    seed: seed
  });

  // Exquisite thermal heatmap palettes calibrated for high contrast with white typography
  // Coherent palettes grounded in Solar Amber / Atmospheric Cyan aesthetic
  const PALETTES = {
    // 1. Solar Amber Horizon (Hero Sun: Deep Obsidian -> Midnight Sapphire -> Vermillion -> Radiant Amber -> Solar Gold)
    thermal: {
      c0: [0.02, 0.03, 0.07], // Deep nocturnal obsidian
      c1: [0.08, 0.12, 0.42], // Deep midnight cosmic navy
      c2: [0.60, 0.12, 0.22], // Deep crimson ember
      c3: [0.88, 0.28, 0.06], // Solar vermillion
      c4: [0.96, 0.62, 0.12], // Radiant amber
      c5: [1.00, 0.84, 0.45], // Solar gold core
    },
    // 2. Cosmic Atmospheric Cyan (Hero Atmosphere: Deep Obsidian -> Sapphire -> Deep Azure -> Electric Cyan -> Luminous Sky)
    cyber: {
      c0: [0.02, 0.03, 0.08], // Deep space obsidian
      c1: [0.04, 0.14, 0.48], // Deep sapphire
      c2: [0.06, 0.36, 0.70], // Oceanic azure
      c3: [0.12, 0.68, 0.90], // Electric cyan
      c4: [0.45, 0.84, 0.96], // Brilliant sky
      c5: [0.85, 0.95, 0.98], // Luminous ice highlight
    },
    // 3. Deep Astral Ultraviolet & Solar Corona (Nebula Violet -> Crimson Flame -> Radiant Amber -> Corona Gold)
    ultraviolet: {
      c0: [0.03, 0.02, 0.08],
      c1: [0.14, 0.06, 0.38],
      c2: [0.48, 0.12, 0.45],
      c3: [0.82, 0.24, 0.22],
      c4: [0.96, 0.64, 0.18],
      c5: [1.00, 0.88, 0.60],
    },
    // 4. Radiant Magma & Rose Gold (Basalt -> Plum -> Ruby -> Rose Vermillion -> Champagne Gold)
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

  const palette = PALETTES[colorMode] || PALETTES.thermal;

  // Detect touch / mobile devices where mouse hover is absent
  const isTouchDevice = typeof window !== 'undefined' && (
    'ontouchstart' in window || (navigator && navigator.maxTouchPoints > 0) || window.innerWidth < 1024
  );

  useEffect(() => {
    stateRef.current.radius = borderRadius;
  }, [borderRadius]);

  useEffect(() => {
    stateRef.current.variant = typeof variant === 'number' ? variant : (VARIANT_MAP[variant] ?? 0.0);
    stateRef.current.anchorX = anchor?.x ?? 0.5;
    stateRef.current.anchorY = anchor?.y ?? 0.5;
    stateRef.current.seed = seed;
  }, [variant, anchor?.x, anchor?.y, seed]);

  useEffect(() => {
    stateRef.current.isTouch = isTouchDevice;
    stateRef.current.targetHover = isHovered ? 1.0 : (isTouchDevice ? 0.68 : 0.0);
    if ((isHovered || isTouchDevice) && !stateRef.current.isRunning && stateRef.current.isVisible) {
      stateRef.current.isRunning = true;
      if (startLoopRef.current) startLoopRef.current();
    }
  }, [isHovered, isTouchDevice]);

  useEffect(() => {
    stateRef.current.targetMouseX = mousePos.x;
    stateRef.current.targetMouseY = 1.0 - mousePos.y; // WebGL inverted Y
  }, [mousePos]);

  const startLoopRef = useRef(null);

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
      uniform float u_variant;
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
        // Guarantees subpixel-perfect alignment with container's 24px border radius
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
          // -------------------------------------------------------------
          // VARIANT 0: ISOTHERMAL CONTOURS (Topographic Elevation Lines)
          // -------------------------------------------------------------
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
          // -------------------------------------------------------------
          // VARIANT 1: PRISMATIC OPTICAL (Lens Refraction / Chromatic Aberration)
          // -------------------------------------------------------------
          vec2 dOptic = uv - anchorUv;
          float rDist = length(dOptic);
          vec2 opticDir = (rDist > 0.001) ? (dOptic / rDist) : vec2(0.0);
          vec2 disp = opticDir * (0.035 + 0.015 * sin(t * 1.8));

          // Sample heat spectrum at R, G, B chromatic spatial offsets
          float dR = length(uv + disp + warp * 0.08 - anchorUv);
          float dG = length(uv + warp * 0.08 - anchorUv);
          float dB = length(uv - disp * 0.9 + warp * 0.08 - anchorUv);

          float tR = clamp(exp(-dR * 2.7) * 0.75 + exp(-length(uv + disp - mouseUv) * 3.6) * 0.6 + fbm(uv * 1.4) * 0.16, 0.0, 1.0);
          float tG = clamp(exp(-dG * 2.7) * 0.75 + exp(-length(uv - mouseUv) * 3.6) * 0.6 + fbm(uv * 1.4) * 0.16, 0.0, 1.0);
          float tB = clamp(exp(-dB * 2.7) * 0.75 + exp(-length(uv - disp * 0.9 - mouseUv) * 3.6) * 0.6 + fbm(uv * 1.4) * 0.16, 0.0, 1.0);

          vec3 colR = getThermalColor(tR, u_c0, u_c1, u_c2, u_c3, u_c4, u_c5);
          vec3 colG = getThermalColor(tG, u_c0, u_c1, u_c2, u_c3, u_c4, u_c5);
          vec3 colB = getThermalColor(tB, u_c0, u_c1, u_c2, u_c3, u_c4, u_c5);
          color = vec3(colR.r, colG.g, colB.b);

          // Specular lens flare ring around optical focal center
          float lensRing = smoothstep(0.035, 0.0, abs(rDist - (0.42 + 0.12 * sin(t * 0.9))));
          color += vec3(0.10, 0.22, 0.32) * lensRing * exp(-rDist * 1.4);
          temp = tG;

        } else if (u_variant < 2.5) {
          // -------------------------------------------------------------
          // VARIANT 2: CORONAL PLASMA VORTEX (Swirling Magnetic Spiral Arms)
          // -------------------------------------------------------------
          vec2 dVortex = uv - anchorUv;
          float r = length(dVortex);
          float theta = atan(dVortex.y, dVortex.x);
          float swirl = theta + (1.3 / (r + 0.30)) * sin(t * 0.7) + t * 0.65;
          vec2 twistedUv = anchorUv + vec2(cos(swirl), sin(swirl)) * r;
          vec2 warpVortex = vec2(fbm(twistedUv * 2.8 + vec2(t * 0.25)), fbm(twistedUv * 2.8 - vec2(t * 0.20) + vec2(5.1, 2.3)));

          float vortexHeat = exp(-r * 2.3) * 0.75 + fbm(twistedUv * 1.8 + warpVortex) * 0.30;
          temp = clamp(vortexHeat + mouseHeat + pinpointCore, 0.0, 1.0);
          color = getThermalColor(temp, u_c0, u_c1, u_c2, u_c3, u_c4, u_c5);

          // Twisted plasma filament spiral arms
          float filament = pow(abs(sin(swirl * 2.0 + r * 9.0 - t * 2.0)), 5.0);
          color += vec3(0.24, 0.16, 0.08) * filament * exp(-r * 2.2);

        } else if (u_variant < 3.5) {
          // -------------------------------------------------------------
          // VARIANT 3: RADAR TELEMETRY PULSE (Expanding Sonar Wavefronts)
          // -------------------------------------------------------------
          vec2 dRadar = uv - anchorUv;
          float d = length(dRadar);
          float angle = atan(dRadar.y, dRadar.x);

          // Expanding concentric sonar wavefronts
          float pulse = fract(d * 3.6 - t * 0.85);
          float sonarRing = smoothstep(0.10, 0.0, pulse) * exp(-d * 1.5);

          // Rotating telemetry radar beam sweep
          float sweepBeam = fract((angle + 3.14159) / 6.28318 + t * 0.40);
          sweepBeam = pow(sweepBeam, 10.0) * exp(-d * 1.6) * 0.45;

          float baseHeat = exp(-d * 2.5) * 0.65 + exp(-d * 1.2) * 0.20;
          temp = clamp(baseHeat + mouseHeat + pinpointCore + sonarRing * 0.25 + sweepBeam * 0.25, 0.0, 1.0);
          color = getThermalColor(temp, u_c0, u_c1, u_c2, u_c3, u_c4, u_c5);

          // High-tech reticle telemetry rings
          float reticle = smoothstep(0.018, 0.0, abs(fract(d * 4.2) - 0.5)) * exp(-d * 2.0);
          color += vec3(0.06, 0.20, 0.26) * (reticle + sweepBeam * 1.2);

        } else if (u_variant < 4.5) {
          // -------------------------------------------------------------
          // VARIANT 4: CONVECTIVE LAMINAR PLUME (Geothermal Rising Plume)
          // -------------------------------------------------------------
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

        } else if (u_variant < 5.5) {
          // -------------------------------------------------------------
          // VARIANT 5: FLIR INFRARED SENSOR (Dual-Pole Thermography & Sensor Grid)
          // -------------------------------------------------------------
          float dHot = length(uv + warp * 0.08 - anchorUv);
          vec2 coldSink = vec2(-anchorUv.x * 0.8, -anchorUv.y * 0.8);
          float dCold = length(uv + warp * 0.08 - coldSink);

          float hotSpot = exp(-dHot * 2.8) * 0.80;
          float coldZone = exp(-dCold * 2.4) * 0.30;
          float ambientFLIR = fbm(uv * 2.4 + vec2(t * 0.15)) * 0.22;

          temp = clamp(hotSpot - coldZone + mouseHeat + pinpointCore + ambientFLIR, 0.0, 1.0);
          color = getThermalColor(temp, u_c0, u_c1, u_c2, u_c3, u_c4, u_c5);

          // FLIR thermal boundary high-contrast gradient
          float eps = 0.016;
          float f0 = fbm(uv * 2.4 + vec2(t * 0.12));
          float fx = fbm((uv + vec2(eps, 0.0)) * 2.4 + vec2(t * 0.12));
          float fy = fbm((uv + vec2(0.0, eps)) * 2.4 + vec2(t * 0.12));
          float edgeGrad = length(vec2(fx - f0, fy - f0)) / eps;

          // Sensor scanlines raster
          float scanline = sin(gl_FragCoord.y * 1.8) * 0.03;
          color += scanline + vec3(0.06, 0.16, 0.20) * smoothstep(1.6, 3.4, edgeGrad);

        } else {
          // -------------------------------------------------------------
          // VARIANT 6: QUANTUM CELLULAR DISPERSION (Particulate Matrix & Dermal Glow)
          // -------------------------------------------------------------
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

    const uRes = gl.getUniformLocation(program, 'u_resolution');
    const uMouse = gl.getUniformLocation(program, 'u_mouse');
    const uAnchor = gl.getUniformLocation(program, 'u_anchor');
    const uTime = gl.getUniformLocation(program, 'u_time');
    const uHover = gl.getUniformLocation(program, 'u_hover');
    const uRadius = gl.getUniformLocation(program, 'u_radius');
    const uVariant = gl.getUniformLocation(program, 'u_variant');
    const uSeed = gl.getUniformLocation(program, 'u_seed');
    const uC0 = gl.getUniformLocation(program, 'u_c0');
    const uC1 = gl.getUniformLocation(program, 'u_c1');
    const uC2 = gl.getUniformLocation(program, 'u_c2');
    const uC3 = gl.getUniformLocation(program, 'u_c3');
    const uC4 = gl.getUniformLocation(program, 'u_c4');
    const uC5 = gl.getUniformLocation(program, 'u_c5');

    gl.uniform3fv(uC0, palette.c0);
    gl.uniform3fv(uC1, palette.c1);
    gl.uniform3fv(uC2, palette.c2);
    gl.uniform3fv(uC3, palette.c3);
    gl.uniform3fv(uC4, palette.c4);
    gl.uniform3fv(uC5, palette.c5);

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

        gl.uniform2f(uRes, canvas.width, canvas.height);
        gl.uniform2f(uMouse, state.mouseX, state.mouseY);
        gl.uniform2f(uAnchor, state.anchorX, 1.0 - state.anchorY);
        gl.uniform1f(uTime, elapsed);
        gl.uniform1f(uHover, state.hover);
        // Mathematical corner radius in physical device pixels
        gl.uniform1f(uRadius, state.radius * currentDpr);
        gl.uniform1f(uVariant, state.variant);
        gl.uniform1f(uSeed, state.seed);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
        animId = requestAnimationFrame(render);
      } else if (state.targetHover > 0.005) {
        // Still transitioning in
        animId = requestAnimationFrame(render);
      } else {
        // Idle: clear canvas and stop requesting frames (0% CPU/GPU overhead)
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

    const observer = new IntersectionObserver(([entry]) => {
      stateRef.current.isVisible = entry.isIntersecting;
      if (entry.isIntersecting && stateRef.current.targetHover > 0.005 && !stateRef.current.isRunning) {
        stateRef.current.isRunning = true;
        startLoop();
      }
    }, { threshold: 0.1 });
    observer.observe(canvas);

    const resizeObserver = new ResizeObserver(() => handleResize());
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
      observer.disconnect();
      startLoopRef.current = null;
      if (gl) {
        gl.deleteProgram(program);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
        gl.deleteBuffer(posBuf);
      }
    };
  }, [palette, borderRadius]);

  return (
    <canvas
      ref={canvasRef}
      style={{ 
        borderRadius: `${borderRadius}px`
      }}
      className="absolute inset-0 pointer-events-none z-0 w-full h-full rounded-[24px] overflow-hidden mix-blend-screen opacity-85 transition-opacity duration-300"
    />
  );
}
