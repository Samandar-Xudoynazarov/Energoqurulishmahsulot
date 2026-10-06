import { getProductsFresh as getProducts } from '../../../../lib/products-store';
import { findProductBySlug, safeDecode } from '../../../../lib/product-utils';
import ProductForm from '../../../components/ProductForm';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function EditProductPage({
  params,
  searchParams,
}: {
  params: { code: string };
  searchParams: { code?: string };
}) {
  const products = await getProducts();
  // 1) ?code= (aniq kod)  2) yo'ldagi kod  3) slug (masalan «sb-95-3»)
  const code = searchParams.code || safeDecode(params.code);
  const product = products.find((p) => p.code === code) || findProductBySlug(products, params.code);

  if (!product) {
    notFound();
  }

  return <ProductForm initial={product} isEdit />;
}
