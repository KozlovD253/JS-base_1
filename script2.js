const Basket = {
    goods: [
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
    ],
    countBasketPrice() {
        return this.goods.reduce((totalPrice, goods) => totalPrice += goods.price * goods.quantity, 0);
    }
};

console.log(Basket.countBasketPrice());