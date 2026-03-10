# StudyVault - Student Study Material Platform

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Admin dashboard to upload and manage study materials (PDFs, ebooks, test series, notes, etc.)
- Student-facing browse/download interface organized by:
  - Class category: Class 10, Class 11, Class 12, JEE, NEET
  - Subject: Maths, Physics, Chemistry, Biology, English, etc.
  - Material type: Ebook, Test Series, Notes, Sample Paper, Solutions
- File upload with blob storage (PDF, EPUB, images, etc.)
- Material metadata: title, description, class category, subject, material type, file
- Admin can edit/delete uploaded materials
- Students can browse and download/view materials without login
- Admin login required to upload/manage
- Search and filter materials by category, subject, type
- Material count and organized listing

### Modify
N/A

### Remove
N/A

## Implementation Plan
1. Backend: Materials actor with CRUD operations, category/subject/type enums, blob storage integration
2. Authorization: Admin role for upload/manage; students browse without login
3. Frontend:
   - Public student view: Browse by class/exam, search, filter, download
   - Admin view: Login, upload form, material management table
   - Landing page with category cards (Class 10, 11, 12, JEE, NEET)
