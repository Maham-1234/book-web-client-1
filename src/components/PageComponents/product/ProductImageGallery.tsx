import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ProductImageGalleryProps {
  images?: string[];
}

export const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  images,
}) => {
  const [mainImage, setMainImage] = useState<string>(
    images?.[0] || "https://via.placeholder.com/600.png"
  );

  useEffect(() => {
    setMainImage(images?.[0] || "https://via.placeholder.com/600.png");
  }, [images]);

  if (!images || images.length === 0) {
    return (
      <img
        src={mainImage}
        alt="Product"
        className="w-full h-auto object-cover rounded-lg"
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Main image */}
      <div className="border rounded-lg overflow-hidden">
        <img
          src={mainImage}
          alt="Main product view"
          className="w-full h-auto object-cover aspect-square"
        />
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-5 gap-2">
        {images.map((img, index) => (
          <button
            key={index}
            type="button"
            className={cn(
              "border rounded-md overflow-hidden aspect-square focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              mainImage === img && "ring-2 ring-primary"
            )}
            onClick={() => setMainImage(img)}
          >
            <img
              src={img}
              alt={`Product thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};
