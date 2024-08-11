
//quantity değeri bu fonksiyon ile alınır. ALınmazsa default olarak "1" yazılır.
function getQuantity() {
    const quantityInput = document.querySelector('.js-qty__input');
    if (quantityInput) {
        return parseInt(quantityInput.value, 10) || 1; 
    } else {
        console.error("Miktar input elementi bulunamadı.");
        return 1; 
    }
}

//size değeri bu fonksiyonla alınır. Bulunamazsa bilinmeyen ölçü olarak döner.
function getSize() {
    const sizeSelect = document.querySelector('#SingleOptionSelector-0');
    if (sizeSelect) {
        return sizeSelect.options[sizeSelect.selectedIndex].text; 
    } else {
        console.error("Size select elementi bulunamadı.");
        return "Unknown Size"; 
    }
}

//bu fonksiyonla ürün detayları çekilir
function fetchProductDetails() {
    const productMeta = window.ShopifyAnalytics.meta.product;

    if (productMeta && productMeta.variants && productMeta.variants.length > 0) {
        const variant = productMeta.variants.find(v => v.id === 34820110876716); // id değeri, sitedeki add.js dosyasındaki id'den alınmıştır.
        if (variant) {
            return {
                id: variant.id,
                name: variant.name,
                price: variant.price,
                size: getSize(), //yukarıda yazılan fonksiyonla "size" değeri atanır.
                color: variant.public_title.split(' / ')[1],
                quantity: getQuantity() //yukarıda yazılan fonksiyonla quantity değeri atanır.
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

//pop-up oluşturulma fonksiyonu
function createPopup() {
    const product = fetchProductDetails();
    if (!product) return;

    const popup = document.createElement("div"); //pop-up için bir div elementi oluşturulur ve altına stilleri yazılır.
    popup.id = "productPopup";
    popup.style.position = "absolute";
    popup.style.top = "700%";
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

    //pop-up div'inin içeriği burada belirlenir, burada veriler dinamik olarak çekilir
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

    // Sitedeki HTML elementi içerisine pop-up eklenir
    const container = document.querySelector('.nav-bar.small--hide');
    if (container) {
        container.appendChild(popup);
    } else {
        console.error("Belirtilen container bulunamadı.");
        document.body.appendChild(popup); // Eğer container bulunamazsa, body'ye eklenir
    }

    document.getElementById("popupAddToCartButton").addEventListener("click", () => {
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

const observer = new MutationObserver(() => {
    const product = fetchProductDetails();
    const sizeElement = document.getElementById('popupSize');
    const quantityElement = document.getElementById('popupQuantity');
    if (product && sizeElement && quantityElement) {
        sizeElement.textContent = getSize();
        quantityElement.textContent = getQuantity();
    }
});


//size ve quantity değişikliği buradan kontrol edilir.
function observeQuantityAndSizeChanges() {
    const qtyButtons = document.querySelectorAll('.js-qty__adjust');
    const sizeSelect = document.querySelector('#SingleOptionSelector-0');

    qtyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const popupQuantityElement = document.getElementById('popupQuantity');
            if (popupQuantityElement) {
                popupQuantityElement.textContent = getQuantity();
            }
        });
    });

    if (sizeSelect) {
        sizeSelect.addEventListener('change', () => {
            const popupSizeElement = document.getElementById('popupSize');
            if (popupSizeElement) {
                popupSizeElement.textContent = getSize();
            }
        });
    }
}

observeQuantityAndSizeChanges();

const style = document.createElement('style');
style.textContent = `
    @media (max-width: 700px) {
        #productPopup {
            display: none !important;
        }
    }
`;
document.head.appendChild(style);

/*Bu case yapılırken yazılımcı belirtilen süre içerisinde kendisine en uygun yöntemle yapmıştır. Web-scraping ve API'lerle alakalı dokümantasyonlar araştırılmış,
case'de istenenlere göre uygun olan yöntem sayfanın kodlarından yola çıkmak olarak belirlenmiştir. Eğer yöntemde veya herhangi bir bölümde hata veya eksik varsa
olumlu ya da olumsuz bir dönüşte bu hataların belirtilmesi -yazılımcının yanlışlarını görmesine yardımcı olacağı için- rica olunur. Şimdiden teşekkürler. */