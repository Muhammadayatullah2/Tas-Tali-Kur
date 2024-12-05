document.addEventListener('alpine:init', () => {
    Alpine.data('products', () => ({
        items: [
            { id: 1, name: 'Tas Tali Kur', img: '1.jpg', price: 155000 },
            { id: 2, name: 'Tas Tali Kur', img: '2.jpg', price: 115000 },
            { id: 3, name: 'Tas Tali Kur', img: '3.jpg', price: 165000 },
            { id: 4, name: 'Tas Tali Kur', img: '4.jpg', price: 1200000 },
            { id: 5, name: 'Tas Tali Kur', img: '5.jpg', price: 135000 },
        ],
    }));

    Alpine.store('cart', {
        items: [],
        total: 0,
        quantity: 0,
    
        add(newItem) {
            // Cek apakah item sudah ada di keranjang
            const cartItem = this.items.find((item) => item.id === newItem.id);
    
            if (!cartItem) {
                // Jika item belum ada, tambahkan ke keranjang
                this.items.push({ ...newItem, quantity: 1, total: newItem.price });
                this.quantity++; // Tambah jumlah total item
                this.total += newItem.price; // Tambah harga ke total
            } else {
                // Jika item sudah ada, perbarui jumlah dan total
                cartItem.quantity++;
                cartItem.total = cartItem.price * cartItem.quantity;
                this.quantity++;
                this.total += cartItem.price;
            }
        },
        remove(id) {
            const cartItem = this.items.find((item) => item.id === id);
        
            if (cartItem) {
                if (cartItem.quantity > 1) {
                    // Kurangi quantity dan update total untuk item tersebut
                    cartItem.quantity--;
                    cartItem.total = cartItem.price * cartItem.quantity;
                    this.quantity--; // Kurangi jumlah total item
                    this.total -= cartItem.price; // Kurangi total harga
                } else {
                    // Jika quantity = 1, hapus item dari keranjang
                    this.items = this.items.filter((item) => item.id !== id);
                    this.quantity--; // Kurangi jumlah total item
                    this.total -= cartItem.price; // Kurangi total harga
                }
            }
        }
        
    });
    
});

const checkoutButton = document.querySelector('.checkout-button');
checkoutButton.disabled = true;

const form = document.querySelector('#checkoutForm');

form.addEventListener('keyup', function () {
    for (let i = 0; i < form.elements.length; i++) {
        if (form.elements[i].value.length !== 0) {
            checkoutButton.classList.remove('disabled');
            checkoutButton.classList.add('disabled'); // Typo: seharusnya menambahkan class 'enabled' atau logika perlu diperbaiki
        } else {
            return false;
        }
    }

    checkoutButton.disabled = false;
    checkoutButton.classList.remove('disabled');
});


checkoutButton.addEventListener('click', async function (e) {
    e.preventDefault();
    const formData = new FormData(form);
    const data = new URLSearchParams(formData);
    const objData = Object.fromEntries(data);
     
   // const message = formatMessage(objData);
    // window.open('http://wa.me/6287788553078?text=' + encodeURIComponent(message));

    try {
        const response = await fetch('php/placeOrder.php', {
            method: 'POST',
            body: data,
        });

        const token = await response.text();
        //console.log(token);
        window.snap.pay(token);

    } catch(err) {
        console.log(err.message);
    }

});



const formatMessage = (obj) => {
    return `Data Customer
     Nama: ${obj.name}
     Email: ${obj.email}
     No HP: ${obj.phone}
     Alamat: ${obj.address}
     
Data Pesanan
   ${JSON.parse(obj.items).map((item) => `${item.name} (${item.quantity} x ${rupiah(item.
    total)}) \n`)}
    
TOTAL: ${rupiah(obj.total)}
Terima kasih.`;
     
};


const rupiah = (number) =>{
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(number);
};