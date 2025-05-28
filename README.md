## Setup
The best way to interact with this demo is through my Vercel deployment at https://bcproject-two.vercel.app/
This is because the geolocation features won't work without my Google Maps token which is included as an environment variable
You may still get some use out of the demo locally by running npm run dev and heading to http://localhost:3000

## Features
This is a basic dashboard with 5 pages:

- Connection page
  Enter your store's API credentials here
- Dashboard
  Displays the store name you have connected with, takes you to the other 3 pages
- Products
  Fetches the store's products and displays them using infinite scrolling
- Customers
  Fetches customers and displays them in the same way as products
- Analytics
  Fetches all orders and geolocates them based on the billing address, puts a pin on the map based on the coordinates of the addresses

Pretty please don't run the analytics page on a store with millions of orders or my free Google maps token will get drained, thank you kindly
