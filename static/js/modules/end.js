export default class End {
    static disconnect() {
        console.log("disconnect");
        window.location.replace("http://localhost:3000")
        alert("You have been disconected due to being AFK!")
    }

    static win() {
        console.log("win");
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                // let data = JSON.parse(this.responseText)
                window.location.replace("http://localhost:3000")
                alert("You are THE WINNER!")
            }
        }
        xhttp.open("POST", "/win", true);
        xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhttp.send();
    }
}