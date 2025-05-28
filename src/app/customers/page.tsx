'use client';

import { useEffect, useState, useRef } from 'react';

type Customer = {
  id: number;
  name: string;
};

export default function CustomersClient() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true);
  const loaderRef = useRef(null);

  const fetchMoreCustomers = async (pageNumber: number) => {
    if (!hasMorePages) return;

    try {
      const response = await fetch(`/api/customers?page=${pageNumber}`);
      const customerData = await response.json();

      const newCustomers = customerData.customers;
      const updatedCustomers = customers.concat(newCustomers);
      setCustomers(updatedCustomers);

      setCurrentPage(pageNumber);

      if (pageNumber >= customerData.totalPages || newCustomers.length === 0) {
        setHasMorePages(false);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  // run this once to render the first batch of customers and set page number as 1
  useEffect(() => {
    fetchMoreCustomers(1);
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
      fetchMoreCustomers(nextPage);
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

  // compile list of customers, customers is always the list of all customers so this gets slower with each page
  // could be improved by not iterating over customers already displayed
  const listItems = [];
  for (let i = 0; i < customers.length; i++) {
    const customer = customers[i];
    listItems.push(
      <li key={customer.id}>
        {customer.name}
      </li>
    );
  }


  return (
    <div>
      <h1>customers</h1>
      <ul>{listItems}</ul>
      <div ref={loaderRef} style={{ height: '100px' }} />
    </div>
  );
}