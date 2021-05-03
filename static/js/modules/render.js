let close_one = ""

import { r_tab, b_tab, y_tab, g_tab } from './game.js'

export default class Render {

    static pawns() {
        // console.log("pionki");
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {

                let data = JSON.parse(this.responseText)

                let r_count = 0;
                let b_count = 0;
                let y_count = 0;
                let g_count = 0;

                // console.log({
                //     p1r: data.p1r, p2r: data.p2r, p3r: data.p3r, p4r: data.p4r,
                //     p1b: data.p1b, p2b: data.p2b, p3b: data.p3b, p4b: data.p4b,
                //     p1y: data.p1y, p2y: data.p2y, p3y: data.p3y, p4y: data.p4y,
                //     p1g: data.p1g, p2g: data.p2g, p3g: data.p3g, p4g: data.p4
                // });


                try {
                    let to_del = document.querySelectorAll("img.gem1, img.gem2, img.gem3, img.gem4")

                    for (let i in to_del)
                        to_del[i].parentNode.removeChild(to_del[i])


                    let to_hide = document.querySelectorAll("#R img, #B img, #Y img, #G img")

                    for (let i in to_hide)
                        to_hide[i].style.display = "none"


                } catch (error) { }

                for (let key in data) {
                    // console.log(data[key]);
                    if (data[key] == 0) {
                        if (key[2] == "r") {
                            document.getElementById("R").children[r_count].childNodes[1].style.display = "block"
                            r_count++
                        } else if (key[2] == "b") {
                            document.getElementById("B").children[b_count].childNodes[1].style.display = "block"
                            b_count++
                        } else if (key[2] == "y") {
                            document.getElementById("Y").children[y_count].childNodes[1].style.display = "block"
                            y_count++
                        } else if (key[2] == "g") {
                            document.getElementById("G").children[g_count].childNodes[1].style.display = "block"
                            g_count++
                        }
                    } else if (data[key] > 40) {
                        if (key[2] == "r") {
                            close_one = data[key].toString()

                            close_one = close_one.charAt(1)

                            if (close_one == 1)
                                document.getElementById("RH1").children[0].style.display = "block"
                            else if (close_one == 2)
                                document.getElementById("RH2").children[0].style.display = "block"
                            else if (close_one == 3)
                                document.getElementById("RH3").children[0].style.display = "block"
                            else if (close_one == 4)
                                document.getElementById("RH4").children[0].style.display = "block"


                        } else if (key[2] == "b") {
                            close_one = data[key].toString()

                            close_one = close_one.charAt(1)

                            if (close_one == 1)
                                document.getElementById("BH1").children[0].style.display = "block"
                            else if (close_one == 2)
                                document.getElementById("BH2").children[0].style.display = "block"
                            else if (close_one == 3)
                                document.getElementById("BH3").children[0].style.display = "block"
                            else if (close_one == 4)
                                document.getElementById("BH4").children[0].style.display = "block"

                        } else if (key[2] == "y") {
                            close_one = data[key].toString()

                            close_one = close_one.charAt(1)

                            if (close_one == 1)
                                document.getElementById("YH1").children[0].style.display = "block"
                            else if (close_one == 2)
                                document.getElementById("YH2").children[0].style.display = "block"
                            else if (close_one == 3)
                                document.getElementById("YH3").children[0].style.display = "block"
                            else if (close_one == 4)
                                document.getElementById("YH4").children[0].style.display = "block"


                        } else if (key[2] == "g") {
                            close_one = data[key].toString()

                            close_one = close_one.charAt(1)

                            if (close_one == 1)
                                document.getElementById("GH1").children[0].style.display = "block"
                            else if (close_one == 2)
                                document.getElementById("GH2").children[0].style.display = "block"
                            else if (close_one == 3)
                                document.getElementById("GH3").children[0].style.display = "block"
                            else if (close_one == 4)
                                document.getElementById("GH4").children[0].style.display = "block"

                        }
                    } else {
                        if (key[2] == "r") {
                            let tile = document.getElementById(r_tab[data[key]])
                            let img = new Image()
                            img.src = "./gfx/red_light.png"
                            img.classList.add("gem" + (tile.children.length + 1))
                            tile.appendChild(img)
                        } else if (key[2] == "b") {
                            let tile = document.getElementById(b_tab[data[key]])
                            let img = new Image()
                            img.src = "./gfx/blue_light.png"
                            img.classList.add("gem" + (tile.children.length + 1))
                            tile.appendChild(img)
                        } else if (key[2] == "y") {
                            let tile = document.getElementById(y_tab[data[key]])
                            let img = new Image()
                            img.src = "./gfx/yellow_light.png"
                            img.classList.add("gem" + (tile.children.length + 1))
                            tile.appendChild(img)
                        } else if (key[2] == "g") {
                            let tile = document.getElementById(g_tab[data[key]])
                            let img = new Image()
                            img.src = "./gfx/green_light.png"
                            img.classList.add("gem" + (tile.children.length + 1))
                            tile.appendChild(img)
                        }
                    }
                }
            }
        }
        xhttp.open("POST", "/pawns", true);
        xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhttp.send();
        // console.log("przed fetchem");
        // fetch("/disconnect", { method: "POST" })
    }

}