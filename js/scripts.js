

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
    if (id !== 0) {
        GETCourse.open("GET", `https://golf-courses-api.herokuapp.com/courses/${id}`, true);
        GETCourse.send();
    }
}


let columns = 18;
let players = [];
let game = {
    course: '',
    holes: 18,
    teeOff: '',
    players: []
};

class Course {
    constructor(name, holes, tees) {
        this.name = name;
        this.holes = holes;
        this.tees = tees; // Should be an Array
        this.players = [];
    }

    addPlayer(name, handicap, tee) {
        $(".players").append(`<div class="player-${i}" id="${i}">${name}<div><p class="tee">${tee}</p></div></div>`);
        this.players.push(new Player(name, handicap, tee))
    }
}


class Player {
    constructor(name, handicap, tee) {
        this.name = name;
        this.handicap = handicap;
        this.tee = tee;
        this.scores = [];

    }

    score(hole, score) {
        this.scores[holeNumber] = score
    }

    rename(name) {
        this.name = name;
    }
}

function loadCourse() {
    for (let i = 0; i < columns; i++) {
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
        $(".holes").append(`<div class="hole" id="hole-${i}"><div class="hole-number">${i + 1}<span></span>${nth}</span></div></div>`);
    }
}

loadCourse();

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