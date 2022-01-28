const Game = {};



class Kennedy {
    constructor(x, gravity) {
        this.gravity = gravity;
        this.velocity = 0;
        this.y = Game.heightCar + Game.heightKennedy;
        this.x = x;

        this.div = $('<div class="kennedy">');

        this.update();

        this.div.appendTo(Game.div);
    }

    update() {
        this.velocity += this.gravity;
        this.y += this.velocity;

        this.div.css('top', this.y+ 'px').css('left', this.x + 'px');
    }

    remove() {
        clearInterval(this.interval);
        this.div.remove();
    }

    start(gameOver, onclick) {
        let self = this;
        this.div.click(onclick);
        this.div[0].ontouchstart = onclick;
        this.interval = setInterval(() => {
            if (self.y > Game.height + Game.heightKennedy) {
                gameOver();
                clearInterval(this.interval);
            } else {
                self.update();
            }
        }, 1000 / Game.FPS);
    }
}

class Car {
    constructor() {
        this.div = $('#car');
    }

    get x() {
        return parseInt(this.div.css('left'));
    }
}

(function(g) {
    g.div = $('#game');
    g.width = g.div.width();
    g.height = g.div.height();
    g.heightKennedy = 85;
    g.widthCar = 150;
    g.heightCar = 30;
    g.kennedyIntervalMS = 750;
    g.lineY = g.height * 0.7;
    g.FPS = 60;
    g.initHP = 5;

    createjs.Sound.registerSound({
        src: "./music/tap.mp3",
        id: "tap"
    });

    createjs.Sound.registerSound({
        src: "./music/error.mp3",
        id: "error"
    });

    createjs.Sound.registerSound({
        src: "./music/end.mp3",
        id: "end"
    });

    function play(name) {
        createjs.Sound.stop();
        createjs.Sound.play(name);
    }

    function randInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    g.setEvents = function() {
        $('#car').addClass('carmove');
    }

    function gameOver(score) {
        const car = $('#car');
        car.css('left', car.css('left')).removeClass('carmove');
        $('#score').text(score);
        $('#game-over').modal({backdrop: 'static'}).modal('show');
        play("end");
    }

    function updateHP(hp) {
        $('#hp').text(hp);
    }

    function updateScore(score) {
        $('#score-display').text(score);
    }

    g.start = function() {
        $('.kennedy').each((i, t) => t.remove());

        let score = 0, hp = g.initHP;
        updateHP(hp);
        updateScore(score);

        const senpai = new Car();
        const set = new Set();
        g.setEvents();
        createjs.Sound.stop();

        let teaInterval = setInterval(() => {
            let t = new Kennedy(senpai.x, randInt(15, 45) / 100);
            set.add(t);
            t.start(() => {
                hp--;
                updateHP(hp);
                if (hp !== 0) {
                    play("error");
                } else {
                    clearInterval(teaInterval);
                    set.forEach(t => clearInterval(t.interval));
                    gameOver(score);
                }
            }, () => {
                if (t.y + g.heightKennedy > g.lineY) {
                    play("tap");
                    set.delete(t);
                    t.remove();
                    score++;
                    updateScore(score);
                }
            });
        }, g.kennedyIntervalMS);
    }
}) (Game);

function closeWelcome() {
    $('#welcome').removeClass('welcome');
    $('#welcome-board').css('display', 'none');
    $('#game').css('display', '');
}
