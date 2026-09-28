import React, { useEffect, useRef } from 'react';

/**
 * Modern WebGL Interactive Fluid Fragment Shader
 * Replaces dated particle lines with luxury GPU fluid caustics,
 * chromatic wave dispersion, and dynamic mouse wake distortion.
 */
export default function HeroCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Initialize WebGL context
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

    // Fragment Shader: Liquid caustics, domain warping, chromatic aberration & interactive mouse fluid ripples
    const fsSource = `
      precision highp float;
      varying vec2 v_uv;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      uniform float u_time;
      uniform float u_hover;
      uniform vec2 u_velocity;

      // 2D Simplex Noise
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

      // Fractal Brownian Motion
      float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        mat2 rot = mat2(cos(0.55), sin(0.55), -sin(0.55), cos(0.55));
        for (int i = 0; i < 4; ++i) {
          v += a * snoise(p);
          p = rot * p * 2.05 + vec2(10.0, 10.0);
          a *= 0.48;
        }
        return v;
      }

      void main() {
        vec2 st = gl_FragCoord.xy / u_resolution.xy;
        float aspect = u_resolution.x / u_resolution.y;
        vec2 uv = vec2((st.x - 0.5) * aspect, st.y - 0.5);
        vec2 mouseUv = vec2((u_mouse.x - 0.5) * aspect, u_mouse.y - 0.5);

        // Distance from cursor
        float distToMouse = length(uv - mouseUv);
        
        // Fluid wave ripple triggered by mouse proximity & velocity
        float vel = clamp(length(u_velocity) * 12.0, 0.0, 3.5);
        float ripple = sin(distToMouse * 24.0 - u_time * 4.0) * exp(-distToMouse * 4.2);
        float mouseField = smoothstep(0.48, 0.0, distToMouse) * (0.35 + vel) * u_hover;

        // Slow ambient liquid motion
        float slowTime = u_time * 0.12;
        vec2 p = uv * 1.8;

        // Domain warping
        vec2 q = vec2(
          fbm(p + vec2(slowTime * 0.35, 0.0)),
          fbm(p + vec2(5.2, 1.3 - slowTime * 0.3))
        );

        vec2 r = vec2(
          fbm(p + 3.2 * q + vec2(1.7, 9.2 + slowTime * 0.4)),
          fbm(p + 3.2 * q + vec2(8.3 - slowTime * 0.2, 2.8))
        );

        // Fluid displacement with mouse shockwave
        vec2 mouseDisplacement = normalize(uv - mouseUv + 0.0001) * ripple * mouseField * 0.22;
        vec2 totalDisplacement = r * 0.28 + mouseDisplacement;

        // Chromatic dispersion offsets (Red, Green, Blue refraction)
        float chroma = 0.015 * (1.0 + mouseField * 2.5);
        float nR = fbm(p + totalDisplacement + vec2(chroma, 0.0));
        float nG = fbm(p + totalDisplacement);
        float nB = fbm(p + totalDisplacement - vec2(chroma, 0.0));

        // High-end studio color palette (Cosmic Cyan, Radiant Violet, Subtle Rose Gold)
        vec3 colViolet = vec3(0.38, 0.26, 0.92); // #6342eb
        vec3 colCyan   = vec3(0.12, 0.78, 0.92); // #1fc7eb
        vec3 colRose   = vec3(0.96, 0.42, 0.58); // #f56b94
        vec3 colGold   = vec3(0.98, 0.72, 0.28); // #f9b847

        vec3 color = mix(colViolet, colCyan, clamp(nG * 0.5 + 0.5, 0.0, 1.0));
        color = mix(color, colRose, clamp(nR * 0.4 + 0.2, 0.0, 1.0) * mouseField);
        color = mix(color, colGold, clamp(nB * nB, 0.0, 1.0) * 0.35);

        // Caustic light highlights
        float caustics = pow(clamp(nR * 0.5 + 0.5, 0.0, 1.0), 3.2) * 1.6;
        color += vec3(caustics * 0.4);

        // Dynamic fluid alpha mask
        float flowAlpha = smoothstep(0.1, 0.9, length(totalDisplacement) * 1.8 + mouseField * 0.5);
        float alpha = clamp(flowAlpha * 0.65 + caustics * 0.2, 0.0, 0.75);

        // Enhance alpha near cursor for responsive interaction
        alpha += mouseField * 0.25;
        alpha = clamp(alpha, 0.0, 0.85);

        gl_FragColor = vec4(color, alpha);
      }
    `;

    // Compile helper
    function createShader(glCtx, type, source) {
      const shader = glCtx.createShader(type);
      glCtx.shaderSource(shader, source);
      glCtx.compileShader(shader);
      if (!glCtx.getShaderParameter(shader, glCtx.COMPILE_STATUS)) {
        console.error('Shader compilation error:', glCtx.getShaderInfoLog(shader));
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

    // Fullscreen quad buffer
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
    const uVelocity = gl.getUniformLocation(program, 'u_velocity');

    // State tracking with smooth damping
    const state = {
      mouseX: 0.5,
      mouseY: 0.5,
      targetMouseX: 0.5,
      targetMouseY: 0.5,
      prevMouseX: 0.5,
      prevMouseY: 0.5,
      velocityX: 0,
      velocityY: 0,
      hover: 0,
      targetHover: 0,
      isVisible: true
    };

    let animationFrameId;
    let startTime = performance.now();

    // Resize handler
    const handleResize = () => {
      const parent = canvas.parentElement;
      const rect = parent ? parent.getBoundingClientRect() : { width: window.innerWidth, height: window.innerHeight };
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5); // Optimal for 60fps
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

    // Mouse tracking on hero section or window
    const handlePointerMove = (e) => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();

      // Only activate if inside or near hero section
      if (
        e.clientY >= rect.top - 80 &&
        e.clientY <= rect.bottom + 80 &&
        e.clientX >= rect.left &&
        e.clientX <= rect.right
      ) {
        state.targetMouseX = (e.clientX - rect.left) / rect.width;
        state.targetMouseY = 1.0 - (e.clientY - rect.top) / rect.height; // Invert for WebGL coordinates
        state.targetHover = 1.0;
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

    // IntersectionObserver to pause when hero is scrolled out of view
    const observer = new IntersectionObserver(([entry]) => {
      state.isVisible = entry.isIntersecting;
    }, { threshold: 0.05 });
    observer.observe(canvas);

    // Render loop
    const render = (now) => {
      if (state.isVisible) {
        const elapsedTime = (now - startTime) * 0.001;

        // Smooth mouse lerp
        state.mouseX += (state.targetMouseX - state.mouseX) * 0.09;
        state.mouseY += (state.targetMouseY - state.mouseY) * 0.09;

        // Compute mouse velocity
        state.velocityX = (state.mouseX - state.prevMouseX);
        state.velocityY = (state.mouseY - state.prevMouseY);
        state.prevMouseX = state.mouseX;
        state.prevMouseY = state.mouseY;

        // Smooth hover transition
        state.hover += (state.targetHover - state.hover) * 0.06;

        gl.uniform2f(uResolution, canvas.width, canvas.height);
        gl.uniform2f(uMouse, state.mouseX, state.mouseY);
        gl.uniform1f(uTime, elapsedTime);
        gl.uniform1f(uHover, state.hover);
        gl.uniform2f(uVelocity, state.velocityX, state.velocityY);

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
      className="absolute inset-0 pointer-events-none z-10 w-full h-full mix-blend-screen opacity-70 dark:opacity-60 transition-opacity duration-700"
    />
  );
}
