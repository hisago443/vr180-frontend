import Layout from "@/components/layout/Layout";
import VideoLibrary from "@/components/library/VideoLibrary";

export default function Library() {
  return (
    <Layout>
      <div className="container py-10">
        <h1 className="text-2xl font-bold mb-6">Your Video Library</h1>
        <VideoLibrary />
      </div>
    </Layout>
  );
}
