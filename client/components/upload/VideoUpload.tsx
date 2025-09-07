import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { X, Upload as UploadIcon, Trash2, FileVideo } from "lucide-react";
import { cn } from "@/lib/utils";

const MAX_BYTES = 2 * 1024 * 1024 * 1024; // 2GB
const ACCEPTED = ["video/mp4", "video/quicktime", "video/x-msvideo"]; // mp4, mov, avi

export type UploadState =
  | { status: "idle" }
  | { status: "ready"; file: File; previewUrl: string }
  | { status: "uploading"; file: File; previewUrl: string; progress: number }
  | { status: "uploaded"; file: File; previewUrl: string }
  | { status: "error"; message: string };

export default function VideoUpload({ onUploaded }: { onUploaded?: (file: File) => void }) {
  const [state, setState] = useState<UploadState>({ status: "idle" });
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const onFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!ACCEPTED.includes(file.type)) {
      setState({ status: "error", message: "Unsupported format. Use MP4, MOV, or AVI." });
      return;
    }
    if (file.size > MAX_BYTES) {
      setState({ status: "error", message: "File is too large. Max size is 2GB." });
      return;
    }
    const previewUrl = await generateVideoThumbnail(file).catch(() => "");
    setState({ status: "ready", file, previewUrl });
  }, []);

  const startUpload = useCallback(() => {
    if (state.status !== "ready") return;
    setState({ ...state, status: "uploading", progress: 0 });
    let p = 0;
    const id = setInterval(() => {
      p = Math.min(100, p + Math.random() * 12);
      if (p >= 100) {
        clearInterval(id);
        setState({ status: "uploaded", file: state.file, previewUrl: state.previewUrl });
        onUploaded?.(state.file);
      } else {
        setState({ status: "uploading", file: state.file, previewUrl: state.previewUrl, progress: p });
      }
    }, 300);
  }, [state, onUploaded]);

  const clear = () => setState({ status: "idle" });

  return (
    <div>
      <div
        className={cn(
          "relative rounded-xl border-2 border-dashed p-8 md:p-12 transition bg-card/40",
          dragActive ? "border-accent/70 bg-accent/5" : "border-border/60",
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          onFiles(e.dataTransfer.files);
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="video/mp4,video/quicktime,video/x-msvideo"
          className="hidden"
          onChange={(e) => onFiles(e.target.files)}
        />
        <div className="flex flex-col items-center text-center gap-4">
          <div className="size-14 rounded-full bg-primary/15 text-primary grid place-items-center">
            <UploadIcon className="size-7" />
          </div>
          <div>
            <p className="text-lg font-semibold">Drag & drop your video here</p>
            <p className="text-sm text-muted-foreground mt-1">
              or <button className="text-primary underline underline-offset-4" onClick={() => inputRef.current?.click()}>click to browse</button>
            </p>
          </div>
          <div className="text-xs text-muted-foreground flex flex-wrap justify-center gap-3">
            <span>Supported: MP4, MOV, AVI</span>
            <span>•</span>
            <span>Max size: 2GB</span>
          </div>

          {state.status === "error" && (
            <div className="w-full rounded-md border border-destructive/40 bg-destructive/10 text-destructive p-3 text-sm">
              {state.message}
            </div>
          )}

          {(state.status === "ready" || state.status === "uploading" || state.status === "uploaded") && (
            <div className="w-full rounded-lg border border-border/60 bg-background/40 p-4">
              <div className="flex items-center gap-3">
                {state.previewUrl ? (
                  <img src={state.previewUrl} alt="Preview" className="size-16 rounded object-cover" />
                ) : (
                  <div className="size-16 rounded bg-muted grid place-items-center text-muted-foreground"><FileVideo className="size-6" /></div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium">{"file" in state ? state.file.name : "Selected video"}</p>
                  {state.status === "uploading" && (
                    <div className="mt-2">
                      <Progress value={state.progress} />
                      <p className="mt-1 text-xs text-muted-foreground">Uploading… {state.progress.toFixed(0)}%</p>
                    </div>
                  )}
                  {state.status === "uploaded" && (
                    <p className="mt-1 text-xs text-emerald-400">Upload complete</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {state.status === "ready" && (
                    <Button onClick={startUpload}>Upload</Button>
                  )}
                  {state.status !== "idle" && (
                    <Button variant="outline" size="icon" onClick={clear} aria-label="Remove file">
                      <Trash2 className="size-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

async function generateVideoThumbnail(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.preload = "metadata";
    video.src = url;
    video.muted = true;
    video.playsInline = true;
    video.currentTime = 0.1;

    const onSnapshot = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 320;
        canvas.height = 180;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("no ctx");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);
        resolve(canvas.toDataURL("image/jpeg", 0.8));
      } catch (e) {
        reject(e);
      } finally {
        video.removeEventListener("canplay", onSnapshot);
      }
    };

    video.addEventListener("canplay", onSnapshot);
    video.addEventListener("error", () => reject(new Error("Preview failed")));
  });
}
