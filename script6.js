// 6. Реализовать функцию с тремя параметрами: function mathOperation(arg1, arg2, operation), где arg1, arg2 – значения аргументов,
//  operation – строка с названием операции. В зависимости от переданного значения операции выполнить одну из арифметических операций 
// (использовать функции из пункта 5) и вернуть полученное значение (использовать switch).

'use strict';

function mathSum(a, b) {
    return a + b;
}

function mathSubtrac(a, b) {
    return a - b;
}

function mathMultipl(a, b) {
    return a * b;
}

function mathDivision(a, b) {
    return a / b;
}

function mathOperation(arg1, arg2, operation) {
    switch (operation) {
        case '+':
            return mathSum(arg1, arg2);
        case '-':
            return mathSubtrac(arg1, arg2);
        case '*':
            return mathMultipl(arg1, arg2);
        case '/':
            return mathDivision(arg1, arg2);
        default:
            return 'Incorrect operator.'
    }
}

let a = 77, b = 5, mathOperator = '*';
alert(`${a} ${mathOperator} ${b} = ${mathOperation(a, b, mathOperator)}`);