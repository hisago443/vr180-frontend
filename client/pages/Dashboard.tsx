import Layout from "@/components/layout/Layout";
import VideoUpload from "@/components/upload/VideoUpload";
import ConversionStatus from "@/components/dashboard/ConversionStatus";
import VRPlayer from "@/components/player/VRPlayer";
import DownloadShare from "@/components/share/DownloadShare";
import { useState } from "react";

export default function Dashboard() {
  const [thumb, setThumb] = useState<string | undefined>();
  const [hasJob, setHasJob] = useState(false);

  return (
    <Layout>
      <div className="container py-10 space-y-8">
        <h1 className="text-2xl font-bold">Conversion Dashboard</h1>
        <VideoUpload onUploaded={() => setHasJob(true)} />
        {hasJob && (
          <ConversionStatus thumbnail={thumb} onCancel={() => setHasJob(false)} />
        )}
        <div className="grid lg:grid-cols-2 gap-6">
          <VRPlayer />
          <DownloadShare />
        </div>
      </div>
    </Layout>
  );
}
