import { get_all_product } from "./modules/products.js"
import { get_user } from "./modules/users.js"


function show_hidden_div(hover_value, product_list)
{
    document.querySelector("#shoe").innerHTML = "";
    document.querySelector("#clothing").innerHTML = "";
    document.querySelector("#brand").innerHTML = "";

    // Getting shoe types
    let shoe_type = [];
    let temp = {}
    product_list.forEach(element =>
    {
        if(element.type[0] == "shoe" && temp[element.type[1]] == undefined)
        {
            temp[element.type[1]] = null;
        }
    })
    for(let i in temp) shoe_type.push(i);

    // Getting clothing types
    let clothing_type = [];
    temp = {}
    product_list.forEach(element =>
    {
        if(element.type[0] == "clothing" && temp[element.type[1]] == undefined)
        {
            temp[element.type[1]] = null;
        }
    })
    for(let i in temp) clothing_type.push(i);

    // Getting clothing brands
    let brand = [];
    temp = {}
    product_list.forEach(element =>
    {
        if(temp[element.brand] == undefined)
        {
            temp[element.brand] = null;
        }
    })
    for(let i in temp) brand.push(i);


    // Creating shoe section
    let child = document.createElement("a")
    document.querySelector("#shoe").append(child);
    child.innerText = "SHOE";
    child.setAttribute("href", `./product_list.html?type0=shoe&gender=${hover_value.toLowerCase()}`);
    
    shoe_type.forEach(element => {
        let child = document.createElement("a")
        document.querySelector("#shoe").append(child);
        child.innerText = element.toUpperCase();
        child.setAttribute("href", `./product_list.html?type1=${element}&gender=${hover_value.toLowerCase()}`)
    })

    // Creating clothing section
    child = document.createElement("a")
    document.querySelector("#clothing").append(child);
    child.innerText = "CLOTHING";
    child.setAttribute("href", `./product_list.html?type0=clothing&gender=${hover_value.toLowerCase()}`);
    
    clothing_type.forEach(element => {
        let child = document.createElement("a")
        document.querySelector("#clothing").append(child);
        child.innerText = element.toUpperCase();
        child.setAttribute("href", `./product_list.html?type1=${element}&gender=${hover_value.toLowerCase()}`);
    })

    // Creating brands section
    child = document.createElement("a")
    document.querySelector("#brand").append(child);
    child.innerText = "BRANDS";
    child.setAttribute("href", `./product_list.html?gender=${hover_value.toLowerCase()}`);
    
    brand.forEach(element => {
        let child = document.createElement("a")
        document.querySelector("#brand").append(child);
        child.innerText = element.toUpperCase();
        child.setAttribute("href", `./product_list.html?brand=${element}&gender=${hover_value.toLowerCase()}`);
    })
}

let loggedin_user = JSON.parse(localStorage.getItem("loggedin-user"));
let user = null;

get_all_product()
.then(product_list =>
{   
    document.querySelectorAll("#bottom-div a:not(.show-all-product)").forEach(element => {
        element.addEventListener("mouseover", event =>
        {
            if(event.target.getAttribute("class") != "show-all-product")
                show_hidden_div(event.target.innerText, product_list);
        })
    });
})
.catch(error =>
{
    console.error(error);
})

// Updating sign in, sign out section
if(loggedin_user != null)
{
    get_user(loggedin_user)
    .then(_user => {
        user = _user;
        document.querySelector("#account p").innerText = user.name;
    })
    .catch(error => {
        console.error(error);
    })

    let child = document.createElement("a");
    document.querySelector("#hidden-account-search-div").append(child);
    child.innerText = "Go to Your Account";
    child.setAttribute("href", "./user_account.html");

    child = document.createElement("a");
    document.querySelector("#hidden-account-search-div").append(child);
    child.innerText = "Go to Your orders";
    child.setAttribute("href", "./user_order.html");

    child = document.createElement("p");
    document.querySelector("#hidden-account-search-div").append(child);
    child.innerText = "Sign Out";
    child.setAttribute("id", "sign-out");
}
else
{
    let child = document.createElement("a");
    document.querySelector("#hidden-account-search-div").append(child);
    child.innerText = "See to Your orders";
    child.setAttribute("href", "./guest_order.html");

    child = document.createElement("a");
    document.querySelector("#hidden-account-search-div").append(child);
    child.innerText = "Sign In";
    child.setAttribute("href", "./signin.html");

    child = document.createElement("a");
    document.querySelector("#hidden-account-search-div").append(child);
    child.innerText = "Sign Up";
    child.setAttribute("href", "./signup.html");
}

document.querySelector("#hidden-account-search-div").addEventListener("click", event =>
{
    if(event.target.getAttribute("id") != "sign-out") return;

    localStorage.removeItem("loggedin-user");
    localStorage.removeItem("cart");
    window.location.href = window.location.href;
})

document.querySelectorAll("#account, #hidden-account-search-div").forEach(element =>
{
    element.addEventListener("mouseover", event => {
        document.querySelector("#hidden-account-search-div").style.display =  "block";
    })

    element.addEventListener("mouseout", event => {
        document.querySelector("#hidden-account-search-div").style.display =  "none";
    })
})