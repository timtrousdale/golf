// *****************************
//            Modal
// *****************************
function show() {
    $('.add-player-modal').fadeIn(() => {
    })
}

function hide() {
    $('.add-player-modal').fadeOut(() => {
    })
}


// *****************************
//           Classes
// *****************************


class Course {
    constructor() {
        this.players = [];
        this.numberOfPlayers = 0;
        this.pars = [];
        this.yardages = [];
        this.data = {};

    }

    setParsAndYardage() {

        //Inserts PAR Placeholder for the score inputs
        if (this.data.holeCount && this.data.holes) {

            for (let i = 0; i < this.players.length; i++) {
                this.players[i].setPlayerParsAndYardage(this.data.holeCount, this.data.holes)
            }
        }

    }

    insOuts() {

        for (let i = 0; i < this.players.length; i++) {

            //Grabs holes 1-9 and calculates IN
            let ins = 0;
            for (let j = 0; j < 9; j++) {
                let val = parseInt($(`#${i}-${j}`).children().val());
                if (val) {
                    ins += val;
                }

            }
            $(`#${i}-in`).children().val(ins);

            //Grabs holes 1-9 and calculates IN
            let outs = 0;
            for (let j = 9; j < 18; j++) {
                let val = parseInt($(`#${i}-${j}`).children().val());
                if (val) {
                    outs += val;
                }
            }
            $(`#${i}-out`).children().val(outs);

        }
    }

    getCourse(id) {
        if (id !== '0') {
            fetch(`https://golf-courses-api.herokuapp.com/courses/${id}`)
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    this.data = data.data;
                    this.pars = [];
                    this.yardages = [];

                    this.setParsAndYardage();


                    //TODO make this update overlay with course info
                });
        }
    }

    addPlayer(name, handicap, tee) {


        let playerID = this.numberOfPlayers;
        this.players.push(new Player(name, handicap, tee, playerID));
        this.players[playerID].createPlayerScorecard(name, handicap, tee, playerID);


        this.numberOfPlayers++;
        this.setParsAndYardage();

    }

    changePlayerName(name, id) {
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].name === name) {
                this.players[id].rename(name, true);
                return;
            }
        }
        this.players[id].rename(name, false);
    }

}


class Player {
    constructor(name, handicap, tee, id) {
        this.name = name;
        this.handicap = handicap;
        this.tee = tee;
        this.scores = [];
        this.total = 0;
        this.pars = [];
        this.yards = [];
        this.in = 0;
        this.out = 0;
        this.id = id;
    }

    createPlayerScorecard() {

        $('.score-column').append(`<div class="player-scores player-${this.id}-scores"></div>`);

        for (let i = 0; i < 18; i++) {
            //Makes 18 Score fields
            $(`.player-${this.id}-scores`).append(`<div class="score" id="${this.id}-${i}-score"><input class="score-input" type="number" placeholder="par " onchange="game.players[${this.id}].score(${i}, this.value)"><div id="${this.id}-${i}-yards" class="yardage">Yards</div></div>`);
        }

        //Adds IN box
        $(`.player-${this.id}-scores > div:nth-child(9)`).after(`<div class="score" id="${this.id}-in"><input readonly="true" class="score-input" type="number"></div>`);

        //Adds OUT box
        $(`.player-${this.id}-scores`).append(`<div class="score" id="${this.id}-out"><input readonly class="score-input" type="number"></div>`);

        //Adds NAME box
        $(".players").append(`<div class="player player-${this.id}" id="${this.id}" contenteditable onfocusout="game.changePlayerName($(this)[0].innerHTML, ${this.id})">${this.name}</div>`);

        //Adds TOTAL box
        $(".total").append(`<div class="player-total" id="${this.id}-total"></div>`);
    }

    setPlayerParsAndYardage(holeCount, holes) {
        console.log(holes);
        this.pars = [];
        this.yards = [];
        for (let i = 0; i < holeCount; i++) {
            let hole = holes[i].teeBoxes;
            let teeTypes = {
                Pro: 0,
                Champion: 0,
                Men: 0,
                Women: 0
            };

            for (let j = 0; j < hole.length; j++) {
                teeTypes[hole[j].teeType] = j;
            }

            let par = hole[teeTypes[this.tee]].par;
            let yards = hole[teeTypes[this.tee]].yards;
            this.pars.push(par);
            this.yards.push(yards);
            $(`#${this.id}-${i}-score`).children().attr('placeholder', `par-${par}`);
            $(`#${this.id}-${i}-yards`).html(`${yards} yards`);
        }
        console.log(this.yards);

    }

    score(hole, score) {
        this.scores[hole] = score;
        this.setInOut();
        this.setTotal();
    }

    rename(name, nameTaken) {
        if (nameTaken === true) {
            $(`#${this.id}`).html(this.name);
        } else {
            this.name = name;
            $(`#${this.id}`).html(name);
        }
    }

    setInOut() {
        this.in = 0;
        for (let i = 0; i < 9; i++) {
            if (this.scores[i]) {
                this.in += parseInt(this.scores[i]);
            }
        }
        $(`#${this.id}-in`).children().val(this.in);

        this.out = 0;
        for (let i = 9; i < 18; i++) {
            if (this.scores[i]) {
                this.out += parseInt(this.scores[i]);
            }
        }
        $(`#${this.id}-out`).children().val(this.out);

    }

    setTotal() {
        this.total = 0;
        console.log('ran');
        for (let i = 0; i < this.scores.length; i++) {
            if (this.scores[i]) {
                console.log('ran2');
                this.total += (this.scores[i] - this.pars[i])
            }
        }
        $(`#${this.id}-total`).html(this.total);
    }


}


//Pro-1, champion- 2, men -3, women-4

// *****************************
//           MAIN JS
// *****************************


// INITIAL CALL
(function () {
    fetch('https://golf-courses-api.herokuapp.com/courses')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            for (let i = 0; i < data.courses.length; i++) {
                $('.course-select').append(`<option value="${data.courses[i].id}">${data.courses[i].name}</option>`);
            }
        });

    // Builds Hole Columns
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
        $('.holes').append(`<div class="hole" id="hole-${i}"><div class="hole-number">${i + 1}<span></span>${nth}</span></div></div>`);
    }

    // Adds IN and OUT columns
    $(".holes > div:nth-child(9)").after(`<div class="hole" id=""><div class="hole-number">IN</span></div></div>`);
    $(".holes").append(`<div class="hole" id=""><div class="hole-number">OUT</span></div></div>`);
})();


let game = new Course();


//TODO DELETE this placeholder info
let b = {
    addr1: "1400 N 200 E",
    addr2: null,
    city: "American Fork",
    country: "United States",
    courseId: 18300,
    holeCount: 18,
    holes: [],
    id: "18300",
    lat: 40.4031413225741,
    lng: -111.787138581276,
    name: "Fox Hollow Golf Club",
    phone: "(801) 756-3594",
    stateOrProvince: "UT",
    thumbnail: "https://swingbyswing-b9.s3.amazonaws.com/photo/in-round/12486769/uploaded-photo43828077-480x360.png",
    website: "http://www.foxhollowutah.com/",
    zipCode: "84003",
};


// TODO Remove this, it's for testing
game.addPlayer('tim', 2, 'Champion');
game.addPlayer('timmy', 2, 'Men');