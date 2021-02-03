let products = [
    {
        nameProduct: 'Car',
        price: 20,
        quantity: 10
    },
    {
        nameProduct: 'bike',
        price: 50,
        quantity: 52
    },
    {
        nameProduct: 'plain',
        price: 100,
        quantity: 20
    }
];
function CountBasketPrice(products) {
    let totalPrice = 0;
    for (let i = 0; i < products.length; i++){
        totalPrice += products[i].price * products[i].quantity;
    }
    return totalPrice;
}

console.log(CountBasketPrice(products))