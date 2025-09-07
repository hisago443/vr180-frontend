import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, Download, Share2, Check } from "lucide-react";

export default function DownloadShare({ baseUrl }: { baseUrl?: string }) {
  const url = baseUrl || window.location.origin + "/viewer/demo";
  const [copied, setCopied] = useState(false);
  const [format, setFormat] = useState("vr180");
  const [resolution, setResolution] = useState("1080p");
  const qrSrc = useMemo(() => {
    const data = encodeURIComponent(url);
    return `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${data}`;
  }, [url]);

  const copy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="rounded-xl border border-border/60 bg-card/40 p-4 md:p-6">
      <div className="grid md:grid-cols-3 gap-6 items-start">
        <div className="md:col-span-2 space-y-3">
          <div className="grid sm:grid-cols-3 gap-3">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Format</p>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="original">Original</SelectItem>
                  <SelectItem value="vr180">VR 180°</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Resolution</p>
              <Select value={resolution} onValueChange={setResolution}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1080p">1080p</SelectItem>
                  <SelectItem value="4k">4K</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button className="w-full"><Download className="mr-2 size-4"/>Download</Button>
            </div>
          </div>
          <div className="rounded-md border border-border/60 p-3 text-xs text-muted-foreground">
            VR 180° videos are compatible with Meta Quest, Apple Vision Pro, and YouTube VR. Use the highest resolution your device supports for best quality.
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline"><Share2 className="mr-2 size-4"/>Twitter</Button>
            <Button variant="outline">Facebook</Button>
            <Button variant="outline">WhatsApp</Button>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input value={url} readOnly />
            <Button variant="outline" onClick={copy}>{copied ? <><Check className="mr-2 size-4"/>Copied</> : <><Copy className="mr-2 size-4"/>Copy Link</>}</Button>
          </div>
          <p className="text-xs text-muted-foreground">Links may expire after 7 days for security. You can regenerate a new link anytime.</p>
        </div>
        <div className="flex flex-col items-center gap-2">
          <img src={qrSrc} alt="QR code" className="rounded border border-border/60" />
          <p className="text-xs text-muted-foreground text-center">Scan to open on your headset or mobile device</p>
        </div>
      </div>
    </div>
  );
}
