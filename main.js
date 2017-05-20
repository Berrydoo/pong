/**
 * Created by jdewberry on 5/11/17.
 */

var canvas, 
    canvasContext,
    ballX = 50, 
    ballY = 50,
    ballSpeedX = 10,
    ballSpeedY = getRandomBallSpeedY(),
    paddle1Y = 250,
    paddle2Y = 250,
    scoreLeft = 0, 
    scoreRight = 0,
    showingWinScreen = false;

    const BALL_RADIUS = 10;
    const PADDLE_HEIGHT = 100;
    const PADDLE_WIDTH = 10;
    const WINNING_SCORE = 3;

window.onload = () => {
    canvas = document.querySelector("#gameCanvas");
    canvasContext = canvas.getContext("2d");

    canvas.addEventListener('click', handleMouseClick);

    canvas.addEventListener('mousemove', function(evt){
        paddle1Y = calculateMousePos(evt).y - (PADDLE_HEIGHT / 2);
        //paddle2Y = calculateMousePos(evt).y - (PADDLE_HEIGHT / 2);
    });

    ballX = canvas.width/2;
    ballY = canvas.height/2;

    var framesPerSecond = 30;
    setInterval(
        function(){ 
            moveEverything(); 
            drawEverything(); },
        1000 / framesPerSecond );

    var computerMovesPerSecond = 25;
    setInterval( 
        computerMovement, 
        1000/computerMovesPerSecond);
};

function moveEverything(){

    if( showingWinScreen ){
        return;
    }

    ballX += ballSpeedX;

    // left side
    if ( ballX < 0 + BALL_RADIUS + PADDLE_WIDTH) {
        if ( ballY  > paddle1Y && 
             ballY < (paddle1Y + PADDLE_HEIGHT) ){
                ballSpeedX = -ballSpeedX;
                ballSpeedY = (ballY - (paddle1Y+PADDLE_HEIGHT/2))*0.35;
        } else {
                scoreRight++;
                resetBall();
        }
    }

    // right side
    if ( ballX > (canvas.width - PADDLE_WIDTH - BALL_RADIUS)  ){
        if ( ballY  > paddle2Y && 
             ballY < (paddle2Y + PADDLE_HEIGHT) ){
                ballSpeedX = -ballSpeedX;
                ballSpeedY = (ballY - (paddle2Y+PADDLE_HEIGHT/2))*0.35;
        } else {
                scoreLeft++;
                resetBall();
        }
    }

    // top and bottom
    ballY += ballSpeedY;
    if ( ballY > (canvas.height - BALL_RADIUS) || 
            ballY < 0 + BALL_RADIUS ){
        ballSpeedY = -ballSpeedY;
    } 

}

function drawNet(){
    for( var i = 0; i < canvas.height; i += 40){
        colorRect( canvas.width/2 - 1, i, 2, 20, 'white');
    }
}

function drawEverything(){

    // canvas
    colorRect( 0, 0, canvas.width, canvas.height, 'black');

    // scores
    canvasContext.fillStyle = 'white';
    canvasContext.fillText(scoreLeft, 100, 100);
    canvasContext.fillText(scoreRight, canvas.width - 100, 100);

    if( showingWinScreen ){
    
        canvasContext.fillText("Click to continue", 350, 500);

        if( scoreLeft >= WINNING_SCORE ){
            canvasContext.fillText("Left Player won!", 350, 200)
        } else if ( scoreRight >= WINNING_SCORE ) {
            canvasContext.fillText("Right Player won!", 350, 200)
        }
        return; 
    } 

    // draw net
    drawNet();
    
    // left paddle
    colorRect( 0, paddle1Y, PADDLE_WIDTH, PADDLE_HEIGHT, 'white');
    // right paddle
    colorRect( canvas.width - PADDLE_WIDTH, paddle2Y, PADDLE_WIDTH, PADDLE_HEIGHT, 'white');

    // ball
    colorCircle( ballX, ballY, BALL_RADIUS, 'white');

}

function colorRect(leftX, topY, width, height, drawColor){
    canvasContext.fillStyle = drawColor;
    canvasContext.fillRect(leftX, topY, width, height);
}

function colorCircle(centerX, centerY, radius, drawColor){
    canvasContext.fillStyle = drawColor;
    canvasContext.beginPath();
    canvasContext.arc( centerX, centerY, radius, 0, Math.PI * 2, true);
    canvasContext.fill();
}

function calculateMousePos( evt ){
    var rect = canvas.getBoundingClientRect(), 
        root = document.documentElement;
    return {
        x: evt.clientX - rect.left - root.scrollLeft,
        y: evt.clientY - rect.top - root.scrollTop
    }; 
}

function resetBall(){

    if( scoreLeft >= WINNING_SCORE || 
        scoreRight >= WINNING_SCORE ){
            showingWinScreen = true;
    }
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = -ballSpeedX;
    ballSpeedY = getRandomBallSpeedY();

}

function getRandomDirectionY(){
    var random =  Math.floor( Math.random() * 10 ) - 5; 
    return random < 1 ? -1 : 1;
}

function getRandomBallSpeedY(){
    return getRandomDirectionY() * (Math.floor( Math.random() * 10) + 1);
}

function computerMovement(){

    if( !showingWinScreen ){
        var paddleCenter = paddle2Y + PADDLE_HEIGHT/2;

        if ( paddleCenter > ballY + 35 ){
            paddle2Y -= 6;
        } else if (paddleCenter < ballY - 35){
            paddle2Y += 6;
        }
    }

}

function handleMouseClick(evt){
    if( showingWinScreen ){
        scoreRight = scoreLeft = 0;
        showingWinScreen = false;
    }
}