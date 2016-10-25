var canvas = null;
var context = null;

class GameObject {
  constructor(src) {
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
    this.image = new Image();


    //화살표 함수와 아닌거의 차이
    //function()에서의 this는 addEventListener의 this
    //() =>에서의 this는 바깥의 this
    this.image.addEventListener('load', () => {
      this.width = this.image.width;  //여기서 this는 바깥의 this와 같음
      this.height = this.image.height;
    });
    this.image.src = src;
  }
}

//extends <=확장하다
//상속한다는거임
class Ball extends GameObject {
  constructor(){
    super('image/ball.png')

      this.speed = {x:-1,y:-39}
  }
}

var clicked = false;
var ball;

var gameObjectList = [];
var ballList = [];
var brickList = [];

function init() {
  canvas = document.getElementById('gameCanvas');
  context = canvas.getContext('2d');

  create('brick', 200, 50);
  ball = create('ball', 240, 200);

  requestAnimationFrame(update);
}

function update() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  for (let o of gameObjectList) {
    context.drawImage(o.image, o.x, o.y);
  }

  for (let ball of ballList) {
    for (let brick of brickList) {
      //AABB충돌 체크
      if(brick.x + brick.width > ball.x &&
        brick.x < ball.x + ball.width &&
        brick.y + brick.height > ball.y &&
        brick.y < ball.y + ball.height
      ) {
          //여기 연구해보기
          //세상엔 능력자가 참 많다.
          let collisionX = Math.max(ball.x, brick.x);
          let collisionY = Math.max(ball.y, brick.y);
          let collisionWidth = Math.min(ball.x + ball.width, brick.x + brick.width) - collisionX;
          let collisionHeight = Math.min(ball.y + ball.height, brick.y+brick.height) - collisionY;

          if(collisionHeight > collisionWidth)
            ball.speed.x *=-1;
          else
            ball.speed.y *=-1;

        // if((brick.x+brick.width+0.1>ball.x&&brick.x+brick.width+0.1<ball.x+ball.width
        //    || brick.x-0.1<ball.x+ball.width && brick.x-0.1>ball.x)&&
        //  !(brick.y+brick.height+0.1>ball.y&&brick.y+brick.height+0.1<ball.y+ball.height
        //     || brick.y-0.1<ball.y+ball.height && brick.y-0.1>ball.y))
        // {
        //   ball.speed.x*=-1;
        //   console.log("asdf");
        // }
        // else
        // {
        //   ball.speed.y*=-1;
        //     console.log("fdsa");
        // }

      }
      //눌렸을 때 체크
      if(clicked){
        ball.x += ball.speed.x;
        ball.y += ball.speed.y;
      }

      //벽 충돌체크
      if(ball.x< 0||ball.x+ball.width>canvas.width)
        ball.speed.x *=-1;
      else if(ball.y<0||ball.y+ball.height>canvas.height)
        ball.speed.y *=-1;
    }
  }

  requestAnimationFrame(update);
}

function create(id, x, y) {
  let ret;

  switch (id) {
    case 'brick':
      ret = new GameObject('image/brick.png');
      brickList.push(ret);
      break;
    case 'ball':
      ret = new Ball();
      ballList.push(ret);
      break;
    default:
      return null;
  }

  ret.x = x;
  ret.y = y;
  gameObjectList.push(ret);

  return ret;
}

function onClick() {
  clicked = true;
}

window.addEventListener('click', onClick);
window.addEventListener('load', init);
