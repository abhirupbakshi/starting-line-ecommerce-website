import { create_UUID } from "./uuid.js";

async function get_user(uuid = null)
{
    try {
        let response = await fetch(users_url);
        response = await response.json();

        if(uuid != null)
        {
            for(let i = 0; i < response.users.length; i++)
            {
                if(response.users[i].uuid == uuid) return response.users[i];
            }
        }
        else
            return response.users;
    } catch (error) {
        return error;
    }
}

async function update_user(modified_user)
{
    if(modified_user == undefined) return Promise.reject("Privide a modified user");

    try {
        let user_list = await get_user();
        
        let not_present = true;
        for(let i = 0; i < user_list.length; i++)
        {
            if(user_list[i].uuid == modified_user.uuid)
            {
                user_list[i] = modified_user;
                not_present = false;
                break;
            }
        }
        if(not_present) return Promise.reject("Cannot find user");
        
        let response = await fetch(users_url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                users: user_list
            })
        })

        response = await response.text();
        return response;
    } 
    catch (error) {
        return error;
    }
}

async function delete_user(uuid)
{
    if(uuid == undefined) return Promise.reject("Provide a UUID");

    try {
        let user_list = await get_user();
        
        let temp = [];
        user_list.forEach(element => {
            if(element.uuid != uuid) temp.push(element);
        });
        
        let response = await fetch(users_url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                users: temp
            })
        })

        response = await response.text();
        return response;
    } 
    catch (error) {
        return error;
    }
}

async function create_user(name, password, email)
{
    if(name == undefined || password == undefined || email == undefined) return Promise.reject("Provide name, password and email");

    let user = {
        uuid: create_UUID(),
        name: name,
        password: password,
        email: email,
        cart: [],
        rivews: []
    }

    try {
        let response = await fetch(users_url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                users:[user]
            })
        })
        response = await response.json();
        return response;
    } catch (error) {
        return error;
    }
}

const users_url = "https://getpantry.cloud/apiv1/pantry/60d92381-f2b1-40b1-b9e2-1324f1e1357f/basket/users";

export {
    get_user,
    update_user,
    delete_user,
    create_user
}