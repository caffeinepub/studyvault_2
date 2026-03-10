import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Award,
  Beaker,
  BookOpen,
  GraduationCap,
  Search,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useMemo, useState } from "react";
import type { Material } from "../backend";
import { ClassCategory, MaterialType, Subject } from "../backend";
import MaterialCard from "../components/MaterialCard";
import { useIncrementDownload, useListMaterials } from "../hooks/useQueries";

const CATEGORIES = [
  { value: "all", label: "All", icon: <BookOpen className="w-5 h-5" /> },
  {
    value: ClassCategory.class10,
    label: "Class 10",
    icon: <GraduationCap className="w-5 h-5" />,
  },
  {
    value: ClassCategory.class11,
    label: "Class 11",
    icon: <GraduationCap className="w-5 h-5" />,
  },
  {
    value: ClassCategory.class12,
    label: "Class 12",
    icon: <GraduationCap className="w-5 h-5" />,
  },
  { value: ClassCategory.jee, label: "JEE", icon: <Zap className="w-5 h-5" /> },
  {
    value: ClassCategory.neet,
    label: "NEET",
    icon: <Beaker className="w-5 h-5" />,
  },
];

const CATEGORY_CARD_STYLES: Record<string, string> = {
  all: "from-slate-500 to-slate-700",
  [ClassCategory.class10]: "from-blue-500 to-blue-700",
  [ClassCategory.class11]: "from-purple-500 to-purple-700",
  [ClassCategory.class12]: "from-indigo-500 to-indigo-700",
  [ClassCategory.jee]: "from-orange-500 to-orange-600",
  [ClassCategory.neet]: "from-green-500 to-green-700",
};

const SUBJECT_OPTIONS = [
  { value: Subject.physics, label: "Physics" },
  { value: Subject.chemistry, label: "Chemistry" },
  { value: Subject.maths, label: "Mathematics" },
  { value: Subject.biology, label: "Biology" },
  { value: Subject.english, label: "English" },
  { value: Subject.hindi, label: "Hindi" },
  { value: Subject.socialScience, label: "Social Science" },
  { value: Subject.other, label: "Other" },
];

const TYPE_OPTIONS = [
  { value: MaterialType.ebook, label: "eBook" },
  { value: MaterialType.notes, label: "Notes" },
  { value: MaterialType.testSeries, label: "Test Series" },
  { value: MaterialType.samplePaper, label: "Sample Paper" },
  { value: MaterialType.solutions, label: "Solutions" },
  { value: MaterialType.videoNotes, label: "Video Notes" },
  { value: MaterialType.other, label: "Other" },
];

const SKELETON_KEYS = ["sk-1", "sk-2", "sk-3", "sk-4", "sk-5", "sk-6"];

const SAMPLE_MATERIALS: Material[] = [
  {
    id: "sample-1",
    title: "NCERT Physics Part 1 — Class 12 Complete Notes",
    subject: Subject.physics,
    classCategory: ClassCategory.class12,
    description:
      "Comprehensive notes covering electrostatics, current electricity, and magnetic effects with solved examples.",
    fileName: "ncert-physics-12-part1.pdf",
    fileSize: BigInt(8543210),
    isActive: true,
    downloadCount: BigInt(2847),
    materialType: MaterialType.notes,
    uploadedAt: BigInt(Date.now() * 1_000_000),
    uploadedBy: {
      toText: () => "admin",
      compareTo: () => 0,
      isAnonymous: () => false,
      _isPrincipal: true,
      toUint8Array: () => new Uint8Array(),
    } as any,
    blob: {
      getDirectURL: () => "#",
      getBytes: async () => new Uint8Array(),
      withUploadProgress: function () {
        return this;
      },
    } as any,
  },
  {
    id: "sample-2",
    title: "JEE Advanced Previous 10 Years Solved Papers",
    subject: Subject.maths,
    classCategory: ClassCategory.jee,
    description:
      "Complete collection of JEE Advanced papers from 2014-2024 with detailed solutions and pattern analysis.",
    fileName: "jee-advanced-10years.pdf",
    fileSize: BigInt(15234567),
    isActive: true,
    downloadCount: BigInt(5621),
    materialType: MaterialType.testSeries,
    uploadedAt: BigInt(Date.now() * 1_000_000),
    uploadedBy: {
      toText: () => "admin",
      compareTo: () => 0,
      isAnonymous: () => false,
      _isPrincipal: true,
      toUint8Array: () => new Uint8Array(),
    } as any,
    blob: {
      getDirectURL: () => "#",
      getBytes: async () => new Uint8Array(),
      withUploadProgress: function () {
        return this;
      },
    } as any,
  },
  {
    id: "sample-3",
    title: "NEET Biology — Human Physiology Chapter Notes",
    subject: Subject.biology,
    classCategory: ClassCategory.neet,
    description:
      "Detailed notes on digestion, respiration, circulation, and excretion with NEET-focused MCQs.",
    fileName: "neet-biology-physiology.pdf",
    fileSize: BigInt(6234000),
    isActive: true,
    downloadCount: BigInt(3912),
    materialType: MaterialType.notes,
    uploadedAt: BigInt(Date.now() * 1_000_000),
    uploadedBy: {
      toText: () => "admin",
      compareTo: () => 0,
      isAnonymous: () => false,
      _isPrincipal: true,
      toUint8Array: () => new Uint8Array(),
    } as any,
    blob: {
      getDirectURL: () => "#",
      getBytes: async () => new Uint8Array(),
      withUploadProgress: function () {
        return this;
      },
    } as any,
  },
  {
    id: "sample-4",
    title: "Class 10 Mathematics — Full Syllabus Sample Papers",
    subject: Subject.maths,
    classCategory: ClassCategory.class10,
    description:
      "15 full-length sample papers for CBSE Class 10 board exams with step-by-step solutions.",
    fileName: "class10-maths-samplepapers.pdf",
    fileSize: BigInt(4567890),
    isActive: true,
    downloadCount: BigInt(7234),
    materialType: MaterialType.samplePaper,
    uploadedAt: BigInt(Date.now() * 1_000_000),
    uploadedBy: {
      toText: () => "admin",
      compareTo: () => 0,
      isAnonymous: () => false,
      _isPrincipal: true,
      toUint8Array: () => new Uint8Array(),
    } as any,
    blob: {
      getDirectURL: () => "#",
      getBytes: async () => new Uint8Array(),
      withUploadProgress: function () {
        return this;
      },
    } as any,
  },
  {
    id: "sample-5",
    title: "Class 11 Chemistry — Organic Chemistry eBook",
    subject: Subject.chemistry,
    classCategory: ClassCategory.class11,
    description:
      "Complete organic chemistry ebook covering all reactions, mechanisms, and named reactions for Class 11.",
    fileName: "class11-organic-chem.epub",
    fileSize: BigInt(9876543),
    isActive: true,
    downloadCount: BigInt(1834),
    materialType: MaterialType.ebook,
    uploadedAt: BigInt(Date.now() * 1_000_000),
    uploadedBy: {
      toText: () => "admin",
      compareTo: () => 0,
      isAnonymous: () => false,
      _isPrincipal: true,
      toUint8Array: () => new Uint8Array(),
    } as any,
    blob: {
      getDirectURL: () => "#",
      getBytes: async () => new Uint8Array(),
      withUploadProgress: function () {
        return this;
      },
    } as any,
  },
  {
    id: "sample-6",
    title: "JEE Mains Physics Formula Sheet — All Chapters",
    subject: Subject.physics,
    classCategory: ClassCategory.jee,
    description:
      "Quick revision formula sheet covering all 28 chapters of JEE Mains Physics syllabus.",
    fileName: "jee-physics-formulas.pdf",
    fileSize: BigInt(1234567),
    isActive: true,
    downloadCount: BigInt(9103),
    materialType: MaterialType.notes,
    uploadedAt: BigInt(Date.now() * 1_000_000),
    uploadedBy: {
      toText: () => "admin",
      compareTo: () => 0,
      isAnonymous: () => false,
      _isPrincipal: true,
      toUint8Array: () => new Uint8Array(),
    } as any,
    blob: {
      getDirectURL: () => "#",
      getBytes: async () => new Uint8Array(),
      withUploadProgress: function () {
        return this;
      },
    } as any,
  },
];

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const { data: backendMaterials, isLoading } = useListMaterials();
  const incrementDownload = useIncrementDownload();

  const allMaterials = useMemo(() => {
    if (backendMaterials && backendMaterials.length > 0)
      return backendMaterials;
    return SAMPLE_MATERIALS;
  }, [backendMaterials]);

  const filteredMaterials = useMemo(() => {
    let items = allMaterials;
    if (selectedCategory !== "all") {
      items = items.filter((m) => m.classCategory === selectedCategory);
    }
    if (selectedSubject !== "all") {
      items = items.filter((m) => m.subject === selectedSubject);
    }
    if (selectedType !== "all") {
      items = items.filter((m) => m.materialType === selectedType);
    }
    if (searchTerm.trim()) {
      const lc = searchTerm.toLowerCase();
      items = items.filter(
        (m) =>
          m.title.toLowerCase().includes(lc) ||
          m.description.toLowerCase().includes(lc),
      );
    }
    return items;
  }, [
    allMaterials,
    selectedCategory,
    selectedSubject,
    selectedType,
    searchTerm,
  ]);

  const handleDownload = useCallback(
    async (material: Material) => {
      setDownloadingId(material.id);
      try {
        if (!material.id.startsWith("sample-")) {
          await incrementDownload.mutateAsync(material.id);
        }
        const url = material.blob.getDirectURL();
        if (url && url !== "#") {
          window.open(url, "_blank", "noopener,noreferrer");
        }
      } catch (err) {
        console.error("Download error", err);
      } finally {
        setDownloadingId(null);
      }
    },
    [incrementDownload],
  );

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-mesh py-16 md:py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 bg-accent/20 border border-accent/30 rounded-full px-4 py-1.5 mb-6">
              <Award className="w-4 h-4 text-accent-foreground" />
              <span className="text-sm font-medium text-accent-foreground">
                100% Free Study Materials
              </span>
            </div>
            <h1 className="font-display font-bold text-4xl md:text-6xl text-foreground mb-4 leading-tight tracking-tight">
              Your Complete{" "}
              <span className="relative">
                <span className="relative z-10">Study Hub</span>
                <span className="absolute bottom-1 left-0 right-0 h-3 bg-accent/30 -z-0 rounded" />
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
              Free study materials for{" "}
              <strong className="text-foreground">Class 10, 11, 12</strong>,{" "}
              <strong className="text-foreground">JEE</strong> &amp;{" "}
              <strong className="text-foreground">NEET</strong> — eBooks, notes,
              test series &amp; more.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                data-ocid="home.search_input"
                placeholder="Search for topics, subjects, or materials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-14 text-base rounded-xl border-2 border-border focus:border-primary bg-card shadow-card"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Cards */}
      <section className="py-8 bg-muted/30 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {CATEGORIES.map((cat, i) => (
              <motion.button
                key={cat.value}
                type="button"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.06, duration: 0.3 }}
                onClick={() => setSelectedCategory(cat.value)}
                data-ocid="home.category.tab"
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all font-medium text-sm ${
                  selectedCategory === cat.value
                    ? `bg-gradient-to-br ${CATEGORY_CARD_STYLES[cat.value]} text-white border-transparent shadow-md`
                    : "bg-card border-border text-muted-foreground hover:border-primary/40 hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {cat.icon}
                <span className="text-xs font-semibold">{cat.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Filters + Materials Grid */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          {/* Filters Row */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8 items-start sm:items-center justify-between">
            <div>
              <h2 className="font-display font-semibold text-xl text-foreground">
                {selectedCategory === "all"
                  ? "All Materials"
                  : `${CATEGORIES.find((c) => c.value === selectedCategory)?.label ?? ""} Materials`}
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  ({filteredMaterials.length} items)
                </span>
              </h2>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Select
                value={selectedSubject}
                onValueChange={setSelectedSubject}
              >
                <SelectTrigger
                  data-ocid="home.subject_select"
                  className="w-40 h-9 text-sm"
                >
                  <SelectValue placeholder="Subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {SUBJECT_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger
                  data-ocid="home.type_select"
                  className="w-40 h-9 text-sm"
                >
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {TYPE_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div
              data-ocid="materials.loading_state"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {SKELETON_KEYS.map((k) => (
                <div
                  key={k}
                  className="rounded-xl border border-border bg-card p-5 space-y-3"
                >
                  <Skeleton className="h-4 w-1/3 rounded-full" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-4/5" />
                  <div className="flex justify-between pt-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-8 w-24 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && filteredMaterials.length === 0 && (
            <div
              data-ocid="materials.empty_state"
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-4">
                <BookOpen className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                No materials found
              </h3>
              <p className="text-muted-foreground text-sm max-w-sm">
                Try changing your filters or search term to find what
                you&apos;re looking for.
              </p>
            </div>
          )}

          {/* Materials Grid */}
          {!isLoading && filteredMaterials.length > 0 && (
            <div
              data-ocid="materials.list"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {filteredMaterials.map((material, idx) => (
                <MaterialCard
                  key={material.id}
                  material={material}
                  index={idx}
                  onDownload={handleDownload}
                  isDownloading={downloadingId === material.id}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
