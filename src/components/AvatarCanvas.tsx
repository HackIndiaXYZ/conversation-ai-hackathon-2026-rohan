"use client";

import React, { useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, Environment, ContactShadows } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { VRM, VRMLoaderPlugin } from "@pixiv/three-vrm";

interface AvatarProps { url: string; viseme: number; mood: string; onError: () => void; }

const Avatar = ({ url, viseme, mood, onError }: AvatarProps) => {
  const [vrm, setVrm] = useState<VRM | null>(null);

  useEffect(() => {
    const loader = new GLTFLoader();
    loader.register((parser) => new VRMLoaderPlugin(parser));
    loader.load(url, (gltf) => {
        const vrmData = gltf.userData.vrm as VRM;
        gltf.scene.rotation.y = Math.PI;
        setVrm(vrmData);
    }, undefined, () => onError());
  }, [url, onError]);

  useFrame(({ clock }) => {
    if (vrm?.expressionManager) {
        vrm.expressionManager.setValue("aa", viseme);
        if (mood === "Engaged") vrm.expressionManager.setValue("happy", 0.5);
        if (mood === "Skeptical") vrm.expressionManager.setValue("angry", 0.2);
        vrm.expressionManager.update();
    }
  });

  return vrm ? <primitive object={vrm.scene} /> : null;
};

export default function AvatarCanvas({ url, viseme, mood }: { url: string, viseme: number, mood: string }) {
  const [error, setError] = useState(false);
  return (
    <div className="w-full h-full min-h-[400px] bg-slate-900 rounded-2xl overflow-hidden relative">
      {error && <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-900/80 text-white p-6 text-center"><p className="mb-4">Avatar failed to load</p></div>}
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 1.5, 0.8]} fov={40} />
        <Environment preset="city" />
        <Avatar url={url} viseme={viseme} mood={mood} onError={() => setError(true)} />
        <ContactShadows opacity={0.4} scale={5} blur={2} far={4} resolution={256} color="#000000" />
      </Canvas>
    </div>
  );
}
