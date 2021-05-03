
let stat = false

class Lobby {

    constructor(stat) {
        this.stat = stat
    }

    set_status() {
        // console.log("POST");
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                // console.log(this.responseText)
            }
        }
        xhttp.open("POST", "/status", true);
        xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhttp.send();
        lobby.start()
        // console.log(stat);
    }

    start() {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
            }
        };
        xhttp.open("GET", "/start", true);
        xhttp.send();
        clearInterval(inter1)
        clearInterval(inter2)
        clearInterval(inter3)
        window.location.replace("http://localhost:3000/game")
    }

    get() {
        // console.log("tik");
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                // console.log(this.responseText)
                let data = JSON.parse(this.responseText)

                document.getElementById("p1").innerText = data.n1

                if (data.r1 == "ready")
                    document.getElementById("p1").style.backgroundColor = data.c1
                else
                    document.getElementById("p1").style.backgroundColor = "darkgrey"

                ////////////////////////////////////////////////////////////////////////

                data.n2 != undefined ? document.getElementById("p2").innerText = data.n2 : document.getElementById("p2").innerText = "Searching..."

                if (data.r2 == "ready")
                    document.getElementById("p2").style.backgroundColor = data.c2
                else
                    document.getElementById("p2").style.backgroundColor = "darkgrey"

                ////////////////////////////////////////////////////////////////////////

                data.n3 != undefined ? document.getElementById("p3").innerText = data.n3 : document.getElementById("p3").innerText = "Searching..."

                if (data.r3 == "ready")
                    document.getElementById("p3").style.backgroundColor = data.c3
                else
                    document.getElementById("p3").style.backgroundColor = "darkgrey"

                ////////////////////////////////////////////////////////////////////////

                data.n4 != undefined ? document.getElementById("p4").innerText = data.n4 : document.getElementById("p4").innerText = "Searching..."

                if (data.r4 == "ready")
                    document.getElementById("p4").style.backgroundColor = data.c4
                else
                    document.getElementById("p4").style.backgroundColor = "darkgrey"

                ////////////////////////////////////////////////////////////////////////

                let player_count = Math.round((Object.keys(data).length - 1) / 3);

                let ready_count = 0;

                Object.keys(data)
                    .forEach(function eachKey(key) {
                        if (data[key] == "ready")
                            ready_count++
                    });

                console.log(player_count, ready_count);


                if (player_count >= 2 && player_count == ready_count) {
                    lobby.set_status()
                }

            }
        };
        xhttp.open("GET", "/lobby2", true);
        xhttp.send();
    }

    post() {
        // console.log("tak");
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                // console.log(this.responseText)
                let box = document.getElementById("ready").checked;
                (box) ? stat = true : stat = false;
            }
        }
        xhttp.open("POST", "/lobby3", true);
        xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhttp.send(JSON.stringify({ val: stat }));
        // console.log(stat);
    }

    btn() {
        let btn = document.getElementById("ready").checked
        let label = document.getElementById("label")

        btn ? label.innerText = "Ready" : label.innerText = "Not ready";
    }

}

let lobby = new Lobby


let inter1 = setInterval(lobby.get, 300)
let inter2 = setInterval(lobby.post, 300)
let inter3 = setInterval(lobby.btn, 300)