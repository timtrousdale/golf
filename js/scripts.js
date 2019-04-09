// MODAL
function show() {
    $('.add-player-modal').fadeIn(() => {
    })
}

function hide() {
    $('.add-player-modal').fadeOut(() => {
    })
}

// *****************************
//         HTTP Requests
// *****************************

let GETAllCourses, GETCourse;

GETAllCourses = new XMLHttpRequest();
GETAllCourses.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
        let result = JSON.parse(this.responseText);
        for (let i = 0; i < result.courses.length; i++) {
            $('.course-select').append(`<option value="${result.courses[i].id}">${result.courses[i].name}</option>`);
        }
    }
};

(function () {
    GETAllCourses.open("GET", `https://golf-courses-api.herokuapp.com/courses`, true);
    GETAllCourses.send();
})();


GETCourse = new XMLHttpRequest();
GETCourse.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
        let result = JSON.parse(this.responseText);
        console.log(result);

    }
};

function getCourse(id) {
    if (id !== '0') {
        GETCourse.open("GET", `https://golf-courses-api.herokuapp.com/courses/${id}`, true);
        GETCourse.send();
    }
}


let columns = 18;
let players = 0;
let game = {
    course: '',
    holes: 18,
    teeOff: '',
    players: []
};

class Course {
    constructor(course, holes, tees) {
        this.course = name;
        this.holes = holes;
        this.players = [];
    }
    getCourse() {
        //TODO Add http call here
    }


}

function addPlayer(name, handicap, tee) {
    players++;
    $('.score-column').append(`<div class="player-scores player-${players}-scores"></div>`);
    // this.players.push(new Player(name, handicap, tee));

    for (let i = 0; i < 18; i++) {
        console.log('ran');


        $(`.player-${players}-scores`).append(`<div class="score" id="${players}-${i}"><input class="score-input" type="number"></div>`);
    }



    $(`.player-${players}-scores > div:nth-child(9)`).after(`<div class="score" id="${players}-in"><input readonly="true" class="score-input" type="number"></div>`);

    $(`.player-${players}-scores`).append(`<div class="score" id="${players}-out"><input readonly class="score-input" type="number"></div>`);

    $(".players").append(`<div class="player player-${players}" id="${players}">${name}</div>`);

    $(".total").append(`<div class="player-total player-${players}" id="total-${players}"></div>`);

}


class Player {
    constructor(name, handicap, tee) {
        this.name = name;
        this.handicap = handicap;
        this.tee = tee;
        this.scores = [];
        this.in = 0;
        this.out = 0;

    }

    score(hole, score) {
        this.scores[hole] = score
    }

    rename(name) {
        this.name = name;
    }
    getIn() {
        let score = 0;
        for (let i = 0; i < 9; i++) {
            score += this.scores[i];
        }
    }
    getOut() {
        let score = 0;
        for (let i = 9; i < 18; i++) {
            score += this.scores[i];
        }
    }
}

(function(el) {

    for (let i = 0; i < 18; i++) {
        let nth;
        switch (i) {
            case 0:
                nth = 'st';
                break;
            case 1:
                nth = 'nd';
                break;
            case 2:
                nth = 'rd';
                break;
            default:
                nth = 'th';
        }
        $(el).append(`<div class="hole" id="hole-${i}"><div class="hole-number">${i + 1}<span></span>${nth}</span></div></div>`);
    }
    $(".holes > div:nth-child(9)").after(`<div class="hole" id=""><div class="hole-number">In</span></div></div>`);
    $(".holes").append(`<div class="hole" id=""><div class="hole-number">Out</span></div></div>`);
})('.holes');

// TODO Change this to an add player function, and make the UI only let one player add at a time


// class Printer {
//     constructor(ipAddress, brand, model) {
//         this.ipAddress = ipAddress;
//         this.brand = brand;
//         this.model = model;
//         this._status = 'Ready';
//     };
//
//     print() {
//         this._status = 'Printing'
//     };
//
//     getStatus() {
//         return this._status;
//
//     };
//
// }
//
// class InkJet extends Printer {
//     constructor(ipAddress, brand, model, inkType) {
//         super(ipAddress, brand, model);
//         this.inkType = inkType
//
//     }
//
//     print() {
//         // do stuff
//     }
// }
//
// class Ink {
//     constructor() {
//         this.magenta = 100;
//         this.cyan = 100;
//         this.yellow = 100;
//     }
// }
//
// const inky = new InkJet('10.0.0.8', 'hp', 'xr-121', new Ink());
// const printer = new Printer('168.192.10.3', 'Brother', 'MFC');
//
// console.log(printer.getStatus());
// console.log(inky);
//
// // Callback
//
// function getData(id, callback) {
//     let data = {name: 'secret angent'};
//     callback(data);
// }
//
// getData(232323, (data) => {
//     // do something with data
//     console.log(data);
// });
//
// // Promise
//
// function getDataPromise(id) {
//     return new Promise((resolve, reject) => {
//         if (!id) {
//             reject({error: 'you are smart', message: 'try again'});
//         }
//         let data = {name: 'secret angent'};
//         resolve(data);
//     })
// }
//
// let dataPromise = getDataPromise(23423);
// dataPromise.then(data => {
//         console.log(`from .the ${data}`);
//     });


// TODO Remove this, it's for testing
addPlayer('tim', 2, 'white');