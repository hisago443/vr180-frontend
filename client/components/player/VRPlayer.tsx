import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Volume2, VolumeX, Maximize2, Minimize2, Play, Pause, RotateCcw, Headphones } from "lucide-react";
import * as THREE from "three";

function VideoSphere({ video }: { video?: HTMLVideoElement | null }) {
  const texture = useRef<THREE.VideoTexture>();
  useEffect(() => {
    if (video) {
      texture.current = new THREE.VideoTexture(video);
      texture.current.minFilter = THREE.LinearFilter;
      texture.current.magFilter = THREE.LinearFilter;
      texture.current.format = THREE.RGBFormat;
    } else {
      texture.current = undefined;
    }
    return () => {
      texture.current?.dispose();
    };
  }, [video]);

  return (
    <mesh scale={-1}>
      <sphereGeometry args={[500, 60, 40]} />
      {texture.current ? (
        <meshBasicMaterial map={texture.current} side={THREE.BackSide} />
      ) : (
        <meshBasicMaterial color={new THREE.Color("#0b1220")} side={THREE.BackSide} />
      )}
    </mesh>
  );
}

function Instructions() {
  const { gl } = useThree();
  useEffect(() => {
    const el = gl.domElement;
    el.style.cursor = "grab";
    const down = () => (el.style.cursor = "grabbing");
    const up = () => (el.style.cursor = "grab");
    el.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    return () => { el.removeEventListener("pointerdown", down); window.removeEventListener("pointerup", up); };
  }, [gl]);
  return null;
}

export default function VRPlayer({ src }: { src?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [quality, setQuality] = useState("1080p");
  const [fs, setFs] = useState(false);

  useEffect(() => {
    const onFsChange = () => setFs(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const toggleFs = () => {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) el.requestFullscreen();
    else document.exitFullscreen();
  };

  const toggle = async () => {
    const v = videoRef.current; if (!v) return;
    if (playing) { v.pause(); setPlaying(false); }
    else { await v.play().catch(() => {}); setPlaying(true); }
  };

  return (
    <div ref={containerRef} className="rounded-xl overflow-hidden border border-border/60 bg-card/40">
      <div className="relative aspect-video">
        <Canvas camera={{ position: [0, 0, 0.1] }}>
          <Instructions />
          <VideoSphere video={videoRef.current} />
        </Canvas>
        <div className="absolute inset-0 pointer-events-none grid place-items-center">
          <div className="bg-background/40 backdrop-blur px-3 py-1.5 rounded text-xs text-center">
            Use mouse/touch to look around
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between p-3 border-t border-border/60 gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={toggle} aria-label={playing ? "Pause" : "Play"}>
            {playing ? <Pause className="size-4"/> : <Play className="size-4"/>}
          </Button>
          <Button variant="outline" size="icon" onClick={() => { const v = videoRef.current; if (!v) return; v.muted = !v.muted; setMuted(v.muted); }} aria-label={muted ? "Unmute" : "Mute"}>
            {muted ? <VolumeX className="size-4"/> : <Volume2 className="size-4"/>}
          </Button>
          <Button variant="outline" size="icon" onClick={() => { const v = videoRef.current; if (!v) return; v.currentTime = 0; }} aria-label="Restart">
            <RotateCcw className="size-4"/>
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Select value={quality} onValueChange={setQuality}>
            <SelectTrigger className="w-28"><SelectValue placeholder="Quality" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="1080p">1080p</SelectItem>
              <SelectItem value="4k">4K</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={toggleFs}>
            {fs ? <Minimize2 className="mr-2 size-4"/> : <Maximize2 className="mr-2 size-4"/>}
            Fullscreen
          </Button>
        </div>
      </div>
      <div className="px-3 pb-3 flex items-center gap-3 text-muted-foreground text-xs">
        <Headphones className="size-4" /> Optimized for VR headsets: Quest • Vision Pro
      </div>
      <video ref={videoRef} src={src} playsInline className="hidden" />
    </div>
  );
}
