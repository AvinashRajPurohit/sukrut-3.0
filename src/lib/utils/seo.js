/**
 * Auto-generate SEO metadata from blog content
 */

/**
 * Strip HTML tags and get plain text (server-side compatible)
 */
function stripHtml(html) {
  if (!html) return '';
  // Remove HTML tags
  let text = html.replace(/<[^>]*>/g, '');
  // Decode common HTML entities
  text = text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
  return text.trim();
}

/**
 * Generate meta title from blog title
 * Default: "Title | Blog"
 * Max length: 60 characters
 */
export function generateMetaTitle(title, siteName = 'Sukrut') {
  if (!title) return `${siteName} Blog`;
  
  const maxLength = 60;
  const suffix = ` | ${siteName} Blog`;
  const availableLength = maxLength - suffix.length;
  
  if (title.length <= availableLength) {
    return `${title}${suffix}`;
  }
  
  return `${title.substring(0, availableLength - 3)}...${suffix}`;
}

/**
 * Generate meta description from excerpt or content
 * Max length: 160 characters
 */
export function generateMetaDescription(excerpt, content) {
  // Prefer excerpt if available
  let text = excerpt || '';
  
  // If no excerpt, extract from content
  if (!text && content) {
    const plainText = stripHtml(content);
    // Get first 200 characters and find the last complete sentence
    const preview = plainText.substring(0, 200);
    const lastPeriod = preview.lastIndexOf('.');
    text = lastPeriod > 0 ? preview.substring(0, lastPeriod + 1) : preview;
  }
  
  // Trim to 160 characters
  if (text.length > 160) {
    // Try to cut at a sentence boundary
    const truncated = text.substring(0, 157);
    const lastPeriod = truncated.lastIndexOf('.');
    const lastSpace = truncated.lastIndexOf(' ');
    
    if (lastPeriod > 140) {
      return truncated.substring(0, lastPeriod + 1);
    } else if (lastSpace > 140) {
      return truncated.substring(0, lastSpace) + '...';
    } else {
      return truncated + '...';
    }
  }
  
  return text || 'Read our latest blog post';
}

/**
 * Extract keywords from title, excerpt, and content
 * Returns array of relevant keywords
 */
export function generateKeywords(title, excerpt, content, category) {
  const keywords = new Set();
  
  // Add category as primary keyword
  if (category && category !== 'All Articles') {
    keywords.add(category.toLowerCase());
  }
  
  // Extract words from title (2+ characters, exclude common words)
  const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should', 'could', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those']);
  
  const extractWords = (text) => {
    if (!text) return [];
    const plainText = stripHtml(text).toLowerCase();
    return plainText
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length >= 3 && !stopWords.has(word));
  };
  
  // Get words from title (high priority)
  const titleWords = extractWords(title);
  titleWords.slice(0, 5).forEach(word => keywords.add(word));
  
  // Get words from excerpt (medium priority)
  const excerptWords = extractWords(excerpt);
  excerptWords.slice(0, 3).forEach(word => keywords.add(word));
  
  // Get words from content (lower priority)
  const contentWords = extractWords(content);
  contentWords.slice(0, 5).forEach(word => {
    if (keywords.size < 10) {
      keywords.add(word);
    }
  });
  
  // Add common blog-related keywords
  keywords.add('blog');
  keywords.add('article');
  
  return Array.from(keywords).slice(0, 10);
}

/**
 * Generate all SEO metadata for a blog post
 */
export function generateSEOMetadata(title, excerpt, content, category) {
  return {
    metaTitle: generateMetaTitle(title),
    metaDescription: generateMetaDescription(excerpt, content),
    metaKeywords: generateKeywords(title, excerpt, content, category)
  };
}
