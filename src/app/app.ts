class MainApp {
    private attack : boolean;
    private jump : boolean;
    constructor() {
	this.attack = false;
	this.jump = false;
    }
    resetFrame() {
	this.attack = false;
	this.jump = false;
    }
    clickAttack() {
	this.attack = true;
    }
    clickJump() {
	this.jump = true;
    }
    init() {
//	document.getElementById("start_btn").onclick = function() {
//	    app.startGame();
//	} 
	document.getElementById("start_btn").onclick = ()=>this.startGame();
	document.getElementById("attack_btn").onclick = ()=>this.clickAttack();
	document.getElementById("jump_btn").onclick = ()=>this.clickJump();
    }
    startGame() {
	document.getElementById("title_dsp").style.display = "none";
	document.getElementById("player_dsp").style.display = "";
	this.stateEnterWalk();
    }
    stateEnterWalk() {
	document.getElementById("sound").src = "../res/dbwalk/walk_me.mp3";
	this.stateInWalk(1);
    }
    stateInWalk(next :number) {
	if (next > 7) {
	    if (this.jump && !this.attack) {
		this.stateEnterWalkWin();
	    } else {
		this.stateEnterWalkDeath();
	    }
	} else {
	    document.getElementById("player_img").src = "../res/dbwalk/0" + next + ".png";
	    if (next < 6) {
		this.resetFrame();
	    }
	    window.setTimeout(() => this.stateInWalk(next+1), 500);
	}
    }
    stateEnterWalkWin() {
	document.getElementById("sound").src = "../res/dbwin/dbw.mp3";
	window.setTimeout(() => this.stateInWalkWin(1), 500);
    }
    stateInWalkWin(next : number) {
	if (next > 4) {
	    if (!this.attack && this.jump) {
		this.stateEnterFight();
	    } else {
		this.stateEnterFrog();
	    }
	} else {
	    this.resetFrame();
	    document.getElementById("player_img").src = "../res/dbwin/dbw" + next + ".png";
	    window.setTimeout(() => this.stateInWalkWin(next+1), 500);
	}
    }
    stateEnterFrog() {
	document.getElementById("sound").src = "../res/frog/frog.mp3";
	window.setTimeout(() => this.stateInFrog(1), 500);
    }
    stateInFrog(next : number) {
	if (next > 4) {
	    this.stateEnterEnd();
	} else {
	    this.resetFrame();
	    document.getElementById("player_img").src = "../res/frog/f" + next + ".png";
	    window.setTimeout(() => this.stateInFrog(next+1), 500);
	}
    }
    stateEnterFight() {
	document.getElementById("sound").src = "../res/attack/attack.mp3";
	window.setTimeout(() => this.stateInFight(1), 500);
    }
    stateInFight(next : number) {
	if (next > 4) {
	    if (this.attack && !this.jump) {
		this.stateEnterWin();
	    } else {
		this.stateEnterDragon();
	    }
	} else {
	    this.resetFrame();
	    document.getElementById("player_img").src = "../res/attack/a" + next + ".png";
	    window.setTimeout(() => this.stateInFight(next+1), 500);
	}
    }
    stateEnterWin() {
	document.getElementById("sound").src = "../res/awin/awin.mp3";
	window.setTimeout(() => this.stateInWin(1), 500);
    }
    stateInWin(next : number) {
	if (next > 5) {
	    this.stateEnterEnd();
	} else {
	    document.getElementById("player_img").src = "../res/awin/aw" + next + ".png";
	    window.setTimeout(() => this.stateInWin(next+1), 500);
	}
    }
    stateEnterDragon() {
	document.getElementById("sound").src = "../res/adeath/adeath.mp3";
	window.setTimeout(() => this.stateInDragon(1), 500);
    }
    stateInDragon(next : number) {
	if (next > 5) {
	    this.stateEnterEnd();
	} else {
	    document.getElementById("player_img").src = "../res/adeath/ad" + next + ".png";
	    window.setTimeout(() => this.stateInDragon(next+1), 500);
	}
    }
    stateEnterWalkDeath() {
	document.getElementById("sound").src = "../res/dbdeath/dbdeath.mp3";
	window.setTimeout(() => this.stateInWalkDeath(1), 500);
    }
    stateInWalkDeath(next : number) {
	if (next > 3) {
	    this.stateEnterEnd();
	} else {
	    document.getElementById("player_img").src = "../res/dbdeath/dbd" + next + ".png";
	    window.setTimeout(() => this.stateInWalkDeath(next+1), 500);
	}
    }
    stateEnterEnd() {
	document.getElementById("sound").src = "../res/gameover/gameover.mp3";
	window.setTimeout(() => this.stateInEnd(1), 500);
    }
    stateInEnd(next : number) {
	if (next > 2) {
	    this.endGame();
	} else {
	    document.getElementById("player_img").src = "../res/gameover/go" + next + ".png";
	    window.setTimeout(() => this.stateInEnd(next+1), 500);
	}
    }
    endGame() {
	document.getElementById("title_dsp").style.display = "";
	document.getElementById("title_img").src = "../res/title/title4.png";
	document.getElementById("player_dsp").style.display = "none";
    }
}


class IntroView {
    private frame : number;
    constructor() {
	this.frame = 1;
    }
    main() {
	document.getElementById("title_dsp").style.display = "";
	document.getElementById("start_btn").style.display = "none";
	document.getElementById("sound").src = "../res/title/tada.mp3";
	document.getElementById("sound").autoplay = "1";
	document.getElementById("title_img").src = "../res/title/title1.png";
	document.getElementById("player_dsp").style.display = "none";
	window.setTimeout(() => this.nextFrame(2), 200);
    }
    nextFrame(next : number) {
	if (next > 4) {
	    document.getElementById("start_btn").style.display = "";
	} else {
	    document.getElementById("title_img").src = "../res/title/title" + next + ".png";
	    window.setTimeout(() => this.nextFrame(next + 1), 200);
	}
    }
};



var intro = new IntroView();
intro.main();
var app = new MainApp();
app.init();
