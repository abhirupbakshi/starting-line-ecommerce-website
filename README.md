# MasaiSchool-CW-17-1-23-finishline.com

A [finishline.com](https:www.finishline.com) clone for MasaiSchool's CW project

Each product contents:

* id: "ID of the product"
* name: "Name of the product"
* rating: {avg: "Rating out of 5", count: "No of people who have rated"}
* price: "price of the product"
* trending: "Trending status - true or false value"
* target-customer: women|men|girls|boys
* type: [shoe|clothing, (if it's show) running|casual|formal|slippers || (if it's clothing) Bottom|jacket|swetshirt|jeans|socks]
* size: (if it's shoe) 6.0|6.5|7.0|7.5|8.0|8.5|9.0|9.5|10.0|10.5|11.0|11.5|12.0|12.5|13.0|14.0|15.0|16.0|17.0|18.0 || (if it's clothing) S|M|L|XL|XXL
* description: "some description"
* review: [{user id: "review"}, {user id: "review"}, ...]


Each user contents:

* id: "User ID"
* name: "Name of the user"
* password: "Password of the user"
* cart: [product id, product id, ...]
* given-rivews: [product id, product id, ...]
