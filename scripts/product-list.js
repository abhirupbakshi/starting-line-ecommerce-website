function update_title_list_info()
{
    if(window.location.search == "")
    {
        document.querySelector("#list-name").innerText = "DISPLAYING ALL THE PRODUCTS"
        document.querySelector("title").innerText = "DISPLAYING ALL THE PRODUCTS";
    }
    else
    {
        let result = new URLSearchParams(window.location.search)
        let query = [];
        for(let [key, value] of result)
        {
            let temp = {};
            temp[key] = value;
            query.push(temp);
        }

        let temp = "";
        // Adding Name
        for(let i = 0; i < query.length; i++)
        {
            if(query[i].name != undefined) temp += query[i].name + ", ";
        }
        // Adding Brand
        for(let i = 0; i < query.length; i++)
        {
            if(query[i].brand != undefined) temp += query[i].brand + "'s ";
        }
        // Adding Type
        for(let i = 0; i < query.length; i++)
        {
            if(query[i].type != undefined) temp += query[i].type.split(",").join(" ") + " ";
        }

        document.querySelector("#list-name").innerText = temp.toUpperCase();
        document.querySelector("title").innerText = temp.toUpperCase();
    }
}

function is_valid_to_display(selected_filter_list, product)
{
    let brand;
    if(selected_filter_list.brands.length == 0) brand = true;
    else brand = selected_filter_list.brands.includes(product.brand);

    let gender;
    if(selected_filter_list.gender.length == 0) gender = true;
    else gender = selected_filter_list.gender.includes(product.gender);

    let clothing_size = null;
    if(selected_filter_list.size.clothing.length == 0) clothing_size = true;
    else
    {
        for(let i = 0; i < selected_filter_list.size.clothing.length; i++)
        {
            if(clothing_size != null) break;
            for(let j = 0; j < product.size.length; j++)
            {
                if(selected_filter_list.size.clothing[i] == product.size[j])
                {
                    clothing_size = true;
                    break;
                }
            }
        }
        if(clothing_size == null) clothing_size = false;
    }

    let shoe_size = null;
    if(selected_filter_list.size.shoe.length == 0) shoe_size = true;
    else
    {
        for(let i = 0; i < selected_filter_list.size.shoe.length; i++)
        {
            if(shoe_size != null) break;
            for(let j = 0; j < product.size.length; j++)
            {
                if(selected_filter_list.size.shoe[i] == product.size[j])
                {
                    shoe_size = true;
                    break;
                }
            }
        }
        if(shoe_size == null) shoe_size = false;
    }

    let type1;
    if(selected_filter_list.type.type1.length == 0) type1 = true;
    else type1 = selected_filter_list.type.type1.includes(product.type[0]);


    let type2;
    if(selected_filter_list.type.type2.length == 0) type2 = true;
    else type2 = selected_filter_list.type.type2.includes(product.type[1]);

    return brand && gender && clothing_size && shoe_size && type1 && type2;
}

function sort_list(list)
{
    let list_copy = JSON.parse(JSON.stringify(list));

    if(document.querySelector("#sort").value == "price-asc")
    {
        list_copy.sort((a, b) =>
        {
            return a.price - b.price;
        })
    }
    else if(document.querySelector("#sort").value == "price-des")
    {
        list_copy.sort((a, b) =>
        {
            return b.price - a.price;
        })
    }
    else if(document.querySelector("#sort").value == "ratings-asc")
    {
        list_copy.sort((a, b) =>
        {
            return a.rating.avg - b.rating.avg;
        })
    }
    else if(document.querySelector("#sort").value == "ratings-des")
    {
        list_copy.sort((a, b) =>
        {
            return b.rating.avg - a.rating.avg;
        })
    }

    return list_copy;
}

function create_pages(list)
{
    let item_index = [];
    for(let i = 0; i < list.length;)
    {
        let hold = i;
        i += items_per_page;

        if(i-1 < list.length) item_index.push(hold + "-" + (i-1));
        else item_index.push(hold + "-" + (list.length-1));
    }
    
    let page_no = 1;
    document.querySelector("#pages").innerHTML = "";
    item_index.forEach(element =>
    {
        let option = document.createElement("option");
        document.querySelector("#pages").append(option);
        option.setAttribute("value", element);
        option.innerText = page_no++;
    })

    current_page = item_index[0];
    document.querySelector("#total-pages").innerText = item_index.length;
}

function display_products(list)
{
    if(page_not_changed)
    {
        _list = [];
        selected_filter_list = get_selected_filters_list();
        list.forEach(element =>
        {
            if(is_valid_to_display(selected_filter_list, element)) _list.push(element);
        })
        _list = sort_list(_list);
        create_pages(_list);
    }

    document.querySelector("#product-list").innerHTML = "";

    for(let i = +current_page.split("-")[0]; i <= +current_page.split("-")[1]; i++)
    {
        if(is_valid_to_display(selected_filter_list, _list[i]))
        {
            let parent = document.createElement("div");
            document.querySelector("#product-list").append(parent);
            parent.setAttribute("class", "product-card");

            let child = document.createElement("p");
            parent.append(child);
            child.setAttribute("class", "product-id");
            child.innerText = _list[i].id;
            child.style.display = "none"

            child = document.createElement("img");
            parent.append(child);
            child.setAttribute("src", _list[i].img);
            child.setAttribute("class", "product-img");


            child = document.createElement("hr");
            parent.append(child);
            
            child = document.createElement("h2");
            parent.append(child);
            child.setAttribute("class", "product-name");
            child.innerText = _list[i].name;

            child = document.createElement("h3");
            parent.append(child);
            child.setAttribute("class", "product-brand");
            child.innerText = _list[i].brand;

            child = document.createElement("p");
            parent.append(child);
            child.setAttribute("class", "product-price");
            child.innerText = "$" + _list[i].price;

            child = document.createElement("div");
            parent.append(child);
            child.setAttribute("class", "product-rating-div");

            let _child = document.createElement("p");
            child.append(_child);
            _child.innerText = _list[i].rating.avg;

            child = document.createElement("p");
            child.append(_child);
            _child.innerText = `(${_list[i].rating.count})`;

            child = document.createElement("p");
            parent.append(child);
            child.setAttribute("class", "product-trend");
            if(_list[i].trending) child.innerText = "Trending";
        }
    }

    document.querySelector("#list-count").innerHTML = ` (${_list.length})`
}

function get_selected_filters_list()
{
    let selected_filter_list = {
        brands: [],
        gender: [],
        type: {
            type1: [],
            type2: []
        },
        size: {
            shoe: [],
            clothing: []
        }
    };

    // Getting brands filters
    document.querySelectorAll(".brand-filter").forEach(element =>
    {
        if(element.checked)
        selected_filter_list.brands.push(element.value);
    })

    // Getting gender filters
    document.querySelectorAll(".gender-filter").forEach(element =>
    {
        if(element.checked)
        selected_filter_list.gender.push(element.value);
    })

    // Getting main-type filters
    document.querySelectorAll(".main-type-filter").forEach(element =>
    {
        if(element.checked)
        selected_filter_list.type.type1.push(element.value);
    })

    // Getting sub-type filters
    document.querySelectorAll(".sub-type-filter").forEach(element =>
    {
        if(element.checked)
        selected_filter_list.type.type2.push(element.value);
    })

    // Getting clothing-sizes filters
    document.querySelectorAll(".clothing-sizes-filter").forEach(element =>
    {
        if(element.checked)
        selected_filter_list.size.clothing.push(element.value);
    })

    // Getting shoe-sizes filters
    document.querySelectorAll(".shoe-sizes-filter").forEach(element =>
    {
        if(element.checked)
        selected_filter_list.size.shoe.push(element.value);
    })

    return selected_filter_list;
}

function display_filters(list)
{
    // Creating brands filters
    let parent = document.querySelector("#brands");
    parent.innerHTML = "";
    list.brands.forEach(element =>
    {
        let child = document.createElement("input");
        parent.append(child);
        child.setAttribute("type", "checkbox");
        child.setAttribute("class", "brand-filter");
        child.setAttribute("name", element);
        child.setAttribute("value", element);

        child = document.createElement("label");
        parent.append(child);
        child.setAttribute("for", element);
        child.innerText = element.charAt(0).toUpperCase() + element.slice(1);

        if(list.brands[list.brands.length-1] != element)
        {
            child = document.createElement("br");
            parent.append(child);
        }
    })

    // Creating gender filters
    parent = document.querySelector("#gender");
    parent.innerHTML = "";
    list.gender.forEach(element =>
    {
        let child = document.createElement("input");
        parent.append(child);
        child.setAttribute("type", "checkbox");
        child.setAttribute("class", "gender-filter");
        child.setAttribute("name", element);
        child.setAttribute("value", element);

        child = document.createElement("label");
        parent.append(child);
        child.setAttribute("for", element);
        child.innerText = element.charAt(0).toUpperCase() + element.slice(1);

        if(list.brands[list.gender.length-1] != element)
        {
            child = document.createElement("br");
            parent.append(child);
        }
    })

    // Creating main-type filters
    parent = document.querySelector("#main-type");
    parent.innerHTML = "";
    list.type.type1.forEach(element =>
    {
        let child = document.createElement("input");
        parent.append(child);
        child.setAttribute("type", "checkbox");
        child.setAttribute("class", "main-type-filter");
        child.setAttribute("name", element);
        child.setAttribute("value", element);

        child = document.createElement("label");
        parent.append(child);
        child.setAttribute("for", element);
        child.innerText = element.charAt(0).toUpperCase() + element.slice(1);

        if(list.brands[list.type.type1.length-1] != element)
        {
            child = document.createElement("br");
            parent.append(child);
        }
    })

    // Creating sub-type filters
    parent = document.querySelector("#sub-type");
    parent.innerHTML = "";
    list.type.type2.forEach(element =>
    {
        let child = document.createElement("input");
        parent.append(child);
        child.setAttribute("type", "checkbox");
        child.setAttribute("class", "sub-type-filter");
        child.setAttribute("name", element);
        child.setAttribute("value", element);

        child = document.createElement("label");
        parent.append(child);
        child.setAttribute("for", element);
        child.innerText = element.charAt(0).toUpperCase() + element.slice(1);

        if(list.brands[list.type.type2.length-1] != element)
        {
            child = document.createElement("br");
            parent.append(child);
        }
    })

    // Creating clothing-sizes filters
    parent = document.querySelector("#clothing-sizes");
    parent.innerHTML = "";
    list.size.clothing.forEach(element =>
    {
        let child = document.createElement("input");
        parent.append(child);
        child.setAttribute("type", "checkbox");
        child.setAttribute("class", "clothing-sizes-filter");
        child.setAttribute("name", element);
        child.setAttribute("value", element);

        child = document.createElement("label");
        parent.append(child);
        child.setAttribute("for", element);
        child.innerText = element.charAt(0).toUpperCase() + element.slice(1);

        if(list.brands[list.size.clothing.length-1] != element)
        {
            child = document.createElement("br");
            parent.append(child);
        }
    })

    // Creating shoe-sizes filters
    parent = document.querySelector("#shoe-sizes");
    parent.innerHTML = "";
    list.size.shoe.forEach(element =>
    {
        let child = document.createElement("input");
        parent.append(child);
        child.setAttribute("type", "checkbox");
        child.setAttribute("class", "shoe-sizes-filter");
        child.setAttribute("name", element);
        child.setAttribute("value", element);

        child = document.createElement("label");
        parent.append(child);
        child.setAttribute("for", element);
        child.innerText = element;

        if(list.brands[list.size.shoe.length-1] != element)
        {
            child = document.createElement("br");
            parent.append(child);
        }
    })
}

function get_filters(list)
{
    let filters = {
        brands: [],
        gender: [],
        type: {
            type1: [],
            type2: []
        },
        size: {
            shoe: [],
            clothing: []
        }
    };
    let temp;
    
    // Adding brands from the list of items
    temp = {};
    list.forEach(element => {
        if(temp[element.brand] == undefined) temp[element.brand] = null;
    });
    for(let i in temp) filters.brands.push(i);
    filters.brands.sort((a, b) => {
        if(a < b) return -1;
        else if(a > b) return 1;
        else return 0;
    })

    // Adding genders from the list of items
    temp = {};
    list.forEach(element => {
        if(temp[element.gender] == undefined) temp[element.gender] = null;
    });
    for(let i in temp) filters.gender.push(i);
    filters.gender.sort((a, b) => {
        if(a < b) return -1;
        else if(a > b) return 1;
        else return 0;
    })
    
    // Adding types from the list of items
        // Adding type1
    temp = {};
    list.forEach(element => {
        if(temp[element.type[0]] == undefined) temp[element.type[0]] = null;
    });
    for(let i in temp) filters.type.type1.push(i);
    filters.type.type1.sort((a, b) => {
        if(a < b) return -1;
        else if(a > b) return 1;
        else return 0;
    })
        // Adding type2
    temp = {};
    list.forEach(element => {
        if(temp[element.type[1]] == undefined) temp[element.type[1]] = null;
    });
    for(let i in temp) filters.type.type2.push(i);
    filters.type.type2.sort((a, b) => {
        if(a < b) return -1;
        else if(a > b) return 1;
        else return 0;
    })

    //Adding sizes from the list of items
        //Adding shoe sizes
    temp = {};
    list.forEach(element => {
        if(element.type[0] == "shoe")
        {
            element.size.forEach(element =>
            {
                if(temp[element] == undefined) temp[element] = null;
            })
        }
    });
    for(let i in temp) filters.size.shoe.push(i);
    filters.size.shoe.sort((a, b) => {
        return +a - +b;
    })
        //Adding cloth sizes
    temp = {};
    list.forEach(element => {
        if(element.type[0] == "clothing")
        {
            element.size.forEach(element =>
            {
                if(temp[element] == undefined) temp[element] = null;
            })
        }
    });
    for(let i in temp) filters.size.clothing.push(i);
    filters.size.clothing.sort((a, b) => {
        if(a < b) return -1;
        else if(a > b) return 1;
        else return 0;
    })

    return filters;
}

async function get_data(url)
{
    try {
        let response
        if(window.location.href.includes("?") && window.location.href[window.location.href.length-1] != "?") response = await fetch(`${url}?${window.location.href.split("?")[1]}`);
        else response = await fetch(url);
        let data = await response.json();
        return data;
    } catch (error) {
        return error;
    }
}

async function get_base_url()
{
    try {
        let response = await fetch("../url.json");
        let data = await response.json();
        return data;
    } catch (error) {
        return error;
    }
}

let selected_filter_list;
let items_per_page = 40;
let current_page;
let _list;
let page_not_changed = true;
document.querySelector("#sort").value = "";


get_base_url()
.then(url =>
{
    get_data(url.products)
    .then(list =>
    { 
        display_filters(get_filters(list));

        update_title_list_info();

        display_products(list);

        document.querySelector("#filters").addEventListener("change", event =>
        {
            if(!event.target.getAttribute("class").includes("filter")) return;
            
            page_not_changed = true;
            display_products(list);
        })

        document.querySelector("#sort").addEventListener("change", event =>
        {
            page_not_changed = true;
            display_products(list);
        })

        document.querySelector("#pages").addEventListener("change", event =>
        {
            page_not_changed = false;
            current_page = event.target.value;
            display_products(list);
        })
    })
    .catch(error =>
    {
        console.error(error);
    });
})
.catch(error =>
{
    console.error(error);
});