import { getPhones } from '@/services/api';

export default async function Home() {
  // Test API connection
  const phones = await getPhones();

  return (
    <main style={{ padding: '20px' }}>
      <h1>Mobile Store</h1>
      <p>API Test: Found {phones.length} phones</p>
      <hr />
      <h2>First 5 phones:</h2>
      <ul>
        {phones.slice(0, 5).map((phone) => (
          <li key={phone.id}>
            {phone.brand} - {phone.name} - €{phone.basePrice}
          </li>
        ))}
      </ul>
    </main>
  );
}
