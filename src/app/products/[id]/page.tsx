import { getPhoneById } from '@/services/api';
import { ProductDetail } from '@/components/product';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;

  try {
    const phone = await getPhoneById(id);

    return (
      <main>
        <ProductDetail phone={phone} />
      </main>
    );
  } catch (err: any) {
    const message = err?.message || 'Unable to load product data.';
    return (
      <main style={{ padding: 24 }}>
        <h2>Unable to load product</h2>
        <p>{message}</p>
      </main>
    );
  }
}
