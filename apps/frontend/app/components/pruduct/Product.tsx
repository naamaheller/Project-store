import { Product } from "@/app/models/product.model";
import { Card, CardContent, CardFooter } from "../ui/Card";

interface Props {
  product: Product;
  onClick: (product: Product) => void;
}

export function ProductCard({ product, onClick }: Props) {
  return (
    <Card
      className="hover:shadow-lg transition cursor-pointer"
      onClick={() => onClick(product)}
    >
      <CardContent className="flex flex-col gap-4 p-5">
        {/* image */}
        <div className="aspect-[4/3] bg-background-muted rounded-md overflow-hidden flex items-center justify-center">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-text-muted text-sm">No image</span>
          )}
        </div>


        {/* text */}
        <div className="flex flex-col gap-1.5">
          <h2 className="text-lg font-semibold text-text leading-snug line-clamp-2">
            {product.name}
          </h2>

          <p className="text-base font-medium text-text-muted">
            ₪{product.price}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
