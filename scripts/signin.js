import { get_user, update_user } from "./modules/users.js"

function sync_carts(server_cart, local_cart)
{
    for(let i = 0;  i < local_cart.length; i++)
    {
        let not_present = true;
        for(let j = 0; j < server_cart.length; j++)
        {
            if(local_cart[i].uuid == server_cart[j].uuid)
            {
                if(local_cart[i].quantity != server_cart[j].quantity)
                {
                    server_cart[j].quantity += local_cart[i].quantity;
                }

                not_present = false;
            }
        }

        if(not_present) server_cart.push(local_cart[i]);
    }

    return server_cart;
}

let loggedin_user = JSON.parse(localStorage.getItem("loggedin-user"));
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let user;

if(loggedin_user != null) 
{
    document.body.style.display = "none";
    console.error("Already logged in");
    window.location.href = "./index.html";
}

get_user() //Getting all user
.then(data =>
{
    user = data;
})
.catch(error =>
{
    console.error(error);
})

document.querySelector("form").addEventListener("submit", event =>
{
    event.preventDefault();

    document.querySelector("form input:last-child").setAttribute("value", "SIGNING IN...");

    let not_found = true;

    for(let i = 0; i < user.length; i++)
    {
        if(user[i].email == document.querySelector("#email").value && user[i].password == document.querySelector("#password").value)
        {
            not_found = false;
            
            loggedin_user = user[i].uuid;

            user[i].cart = sync_carts(user[i].cart, cart);

            update_user(user[i])
            .then(response => {
                localStorage.setItem("loggedin-user", JSON.stringify(loggedin_user));
                localStorage.setItem("cart", JSON.stringify(user[i].cart));
                document.querySelector("#wrong-credentials").style.display = "none";
                window.location.href = "./index.html";
            })
            .catch(error => {
                console.error(error);
            })

            break;
        }
    }

    if(not_found)
    {
        document.querySelector("#wrong-credentials").style.display = "block";
        document.querySelector("form input:last-child").setAttribute("value", "SIGN IN");
    }
})

document.querySelector("#pass-show").addEventListener("click", event =>
{
    if(document.querySelector("#pass-show").innerText == "Show")
    {
        document.querySelector("#password").setAttribute("type", "text");
        document.querySelector("#pass-show").innerText = "Hide";
    }
    else
    {
        document.querySelector("#password").setAttribute("type", "password");
        document.querySelector("#pass-show").innerText = "Show";
    }
})

document.querySelector("#nav-bar img").addEventListener("click", event =>
{
    window.location.href = "./index.html"
})