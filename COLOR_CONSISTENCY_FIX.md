# Color Consistency Fix for Android/iOS

## Problem
Colors (especially brand orange #f78e2c) appeared different on Android vs iOS devices due to color profile and ICC color space handling differences.

## Solution Overview
This fix ensures consistent color rendering across all devices by:
1. Using solid hex color values for brand colors
2. Converting images to sRGB color space
3. Using proper CSS color scheme settings
4. Ensuring consistent color handling in Next.js

## Changes Made

### 1. CSS Color Space Enforcement (`app/globals.css`)
- Added `color-scheme: dark` to `html` element for consistent rendering
- Changed `color: #fff` to `color: #ffffff` (explicit hex) for consistency
- Added comments documenting solid hex color usage

**Key Points:**
- Brand colors (#f78e2c, #0b1219, #15222e) are already using solid hex values ✓
- `rgba()` is still used for shadows and effects (acceptable - doesn't affect brand color consistency)
- Opacity modifiers (e.g., `/90`, `/50`) are used for overlays and UI effects (acceptable)

### 2. Image Color Profile Normalization (`scripts/normalize-images.js`)
- Updated script to convert all images to sRGB color space
- Images are normalized to ensure consistent rendering across devices
- Script outputs to `/public/images-normalized/` by default (safe - doesn't overwrite originals)

**Usage:**
```bash
node scripts/normalize-images.js
```

**After running:**
1. Review normalized images in `/public/images-normalized/`
2. Replace originals or update image paths in code
3. Or modify script to output directly to `/public/images/` (backup first!)

### 3. Next.js Configuration (`next.config.mjs`)
- Added comments documenting image color profile handling
- Next.js Image component handles color profiles automatically
- Combined with normalized images for full consistency

### 4. Color Usage Review

#### Brand Colors (Solid Hex - Consistent ✓)
- **Brand Orange:** `#f78e2c` - Used as solid hex throughout
- **Deep Slate:** `#0b1219` - Used as solid hex
- **Dark Slate:** `#15222e` - Used as solid hex

#### Acceptable Opacity Usage
The following uses of opacity/rgba are acceptable and don't affect brand color consistency:
- **Shadows:** `rgba(247,142,44,0.4)` for box-shadows (visual effect only)
- **Overlays:** `bg-[#0b1219]/90` for semi-transparent backgrounds
- **UI Effects:** Opacity modifiers for hover states and transitions

**Important:** All primary brand color applications use solid hex values, ensuring consistency.

## Testing Instructions

### On Android Devices:
1. Open the website on an Android device (Chrome/Samsung Internet)
2. Check brand orange (#f78e2c) in:
   - Navigation "BOOK NOW" button
   - Hero section "Book A Table" button
   - Marquee banner background
   - Various accent elements
3. Verify colors match the design specifications

### On iOS Devices:
1. Open the website on an iOS device (Safari)
2. Check the same elements as above
3. Compare side-by-side with Android if possible

### Expected Results:
- Brand orange (#f78e2c) should appear identical on both platforms
- Background colors (#0b1219, #15222e) should match
- Images should render with consistent colors
- No noticeable color shifts between devices

## Image Normalization Process

### Before Normalization:
1. **Backup your images** (recommended):
   ```bash
   cp -r public/images public/images-backup
   ```

### Run Normalization:
```bash
node scripts/normalize-images.js
```

### After Normalization:
1. Review normalized images in `public/images-normalized/`
2. Test on both Android and iOS devices
3. If satisfied, replace originals:
   ```bash
   # Option 1: Replace originals (after backup)
   rm -r public/images
   mv public/images-normalized public/images
   
   # Option 2: Update code to use normalized images
   # Change paths from /images/ to /images-normalized/
   ```

## Technical Details

### Why This Works:
1. **sRGB Color Space:** Standard RGB is the web standard and ensures consistent rendering
2. **Solid Hex Values:** Eliminates color space interpretation differences
3. **Image Normalization:** Converts all images to sRGB, removing ICC profile variations
4. **Color Scheme:** Helps browsers apply consistent color rendering

### Browser/Device Differences:
- **iOS Safari:** Uses Display P3 color space by default, but respects sRGB when specified
- **Android Chrome:** Uses sRGB by default, but can interpret wide-gamut images differently
- **Solution:** Normalize everything to sRGB for universal consistency

## Maintenance

### Adding New Images:
1. Run `normalize-images.js` after adding new images
2. Or manually convert new images to sRGB using:
   ```bash
   # Using ImageMagick
   convert input.jpg -colorspace sRGB output.jpg
   
   # Using sharp (Node.js)
   sharp(input).toColorspace('srgb').toFile(output)
   ```

### Adding New Colors:
- Always use solid hex values for brand colors
- Use opacity/rgba only for shadows and effects
- Test on both Android and iOS after changes

## Files Modified

1. `app/globals.css` - Added color-scheme and explicit hex colors
2. `scripts/normalize-images.js` - Updated for better sRGB conversion
3. `next.config.mjs` - Added documentation comments
4. `COLOR_CONSISTENCY_FIX.md` - This documentation file

## Additional Notes

- The brand orange (#f78e2c) is used consistently as a solid hex value throughout
- No changes were needed to component files as they already use solid hex
- Shadow effects using rgba() are acceptable and don't affect brand color consistency
- The normalize-images script uses Sharp library for reliable color space conversion

## Support

If colors still appear inconsistent:
1. Verify images have been normalized (check color profiles)
2. Clear browser cache on test devices
3. Check if device has color correction/accessibility settings enabled
4. Verify brand colors are using solid hex (not rgba with opacity)

