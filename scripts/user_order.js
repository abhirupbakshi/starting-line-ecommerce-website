import { get_product } from "./modules/products.js"
import { get_user, update_user } from "./modules/users.js"
import { create_UUID } from "./modules/uuid.js";

function show_cart(cart, products)
{
    document.querySelector("#cart-list").innerHTML = "";

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
            }
        }
    });
}

let loggedin_user = JSON.parse(localStorage.getItem("loggedin-user"));

if(loggedin_user == null) 
{
    document.body.style.display = "none";
    console.error("Not logged in");
    window.location.href = "./index.html";
}

get_product()
.then(products =>
{
    get_user(loggedin_user)
    .then(user =>
    {
        show_cart(user.cart, products);
        
        document.querySelector("#cart-list").addEventListener("click", event =>
        {
            if(event.target.getAttribute("class") != "delete-btn") return;

            event.target.innerText = "Deleting..."

            let temp = [];
            for(let i = 0; i < user.cart.length; i++)
            {
                if(user.cart[i].uuid != event.target.parentElement.querySelector(".cart-item-uuid").innerText)
                {
                    temp.push(user.cart[i]);
                }
            }
            user.cart = temp;
            
            update_user(user)
            .then(data =>
            {
                localStorage.setItem("cart", JSON.stringify(user.cart));
                show_cart(user.cart, products);
            })
            .catch(error => {
                console.error(error);
                alert("Cannot Delete");
                event.target.innerText = "Delete"
            })
        })

        document.querySelector("#cart-list").addEventListener("submit", event =>
        {
            event.preventDefault();
            
            if(event.target.getAttribute("class") != "quantity-form") return;

            event.target.parentElement.querySelector(".submit-quantity").setAttribute("value", "Updating...");

            for(let i = 0; i < user.cart.length; i++)
            {
                if(user.cart[i].uuid == event.target.parentElement.querySelector(".cart-item-uuid").innerText)
                {
                    user.cart[i].quantity = event.target.parentElement.querySelector(".quantity").value;
                    break;
                }
            }
            
            update_user(user)
            .then(data =>
            {
                localStorage.setItem("cart", JSON.stringify(user.cart));
                show_cart(user.cart, products);
            })
            .catch(error => {
                console.error(error);
                alert("Cannot Update");
                event.target.parentElement.querySelector(".submit-quantity").setAttribute("value", "Update Quantity");
            })
        })
    })
    .catch(error =>
    {
        console.error(error);
    })
})
.catch(error =>
{
    console.error(error);
})


