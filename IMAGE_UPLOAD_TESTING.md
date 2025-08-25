# Image Upload Testing Guide

## Features Implemented

### 1. Backend Changes
- ✅ Added `imageUrl` field to Category entity
- ✅ Created `/admin/upload/image` endpoint with multer configuration  
- ✅ File storage in `/uploads/images` folder with validation
- ✅ Static file serving for uploaded images at `/uploads/*`
- ✅ Updated Category DTOs to include imageUrl field
- ✅ Admin-only access with proper authentication

### 2. Frontend Changes
- ✅ Created ImageUpload component with preview functionality
- ✅ Updated CategoryForm to support image upload
- ✅ Updated ProductForm to use ImageUpload component
- ✅ Updated TypeScript interfaces for Category with imageUrl
- ✅ Added admin sidebar preference persistence

### 3. Key Features
- **Smart Image Handling**: Switch between URL input and file upload
- **File Validation**: Image types (jpg, jpeg, png, gif, webp) and 5MB size limit
- **Preview**: Real-time image preview with error handling
- **Drag & Drop**: Full drag-and-drop support for file uploads
- **Authentication**: Bearer token authentication for admin endpoints

## Manual Testing Checklist

### Category Form Testing
1. Navigate to admin categories page
2. Click "Add Category" or edit existing category
3. Test URL input method:
   - Switch to URL mode
   - Enter valid image URL
   - Verify preview appears
4. Test file upload method:
   - Switch to upload mode
   - Drag and drop an image file
   - Verify upload progress and preview
5. Test validation:
   - Try uploading non-image file (should fail)
   - Try uploading file > 5MB (should fail)
   - Try invalid URL (should show error)

### Product Form Testing
1. Navigate to admin products page
2. Click "Add Product" or edit existing product
3. Test same upload functionality as categories
4. Verify category pre-selection works when editing existing products

### API Endpoint Testing
```bash
# Test upload endpoint directly (requires admin token)
curl -X POST \
  http://localhost:3000/admin/upload/image \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -F "image=@/path/to/test-image.jpg"
```

### Static File Serving Testing
- Upload an image via the form
- Check that the returned URL (`/uploads/images/filename.jpg`) is accessible
- Verify image displays correctly in the preview

## Error Scenarios to Test
1. Upload without authentication (should get 401)
2. Upload as non-admin user (should get 403)
3. Upload invalid file type (should get validation error)
4. Upload oversized file (should get size error)
5. Network error during upload (should show error message)
6. Invalid URL in URL mode (should show preview error)

## File Structure
```
backend/
├── uploads/
│   └── images/           # Uploaded images stored here
├── src/admin/controllers/
│   └── upload.controller.ts   # New upload endpoint
└── src/products/entities/
    └── category.entity.ts     # Updated with imageUrl field

frontend/
├── src/components/common/
│   └── ImageUpload.tsx        # New reusable component
├── src/components/categorys/
│   └── CategoryForm.tsx       # Updated with image upload
└── src/components/products/
    └── ProductForm.tsx        # Updated with image upload
```

## Notes
- Images are stored in `backend/uploads/images/` directory
- Static files served at `/uploads/*` URL path
- Authentication uses Bearer tokens from localStorage
- Component supports both URL input and file upload modes
- Admin sidebar preferences are persisted in localStorage