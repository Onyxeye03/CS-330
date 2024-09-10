function RandArray() {
    const randomNumbers = [];

    for (let i = 0; i < 5; i++) {
        const randomNumber = Math.floor(Math.random() * 100); // Generates a random integer between 0 and 99
        randomNumbers.push(randomNumber);
    }

    return randomNumbers;
}

const filledArray = RandArray();
console.log(filledArray);