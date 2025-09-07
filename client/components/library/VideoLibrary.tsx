import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { Download, Trash2, Plus, Clock, CheckCircle2, XCircle } from "lucide-react";

export type VideoItem = {
  id: string;
  title: string;
  date: string;
  status: "Processing" | "Completed" | "Failed";
  thumbnail?: string;
};

function useLibraryData() {
  const [items, setItems] = useState<VideoItem[]>(() =>
    Array.from({ length: 32 }).map((_, i) => ({
      id: String(i + 1),
      title: `Sample Video ${i + 1}`,
      date: new Date(Date.now() - i * 86400000).toISOString(),
      status: i % 7 === 0 ? "Failed" : i % 3 === 0 ? "Processing" : "Completed",
      thumbnail: "",
    })),
  );
  return { items, setItems };
}

export default function VideoLibrary() {
  const { items, setItems } = useLibraryData();
  const [filter, setFilter] = useState<"All" | "Processing" | "Completed" | "Failed">("All");
  const [sort, setSort] = useState<"Newest" | "Oldest" | "Name">("Newest");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [page, setPage] = useState(1);
  const pageSize = 12;

  const filtered = useMemo(() => {
    let res = items;
    if (filter !== "All") res = res.filter((i) => i.status === filter);
    if (query) res = res.filter((i) => i.title.toLowerCase().includes(query.toLowerCase()));
    if (sort === "Newest") res = [...res].sort((a, b) => +new Date(b.date) - +new Date(a.date));
    if (sort === "Oldest") res = [...res].sort((a, b) => +new Date(a.date) - +new Date(b.date));
    if (sort === "Name") res = [...res].sort((a, b) => a.title.localeCompare(b.title));
    return res;
  }, [items, filter, sort, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const toggleAll = (checked: boolean) => {
    const pageIds = paged.map((i) => i.id);
    setSelected((s) => {
      const next = { ...s };
      pageIds.forEach((id) => (next[id] = checked));
      return next;
    });
  };

  const anySelected = Object.values(selected).some(Boolean);

  const bulkDelete = () => {
    const ids = Object.entries(selected).filter(([, v]) => v).map(([k]) => k);
    setItems((list) => list.filter((i) => !ids.includes(i.id)));
    setSelected({});
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-end gap-3 justify-between">
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Search</p>
            <Input placeholder="Search videos" value={query} onChange={(e) => setQuery(e.target.value)} className="w-64" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Filter</p>
            <Select value={filter} onValueChange={(v: any) => setFilter(v)}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Processing">Processing</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Sort</p>
            <Select value={sort} onValueChange={(v: any) => setSort(v)}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Newest">Newest</SelectItem>
                <SelectItem value="Oldest">Oldest</SelectItem>
                <SelectItem value="Name">Name</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" disabled={!anySelected} onClick={() => {}}><Download className="mr-2 size-4"/>Download</Button>
          <Button variant="destructive" disabled={!anySelected} onClick={bulkDelete}><Trash2 className="mr-2 size-4"/>Delete</Button>
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-border/60 overflow-hidden">
        <div className="p-3 border-b border-border/60 flex items-center gap-3">
          <Checkbox onCheckedChange={(v) => toggleAll(Boolean(v))} />
          <p className="text-sm text-muted-foreground">Select page</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
          {paged.map((i) => (
            <div key={i.id} className="group rounded-lg border border-border/60 overflow-hidden bg-card/40">
              <div className="relative aspect-video bg-muted">
                {i.thumbnail ? (
                  <img src={i.thumbnail} alt="thumb" className="absolute inset-0 size-full object-cover" />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
                )}
                <div className="absolute top-2 left-2 bg-background/70 backdrop-blur rounded px-2 py-1 text-xs flex items-center gap-1">
                  {i.status === "Processing" && <Clock className="size-3" />}
                  {i.status === "Completed" && <CheckCircle2 className="size-3 text-emerald-400" />}
                  {i.status === "Failed" && <XCircle className="size-3 text-destructive" />}
                  {i.status}
                </div>
                <div className="absolute top-2 right-2">
                  <Checkbox checked={Boolean(selected[i.id])} onCheckedChange={(v) => setSelected((s) => ({ ...s, [i.id]: Boolean(v) }))} />
                </div>
              </div>
              <div className="p-3">
                <p className="font-medium truncate" title={i.title}>{i.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{new Date(i.date).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-border/60 p-3">
          <Pagination>
            <PaginationContent className="flex items-center gap-2">
              <PaginationItem>
                <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); setPage((p) => Math.max(1, p - 1)); }} />
              </PaginationItem>
              <span className="text-xs text-muted-foreground">Page {page} of {totalPages}</span>
              <PaginationItem>
                <PaginationNext href="#" onClick={(e) => { e.preventDefault(); setPage((p) => Math.min(totalPages, p + 1)); }} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>

      <Button className="fixed bottom-6 right-6 shadow-lg" size="lg">
        <Plus className="mr-2 size-5" /> New Upload
      </Button>
    </div>
  );
}
