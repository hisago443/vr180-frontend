import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { CheckCircle2, UploadCloud, Play, ShieldCheck } from "lucide-react";
import VideoUpload from "@/components/upload/VideoUpload";

export default function Index() {
  return (
    <Layout>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] rounded-full bg-primary/20 blur-3xl opacity-40" />
        </div>
        <div className="container py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="inline-flex items-center rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs text-muted-foreground mb-4">AI-powered VR conversion</p>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
              Transform 2D Videos into Immersive VR 180° Experiences
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Our AI analyzes depth, motion, and perspective to convert your standard videos into lifelike VR 180�� content—ready for Quest, Vision Pro, and more.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href="#get-started"><Button size="lg">Start Converting Videos</Button></a>
              <a href="#how"><Button variant="outline" size="lg">How It Works</Button></a>
            </div>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { label: "Real-time Processing" },
                { label: "VR 180° Output" },
                { label: "No Special Equipment" },
              ].map((f) => (
                <div key={f.label} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="size-4 text-emerald-400" /> {f.label}
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-primary/20 to-accent/20 p-1">
              <div className="rounded-xl overflow-hidden bg-card/60 shadow-xl">
                <img src="/placeholder.svg" alt="VR preview" className="w-full" />
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 rotate-[-3deg] hidden md:block">
              <div className="rounded-xl border border-border/60 bg-background/80 backdrop-blur p-3 shadow-lg">
                <div className="flex items-center gap-2 text-sm"><UploadCloud className="size-4"/> Drop your video</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how" className="container py-12 md:py-16">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="rounded-xl border border-border/60 bg-card/50 p-6">
            <div className="size-10 rounded bg-primary/15 text-primary grid place-items-center mb-3"><UploadCloud className="size-5"/></div>
            <h3 className="font-semibold">Upload</h3>
            <p className="text-sm text-muted-foreground mt-1">Drag-and-drop any MP4, MOV, or AVI up to 2GB. We handle the rest.</p>
          </div>
          <div className="rounded-xl border border-border/60 bg-card/50 p-6">
            <div className="size-10 rounded bg-primary/15 text-primary grid place-items-center mb-3"><ShieldCheck className="size-5"/></div>
            <h3 className="font-semibold">Convert</h3>
            <p className="text-sm text-muted-foreground mt-1">Our AI reconstructs depth and creates immersive stereo views in real-time.</p>
          </div>
          <div className="rounded-xl border border-border/60 bg-card/50 p-6">
            <div className="size-10 rounded bg-primary/15 text-primary grid place-items-center mb-3"><Play className="size-5"/></div>
            <h3 className="font-semibold">Experience</h3>
            <p className="text-sm text-muted-foreground mt-1">Preview in-browser and download VR 180° for your headset at 1080p or 4K.</p>
          </div>
        </div>
      </section>

      <section id="get-started" className="container py-12 md:py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Upload your first video</h2>
          <VideoUpload />
        </div>
      </section>
    </Layout>
  );
}
