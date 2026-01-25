import { getPhoneById } from '@/services/api';
import { ProductDetail, ProductError } from '@/components/product';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;

  let phone;
  try {
    phone = await getPhoneById(id);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : '';
    return <ProductError message={message} />;
  }

  return (
    <main>
      <ProductDetail phone={phone} />
    </main>
  );
}
