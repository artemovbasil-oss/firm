import React, { useEffect, useRef } from 'react';

/**
 * CardShaderHover
 * Ultra-elegant WebGL mesh gradient with analog film grain and
 * dynamic mouse caustics. Runs ONLY on hover, 0% CPU/GPU when idle.
 */
export default function CardShaderHover({ colorMode = 'indigo', isHovered = false, mousePos = { x: 0.5, y: 0.5 } }) {
  const canvasRef = useRef(null);
  const stateRef = useRef({
    hover: 0,
    targetHover: 0,
    mouseX: 0.5,
    mouseY: 0.5,
    targetMouseX: 0.5,
    targetMouseY: 0.5,
    isRunning: false,
    isVisible: true
  });

  // Color palettes for different project disciplines
  const PALETTES = {
    indigo: {
      c1: [0.03, 0.05, 0.18], // Deep navy void
      c2: [0.18, 0.25, 0.85], // Electric cobalt
      c3: [0.45, 0.18, 0.95], // Radiant violet
      c4: [0.08, 0.82, 0.95], // Cyan caustic
    },
    emerald: {
      c1: [0.02, 0.12, 0.08], // Deep jade void
      c2: [0.04, 0.65, 0.42], // Emerald green
      c3: [0.08, 0.82, 0.72], // Mint turquoise
      c4: [0.65, 0.95, 0.65], // Neon lime highlight
    },
    purple: {
      c1: [0.08, 0.02, 0.16], // Deep amethyst
      c2: [0.65, 0.12, 0.78], // Neon fuchsia
      c3: [0.42, 0.18, 0.88], // Electric purple
      c4: [0.95, 0.35, 0.65], // Rose highlight
    },
    amber: {
      c1: [0.12, 0.06, 0.02], // Deep bronze void
      c2: [0.85, 0.45, 0.08], // Solar amber
      c3: [0.95, 0.72, 0.15], // Radiant gold
      c4: [0.95, 0.25, 0.35], // Crimson accent
    }
  };

  const palette = PALETTES[colorMode] || PALETTES.indigo;

  useEffect(() => {
    stateRef.current.targetHover = isHovered ? 1.0 : 0.0;
    if (isHovered && !stateRef.current.isRunning) {
      stateRef.current.isRunning = true;
      if (startLoopRef.current) startLoopRef.current();
    }
  }, [isHovered]);

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
      antialias: false,
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
      uniform vec3 u_c1;
      uniform vec3 u_c2;
      uniform vec3 u_c3;
      uniform vec3 u_c4;

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

      void main() {
        if (u_hover < 0.005) {
          gl_FragColor = vec4(0.0);
          return;
        }

        vec2 st = gl_FragCoord.xy / u_resolution.xy;
        float aspect = u_resolution.x / u_resolution.y;
        vec2 uv = vec2((st.x - 0.5) * aspect, st.y - 0.5);
        vec2 mouseUv = vec2((u_mouse.x - 0.5) * aspect, u_mouse.y - 0.5);

        // Fluid motion with subtle cursor vortex
        float t = u_time * 0.25;
        float d = length(uv - mouseUv);
        float mouseAttract = exp(-d * 3.5);

        vec2 warp = vec2(
          fbm(uv * 2.2 + vec2(t * 0.4, 0.0) + mouseUv * 0.3),
          fbm(uv * 2.2 + vec2(4.2, t * 0.3) - mouseUv * 0.3)
        );

        // Multi-stop liquid gradient blending
        float n1 = fbm(uv * 1.6 + warp * 0.8);
        float n2 = fbm(uv * 2.4 - warp * 0.6 + vec2(t * 0.2));

        vec3 color = mix(u_c1, u_c2, clamp(n1 * 0.5 + 0.5, 0.0, 1.0));
        color = mix(color, u_c3, clamp(n2 * 0.5 + 0.5, 0.0, 1.0) * 0.85);
        color = mix(color, u_c4, clamp(mouseAttract * 0.75 + warp.x * 0.2, 0.0, 1.0) * 0.7);

        // Analog film grain / organic noise
        float grain = fract(sin(dot(gl_FragCoord.xy + fract(u_time * 2.0), vec2(12.9898, 78.233))) * 43758.5453);
        color += (grain - 0.5) * 0.08;

        // Soft spotlight near cursor
        float spot = exp(-d * 2.8) * 0.35;
        color += vec3(spot);

        float alpha = u_hover * 0.75;
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
    const uC1 = gl.getUniformLocation(program, 'u_c1');
    const uC2 = gl.getUniformLocation(program, 'u_c2');
    const uC3 = gl.getUniformLocation(program, 'u_c3');
    const uC4 = gl.getUniformLocation(program, 'u_c4');

    gl.uniform3fv(uC1, palette.c1);
    gl.uniform3fv(uC2, palette.c2);
    gl.uniform3fv(uC3, palette.c3);
    gl.uniform3fv(uC4, palette.c4);

    let animId = null;
    let startTime = performance.now();

    const handleResize = () => {
      const parent = canvas.parentElement;
      const rect = parent ? parent.getBoundingClientRect() : { width: 400, height: 300 };
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
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

    if (isHovered) {
      stateRef.current.isRunning = true;
      startLoop();
    }

    const observer = new IntersectionObserver(([entry]) => {
      stateRef.current.isVisible = entry.isIntersecting;
      if (entry.isIntersecting && stateRef.current.targetHover > 0 && !stateRef.current.isRunning) {
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
  }, [colorMode]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0 w-full h-full mix-blend-screen opacity-90 transition-opacity duration-300"
    />
  );
}
