function getQuantity() { //Quantity verileri bu fonksiyonla çekilir, eğer çekilemezse default olarak "1" basılır
    const quantityInput = document.querySelector('.js-qty__input');
    if (quantityInput) {
        return parseInt(quantityInput.value, 10) || 1; 
    } else {
        console.error("Miktar input elementi bulunamadı.");
        return 1; 
    }
}


function getSize() { //Sayfadaki size bilgilerini dinamik olarak çekmek için kullanılan fonksiyon. Herhangi bir hata olursa bilinmeyen size olarak "Unknown Size" yazılır.
    const sizeSelect = document.querySelector('#SingleOptionSelector-0');
    if (sizeSelect) {
        return sizeSelect.options[sizeSelect.selectedIndex].text; 
    } else {
        console.error("Size select elementi bulunamadı.");
        return "Unknown Size"; 
    }
}

function fetchProductDetails() { //ürün bilgilerinin alındığı fonksiyon
    const productMeta = window.ShopifyAnalytics.meta.product;

    if (productMeta && productMeta.variants && productMeta.variants.length > 0) {
        const variant = productMeta.variants.find(v => v.id === 34820110876716); // id değeri, sitedeki add.js dosyasındaki id'den alınmıştır.
        if (variant) {
            return {
                id: variant.id,
                name: variant.name,
                price: variant.price,
                size: getSize(), //yukarıda bulunan size değeri burada kullanılır. 
                color: variant.public_title.split(' / ')[1], // renk değeri buradan alınır.
                quantity: getQuantity() // yukarıda bulunan renk değeri burada kullanılır.
            };
        } else {
            console.error("Belirtilen varyant bulunamadı.");
            return null;
        }
    } else {
        console.error("Ürün meta verisi bulunamadı.");
        return null;
    }
}


function createPopup() { //pop-up ekleme fonksiyonu
    const product = fetchProductDetails(); //yukarıda ürün bilgileri alınan fonksiyon burada kullanılır.
    if (!product) return;

    const popup = document.createElement("div"); //pop-up için html tag'i eklenmiş ve altındad stillendirmesi yapılmıştır.
    popup.id = "productPopup";
    popup.style.position = "fixed";
    popup.style.bottom = "10px";
    popup.style.right = "10px";
    popup.style.maxWidth = "90vw";
    popup.style.width = "300px";
    popup.style.padding = "20px";
    popup.style.backgroundColor = "white";
    popup.style.border = "1px solid #ddd";
    popup.style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.1)";
    popup.style.zIndex = "1000";
    popup.style.borderRadius = "8px";
    popup.style.boxSizing = "border-box";


    //pop-up'un içeriği bu kısımda oluşturulmuştur.
    popup.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: flex-start;"> 
            <div>
                <h3 style="margin: 0; font-size: 16px; font-family: 'Unica One', sans-serif;">${product.name}</h3>
                <p style="margin: 5px 0;">Price: $${(product.price / 100).toFixed(2)}</p>
                <p style="margin: 5px 0;">Size: <span id="popupSize">${product.size}</span></p>
                <p style="margin: 5px 0;">Color: ${product.color}</p>
                <p style="margin: 5px 0;">Quantity: <span id="popupQuantity">${product.quantity}</span></p>
            </div>
            <button type="submit" id="popupAddToCartButton" style="width: 100%; margin-top: 10px; padding: 10px; background-color: white; color: #007bff; border: 2px solid #007bff; border-radius: 4px; cursor: pointer; font-weight: bold;">
                Add to Cart
            </button>
        </div>
    `;

    document.body.appendChild(popup);

    document.getElementById("popupAddToCartButton").addEventListener("click", () => { //addToCart fonksiyonu burada çalışır.
        const targetButton = document.getElementById("AddToCart-product-template");
        if (targetButton) {
            targetButton.click();
        } else {
            console.error("Hedef buton bulunamadı.");
        }
    });
}

// Pop-up oluşturulur.
createPopup();


const observer = new MutationObserver(() => { // pop-up dinamik verileri buradan alınır.

    const product = fetchProductDetails();
    const sizeElement = document.getElementById('popupSize');
    const quantityElement = document.getElementById('popupQuantity');
    if (product && sizeElement && quantityElement) {
        sizeElement.textContent = getSize(); 
        quantityElement.textContent = getQuantity(); 
    }
});

//quantity ve size miktarı değiştiğinde buradan güncellenir.
function observeQuantityAndSizeChanges() {
    const qtyButtons = document.querySelectorAll('.js-qty__adjust');
    const sizeSelect = document.querySelector('#SingleOptionSelector-0');

    qtyButtons.forEach(button => { //quantity güncellenir
        button.addEventListener('click', () => {
            const popupQuantityElement = document.getElementById('popupQuantity');
            if (popupQuantityElement) {
                popupQuantityElement.textContent = getQuantity();
            }
        });
    });

    if (sizeSelect) {  //size güncellenir.
        sizeSelect.addEventListener('change', () => {
            const popupSizeElement = document.getElementById('popupSize');
            if (popupSizeElement) {
                popupSizeElement.textContent = getSize();
            }
        });
    }
}

observeQuantityAndSizeChanges();

// Responsive'lik kazanılması için mobil boyutlarda pop-up gizlenir, daha büyük boyutlarda görünür olur.
const style = document.createElement('style');
style.textContent = `
    @media (max-width: 700px) {
        #productPopup {
            display: none !important;
        }
    }
`;
document.head.appendChild(style);
