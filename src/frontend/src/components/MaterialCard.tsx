import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  BookOpen,
  Calculator,
  Download,
  FileText,
  FlaskConical,
  Globe,
  Languages,
} from "lucide-react";
import { motion } from "motion/react";
import type { Material } from "../backend";
import { ClassCategory, MaterialType, Subject } from "../backend";

const categoryConfig: Record<ClassCategory, { label: string; color: string }> =
  {
    [ClassCategory.class10]: {
      label: "Class 10",
      color: "bg-blue-100 text-blue-700 border-blue-200",
    },
    [ClassCategory.class11]: {
      label: "Class 11",
      color: "bg-purple-100 text-purple-700 border-purple-200",
    },
    [ClassCategory.class12]: {
      label: "Class 12",
      color: "bg-indigo-100 text-indigo-700 border-indigo-200",
    },
    [ClassCategory.jee]: {
      label: "JEE",
      color: "bg-orange-100 text-orange-700 border-orange-200",
    },
    [ClassCategory.neet]: {
      label: "NEET",
      color: "bg-green-100 text-green-700 border-green-200",
    },
  };

const typeConfig: Record<MaterialType, { label: string; color: string }> = {
  [MaterialType.ebook]: {
    label: "eBook",
    color: "bg-sky-50 text-sky-700 border-sky-200",
  },
  [MaterialType.notes]: {
    label: "Notes",
    color: "bg-yellow-50 text-yellow-700 border-yellow-200",
  },
  [MaterialType.testSeries]: {
    label: "Test Series",
    color: "bg-red-50 text-red-700 border-red-200",
  },
  [MaterialType.samplePaper]: {
    label: "Sample Paper",
    color: "bg-teal-50 text-teal-700 border-teal-200",
  },
  [MaterialType.solutions]: {
    label: "Solutions",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  [MaterialType.videoNotes]: {
    label: "Video Notes",
    color: "bg-pink-50 text-pink-700 border-pink-200",
  },
  [MaterialType.other]: {
    label: "Other",
    color: "bg-gray-50 text-gray-700 border-gray-200",
  },
};

const subjectIcons: Record<Subject, React.ReactNode> = {
  [Subject.physics]: <FlaskConical className="w-3.5 h-3.5" />,
  [Subject.chemistry]: <FlaskConical className="w-3.5 h-3.5" />,
  [Subject.maths]: <Calculator className="w-3.5 h-3.5" />,
  [Subject.biology]: <FileText className="w-3.5 h-3.5" />,
  [Subject.english]: <Languages className="w-3.5 h-3.5" />,
  [Subject.hindi]: <Languages className="w-3.5 h-3.5" />,
  [Subject.socialScience]: <Globe className="w-3.5 h-3.5" />,
  [Subject.other]: <BookOpen className="w-3.5 h-3.5" />,
};

const subjectLabels: Record<Subject, string> = {
  [Subject.physics]: "Physics",
  [Subject.chemistry]: "Chemistry",
  [Subject.maths]: "Mathematics",
  [Subject.biology]: "Biology",
  [Subject.english]: "English",
  [Subject.hindi]: "Hindi",
  [Subject.socialScience]: "Social Science",
  [Subject.other]: "Other",
};

function formatFileSize(bytes: bigint): string {
  const n = Number(bytes);
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

interface MaterialCardProps {
  material: Material;
  index: number;
  onDownload: (material: Material) => void;
  isDownloading?: boolean;
}

export default function MaterialCard({
  material,
  index,
  onDownload,
  isDownloading,
}: MaterialCardProps) {
  const cat = categoryConfig[material.classCategory] ?? {
    label: String(material.classCategory),
    color: "bg-gray-100 text-gray-700 border-gray-200",
  };
  const type = typeConfig[material.materialType] ?? {
    label: String(material.materialType),
    color: "bg-gray-100 text-gray-700 border-gray-200",
  };
  const icon = subjectIcons[material.subject] ?? (
    <BookOpen className="w-3.5 h-3.5" />
  );
  const subjectLabel =
    subjectLabels[material.subject] ?? String(material.subject);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: "easeOut" }}
      data-ocid={`materials.item.${index + 1}`}
    >
      <Card className="h-full flex flex-col glass-card card-hover shadow-card group">
        <CardHeader className="pb-3">
          <div className="flex flex-wrap gap-1.5 mb-2">
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${cat.color}`}
            >
              {cat.label}
            </span>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${type.color}`}
            >
              {type.label}
            </span>
          </div>
          <h3 className="font-display font-semibold text-foreground text-base leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {material.title}
          </h3>
        </CardHeader>

        <CardContent className="pb-3 flex-1">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
            {icon}
            <span>{subjectLabel}</span>
          </div>
          {material.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {material.description}
            </p>
          )}
        </CardContent>

        <CardFooter className="pt-3 border-t border-border flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>{formatFileSize(material.fileSize)}</span>
            <span className="flex items-center gap-1">
              <Download className="w-3 h-3" />
              {Number(material.downloadCount).toLocaleString()}
            </span>
          </div>
          <Button
            size="sm"
            onClick={() => onDownload(material)}
            disabled={isDownloading}
            data-ocid={`material.download_button.${index + 1}`}
            className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 text-xs h-8 px-3"
          >
            <Download className="w-3.5 h-3.5" />
            {isDownloading ? "..." : "Download"}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
