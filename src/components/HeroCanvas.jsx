import React, { useEffect, useRef } from 'react';

/**
 * Web Traffic Heatmap WebGL Shader
 * Simulates real-time digital analytics, clickstream telemetry,
 * and user conversion thermal hotspots.
 * Transparent everywhere except active heat zones so the video
 * underneath is 100% visible.
 */
export default function HeroCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // WebGL context with transparent background
    const gl = canvas.getContext('webgl', { 
      alpha: true, 
      antialias: true, 
      powerPreference: 'high-performance',
      premultipliedAlpha: false
    }) || canvas.getContext('experimental-webgl');

    if (!gl) {
      console.warn('WebGL not supported on this device');
      return;
    }

    // Vertex Shader: full-screen triangle quad
    const vsSource = `
      attribute vec2 a_position;
      varying vec2 v_uv;
      void main() {
        v_uv = (a_position + 1.0) * 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    // Fragment Shader: Web Traffic Heatmap, Thermal Spectrum & Analytics Isolines
    const fsSource = `
      precision highp float;
      varying vec2 v_uv;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      uniform float u_time;
      uniform float u_hover;
      uniform vec3 u_trail[8];     // x, y, intensity
      uniform vec3 u_hotspots[4];  // x, y, intensity

      // Simplex 2D noise for organic heat dissipation
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy));
        vec2 x0 = v - i + dot(i, C.xx);
        vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
        vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
        m = m * m;
        m = m * m;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
        vec3 g;
        g.x  = a0.x * x0.x + h.x * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      // Classic High-End Analytics Heatmap Color Spectrum (Turbo / Infrared / UX Thermal)
      vec3 heatmapSpectrum(float t) {
        t = clamp(t, 0.0, 1.3);

        vec3 c0 = vec3(0.06, 0.14, 0.65); // Deep Indigo / Cold baseline
        vec3 c1 = vec3(0.02, 0.75, 0.95); // Electric Cyan
        vec3 c2 = vec3(0.10, 0.92, 0.45); // Emerald Green
        vec3 c3 = vec3(0.98, 0.86, 0.12); // Solar Yellow
        vec3 c4 = vec3(0.98, 0.22, 0.06); // Thermal Crimson
        vec3 c5 = vec3(1.00, 1.00, 1.00); // White Hot Core

        if (t < 0.20) {
          return mix(c0, c1, t / 0.20);
        } else if (t < 0.42) {
          return mix(c1, c2, (t - 0.20) / 0.22);
        } else if (t < 0.68) {
          return mix(c2, c3, (t - 0.42) / 0.26);
        } else if (t < 0.92) {
          return mix(c3, c4, (t - 0.68) / 0.24);
        } else {
          return mix(c4, c5, clamp((t - 0.92) / 0.25, 0.0, 1.0));
        }
      }

      void main() {
        vec2 st = gl_FragCoord.xy / u_resolution.xy;
        float aspect = u_resolution.x / u_resolution.y;
        vec2 uv = vec2((st.x - 0.5) * aspect, st.y - 0.5);
        vec2 mouseUv = vec2((u_mouse.x - 0.5) * aspect, u_mouse.y - 0.5);

        float heat = 0.0;

        // 1. Primary Mouse Interaction Heat (Interactive User Focus)
        if (u_hover > 0.01) {
          float distMouse = length(uv - mouseUv);
          float pulse = 0.9 + 0.15 * sin(u_time * 5.0);
          float mouseSpot = exp(-distMouse * distMouse * 36.0) * 1.15 * pulse * u_hover;
          heat += mouseSpot;
        }

        // 2. Lingering Mouse Heat Trail (Clickstream / Attention Decay)
        for (int i = 0; i < 8; i++) {
          if (u_trail[i].z > 0.02) {
            vec2 tUv = vec2((u_trail[i].x - 0.5) * aspect, u_trail[i].y - 0.5);
            float d = length(uv - tUv);
            heat += exp(-d * d * 48.0) * u_trail[i].z * 0.72;
          }
        }

        // 3. Autonomous Simulated Web Traffic Hotspots (CRO / Conversion Flows)
        for (int i = 0; i < 4; i++) {
          if (u_hotspots[i].z > 0.02) {
            vec2 sUv = vec2((u_hotspots[i].x - 0.5) * aspect, u_hotspots[i].y - 0.5);
            float d = length(uv - sUv);
            heat += exp(-d * d * 28.0) * u_hotspots[i].z * 0.55;
          }
        }

        // IMPORTANT: If below heat threshold, discard completely!
        // This ensures the underlying video is 100% visible and unclouded!
        if (heat < 0.035) {
          gl_FragColor = vec4(0.0);
          return;
        }

        // Organic subtle thermal turbulence
        float noise = snoise(uv * 4.5 + vec2(u_time * 0.12, u_time * 0.08)) * 0.07;
        heat += noise * smoothstep(0.08, 0.6, heat);

        // Heatmap Topographical Isolines (Contour elevation curves like analytics maps)
        float contour = abs(fract(heat * 5.5) - 0.5);
        float isoline = smoothstep(0.07, 0.0, contour) * 0.35 * smoothstep(0.08, 0.6, heat);

        // Map heat to infrared thermal palette
        vec3 color = heatmapSpectrum(heat);
        color += vec3(isoline * 0.4);

        // Telemetry dot matrix HUD overlay in active heat zones
        vec2 grid = fract(st * vec2(u_resolution.x / 18.0, u_resolution.y / 18.0));
        float dotPattern = smoothstep(0.18, 0.0, length(grid - 0.5)) * 0.12 * smoothstep(0.1, 0.5, heat);
        color += vec3(dotPattern);

        // Telemetry Cursor Target Rings (Laser focus on active cursor)
        if (u_hover > 0.01) {
          float distMouse = length(uv - mouseUv);
          float ring1 = smoothstep(0.003, 0.0, abs(distMouse - 0.055)) * 0.35;
          float ring2 = smoothstep(0.003, 0.0, abs(distMouse - 0.105)) * 0.2;
          color += vec3(ring1 + ring2) * u_hover;
        }

        // Alpha ramp: zero outside heat, smooth transition inside heat
        float alpha = smoothstep(0.035, 0.45, heat) * 0.72;
        alpha = clamp(alpha, 0.0, 0.82);

        gl_FragColor = vec4(color, alpha);
      }
    `;

    // Shader compilation
    function createShader(glCtx, type, source) {
      const shader = glCtx.createShader(type);
      glCtx.shaderSource(shader, source);
      glCtx.compileShader(shader);
      if (!glCtx.getShaderParameter(shader, glCtx.COMPILE_STATUS)) {
        console.error('Shader compile error:', glCtx.getShaderInfoLog(shader));
        glCtx.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Fullscreen quad
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1.0, -1.0,
         1.0, -1.0,
        -1.0,  1.0,
        -1.0,  1.0,
         1.0, -1.0,
         1.0,  1.0
      ]),
      gl.STATIC_DRAW
    );

    const aPositionLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(aPositionLocation);
    gl.vertexAttribPointer(aPositionLocation, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations
    const uResolution = gl.getUniformLocation(program, 'u_resolution');
    const uMouse = gl.getUniformLocation(program, 'u_mouse');
    const uTime = gl.getUniformLocation(program, 'u_time');
    const uHover = gl.getUniformLocation(program, 'u_hover');
    const uTrail = gl.getUniformLocation(program, 'u_trail');
    const uHotspots = gl.getUniformLocation(program, 'u_hotspots');

    // Trail buffer: 8 points with {x, y, intensity}
    const TRAIL_LENGTH = 8;
    const trailData = [];
    for (let i = 0; i < TRAIL_LENGTH; i++) {
      trailData.push({ x: 0.5, y: 0.5, intensity: 0.0 });
    }
    const trailBuffer = new Float32Array(TRAIL_LENGTH * 3);
    const hotspotsBuffer = new Float32Array(4 * 3);

    const state = {
      mouseX: 0.5,
      mouseY: 0.5,
      targetMouseX: 0.5,
      targetMouseY: 0.5,
      hover: 0,
      targetHover: 0,
      isVisible: true,
      lastTrailTime: 0
    };

    let animationFrameId;
    let startTime = performance.now();

    // Resize handler
    const handleResize = () => {
      const parent = canvas.parentElement;
      const rect = parent ? parent.getBoundingClientRect() : { width: window.innerWidth, height: window.innerHeight };
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
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

    // Mouse tracking on hero section
    const handlePointerMove = (e) => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();

      if (
        e.clientY >= rect.top - 60 &&
        e.clientY <= rect.bottom + 60 &&
        e.clientX >= rect.left &&
        e.clientX <= rect.right
      ) {
        state.targetMouseX = (e.clientX - rect.left) / rect.width;
        state.targetMouseY = 1.0 - (e.clientY - rect.top) / rect.height; // WebGL coordinates
        state.targetHover = 1.0;

        // Add to heat trail every 45ms when moving
        const now = performance.now();
        if (now - state.lastTrailTime > 45) {
          state.lastTrailTime = now;
          // Shift and add
          trailData.unshift({
            x: state.targetMouseX,
            y: state.targetMouseY,
            intensity: 0.95
          });
          if (trailData.length > TRAIL_LENGTH) {
            trailData.pop();
          }
        }
      } else {
        state.targetHover = 0.0;
      }
    };

    const handlePointerLeave = () => {
      state.targetHover = 0.0;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('mouseleave', handlePointerLeave, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    // IntersectionObserver to pause when offscreen
    const observer = new IntersectionObserver(([entry]) => {
      state.isVisible = entry.isIntersecting;
    }, { threshold: 0.05 });
    observer.observe(canvas);

    // Render loop
    const render = (now) => {
      if (state.isVisible) {
        const elapsedTime = (now - startTime) * 0.001;

        // Smooth mouse lerp
        state.mouseX += (state.targetMouseX - state.mouseX) * 0.12;
        state.mouseY += (state.targetMouseY - state.mouseY) * 0.12;
        state.hover += (state.targetHover - state.hover) * 0.06;

        // Decay trail intensity over time (dissipating thermal heat)
        for (let i = 0; i < trailData.length; i++) {
          trailData[i].intensity *= 0.955;
          trailBuffer[i * 3 + 0] = trailData[i].x;
          trailBuffer[i * 3 + 1] = trailData[i].y;
          trailBuffer[i * 3 + 2] = trailData[i].intensity;
        }

        // Autonomous Simulated Web Traffic Hotspots (CRO & live session clusters)
        // Hotspot 0: Top left conversion funnel
        hotspotsBuffer[0] = 0.22 + 0.08 * Math.sin(elapsedTime * 0.4);
        hotspotsBuffer[1] = 0.65 + 0.06 * Math.cos(elapsedTime * 0.5);
        hotspotsBuffer[2] = 0.65 + 0.3 * Math.sin(elapsedTime * 1.2);

        // Hotspot 1: Right CTA attention spot
        hotspotsBuffer[3] = 0.78 + 0.07 * Math.cos(elapsedTime * 0.35);
        hotspotsBuffer[4] = 0.42 + 0.08 * Math.sin(elapsedTime * 0.45);
        hotspotsBuffer[5] = 0.6 + 0.35 * Math.cos(elapsedTime * 0.9);

        // Hotspot 2: Central flow
        hotspotsBuffer[6] = 0.5 + 0.15 * Math.sin(elapsedTime * 0.25);
        hotspotsBuffer[7] = 0.28 + 0.05 * Math.sin(elapsedTime * 0.6);
        hotspotsBuffer[8] = 0.55 + 0.3 * Math.sin(elapsedTime * 1.5);

        // Hotspot 3: Top right surge
        hotspotsBuffer[9] = 0.84 + 0.06 * Math.sin(elapsedTime * 0.5);
        hotspotsBuffer[10] = 0.74 + 0.05 * Math.cos(elapsedTime * 0.4);
        hotspotsBuffer[11] = 0.55 + 0.3 * Math.cos(elapsedTime * 1.1);

        gl.clearColor(0.0, 0.0, 0.0, 0.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.uniform2f(uResolution, canvas.width, canvas.height);
        gl.uniform2f(uMouse, state.mouseX, state.mouseY);
        gl.uniform1f(uTime, elapsedTime);
        gl.uniform1f(uHover, state.hover);
        gl.uniform3fv(uTrail, trailBuffer);
        gl.uniform3fv(uHotspots, hotspotsBuffer);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('mouseleave', handlePointerLeave);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();

      if (gl) {
        gl.deleteProgram(program);
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
        gl.deleteBuffer(positionBuffer);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-10 w-full h-full mix-blend-screen opacity-85 dark:opacity-80 transition-opacity duration-500"
    />
  );
}
