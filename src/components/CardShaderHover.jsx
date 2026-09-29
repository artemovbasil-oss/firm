import React, { useEffect, useRef } from 'react';

/**
 * CardShaderHover
 * Ultra-elegant WebGL Thermal Heatmap with analog film grain,
 * dynamic fluid convection, and mathematical SDF corner radius matching.
 * Tuned for rich chromatic saturation and high-contrast typography readability.
 * Runs ONLY on hover, 0% CPU/GPU when idle.
 */
export default function CardShaderHover({ 
  colorMode = 'thermal', 
  isHovered = false, 
  mousePos = { x: 0.5, y: 0.5 },
  borderRadius = 24 
}) {
  const canvasRef = useRef(null);
  const stateRef = useRef({
    hover: 0,
    targetHover: 0,
    mouseX: 0.5,
    mouseY: 0.5,
    targetMouseX: 0.5,
    targetMouseY: 0.5,
    isRunning: false,
    isVisible: true,
    radius: borderRadius
  });

  // Exquisite thermal heatmap palettes calibrated for high contrast with white text
  // Coherent palettes strictly grounded in the Hero Video's 2-color aesthetic:
  // 1. Solar Amber / Gold (The radiant setting sun & warm horizon)
  // 2. Cosmic Atmospheric Cyan (The deep twilight sky & atmospheric glow)
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
    // Map magma to warm solar gold
    magma: {
      c0: [0.02, 0.03, 0.07],
      c1: [0.12, 0.08, 0.35],
      c2: [0.65, 0.15, 0.15],
      c3: [0.90, 0.35, 0.06],
      c4: [0.98, 0.68, 0.14],
      c5: [1.00, 0.88, 0.50],
    },
    // Map ultraviolet to deep solar-indigo
    ultraviolet: {
      c0: [0.02, 0.03, 0.07],
      c1: [0.08, 0.12, 0.42],
      c2: [0.45, 0.15, 0.40],
      c3: [0.85, 0.28, 0.15],
      c4: [0.96, 0.65, 0.15],
      c5: [1.00, 0.86, 0.50],
    },
    // Map cobalt to cosmic cyan
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
      uniform float u_time;
      uniform float u_hover;
      uniform float u_radius;
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
        // Guarantees subpixel-perfect alignment with the container's border-radius
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

        float t = u_time * 0.32;

        // 3. Fluid Convection Warping
        vec2 warp = vec2(
          fbm(uv * 2.2 + vec2(t * 0.26, -t * 0.16)),
          fbm(uv * 2.2 + vec2(-t * 0.20, t * 0.30) + vec2(4.2, 7.8))
        );

        vec2 fineWarp = vec2(
          snoise(uv * 4.0 + warp * 1.1 + vec2(0.0, t * 0.35)),
          snoise(uv * 4.0 - warp * 1.1 + vec2(t * 0.35, 0.0))
        );

        // 4. Dynamic Mouse Heat Emitter
        // Focused thermal emission at cursor, with smooth decaying falloff
        float dMouse = length(uv + warp * 0.12 + fineWarp * 0.04 - mouseUv);
        float mouseHeat = exp(-dMouse * 3.8) * 0.70 + exp(-dMouse * 1.8) * 0.24;
        // Tight, pinpoint epicenter directly at the cursor tip
        float pinpointCore = exp(-dMouse * 8.5) * 0.32;

        // 5. Drifting Ambient Thermal Nodes (gentle, never overpowering)
        vec2 node1Pos = vec2(sin(t * 0.65) * 0.32 * aspect, cos(t * 0.85) * 0.22);
        vec2 node2Pos = vec2(cos(t * 0.55 + 2.0) * 0.35 * aspect, sin(t * 0.75 + 1.2) * 0.25);
        float dNode1 = length(uv + warp * 0.08 - node1Pos);
        float dNode2 = length(uv + warp * 0.08 - node2Pos);
        float nodeHeat = exp(-dNode1 * 3.8) * 0.20 + exp(-dNode2 * 4.0) * 0.16;

        // 6. Ambient Convective Fluid Heat Field
        float ambientFluid = fbm(uv * 1.5 + warp * 0.4 + vec2(t * 0.10)) * 0.18;

        // 7. Composite Thermal Intensity Field (T)
        // Scaled so average surface remains in deep rich chromatic spectrum (0.2..0.7)
        float temp = mouseHeat + pinpointCore + nodeHeat + ambientFluid;
        temp = clamp(temp, 0.0, 1.0);

        // 8. Thermal Spectral Color Mapping
        vec3 color = getThermalColor(temp, u_c0, u_c1, u_c2, u_c3, u_c4, u_c5);

        // 9. Subtle Isothermal Contour Rings (Scientific / High-Tech Topographic Data Aesthetic)
        float contourWave = fract(temp * 4.5);
        float contour = smoothstep(0.04, 0.0, abs(contourWave - 0.5));
        float contourMask = smoothstep(0.20, 0.45, temp) * smoothstep(1.0, 0.80, temp);
        color += vec3(0.12) * contour * contourMask;

        // 10. Analog Film Grain / Sensor Noise
        float grain = fract(sin(dot(gl_FragCoord.xy + fract(u_time * 2.0), vec2(12.9898, 78.233))) * 43758.5453);
        color += (grain - 0.5) * 0.06;

        // 11. Soft Specular Caustic at Cursor Center
        float cursorGlow = exp(-length(uv - mouseUv) * 4.2) * 0.22;
        color += vec3(cursorGlow);

        // 12. Final Subpixel Masked Alpha
        float alpha = u_hover * 0.82 * cornerAlpha;
        gl_FragColor = vec4(color, alpha);
      }
    `;

    function createShader(type, source) {
      const s = gl.createShader(type);
      gl.shaderSource(s, source);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
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
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

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
    const uTime = gl.getUniformLocation(program, 'u_time');
    const uHover = gl.getUniformLocation(program, 'u_hover');
    const uRadius = gl.getUniformLocation(program, 'u_radius');
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
        gl.uniform1f(uTime, elapsed);
        gl.uniform1f(uHover, state.hover);
        // Mathematical corner radius in physical device pixels
        gl.uniform1f(uRadius, state.radius * currentDpr);

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
      style={{ borderRadius: `${borderRadius}px` }}
      className="absolute inset-0 pointer-events-none z-0 w-full h-full rounded-[inherit] overflow-hidden mix-blend-screen opacity-85 transition-opacity duration-300"
    />
  );
}
