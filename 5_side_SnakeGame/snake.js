
		var c, ctx;
		var score=0;
		var GO_LEFT=1, GO_RIGHT=2, GO_UP=3, GO_DOWN=4;
		var SIDE_TOP=1, SIDE_FRONT=2, SIDE_BOTTOM=3, SIDE_LEFT = 4, SIDE_RIGHT = 5;
		var len=310, rowcount=9;
		var tableX=40, tableY;
		document.addEventListener('mousedown', logKey);
			function logKey(e) {
			console.log("X : "+ (e.clientX - 12) + ", Y : "+ (e.clientY - 40));
			}

		var direction=[GO_UP]; //1-left, 2-right, 3-up, 4-down

		var points = [{col:parseInt(rowcount/2), row:rowcount-4, side:SIDE_BOTTOM},
					  {col:parseInt(rowcount/2), row:rowcount-3, side:SIDE_BOTTOM},
					  {col:parseInt(rowcount/2), row:rowcount-2, side:SIDE_BOTTOM},
					  {col:parseInt(rowcount/2), row:rowcount-1, side:SIDE_BOTTOM}];

		// var points = [{row:rowcount-4, col:parseInt(rowcount/2), side:SIDE_BOTTOM},
		// 			  {row:rowcount-3, col:parseInt(rowcount/2), side:SIDE_BOTTOM}, 
		// 			  {row:rowcount-2, col:parseInt(rowcount/2), side:SIDE_BOTTOM}, 
		// 			  {row:rowcount-1, col:parseInt(rowcount/2), side:SIDE_BOTTOM}];
					  //뭘까 이건
					  //[{5,4,3},{6,4,3},{7,4,3},{8,4,3}]
					  //맨처음 맵이 소환되는 위치 ㅇㅎ

		$(document).ready(function()
		{
			c = $("#myCanvas")[0];
			//alert(c);
			ctx = c.getContext("2d");

			//alert("loaded");
			drawTable();//돌아다닐 공간 그림
			drawSnake();//뱀소환
		});

		var pickpoint=null;
		var gameStarted=false;
		var gamePaused=false;
		var skipnext=false;
		var ismodal = false;

		window.addEventListener("keydown", function(e)
		{
			if (ismodal == true)
			{
				if (e.keyCode == 27)
				{
					CloseModal();
				}
				//alert(e.keyCode);
				return;
			}
			else if (gameStarted == false)
			{
				return;
			}
			else if ((gamePaused == true) && (e.keyCode != 80))
			{
				return;
			}
			else if (e.keyCode == 80)
			{
				pauseclick();
			}

			var dir=direction[direction.length-1];//direction의 마지막부분
			//==마지막 입력받은 방향

			if ((e.keyCode == 38) && (dir != GO_DOWN) && (dir != GO_UP))
			{
				direction.push(GO_UP);
				callbackfn();
				skipnext=true;
			}
			else if ((e.keyCode == 40) && (dir != GO_UP) && (dir != GO_DOWN)) 
			{
				direction.push(GO_DOWN);
				callbackfn();
				skipnext=true;
			}
			else if ((e.keyCode == 37) && (dir != GO_RIGHT) && (dir != GO_LEFT)) 
			{
				direction.push(GO_LEFT);
				callbackfn();
				skipnext=true;
			}
			else if ((e.keyCode == 39) && (dir != GO_LEFT) && (dir != GO_RIGHT))
			{
				direction.push(GO_RIGHT);
				callbackfn();
				skipnext=true;
			}
		});

		var bottomPoints1=[];
		var bottomPoints2=[];

		var topPoints1=[];
		var topPoints2=[];

		var frontPoints1=[];
		var frontPoints2=[];

		var leftPoints1=[];
		var leftPoints2=[];

		var rightPoints1=[];
		var rightPoints2=[];

		// var rightPoints1=[];
		// var rightPoints2=[];//전방에 5초간----

		var matrixTop=[];
		var matrixBottom=[];
		var matrixLeft=[];
		var matrixRight=[];

		function clearArrays()
		{
			bottomPoints1=[];
			bottomPoints2=[];
			topPoints1=[];
			topPoints2=[];
			frontPoints1=[];
			frontPoints2=[];

			leftPoints1=[];
			leftPoints2=[];

			rightPoints1=[];
			rightPoints2=[];

			matrixTop=[];
			matrixBottom=[];
			matrixLeft=[];
			matrixRight=[];
		}

		var backgroundcolor = "rgb(230,230,230)";

		function drawTable()
		{

			// first clear the whole canvas
			ctx.clearRect(0,0,c.width,c.height);

			var x = tableX; //(c.width-len)/2;
			var y = (c.height-len)/2;
			tableY=y;
			//alert("x="+x+" y="+y);
			ctx.fillStyle=backgroundcolor;
			ctx.lineWidth=1;
			ctx.strokeStyle="darkblue";
			//ctx.fillRect(x,y,3,3);

			//ctx.moveTo(x,y);
			//ctx.lineTo(x+len,y);
			//ctx.stroke();
			ctx.strokeRect(x,y,len,len);
			ctx.fillRect(x,y,len,len);

			ctx.strokeRect(x+len/4,y+len/4,len/2,len/2);
			//가운데 정사각형 격자
			ctx.moveTo(x,y);
			ctx.lineTo(x+len/4,y+len/4);
			//좌측상단에서 가운데 좌상으로

			ctx.moveTo(x+len,y);
			ctx.lineTo(x+3*len/4,y+len/4);
			//우상에서 중앙 우상으로

			ctx.moveTo(x,y+len);
			ctx.lineTo(x+len/4,y+3*len/4);
			//좌하시작

			ctx.moveTo(x+len,y+len);
			ctx.lineTo(x+3*len/4,y+3*len/4);
			//우하


			//ctx.stroke();

			bottomPoints1.push({x1:x+len/4, y1:y+3*len/4,
								x2:x,		y2:y+len});
			//좌하 중앙,좌하

			bottomPoints2.push({x1:x+len/4,  y1:y+3*len/4,
								x2:x+3*len/4,y2:y+3*len/4});
			//좌하 중앙, 우하 중앙

			//바닥 좌표인듯

			topPoints1.push({x1:x,		y1:y,
							 x2:x+len/4,y2:y+len/4});
			//좌상, 좌상 중앙

			topPoints2.push({x1:x,	  y1:y,
							 x2:x+len,y2:y});
			//좌상, 우상

			//아마 천장 좌표겠지??

			frontPoints1.push({x1:x+len/4,  y1:y+len/4,
							   x2:x+3*len/4,y2:y+len/4});
			//좌상 중앙, 우상 중앙

			frontPoints2.push({x1:x+len/4,y1:y+len/4,
							   x2:x+len/4,y2:y+3*len/4});
			//좌상 중앙, 좌하 중앙
			//뒷면ㅇㅇ

			//와 계산하자!!
			leftPoints2.push({x1:x,  y1:y,
							   x2:x+len/4,y2:y+len/4});
			//좌상,우하
			leftPoints1.push({x1:x,y1:y,
							   x2:x,y2:y+len});
			//좌상, 좌상중앙


			rightPoints2.push({x1:x+3*len/4, y1:y+len/4,
							   x2:x+len,y2:y});
			//우상중앙, 우하중앙
			rightPoints1.push({x1:x+3*len/4,y1:y+len/4,
							   x2:x+3*len/4,y2:y+3*len/4});
			//우상중앙. 우상



			for (i=1;i<rowcount;i++)
			{
				//top side
				x1=x+i*len/rowcount;
				y1=y;
				ctx.moveTo(x1,y1);
				x2=x+len/4+i*len/(2*rowcount);
				y2=y+len/4
				ctx.lineTo(x2,y2);
				topPoints1.push({x1:x1,y1:y1,x2:x2,y2:y2});
				//윗면 위에서 아래로 선그음


				x3=x+i*len/(4*rowcount);
				y3=y+i*len/(4*rowcount);
				ctx.moveTo(x3,y3);
				x4=x+len-i*len/(4*rowcount);
				y4=y+i*len/(4*rowcount);
				ctx.lineTo(x4,y4);
				topPoints2.push({x1:x3,y1:y3,x2:x4,y2:y4});
				//윗면 

				//front side
				x5=x+len/4;
				y5=y+len/4+i*len/(2*rowcount);
				ctx.moveTo(x5,y5);
				x6=x+3*len/4;
				y6=y5;
				ctx.lineTo(x6,y6);
				frontPoints1.push({x1:x5,y1:y5,x2:x6,y2:y6});

				x7=x+len/4+i*len/(2*rowcount);
				y7=y+len/4;
				ctx.moveTo(x7,y7);
				x8=x7;
				y8=y+3*len/4;
				ctx.lineTo(x8,y8);
				frontPoints2.push({x1:x7,y1:y7,x2:x8,y2:y8});

				//bottom side
				x9=x+len/4+i*len/(2*rowcount);
				y9=y+3*len/4;
				ctx.moveTo(x9,y9);
				x10=x+i*len/rowcount;
				y10=y+len;
				ctx.lineTo(x10,y10);
				bottomPoints1.push({x1:x9,y1:y9,x2:x10,y2:y10});

				/*x11=x+i*len/(4*rowcount);
				y11=y+len-i*len/(4*rowcount);
				ctx.moveTo(x11,y11);
				x12=x+len-i*len/(4*rowcount);
				y12=y11;
				ctx.lineTo(x12,y12);*/

				x11=x+len/4-i*len/(4*rowcount);
				y11=y+3*len/4+i*len/(4*rowcount);
				ctx.moveTo(x11,y11);
				x12=x+3*len/4+i*len/(4*rowcount);
				y12=y11;
				ctx.lineTo(x12,y12);
				bottomPoints2.push({x1:x11,y1:y11,x2:x12,y2:y12});


				//left
				x13=x+i*len/(4*rowcount);
				y13=y+i*len/(4*rowcount);
				ctx.moveTo(x13,y13);
				x14=x13;//x+len/4;
				y14=y+len-i*len/(4*rowcount);//y+len/4+i*len/(2*rowcount);
				ctx.lineTo(x14,y14);
				leftPoints1.push({x1:x13,y1:y13,x2:x14,y2:y14});

				x15=x;
				y15=y+i*len/(rowcount);
				ctx.moveTo(x15,y15);
				x16=x+len/4;
				y16=y+len/4+i*len/(2*rowcount);
				ctx.lineTo(x16,y16);
				leftPoints2.push({x1:x15,y1:y15,x2:x16,y2:y16});

				//right
				x17=x+3*len/4;
				y17=y+len/4+i*len/(2*rowcount);
				ctx.moveTo(x17,y17);
				x18=x+len;
				y18=y+i*len/rowcount;
				ctx.lineTo(x18,y18);
				rightPoints2.push({x1:x17,y1:y17,x2:x18,y2:y18});

				x19=x+3*len/4+i*len/(4*rowcount);
				y19=y+len/4-i*len/(4*rowcount);
				ctx.moveTo(x19,y19);
				x20=x19;
				y20=y+3*len/4+i*len/(4*rowcount);
				ctx.lineTo(x20,y20);
				rightPoints1.push({x1:x19,y1:y19,x2:x20,y2:y20});
			}

			topPoints1.push({x1:x+len,y1:y,x2:x+3*len/4,y2:y+len/4});
			topPoints2.push({x1:x+len/4,y1:y+len/4,x2:x+3*len/4,y2:y+len/4});

			bottomPoints1.push({x1:x+3*len/4,y1:y+3*len/4,x2:x+len,y2:y+len});
			bottomPoints2.push({x1:x,y1:y+len,x2:x+len,y2:y+len});

			frontPoints1.push({x1:x+len/4,y1:y+3*len/4,x2:x+3*len/4,y2:y+3*len/4});
			frontPoints2.push({x1:x+3*len/4,y1:y+len/4,x2:x+3*len/4,y2:y+3*len/4});

			leftPoints2.push({x1:x,y1:y+len,x2:x+len/4,y2:y+3*len/4});
			leftPoints1.push({x1:x+len/4,y1:y+len/4,x2:x+len/4,y2:y+3*len/4});

			rightPoints2.push({x1: x+3*len/4, y1: y+3*len/4, x2: x+len, y2: y+len});
			rightPoints1.push({x1: x+len, y1: y, x2: x+len, y2: y+len});

			//마지막 선들

			ctx.stroke();
			//alert(bottomPoints1.length);
			radius=3;
			/*for (i=0;i<bottomPoints1.length;i++)
			{
			//	alert("x1="+bottomPoints1[i].x1+", y1="+bottomPoints1[i].y1+
			//		", x2="+bottomPoints1[i].x2+", y2="+bottomPoints1[i].y2);
				highlightPoint(bottomPoints1[i].x1, bottomPoints1[i].y1);
				highlightPoint(bottomPoints1[i].x2, bottomPoints1[i].y2);
			}*/
			/*for (i=0;i<bottomPoints2.length;i++)
			{
			//	alert("x1="+bottomPoints1[i].x1+", y1="+bottomPoints1[i].y1+
			//		", x2="+bottomPoints1[i].x2+", y2="+bottomPoints1[i].y2);
				ctx.beginPath();
				ctx.arc(bottomPoints2[i].x1, bottomPoints2[i].y1, radius, 0, 2*Math.PI);
				ctx.arc(bottomPoints2[i].x2, bottomPoints2[i].y2, radius, 0, 2*Math.PI);
				ctx.stroke();
			}*/
			/*for (i=0;i<topPoints1.length;i++)
			{
				ctx.beginPath();
				ctx.arc(topPoints1[i].x1, topPoints1[i].y1, radius, 0, 2*Math.PI);
				ctx.arc(topPoints1[i].x2, topPoints1[i].y2, radius, 0, 2*Math.PI);
				ctx.stroke();
			}*/
			/*for (i=0;i<topPoints2.length;i++)
			{
				ctx.beginPath();
				ctx.arc(topPoints2[i].x1, topPoints2[i].y1, radius, 0, 2*Math.PI);
				ctx.arc(topPoints2[i].x2, topPoints2[i].y2, radius, 0, 2*Math.PI);
				ctx.stroke();
			}*/
			//for (i=8;i</*frontPoints1.length*/ 9;i++)
			/*{
				//ctx.beginPath();
				//ctx.arc(frontPoints1[i].x1, frontPoints1[i].y1, radius, 0, 2*Math.PI);
				//ctx.arc(frontPoints1[i].x2, frontPoints1[i].y2, radius, 0, 2*Math.PI);
				//ctx.stroke();
				highlightPoint(frontPoints1[i].x1, frontPoints1[i].y1);
				highlightPoint(frontPoints1[i].x2, frontPoints1[i].y2);
			}*/
			/*for (i=0;i<frontPoints2.length;i++)
			{
				//ctx.beginPath();
				//ctx.arc(frontPoints2[i].x1, frontPoints2[i].y1, radius, 0, 2*Math.PI);
				//ctx.arc(frontPoints2[i].x2, frontPoints2[i].y2, radius, 0, 2*Math.PI);
				//ctx.stroke();
				highlightPoint(frontPoints2[i].x1, frontPoints2[i].y1);
				highlightPoint(frontPoints2[i].x2, frontPoints2[i].y2);
			}*/
			//ctx.font="20px Calibri";
			//ctx.strokeText("3Sides Snake", x+len+20, y+5);




			//이거부터 뭔지 모르겠네 ㅁㄴㅇㄹ 아마도 빨간거 만드는 함수인가? 아니네 뱀 좌표표시하는 함수였네 
			//걍 사각형 애들 좌표 집어넣고 계산하는 부분이였음
			for (i=0; i < topPoints2.length; i++)
			{
				var line=[];
				for (j=0; j < topPoints1.length; j++)
				{
					var pt = intersection(topPoints1[j].x1, topPoints1[j].y1,
						topPoints1[j].x2, topPoints1[j].y2,
						topPoints2[i].x1, topPoints2[i].y1,
						topPoints2[i].x2, topPoints2[i].y2);
					//highlightPoint(pt.xint, pt.yint);
					line.push(pt);
				}
				matrixTop.push(line);
			}
			//alert(matrixTop[0].length);
			/*for (i=0; i<matrixTop.length; i++)
			{
				for (j=0; j<matrixTop[i].length; j++)
				{
					if (i==8) highlightPoint2(matrixTop[i][j]);
					//if (i==4) {alert(matrixTop[i][j].xint); }
				}
			}*/

			for (i=0; i < bottomPoints2.length; i++)
			{
				var line=[];
				for (j=0; j < bottomPoints1.length; j++)
				{
					var pt = intersection(bottomPoints1[j].x1, bottomPoints1[j].y1,
						bottomPoints1[j].x2, bottomPoints1[j].y2,
						bottomPoints2[i].x1, bottomPoints2[i].y1,
						bottomPoints2[i].x2, bottomPoints2[i].y2);
					//highlightPoint(pt.xint, pt.yint);
					line.push(pt);
				}
				matrixBottom.push(line);
			}
			/*for (i=0; i<matrixBottom.length; i++)
			{
				for (j=0; j<matrixBottom[i].length; j++)
				{
					if (i==8) 
						highlightPoint2(matrixBottom[i][j]);
					//if (i==4) {alert(matrixTop[i][j].xint); }
				}
			}*/

			for (i=0; i < leftPoints2.length; i++)
			{
				var line=[];
				for (j=0; j < leftPoints1.length; j++)
				{
					var pt = intersection(leftPoints1[j].x1, leftPoints1[j].y1,
						leftPoints1[j].x2, leftPoints1[j].y2,
						leftPoints2[i].x1, leftPoints2[i].y1,
						leftPoints2[i].x2, leftPoints2[i].y2);
					//highlightPoint(pt.xint, pt.yint);
					line.push(pt);
				}
				matrixLeft.push(line);
			}

			for (i=0; i < rightPoints2.length; i++)
			{
				var line=[];
				for (j=0; j < rightPoints1.length; j++)
				{
					// console.log(rightPoints1[j].x1, rightPoints1[j].y1,
					// 	rightPoints1[j].x2, rightPoints1[j].y2,
					// 	rightPoints2[i].x1, rightPoints2[i].y1,
					// 	rightPoints2[i].x2, rightPoints2[i].y2);


					var pt = intersection(rightPoints1[j].x1, rightPoints1[j].y1,
						rightPoints1[j].x2, rightPoints1[j].y2,
						rightPoints2[i].x1, rightPoints2[i].y1,
						rightPoints2[i].x2, rightPoints2[i].y2);
					//highlightPoint(pt.xint, pt.yint);
					line.push(pt);
					// console.log("pt = " + pt.xint, pt.yint);
				}
				matrixRight.push(line);
			}


			eraseScore();
			drawScore();
		}

		function drawPart(part, erase)
		//part=points[i],erase=0;->snake
		//part=pickpoint,erase=2;->redsq
		{
			//alert(part);
			
			if (part.side==SIDE_BOTTOM) // bottom
			{
				x1=matrixBottom[part.row][part.col].xint;
				y1=matrixBottom[part.row][part.col].yint;
				x2=matrixBottom[part.row][part.col+1].xint;
				y2=matrixBottom[part.row][part.col+1].yint;
				x3=matrixBottom[part.row+1][part.col+1].xint;
				y3=matrixBottom[part.row+1][part.col+1].yint;
				x4=matrixBottom[part.row+1][part.col].xint;
				y4=matrixBottom[part.row+1][part.col].yint;
			}
			else if (part.side==SIDE_TOP) // top
			{
				x1=matrixTop[part.row][part.col].xint;
				y1=matrixTop[part.row][part.col].yint;
				x2=matrixTop[part.row][part.col+1].xint;
				y2=matrixTop[part.row][part.col+1].yint;
				x3=matrixTop[part.row+1][part.col+1].xint;
				y3=matrixTop[part.row+1][part.col+1].yint;
				x4=matrixTop[part.row+1][part.col].xint;
				y4=matrixTop[part.row+1][part.col].yint;
			}
			else if (part.side==SIDE_FRONT) // front
			{
				x1=frontPoints2[part.col].x1;
				y1=frontPoints1[part.row].y1;
				x2=frontPoints2[part.col+1].x1;
				y2=y1;
				x3=x2;
				y3=frontPoints1[part.row+1].y1;
				x4=x1;
				y4=y3;
			}
			else if (part.side==SIDE_LEFT) // left
			{
				x1=matrixLeft[part.row][part.col].xint;
				y1=matrixLeft[part.row][part.col].yint;
				x2=matrixLeft[part.row][part.col+1].xint;
				y2=matrixLeft[part.row][part.col+1].yint;
				x3=matrixLeft[part.row+1][part.col+1].xint;
				y3=matrixLeft[part.row+1][part.col+1].yint;
				x4=matrixLeft[part.row+1][part.col].xint;
				y4=matrixLeft[part.row+1][part.col].yint;
			}
			else if (part.side==SIDE_RIGHT) // right
			{
				x1=matrixRight[part.row][part.col].xint;
				y1=matrixRight[part.row][part.col].yint;
				x2=matrixRight[part.row][part.col+1].xint;
				y2=matrixRight[part.row][part.col+1].yint;
				x3=matrixRight[part.row+1][part.col+1].xint;
				y3=matrixRight[part.row+1][part.col+1].yint;
				x4=matrixRight[part.row+1][part.col].xint;
				y4=matrixRight[part.row+1][part.col].yint;
			}
			//alert("x1="+x1+" y1="+y1+", x2="+x2+" y2="+y2+", x3="+x3+" y3="+y3);
		


			ctx.beginPath();
			ctx.moveTo(x1, y1);
			ctx.lineTo(x2, y2);
			ctx.lineTo(x3, y3);
			ctx.lineTo(x4, y4);
			ctx.lineTo(x1, y1);
			if (erase==1) // fill with background color
			{
				ctx.fillStyle=backgroundcolor;
				ctx.strokeStyle="darkblue";
			}
			else if (erase==2) // pick part
			{
				ctx.fillStyle="red";
				ctx.strokeStyle="rgb(240,240,240)";
			}
			else
			{
				ctx.fillStyle="rgb(0,255,0)";
				ctx.strokeStyle="rgb(240,240,240)";
			}
			ctx.fill();
			//if (erase==1)
			ctx.stroke();
			

			ctx.strokeStyle="darkblue";
		}

		function highlightPoint2(pt)
		{
			highlightPoint(pt.xint, pt.yint);
		}

		function highlightPoint(px,py)
		{
			var radius=3;
			ctx.beginPath();
			ctx.arc(px, py, radius, 0, 2*Math.PI);
			ctx.stroke();
		}

		function drawSnake()
		{
			//alert(points.length);
			//alert(points[1].x+", "+points[1].y);
			for (i = 0; i < points.length; i++)//뱀길이만큼 돌림ㅇㅇ
			{
				drawPart(points[i], 0);
			}
			//ctx.stroke();
		}

		function drawScore()
		{
			ctx.font="15px Courier";
			ctx.strokeText("Score: " + score, tableX + len + 20, tableY + 53);
		}

		function eraseScore()
		{
			//ctx.rect(tableX+len+20, tableY+35, 120, 30); ctx.stroke();
			ctx.clearRect(tableX+len+18, tableY+35, 110, 30);
		}

		var timerId, speed;
		function StartGame()
		{
			//var speed;
			var dif = $("#difficulty")[0];
			//alert(dif.value);
			if (dif.value=="easy")
			{
				speed=500;
			}
			else if (dif.value=="moderate")
			{
				speed=200;
			}
			else if (dif.value=="hard")
			{
				speed=100;
			}
			dif.disabled=true;
			var options = $("#optionsbtn")[0];
			options.disabled=true;
			$("#pausebtn")[0].disabled=false;
			$("#startbtn")[0].value="Restart";

			timerId = setInterval(callbackfn, speed);//아마 이게 시작이였을듯
			gameStarted=true;
		}

		function callbackfn()//계속 호출될거임+방향키 누를떄마다
		{
			if (skipnext == true)
			{
				skipnext=false;
				return;
			}

			//ctx.clearRect(0,0,c.width,c.height);
			var newhead;
			if (direction.length > 1)//direction 길이가 1보다 크면
			{
				direction.shift();//direction[0]을 제거, 대체 왜??
			}//무조건 1보다 크지않나...?

			var dir=direction[0];//진행 방향 받아옴
			console.log("dir = " + dir);
			
			var newcol, newrow, newside;


			if (dir == GO_LEFT) // left
			{
				var head=points[0];
				console.log(head);
				//스네이크의 머리

				newcol=head.col-1;
				newrow=head.row;
				newside = head.side;

				if (head.col==0)//얘가 -이었으면 newcol은 -1인데...?
				{
					//newhead={row:head.row, col:head.col-1, side:head.side};
					//그래서 바꾸네 마지막 x좌표로 //기본 rowcount=9
					if (head.side==SIDE_LEFT)
					{
						newcol = rowcount - 1;
						newside=SIDE_RIGHT;
					}
					else if (head.side==SIDE_RIGHT)
					{
						newcol = rowcount - 1;
						newside=SIDE_FRONT;
					}
					else if (head.side==SIDE_FRONT)
					{
						newcol = rowcount - 1;
						newside=SIDE_LEFT;
					}
					//왼,오,가운데이동은 상관 없음
					//위,아래서 왼쪽 갈때 바꿔야됨
					else if(head.side==Side_TOP){
						console.log(11);
						newside=SIDE_LEFT;
						dir=GO_DOWN;
					}
					else if(head.side == SIDE_BOTTOM){
						newside=SIDE_LEFT;
						dir=GO_UP;
					}
				}
				newhead={col:newcol, row:newrow, side:newside};
				
			}
			else if (dir == GO_UP) // up
			{
				var head=points[0];
				console.log(head);
				newcol=head.col;
				newrow = head.row-1;
				newside=head.side;

				if (head.row==0)//
				{
					newrow=rowcount-1;
					if (head.side==SIDE_BOTTOM)
					{
						newside=SIDE_FRONT;
					}
					else if (head.side==SIDE_FRONT)
					{
						newside=SIDE_TOP;
					}
					else if (head.side==SIDE_TOP)
					{
						newside=SIDE_BOTTOM;
					}

					//newrow=rowcount-1;
				}
				newhead={col:newcol, row:newrow, side:newside};
			}
			else if (dir == GO_RIGHT) // right
			{
				var head=points[0];
				console.log(head);
				newcol=head.col+1;
				newside = head.side;
				newrow = head.row;

				if (head.col==(rowcount-1))
				{
					newcol=0;
					if (head.side==SIDE_RIGHT)
					{
						newside=SIDE_LEFT;
					}
					else if (head.side==SIDE_LEFT)
					{
						newside=SIDE_FRONT;
					}
					else if (head.side==SIDE_FRONT)
					{
						newside=SIDE_RIGHT;
					}
				}
				
				newhead={col:newcol, row:newrow, side:newside};
			}
			else if (dir == GO_DOWN)
			{
				var head=points[0];
				console.log(head);
				newrow=head.row+1;
				newside=head.side;
				newcol=head.col;

				if (head.row==rowcount-1)
				{
					newrow=0;
					if (head.side==SIDE_BOTTOM)
					{
						newside=SIDE_TOP;
					}
					else if (head.side==SIDE_FRONT)
					{
						newside=SIDE_BOTTOM;
					}
					else if (head.side==SIDE_TOP)
					{
						newside=SIDE_FRONT;
					}
				}
				newhead={col:newcol, row:newrow, side:newside};
			}

			


			if ((pickpoint == null) || (newhead.row!=pickpoint.row) || 
				(newhead.col!=pickpoint.col) || (newhead.side!=pickpoint.side))

			{//아 조건 드럽게 어렵네 뭔소리지
				// erase tail
				var tail=points.pop();//point 배열에 가장 마지막에 있는 부분을 빼서 tail에 넣음
				drawPart(tail, 1);
			}
			else//ㅂ
			{
				//snake found the brown part
				pickpoint=null;
				score++;
				eraseScore();
				drawScore();
			}
			points.splice(0,0,newhead);
			drawPart(newhead, 0);

			if (pickpoint == null)
			{
				pickpoint=randomGenerate();
				//var x = insideSnake(); alert(x);
				while (insideSnake() == true)
				{
					pickpoint=randomGenerate();
				}
				//alert("randrow="+pickpoint.row+", randcol="+pickpoint.col+
				//	", randside="+pickpoint.side);
				drawPart(pickpoint, 2);
			}

			//check for failure
			for (i=1; i<points.length; i++)
			{
				var crtPoint = points[i];
				if ((crtPoint.row==newhead.row) && (crtPoint.col==newhead.col) && 
					(crtPoint.side==newhead.side))
				{
					// fail
					//alert("Game over. Congratulations! Your score is: "+score);
					ShowModal("Game over. Congratulations! Your score is: "+score);
					RestartGame();
				}
			}

			//drawTable();
		}

		function RestartGame()
		{
			clearInterval(timerId);
			points = [{row:rowcount-4, col:parseInt(rowcount/2), side:SIDE_BOTTOM},
			{row:rowcount-3, col:parseInt(rowcount/2), side:SIDE_BOTTOM}, 
			{row:rowcount-2, col:parseInt(rowcount/2), side:SIDE_BOTTOM}, 
			{row:rowcount-1, col:parseInt(rowcount/2), side:SIDE_BOTTOM}];
			pickpoint=null;
			direction=[GO_UP];
			score=0;

			$("#pausebtn")[0].disabled=true;
			//obj.value="Start";
			$("#startbtn")[0].value="Start";
			$("#difficulty")[0].disabled=false;
			$("#optionsbtn")[0].disabled=false;
			gameStarted=false;

			clearArrays();
			drawTable();
			drawSnake();
		}

		//StartGame();

		function insideSnake()
		{
			var ret = false;
			for (i=0; i<points.length; i++)
			{
				var crtPoint = points[i];
				if ((crtPoint.row==pickpoint.row) && (crtPoint.col==pickpoint.col) && 
					(crtPoint.side==pickpoint.side))
				{
					ret=true;
					break;
				}
			}
			return ret;
		}

		function randomGenerate()
		{
			var randrow=parseInt((Math.random()*100)%rowcount);
			var randcol=parseInt((Math.random()*100)%rowcount);
			//var randside = parseInt((Math.random()*10)%5)+1;
			var randside = 5;
			switch(randside){
				case 1:
				console.log("randside : top");
				break;

				case 2:
				console.log("randside : front");
				break;

				case 3:
				console.log("randside : bottom");
				break;

				case 4:
				console.log("randside : left");
				break;

				case 5:
				console.log("randside : right");
				break;
			}
			console.log("randrow : " + randrow);
			console.log("randcol : " + randcol);
			return {row:randrow, col:randcol, side:randside};
		}

		function intersection(x1,y1,x2,y2,x3,y3,x4,y4)
		{
			var xr, yr;

			if (x2==x1)
			{
				xr=x1;
				yr=(y4-y3)*(x1-x3)/(x4-x3) + y3;
			}
			else if (x3==x4)
			{
				xr=x3;
				yr=(y2-y1)*(x3-x1)/(x2-x1) + y1;
			}
			else
			{
				xr=(x1*(y2-y1)/(x2-x1)-x3*(y4-y3)/(x4-x3)+y3-y1)/((y2-y1)/(x2-x1)-(y4-y3)/(x4-x3));
				yr=(y2-y1)*(xr-x1)/(x2-x1)+y1;
			}
			return {xint:xr,yint:yr};
		}

		function pauseclick()
		{
			if (gameStarted==false)
			{
				return;
			}
			//alert(x);
			var pausebtn = $("#pausebtn")[0];
			if (pausebtn.value=="Pause")
			{
				gamePaused=true;
				clearInterval(timerId);
				pausebtn.value="Resume";
				ctx.font="14px Courier";
				ctx.strokeText("Paused", tableX+len+20, tableY+30);
			}
			else if (pausebtn.value=="Resume")
			{
				gamePaused=false;
				//StartGame();
				timerId = setInterval(callbackfn, speed);
				pausebtn.value="Pause";
				ctx.clearRect(tableX+len+18, tableY+12, 60, 30);
			}
		}

		

		

		function startclick(obj)
		{
			if (obj.value=="Start")
			{
				StartGame();
			}
			else if (obj.value=="Restart")
			{
				RestartGame();

				if (gamePaused==true)
				{
					$("#pausebtn")[0].value="Pause";
					ctx.clearRect(tableX+len+20, tableY+10, 60, 30);
					gamePaused=false;
				}
			}
		}
		function optionsclick()
		{
			var rows = prompt("Enter number of columns: ", rowcount);
			var isnumber = parseInt(rows)||0;
			//alert(isnumber);
			if (isnumber != 0)
			{
				//alert("is integer");
				rowcount = parseInt(rows);
				points = [{row:rowcount-4, col:parseInt(rowcount/2), side:SIDE_BOTTOM},
				{row:rowcount-3, col:parseInt(rowcount/2), side:SIDE_BOTTOM}, 
				{row:rowcount-2, col:parseInt(rowcount/2), side:SIDE_BOTTOM}, 
				{row:rowcount-1, col:parseInt(rowcount/2), side:SIDE_BOTTOM}];

				clearArrays();
				drawTable();
				drawSnake();

				RestartGame();
			}
		}