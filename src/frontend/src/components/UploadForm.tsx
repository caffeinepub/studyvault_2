import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FileUp, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { ClassCategory, ExternalBlob, MaterialType, Subject } from "../backend";
import { useCreateMaterial } from "../hooks/useQueries";

const CLASS_OPTIONS = [
  { value: ClassCategory.class10, label: "Class 10" },
  { value: ClassCategory.class11, label: "Class 11" },
  { value: ClassCategory.class12, label: "Class 12" },
  { value: ClassCategory.jee, label: "JEE" },
  { value: ClassCategory.neet, label: "NEET" },
];

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

interface FormState {
  title: string;
  description: string;
  classCategory: ClassCategory | "";
  subject: Subject | "";
  materialType: MaterialType | "";
}

const EMPTY_FORM: FormState = {
  title: "",
  description: "",
  classCategory: "",
  subject: "",
  materialType: "",
};

interface UploadFormProps {
  onSuccess?: () => void;
}

export default function UploadForm({ onSuccess }: UploadFormProps) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const createMaterial = useCreateMaterial();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  const clearFile = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.title ||
      !form.classCategory ||
      !form.subject ||
      !form.materialType ||
      !file
    ) {
      toast.error("Please fill all required fields and select a file.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const bytes = await file.arrayBuffer();
      const uint8 = new Uint8Array(bytes);
      const blob = ExternalBlob.fromBytes(uint8).withUploadProgress((pct) => {
        setUploadProgress(Math.round(pct));
      });

      await createMaterial.mutateAsync({
        title: form.title,
        description: form.description,
        classCategory: form.classCategory as ClassCategory,
        subject: form.subject as Subject,
        materialType: form.materialType as MaterialType,
        blob,
        fileName: file.name,
        fileSize: BigInt(file.size),
      });

      toast.success("Material uploaded successfully!");
      setForm(EMPTY_FORM);
      setFile(null);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = "";
      onSuccess?.();
    } catch (err) {
      toast.error("Upload failed. Please try again.");
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2 space-y-1.5">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            data-ocid="admin.title_input"
            placeholder="e.g., Physics Chapter 5 - Motion Notes"
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="classCategory">Class / Category *</Label>
          <Select
            value={form.classCategory}
            onValueChange={(v) =>
              setForm((p) => ({ ...p, classCategory: v as ClassCategory }))
            }
          >
            <SelectTrigger data-ocid="admin.category_select" id="classCategory">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {CLASS_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="subject">Subject *</Label>
          <Select
            value={form.subject}
            onValueChange={(v) =>
              setForm((p) => ({ ...p, subject: v as Subject }))
            }
          >
            <SelectTrigger data-ocid="admin.subject_select" id="subject">
              <SelectValue placeholder="Select subject" />
            </SelectTrigger>
            <SelectContent>
              {SUBJECT_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="materialType">Material Type *</Label>
          <Select
            value={form.materialType}
            onValueChange={(v) =>
              setForm((p) => ({ ...p, materialType: v as MaterialType }))
            }
          >
            <SelectTrigger data-ocid="admin.type_select" id="materialType">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {TYPE_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="md:col-span-2 space-y-1.5">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            data-ocid="admin.description_input"
            placeholder="Brief description of this material..."
            value={form.description}
            onChange={(e) =>
              setForm((p) => ({ ...p, description: e.target.value }))
            }
            rows={3}
          />
        </div>

        <div className="md:col-span-2 space-y-1.5">
          <Label>File *</Label>
          <div className="relative">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.epub,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.zip"
              className="hidden"
              onChange={handleFileChange}
            />
            <button
              type="button"
              data-ocid="admin.file_upload"
              className={`w-full border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                file
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50 hover:bg-muted/50"
              }`}
              onClick={triggerFileInput}
            >
              {file ? (
                <div className="flex items-center justify-center gap-3">
                  <FileUp className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium text-foreground truncate max-w-xs">
                    {file.name}
                  </span>
                  <button
                    type="button"
                    onClick={clearFile}
                    className="text-muted-foreground hover:text-destructive"
                    aria-label="Remove file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="w-8 h-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-primary">
                      Click to upload
                    </span>{" "}
                    or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PDF, EPUB, DOC, PPT, Images, ZIP
                  </p>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      {isUploading && (
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Uploading...</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}

      <Button
        type="submit"
        disabled={isUploading || createMaterial.isPending}
        data-ocid="admin.submit_button"
        className="w-full gap-2 bg-primary text-primary-foreground"
      >
        {isUploading || createMaterial.isPending ? (
          <>
            <Upload className="w-4 h-4 animate-bounce" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="w-4 h-4" />
            Upload Material
          </>
        )}
      </Button>
    </form>
  );
}
