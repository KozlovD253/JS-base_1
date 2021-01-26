// 4. Присвоить переменной а значение в промежутке [0..15]. С помощью оператора switch организовать вывод чисел от a до 15.

let userNumber = parseInt(prompt('Введите число от 1 до 15: '));
let lstNumber = 15;

function arrayCreator(Num) {
    let ArrayNum = [];
    for (let i = Num; i <= lstNumber; i++) {
        ArrayNum.push(i);
    }
    return ArrayNum;
}

switch (userNumber) {
    case 0:
        alert(arrayCreator(0));
        break;
    case 1:
        alert(arrayCreator(1));
        break;
    case 2:
        alert(arrayCreator(2));
        break;
    case 3:
        alert(arrayCreator(3));
        break;
    case 4:
        alert(arrayCreator(4));
        break;
    case 5:
        alert(arrayCreator(5));
        break;
    case 6:
        alert(arrayCreator(6));
        break;
    case 7:
        alert(arrayCreator(7));
        break;
    case 8:
        alert(arrayCreator(8));
        break;
    case 9:
        alert(arrayCreator(9));
        break;
    case 10:
        alert(arrayCreator(10));
        break;
    case 11:
        alert(arrayCreator(11));
        break;
    case 12:
        alert(arrayCreator(12));
        break;
    case 13:
        alert(arrayCreator(13));
        break;
    case 14:
        alert(arrayCreator(14));
        break;
    case 15:
        alert(arrayCreator(15));
        break;

    default:
        alert('Вы ввели неверные данные');
        break;
}