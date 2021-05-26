const { countReset } = require("console");
const express = require("express");
const session = require("express-session");

const path = require("path");
const { clearScreenDown } = require("readline");
const { isUndefined } = require("util");
const app = express();
const store = new session.MemoryStore();

// const room = require("./routes/room")

const PORT = process.env.PORT || 3000;

let rooms = [[]]
let rooms_inter = []
let colors = ['red', 'blue', 'green', 'yellow']
let color = ''
let index = -1
let dice = [
    "/gfx/1.png",
    "/gfx/2.png",
    "/gfx/3.png",
    "/gfx/4.png",
    "/gfx/5.png",
    "/gfx/6.png"
]
let countdown = []
let inters = []
let threw = false;

let r_tab = [
    'R',
    't1',
    't2',
    't3',
    't4',
    't5',
    't6',
    't7',
    't8',
    't9',
    't10',
    't11',
    't12',
    't13',
    't14',
    't15',
    't16',
    't17',
    't18',
    't19',
    't20',
    't21',
    't22',
    't23',
    't24',
    't25',
    't26',
    't27',
    't28',
    't29',
    't30',
    't31',
    't32',
    't33',
    't34',
    't35',
    't36',
    't37',
    't38',
    't39',
    't40',
    'RH1',
    'RH2',
    'RH3',
    'RH4',
]

let b_tab = [
    'B',
    't11',
    't12',
    't13',
    't14',
    't15',
    't16',
    't17',
    't18',
    't19',
    't20',
    't21',
    't22',
    't23',
    't24',
    't25',
    't26',
    't27',
    't28',
    't29',
    't30',
    't31',
    't32',
    't33',
    't34',
    't35',
    't36',
    't37',
    't38',
    't39',
    't40',
    't1',
    't2',
    't3',
    't4',
    't5',
    't6',
    't7',
    't8',
    't9',
    't10',
    'BH1',
    'BH2',
    'BH3',
    'BH4',
]

let y_tab = [
    'Y',
    't31',
    't32',
    't33',
    't34',
    't35',
    't36',
    't37',
    't38',
    't39',
    't40',
    't1',
    't2',
    't3',
    't4',
    't5',
    't6',
    't7',
    't8',
    't9',
    't10',
    't11',
    't12',
    't13',
    't14',
    't15',
    't16',
    't17',
    't18',
    't19',
    't20',
    't21',
    't22',
    't23',
    't24',
    't25',
    't26',
    't27',
    't28',
    't29',
    't30',
    'YH1',
    'YH2',
    'YH3',
    'YH4',
]

let g_tab = [
    'G',
    't21',
    't22',
    't23',
    't24',
    't25',
    't26',
    't27',
    't28',
    't29',
    't30',
    't31',
    't32',
    't33',
    't34',
    't35',
    't36',
    't37',
    't38',
    't39',
    't40',
    't1',
    't2',
    't3',
    't4',
    't5',
    't6',
    't7',
    't8',
    't9',
    't10',
    't11',
    't12',
    't13',
    't14',
    't15',
    't16',
    't17',
    't18',
    't19',
    't20',
    'GH1',
    'GH2',
    'GH3',
    'GH4',
]

//Static folder
app.use(express.static(path.join(__dirname, "static")))

app.use(session({
    secret: 'some secrect',
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    saveUninitialized: false,
    store
}))

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
    // console.log(store);
    // console.log(`${req.method} - ${req.url}`);
    next();
})


// app.use("/room", room)

app.post("/", (req, res) => {

    let is_already = false;

    for (let x in rooms)
        for (let y in rooms[x])
            if (rooms[x][y].id == req.sessionID)
                is_already = true


    let fresh = true;
    let keeper = 0;

    for (let i in rooms) {

        try {
            if (rooms[i][0].status != 0)
                fresh = false
            else {
                fresh = true
                keeper = i
            }


            // console.log("/ - TRY", { fresh: fresh, nick_gałgana: rooms[i][0].nick });
        } catch (error) {
            fresh = true
            // console.log("/ - CATCH");
        }
    }


    for (let i in rooms) {

        // console.log({ is_already: is_already, jest_miejsce: rooms[i].length < 4, fresh: fresh });

        if (is_already) {
            console.log("OSZUST");
            return res.redirect("/cheater")
        } else if (rooms[i].length < 4 && fresh && i == keeper) {
            // console.log(req.sessionID);
            // console.log(req.body)
            req.session.nick = req.body.nick
            // console.log(store);
            color = colors[rooms[i].length]
            rooms[i][rooms[i].length] = {
                id: req.sessionID,
                nick: req.body.nick,
                color: color,
                ready: "not ready",
                strikes: 0,
                status: 0,
                pawn1: 0,
                pawn2: 0,
                pawn3: 0,
                pawn4: 0,
            }
            console.log("added " + req.body.nick);
            return res.redirect("/lobby")
        } else if (!fresh) {   //NOWE LOBBY
            // console.log(req.sessionID);
            // console.log(req.body)
            req.session.nick = req.body.nick
            // console.log(store);
            color = colors[0]
            rooms.push(new Array({
                id: req.sessionID,
                nick: req.body.nick,
                color: color,
                ready: "not ready",
                strikes: 0,
                status: 0,
                pawn1: 0,
                pawn2: 0,
                pawn3: 0,
                pawn4: 0,
            }))
            index = -1;
            console.log("new room + added " + req.body.nick);
            return res.redirect("/lobby")
        } else {
            console.log({ sad: ":C", is_already: is_already, fresh: fresh });
        }
    }
    // console.log(rooms);
})

app.get("/cheater", (req, res) => {
    try {
        for (let i in rooms) {
            if (rooms[i].some(e => e.id == req.sessionID) && rooms[i].find(e => e.id == req.sessionID).status != 3)
                return res.send(JSON.stringify("Wait for your old lobby or go back to main game!"))
        }
    } catch (error) {
        return res.send(JSON.stringify("🤔"))
    }
})


app.get("/lobby", (req, res) => {

    return res.sendFile(path.join(__dirname + "/static/lobby.html"))

})

app.get("/lobby2", (req, res) => {

    let n1, c1, r1, n2, c2, r2, n3, c3, r3, n4, c4, r4 = ""

    for (let x in rooms)
        for (let y in rooms[x])
            if (rooms[x][y].id == req.sessionID)
                index = x

    // console.log(index);
    // console.log(rooms);
    // console.log(rooms[index]);

    switch (rooms[index].length) {
        case 1:
            n1 = rooms[index][0].nick;
            c1 = rooms[index][0].color;
            r1 = rooms[index][0].ready;
            break;
        case 2:
            n1 = rooms[index][0].nick;
            c1 = rooms[index][0].color;
            r1 = rooms[index][0].ready;

            n2 = rooms[index][1].nick;
            c2 = rooms[index][1].color;
            r2 = rooms[index][1].ready;
            break;
        case 3:
            n1 = rooms[index][0].nick;
            c1 = rooms[index][0].color;
            r1 = rooms[index][0].ready;

            n2 = rooms[index][1].nick;
            c2 = rooms[index][1].color;
            r2 = rooms[index][1].ready;

            n3 = rooms[index][2].nick;
            c3 = rooms[index][2].color;
            r3 = rooms[index][2].ready;
            break;
        case 4:
            n1 = rooms[index][0].nick;
            c1 = rooms[index][0].color;
            r1 = rooms[index][0].ready;

            n2 = rooms[index][1].nick;
            c2 = rooms[index][1].color;
            r2 = rooms[index][1].ready;

            n3 = rooms[index][2].nick;
            c3 = rooms[index][2].color;
            r3 = rooms[index][2].ready;

            n4 = rooms[index][3].nick;
            c4 = rooms[index][3].color;
            r4 = rooms[index][3].ready;
            break;
    }

    return res.send(JSON.stringify({
        n1: n1, c1: c1, r1: r1,
        n2: n2, c2: c2, r2: r2,
        n3: n3, c3: c3, r3: r3,
        n4: n4, c4: c4, r4: r4
    }))

    // console.log([
    //     "n1:" + n1, "c1:" + c1, "r1:" + r1,
    //     "n2:" + n2, "c2:" + c2, "r2:" + r2,
    //     "n3:" + n3, "c3:" + c3, "r3:" + r3,
    //     "n4:" + n4, "c4:" + c4, "r4:" + r4])
})

app.post("/lobby3", (req, res) => {

    let found = ""

    for (let x in rooms)
        for (let y in rooms[x])
            if (rooms[x][y].id == req.sessionID)
                found = rooms[x][y]


    found.ready = (req.body.val ? "ready" : "not ready");

    res.end()
})

app.get("/game", (req, res) => {

    let temp = 0

    for (let x in rooms)
        for (let y in rooms[x]) {
            if (rooms[x][y].id == req.sessionID)
                temp = x
            // if (rooms[x][y].status == 2)
            //     indexStatus2 = y
        }

    if (!rooms_inter.some(e => e == temp)) {
        console.log("inter start");

        // console.log(rooms[temp]);

        (function () {
            threw = false

            let indexStatus2 = 0
            console.log(rooms[temp]);
            // console.log(temp, indexStatus2);
            rooms[temp][indexStatus2].status = 1
            indexStatus2 = indexStatus2 + 1 >= rooms[temp].length ? 0 : indexStatus2 + 1
            rooms[temp][indexStatus2].status = 2

            // console.log(rooms);

            /////////////////////////////////////////////

            function CountDownTimer(duration, granularity) {
                this.duration = duration;
                this.granularity = granularity || 1000;
                this.tickFtns = [];
                this.running = false;
            }

            CountDownTimer.prototype.start = function () {
                if (this.running) {
                    return;
                }
                this.running = true;
                var start = Date.now(),
                    that = this,
                    diff, obj;

                (function timer() {
                    diff = that.duration - (((Date.now() - start) / 1000) | 0);

                    if (diff > 0) {
                        setTimeout(timer, that.granularity);
                    } else {
                        diff = 0;
                        that.running = false;
                    }

                    obj = CountDownTimer.parse(diff);
                    that.tickFtns.forEach(function (ftn) {
                        ftn.call(this, obj.minutes, obj.seconds);
                    }, that);
                }());
            };

            CountDownTimer.prototype.onTick = function (ftn) {
                if (typeof ftn === 'function') {
                    this.tickFtns.push(ftn);
                }
                return this;
            };

            CountDownTimer.prototype.expired = function () {
                return !this.running;
            };

            CountDownTimer.parse = function (seconds) {
                return {
                    'minutes': (seconds / 60) | 0,
                    'seconds': (seconds % 60) | 0
                };
            };

            clock = new CountDownTimer(30);

            clock.onTick(format).start();

            function restart() {
                if (this.expired()) {
                    setTimeout(function () { clock.start(); }, 1000);
                }
            }

            function format(minutes, seconds) {
                minutes = minutes < 10 ? "0" + minutes : minutes;
                seconds = seconds < 10 ? "0" + seconds : seconds;
                countdown[temp] = minutes + ':' + seconds;
            }

        })()

        inters[temp] = setInterval(() => {

            // console.log(rooms);
            threw = false

            let indexStatus2 = rooms[temp].findIndex(e => e.status == 2)

            let afk_max = rooms[temp].length - 1

            let score = rooms[temp][indexStatus2].pawn1 + rooms[temp][indexStatus2].pawn2 + rooms[temp][indexStatus2].pawn3 + rooms[temp][indexStatus2].pawn4

            // console.log(score);

            let winner = ""

            let hold = indexStatus2

            is2()

            function is2() {

                rooms[temp][indexStatus2].strikes == 2 ? rooms[temp][indexStatus2].status = 3 : rooms[temp][indexStatus2].status = 1
                indexStatus2 = indexStatus2 + 1 >= rooms[temp].length ? 0 : indexStatus2 + 1

                if (rooms[temp][indexStatus2].status == 3) {
                    afk_max--
                    is2()
                } else {
                    rooms[temp][indexStatus2].status = 2
                }

            }

            if (afk_max == 0) {
                winner = rooms[temp].find(e => e.status != 3)
                winner.status = 4
            } else if (score == 170) {
                for (let i in rooms[temp].length) {
                    rooms[temp][i].status = 3
                }
                winner = rooms[temp][hold]
                winner.status = 4
            }

            /////////////////////////////////////////////

            function CountDownTimer(duration, granularity) {
                this.duration = duration;
                this.granularity = granularity || 1000;
                this.tickFtns = [];
                this.running = false;
            }

            CountDownTimer.prototype.start = function () {
                if (this.running) {
                    return;
                }
                this.running = true;
                var start = Date.now(),
                    that = this,
                    diff, obj;

                (function timer() {
                    diff = that.duration - (((Date.now() - start) / 1000) | 0);

                    if (diff > 0) {
                        setTimeout(timer, that.granularity);
                    } else {
                        diff = 0;
                        that.running = false;
                    }

                    obj = CountDownTimer.parse(diff);
                    that.tickFtns.forEach(function (ftn) {
                        ftn.call(this, obj.minutes, obj.seconds);
                    }, that);
                }());
            };

            CountDownTimer.prototype.onTick = function (ftn) {
                if (typeof ftn === 'function') {
                    this.tickFtns.push(ftn);
                }
                return this;
            };

            CountDownTimer.prototype.expired = function () {
                return !this.running;
            };

            CountDownTimer.parse = function (seconds) {
                return {
                    'minutes': (seconds / 60) | 0,
                    'seconds': (seconds % 60) | 0
                };
            };

            clock = new CountDownTimer(30);

            clock.onTick(format).start();

            function restart() {
                if (this.expired()) {
                    setTimeout(function () { clock.start(); }, 1000);
                }
            }

            function format(minutes, seconds) {
                minutes = minutes < 10 ? "0" + minutes : minutes;
                seconds = seconds < 10 ? "0" + seconds : seconds;
                countdown[temp] = minutes + ':' + seconds;
            }

        }, 31000)

        rooms_inter.push(temp)
    }

    res.sendFile(path.join(__dirname + "/static/game.html"))

})

app.post("/status", (req, res) => {

    console.log("USTAWIAM STATUS");

    let index2 = 0;

    for (let x in rooms)
        for (let y in rooms[x])
            if (rooms[x][y].id == req.sessionID)
                index2 = x

    console.log(index2);

    try {
        let red = rooms[index2].find(e => e.color == "red")
        let blue = rooms[index2].find(e => e.color == "blue")
        let green = rooms[index2].find(e => e.color == "green")
        let yellow = rooms[index2].find(e => e.color == "yellow")

        red.status = 2
        blue.status = 1
        green.status = 1
        yellow.status = 1
    } catch (err) { }

    // console.log(rooms[index2]);

    res.end()

})

app.post("/dice", (req, res) => {



    let dice_throw = Math.floor(Math.random() * dice.length)
    // console.log(dice_throw+1);

    threw = true

    let found = ""

    for (let x in rooms)
        for (let y in rooms[x])
            if (rooms[x][y].id == req.sessionID)
                found = rooms[x][y]

    res.send(JSON.stringify({
        img: dice[dice_throw],
        num: dice_throw + 1,
        color: found.color,
        p1: found.pawn1,
        p2: found.pawn2,
        p3: found.pawn3,
        p4: found.pawn4,
        threw: threw
    }));

})


app.post("/turns", (req, res) => {

    let found = ""
    let temp = 0;

    for (let x in rooms)
        for (let y in rooms[x])
            if (rooms[x][y].id == req.sessionID) {
                found = rooms[x][y]
                temp = x
            }




    // console.log(countdown);

    res.send(JSON.stringify({
        status: found.status,
        time: countdown[temp],
        afk: found.strikes,
        nick: found.nick,
        r_tab: r_tab,
        b_tab: b_tab,
        y_tab: y_tab,
        g_tab: g_tab,
        threw: threw
    }))
})

app.post("/afker", (req, res) => {

    let found = ""

    for (let x in rooms)
        for (let y in rooms[x])
            if (rooms[x][y].id == req.sessionID)
                found = rooms[x][y]

    found.strikes = req.body.afk

    // console.log(countdown);

    res.send()
})

app.post("/pawns", (req, res) => {

    let found = ""

    let p1r, p2r, p3r, p4r, p1b, p2b, p3b, p4b, p1y, p2y, p3y, p4y, p1g, p2g, p3g, p4g = ""

    for (let x in rooms)
        for (let y in rooms[x])
            if (rooms[x][y].id == req.sessionID)
                found = rooms[x]


    switch (found.length) {
        case 1:
            p1r = found[0].pawn1
            p2r = found[0].pawn2
            p3r = found[0].pawn3
            p4r = found[0].pawn4

            res.send(JSON.stringify({
                p1r: p1r, p2r: p2r, p3r: p3r, p4r: p4r,
            }))
            break;
        case 2:
            p1r = found[0].pawn1
            p2r = found[0].pawn2
            p3r = found[0].pawn3
            p4r = found[0].pawn4

            p1b = found[1].pawn1
            p2b = found[1].pawn2
            p3b = found[1].pawn3
            p4b = found[1].pawn4

            res.send(JSON.stringify({
                p1r: p1r, p2r: p2r, p3r: p3r, p4r: p4r,
                p1b: p1b, p2b: p2b, p3b: p3b, p4b: p4b,
            }))
            break;
        case 3:
            p1r = found[0].pawn1
            p2r = found[0].pawn2
            p3r = found[0].pawn3
            p4r = found[0].pawn4

            p1b = found[1].pawn1
            p2b = found[1].pawn2
            p3b = found[1].pawn3
            p4b = found[1].pawn4

            p1y = found[2].pawn1
            p2y = found[2].pawn2
            p3y = found[2].pawn3
            p4y = found[2].pawn4

            res.send(JSON.stringify({
                p1r: p1r, p2r: p2r, p3r: p3r, p4r: p4r,
                p1b: p1b, p2b: p2b, p3b: p3b, p4b: p4b,
                p1y: p1y, p2y: p2y, p3y: p3y, p4y: p4y,
            }))
            break;
        case 4:
            p1r = found[0].pawn1
            p2r = found[0].pawn2
            p3r = found[0].pawn3
            p4r = found[0].pawn4

            p1b = found[1].pawn1
            p2b = found[1].pawn2
            p3b = found[1].pawn3
            p4b = found[1].pawn4

            p1y = found[2].pawn1
            p2y = found[2].pawn2
            p3y = found[2].pawn3
            p4y = found[2].pawn4

            p1g = found[3].pawn1
            p2g = found[3].pawn2
            p3g = found[3].pawn3
            p4g = found[3].pawn4

            res.send(JSON.stringify({
                p1r: p1r, p2r: p2r, p3r: p3r, p4r: p4r,
                p1b: p1b, p2b: p2b, p3b: p3b, p4b: p4b,
                p1y: p1y, p2y: p2y, p3y: p3y, p4y: p4y,
                p1g: p1g, p2g: p2g, p3g: p3g, p4g: p4g
            }))
            break;
    }
    // console.log(countdown);

    // console.log({
    //     p1r: p1r, p2r: p2r, p3r: p3r, p4r: p4r,
    //     p1b: p1b, p2b: p2b, p3b: p3b, p4b: p4b,
    //     p1y: p1y, p2y: p2y, p3y: p3y, p4y: p4y,
    //     p1g: p1g, p2g: p2g, p3g: p3g, p4g: p4g
    // });

    res.end()

})


app.post("/move", (req, res) => {

    // console.log("MOVE");

    let found = ""
    let temp = 0;


    for (let x in rooms)
        for (let y in rooms[x])
            if (rooms[x][y].id == req.sessionID) {
                found = rooms[x][y]
                temp = x
            }

    let col = found.color

    col = col[0]

    found.pawn1 = req.body.p1
    found.pawn2 = req.body.p2
    found.pawn3 = req.body.p3
    found.pawn4 = req.body.p4

    switch (col) {
        case "r":
            // kill blue
            if (r_tab[found.pawn1] == b_tab[rooms[temp][1].pawn1] || r_tab[found.pawn2] == b_tab[rooms[temp][1].pawn1] || r_tab[found.pawn3] == b_tab[rooms[temp][1].pawn1] || r_tab[found.pawn4] == b_tab[rooms[temp][1].pawn1])
                rooms[temp][1].pawn1 = 0
            if (r_tab[found.pawn1] == b_tab[rooms[temp][1].pawn2] || r_tab[found.pawn2] == b_tab[rooms[temp][1].pawn2] || r_tab[found.pawn3] == b_tab[rooms[temp][1].pawn2] || r_tab[found.pawn4] == b_tab[rooms[temp][1].pawn2])
                rooms[temp][1].pawn2 = 0
            if (r_tab[found.pawn1] == b_tab[rooms[temp][1].pawn3] || r_tab[found.pawn2] == b_tab[rooms[temp][1].pawn3] || r_tab[found.pawn3] == b_tab[rooms[temp][1].pawn3] || r_tab[found.pawn4] == b_tab[rooms[temp][1].pawn3])
                rooms[temp][1].pawn3 = 0
            if (r_tab[found.pawn1] == b_tab[rooms[temp][1].pawn4] || r_tab[found.pawn2] == b_tab[rooms[temp][1].pawn4] || r_tab[found.pawn3] == b_tab[rooms[temp][1].pawn4] || r_tab[found.pawn4] == b_tab[rooms[temp][1].pawn4])
                rooms[temp][1].pawn4 = 0

            //kill yellow
            if (rooms[temp].length == 3) {
                if (r_tab[found.pawn1] == y_tab[rooms[temp][2].pawn1] || r_tab[found.pawn2] == y_tab[rooms[temp][2].pawn1] || r_tab[found.pawn3] == y_tab[rooms[temp][2].pawn1] || r_tab[found.pawn4] == y_tab[rooms[temp][2].pawn1])
                    rooms[temp][2].pawn1 = 0
                if (r_tab[found.pawn1] == y_tab[rooms[temp][2].pawn2] || r_tab[found.pawn2] == y_tab[rooms[temp][2].pawn2] || r_tab[found.pawn3] == y_tab[rooms[temp][2].pawn2] || r_tab[found.pawn4] == y_tab[rooms[temp][2].pawn2])
                    rooms[temp][2].pawn2 = 0
                if (r_tab[found.pawn1] == y_tab[rooms[temp][2].pawn3] || r_tab[found.pawn2] == y_tab[rooms[temp][2].pawn3] || r_tab[found.pawn3] == y_tab[rooms[temp][2].pawn3] || r_tab[found.pawn4] == y_tab[rooms[temp][2].pawn3])
                    rooms[temp][2].pawn3 = 0
                if (r_tab[found.pawn1] == y_tab[rooms[temp][2].pawn4] || r_tab[found.pawn2] == y_tab[rooms[temp][2].pawn4] || r_tab[found.pawn3] == y_tab[rooms[temp][2].pawn4] || r_tab[found.pawn4] == y_tab[rooms[temp][2].pawn4])
                    rooms[temp][2].pawn4 = 0
            }

            //kill green
            if (rooms[temp].length == 4) {
                if (r_tab[found.pawn1] == g_tab[rooms[temp][3].pawn1] || r_tab[found.pawn2] == g_tab[rooms[temp][3].pawn1] || r_tab[found.pawn3] == g_tab[rooms[temp][3].pawn1] || r_tab[found.pawn4] == g_tab[rooms[temp][3].pawn1])
                    rooms[temp][3].pawn1 = 0
                if (r_tab[found.pawn1] == g_tab[rooms[temp][3].pawn2] || r_tab[found.pawn2] == g_tab[rooms[temp][3].pawn2] || r_tab[found.pawn3] == g_tab[rooms[temp][3].pawn2] || r_tab[found.pawn4] == g_tab[rooms[temp][3].pawn2])
                    rooms[temp][3].pawn2 = 0
                if (r_tab[found.pawn1] == g_tab[rooms[temp][3].pawn3] || r_tab[found.pawn2] == g_tab[rooms[temp][3].pawn3] || r_tab[found.pawn3] == g_tab[rooms[temp][3].pawn3] || r_tab[found.pawn4] == g_tab[rooms[temp][3].pawn3])
                    rooms[temp][3].pawn3 = 0
                if (r_tab[found.pawn1] == g_tab[rooms[temp][3].pawn4] || r_tab[found.pawn2] == g_tab[rooms[temp][3].pawn4] || r_tab[found.pawn3] == g_tab[rooms[temp][3].pawng4] || r_tab[found.pawn4] == g_tab[rooms[temp][3].pawn4])
                    rooms[temp][3].pawn4 = 0
            }
            break

        case "b":
            // kill red
            if (b_tab[found.pawn1] == r_tab[rooms[temp][0].pawn1] || b_tab[found.pawn2] == r_tab[rooms[temp][0].pawn1] || b_tab[found.pawn3] == r_tab[rooms[temp][0].pawn1] || b_tab[found.pawn4] == r_tab[rooms[temp][0].pawn1])
                rooms[temp][0].pawn1 = 0
            if (b_tab[found.pawn1] == r_tab[rooms[temp][0].pawn2] || b_tab[found.pawn2] == r_tab[rooms[temp][0].pawn2] || b_tab[found.pawn3] == r_tab[rooms[temp][0].pawn2] || b_tab[found.pawn4] == r_tab[rooms[temp][0].pawn2])
                rooms[temp][0].pawn2 = 0
            if (b_tab[found.pawn1] == r_tab[rooms[temp][0].pawn3] || b_tab[found.pawn2] == r_tab[rooms[temp][0].pawn3] || b_tab[found.pawn3] == r_tab[rooms[temp][0].pawn3] || b_tab[found.pawn4] == r_tab[rooms[temp][0].pawn3])
                rooms[temp][0].pawn3 = 0
            if (b_tab[found.pawn1] == r_tab[rooms[temp][0].pawn4] || b_tab[found.pawn2] == r_tab[rooms[temp][0].pawn4] || b_tab[found.pawn3] == r_tab[rooms[temp][0].pawn4] || b_tab[found.pawn4] == r_tab[rooms[temp][0].pawn4])
                rooms[temp][0].pawn4 = 0

            //kill yellow
            if (rooms[temp].length == 3) {
                if (b_tab[found.pawn1] == y_tab[rooms[temp][2].pawn1] || b_tab[found.pawn2] == y_tab[rooms[temp][2].pawn1] || b_tab[found.pawn3] == y_tab[rooms[temp][2].pawn1] || b_tab[found.pawn4] == y_tab[rooms[temp][2].pawn1])
                    rooms[temp][2].pawn1 = 0
                if (b_tab[found.pawn1] == y_tab[rooms[temp][2].pawn2] || b_tab[found.pawn2] == y_tab[rooms[temp][2].pawn2] || b_tab[found.pawn3] == y_tab[rooms[temp][2].pawn2] || b_tab[found.pawn4] == y_tab[rooms[temp][2].pawn2])
                    rooms[temp][2].pawn2 = 0
                if (b_tab[found.pawn1] == y_tab[rooms[temp][2].pawn3] || b_tab[found.pawn2] == y_tab[rooms[temp][2].pawn3] || b_tab[found.pawn3] == y_tab[rooms[temp][2].pawn3] || b_tab[found.pawn4] == y_tab[rooms[temp][2].pawn3])
                    rooms[temp][2].pawn3 = 0
                if (b_tab[found.pawn1] == y_tab[rooms[temp][2].pawn4] || b_tab[found.pawn2] == y_tab[rooms[temp][2].pawn4] || b_tab[found.pawn3] == y_tab[rooms[temp][2].pawn4] || b_tab[found.pawn4] == y_tab[rooms[temp][2].pawn4])
                    rooms[temp][2].pawn4 = 0
            }

            //kill green
            if (rooms[temp].length == 4) {
                if (b_tab[found.pawn1] == g_tab[rooms[temp][3].pawn1] || b_tab[found.pawn2] == g_tab[rooms[temp][3].pawn1] || b_tab[found.pawn3] == g_tab[rooms[temp][3].pawn1] || b_tab[found.pawn4] == g_tab[rooms[temp][3].pawn1])
                    rooms[temp][3].pawn1 = 0
                if (b_tab[found.pawn1] == g_tab[rooms[temp][3].pawn2] || b_tab[found.pawn2] == g_tab[rooms[temp][3].pawn2] || b_tab[found.pawn3] == g_tab[rooms[temp][3].pawn2] || b_tab[found.pawn4] == g_tab[rooms[temp][3].pawn2])
                    rooms[temp][3].pawn2 = 0
                if (b_tab[found.pawn1] == g_tab[rooms[temp][3].pawn3] || b_tab[found.pawn2] == g_tab[rooms[temp][3].pawn3] || b_tab[found.pawn3] == g_tab[rooms[temp][3].pawn3] || b_tab[found.pawn4] == g_tab[rooms[temp][3].pawn3])
                    rooms[temp][3].pawn3 = 0
                if (b_tab[found.pawn1] == g_tab[rooms[temp][3].pawn4] || b_tab[found.pawn2] == g_tab[rooms[temp][3].pawn4] || b_tab[found.pawn3] == g_tab[rooms[temp][3].pawng4] || b_tab[found.pawn4] == g_tab[rooms[temp][3].pawn4])
                    rooms[temp][3].pawn4 = 0
            }
            break


        case "y":
            // kill red
            if (y_tab[found.pawn1] == r_tab[rooms[temp][0].pawn1] || y_tab[found.pawn2] == r_tab[rooms[temp][0].pawn1] || y_tab[found.pawn3] == r_tab[rooms[temp][0].pawn1] || y_tab[found.pawn4] == r_tab[rooms[temp][0].pawn1])
                rooms[temp][0].pawn1 = 0
            if (y_tab[found.pawn1] == r_tab[rooms[temp][0].pawn2] || y_tab[found.pawn2] == r_tab[rooms[temp][0].pawn2] || y_tab[found.pawn3] == r_tab[rooms[temp][0].pawn2] || y_tab[found.pawn4] == r_tab[rooms[temp][0].pawn2])
                rooms[temp][0].pawn2 = 0
            if (y_tab[found.pawn1] == r_tab[rooms[temp][0].pawn3] || y_tab[found.pawn2] == r_tab[rooms[temp][0].pawn3] || y_tab[found.pawn3] == r_tab[rooms[temp][0].pawn3] || y_tab[found.pawn4] == r_tab[rooms[temp][0].pawn3])
                rooms[temp][0].pawn3 = 0
            if (y_tab[found.pawn1] == r_tab[rooms[temp][0].pawn4] || y_tab[found.pawn2] == r_tab[rooms[temp][0].pawn4] || y_tab[found.pawn3] == r_tab[rooms[temp][0].pawn4] || y_tab[found.pawn4] == r_tab[rooms[temp][0].pawn4])
                rooms[temp][0].pawn4 = 0

            //kill blue
            if (y_tab[found.pawn1] == b_tab[rooms[temp][1].pawn1] || y_tab[found.pawn2] == b_tab[rooms[temp][1].pawn1] || y_tab[found.pawn3] == b_tab[rooms[temp][1].pawn1] || y_tab[found.pawn4] == b_tab[rooms[temp][1].pawn1])
                rooms[temp][1].pawn1 = 0
            if (y_tab[found.pawn1] == b_tab[rooms[temp][1].pawn2] || y_tab[found.pawn2] == b_tab[rooms[temp][1].pawn2] || y_tab[found.pawn3] == b_tab[rooms[temp][1].pawn2] || y_tab[found.pawn4] == b_tab[rooms[temp][1].pawn2])
                rooms[temp][1].pawn2 = 0
            if (y_tab[found.pawn1] == b_tab[rooms[temp][1].pawn3] || y_tab[found.pawn2] == b_tab[rooms[temp][1].pawn3] || y_tab[found.pawn3] == b_tab[rooms[temp][1].pawn3] || y_tab[found.pawn4] == b_tab[rooms[temp][1].pawn3])
                rooms[temp][1].pawn3 = 0
            if (y_tab[found.pawn1] == b_tab[rooms[temp][1].pawn4] || y_tab[found.pawn2] == b_tab[rooms[temp][1].pawn4] || y_tab[found.pawn3] == b_tab[rooms[temp][1].pawn4] || y_tab[found.pawn4] == b_tab[rooms[temp][1].pawn4])
                rooms[temp][1].pawn4 = 0

            //kill green
            if (rooms[temp].length == 4) {
                if (y_tab[found.pawn1] == g_tab[rooms[temp][3].pawn1] || y_tab[found.pawn2] == g_tab[rooms[temp][3].pawn1] || y_tab[found.pawn3] == g_tab[rooms[temp][3].pawn1] || y_tab[found.pawn4] == g_tab[rooms[temp][3].pawn1])
                    rooms[temp][3].pawn1 = 0
                if (y_tab[found.pawn1] == g_tab[rooms[temp][3].pawn2] || y_tab[found.pawn2] == g_tab[rooms[temp][3].pawn2] || y_tab[found.pawn3] == g_tab[rooms[temp][3].pawn2] || y_tab[found.pawn4] == g_tab[rooms[temp][3].pawn2])
                    rooms[temp][3].pawn2 = 0
                if (y_tab[found.pawn1] == g_tab[rooms[temp][3].pawn3] || y_tab[found.pawn2] == g_tab[rooms[temp][3].pawn3] || y_tab[found.pawn3] == g_tab[rooms[temp][3].pawn3] || y_tab[found.pawn4] == g_tab[rooms[temp][3].pawn3])
                    rooms[temp][3].pawn3 = 0
                if (y_tab[found.pawn1] == g_tab[rooms[temp][3].pawn4] || y_tab[found.pawn2] == g_tab[rooms[temp][3].pawn4] || y_tab[found.pawn3] == g_tab[rooms[temp][3].pawng4] || y_tab[found.pawn4] == g_tab[rooms[temp][3].pawn4])
                    rooms[temp][3].pawn4 = 0
            }
            break


        case "g":
            // kill red
            if (g_tab[found.pawn1] == r_tab[rooms[temp][0].pawn1] || g_tab[found.pawn2] == r_tab[rooms[temp][0].pawn1] || g_tab[found.pawn3] == r_tab[rooms[temp][0].pawn1] || g_tab[found.pawn4] == r_tab[rooms[temp][0].pawn1])
                rooms[temp][0].pawn1 = 0
            if (g_tab[found.pawn1] == r_tab[rooms[temp][0].pawn2] || g_tab[found.pawn2] == r_tab[rooms[temp][0].pawn2] || g_tab[found.pawn3] == r_tab[rooms[temp][0].pawn2] || g_tab[found.pawn4] == r_tab[rooms[temp][0].pawn2])
                rooms[temp][0].pawn2 = 0
            if (g_tab[found.pawn1] == r_tab[rooms[temp][0].pawn3] || g_tab[found.pawn2] == r_tab[rooms[temp][0].pawn3] || g_tab[found.pawn3] == r_tab[rooms[temp][0].pawn3] || g_tab[found.pawn4] == r_tab[rooms[temp][0].pawn3])
                rooms[temp][0].pawn3 = 0
            if (g_tab[found.pawn1] == r_tab[rooms[temp][0].pawn4] || g_tab[found.pawn2] == r_tab[rooms[temp][0].pawn4] || g_tab[found.pawn3] == r_tab[rooms[temp][0].pawn4] || g_tab[found.pawn4] == r_tab[rooms[temp][0].pawn4])
                rooms[temp][0].pawn4 = 0

            //kill blue
            if (g_tab[found.pawn1] == b_tab[rooms[temp][1].pawn1] || g_tab[found.pawn2] == b_tab[rooms[temp][1].pawn1] || g_tab[found.pawn3] == b_tab[rooms[temp][1].pawn1] || g_tab[found.pawn4] == b_tab[rooms[temp][1].pawn1])
                rooms[temp][1].pawn1 = 0
            if (g_tab[found.pawn1] == b_tab[rooms[temp][1].pawn2] || g_tab[found.pawn2] == b_tab[rooms[temp][1].pawn2] || g_tab[found.pawn3] == b_tab[rooms[temp][1].pawn2] || g_tab[found.pawn4] == b_tab[rooms[temp][1].pawn2])
                rooms[temp][1].pawn2 = 0
            if (g_tab[found.pawn1] == b_tab[rooms[temp][1].pawn3] || g_tab[found.pawn2] == b_tab[rooms[temp][1].pawn3] || g_tab[found.pawn3] == b_tab[rooms[temp][1].pawn3] || g_tab[found.pawn4] == b_tab[rooms[temp][1].pawn3])
                rooms[temp][1].pawn3 = 0
            if (g_tab[found.pawn1] == b_tab[rooms[temp][1].pawn4] || g_tab[found.pawn2] == b_tab[rooms[temp][1].pawn4] || g_tab[found.pawn3] == b_tab[rooms[temp][1].pawn4] || g_tab[found.pawn4] == b_tab[rooms[temp][1].pawn4])
                rooms[temp][1].pawn4 = 0

            //kill yellow
            if (rooms[temp].length == 3) {
                if (g_tab[found.pawn1] == y_tab[rooms[temp][2].pawn1] || g_tab[found.pawn2] == y_tab[rooms[temp][2].pawn1] || g_tab[found.pawn3] == y_tab[rooms[temp][2].pawn1] || g_tab[found.pawn4] == y_tab[rooms[temp][2].pawn1])
                    rooms[temp][2].pawn1 = 0
                if (g_tab[found.pawn1] == y_tab[rooms[temp][2].pawn2] || g_tab[found.pawn2] == y_tab[rooms[temp][2].pawn2] || g_tab[found.pawn3] == y_tab[rooms[temp][2].pawn2] || g_tab[found.pawn4] == y_tab[rooms[temp][2].pawn2])
                    rooms[temp][2].pawn2 = 0
                if (g_tab[found.pawn1] == y_tab[rooms[temp][2].pawn3] || g_tab[found.pawn2] == y_tab[rooms[temp][2].pawn3] || g_tab[found.pawn3] == y_tab[rooms[temp][2].pawn3] || g_tab[found.pawn4] == y_tab[rooms[temp][2].pawn3])
                    rooms[temp][2].pawn3 = 0
                if (g_tab[found.pawn1] == y_tab[rooms[temp][2].pawn4] || g_tab[found.pawn2] == y_tab[rooms[temp][2].pawn4] || g_tab[found.pawn3] == y_tab[rooms[temp][2].pawn4] || g_tab[found.pawn4] == y_tab[rooms[temp][2].pawn4])
                    rooms[temp][2].pawn4 = 0
            }
            break

    }

    res.send()
})


app.post("/win", (req, res) => {

    let found = ""
    let temp = 0;

    for (let x in rooms)
        for (let y in rooms[x])
            if (rooms[x][y].id == req.sessionID) {
                found = rooms[x][y]
                temp = x
            }

    clearInterval(inters[temp])
    rooms.splice(temp, 1)
    inters.splice(temp, 1)

    // console.log(countdown);

    // res.clearCookie('connect.sid')
    res.send()
})


//nasłuch na określonym porcie

app.listen(PORT, () => {
    console.log("start serwera na porcie " + PORT)
})

module.exports = { store }