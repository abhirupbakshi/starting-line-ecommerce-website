window.update_user = async function(id, value) // value needs to be in object format
{
    if(id == undefined) return Promise.reject("Need to pass an valid id");

    try {
        let response = await fetch("https://retoolapi.dev/gYlqFA/data/" + id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(value)
        })
        response = await response.json();
        return response;
    } 
    catch (error) {
        return error;
    }
}

window.get_user = async function(id)
{
    if(id == 1) return Promise.reject("Cannot get the user!");
    else if(id == undefined)
    {
        try {
            let response = await fetch("https://retoolapi.dev/gYlqFA/data/")
            response = await response.json();
            let temp = [];
            response.forEach(element => {
                if(element.id != 1) temp.push(element);
            });
            return temp;
        } 
        catch (error) {
            return error;
        }
    }
    else
    {
        try {
            let response = await fetch("https://retoolapi.dev/gYlqFA/data/" + id)
            response = await response.json();
            return response;
        } 
        catch (error) {
            return error;
        }
    }
}

window.remove_user = async function(id)
{
    if(id == 1) return Promise.reject("Cannot remove the first entry!");

    try {
        let response = await fetch("https://retoolapi.dev/gYlqFA/data/" + id, {
            method: "DELETE"
        })
        response = await response.json();
        return response;
    } 
    catch (error) {
        return error;
    }
}

window.create_user = async function(user)
{
    try {
        let response = await fetch("https://retoolapi.dev/gYlqFA/data", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        })
        response = await response.json();
        return response;
    } 
    catch (error) {
        return error;
    }
}