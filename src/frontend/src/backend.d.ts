import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface MaterialInput {
    title: string;
    subject: Subject;
    classCategory: ClassCategory;
    blob: ExternalBlob;
    description: string;
    fileName: string;
    fileSize: bigint;
    materialType: MaterialType;
}
export interface Material {
    id: string;
    title: string;
    subject: Subject;
    classCategory: ClassCategory;
    blob: ExternalBlob;
    description: string;
    fileName: string;
    fileSize: bigint;
    isActive: boolean;
    downloadCount: bigint;
    materialType: MaterialType;
    uploadedAt: Time;
    uploadedBy: Principal;
}
export type Time = bigint;
export interface UserProfile {
    name: string;
}
export enum ClassCategory {
    jee = "jee",
    neet = "neet",
    class10 = "class10",
    class11 = "class11",
    class12 = "class12"
}
export enum MaterialType {
    other = "other",
    ebook = "ebook",
    videoNotes = "videoNotes",
    testSeries = "testSeries",
    notes = "notes",
    samplePaper = "samplePaper",
    solutions = "solutions"
}
export enum Subject {
    maths = "maths",
    biology = "biology",
    hindi = "hindi",
    other = "other",
    socialScience = "socialScience",
    chemistry = "chemistry",
    physics = "physics",
    english = "english"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createMaterial(input: MaterialInput): Promise<string>;
    deleteMaterial(id: string): Promise<void>;
    filterByClass(classCategory: ClassCategory): Promise<Array<Material>>;
    filterBySubject(subject: Subject): Promise<Array<Material>>;
    filterByType(materialType: MaterialType): Promise<Array<Material>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMaterial(id: string): Promise<Material>;
    getMaterialCount(): Promise<bigint>;
    getMaterialsByClass(): Promise<Array<[ClassCategory, Array<Material>]>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    incrementDownloadCount(id: string): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    listMaterials(): Promise<Array<Material>>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchByTitle(searchTerm: string): Promise<Array<Material>>;
    updateMaterial(id: string, input: MaterialInput): Promise<void>;
}
