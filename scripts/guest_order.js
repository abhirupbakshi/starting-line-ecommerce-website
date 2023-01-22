import { get_product } from "./modules/products.js"

function show_cart(cart, products)
{
    document.querySelector("#cart-list").innerHTML = "";

    let total = 0;
    cart.forEach(element => {
        for(let i = 0; i < products.length; i++)
        {
            if(products[i].uuid == element.product_uuid)
            {
                let parent = document.createElement("div");
                document.querySelector("#cart-list").append(parent);
                parent.setAttribute("class", "cart-card");

                let img = document.createElement("img");
                parent.append(img);
                img.setAttribute("src", products[i].img);

                let _parent = document.createElement("div");
                parent.append(_parent);
                
                let child = document.createElement("h2");
                _parent.append(child);
                child.setAttribute("class", "name");
                child.innerText = products[i].name;

                child = document.createElement("h3");
                _parent.append(child);
                child.setAttribute("class", "price");
                child.innerText = "$" + products[i].price;

                child = document.createElement("form");
                _parent.append(child);
                child.setAttribute("class", "quantity-form");

                let _child = document.createElement("input");
                child.append(_child);
                _child.setAttribute("class", "quantity");
                _child.setAttribute("type", "number");
                _child.setAttribute("min", "1");
                _child.value = element.quantity;

                _child = document.createElement("input");
                child.append(_child);
                _child.setAttribute("type", "submit");
                _child.setAttribute("value", "Update Quantity");
                _child.setAttribute("class", "submit-quantity");

                child = document.createElement("button");
                _parent.append(child);
                child.setAttribute("class", "delete-btn");
                child.innerText = "Delete from Cart";

                child = document.createElement("p");
                _parent.append(child);
                child.setAttribute("class", "cart-item-uuid");
                child.innerText = element.uuid;
                child.style.display = "none";

                total += products[i].price * element.quantity;
            }
        }

        document.querySelector("#total").innerText = "$" + total;
    });
}

let cart = JSON.parse(localStorage.getItem("cart")) || [];

get_product()
.then(products => {
    show_cart(cart, products);

    document.querySelector("#cart-list").addEventListener("click", event =>
    {
        if(event.target.getAttribute("class") != "delete-btn") return;

        event.target.innerText = "Deleting..."

        let temp = [];
        for(let i = 0; i < cart.length; i++)
        {
            if(cart[i].uuid != event.target.parentElement.querySelector(".cart-item-uuid").innerText)
            {
                temp.push(cart[i]);
            }
        }
        cart = temp;

        localStorage.setItem("cart", JSON.stringify(cart));
        show_cart(cart, products);
    })

    document.querySelector("#cart-list").addEventListener("submit", event =>
    {
        event.preventDefault();
        
        if(event.target.getAttribute("class") != "quantity-form") return;

        event.target.parentElement.querySelector(".submit-quantity").setAttribute("value", "Updating...");

        for(let i = 0; i < cart.length; i++)
        {
            if(cart[i].uuid == event.target.parentElement.querySelector(".cart-item-uuid").innerText)
            {
                cart[i].quantity = event.target.parentElement.querySelector(".quantity").value;
                break;
            }
        }
        
        localStorage.setItem("cart", JSON.stringify(cart));
        event.target.parentElement.querySelector(".submit-quantity").setAttribute("value", "Updated!");
        setTimeout(() => {
            show_cart(cart, products);
        }, 500)
        
    })

})
.catch(error => {
    console.error(error);
})

