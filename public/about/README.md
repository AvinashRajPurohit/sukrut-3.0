# About Section Images

This directory contains all images used in the About page, organized by section.

## Folder Structure

```
public/about/
├── hero/           # Hero section images (4 images)
│   ├── hero-1.jpg
│   ├── hero-2.jpg
│   ├── hero-3.jpg
│   └── hero-4.jpg
│
├── team/           # Team member profile images
│   ├── deepak-rajpurohit.jpg
│   ├── isabella-schmidt.jpg
│   ├── matteo-rossi.jpg
│   ├── elena-fischer.jpg
│   ├── alex-chen.jpg
│   ├── sarah-johnson.jpg
│   ├── michael-brown.jpg
│   └── priya-patel.jpg
│
├── who-we-are/     # Who We Are section image
│   └── team-photo.jpg
│
├── growth/         # Growth section image
│   └── growth-image.jpg
│
└── careers/        # Careers section carousel images (10 images)
    ├── career-1.jpg
    ├── career-2.jpg
    ├── career-3.jpg
    ├── career-4.jpg
    ├── career-5.jpg
    ├── career-6.jpg
    ├── career-7.jpg
    ├── career-8.jpg
    ├── career-9.jpg
    └── career-10.jpg
```

## Image Requirements

### Hero Section (`/hero/`)
- **Format**: JPG
- **Recommended Size**: 800x600px (4:3 aspect ratio)
- **Count**: 4 images
- **Usage**: Displayed in a grid layout on the hero section

### Team Section (`/team/`)
- **Format**: JPG
- **Recommended Size**: 400x400px (1:1 aspect ratio, square)
- **Count**: Variable - Add as many team member images as needed
- **Usage**: Profile pictures for team members
- **Naming**: Use lowercase with hyphens (e.g., `firstname-lastname.jpg`)
- **Note**: Add team member data to `about.json` in the `team.members` array with fields: `id`, `name`, `role`, `image`, `linkedin`, `bio`

### Who We Are Section (`/who-we-are/`)
- **Format**: JPG
- **Recommended Size**: 1200x800px (21:9 aspect ratio)
- **Count**: 1 image
- **Usage**: Main team photo displayed in the Who We Are section

### Growth Section (`/growth/`)
- **Format**: JPG
- **Recommended Size**: 1200x800px (4:3 aspect ratio)
- **Count**: 1 image
- **Usage**: Featured image in the Growth/Partnership section

### Careers Section (`/careers/`)
- **Format**: JPG
- **Recommended Size**: 1200x800px (16:10 aspect ratio)
- **Count**: Variable - Add as many career images as needed
- **Usage**: Carousel images in the Careers section
- **Naming**: Use sequential naming (e.g., `career-1.jpg`, `career-2.jpg`, etc.)
- **Note**: Add image data to `about.json` in the `careers.images` array with fields: `id`, `src`, `alt`

## Notes

- All image paths are referenced from the `/public` directory
- Use descriptive filenames that match the content
- Optimize images for web before adding them to these folders
- Maintain consistent aspect ratios within each section
- **Team members and career images are flexible** - You can add or remove as many as needed
- After adding images, update the corresponding arrays in `src/components/data/about.json`:
  - Team members: Add to `team.members` array
  - Career images: Add to `careers.images` array
- The components automatically handle any number of items dynamically
