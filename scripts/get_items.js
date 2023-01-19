function filter_data(data)
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

    // filtering based on brand
    let temp = [];
    let has_present = false;
    let hold_index;
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

    // filtering based on type
    temp = [];
    has_present = false;
    hold_index;
    for(let i = 0; i < parameters.length; i++)
    {
        if(parameters[i].type != undefined)
        {
            has_present = true;
            hold_index = i;
        }
    }
    if(has_present)
    {
        for(let i = 0; i < data.length; i++)
        {
            if(parameters[hold_index].type.toUpperCase() == data[i].type[0].toUpperCase() || parameters[hold_index].type.toUpperCase() == data[i].type[1].toUpperCase())
            {
                temp.push(data[i]);
            }
        }
        data = temp;
    }

    return data;
}

async function get_all_items()
{
    try {
        let response = await fetch("./products.json");
        let data = response.json();
        return data
    } catch (error) {
        return error;
    }
}

window.get_items = async function()
{
    try {
        let response = await get_all_items();
        return filter_data(response);
    } catch (error) {
        return error;
    }
}