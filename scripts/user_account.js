import { get_user, update_user, delete_user } from "./modules/users.js"

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

function change_user_update_dom(target, user)
{
    can_submit = false;
    update_user(user)
    .then(response => {
        can_submit = true;
        
        target.querySelector("input:last-child").setAttribute("value", "Submitted!");

        setInterval(() => {
            target.querySelector("input:last-child").setAttribute("value", "Submit");
        }, 1000)

        document.querySelector("#user-name").innerText = user.name;
        document.querySelector("#user-email").innerText = user.email;
    })
    .catch(error => {
        console.error(error);
        can_submit = true;
        target.querySelector("input:last-child").setAttribute("value", "Submitted!");
        setInterval(() => {
            target.querySelector("input:last-child").setAttribute("value", "Submit");
        }, 1000)
    })
}

let loggedin_user = JSON.parse(localStorage.getItem("loggedin-user"));
let user;
let can_submit = true;
let random_otp;
let otp_field_visibility = false;
let pass_validity = false;
check_password_validity(document.querySelector(".change-pass input:first-child").value);

if(loggedin_user == null) 
{
    document.body.style.display = "none";
    console.error("Not logged in");
    window.location.href = "./index.html";
}


get_user(loggedin_user)
.then(_user => {
    user = _user;
    document.querySelector("#user-name").innerText = user.name;
    document.querySelector("#user-email").innerText = user.email;
})  
.catch(error => {
    console.error(error);
})

document.querySelectorAll(".change-entry").forEach(element => {
    element.addEventListener("submit", event => {
        event.preventDefault();

        event.target.querySelector("input[type=submit]").setAttribute("value", "Submitting...");

        if(can_submit == false) return;

        if(event.target.getAttribute("class").includes("change-name"))
        {
            user.name = event.target.querySelector("input:first-child").value;
        }
        else if(event.target.getAttribute("class").includes("change-email"))
        {
            check_email_avilibility(event.target.querySelector("input:first-child").value)
            .then(response => {
                if(response)
                {
                    user.email = event.target.querySelector("input:first-child").value;
                    change_user_update_dom(event.target, user);
                }
                else 
                {
                    alert("Email Already Exists!");
                    event.target.querySelector("input[type=submit]").setAttribute("value", "Submit");
                    return;
                }
            })
            .catch(error => {
                console.error(error);
            })
        }
        else if(event.target.getAttribute("class").includes("change-pass"))
        {
            if(pass_validity == false)
            {
                alert("Input a valid password based on rules");
                event.target.querySelector("input[type=submit]").setAttribute("value", "Submit");
                return;
            }

            if(otp_field_visibility == false)
            {
                event.target.querySelector("input[type=submit]").setAttribute("value", "Submit");
                random_otp = Math.floor(Math.random() * (9999 - 1000) + 1000);

                document.querySelector(".otp-input").value = "";
                document.querySelector(".otp-input").style.display = "inline";
                alert(`An OTP has been sent to your registered email\n[Your OTP: ${random_otp}]`);
                otp_field_visibility = true;
                return;
            }
            else
            {
                document.querySelector(".otp-input").style.display = "none";
                otp_field_visibility = false;

                if(event.target.querySelector(".otp-input").value != random_otp)
                {
                    alert("Put valid OTP");
                    console.error("Put valid OTP");
                    event.target.querySelector("input[type=submit]").setAttribute("value", "Submit");
                    return;
                }
            }

            user.password = event.target.querySelector("input:first-child").value;
        }

        if(!event.target.getAttribute("class").includes("change-email"))
        {
            change_user_update_dom(event.target, user);
        }
    })
})

document.querySelector(".change-pass input:first-child").addEventListener("keyup", event =>
{
    pass_validity = check_password_validity(document.querySelector(".change-pass input:first-child").value);
})

document.querySelector("#delete-user").addEventListener("click", event => {
    if(confirm("Are you sure you want do delete your account?\n\nThis process is irreversible!"))
    {
        document.querySelector("#delete-user").innerText = "Deleting...";

        delete_user(user.uuid)
        .then(response => {
            localStorage.removeItem("loggedin-user");
            localStorage.removeItem("cart");
            window.location.href = "./index.html";
        })
        .catch(error => {
            console.error(error);
            document.querySelector("#delete-user").innerText = "Delete Account";
            alert("Can't delete account! try again");
        })
    }
})
