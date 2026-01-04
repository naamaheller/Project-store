import { Product } from "@/app/models/product.model";
import { Card, CardContent, CardFooter } from "../ui/Card";

interface Props {
  product: Product;
  onClick: (product: Product) => void;
}

export function ProductCard({ product, onClick }: Props) {
  return (
    <Card
      className="hover:shadow-md transition cursor-pointer"
      onClick={() => onClick(product)}
    >
      <CardContent className="flex flex-col gap-3">
        <div className="aspect-square bg-background-muted rounded-md flex items-center justify-center text-text-muted">
          IMG
        </div>

        <div className="flex flex-col gap-1">
          <h2 className="text-base font-semibold text-text line-clamp-2">
            {product.name}
          </h2>

          <p className="text-sm text-text-muted">₪{product.price}</p>
        </div>
      </CardContent>
    </Card>
  );
}

