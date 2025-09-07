import Layout from "@/components/layout/Layout";

export default function HowItWorks() {
  return (
    <Layout>
      <div className="container py-10 space-y-6">
        <h1 className="text-3xl font-bold">How It Works</h1>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="rounded-xl border border-border/60 bg-card/50 p-6">
            <h3 className="font-semibold">1. Upload</h3>
            <p className="text-sm text-muted-foreground mt-2">Upload MP4, MOV, or AVI up to 2GB. Our uploader validates format and size and generates a quick preview.</p>
          </div>
          <div className="rounded-xl border border-border/60 bg-card/50 p-6">
            <h3 className="font-semibold">2. AI Conversion</h3>
            <p className="text-sm text-muted-foreground mt-2">We estimate per-pixel depth and reconstruct stereo pairs to produce VR 180° output with proper perspective.</p>
          </div>
          <div className="rounded-xl border border-border/60 bg-card/50 p-6">
            <h3 className="font-semibold">3. Preview & Download</h3>
            <p className="text-sm text-muted-foreground mt-2">Use the in-browser VR viewer, then download in 1080p or 4K. Share via link or QR code for headsets.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
