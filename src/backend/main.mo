import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Map "mo:core/Map";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Order "mo:core/Order";
import Time "mo:core/Time";
import Array "mo:core/Array";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import AccessControl "authorization/access-control";
import Nat "mo:core/Nat";

actor {
  module Material {
    public type ClassCategory = {
      #class10;
      #class11;
      #class12;
      #jee;
      #neet;
    };

    public type Subject = {
      #maths;
      #physics;
      #chemistry;
      #biology;
      #english;
      #hindi;
      #socialScience;
      #other;
    };

    public type MaterialType = {
      #ebook;
      #testSeries;
      #notes;
      #samplePaper;
      #solutions;
      #videoNotes;
      #other;
    };

    public func compareByTitle(a : Material, b : Material) : Order.Order {
      Text.compare(a.title, b.title);
    };
  };

  type ClassCategory = Material.ClassCategory;
  type Subject = Material.Subject;
  type MaterialType = Material.MaterialType;

  type Material = {
    id : Text;
    title : Text;
    description : Text;
    classCategory : ClassCategory;
    subject : Subject;
    materialType : MaterialType;
    blob : Storage.ExternalBlob;
    fileName : Text;
    fileSize : Nat;
    uploadedAt : Time.Time;
    uploadedBy : Principal;
    downloadCount : Nat;
    isActive : Bool;
  };

  type MaterialInput = {
    title : Text;
    description : Text;
    classCategory : ClassCategory;
    subject : Subject;
    materialType : MaterialType;
    blob : Storage.ExternalBlob;
    fileName : Text;
    fileSize : Nat;
  };

  public type UserProfile = {
    name : Text;
  };

  var nextId = 1;
  let materials = Map.empty<Text, Material>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  include MixinStorage();

  func getMaterialInternal(id : Text) : Material {
    switch (materials.get(id)) {
      case (?material) { material };
      case (null) { Runtime.trap("Material not found") };
    };
  };

  func filterMaterials(filterFunc : (Material) -> Bool) : List.List<Material> {
    let materialList = List.empty<Material>();
    for ((_, material) in materials.entries()) {
      if (material.isActive and filterFunc(material)) {
        materialList.add(material);
      };
    };
    materialList;
  };

  // User Profile Management

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // CRUD operations

  public shared ({ caller }) func createMaterial(input : MaterialInput) : async Text {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can create materials");
    };

    let id = nextId.toText();
    nextId += 1;

    let material : Material = {
      id;
      title = input.title;
      description = input.description;
      classCategory = input.classCategory;
      subject = input.subject;
      materialType = input.materialType;
      blob = input.blob;
      fileName = input.fileName;
      fileSize = input.fileSize;
      uploadedAt = Time.now();
      uploadedBy = caller;
      downloadCount = 0;
      isActive = true;
    };

    materials.add(id, material);
    id;
  };

  public shared ({ caller }) func updateMaterial(id : Text, input : MaterialInput) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update materials");
    };

    let existing = getMaterialInternal(id);

    let updated : Material = {
      id = existing.id;
      title = input.title;
      description = input.description;
      classCategory = input.classCategory;
      subject = input.subject;
      materialType = input.materialType;
      blob = input.blob;
      fileName = input.fileName;
      fileSize = input.fileSize;
      uploadedAt = existing.uploadedAt;
      uploadedBy = existing.uploadedBy;
      downloadCount = existing.downloadCount;
      isActive = existing.isActive;
    };

    materials.add(id, updated);
  };

  public shared ({ caller }) func deleteMaterial(id : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete materials");
    };

    let material = getMaterialInternal(id);
    let updated : Material = {
      id = material.id;
      title = material.title;
      description = material.description;
      classCategory = material.classCategory;
      subject = material.subject;
      materialType = material.materialType;
      blob = material.blob;
      fileName = material.fileName;
      fileSize = material.fileSize;
      uploadedAt = material.uploadedAt;
      uploadedBy = material.uploadedBy;
      downloadCount = material.downloadCount;
      isActive = false;
    };
    materials.add(id, updated);
  };

  // Material queries

  public query ({ caller }) func getMaterial(id : Text) : async Material {
    switch (materials.get(id)) {
      case (?material) {
        if (not material.isActive) {
          Runtime.trap("Material not found");
        };
        material;
      };
      case (null) { Runtime.trap("Material not found") };
    };
  };

  public query ({ caller }) func listMaterials() : async [Material] {
    materials.values().filter(func(m) { m.isActive }).toArray();
  };

  public query ({ caller }) func filterByClass(classCategory : ClassCategory) : async [Material] {
    filterMaterials(func(m) { m.classCategory == classCategory }).toArray();
  };

  public query ({ caller }) func filterBySubject(subject : Subject) : async [Material] {
    filterMaterials(func(m) { m.subject == subject }).toArray();
  };

  public query ({ caller }) func filterByType(materialType : MaterialType) : async [Material] {
    filterMaterials(func(m) { m.materialType == materialType }).toArray();
  };

  public query ({ caller }) func searchByTitle(searchTerm : Text) : async [Material] {
    filterMaterials(
      func(m) {
        m.title.toLower().contains(#text(searchTerm.toLower()));
      }
    ).toArray();
  };

  public shared ({ caller }) func incrementDownloadCount(id : Text) : async () {
    let material = getMaterialInternal(id);
    let updated : Material = {
      id = material.id;
      title = material.title;
      description = material.description;
      classCategory = material.classCategory;
      subject = material.subject;
      materialType = material.materialType;
      blob = material.blob;
      fileName = material.fileName;
      fileSize = material.fileSize;
      uploadedAt = material.uploadedAt;
      uploadedBy = material.uploadedBy;
      downloadCount = material.downloadCount + 1;
      isActive = material.isActive;
    };
    materials.add(id, updated);
  };

  public query ({ caller }) func getMaterialsByClass() : async [(ClassCategory, [Material])] {
    let classCategories : [ClassCategory] = [
      #class10,
      #class11,
      #class12,
      #jee,
      #neet,
    ];

    classCategories.map(
      func(classCategory) {
        let filtered = filterMaterials(
          func(m) { m.classCategory == classCategory }
        ).toArray();
        (classCategory, filtered);
      }
    );
  };

  // Stats

  public query ({ caller }) func getMaterialCount() : async Nat {
    materials.values().filter(func(m) { m.isActive }).toArray().size();
  };
};
