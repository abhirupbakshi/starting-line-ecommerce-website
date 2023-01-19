function sync_cart(local_cart, server_cart)
{
    for(let i = 0; i < local_cart.length; i++)
    {
        let not_present = true;
        for(let j = 0; j < server_cart.length; j++)
        {
            if(local_cart[i].id == server_cart[j].id)
            {
                not_present = false;
                if(local_cart[i].quantity > server_cart[j].quantity)
                {
                    server_cart[j].quantity = local_cart[i].quantity;
                }
            }
        }

        if(not_present) server_cart.push(local_cart[i]);
    }

    return server_cart;
}

function update_cart(cart, item)
{
    let not_present = true;
    for(let i = 0; i < cart.length; i++)
    {
        if(cart[i].id == item.id)
        {
            cart[i].quantity++;
            not_present = false;
            break;
        }
    }
    if(not_present)
    {
        let temp = {};
        temp["id"] = item.id;
        temp["quantity"] = 1;

        cart.push(temp);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
}

function display_item(item)
{
    document.querySelector("#image-div").setAttribute("src", item.img);
    document.querySelector("#product-name").innerText = item.name.toUpperCase();
    document.querySelector("#product-price").innerText = "$" + item.price;

    let parent = document.querySelector("#sizes-div");
    parent.innerHTML = "";
    item.size.forEach(element => {
        let child = document.createElement("span");
        parent.append(child);
        child.innerText = element;
    });
}

let loggedin_user = JSON.parse(localStorage.getItem("loggedin-user"));
let cart = JSON.parse(localStorage.getItem("cart")) || [];

get_items()
.then(item =>{
    if(item.length > 1) return;
    item = item[0];

    display_item(item);

    if(loggedin_user != null)
    {
        get_user(loggedin_user)
        .then(user =>
        {
            if(user.cart == undefined) user.cart = [];
            cart = user.cart;
            localStorage.setItem("cart", JSON.stringify(cart));
        })
        .catch(error =>
        {
            console.error(error);
            return;
        })
    }

    document.querySelector("#add-to-cart").addEventListener("click", event =>
    {
        update_cart(cart, item);

        if(loggedin_user != null)
        {
            let temp = {};
            temp["cart"] = cart;

            update_user(loggedin_user, temp)
            .catch(error =>
            {
                console.error(error);
            })
        }
    })

    console.log(item);
})
.catch(error =>{
    console.error(error);
})