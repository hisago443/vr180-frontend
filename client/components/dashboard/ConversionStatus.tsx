import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Pause, Play, XCircle } from "lucide-react";

const STAGES = ["Uploading", "Processing", "Generating", "Complete"] as const;

type Stage = typeof STAGES[number];

export default function ConversionStatus({
  thumbnail,
  onCancel,
}: {
  thumbnail?: string;
  onCancel?: () => void;
}) {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<Stage>("Uploading");
  const [running, setRunning] = useState(true);
  const [logs, setLogs] = useState<string[]>([]);
  const [queuePos, setQueuePos] = useState<number | null>(null);

  useEffect(() => {
    let id: number | undefined;
    if (running && stage !== "Complete") {
      id = window.setInterval(() => {
        setProgress((p) => {
          const inc = stage === "Uploading" ? 6 : stage === "Processing" ? 3 : 4;
          let next = Math.min(100, p + Math.random() * inc);
          if (next >= 100) {
            advanceStage();
            next = 0;
          }
          return next;
        });
        setLogs((l) => [
          `${new Date().toLocaleTimeString()} • ${stage}…`,
          ...l
        ].slice(0, 50));
      }, 500);
    }
    return () => clearInterval(id);
  }, [running, stage]);

  const advanceStage = () => {
    setStage((s) => {
      const idx = STAGES.indexOf(s);
      return STAGES[Math.min(STAGES.length - 1, idx + 1)];
    });
  };

  useEffect(() => {
    if (stage === "Uploading") setQueuePos(2);
    if (stage === "Processing") setQueuePos(1);
    if (stage === "Generating") setQueuePos(0);
    if (stage === "Complete") setQueuePos(null);
  }, [stage]);

  const eta = useMemo(() => {
    if (stage === "Complete") return "Done";
    const base = stage === "Uploading" ? 20 : stage === "Processing" ? 80 : 30;
    const remaining = Math.max(5, Math.round(((100 - progress) / 100) * base));
    return `${remaining}s`;
  }, [stage, progress]);

  return (
    <div className="rounded-xl border border-border/60 bg-card/50 p-4 md:p-6">
      <div className="flex items-center gap-4">
        <img
          src={thumbnail}
          alt="Current video"
          className="size-20 rounded object-cover bg-muted"
          onError={(e) => ((e.currentTarget.style.display = "none"))}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className="font-semibold">Current Job</p>
            <p className="text-xs text-muted-foreground">ETA: {eta}</p>
          </div>
          <div className="mt-2">
            <Progress value={stage === "Complete" ? 100 : progress} />
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              {STAGES.map((s, i) => (
                <span key={s} className={cn(
                  "rounded-full px-2 py-0.5 border",
                  s === stage ? "border-accent text-foreground" : "border-border"
                )}>
                  {s}
                  {i < STAGES.length - 1 && <span className="mx-2 opacity-60">→</span>}
                </span>
              ))}
            </div>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {stage === "Uploading" && "Uploading video to secure storage…"}
            {stage === "Processing" && "Analyzing depth and motion vectors with AI…"}
            {stage === "Generating" && "Composing VR 180° output with stereo correction…"}
            {stage === "Complete" && "Conversion complete. Ready to preview/download."}
          </p>
          {queuePos !== null && (
            <p className="mt-1 text-xs text-muted-foreground">Queue position: {queuePos}</p>
          )}
        </div>
        <div className="hidden sm:flex items-center gap-2 self-start">
          {running ? (
            <Button variant="outline" onClick={() => setRunning(false)}><Pause className="mr-2 size-4"/>Pause</Button>
          ) : (
            <Button variant="outline" onClick={() => setRunning(true)}><Play className="mr-2 size-4"/>Resume</Button>
          )}
          <Button variant="destructive" onClick={onCancel}><XCircle className="mr-2 size-4"/>Cancel</Button>
        </div>
      </div>
      <div className="sm:hidden mt-4 flex items-center gap-2">
        {running ? (
          <Button variant="outline" onClick={() => setRunning(false)} className="flex-1"><Pause className="mr-2 size-4"/>Pause</Button>
        ) : (
          <Button variant="outline" onClick={() => setRunning(true)} className="flex-1"><Play className="mr-2 size-4"/>Resume</Button>
        )}
        <Button variant="destructive" onClick={onCancel} className="flex-1"><XCircle className="mr-2 size-4"/>Cancel</Button>
      </div>
      <div className="mt-6">
        <p className="text-sm font-medium mb-2">Real-time updates</p>
        <div className="h-32 overflow-auto rounded-md border border-border/60 bg-background/40 p-3 text-xs text-muted-foreground space-y-1">
          {logs.map((l, i) => (
            <div key={i}>{l}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
