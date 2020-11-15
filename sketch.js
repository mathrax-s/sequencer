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
let last_timer = 0;
let t = 0;

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
      snw[y*16+x].display();

      if(x === seq_x){
        btn[y*16+x].check_play(7-y);
        if(btn[y*16+x].st==1){
          snw[y*16+x].start();
        }
      }
    }
  }
  t*=0.99;
  stroke(100,100,100,100*t);
  strokeWeight(4);
	line(seq_x*(w/16)+(w/16)/2, 0, seq_x*(w/16)+(w/16)/2,height);
  
  let now_timer = millis();
	if(now_timer>= last_timer+250){
		seq_x ++;
		if(seq_x>=16){
      seq_x=0;
      for(let y=0; y<8; y++){
        for(let x=0; x<16;x++){
          btn[y*16+x].reset_st();
        }
      }
    }
    last_timer = now_timer;
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
        btn[y*16+x].change_color(200,100,150);
			}else{
				btn[y*16+x].change_color(10,100,150);
			}
		}
  }
}
function mouseMoved(){
	for(let y=0; y<8; y++){
    for(let x=0; x<16;x++){
				btn[y*16+x].t = 1.0;
		}
  }
  t=1.0;
}

class Snow {
  constructor(x_,y_){
    this.x = x_;
    this.y = y_;
    this.s = 0;
    this.st = 0;
  }
  start(){
    if(this.st==0){
      this.s = random();
      this.st = 1;
    }
  }
  display(){
    angleMode(DEGREES);
    this.s *= 0.99;
    if(this.s<0.1)this.st = 0;
    push();
    translate(this.x,this.y);
    // scale(this.s);
    rotate(720*this.s);
    noStroke();
    fill(255,255,255,255*this.s);
    ellipse(20,0,200*(this.s),10*(this.s));
    pop();
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
    this.red = 10;
    this.grn = 100;
    this.blu = 150;
    this.t = 0;
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
  change_color(r,g,b){
    this.red = r;
    this.grn = g;
    this.blu = b;
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
    this.t *= 0.99;
    fill(this.red,this.grn,this.blu,100*this.t);
    ellipseMode(RADIUS);
    ellipse(this.x, this.y, this.r, this.r);
  }
}