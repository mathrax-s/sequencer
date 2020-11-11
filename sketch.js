let w,h;
let onkai=[2,4,7,9,11];
let note = [];
let btn=[];
let btn_st=[];
let seq_x=0;
let osc =[];
let env =[];
let frq =[];
let amp =[];
let snw =[];
let data ="";

let queryString = window.location.search;
let queryObject = new Object();
if(queryString){
  queryString = queryString.substring(1);
  let parameters = queryString.split('&');

  for (let i = 0; i < parameters.length; i++) {
    let element = parameters[i].split('=');

    let paramName = decodeURIComponent(element[0]);
    let paramValue = decodeURIComponent(element[1]);

    queryObject[paramName] = paramValue;
  }
  
}

function setup() {
	w = windowWidth;
	h = windowHeight;
	
	let cnv = createCanvas(w, h);
  // cnv.mousePressed(playSound);
  background(100);
  
	for(let y=0; y<8; y++){
    for(let x=0;x<16; x++){
      btn[y*16+x]=new Button(x*(w/16)+(w/16)/2, y*(h/8)+(h/8)/2, w/100);
      snw[y*16+x]=new Snow(x*(w/16)+(w/16)/2, y*(h/8)+(h/8)/2);
		}
	}
	for(let i=0; i<16; i++){
		osc[i] = new p5.Oscillator('sine');
		osc[i].freq(440);
		env[i] = new p5.Envelope();
    env[i].setADSR(0.01, 0.1, 0.2, 0.5);
    env[i].setRange(0.5, 0.0);

    note[i] = 72 + (onkai[i%5]) + (parseInt(i/5) * 12);
	}
  ch=0;
  data = queryObject["data"];
}


function draw() {
	background(0);
	
  for(let y=0; y<8; y++){
    for(let x=0; x<16; x++){
      btn[y*16+x].display(mouseX, mouseY);

      if(x === seq_x){
        btn[y*16+x].check_play(7-y);
      }
    }
  }

  stroke(100);
  strokeWeight(4);
	line(seq_x*(w/16)+(w/16)/2, 0, seq_x*(w/16)+(w/16)/2,height);
	
	if(frameCount%15==0){
		seq_x ++;
		if(seq_x>=16){
      seq_x=0;
      for(let y=0; y<8; y++){
        for(let x=0; x<16;x++){
          btn[y*16+x].reset_st();
          snw[y*16+x].start();
        }
      }
		}
	}
	
	noStroke();
	fill(255,0,0,100);
  ellipse(mouseX,mouseY,10,10);


  
  fill(255);
  text(data,w/2,h/2);
}

function mousePressed(){	
	for(let y=0; y<8; y++){
    for(let x=0; x<16;x++){
			if(btn[y*16+x].click(mouseX, mouseY)){
        btn[y*16+x].change_color(color(200,100,150));
			}else{
				btn[y*16+x].change_color(color(10,100,50));
			}
		}
  }
}

class Snow {
  constructor(x_,y_){
    this.x = x_;
    this.y = y_;
    this.s = 1.0;
  }

  start(){
    this.s = 1.0;
  }
  display(){
    this.s *= 0.99;
    fill(255,255,255,255*s);
    ellipse(this.x,this.y,100);
  }
}

class Button {
  constructor(x_, y_, r_, col_) {
    this.x = x_;
    this.y = y_;
	  this.r = r_;
	  this.st = 0;
    this.col = color(10,100,50);
    this.play = 0;
    this.f = 0;
  }

  contains(mx, my) {
    return dist(mx, my, this.x, this.y) < this.r;
  }

  click(mx, my){
	  if(this.contains(mx,my)){
		  if(this.st === 0){
			  this.st = 1;
		  }else if(this.st === 1){
			  this.st = 0;
		  }
	  }
	  return this.st;
  }
  reset_st(){
    this.play = 0;
  }
  change_color(col){
	  this.col = col;
  }

  set_onkai(nt){
    this.f = note[nt];
    osc[mseqx].freq(this.f);
  }
  check_play(mseqx){
    if(this.st == 1){  
      if(this.play ===0){
        this.play = 1;

        osc[mseqx].freq(midiToFreq(note[mseqx]));
        osc[mseqx].stop();
        osc[mseqx].start();
        env[mseqx].play(osc[mseqx]);
      }
    }else{
      this.play=0;
    }
  }

  display(mx, my) {
	  if (this.contains(mx, my)) {
		  stroke(255);
	  } else {
		  noStroke();
	  }
	  fill(this.col);
    ellipseMode(RADIUS);
    ellipse(this.x, this.y, this.r, this.r);
  }
}