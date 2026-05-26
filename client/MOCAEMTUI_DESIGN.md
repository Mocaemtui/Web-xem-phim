# Mocaemtui Design System

A Netflix-inspired cinematic dark UI for the Mocaemtui streaming platform.

## Overview

The Mocaemtui design system provides a premium, fast, cinematic, and content-first experience optimized for browsing movies. It features a custom dark theme with smooth animations and responsive design.

## Color Palette

- **Background Primary**: `#050505`
- **Background Secondary**: `#0a0a0a`
- **Background Tertiary**: `#141414`
- **Background Hover**: `#1f1f1f`
- **Accent Color**: `#ff2b3a`
- **Accent Hover**: `#ff4455`
- **Text Primary**: `#ffffff`
- **Text Secondary**: `#b3b3b3`
- **Text Muted**: `#666666`
- **Border Color**: `rgba(255, 255, 255, 0.08)`

## Components

### 1. MocaemtuiHeader

**Location**: `src/components/MocaemtuiHeader.jsx`

A sticky transparent header that becomes dark on scroll with blur effect.

**Features**:
- Logo: "Mocaemtui" with accent color
- Navigation: Home, Movies, Series, Anime, TV Shows, Genres, Countries
- Right side: Search icon, notification icon, user avatar
- Mobile-responsive with hamburger menu
- Smooth scroll detection for background transition

**Usage**:
```jsx
<MocaemtuiHeader onSearchClick={handleSearchClick} />
```

### 2. MocaemtuiHero

**Location**: `src/components/MocaemtuiHero.jsx`

A full-width cinematic hero section with featured movie.

**Features**:
- Full-width cinematic banner with gradient overlay
- Featured movie title and description
- Metadata: year, age rating, duration, genre, quality
- Action buttons: Watch Now, Add to List, More Info

**Usage**:
```jsx
<MocaemtuiHero 
  featuredMovie={featuredMovie}
  onWatchClick={handleWatch}
  onAddToList={handleAddToList}
  onMoreInfo={handleMoreInfo}
/>
```

### 3. MocaemtuiMovieCard

**Location**: `src/components/MocaemtuiMovieCard.jsx`

Individual movie card with hover expansion effects.

**Features**:
- Poster or landscape thumbnail
- Movie title, year, quality badge
- Episode count for series
- Hover effects: scale up, reveal more information
- Buttons: Watch, Add, More Info
- Smooth transitions and shadows

**Usage**:
```jsx
<MocaemtuiMovieCard
  movie={movie}
  onWatch={handleWatch}
  onAddToList={handleAddToList}
  onMoreInfo={handleMoreInfo}
/>
```

### 4. MocaemtuiMovieRow

**Location**: `src/components/MocaemtuiMovieRow.jsx`

Horizontal carousel row for movie categories.

**Features**:
- Horizontal scrolling with arrow buttons
- Smooth scroll behavior
- Touch/swipe support for mobile
- View All button for category navigation
- Responsive card sizing

**Usage**:
```jsx
<MocaemtuiMovieRow
  title="Trending Now"
  movies={movies}
  onWatch={handleWatch}
  onAddToList={handleAddToList}
  onMoreInfo={handleMoreInfo}
  onViewAll={handleViewAll}
/>
```

### 5. MocaemtuiMovieGrid

**Location**: `src/components/MocaemtuiMovieGrid.jsx`

Full movie grid with sidebar filters.

**Features**:
- Left sidebar filters on desktop
- Filter drawer on mobile
- Filters: genre, country, release year, quality, movie type, status, sort order
- Responsive grid layout: 6 columns desktop, 4 tablet, 2 mobile
- Active filter indicators

**Usage**:
```jsx
<MocaemtuiMovieGrid
  movies={allMovies}
  onWatch={handleWatch}
  onAddToList={handleAddToList}
  onMoreInfo={handleMoreInfo}
/>
```

### 6. MocaemtuiMovieModal

**Location**: `src/components/MocaemtuiMovieModal.jsx`

Detailed movie modal with tabbed content.

**Features**:
- Large banner top with gradient
- Movie title, description, metadata
- Action buttons: Watch Now, Add to List, Share
- Tabs: Overview, Episodes, Trailer, Comments, Related
- Comprehensive movie information display
- Episode list for series with thumbnails

**Usage**:
```jsx
<MocaemtuiMovieModal
  open={modalOpen}
  onClose={handleModalClose}
  movie={selectedMovie}
  onWatch={handleWatch}
  onAddToList={handleAddToList}
/>
```

### 7. MocaemtuiSearchOverlay

**Location**: `src/components/MocaemtuiSearchOverlay.jsx`

Command palette style search overlay.

**Features**:
- Large search input with focus animation
- Instant results with poster, title, year, genre, quality
- Watch button for each result
- Popular searches section
- Keyboard support (Escape to close)

**Usage**:
```jsx
<MocaemtuiSearchOverlay
  open={searchOpen}
  onClose={handleSearchClose}
  onSearch={handleSearch}
  onWatchMovie={handleWatchMovie}
/>
```

### 8. MocaemtuiHome

**Location**: `src/pages/MocaemtuiHome.jsx`

Main home page integrating all components.

**Features**:
- Hero section with featured movie
- Multiple movie rows for different categories
- Full movie grid with filters
- Search overlay integration
- Movie modal integration
- Mock data generation for demonstration

**Usage**:
Navigate to `/mocaemtui` to view the complete design.

## Movie Categories

The design includes the following movie row categories:
- Trending Now
- New Releases
- Latest Updates
- Popular Movies
- Hot Series
- New Anime
- Action Movies
- Horror Movies
- Sci-Fi Movies
- Korean Movies
- Chinese Movies
- US/UK Movies
- Continue Watching
- My List

## Responsive Design

### Desktop (> 1024px)
- Full header with all navigation items
- 6-column movie grid
- Desktop sidebar filters
- Full-size hero section

### Tablet (768px - 1024px)
- 4-column movie grid
- Compact sidebar filters
- Adjusted hero section

### Mobile (< 768px)
- Hamburger menu for navigation
- 2-column movie grid
- Filter drawer instead of sidebar
- Touch-optimized interactions
- Swipeable movie rows

## Typography

**Font Family**: Inter, Manrope, Space Grotesk (fallback to system fonts)

**Font Weights**:
- Light: 300
- Regular: 400
- Medium: 500
- Semibold: 600
- Bold: 700
- Extra Bold: 800

## Animations

The design includes smooth animations for:
- Header scroll transition
- Movie card hover effects
- Carousel scrolling
- Modal open/close
- Search overlay appearance
- Tab transitions
- Button hover states

## Accessibility

- Focus visible states for keyboard navigation
- Semantic HTML structure
- ARIA labels where appropriate
- Keyboard shortcuts (Escape to close modals)
- Touch-friendly tap targets on mobile

## Customization

### Colors

Modify the CSS variables in `src/styles/mocaemtui-global.css`:

```css
:root {
  --accent-color: #ff2b3a;
  --background-primary: #050505;
  /* ... other variables */
}
```

### Fonts

Import custom fonts in the global CSS file:

```css
@import url('https://fonts.googleapis.com/css2?family=...');
```

## Integration

To use the Mocaemtui design system in your existing application:

1. Import the global CSS in your main entry point:
```jsx
import './styles/mocaemtui-global.css';
```

2. Use the components as needed in your pages:
```jsx
import MocaemtuiHeader from './components/MocaemtuiHeader';
import MocaemtuiHero from './components/MocaemtuiHero';
// ... other imports
```

3. Connect to your API by replacing the mock data in `MocaemtuiHome.jsx` with actual API calls.

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Lazy loading for images
- CSS animations instead of JavaScript where possible
- Optimized re-renders with React hooks
- Debounced scroll events
- Code splitting ready

## Future Enhancements

- Add skeleton loading states
- Implement infinite scroll for movie grids
- Add video previews on hover
- Implement user preferences (dark/light mode)
- Add accessibility improvements (screen reader support)
- Implement PWA features
