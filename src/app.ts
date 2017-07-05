module CastleDemoApp {
  "use strict";
  
  declare type AnimCallback =  () => void;
  const FRAME_SPEED = 700;
  enum CaCmd {
    NONE = 0,
    JUMP,
    ATTACK
  }
  const ST_ANIM = 0;
  const ST_FRAMES = 1;
  const ST_CMD = 2;
  const ST_GOOD = 3;
  const ST_BAD = 4;

  var states = [
    [ 'gameover', 2, CaCmd.NONE, -1, -1 ], //0
    [ 'dbwalk', 7, CaCmd.JUMP, 2, 3 ], //1
    [ 'dbwin', 4, CaCmd.JUMP, 4, 5 ], //2
    [ 'dbdeath', 3, CaCmd.NONE, 0, 0 ], //3
    [ 'attack', 4, CaCmd.ATTACK, 6, 7], //4
    [ 'frog', 4, CaCmd.NONE, 0, 0], //5
    [ 'awin', 5, CaCmd.NONE, 0, 0], //6
    [ 'adeath', 5, CaCmd.NONE, 0, 0], //7
    [ '', 0, 0, 0, 0 ]
  ];
  
  class Anim {
    res: string;
    callback: AnimCallback;
    current: number;
    frames: number;
    snd: any;
    timer: number;
    
    constructor () {
      this.snd = new Audio();
      this.timer = null;
    }
    stopAudio():void {
      this.snd.pause();
      this.snd.currentTime = 0;
    }
    playAudio(src:string):void {
      this.stopAudio();
      this.snd.src = "res/"+src+"/audio.mp3";
      this.snd.load();
      this.snd.play();
    }
    init(res: string, frames: number, callback: AnimCallback, mute: boolean = false):void {
      console.log("LOADING NEW ANIM: "+res);
      this.res = res;
      this.frames = frames;
      this.callback = callback;
      
      if (mute) {
	this.stopAudio();
	this.snd.src = "";
	this.snd.load();
      } else {
	this.playAudio(res);
      }
      this.current = 0;
    }
    animate():void {
      console.log("ANIMATE: "+this.res+" / "+this.current+" / "+this.frames);
      if (this.current >= this.frames) {
	this.stopAudio();
	this.callback();
	this.timer = null;
      } else {
	++this.current;
	(<any>document.getElementById("display_img")).src = 'res/' + this.res + "/img" + this.current + ".png";
	this.timer = setTimeout(this.animate.bind(this), FRAME_SPEED);
      }
    }
    stop():void {
      if (this.timer != null) {
	clearTimeout(this.timer);
	this.timer = null;
      }
      this.stopAudio();
      this.frames = 0;
    }
  }
  
  class CastleApp {
    display: Anim;
    cmd: CaCmd;
    scene: number;
    
    constructor () {
      // Initialize my event handlers
      document.getElementById('start_btn').addEventListener('click', this.begin.bind(this), false);
      document.getElementById('attack_btn').addEventListener('click', this.attackCmd.bind(this), false);
      document.getElementById('jump_btn').addEventListener('click', this.jumpCmd.bind(this), false);
      this.display = new Anim();
      this.cmd = CaCmd.NONE;
    }
    title():void {
      document.getElementById('title_control').style.display = "";      
      document.getElementById('player_control').style.display = "none";
      this.animateTitle();
      this.display.playAudio('title');
    }
    animateTitle():void {
      this.display.init('title',6,this.animateTitle.bind(this),true);
      this.display.animate();
    }
    begin():void {
      document.getElementById('player_control').style.display = "";
      document.getElementById('title_control').style.display = "none";
      this.display.stop();
      this.queueScene(1);
    }
    attackCmd():void {
      this.cmd = CaCmd.ATTACK;
    }
    jumpCmd():void {
      this.cmd = CaCmd.JUMP;
    }
    queueScene(scn:number):void {
      if (scn == -1) {
	this.title();
      } else {
	this.scene = scn;
	this.cmd = CaCmd.NONE;
	this.display.init(<string>states[this.scene][ST_ANIM],<number>states[this.scene][ST_FRAMES],this.nextScene.bind(this));
	this.display.animate();
      }
    }
    nextScene():void {
      if (this.cmd == states[this.scene][ST_CMD]) {
	this.queueScene(<number>states[this.scene][ST_GOOD]);
      } else {
	this.queueScene(<number>states[this.scene][ST_BAD]);
      }
    }
  }
  
  export module Application {
    var app : CastleApp;
    
    export function initialize() {
      document.addEventListener('deviceready', onDeviceReady, false);
    }
    function onDeviceReady() {
      // Handle the Cordova pause and resume events
      document.addEventListener('pause', onPause, false);
      document.addEventListener('resume', onResume, false);
      app = new CastleApp();
      app.title();
    }
    function onPause() {
      // TODO: This application has been suspended. Save application state here.
      console.log('************* PAUSE APPLICATION *****************');
    }
    function onResume() {
      // TODO: This application has been reactivated. Restore application state here.
      console.log('************* RESUME APPLICATION *****************');
    }
  };
  window.onload = function() {
    Application.initialize();
  }
}

/*
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
*/
