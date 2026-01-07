import {
    uploadAdminProductImage,
    deleteAdminProductImage,
} from "../api/product.api";

export async function uploadProductImage(
    productId: number,
    file: File
) {
    const formData = new FormData();
    formData.append("image", file);

    const res = await uploadAdminProductImage(productId, formData);
    return res.data;
}


export async function deleteProductImage(productId: number) {
    const res = await deleteAdminProductImage(productId);
    return res.data;
}
