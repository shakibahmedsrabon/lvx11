import pantheonImage from "@/assets/pantheon.jpg";

const ProductImageGallery = () => {
  return (
    <div className="w-full">
      <div className="w-full aspect-square overflow-hidden">
        <img
          src={pantheonImage}
          alt="Product view"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default ProductImageGallery;
