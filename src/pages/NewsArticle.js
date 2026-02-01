import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { newsItems } from '../data/newsItems';
import Header from '../components/Header';
import './NewsArticle.css';

function NewsArticle() {
  const { slug } = useParams();
  const article = newsItems.find((item) => item.slug === slug);

  // Use normal scroll on article pages (disable main site's scroll-snap and wheel hijacking)
  useEffect(() => {
    document.documentElement.setAttribute('data-page', 'article');
    window.scrollTo(0, 0);
    return () => {
      document.documentElement.removeAttribute('data-page');
    };
  }, [slug]);

  if (!article) {
    return (
      <div className="news-article-page">
        <Header />
        <main className="news-article-main">
          <div className="news-article-not-found">
            <h1>Article not found</h1>
            <Link to="/" className="news-article-back">← Back to home</Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="news-article-page">
      <Header />
      <main className="news-article-main">
        <article className="news-article">
          <Link to="/#news" className="news-article-back">← Back to latest news</Link>

          {article.logoImage && (
            <div className="news-article-logo">
              <img src={article.logoImage} alt="" className="news-article-logo-image" />
            </div>
          )}

          {article.featuredImage && (
            <div className="news-article-featured">
              <img src={article.featuredImage} alt="" className="news-article-featured-image" />
            </div>
          )}

          {!article.logoImage && !article.featuredImage && (
            <div className="news-article-hero">
              <img src={article.image} alt={article.title} className="news-article-image" />
            </div>
          )}

          <div className="news-article-body">
            <h1 className="news-article-title">{article.title}</h1>
            
            {/* Interleaved content - text and images mixed throughout */}
            {article.content && article.content.length > 0 ? (
              <div className="news-article-content">
                {article.content.map((item, i) => (
                  item.type === 'text' ? (
                    <p key={i} className="news-article-text">{item.value}</p>
                  ) : item.type === 'image' ? (
                    <div key={i} className="news-article-inline-image">
                      <img src={item.value} alt="" />
                    </div>
                  ) : item.type === 'list' ? (
                    <ul key={i} className="news-article-list">
                      {item.value.map((listItem, j) => (
                        <li key={j}>{listItem}</li>
                      ))}
                    </ul>
                  ) : null
                ))}
              </div>
            ) : article.fullText && article.fullText.length > 0 ? (
              <div className="news-article-paragraphs">
                {article.fullText.map((paragraph, i) => (
                  <p key={i} className="news-article-text">{paragraph}</p>
                ))}
              </div>
            ) : (
              <p className="news-article-text">{article.text}</p>
            )}

            {article.youtubeVideo && (
              <div className="news-article-video">
                <div className="news-article-video-wrapper">
                  <iframe
                    src={`https://www.youtube.com/embed/${article.youtubeVideo}`}
                    title="YouTube video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}

            {article.mediaSection && (
              <div className="news-article-media-section">
                <div className="news-article-media-image">
                  <img src={article.mediaSection.image} alt="" />
                </div>
                <div className="news-article-media-video">
                  <div className="news-article-video-wrapper">
                    <iframe
                      src={`https://www.youtube.com/embed/${article.mediaSection.youtubeVideo}`}
                      title="YouTube video"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              </div>
            )}

            {article.galleryImages && article.galleryImages.length > 0 && (
              <div className="news-article-gallery">
                {article.galleryImages.map((src, i) => (
                  <div key={i} className="news-article-gallery-item">
                    <img src={src} alt="" className="news-article-gallery-image" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </article>
      </main>
    </div>
  );
}

export default NewsArticle;
