// *****************************
//            Modal
// *****************************
function show() {
    $('.add-player-modal').fadeIn(() => {});
    $('#name-input').focus();
}

function hide() {
    $('.add-player-modal').fadeOut(() => {});
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

    //Set Pars, yardage, and hcp for all players when a course is selected
    setParsAndYardage() {

        //Updates PAR Placeholder Attr for the score inputs
        if (this.data.holeCount && this.data.holes) {
            for (let i = 0; i < this.players.length; i++) {
                this.players[i].setPlayerParsAndYardage(this.data.holeCount, this.data.holes)
            }
        }

    }

    //Updates total scores for inner and outer holes
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

    // Loads new coarse and updates Course Info, Background image, par/yardage/hcp
    getCourse(id) {
        if (id !== '0') {
            fetch(`https://golf-courses-api.herokuapp.com/courses/${id}`)
                .then(response => response.json())
                .then(data => {
                    this.data = data.data;
                    this.pars = [];
                    this.yardages = [];

                    this.setParsAndYardage();

                    // Updates Course info
                    $('#course-name').html(`${this.data.name}`);
                    $('#course-address').html(`${this.data.addr1}, ${this.data.city}`);
                    $('#course-phone').html(`${this.data.phone}`);
                    $('.changeable-background').css('background-image', `url(${this.data.thumbnail})`);
                })
        }
    }

    addPlayer(name, handicap, tee) {
        let playerID = this.numberOfPlayers;
        this.players.push(new Player(name, handicap, tee, playerID));
        this.players[playerID].createPlayerScorecard(name, handicap, tee, playerID);


        this.numberOfPlayers++;
        this.setParsAndYardage();
        hide();

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

    // Loads the html fields for new player
    createPlayerScorecard() {

        $('.score-column').append(`<div class="player-scores player-${this.id}-scores"></div>`);

        for (let i = 0; i < 18; i++) {
            //Makes 18 Score fields
            $(`.player-${this.id}-scores`).append(`<div class="score" id="${this.id}-${i}-score"><input class="score-input" type="number" placeholder="" onchange="game.players[${this.id}].score(${i}, this.value, game.data.holeCount)"><div id="${this.id}-${i}-yards" class="yardage"></div><div class="hcp" id="${this.id}-${i}-hcp"></div></div>`);
        }

        //Adds IN box
        $(`.player-${this.id}-scores > div:nth-child(9)`).after(`<div class="score" id="${this.id}-in"><input readonly="true" class="score-input" type="number"></div>`);

        //Adds OUT box
        $(`.player-${this.id}-scores`).append(`<div class="score" id="${this.id}-out"><input readonly class="score-input" type="number"></div>`);

        //Adds NAME box
        $(".players").append(`<div class="relative"><div class="player player-${this.id}" id="${this.id}" contenteditable onfocusout="game.changePlayerName($(this)[0].innerHTML, ${this.id})">${this.name}</div><div class="handicap" contenteditable="false">handicap: ${this.handicap}</div></div>`);

        //Adds TOTAL box
        $(".total").append(`<div class="relative"><div class="player-total"><p id="${this.id}-total"></p></div><div class="message" id="${this.id}-message"></div></div>`);
    }

    setPlayerParsAndYardage(holeCount, holes) {
        this.pars = [];
        this.yards = [];
        this.hcp = [];
        let tee = 0;
        for (let i = 0; i < holes[0].teeBoxes.length; i++) {
            if (holes[0].teeBoxes[i].teeTypeId === this.tee) {
                tee = i;
            }
        }
        for (let i = 0; i < holeCount; i++) {
            let hole = holes[i].teeBoxes;


            console.log(tee);

            // console.log(teeTypes);

            let par = hole[tee].par;
            let yards = hole[tee].yards;
            let hcp = hole[tee].hcp;
            this.pars.push(par);
            this.yards.push(yards);
            this.hcp.push(hcp);
            $(`#${this.id}-${i}-score`).children().attr('placeholder', `PAR-${par}`);
            $(`#${this.id}-${i}-yards`).html(`${yards} yards`);
            $(`#${this.id}-${i}-hcp`).html(`hcp: ${hcp} `);
        }

    }

    score(hole, score, holeCount) {
        this.scores[hole] = score;
        this.setInOut();
        this.setTotal(holeCount);
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

    setTotal(holeCount) {
        let message;

        this.total = 0;
        for (let i = 0; i < this.scores.length; i++) {
            if (this.scores[i]) {
                this.total += (this.scores[i] - this.pars[i])
            }
        }
        if (this.total < 0) {
            message = 'Huzzah!'
        } else {
            message = 'Not Bad!'
        }

        if (this.scores.length === holeCount && isFilled(this.scores)) {
            $(`#${this.id}-message`).css(`visibility`, `visible`);
            $(`#${this.id}-message`).html(`${message}`);
        }

        $(`#${this.id}-total`).html(this.total);
    }
}


// *****************************
//           MAIN JS
// *****************************


// INITIAL CALL
(function () {
    fetch('https://golf-courses-api.herokuapp.com/courses')
        .then(response => response.json())
        .then(data => {
            for (let i = 0; i < data.courses.length; i++) {
                $('.course-select').append(`<option value="${data.courses[i].id}">${data.courses[i].name}</option>`);
            }
        });

    // Builds Score Card Headers
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

    // Adds IN and OUT column Headers
    $(".holes > div:nth-child(9)").after(`<div class="hole" id=""><div class="hole-number">IN</span></div></div>`);
    $(".holes").append(`<div class="hole" id=""><div class="hole-number">OUT</span></div></div>`);
})();

//Check to see if an array has no empty slots
// Used to make sure that a player has finished all holes before displaying congrats message
function isFilled(array) {
    let filled = true;
    for (let i = 0; i < array.length; i++) {
        if (!array[i]) {
            filled = false;
        }
    }
    return filled;
}


let game = new Course();

game.addPlayer('men', 0, 3);
game.addPlayer('women', 0, 4);
game.addPlayer('champ', 0, 2);
game.addPlayer('pro', 0, 1);