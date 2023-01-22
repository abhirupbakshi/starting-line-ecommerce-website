import { create_UUID, sleep } from "./uuid.js";

async function hard_fetch()
{
    try {
        await new Promise(resolve => setTimeout(resolve, sleep));

        let response = await fetch(users_url);
        response = await response.json();
        return response.users;
    } catch (error) {
        return error;
    }
}

async function set_local_storage()
{
    let response = await hard_fetch();
    localStorage.setItem("user-list", JSON.stringify(response));
    return response;
}

async function get_user(uuid = null)
{
    try {
        let response;

        if(user_list == null)
        {
            response = await set_local_storage();
        }
        else response = user_list;

        if(uuid != null)
        {
            for(let i = 0; i < response.length; i++)
            {
                if(response[i].uuid == uuid) return response[i];
            }
        }
        else
            return response;
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
        
        await new Promise(resolve => setTimeout(resolve, sleep));

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
        await set_local_storage();
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
        
        await new Promise(resolve => setTimeout(resolve, sleep));
        
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
        await set_local_storage();
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
        await new Promise(resolve => setTimeout(resolve, sleep));

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
        await set_local_storage();
        return response;
    } catch (error) {
        return error;
    }
}

const users_url = "https://getpantry.cloud/apiv1/pantry/60d92381-f2b1-40b1-b9e2-1324f1e1357f/basket/users";
let user_list = JSON.parse(localStorage.getItem("user-list"));

export {
    get_user,
    update_user,
    delete_user,
    create_user
}