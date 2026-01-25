import { getPhoneById } from '@/services/api';
import { ProductDetail } from '@/components/product';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;

  let phone;
  try {
    phone = await getPhoneById(id);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unable to load product data.';
    return (
      <main style={{ padding: 24 }}>
        <h2>Unable to load product</h2>
        <p>{message}</p>
      </main>
    );
  }

  return (
    <main>
      <ProductDetail phone={phone} />
    </main>
  );
}
