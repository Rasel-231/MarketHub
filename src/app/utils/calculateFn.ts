const increment = (currentQty: number, change: number = 1): number => {
    return currentQty + change;
};

const decrement = (currentQty: number, change: number = 1): number => {
    return currentQty - change;
};

const calculateSubtotal = (price: number, quantity: number): number => {
    return price * quantity;
};

const totalAmount = (items: { price: number; quantity: number }[]): number => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
}

export const cartCalc = {
    increment,
    decrement,
    calculateSubtotal,
    totalAmount
};