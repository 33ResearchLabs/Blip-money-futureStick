import { useEffect, useRef } from "react";
import * as THREE from "three";

const Hero3D = () => {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const phoneGroupRef = useRef<THREE.Group | null>(null);
  const particleSystemRef = useRef<THREE.Points | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const windowHalfRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const animationFrameRef = useRef<number | null>(null);

  const NEON_GREEN_HEX = 0x19f7a7;
  const CYAN_ACCENT_HEX = 0x00c8ff;

  useEffect(() => {
    const canvasContainer = canvasContainerRef.current;
    if (!canvasContainer) return;

    // Initialize window dimensions
    windowHalfRef.current = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    };

    // Create scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Create camera
    const camera = new THREE.PerspectiveCamera(
      75,
      canvasContainer.clientWidth / canvasContainer.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 8;
    cameraRef.current = camera;

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
    canvasContainer.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting (Refined for Premium Look)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.05);
    scene.add(ambientLight);

    // Neon Green Rim Light
    const neonLight = new THREE.PointLight(NEON_GREEN_HEX, 4, 20);
    neonLight.position.set(2, 3, 5);
    scene.add(neonLight);

    // Soft Cyan Fill Light
    const cyanLight = new THREE.PointLight(CYAN_ACCENT_HEX, 1.5, 30);
    cyanLight.position.set(-5, -5, 5);
    scene.add(cyanLight);

    // Phone Mockup (Geometry and Material)
    const phoneWidth = 2.5;
    const phoneHeight = 5;
    const phoneDepth = 0.2;

    const phoneGeometry = new THREE.BoxGeometry(
      phoneWidth,
      phoneHeight,
      phoneDepth
    );

    // Material: Dark, metallic body with subtle neon emission
    const phoneMaterial = new THREE.MeshStandardMaterial({
      color: 0x010101,
      emissive: NEON_GREEN_HEX,
      emissiveIntensity: 0.5,
      metalness: 0.9,
      roughness: 0.1,
    });

    const phoneFrame = new THREE.Mesh(phoneGeometry, phoneMaterial);

    // Screen Panel (Simulating the Blip App)
    const screenGeometry = new THREE.PlaneGeometry(
      phoneWidth * 0.9,
      phoneHeight * 0.9
    );
    const screenMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
      map: createScreenTexture(),
      side: THREE.FrontSide,
    });
    const screenMesh = new THREE.Mesh(screenGeometry, screenMaterial);
    screenMesh.position.z = phoneDepth / 2 + 0.001;

    const phoneGroup = new THREE.Group();
    phoneGroup.add(phoneFrame);
    phoneGroup.add(screenMesh);
    scene.add(phoneGroup);
    phoneGroupRef.current = phoneGroup;

    // --- Particle System (Mixed Neon Green and Cyan) ---
    const particleCount = 1000;
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];
    const neonGreenColor = new THREE.Color(NEON_GREEN_HEX);
    const cyanAccentColor = new THREE.Color(CYAN_ACCENT_HEX);

    for (let i = 0; i < particleCount; i++) {
      positions.push(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 10
      );
      // Alternate particle colors
      if (i % 3 === 0) {
        colors.push(cyanAccentColor.r, cyanAccentColor.g, cyanAccentColor.b);
      } else {
        colors.push(neonGreenColor.r, neonGreenColor.g, neonGreenColor.b);
      }
    }

    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.05,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
      vertexColors: true,
    });

    const particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);
    particleSystemRef.current = particleSystem;

    // Mouse move handler
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current = {
        x: (event.clientX - windowHalfRef.current.x) * 0.05,
        y: (event.clientY - windowHalfRef.current.y) * 0.05,
      };
    };

    // Window resize handler
    const handleResize = () => {
      windowHalfRef.current = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      };

      if (canvasContainer && camera && renderer) {
        const width = canvasContainer.clientWidth;
        const height = canvasContainer.clientHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      }
    };

    // Animation loop
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);

      // Parallax effect: Subtle phone rotation based on cursor
      if (phoneGroupRef.current) {
        const targetRotationY = (mouseRef.current.x / windowHalfRef.current.x) * 0.1;
        const targetRotationX = (mouseRef.current.y / windowHalfRef.current.y) * 0.1;

        phoneGroupRef.current.rotation.y += (targetRotationY - phoneGroupRef.current.rotation.y) * 0.05;
        phoneGroupRef.current.rotation.x += (targetRotationX - phoneGroupRef.current.rotation.x) * 0.05;

        // Subtle idle movement (tilt)
        phoneGroupRef.current.rotation.z = Math.sin(Date.now() * 0.0001) * 0.05;
      }

      // Animate particles
      if (particleSystemRef.current) {
        particleSystemRef.current.rotation.y += 0.0005;
        particleSystemRef.current.rotation.x += 0.0002;
      }

      if (renderer && scene && camera) {
        renderer.render(scene, camera);
      }
    };

    // Add event listeners
    document.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    // Start animation
    animate();

    // Cleanup function
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      if (renderer) {
        renderer.dispose();
        if (canvasContainer && renderer.domElement) {
          canvasContainer.removeChild(renderer.domElement);
        }
      }

      // Dispose geometries and materials
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry?.dispose();
          if (object.material instanceof THREE.Material) {
            object.material.dispose();
          }
        }
      });
    };
  }, []);

  const createScreenTexture = (): THREE.CanvasTexture => {
    // Creates a minimal, stylized canvas texture to mock the Blip App UI
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return new THREE.CanvasTexture(canvas);
    }

    ctx.fillStyle = "#010101"; // Ultra dark screen
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Balance Summary
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "32px Inter";
    ctx.textAlign = "center";
    ctx.fillText("Available Balance", canvas.width / 2, 100);

    ctx.fillStyle = "#19F7A7";
    ctx.font = "bold 80px Inter";
    ctx.fillText("$8,500.21", canvas.width / 2, 180);

    // Transaction list (Minimalist lines)
    ctx.fillStyle = "#0A0A0A";
    ctx.fillRect(50, 250, 412, 60);
    ctx.fillRect(50, 330, 412, 60);
    ctx.fillRect(50, 410, 412, 60);

    // Transaction text
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "24px Inter";
    ctx.textAlign = "left";
    ctx.fillText("Transfer to Jane Doe", 60, 285);
    ctx.font = "18px Inter";
    ctx.fillStyle = "#00C8FF";
    ctx.textAlign = "right";
    ctx.fillText("-$1,850.00", 450, 285);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "24px Inter";
    ctx.textAlign = "left";
    ctx.fillText("Merchant Payout #1903", 60, 365);
    ctx.font = "18px Inter";
    ctx.fillStyle = "#19F7A7";
    ctx.textAlign = "right";
    ctx.fillText("Confirmed", 450, 365);

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  };

  return (
    <div
      ref={canvasContainerRef}
      id="hero-canvas-container"
      className="w-full h-full"
    />
  );
};

export default Hero3D;
