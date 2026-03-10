import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BarChart3, BookPlus, Pencil, ShieldAlert, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Material } from "../backend";
import { ClassCategory, MaterialType, Subject } from "../backend";
import EditMaterialModal from "../components/EditMaterialModal";
import UploadForm from "../components/UploadForm";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useDeleteMaterial,
  useIsCallerAdmin,
  useListMaterials,
  useMaterialCount,
} from "../hooks/useQueries";

const SKELETON_KEYS = ["sk-1", "sk-2", "sk-3", "sk-4"];

const categoryLabels: Record<ClassCategory, string> = {
  [ClassCategory.class10]: "Class 10",
  [ClassCategory.class11]: "Class 11",
  [ClassCategory.class12]: "Class 12",
  [ClassCategory.jee]: "JEE",
  [ClassCategory.neet]: "NEET",
};

const typeLabels: Record<MaterialType, string> = {
  [MaterialType.ebook]: "eBook",
  [MaterialType.notes]: "Notes",
  [MaterialType.testSeries]: "Test Series",
  [MaterialType.samplePaper]: "Sample Paper",
  [MaterialType.solutions]: "Solutions",
  [MaterialType.videoNotes]: "Video Notes",
  [MaterialType.other]: "Other",
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

export default function AdminPage() {
  const { loginStatus, identity, login } = useInternetIdentity();
  const isLoggedIn = loginStatus === "success" && !!identity;

  const { data: isAdmin, isLoading: checkingAdmin } = useIsCallerAdmin();
  const { data: materials, isLoading: loadingMaterials } = useListMaterials();
  const { data: materialCount } = useMaterialCount();
  const deleteMaterial = useDeleteMaterial();

  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"upload" | "manage">("upload");

  // Not logged in
  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
          <ShieldAlert className="w-8 h-8 text-primary" />
        </div>
        <div className="text-center">
          <h2 className="font-display font-bold text-2xl text-foreground mb-2">
            Admin Access Required
          </h2>
          <p className="text-muted-foreground max-w-sm">
            Please sign in with Internet Identity to access the admin panel.
          </p>
        </div>
        <Button
          onClick={login}
          className="bg-primary text-primary-foreground gap-2"
        >
          Sign In with Internet Identity
        </Button>
      </div>
    );
  }

  // Checking admin status
  if (checkingAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <Skeleton className="h-10 w-48 mx-auto" />
          <Skeleton className="h-4 w-64 mx-auto" />
        </div>
      </div>
    );
  }

  // Not admin
  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4">
        <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center">
          <ShieldAlert className="w-8 h-8 text-destructive" />
        </div>
        <div className="text-center">
          <h2 className="font-display font-bold text-2xl text-foreground mb-2">
            Access Denied
          </h2>
          <p className="text-muted-foreground">
            You don&apos;t have admin privileges to access this panel.
          </p>
        </div>
      </div>
    );
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this material?")) return;
    try {
      await deleteMaterial.mutateAsync(id);
      toast.success("Material deleted.");
    } catch {
      toast.error("Delete failed.");
    }
  };

  const handleEdit = (material: Material) => {
    setEditingMaterial(material);
    setShowEditModal(true);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl text-foreground mb-1">
          Admin Panel
        </h1>
        <p className="text-muted-foreground">
          Manage study materials for StudyVault
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card className="shadow-card">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold text-foreground">
                  {materialCount !== undefined ? Number(materialCount) : "—"}
                </p>
                <p className="text-xs text-muted-foreground">Total Materials</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <BookPlus className="w-5 h-5 text-green-700" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold text-foreground">
                  {materials ? materials.filter((m) => m.isActive).length : "—"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Active Materials
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-accent-foreground" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold text-foreground">
                  {materials
                    ? materials
                        .reduce((sum, m) => sum + Number(m.downloadCount), 0)
                        .toLocaleString()
                    : "—"}
                </p>
                <p className="text-xs text-muted-foreground">Total Downloads</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab Nav */}
      <div className="flex gap-2 mb-6 border-b border-border pb-0">
        <button
          type="button"
          onClick={() => setActiveTab("upload")}
          data-ocid="admin.upload_button"
          className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
            activeTab === "upload"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Upload New
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("manage")}
          className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
            activeTab === "manage"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Manage Materials
        </button>
      </div>

      {/* Upload Tab */}
      {activeTab === "upload" && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="font-display text-lg">
              Upload Study Material
            </CardTitle>
          </CardHeader>
          <CardContent>
            <UploadForm onSuccess={() => setActiveTab("manage")} />
          </CardContent>
        </Card>
      )}

      {/* Manage Tab */}
      {activeTab === "manage" && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="font-display text-lg">
              All Materials
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loadingMaterials ? (
              <div className="p-6 space-y-3">
                {SKELETON_KEYS.map((k) => (
                  <Skeleton key={k} className="h-12 w-full" />
                ))}
              </div>
            ) : !materials || materials.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground">
                <p>No materials uploaded yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table data-ocid="admin.table">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Downloads</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {materials.map((material, idx) => (
                      <TableRow key={material.id} className="hover:bg-muted/40">
                        <TableCell className="font-medium max-w-xs">
                          <span className="truncate block">
                            {material.title}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {categoryLabels[material.classCategory] ??
                            material.classCategory}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {subjectLabels[material.subject] ?? material.subject}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {typeLabels[material.materialType] ??
                            material.materialType}
                        </TableCell>
                        <TableCell className="text-right text-sm">
                          {Number(material.downloadCount).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(material)}
                              data-ocid={`admin.edit_button.${idx + 1}`}
                              className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(material.id)}
                              data-ocid={`admin.delete_button.${idx + 1}`}
                              className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <EditMaterialModal
        material={editingMaterial}
        open={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingMaterial(null);
        }}
      />
    </div>
  );
}
