import { useState, useCallback } from "react";
import "../../../styles/components/image-gallery-details.css";

export default function ImageGallery({ car }) {
  const [selectedImage, setSelectedImage] = useState(
    car?.gallery?.[0] || car?.cover_image,
  );

  const images = car?.gallery || [];
  const hasGallery = images && images.length > 0;

  const handleThumbnailClick = useCallback((image) => {
    setSelectedImage(image);
  }, []);

  const handlePrevImage = useCallback(() => {
    const currentIndex = images.findIndex(
      (img) => img.url === selectedImage.url,
    );
    if (currentIndex > 0) {
      setSelectedImage(images[currentIndex - 1]);
    }
  }, [images, selectedImage]);

  const handleNextImage = useCallback(() => {
    const currentIndex = images.findIndex(
      (img) => img.url === selectedImage.url,
    );
    if (currentIndex < images.length - 1) {
      setSelectedImage(images[currentIndex + 1]);
    }
  }, [images, selectedImage]);

  return (
    <div className="image-gallery">
      {/* Main Image */}
      <div className="image-gallery__main">
        <div className="image-gallery__main-container">
          <img
            src={selectedImage?.url || car?.cover_image}
            alt={`${car?.brand} ${car?.model}`}
            className="image-gallery__main-image"
            onError={(e) => {
              e.currentTarget.src = "/images/default-car.png";
            }}
          />

          {/* Navigation Arrows */}
          {hasGallery && images.length > 1 && (
            <>
              <button
                className="image-gallery__arrow image-gallery__arrow--prev"
                onClick={handlePrevImage}
                aria-label="Image précédente"
              >
                ←
              </button>
              <button
                className="image-gallery__arrow image-gallery__arrow--next"
                onClick={handleNextImage}
                aria-label="Image suivante"
              >
                →
              </button>
            </>
          )}
        </div>

        {/* Image Counter */}
        {hasGallery && (
          <div className="image-gallery__counter">
            {images.findIndex((img) => img.url === selectedImage.url) + 1} /{" "}
            {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {hasGallery && (
        <div className="image-gallery__thumbnails">
          {images.map((image, index) => (
            <button
              key={image.id || index}
              className={`image-gallery__thumbnail ${
                selectedImage?.url === image.url
                  ? "image-gallery__thumbnail--active"
                  : ""
              }`}
              onClick={() => handleThumbnailClick(image)}
              aria-label={`Voir l'image ${index + 1}`}
            >
              <img
                src={image.url}
                alt={`Thumbnail ${index + 1}`}
                onError={(e) => {
                  e.currentTarget.src = "/images/default-car.png";
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
