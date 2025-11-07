import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text3D, Center } from '@react-three/drei';
import * as THREE from 'three';

export const Scene3D = () => {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
      <directionalLight position={[-10, -10, -5]} intensity={0.4} />
      <pointLight position={[0, 0, 0]} intensity={0.5} color="#3b82f6" />
      <pointLight position={[5, 5, 5]} intensity={0.3} color="#10b981" />
      
      {/* Code Grid Background */}
      <CodeGrid />
      
      {/* Floating Code Blocks */}
      <CodeBlock 
        position={[-2.5, 1.5, -2]} 
        code="function hello() {"
        color="#3b82f6"
        speed={0.5}
      />
      <CodeBlock 
        position={[2.5, 0.5, -3]} 
        code="  return 'world'"
        color="#10b981"
        speed={0.6}
      />
      <CodeBlock 
        position={[0, -1, -2.5]} 
        code="}"
        color="#8b5cf6"
        speed={0.4}
      />
      <CodeBlock 
        position={[-3, -0.5, -3.5]} 
        code="const x = 42;"
        color="#3b82f6"
        speed={0.7}
      />
      <CodeBlock 
        position={[3, 1, -2.5]} 
        code="import React"
        color="#10b981"
        speed={0.5}
      />

      {/* Binary Code Stream */}
      <BinaryStream />
      
      {/* Floating Brackets */}
      <FloatingBracket position={[-1.5, 2, -1]} type="{" speed={0.3} />
      <FloatingBracket position={[1.5, -2, -1]} type="}" speed={0.4} />
      <FloatingBracket position={[-3, 0, -2]} type="[" speed={0.5} />
      <FloatingBracket position={[3, 0, -2]} type="]" speed={0.3} />

      {/* Code Particles */}
      <CodeParticles />
      
      {/* Connection Lines between Code Blocks */}
      <CodeConnections />
    </>
  );
};

// Code Grid Background
const CodeGrid = () => {
  const gridRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.position.z = ((state.clock.elapsedTime * 0.3) % 2) - 1;
    }
  });

  return (
    <>
      <mesh ref={gridRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
        <planeGeometry args={[20, 20, 40, 40]} />
        <meshBasicMaterial color="#3b82f6" wireframe transparent opacity={0.1} />
      </mesh>
    </>
  );
};

// Floating Code Block Component
const CodeBlock = ({ 
  position, 
  code, 
  color, 
  speed 
}: { 
  position: [number, number, number]; 
  code: string; 
  color: string; 
  speed: number;
}) => {
  const blockRef = useRef<THREE.Group>(null);
  const textRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (blockRef.current) {
      blockRef.current.rotation.y = Math.sin(state.clock.elapsedTime * speed) * 0.1;
      blockRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.3;
    }
  });

  return (
    <Float speed={speed} rotationIntensity={0.2} floatIntensity={0.3}>
      <group ref={blockRef} position={position}>
        <mesh>
          <boxGeometry args={[code.length * 0.15 + 0.3, 0.4, 0.1]} />
          <meshStandardMaterial 
            color={color} 
            transparent 
            opacity={0.2}
            emissive={color}
            emissiveIntensity={0.3}
          />
        </mesh>
        <mesh ref={textRef} position={[0, 0, 0.06]}>
          <planeGeometry args={[code.length * 0.15, 0.3]} />
          <meshBasicMaterial 
            color={color} 
            transparent 
            opacity={0.8}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </Float>
  );
};

// Binary Code Stream
const BinaryStream = () => {
  const streamRef = useRef<THREE.Group>(null);
  const binaryCount = 50;
  
  const binaries = useMemo(() => {
    return Array.from({ length: binaryCount }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 10
      ],
      value: Math.random() > 0.5 ? '1' : '0',
      speed: 0.2 + Math.random() * 0.3,
    }));
  }, []);

  useFrame((state) => {
    if (streamRef.current) {
      streamRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <group ref={streamRef}>
      {binaries.map((binary, i) => (
        <Float key={i} speed={binary.speed} floatIntensity={0.2}>
          <mesh position={binary.position as [number, number, number]}>
            <boxGeometry args={[0.1, 0.1, 0.1]} />
            <meshStandardMaterial 
              color={binary.value === '1' ? '#10b981' : '#3b82f6'}
              emissive={binary.value === '1' ? '#10b981' : '#3b82f6'}
              emissiveIntensity={0.5}
              transparent
              opacity={0.7}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
};

// Floating Brackets
const FloatingBracket = ({ 
  position, 
  type, 
  speed 
}: { 
  position: [number, number, number]; 
  type: string; 
  speed: number;
}) => {
  const bracketRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (bracketRef.current) {
      bracketRef.current.rotation.z = Math.sin(state.clock.elapsedTime * speed) * 0.2;
      bracketRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed * 2) * 0.2;
    }
  });

  return (
    <Float speed={speed} floatIntensity={0.4}>
      <mesh ref={bracketRef} position={position}>
        <boxGeometry args={[0.2, 1.5, 0.1]} />
        <meshStandardMaterial 
          color="#8b5cf6"
          emissive="#8b5cf6"
          emissiveIntensity={0.6}
          transparent
          opacity={0.8}
        />
      </mesh>
    </Float>
  );
};

// Code Particles
const CodeParticles = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = 600;

  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    return pos;
  }, []);

  const colors = useMemo(() => {
    const cols = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const color = new THREE.Color();
      const hue = Math.random() > 0.5 ? 0.55 : 0.65; // Blue or Green
      color.setHSL(hue, 0.8, 0.6);
      cols[i * 3] = color.r;
      cols[i * 3 + 1] = color.g;
      cols[i * 3 + 2] = color.b;
    }
    return cols;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.03;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.03} 
        vertexColors 
        transparent 
        opacity={0.7}
        sizeAttenuation
      />
    </points>
  );
};
// Code Connections
const CodeConnections = () => {
  const linesRef = useRef<THREE.LineSegments>(null);

  const codeBlocks = useMemo(() => [
    new THREE.Vector3(-2.5, 1.5, -2),
    new THREE.Vector3(2.5, 0.5, -3),
    new THREE.Vector3(0, -1, -2.5),
    new THREE.Vector3(-3, -0.5, -3.5),
    new THREE.Vector3(3, 1, -2.5),
  ], []);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = [];
    
    // Connect code blocks that are close to each other
    for (let i = 0; i < codeBlocks.length; i++) {
      for (let j = i + 1; j < codeBlocks.length; j++) {
        if (codeBlocks[i].distanceTo(codeBlocks[j]) < 4) {
          positions.push(codeBlocks[i].x, codeBlocks[i].y, codeBlocks[i].z);
          positions.push(codeBlocks[j].x, codeBlocks[j].y, codeBlocks[j].z);
        }
      }
    }
    
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geo;
  }, [codeBlocks]);

  useFrame((state) => {
    if (linesRef.current) {
      const time = state.clock.elapsedTime;
      linesRef.current.material.opacity = 0.2 + Math.sin(time * 2) * 0.1;
    }
  });

  return (
    <lineSegments ref={linesRef} geometry={geometry}>
      <lineBasicMaterial color="#3b82f6" transparent opacity={0.2} />
    </lineSegments>
  );
};

