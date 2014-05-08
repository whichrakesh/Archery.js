// RequestAnimFrame: a browser API for getting smooth animations
window.requestAnimFrame = (function() {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
	function(callback) {
		window.setTimeout(callback, 1000 / 60);
	};
})();

var canvas = document.getElementById('canvas'),
	ctx = canvas.getContext('2d');

var width = 1200,
	height = 600,
	marginX=50,
	marginY=20;

canvas.width = width;
canvas.height = height;

//Variables for game
var fruits = [],
    arrowImage=document.getElementById("arrow"),
    bowImage=document.getElementById("bow"),
    fruitImage=document.getElementById("fruit"),
    treeImage=document.getElementById("tree"),
	image = document.getElementById("sprite"),
	arrow, fruitCount = 10,
	gravity = 0.04,
	onAir=false,
	bowCenterX=100,
	bowCenterY=height/2,
	animloop,closeTime,time,
	menuloop, score = 0,
	fruitsTaken=0,
	text=" ",
	end=false;
var arrowCenterX=bowCenterX,arrowCenterY=bowCenterY;
//Arrow object
var Arrow = function() {
	this.vy = 0;
	this.vx = 0;
	this.width = 80;
	this.height = 20;
    this.angle=0;
	this.x = bowCenterX-30 / 2;
	this.y = bowCenterY-this.height/2;

	//Function to draw it
	this.draw = function() {
		try {
			ctx.save();
			ctx.translate(arrowCenterX,arrowCenterY);
			ctx.rotate(this.angle);
			ctx.drawImage(arrowImage,this.x-arrowCenterX,this.y-arrowCenterY,this.width,this.height);
			ctx.restore();
		} catch (e) {}
	};
};

arrow = new Arrow();
//bow class
var Bow = function() {
	this.width = 30;
	this.height = 200;
    this.angle=0;
	this.x = bowCenterX-this.width / 2;
	this.y = bowCenterY-this.height/2;

	//Function to draw it
	this.draw = function() {
		try {
			ctx.save();
			ctx.translate(this.x+this.width/2,this.y+this.height/2);
			ctx.rotate(this.angle);
			ctx.drawImage(bowImage,-this.width/2,-this.height/2,this.width,this.height);
			ctx.restore();
			ctx.beginPath();
		  ctx.arc(bowCenterX, bowCenterY, 2, 0, 2 * Math.PI, false);
		  ctx.fillStyle = 'green';
		  ctx.fill();
		  ctx.lineWidth = 5;
		  ctx.strokeStyle = '#003300';
		  ctx.stroke();
		} catch (e) {}
	};
};
bow=new Bow();
//fruit class

var Fruit = function(){
	this.width = 35;
	this.height = 35;
	this.vy=0;
	this.falling=false;
	this.type=Math.floor(Math.random()*5);
	do{
		this.x = width*0.67 + Math.random() * (width/3 - this.width);
		this.y = Math.random() * (height - this.height);
	}while((Math.pow((this.x-width*3/4)/(width/6),2)+Math.pow((this.y-height*5/12)/(height/5),2))>1);

	//Function to draw it
	this.draw = function() {
		try {
			ctx.drawImage(fruitImage, 100,this.type*200,200,200,this.x, this.y, this.width, this.height);
		} catch (e) {}
	};
}

for (var i = 0; i < fruitCount; i++) {
	fruits.push(new Fruit());
}

function init() {
	var d = new Date();
	//Function for clearing canvas in each consecutive frame
	time=d.getTime()/1000;
	closeTime=time+50;

	function paintCanvas() {
		ctx.clearRect(0, 0, width, height);
	}

	//arrow related calculations and functions

	function arrowCalc() {//Movement of arrow affected by gravity
		arrowCenterX=arrow.x;
		arrowCenterY=arrow.y+arrow.height/2;
		if(onAir)
		{
			arrow.y += arrow.vy;
			arrow.x +=arrow.vx;
			arrow.vy += gravity;
			arrow.angle=Math.atan(arrow.vy/arrow.vx);
			collides();
			if(arrow.x>width||arrow.y>height||arrow.y<0)
			{
				if(fruitsTaken>1){
					text=fruitsTaken+" fruits taken";
				}
				// alert(fruitsTaken+" fruits taken");
				fruitsTaken=0;
				arrow=new Arrow();
				onAir=false;
			}
		}
	}


	function fruitCalc() {

		fruits.forEach(function(f, i) {
			if(fruits[i].falling){
				fruits[i].y+=fruits[i].vy;
				fruits[i].vy+=gravity;
				if(fruits[i].y>height){
					fruits[i]=new Fruit();
				}
			}
			f.draw();
		});
	}

	function collides() {
		//Fruits
		fruits.forEach(function(fruit, i) {
			if (fruit.falling==false&&Math.abs(arrow.x+arrow.width*Math.cos(arrow.angle)-fruit.x)<=fruit.width/2 && Math.abs(arrow.y+arrow.width*Math.sin(arrow.angle)-fruit.y)<=fruit.height/2 ) {
				fruits[i].falling=true;
				fruitsTaken++;
				score+=10;
				if(fruitsTaken>1)
					closeTime+=5;
				}	
			});
     }
     function drawtext(){
		ctx.font="30px Gloria Hallelujah";
		ctx.fillText(text,400,300);
	}

	function updateScore() {
		var scoreText = document.getElementById("score");
		scoreText.innerHTML = score;
		var timeText = document.getElementById("time");
		timeText.innerHTML = Math.floor(closeTime-time);
	}
	function updateTime(){
		d = new Date();
		time=d.getTime()/1000;
		if(closeTime<time){
			gameOver();
		}
	}

	function gameOver() {
			end=true;
			showGoMenu();
			hideScore();
			var tweet = document.getElementById("tweetBtn");
			tweet.href='http://twitter.com/share?url=http://is.gd/FCj74T&text=I just scored ' +score+ ' points in the HTML5 Archery game!&count=horiztonal&via=cssdeck&related=solitarydesigns';
		
			var facebook = document.getElementById("fbBtn");
			facebook.href='http://facebook.com/sharer.php?s=100&p[url]=http://www.cse.iitb.ac.in/~rakeshranjan/try/test.html&p[title]=I just scored ' +score+ ' points in the HTML5 Archery!&p[summary]=Can you beat me in this awesome recreation of Archery game created in HTML5?';
	}
    function drawTree(){
    ctx.drawImage(treeImage,width/2,0,width/2,height);
	}
	//Function to update everything

	function update() {
			paintCanvas();
			if(!end)
			{
				updateTime();
				drawTree();
				fruitCalc();
				bow.draw();
				arrowCalc();
				arrow.draw();
				drawtext();
				updateScore();
			}
	}

	menuLoop = function(){return;};
	animloop = function() {
		update();
		requestAnimFrame(animloop);
	};

	animloop();
	hideMenu();
	showScore();
}

function reset() {
	end=false;
	hideGoMenu();
	score = 0;
	text=" ";
	showScore();	
	arrow = new Arrow();
	onAir=false;
	var d=new Date();
	time=d.getTime()/1000;
	closeTime=time+50;
	fruits = [];
	for (var i = 0; i < fruitCount; i++) {
		fruits.push(new Fruit());
	}
}

//Hides the menu
function hideMenu() {
	var menu = document.getElementById("mainMenu");
	menu.style.zIndex = -1;
}

//Shows the game over menu
function showGoMenu() {
	var menu = document.getElementById("gameOverMenu");
	menu.style.zIndex = 1;
	menu.style.visibility = "visible";

	var scoreText = document.getElementById("go_score");
	scoreText.innerHTML = "You scored " + score + " points!";
}

//Hides the game over menu
function hideGoMenu() {
	var menu = document.getElementById("gameOverMenu");
	menu.style.zIndex = -1;
	menu.style.visibility = "hidden";
}

//Show ScoreBoard
function showScore() {
	var menu = document.getElementById("scoreBoard");
	menu.style.zIndex = 1;
}

//Hide ScoreBoard
function hideScore() {
	var menu = document.getElementById("scoreBoard");
	menu.style.zIndex = -1;
}
function update() {
	ctx.clearRect(0, 0, width, height);
}		

menuLoop = function() {
	update();
	requestAnimFrame(menuLoop);
};

menuLoop();
canvas.addEventListener('mousedown',doMouseDown,false);
function doMouseDown(event){
	//alert(event.pageX+':'+event.pageY);
	if(Math.abs(event.pageX-marginX-arrow.x)<=arrow.width && Math.abs(event.pageY-marginY-arrow.y)<=arrow.height && onAir==false)
	{	
		text=" ";
		document.onmousemove=function(e)
		{
			arrow.x=e.pageX-marginX;
			arrow.y=e.pageY-marginY;
			var pointX=arrow.x,pointY=arrow.y+arrow.height/2;
			bow.angle=arrow.angle=Math.atan((bowCenterY-pointY)/(bowCenterX-pointX));
			if(arrow.vx<8){
				arrow.vx=0.2*(bowCenterX-pointX);
				arrow.vy=0.2*(bowCenterY-pointY);
			}
		}
		document.onmouseup=function()
		{
			onAir=true;
			bow.angle=0;
			document.onmousemove=null;
		}
	}	
}
