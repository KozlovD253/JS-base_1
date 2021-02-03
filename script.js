//1. Написать функцию, преобразующую число в объект. Передавая на вход число от 0 до 999, мы должны получить на выходе объект,
// в котором в соответствующих свойствах описаны единицы, десятки и сотни. 
// Например, для числа 245 мы должны получить следующий объект: {‘единицы’: 5, ‘десятки’: 4, ‘сотни’: 2}. Если число превышает 999,
// необходимо выдать соответствующее сообщение с помощью console.log и вернуть пустой объект.

function num_to_category(num) {
    if (num > 999) {
        console.log('число больше 999');
        const num_obj = {};
        return num_obj;
    }
    const numTriple = (num - num % 100) / 100;
    const numDouble = (num % 100 - num % 10) / 10;
    const numSingle = num - numTriple * 100 - numDouble * 10;

    const num_obj = {
        triple: numTriple,
        double: numDouble,
        single: numSingle,
    }
    return num_obj;
}

    const obj1 = num_to_category(1655);
    const obj2 = num_to_category(942);
    const obj3 = num_to_category(71);
    const obj4 = num_to_category(2);
    console.log(obj1);
    console.log(obj2);
    console.log(obj3);
    console.log(obj4);

