class Shot{
  constructor(x,y,power,ang,speed,dmg){
    this.x = x;
    this.y = y;
    this.power = power;
    this.speed = speed;
    this.damage = dmg;
    this.ang = ang;
    this.dir = [this.speed * Math.cos(this.ang),this.speed * Math.sin(this.ang)]; 
  }
  angRect(){
    ctx.save();
    ctx.translate(this.x+this.power/2,this.y+this.power/2);
    ctx.rotate(this.ang);
    ctx.fillRect(-1*this.power/2,-1*this.power/2,this.power,this.power);
    ctx.restore();
  }
  update(){
    this.x += this.dir[0];
    this.y += this.dir[1];
  }
  oob(w,h){
    if (this.x<0||this.x>w||this.y<0||this.y>h){return true;}
    else{return false;}
  }
}
