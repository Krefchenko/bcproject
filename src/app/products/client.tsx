'use client';

import { useEffect, useState, useRef } from 'react';

type Product = {
  id: number;
  name: string;
  price: number;
};

export default function ProductsClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true);
  const loaderRef = useRef(null);

  const fetchMoreProducts = async (pageNumber: number) => {
    if (!hasMorePages) return;

    try {
      const response = await fetch(`/api/products?page=${pageNumber}`);
      const productData = await response.json();

      const newProducts = productData.products;
      const updatedProducts = products.concat(newProducts);
      setProducts(updatedProducts);

      setCurrentPage(pageNumber);

      if (pageNumber >= productData.totalPages || newProducts.length === 0) {
        setHasMorePages(false);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchMoreProducts(1);
  }, []);


  // Interaction observer doc: https://www.npmjs.com/package/react-intersection-observer
  // we use this to designate an area which triggers a function when visible
  useEffect(() => {
    const observer = new IntersectionObserver(function (entries) {
    // when we call observer.observe later, this fires with an array of "entries" even if one item is passed in
    // we only look for the one div so it's always the first item in this array
    // firstEntry is an object with .target containing the actual element, and some other useful stuff, see below
    // https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry

    const firstEntry = entries[0];

    if (firstEntry.isIntersecting === true) {
      const nextPage = currentPage + 1;
      fetchMoreProducts(nextPage);
    }
    }, {
    // threshold: 1 means the div must be fully visible before the callback runs, this can be 0.0 -> 1.0
    threshold: 1
    });

    const loader = loaderRef.current;
    if (loader) observer.observe(loader);

    // this part is apparantely necessary for cleanup
    return () => {
      if (loader) observer.unobserve(loader);
    };
  }, [currentPage, hasMorePages]);

  // compile list of products, products is always the list of all products so this gets slower with each page
  // could be improved by not iterating over products already displayed
  const listItems = [];
  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    listItems.push(
      <li key={product.id}>
        {product.name} - ${product.price}
      </li>
    );
  }


  return (
    <div>
      <h1>Products</h1>
      <ul>{listItems}</ul>
      <div ref={loaderRef} style={{ height: '100px' }} />
    </div>
  );
}