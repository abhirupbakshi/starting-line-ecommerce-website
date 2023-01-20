function sync_carts(server_cart, local_cart)
{
    for(let i = 0;  i < local_cart.length; i++)
    {
        let not_present = true;
        for(let j = 0; j < server_cart.length; j++)
        {
            if(local_cart[i].id == server_cart[j].id && local_cart[i].size == server_cart[j].size)
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

document.querySelector("form").addEventListener("submit", event =>
{
    event.preventDefault();

    get_user() //Getting all user
    .then(user => {

        let not_found = true;

        for(let i = 0; i < user.length; i++)
        {
            if(user[i].email == document.querySelector("#email").value && user[i].password == document.querySelector("#password").value)
            {
                not_found = false;
                
                loggedin_user = user[i].id;
                localStorage.setItem("loggedin-user", loggedin_user);

                if(user[i].cart == undefined) user[i].cart = [];
                user[i].cart = sync_carts(user[i].cart, cart);

                let temp = {};
                for(let key in user[i])
                {
                    temp[key] = user[i][key];
                }

                update_user(user[i].id, temp)
                .catch(error =>
                {
                    console.error(error);
                })

                cart = user[i].cart
                localStorage.setItem("cart", JSON.stringify(cart));

                document.querySelector("#wrong-credentials").style.display = "none";

                break;
            }
        }

        if(not_found)
        {
            document.querySelector("#wrong-credentials").style.display = "block";
        }
        else
        {
            // alert("Successfully logged in");
            window.location.href = "./index.html";
        }
    })
    .catch(error => {
        console.error(error);
    })
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