# Image Setup Instructions

## 📁 Folder Structure

Your images should be placed in the following folders:

```
public/
  images/
    venue/
      - IMG_4315.jpg
      - IMG_4314.jpg
      - IMG_4316.jpg
      - IMG_4317.jpg
      - IMG_7636_(1).jpg
    bands/
      - jack-price.jpg
      - inner-city.jpg
      - king-kandola.jpg
      - tovey.jpg
      - tiago.jpg
      - mocking-jays.jpg
      - dj-ross.jpg
      - carl.jpg
      - cover-buoys.jpg
      - quest.jpg
      - back-catalogue.jpg
      - chasing-deer.jpg
      - cole.jpg
      - viva.jpg
      - izzy.jpg
      - thom.jpg
      - andy.jpg
    logo/
      - fizzy_moon_white_final.png
```

## 🚀 How to Add Images

1. **Venue Images**: Copy your venue photos to `/public/images/venue/` with the exact filenames listed above
2. **Band Images**: Add band photos to `/public/images/bands/` (you can name them however you like, just update the paths in `App.tsx`)
3. **Logo**: Place your logo at `/public/images/logo/fizzy_moon_white_final.png`

## ⚡ Image Optimization

- Images are automatically optimized during build
- WebP format is used when supported by the browser
- Images are compressed for faster loading
- Lazy loading is enabled for images below the fold

## 📝 Notes

- **File Size**: Keep images under 5MB each for best performance
- **Formats**: JPG, PNG, and WebP are supported
- **Naming**: Use lowercase with hyphens for band images (e.g., `jack-price.jpg`)
- **GitHub**: When you commit, images will be stored in your GitHub repo
- **Vercel**: Images will be automatically optimized when deployed

## 🔄 Updating Images

Simply replace the image files in the folders and commit. The changes will be reflected after deployment.


