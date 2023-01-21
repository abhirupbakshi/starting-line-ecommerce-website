import { get_user, update_user, create_user } from "./modules/users.js"

async function check_email_avilibility(email)
{
    try {
        let user_list = await get_user();
        
        for(let i = 0; i < user_list.length; i++)
        {
            if(user_list[i].email == email) return false;
        }

        return true;
    } catch (error) {
        return error
    }        
}

function check_password_validity(password)
{
    // Checking for length
    let length;
    if(!(password.length >= 10 && password.length <= 25))
    {
        document.querySelector("#pass-rules p:nth-child(2)").style.color = "#dc3747";
        length = false;
    }
    else 
    {
        document.querySelector("#pass-rules p:nth-child(2)").style.color = "#1d8957";
        length = true;
    }

    // Checking for number
    let num;
    let is_present = false;
    password.split("").forEach(element =>
    {
        if(Number.isInteger(+element) && element != " ") is_present = true;
    })
    if(is_present)
    {
        document.querySelector("#pass-rules p:nth-child(3)").style.color = "#1d8957"
        num = true;
    }
    else 
    {
        document.querySelector("#pass-rules p:nth-child(3)").style.color = "#dc3747";
        num = false;
    }

    // Checking for uppercase
    let upper_case;
    is_present = false;
    password.split("").forEach(element => {
        if(element.charCodeAt(0) >= "A".charCodeAt(0) && element.charCodeAt(0) <= "Z".charCodeAt(0)) is_present = true;
    })
    if(is_present)
    {
        document.querySelector("#pass-rules p:nth-child(4)").style.color = "#1d8957"
        upper_case = true;
    }
    else 
    {
        document.querySelector("#pass-rules p:nth-child(4)").style.color = "#dc3747";
        upper_case = false;
    }

    // Checking for lowercase
    let lower_case;
    is_present = false;
    password.split("").forEach(element => {
        if(element.charCodeAt(0) >= "a".charCodeAt(0) && element.charCodeAt(0) <= "z".charCodeAt(0)) is_present = true;
    })
    if(is_present) 
    {
        document.querySelector("#pass-rules p:nth-child(5)").style.color = "#1d8957"
        lower_case = true;
    }
    else 
    {
        document.querySelector("#pass-rules p:nth-child(5)").style.color = "#dc3747";
        lower_case = false;
    }

    // Checking for special char
    let special_char;
    is_present = false;
    password.split("").forEach(element => {
        if( !(element.charCodeAt(0) >= "a".charCodeAt(0) && element.charCodeAt(0) <= "z".charCodeAt(0)) &&
            !(element.charCodeAt(0) >= "A".charCodeAt(0) && element.charCodeAt(0) <= "Z".charCodeAt(0)) &&
            !(element.charCodeAt(0) >= "0".charCodeAt(0) && element.charCodeAt(0) <= "9".charCodeAt(0)) &&
            element != " ") 
                is_present = true;
    })
    if(is_present) 
    {
        document.querySelector("#pass-rules p:nth-child(6)").style.color = "#1d8957"
        special_char = true;
    }
    else 
    {
        document.querySelector("#pass-rules p:nth-child(6)").style.color = "#dc3747";
        special_char = false;
    }

    return length && num && upper_case && lower_case && special_char;
}

let pass_validity = false;
check_password_validity(document.querySelector("#password").value);
let loggedin_user = JSON.parse(localStorage.getItem("loggedin-user"));

if(loggedin_user != null) 
{
    document.body.style.display = "none";
    console.error("Already logged in");
}


document.querySelector("form").addEventListener("submit", event =>
{
    event.preventDefault();

    document.querySelector("form input:last-child").setAttribute("value", "SIGNING UP...")

    if(pass_validity)
    {
        let user = {
            name: document.querySelector("#name").value,
            email: document.querySelector("#email").value,
            password: document.querySelector("#password").value,
            cart: []
        }

        console.log(1);
        check_email_avilibility(user.email)
        .then(value => {
            if(value)
            {
                create_user(user.name, user.password, user.email)
                .then(response =>
                {
                    window.location.href = "./signin.html";
                })
                .catch(error =>
                {
                    alert("Can not create user");
                    console.error(error);
                    console.error("Cannot create user");
                    document.querySelector("form input:last-child").setAttribute("value", "SIGN UP");
                })
            }
            else
            {
                alert("Email already present");
                document.querySelector("form input:last-child").setAttribute("value", "SIGN UP");
                return;
            }
        })
    }
})

document.querySelector("#password").addEventListener("keyup", event =>
{
    pass_validity = check_password_validity(document.querySelector("#password").value);
})

document.querySelector("#password").addEventListener("focus", event =>
{
    document.querySelector("#pass-rules").style.display = "block";
})

document.querySelector("#password").addEventListener("blur", event =>
{
    document.querySelector("#pass-rules").style.display = "none";
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