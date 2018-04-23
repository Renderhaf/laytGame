class Player{
  constructor(x,y,size,color){
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
    this.dir = [0,0];

    //Adjustment Vars
    this.friction = 0.9;
    this.RPS = 1000;
    this.shotSpeed = 10;
    //End AV
  }
  angRect(a){
    ctx.save();
    ctx.translate(this.x+this.size/2,this.y+this.size/2);
    ctx.rotate(a);
    ctx.fillRect(-1*this.size/2,-1*this.size/2,this.size,this.size);
    ctx.restore();
  }
  XYtoAng(x,y){
    return Math.atan2(y,x);
  }
  addSpeed(dir){
    this.dir[0] += dir[0];
    this.dir[1] += dir[1];
  }
  update(){
    this.x += this.dir[0];
    this.y += this.dir[1];

    this.dir[0] = this.dir[0] * this.friction;
    this.dir[1] = this.dir[1] * this.friction;
  }
  oob(w,b){
    if (this.x<0){this.x = 0}//left
    if (this.x+this.size>w){this.x = w-this.size}//right
    if (this.y<0){this.y = 0}//up
    if (this.y+this.size>h){this.y = h-this.size}//down
  }
}
