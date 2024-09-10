function fillArrayWithRandomIntegers() {
    const randomNumbers = [];

    for (let i = 0; i < 5; i++) {
        const randomNumber = Math.floor(Math.random() * 100);
        randomNumbers.push(randomNumber);
    }

    return randomNumbers;
}

const filledArray = fillArrayWithRandomIntegers();

const outputElement = document.getElementById("output");
outputElement.innerHTML = filledArray;