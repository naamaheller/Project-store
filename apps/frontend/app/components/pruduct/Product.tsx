import { Product } from "@/app/models/product.model";
import { Card, CardContent, CardFooter } from "../ui/Card";

interface Props {
  product: Product;
  onClick: (product: Product) => void;
}

export function ProductCard({ product, onClick }: Props) {
  return (
    <Card
      className="w-full hover:shadow-lg transition cursor-pointer"
      onClick={() => onClick(product)}
    >
      <CardContent className="flex flex-col gap-3 p-4 sm:p-5">
        {/* image */}
        <div className="h-32 sm:h-40 md:h-44 flex items-center justify-center">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="max-h-full w-auto object-contain"
            />
          ) : (
            <span className="text-text-muted text-sm">No image</span>
          )}
        </div>

        {/* text */}
        <div className="flex flex-col gap-1">
          <h2 className="text-base sm:text-lg font-semibold text-text leading-snug line-clamp-2">
            {product.name}
          </h2>

          <p className="text-sm sm:text-base font-medium text-text-muted">
            ₪{product.price}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

