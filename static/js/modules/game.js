import End from './end.js'
import Render from './render.js'


let strikes = 0
let once = true
let pawns = []
let threw

let r_tab = []
let b_tab = []
let y_tab = []
let g_tab = []

export {
    strikes,
    once,
    pawns,
    threw,
    r_tab,
    b_tab,
    y_tab,
    g_tab
}

export default class Game {

    turns() {
        // console.log("POST");
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                // console.log(this.responseText)
                let data = JSON.parse(this.responseText)

                // console.log(data);

                let btn = document.getElementById("dice")
                threw = data.threw

                if (data.status == 2 && !threw)
                    btn.disabled = false
                else
                    btn.disabled = true

                let timer = document.getElementById("time")

                timer.innerText = data.time

                strikes = data.afk

                if (data.status == 2) {
                    if (data.time == "00:30") {
                        console.log("turn - start");
                        once = true;
                        window.location.reload()
                    } else if (!threw && data.time == "00:01" && once) {
                        once = false;
                        console.log("turn - end + AFK");
                        strikes++
                        game.afker()
                        strikes = 0
                    } else if (threw && data.time == "00:01" && once) {
                        once = false;
                        console.log("AFK = 0");
                        strikes = 0
                        game.afker()
                    }
                } else if (data.status == 3) {
                    End.disconnect()
                } else if (data.status == 4) {
                    End.win()
                }

                r_tab = data.r_tab
                b_tab = data.b_tab
                y_tab = data.y_tab
                g_tab = data.g_tab

                Render.pawns()

            }
        }
        xhttp.open("POST", "/turns", true);
        xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhttp.send();
        // console.log(stat);
    }

    afker() {
        console.log("afk");
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                // let data = JSON.parse(this.responseText)

            }
        }
        xhttp.open("POST", "/afker", true);
        xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhttp.send(JSON.stringify({ afk: strikes }));
    }

    dice() {
        console.log("dice");
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let data = JSON.parse(this.responseText)

                let dice = document.getElementById("dice_img")

                dice.src = data.img

                let text = new SpeechSynthesisUtterance("You rolled a" + data.num)
                text.lang = 'en-US'
                window.speechSynthesis.speak(text)


                threw = data.threw
                console.log(threw);

                // game.move(data.num, data.color, data.p1, data.p2, data.p3, data.p4)

                data.color = data.color[0]

                let curr_tab = []

                switch (data.color) {
                    case "r":
                        curr_tab = r_tab
                        break

                    case "b":
                        curr_tab = b_tab
                        break

                    case "y":
                        curr_tab = y_tab
                        break

                    case "g":
                        curr_tab = g_tab
                        break
                }

                let col = data.color.toUpperCase()

                if (data.p1 != 0)
                    pawns.push({ e: document.getElementById(curr_tab[data.p1]), v: data.p1 })
                else
                    pawns.push({ e: document.getElementById(col), v: data.p1 })

                if (data.p2 != 0)
                    pawns.push({ e: document.getElementById(curr_tab[data.p2]), v: data.p2 })
                else
                    pawns.push({ e: document.getElementById(col), v: data.p2 })

                if (data.p3 != 0)
                    pawns.push({ e: document.getElementById(curr_tab[data.p3]), v: data.p3 })
                else
                    pawns.push({ e: document.getElementById(col), v: data.p3 })

                if (data.p4 != 0)
                    pawns.push({ e: document.getElementById(curr_tab[data.p4]), v: data.p4 })
                else
                    pawns.push({ e: document.getElementById(col), v: data.p4 })


                console.log([pawns]);

                for (let i in pawns) {

                    if ((data.num == 1 || data.num == 6) || pawns[i].e != document.getElementById(col)) {

                        if (data.num == 6 && pawns[i].e == document.getElementById(col))
                            data.num = 1
                        else if (data.num == 6 && pawns[i].e != document.getElementById(col))
                            data.num = 6

                        let sum = pawns[i].v + data.num

                        if (sum < 45) {

                            if (!(sum > 40 && document.getElementById(curr_tab[sum]).children[0].style.display == "block")) {

                                let helper = pawns[i].v

                                helper = helper[1]

                                function hover_off() {
                                    document.getElementById(curr_tab[sum]).style.backgroundImage = "none"
                                }

                                function hover_on() {
                                    document.getElementById(curr_tab[sum]).style.backgroundImage = "url('../gfx/selector.png')"
                                }

                                function clicker() {
                                    pawns[i].v += data.num

                                    if (i == 0)
                                        data.p1 = sum
                                    else if (i == 1)
                                        data.p2 = sum
                                    else if (i == 2)
                                        data.p3 = sum
                                    else if (i == 3)
                                        data.p4 = sum

                                    for (i in pawns) {
                                        pawns[i].e.removeEventListener("mouseover", hover_on)
                                        pawns[i].e.removeEventListener("mouseout", hover_off)
                                        pawns[i].e.removeEventListener("click", clicker)
                                        document.getElementById(curr_tab[pawns[i].v]).style.backgroundImage = "none"
                                    }

                                    game.move(data.p1, data.p2, data.p3, data.p4)

                                    window.location.reload()
                                }

                                console.log(pawns[i].e);

                                pawns[i].e.addEventListener("mouseover", hover_on)

                                pawns[i].e.addEventListener("mouseout", hover_off)

                                pawns[i].e.addEventListener("click", clicker)
                            }

                        }

                    }
                }

            }
        }
        xhttp.open("POST", "/dice", true);
        xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhttp.send();

    }

    move(p1, p2, p3, p4) {
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                // let data = JSON.parse(this.responseText)
            }
        }
        xhttp.open("POST", "/move", true);
        xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhttp.send(JSON.stringify({
            p1: p1,
            p2: p2,
            p3: p3,
            p4: p4,
        }));
        pawns = []
        Render.pawns()
    }


}

let game = new Game