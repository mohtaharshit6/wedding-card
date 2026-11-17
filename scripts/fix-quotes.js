const fs = require('fs');

// Function to fix escaped quotes in files
function fixEscapedQuotes(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/\\"/g, '"');
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Fixed quotes in', filePath);
}

fixEscapedQuotes('components/wedding/EventsSection.tsx');
fixEscapedQuotes('components/wedding/HeroSection.tsx');
fixEscapedQuotes('components/wedding/PolaroidCarousel.tsx');
fixEscapedQuotes('components/wedding/ScratchCard.tsx');
fixEscapedQuotes('components/wedding/VenueSection.tsx');
