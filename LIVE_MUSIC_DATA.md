# Live Music Data Management Guide

This guide explains how to update live music events, artist information, and photos for the Fizzy Moon website.

## Overview

All live music data is stored in a simple JSON file that's easy to edit. Artist photos are organized in individual folders for easy management.

## File Structure

- **Data File**: `data/music-schedule.json` - Contains all event information
- **Images Directory**: `public/images/bands/` - Contains artist photos organized by artist

## Editing Event Data

### Location
Edit the file: `data/music-schedule.json`

### JSON Structure

The file contains an array of months, each with an array of events:

```json
[
  {
    "month": "January",
    "events": [
      {
        "date": "Fri 2nd",
        "act": "Jack Price",
        "image": "/images/bands/jack-price/photo.jpg",
        "genre": "Acoustic / Indie",
        "time": "9:00 PM",
        "description": "Artist description here...",
        "highlight": true,        // Optional: Highlights the event
        "special": true,          // Optional: Marks as special event
        "note": "SPECIAL EVENT"   // Optional: Additional note text
      }
    ]
  }
]
```

### Event Fields

- **`date`** (required): Display date, e.g., "Fri 2nd", "Sat 15th"
- **`act`** (required): Artist/band name as it should appear
- **`image`** (required): Path to artist photo (see Image Management below)
- **`genre`** (required): Music genre/style
- **`time`** (required): Event time, e.g., "9:00 PM", "8:00 PM - Late"
- **`description`** (required): Full description of the artist/event
- **`highlight`** (optional): Set to `true` to highlight the event
- **`special`** (optional): Set to `true` to mark as a special event
- **`note`** (optional): Additional note text (e.g., "GOOD FRIDAY", "MOTHERS DAY !!!")

### Adding a New Event

1. Open `data/music-schedule.json`
2. Find the appropriate month object
3. Add a new event object to the `events` array:

```json
{
  "date": "Sat 20th",
  "act": "New Artist Name",
  "image": "/images/bands/new-artist-name/photo.jpg",
  "genre": "Rock / Pop",
  "time": "9:30 PM",
  "description": "A great description of the artist and their style.",
  "highlight": false
}
```

### Updating an Existing Event

Simply edit the values in the JSON file. Changes will appear after saving and refreshing the website.

### Adding a New Month

If you need to add months beyond the current schedule:

```json
{
  "month": "May",
  "events": [
    // ... your events here
  ]
}
```

## Image Management

### Folder Structure

Each artist has their own folder following this structure:

```
public/images/bands/
  ├── jack-price/
  │   └── photo.jpg
  ├── inner-city-3/
  │   └── photo.jpg
  └── artist-name/
      └── photo.jpg
```

### Artist Folder Naming (Slug Format)

Artist folders use a "slug" format:
- Lowercase
- Spaces replaced with hyphens
- Special characters removed
- Examples:
  - "Jack Price" → `jack-price`
  - "Inner City 3" → `inner-city-3`
  - "Tiago & The Amigo's" → `tiago-and-the-amigos`
  - "DJ ROSS" → `dj-ross`

### Adding Photos for a New Artist

1. **Create the artist folder**:
   - Navigate to `public/images/bands/`
   - Create a new folder with the artist's slug name
   - Example: `mkdir public/images/bands/new-artist-name`

2. **Add the photo**:
   - Place the main photo in the folder as `photo.jpg`
   - Supported formats: JPG, PNG, WebP
   - Recommended size: 1200x800px or similar aspect ratio
   - Keep file sizes reasonable (under 500KB is ideal)

3. **Update the JSON**:
   - Set the `image` field to: `/images/bands/new-artist-name/photo.jpg`

### Updating an Artist Photo

Simply replace the `photo.jpg` file in the artist's folder with the new image. No JSON changes needed.

### Optional: Multiple Images Per Artist

You can store additional images in an artist's folder if needed:
- `photo.jpg` - Main photo (required, used everywhere)
- `hero.jpg` - Optional larger/hero image
- `thumb.jpg` - Optional thumbnail

Currently, the website uses `photo.jpg`. Future updates could support these additional images.

## Common Tasks

### Adding a Recurring Artist

If an artist plays multiple times (like "Jack Price"), they should use the same image path. The website will use the same photo for all their appearances.

### Changing Event Times

Edit the `time` field in the JSON:
```json
"time": "8:00 PM - Late"
```

### Marking Special Events

Set both `special: true` and add a `note`:
```json
{
  "date": "Sun 15th",
  "act": "COLE",
  "note": "MOTHERS DAY !!!",
  "special": true,
  // ... other fields
}
```

## Tips

- **Backup First**: Always keep a backup of `music-schedule.json` before making major changes
- **JSON Formatting**: Use a JSON validator if you encounter errors (many code editors provide this)
- **Image Optimization**: Compress images before uploading to keep the site fast
- **Consistent Naming**: Use consistent artist names in the `act` field across all events
- **Test Changes**: After making changes, test the website to ensure everything displays correctly

## Troubleshooting

### Images Not Showing

1. Check that the folder name matches the path in JSON exactly
2. Verify the image file is named `photo.jpg` (or update the path)
3. Ensure the image path starts with `/images/bands/`
4. Check file permissions

### JSON Errors

1. Ensure all strings are in double quotes
2. Check for trailing commas (not allowed in JSON)
3. Validate JSON structure using an online JSON validator
4. Ensure all required fields are present

### Event Not Appearing

1. Check that the event is inside the correct month object
2. Verify the month name matches exactly (case-sensitive)
3. Ensure the JSON structure is valid

## Quick Reference

**File to Edit**: `data/music-schedule.json`

**Images Location**: `public/images/bands/{artist-slug}/photo.jpg`

**Required Fields**: `date`, `act`, `image`, `genre`, `time`, `description`

**Optional Fields**: `highlight`, `special`, `note`

