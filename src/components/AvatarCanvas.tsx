"use client";

import React, { useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { VRM, VRMLoaderPlugin } from "@pixiv/three-vrm";

interface AvatarProps {
  url: string;
  viseme: number;
}

const Avatar = ({ url, viseme }: AvatarProps) => {
  const [vrm, setVrm] = useState<VRM | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loader = new GLTFLoader();
    loader.register((parser) => new VRMLoaderPlugin(parser));

    loader.load(
      url,
      (gltf) => {
        const vrmData = gltf.userData.vrm as VRM;
        gltf.scene.rotation.y = Math.PI;
        setVrm(vrmData);
      },
      undefined,
      () => setError(true)
    );
  }, [url]);

  useFrame(({ clock }) => {
    if (vrm) {
      if (vrm.expressionManager) {
        vrm.expressionManager.setValue("aa", viseme);
        vrm.expressionManager.update();
      }
      const t = clock.getElapsedTime();
      if (vrm.humanoid) {
        const head = vrm.humanoid.getRawBoneNode("head");
        if (head) {
          head.rotation.y = Math.sin(t * 0.5) * 0.1;
          head.rotation.x = Math.cos(t * 0.8) * 0.05;
        }
      }
    }
  });

  if (error) return <mesh><boxGeometry args={[1, 1, 1]} /><meshStandardMaterial color="red" /></mesh>;
  return vrm ? <primitive object={vrm.scene} /> : null;
};

export default function AvatarCanvas({ url, viseme }: AvatarProps) {
  return (
    <div className="w-full h-full min-h-[400px] bg-slate-900 rounded-2xl overflow-hidden relative">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 1.5, 0.8]} fov={40} />
        <OrbitControls 
          target={[0, 1.4, 0]} 
          enableZoom={false} 
          enablePan={false}
          minPolarAngle={Math.PI / 2.5}
          maxPolarAngle={Math.PI / 1.8}
        />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <Environment preset="city" />
        
        <Avatar url={url} viseme={viseme} />
        
        <ContactShadows 
          opacity={0.4} 
          scale={5} 
          blur={2} 
          far={4} 
          resolution={256} 
          color="#000000" 
        />
      </Canvas>
      
      {/* Overlay for status */}
      <div className="absolute bottom-4 left-4 flex gap-2">
        <div className="px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-xs text-white flex items-center gap-2 border border-white/20">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Live Perspective
        </div>
      </div>
    </div>
  );
}
