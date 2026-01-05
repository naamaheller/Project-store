"use client";

import { Product } from "@/app/models/product.model";
import { Table } from "@/app/components/ui/Table";
import { Button } from "@/app/components/ui/Button";

type Props = {
  products: Product[];
  onDelete: (product: Product) => void;
};

export function ProductsTable({ products, onDelete }: Props) {
  return (
    <Table>
      <Table.Head>
        <Table.Row>
          <Table.Th>Name</Table.Th>
          <Table.Th>Category</Table.Th>
          <Table.Th>Price</Table.Th>
          <Table.Th align="right">Actions</Table.Th>
        </Table.Row>
      </Table.Head>

      <Table.Body>
        {products.map((product) => (
          <Table.Row key={product.id}>
            <Table.Td>{product.name}</Table.Td>
            <Table.Td>
              {product.category?.name ?? "-"}
            </Table.Td>
            <Table.Td>₪{product.price}</Table.Td>
            <Table.Td align="right">
              <Button
                variant="danger"
                size="sm"
                onClick={() => onDelete(product)}
              >
                Delete
              </Button>
            </Table.Td>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}
