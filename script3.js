let a = parseInt(prompt('Введите первое число: '));

let b = parseInt(prompt('Введите второе число: '));

function MathOperation(a, b) {
    if (a < 0 && b < 0) {
        return a * b;
    } else if (a >= 0 && b >= 0) {
        return a - b;
    }
    return a + b;
}

alert(MathOperation(a, b));