import { getProductsFresh as getProducts } from '../../../../lib/products-store';
import ProductForm from '../../../components/ProductForm';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function EditProductPage({ params }: { params: { code: string } }) {
  const products = await getProducts();
  const product = products.find((p) => p.code === decodeURIComponent(params.code));

  if (!product) {
    notFound();
  }

  return <ProductForm initial={product} isEdit />;
}
