function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

class Buttons {
    constructor(div) {
        this.div = div;
    }

    add(txt) {
        var newb = document.createElement("button");
        newb.setAttribute('onclick', 'button_onclick(event)');
        newb.innerHTML = txt;
        return this.div.appendChild(newb);
    }

    clear() {
        this.div.innerHTML = "";
    }

    deactivate() {
        var children = this.div.children;
        for (var i = 0; i < children.length; i++) {
          children[i].disabled = true;
        }
    }

    activate() {
        var children = this.div.children;
        for (var i = 0; i < children.length; i++) {
          children[i].disabled = false;
        }
    }

}


class Scoreboard {
    constructor(correct, wrong) {
        this.correct = correct;
        this.wrong = wrong;
        this.correct_num = 0;
        this.wrong_num = 0;
    }

    update() {
        this.correct.innerHTML = this.correct_num;
        this.wrong.innerHTML = this.wrong_num;
    }

    incr_correct() {
        this.correct_num++;
        this.update();
    }

    incr_wrong() {
        this.wrong_num++;
        this.update();
    }

    reset() {
        this.correct_num = 0;
        this.wrong_num = 0;
        this.update();
    }
}


class TextElement {
    constructor(div) {
        this.div = div;
    }

    clear() {
        this.div.innerHTML = "";
    }

    set(txt) {
        this.div.innerHTML = txt;
    }
}


var iface = new class {
    constructor() {
        this.buttons = new Buttons(document.getElementById("buttons"));
        this.message = new TextElement(document.getElementById("message"));
        this.response = new TextElement(document.getElementById("response"));
        this.score = new Scoreboard(
            document.getElementById("correct_num"),
            document.getElementById("wrong_num"),
        );
        this.answer = "";
    }
};

function button_onclick(event) {
    var answer = event.target.innerHTML;
    questions.current.check(answer);
}

class Question {
    constructor(q) {
        this.question = q.Question;
        this.answer = q.Correct;
        this.options = shuffle(q.Options);
    }

    ask() {
        iface.message.set(this.question);
        iface.response.clear();
        iface.buttons.clear();
        for (var i = 0; i < this.options.length; i++) {
            iface.buttons.add(this.options[i]);
        }
    }

    check(a) {
        var isCorrect = (this.answer == a);
        if (isCorrect) {
            iface.response.set("Riktig!");
            iface.score.incr_correct();
            iface.buttons.deactivate();
            window.setTimeout(
                function () {
                    var q = questions.next();
                    if (q != null)
                        q.ask();
                    else
                        showExitMessage();
                },
                500,
            )
        }
        else {
            iface.response.set("Feil..");
            iface.score.incr_wrong();
            iface.buttons.deactivate();
            window.setTimeout(
                function () {
                    iface.response.clear();
                    iface.buttons.activate();
                },
                5000,
            )
        }
        return isCorrect;
    }
}


class Questions {
    constructor(qlist) {
        this.qlist = shuffle(qlist);
        this.idx = 0;
        this.current = new Question(this.qlist[0]);
    }

    next() {
        this.idx++;
        if (this.idx < this.qlist.length)
            this.current = new Question(this.qlist[this.idx]);
        else
            this.current = null;
        return this.current;
    }
}

var questions = new Questions(qlist);
questions.current.ask();


function showExitMessage() {
    s = "Nå er vi ferdige. Du fikk " + iface.score.correct_num +
        " riktige og " + iface.score.wrong_num + " feil.";

    iface.message.set(s);
    iface.response.clear();
    iface.buttons.clear();
}

