import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ClassCategory, MaterialType, Subject } from "../backend";
import type { Material } from "../backend";
import { useUpdateMaterial } from "../hooks/useQueries";

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

interface EditMaterialModalProps {
  material: Material | null;
  open: boolean;
  onClose: () => void;
}

export default function EditMaterialModal({
  material,
  open,
  onClose,
}: EditMaterialModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [classCategory, setClassCategory] = useState<ClassCategory | "">("");
  const [subject, setSubject] = useState<Subject | "">("");
  const [materialType, setMaterialType] = useState<MaterialType | "">("");
  const updateMaterial = useUpdateMaterial();

  useEffect(() => {
    if (material) {
      setTitle(material.title);
      setDescription(material.description);
      setClassCategory(material.classCategory);
      setSubject(material.subject);
      setMaterialType(material.materialType);
    }
  }, [material]);

  const handleSave = async () => {
    if (!material || !title || !classCategory || !subject || !materialType) {
      toast.error("Please fill all required fields.");
      return;
    }
    try {
      await updateMaterial.mutateAsync({
        id: material.id,
        input: {
          title,
          description,
          classCategory: classCategory as ClassCategory,
          subject: subject as Subject,
          materialType: materialType as MaterialType,
          blob: material.blob,
          fileName: material.fileName,
          fileSize: material.fileSize,
        },
      });
      toast.success("Material updated successfully!");
      onClose();
    } catch {
      toast.error("Update failed.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display">Edit Material</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label>Title *</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Category *</Label>
              <Select
                value={classCategory}
                onValueChange={(v) => setClassCategory(v as ClassCategory)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
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
              <Label>Subject *</Label>
              <Select
                value={subject}
                onValueChange={(v) => setSubject(v as Subject)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Subject" />
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
          </div>
          <div className="space-y-1.5">
            <Label>Type *</Label>
            <Select
              value={materialType}
              onValueChange={(v) => setMaterialType(v as MaterialType)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Type" />
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
          <div className="space-y-1.5">
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            data-ocid="admin.cancel_button"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={updateMaterial.isPending}
            data-ocid="admin.save_button"
            className="bg-primary text-primary-foreground"
          >
            {updateMaterial.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
