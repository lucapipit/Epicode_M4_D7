const apiKey = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDgwNDliZGQyYWRhNDAwMTQzYzFlOTgiLCJpYXQiOjE2ODYxMjkwODUsImV4cCI6MTY4NzMzODY4NX0.R4PKJEmeIAmSxn84S-Tk1z-U6r5FeSHn2OUGu8KSIkk";
const apiEndpoint = "https://striveschool-api.herokuapp.com/api/product/";
const myBody = document.querySelector("body");
const productRowBox = document.getElementById("productRowBox");
/* add product */
let addProductButton = document.getElementById("addProductButton");
let addProductModal = document.getElementById("addProductModal");
let nameInput = document.getElementById("nameInput");
let descriptionInput = document.getElementById("descriptionInput");
let brandInput = document.getElementById("brandInput");
let priceInput = document.getElementById("priceInput");
let imageUrlInput = document.getElementById("imageUrlInput");
let alertForm = document.getElementById("alert-field");
let previewImg = document.getElementById("previewImg");
/* update products */
let nameInputEdit = document.getElementById("nameInputEdit");
let descriptionInputEdit = document.getElementById("descriptionInputEdit");
let brandInputEdit = document.getElementById("brandInputEdit");
let priceInputEdit = document.getElementById("priceInputEdit");
let imageUrlInputEdit = document.getElementById("imageUrlInputEdit");
let editModal = document.getElementById("edit-modal");
/* buttons */
let postButton = document.getElementById("post_btn");
let updateButton = document.getElementById("update_btn");
let deleteButton = document.getElementById("delete_btn");
let closeButton = document.getElementById("close-editBtn");



getApi();

/* image preview on add product form */
imageUrlInput.addEventListener("keydown", () => {
    if(!imageUrlInput.value){
        setTimeout(()=>{
            previewImg.src = imageUrlInput.value;
        }, 200)
    }
    previewImg.src = "https://media.istockphoto.com/id/1409329028/vector/no-picture-available-placeholder-thumbnail-icon-illustration-design.jpg?s=612x612&w=0&k=20&c=_zOuJu755g2eEUioiOUdz_mHKJQJn-tDgIAhQzyeKUQ=";
});
/* event listner globali */
addProductButton.addEventListener("click", () => {
    addProductModal.classList.toggle("d-none");
    alertForm.classList.add("d-none");
});
postButton.addEventListener("click",async function(){
    postApi();
    resetFormAddProduct();
});
closeButton.addEventListener("click", () => {
    editModal.classList.add("d-none");
})

/* genera le card nel DOM */
function createProductCard(input){
    let card = document.createElement("div");
    card.classList.add("card", "m-1", "productCard");
    let imgBox = document.createElement("div");
    imgBox.classList.add("imgBox");
    let img = document.createElement("img");
    img.classList.add("card-img-top");
    img.src = input.imageUrl;
    let cardBody = document.createElement("div");
    cardBody.classList.add("card-body", "d-flex", "justify-content-between", "flex-column");
    let priceBox = document.createElement("div");
    priceBox.classList.add("d-flex", "align-items-center");

    /*form di inserimento*/
    let name = document.createElement("h5");
    name.innerText = input.name;
    let description = document.createElement("p");
    description.innerText = input.description;
    let brand = document.createElement("p");
    brand.innerText = input.brand;
    let price$ = document.createElement("span");
    price$.innerText = "$ ";
    let price = document.createElement("span");
    price.innerText = input.price;

    let editButton = document.createElement("i");
    editButton.classList.add("fa-solid", "fa-pencil", "text-info", "ms-2");
    editButton.addEventListener("click", () => {
        editModal.classList.remove("d-none");
        updateApi(input);
        deleteApi(input);
    });
    
    priceBox.append(price$, price, editButton);
    cardBody.append(name, description, brand, priceBox),
    imgBox.appendChild(img);
    card.append(imgBox, cardBody);
    productRowBox.appendChild(card);
}
/* esegue la chiamata GET */
async function getApi(){

    try {
        let res = await fetch(apiEndpoint, {headers: {"Authorization": apiKey}})
        let jsonData = await res.json();
        productRowBox.innerHTML = "";
        jsonData.forEach(el => {
            createProductCard(el);
        });
        console.log(jsonData)

    } catch (error) {
        console.log("errore: " + error + " - il get non è andato a buon fine")
    }  
}
/* esegue la chiamata POST */
async function postApi(){

    try {
        if(nameInput.value && descriptionInput.value && brandInput.value && priceInput.value && imageUrlInput.value){
        let payload = {
            "name": nameInput.value, 
            "description": descriptionInput.value, 
            "brand": brandInput.value, 
            "price": priceInput.value, 
            "imageUrl": imageUrlInput.value
        };
    
        const createResult = await fetch(apiEndpoint, { 
            method: "POST",
            body: JSON.stringify(payload),
            headers: {"Authorization": apiKey, 
            "content-Type": "application/json"}
        });
    
        getApi();
        addProductModal.classList.add("d-none");
        previewImg.src = "https://media.istockphoto.com/id/1409329028/vector/no-picture-available-placeholder-thumbnail-icon-illustration-design.jpg?s=612x612&w=0&k=20&c=_zOuJu755g2eEUioiOUdz_mHKJQJn-tDgIAhQzyeKUQ=";      
        }else{
            alertForm.classList.remove("d-none");
            console.log("inserire tutti i campi")
            previewImg.src = "https://media.istockphoto.com/id/1409329028/vector/no-picture-available-placeholder-thumbnail-icon-illustration-design.jpg?s=612x612&w=0&k=20&c=_zOuJu755g2eEUioiOUdz_mHKJQJn-tDgIAhQzyeKUQ=";
        }

    } catch (error) {
        console.log("errore: " + error + " - il post non è andato a buon fine");
    }
    
        
}
/* esegue la chiamata PUT */
async function updateApi(input){

    try {
        nameInputEdit.value = input.name;
        descriptionInputEdit.value = input.description;
        brandInputEdit.value = input.brand;
        priceInputEdit.value = input.price;
        imageUrlInputEdit.value = input.imageUrl;

        updateButton.addEventListener("click", async function (){

            let payloadEdit = {
                "name": nameInputEdit.value,
                "description": descriptionInputEdit.value,
                "brand": brandInputEdit.value,
                "price": priceInputEdit.value,
                "imageUrl": imageUrlInputEdit.value
            };

            let editRequest = await fetch(apiEndpoint + input._id, {
                method: "PUT",
                headers: {"content-Type": "application/json", "Authorization": apiKey},
                body: JSON.stringify(payloadEdit)
            });
            editModal.classList.add("d-none");
            getApi();
            
            console.log("edit inviato");
        });

    } catch (error) {
        console.log("errore: " + error + " - il put non è andato a buon fine")
    }
}
/* esegue la chiamata DELETE */
async function deleteApi(input){

    try {
        deleteButton.addEventListener("click", async function (){
            let alertText = "Are you sure?";
            let myAlert = confirm(alertText);
            if(myAlert){
                let deleteResponse = await fetch(apiEndpoint + input._id, {
                    method: "DELETE",
                    headers: {"Authorization": apiKey}
                })
                editModal.classList.add("d-none");
                console.log("Articolo Rimosso!");
                setTimeout(async function (){getApi()}, 1000);
            }else{
                editModal.classList.add("d-none");
                console.log("Nessun Articolo Rimosso!");
            }
            
            console.log("Articolo bohhhh!");
        })
    } catch (error) {
        console.log("errore: " + error + " - il delete non è andato a buon fine")
    } 
}
/* resetta il form field di add product */
function resetFormAddProduct(){
    nameInput.value = ""; 
    descriptionInput.value = ""; 
    brandInput.value = "";
    priceInput.value = ""; 
    imageUrlInput.value = "";
}