class Person {
    say() {
        console.log('person say')
    }
}

class Xiaoming extends Person {
    constructor(){
        super()
    }
    say() {
        super.say();
        console.log('xiaoming say');
    }
}

new Xiaoming().say()