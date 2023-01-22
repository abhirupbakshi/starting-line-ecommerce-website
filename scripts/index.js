import { get_all_product } from "./modules/products.js"

async function slide_show()
{
    let img_arr = ["./images/slideshow_img1.webp", "./images/slideshow_img2.jpg", "./images/slideshow_img3.jpg", "./images/slideshow_img4.jpg"]
    let i = 0;

    while(1)
    {
        if(i == img_arr.length) i = 0;
        document.querySelector("#auto-slide-show img").setAttribute("src", img_arr[i++]);
        await new Promise(resolve => { setTimeout(resolve, 5000) });
    }
}
slide_show();

get_all_product()
.then(data => {
    document.querySelectorAll("#grid-info div").forEach(element => {
        let i = Math.floor(Math.random() * data.length);
        element.querySelector("img").setAttribute("src", data[i].img);
        element.querySelector("a").innerText = data[i].brand;
        element.querySelector("a").setAttribute("href", `./product_list.html?brand=${data[i].brand}`);
    });

})

