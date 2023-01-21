import { create_UUID } from "./uuid.js";

function filter_products(data)
{
    // Getting query parameters
    let result = new URLSearchParams(window.location.search);
    let parameters = [];
    for(let [key, value] of result)
    {
        let temp = {};
        temp[key] = value;

        parameters.push(temp);
    }

    // filtering based on uuid
    let temp = [];
    let has_present = false;
    let hold_index;
    for(let i = 0; i < parameters.length; i++)
    {
        if(parameters[i].uuid != undefined)
        {
            has_present = true;
            hold_index = i;
        }
    }
    if(has_present)
    {
        for(let i = 0; i < data.length; i++)
        {
            if(parameters[hold_index].uuid == data[i].uuid)
            {
                temp.push(data[i]);
            }
        }
        data = temp;
    }


    // filtering based on brand
    temp = [];
    has_present = false;
    hold_index;
    for(let i = 0; i < parameters.length; i++)
    {
        if(parameters[i].brand != undefined)
        {
            has_present = true;
            hold_index = i;
        }
    }
    if(has_present)
    {
        for(let i = 0; i < data.length; i++)
        {
            if(parameters[hold_index].brand.toUpperCase() == data[i].brand.toUpperCase())
            {
                temp.push(data[i]);
            }
        }
        data = temp;
    }

    // filtering based on gender
    temp = [];
    has_present = false;
    hold_index;
    for(let i = 0; i < parameters.length; i++)
    {
        if(parameters[i].gender != undefined)
        {
            has_present = true;
            hold_index = i;
        }
    }
    if(has_present)
    {
        for(let i = 0; i < data.length; i++)
        {
            if(parameters[hold_index].gender.toUpperCase() == data[i].gender.toUpperCase())
            {
                temp.push(data[i]);
            }
        }
        data = temp;
    }

    // filtering based on type0
    temp = [];
    has_present = false;
    hold_index;
    for(let i = 0; i < parameters.length; i++)
    {
        if(parameters[i].type0 != undefined)
        {
            has_present = true;
            hold_index = i;
        }
    }
    if(has_present)
    {
        for(let i = 0; i < data.length; i++)
        {
            if(parameters[hold_index].type0.toUpperCase() == data[i].type[0].toUpperCase())
            {
                temp.push(data[i]);
            }
        }
        data = temp;
    }

    // filtering based on type1
    temp = [];
    has_present = false;
    hold_index;
    for(let i = 0; i < parameters.length; i++)
    {
        if(parameters[i].type1 != undefined)
        {
            has_present = true;
            hold_index = i;
        }
    }
    if(has_present)
    {
        for(let i = 0; i < data.length; i++)
        {
            if(parameters[hold_index].type1.toUpperCase() == data[i].type[1].toUpperCase())
            {
                temp.push(data[i]);
            }
        }
        data = temp;
    }

    return data;
}

async function get_product(uuid = null)
{
    try {
        let response = await fetch(products_url);
        response = await response.json();

        if(uuid != null)
        {
            for(let i = 0; i < response.products.length; i++)
            {
                if(response.products[i].uuid == uuid) return response.products[i];
            }
            return {};
        }
        else
            return filter_products(response.products);
    } catch (error) {
        return error;
    }
}

async function update_product(modified_product)
{
    if(modified_product == undefined) return Promise.reject("Privide a modified product");

    try {
        let product_list = await get_product();
        let not_present = true;
        for(let i = 0; i < product_list.length; i++)
        {
            if(product_list[i].uuid == modified_product.uuid)
            {
                product_list[i] = modified_product;
                not_present = false;
                break;
            }
        }
        if(not_present) return Promise.reject("Cannot find product");
        
        let response = await fetch(products_url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                products: product_list
            })
        })

        response = await response.text();
        return response;
    } 
    catch (error) {
        return error;
    }
}

async function delete_product(uuid)
{
    if(uuid == undefined) return Promise.reject("Provide a UUID");

    try {
        let product_list = await get_product();
        
        let temp = [];
        product_list.forEach(element => {
            if(element.uuid != uuid) temp.push(element);
        });
        
        let response = await fetch(products_url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                products: temp
            })
        })

        response = await response.text();
        return response;
    } 
    catch (error) {
        return error;
    }
}

async function create_product(img, name, brand, price, gender, type, size, description, trending = null, rating = [], rivews = [])
{
    if( img == undefined ||
        name == undefined ||
        brand == undefined ||
        price == undefined ||
        gender == undefined ||
        type == undefined ||
        size == undefined ||
        description == undefined) 
            return Promise.reject("Provide image, name, brand, price, gender, type, size, description");

    let product = {
        uuid: create_UUID(),
        img: img,
        name: name,
        brand: brand,
        price: price,
        gender: gender,
        rating: rating,
        trending: trending,
        type: type,
        size: size,
        description: description,
        rivews: rivews
    }

    try {
        let response = await fetch(products_url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                products:[product]
            })
        })
        response = await response.json();
        return response;
    } catch (error) {
        return error;
    }
}

const products_url = "https://getpantry.cloud/apiv1/pantry/60d92381-f2b1-40b1-b9e2-1324f1e1357f/basket/products";

export {
    create_product,
    get_product,
    update_product,
    delete_product
}