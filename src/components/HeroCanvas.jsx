import React, { useEffect, useRef } from 'react';

/**
 * Ultra-Smooth Web Traffic Heatmap WebGL Shader
 * Silky continuous thermal gradient (Gaussian spectral synthesis),
 * zero harsh contour steps, soft ambient traffic dissipation,
 * and 100% transparent base allowing the background artwork to shine through.
 */
export default function HeroCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

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

    // Fragment Shader: Soft Gaussian Spectral Heatmap & Web Traffic Telemetry
    const fsSource = `
      precision highp float;
      varying vec2 v_uv;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      uniform float u_time;
      uniform float u_hover;
      uniform vec3 u_trail[8];     // x, y, intensity
      uniform vec3 u_hotspots[4];  // x, y, intensity

      // Simplex 2D noise for subtle organic dissipation
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

      // Continuous Gaussian Spectral Color Synthesis
      // Produces silky smooth, non-stepped transitions across the thermal scale
      vec3 smoothHeatSpectrum(float t) {
        t = clamp(t, 0.0, 1.25);

        // Soft overlapping Gaussian envelopes
        float wBlue   = exp(-pow((t - 0.10) / 0.16, 2.0));
        float wCyan   = exp(-pow((t - 0.28) / 0.16, 2.0));
        float wMint   = exp(-pow((t - 0.46) / 0.16, 2.0));
        float wAmber  = exp(-pow((t - 0.66) / 0.16, 2.0));
        float wCoral  = exp(-pow((t - 0.86) / 0.16, 2.0));
        float wCore   = smoothstep(0.85, 1.15, t);

        // Elegant studio thermal palette
        vec3 colBlue  = vec3(0.08, 0.20, 0.70); // Deep velvet blue
        vec3 colCyan  = vec3(0.06, 0.76, 0.92); // Electric cyan
        vec3 colMint  = vec3(0.16, 0.88, 0.48); // Crisp mint emerald
        vec3 colAmber = vec3(0.96, 0.78, 0.16); // Solar warm amber
        vec3 colCoral = vec3(0.96, 0.28, 0.16); // Soft infrared coral
        vec3 colCore  = vec3(1.00, 0.96, 0.92); // Radiant warm core

        vec3 color = colBlue * wBlue +
                     colCyan * wCyan +
                     colMint * wMint +
                     colAmber * wAmber +
                     colCoral * wCoral;

        float totalWeight = wBlue + wCyan + wMint + wAmber + wCoral + 0.001;
        color /= totalWeight;
        color = mix(color, colCore, wCore * 0.85);

        return color;
      }

      void main() {
        vec2 st = gl_FragCoord.xy / u_resolution.xy;
        float aspect = u_resolution.x / u_resolution.y;
        vec2 uv = vec2((st.x - 0.5) * aspect, st.y - 0.5);
        vec2 mouseUv = vec2((u_mouse.x - 0.5) * aspect, u_mouse.y - 0.5);

        float heat = 0.0;

        // 1. Primary Mouse Interaction (Gentle Gaussian focus)
        if (u_hover > 0.01) {
          float distMouse = length(uv - mouseUv);
          float breathe = 0.92 + 0.08 * sin(u_time * 3.5);
          float mouseSpot = exp(-distMouse * distMouse * 24.0) * 1.05 * breathe * u_hover;
          heat += mouseSpot;
        }

        // 2. Lingering Mouse Heat Trail (Softly dissipating clickstream)
        for (int i = 0; i < 8; i++) {
          if (u_trail[i].z > 0.02) {
            vec2 tUv = vec2((u_trail[i].x - 0.5) * aspect, u_trail[i].y - 0.5);
            float d = length(uv - tUv);
            heat += exp(-d * d * 32.0) * u_trail[i].z * 0.65;
          }
        }

        // 3. Ambient Autonomous Web Traffic Hotspots (Soft floating conversion clusters)
        for (int i = 0; i < 4; i++) {
          if (u_hotspots[i].z > 0.02) {
            vec2 sUv = vec2((u_hotspots[i].x - 0.5) * aspect, u_hotspots[i].y - 0.5);
            float d = length(uv - sUv);
            heat += exp(-d * d * 20.0) * u_hotspots[i].z * 0.45;
          }
        }

        // If below heat threshold, completely transparent: video is 100% visible!
        if (heat < 0.025) {
          gl_FragColor = vec4(0.0);
          return;
        }

        // Extremely soft organic dissipation
        float turbulence = snoise(uv * 3.5 + vec2(u_time * 0.08, u_time * 0.05)) * 0.04;
        heat += turbulence * smoothstep(0.05, 0.5, heat);

        // Synthesize ultra-smooth thermal colors
        vec3 color = smoothHeatSpectrum(heat);

        // Very faint, delicate telemetry pulse ring near cursor
        if (u_hover > 0.01) {
          float distMouse = length(uv - mouseUv);
          float ring = smoothstep(0.002, 0.0, abs(distMouse - 0.065)) * 0.22;
          color += vec3(ring) * u_hover;
        }

        // Silky soft alpha falloff
        float alpha = smoothstep(0.025, 0.45, heat) * 0.58;
        alpha = clamp(alpha, 0.0, 0.72);

        gl_FragColor = vec4(color, alpha);
      }
    `;

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
        state.targetMouseY = 1.0 - (e.clientY - rect.top) / rect.height;
        state.targetHover = 1.0;

        const now = performance.now();
        if (now - state.lastTrailTime > 50) {
          state.lastTrailTime = now;
          trailData.unshift({
            x: state.targetMouseX,
            y: state.targetMouseY,
            intensity: 0.9
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

    const observer = new IntersectionObserver(([entry]) => {
      state.isVisible = entry.isIntersecting;
    }, { threshold: 0.05 });
    observer.observe(canvas);

    const render = (now) => {
      if (state.isVisible) {
        const elapsedTime = (now - startTime) * 0.001;

        // Smooth damping
        state.mouseX += (state.targetMouseX - state.mouseX) * 0.10;
        state.mouseY += (state.targetMouseY - state.mouseY) * 0.10;
        state.hover += (state.targetHover - state.hover) * 0.05;

        // Trail decay
        for (let i = 0; i < trailData.length; i++) {
          trailData[i].intensity *= 0.95;
          trailBuffer[i * 3 + 0] = trailData[i].x;
          trailBuffer[i * 3 + 1] = trailData[i].y;
          trailBuffer[i * 3 + 2] = trailData[i].intensity;
        }

        // Subtle autonomous hotspots
        hotspotsBuffer[0] = 0.24 + 0.06 * Math.sin(elapsedTime * 0.35);
        hotspotsBuffer[1] = 0.62 + 0.05 * Math.cos(elapsedTime * 0.45);
        hotspotsBuffer[2] = 0.55 + 0.25 * Math.sin(elapsedTime * 1.1);

        hotspotsBuffer[3] = 0.76 + 0.06 * Math.cos(elapsedTime * 0.3);
        hotspotsBuffer[4] = 0.44 + 0.06 * Math.sin(elapsedTime * 0.4);
        hotspotsBuffer[5] = 0.50 + 0.25 * Math.cos(elapsedTime * 0.85);

        hotspotsBuffer[6] = 0.50 + 0.12 * Math.sin(elapsedTime * 0.22);
        hotspotsBuffer[7] = 0.30 + 0.04 * Math.sin(elapsedTime * 0.55);
        hotspotsBuffer[8] = 0.45 + 0.25 * Math.sin(elapsedTime * 1.3);

        hotspotsBuffer[9] = 0.82 + 0.05 * Math.sin(elapsedTime * 0.45);
        hotspotsBuffer[10] = 0.72 + 0.04 * Math.cos(elapsedTime * 0.35);
        hotspotsBuffer[11] = 0.48 + 0.22 * Math.cos(elapsedTime * 1.0);

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
      className="absolute inset-0 pointer-events-none z-10 w-full h-full mix-blend-screen opacity-75 dark:opacity-70 transition-opacity duration-700"
    />
  );
}
