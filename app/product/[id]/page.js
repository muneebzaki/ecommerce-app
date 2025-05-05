import products from '../../data/products';

export default function ProductDetail({ params }) {
  const product = products.find(p => p.id === parseInt(params.id));

  if (!product) {
    return <h2>Product not found.</h2>;
  }

  return (
    <div className="container mt-5">
      <h1>{product.name}</h1>
      <img src={product.image} alt={product.name} className="img-fluid mb-3" />
      <p>{product.description}</p>
      <h4>${product.price}</h4>
    </div>
  );
}



  