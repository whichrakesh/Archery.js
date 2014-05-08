

function mod( x, y) //calculates and return distance between two points
{
	return Math.sqrt(x*x+y*y);
}
double projectile(Polygon &arrow,double v,double angle, double acc,double x,double y)  //gives projectile motion to the arrow and returns y coordinate
{
	var vx=v*Math.cosine(angle);
	var vy=v*Math.sine(angle);
	while(x<=900-90*Math.cosine(angle))
	{
		vy+=acc;
		arrow.move(vx,vy);
		arrow.right(180*Math.atan(acc/vx)/PI);
		angle+=180*Math.atan(acc/vx)/PI;
		x+=vx;
		y+=vy;
		
	}
	return y+90*Math.sine(angle);
}
function setscore(yend) //returns points earned after each shot
{
	var point=0;
	if (abs(yend-ycoord)<25)
		point=50;
	else
		if(abs(yend-ycoord)<50)
			point=40;
		else
		if(abs(yend-ycoord)<75)
			point=30;
		else
			if(abs(yend-ycoord)<100)
				point=20;
			else
				if(abs(yend-ycoord)<125)
					point=10;
				else
					if(abs(yend-ycoord)<150)
						point=0;
					else
						point=-10;
						
	return point;
};
function game()
{
		var v=0,x,y,angle=0,acc=0.98,point=0,angle1=0;
		var score=0;
		Line l(900,0,900,700);
		l.imprint();
		Circle c[6];
		Rectangle r1[6];
		Text t[6];
		for(int i=0;i<6;i++)// Making of archery board in front view and in side view with 6  circles
		{
			c[i].reset(0,0,0);
			r1[i].reset(0,0,0);
			t[i].reset(0,0,0);
		}
		Rectangle r(650,350,1300,700);
		r.setColor(COLOR(200,247,97));
		r.setFill(1);
		r.imprint();
		r.reset(0,0,0,0);
		color c1={253,140,57};
		button back(1278,10,40,20,"back",c1);//Back button to come back to home page
		Text(1100,50,"score:").imprint();
		Text printscore(1150,50,score);
		Text(1100,80,"gravity:").imprint();
		Text gravity(1150,80,acc*100);
		Text _score(550,350,"chances left:");
		Text scoreNow(600,350,chance);
		wait(1);
		_score.hide();
		scoreNow.hide();
		if(level==0)
		{
			Circle cir;
			Text t1;
			for(int i=0;i<6;i++)
			{
			cir.reset(1100,350,150-25*i);
			cir.setColor(COLOR(242*(5-i)%255,141*(5-i)%255,42*(5-i)%255));
			cir.setFill(1);
			cir.imprint();
			r.reset(888+2*i,350,24-4*i,50+50*i);
			r.setColor(COLOR(242*i%255,141*i%255,42*i%255));
			r.setFill(1);
			r.imprint();
			t1.reset(910,340-i*25,50-i*10);
			t1.setColor(COLOR(255,0,0));
			t1.setFill(1);
			t1.imprint();
			}
			cir.reset(0,0,0);
		}
		if(level==1)
		for(int i=0;i<6;i++)// Making of archery board in front view and in side view with 6  circles

		{
			c[i].reset(1100,350,150-25*i);
			c[i].setColor(COLOR(242*(5-i)%255,141*(5-i)%255,42*(5-i)%255));
			c[i].setFill(1);
			r1[i].reset(888+2*i,350,24-4*i,50+50*i);
			r1[i].setColor(COLOR(242*i%255,141*i%255,42*i%255));
			r1[i].setFill(1);
			t[i].reset(910,340-i*25,50-i*10);
			t[i].setColor(COLOR(255,0,0));
			t[i].setFill(1);
		}
		double arrow_coord[10][2]={{80,2.5},{80,5},{90,0},{80,-5},{80,-2.5},{5,-2.5},{-5,-5},{0,0},{-5,5},{5,2.5}};// Initialise arrow coordinates
		double bow_coord[][2]={{0,0},{0,100},{15,86},{30,67},{40,49},{50,0},{40,-49},{30,-67},{15,-86},{0,-100}};// Initialise bow coorinates
		XEvent event;
		double arrowx=70,arrowy=350;
		double bow_fixed[10][2];
		for(int i=0;i<10;i++)
		{
			bow_fixed[i][0]=bow_coord[i][0];
			bow_fixed[i][1]=bow_coord[i][1];
		}
		Polygon arrow(arrowx,arrowy,arrow_coord,10);
		Polygon bow(70,350,bow_coord,10);
		arrow.setColor(COLOR(130,130,130));
		arrow.setFill(1);
		int z=0;
		while(1)
		{	
			if(z==0)
			{
				if(level==1)
				{ 
					ycoord=(int)randuv(300,500);
					for(int i=0;i<6;i++)
					{
						c[i].moveTo(1100,ycoord);
						r1[i].moveTo(888+2*i,ycoord);
						t[i].moveTo(910,ycoord-10-i*25);
					}
				}
			z=1;
			}
		nextEvent(&event);
		if(mouseButtonPressEvent(&event)&&z==1)//To select the end point of arrow to stretch the thread
		{
			z=0;
			if(back.inside(65536*event.xbutton.x+event.xbutton.y))
			{
				closeCanvas();
				home();
				break;
			}
			if(event.xbutton.x>65&&event.xbutton.x<75&&event.xbutton.y>345&&event.xbutton.y<355)
			{ 
				while(1)
				{
					nextEvent(&event);
					if(mouseDragEvent(&event))// to drag the  arrow
					{	
						x=event.xmotion.x;
						y=event.xmotion.y;
						if(x<70&&x>35&&y>325&&y<375)
						{	
							arrow.moveTo(x,y);
							bow_fixed[0][0]=-mod(x-70,y-350);
							v=0.5*mod(x-70,y-350);//initial velocity proportional to stretch of bow's thread;
							angle=180*atan((y-350)/(x-70))/PI;
							for(int i=0;i<10;i++)
							{
								bow_coord[i][0]=bow_fixed[i][0]*cosine(angle)-bow_fixed[i][1]*sine(angle);//to change bow coordinate for rotation
								bow_coord[i][1]=bow_fixed[i][1]*cosine(angle)+bow_fixed[i][0]*sine(angle);
							}
							bow.reset(70,350,bow_coord,10);
							arrow.right(angle-angle1);
							angle1=angle;
						}
					}
					if(mouseButtonReleaseEvent(&event))// Release mouse button for start of projectile motion
					{
						bow_fixed[0][0]=0;
						bow.reset(70,350,bow_fixed,10);
						y=projectile(arrow,v,angle,acc,x,y);
						point=setscore(y);
						if(point>=0)
							score+=point;
						else 
						{ 
							chance--;
							chanceshow=1;
						}
						if(chance==0)
						{
							wait(1);
							closeCanvas();
							end(score);
							return;
						}
						if(chanceshow==1)
						{	_score.reset(550,350,"chances left:");
							_score.show();
							scoreNow.reset(600,350,chance);
							scoreNow.show();
							printscore.reset(1150,50,score);
							chanceshow=0;
						}	
						else
						{
							_score.reset(550,350,"score +");
							_score.show();
							scoreNow.reset(590,350,point);
							scoreNow.show();
							printscore.reset(1150,50,score);
						}
						if(level==0)
						{
							if(y>325&&y<375)
								cross(y,1);
							else
								if(y>200&&y<500)
									cross(y,0);
						}
								wait(2);
						_score.hide();
						scoreNow.hide();
						break;
					}
				}
				arrow.reset(arrowx,arrowy,arrow_coord,10);
				arrow.setColor(COLOR(130,130,130));
				arrow.setFill(1);
				angle1=0;
				acc=randuv(0,0.3);
				gravity.reset(1150,80,acc*100);
			}	

		}	

	}	
		getClick();
		closeCanvas();
}



