var canv = document.getElementById("myCanvas");
var printinput = document.getElementById("value");

let grid, score, flipGrid,len,compares;
function setup() {  // initialize 
    score = 0;
    grid = [
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0]
    ];
    compares = [
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0]
    ];
    checksum = grid;  // grid checksum ;
    moveCounter = 0;
    addNumber();      // random value 추가 
    addNumber();
    draw();
}
function addNumber() {
    let options = [];

    for(let i=0;i<4;i++) {
        for(let j=0;j<4;j++) {
            if(grid[i][j] === 0) {
                options.push({
                    x : i,
                    y : j
                });
            }
        }
    }
    len = options.length;
    if(len > 0) {
        let positions;        
        positions = Math.floor(Math.random()*options.length);
        grid[options[positions].x][options[positions].y] = Math.random() < 0.9 ? 2 : 4;
    } 
}
function draw() {
    canv.width="2000";
    canv.height="2000";

    var canvs = canv.getContext("2d");
    let i,j;

    for(i=0;i<4;i++) {
        for(j=0;j<4;j++) {
            canvs.beginPath();
            canvs.rect(20+(120*j), 20+(120*i), 120, 120);
            canvs.strokeStyle = "rgba(100, 100, 255, 0.5)";
            canvs.stroke();
            canvs.closePath();

            if(grid[i][j] !== 0) {
                canvs.font = "40px Arial";
                canvs.strokeText(grid[i][j],60+(120*j),80+(120*i));
            }
        }
    }
}
function movs(values){
    let tmp = score;
    for(i=0;i<4;i++) {
        for(j=0;j<4;j++){
            compares[i][j] = grid[i][j];
        }
    }

    if(values < 2) {
        flip();
        if(values === 0) {
            for(i=0;i<4;i++)
                flipGrid[i] = leftSlides(flipGrid[i])
            leftCombine(flipGrid);
        } else {
            for(i=0;i<4;i++){
                flipGrid[i] = rightSlides(flipGrid[i]);
            }
            rightCombine(flipGrid);
        }
        reloads();
    } else if( values === 2) {
        for(i=0;i<4;i++){
            grid[i] = rightSlides(grid[i]);
        }
        rightCombine(grid);
    } else if( values === 3) {
        for(i=0;i<4;i++)
            grid[i] = leftSlides(grid[i])
        leftCombine(grid);
    }
    
    if(correct()) {
        draw();
        addNumber();
        draw();
        printinput.innerHTML = 'Score : ' + score;
        
    }
}
// 타일을 왼쪽으로 옮김
function leftSlides(grid) {
    let i,j;
    console.log(grid[0]);
   
    for(j=0;j<4;j++) {
        for(i=1;i<4;i++) {
            if(grid[i-1] === 0) {
                grid[i-1] = grid[i];
                grid[i] = 0;
            }
        }
    }
    return grid;
}
// 타일을 병합하고 빈공간을 채우기 위해 다시 호출하는 부분.
function leftCombine(grid){
    let i,j;

    for(i=0;i<4;i++){
        for(j=1;j<4;j++){
            if(grid[i][j] === grid[i][j-1]) {
                grid[i][j-1] += grid[i][j];
                score += grid[i][j];
                grid[i][j]=0;
            }
        }
        leftSlides(grid[i]);
    }
}
// 타일을 오른쪽으로 옮김
function rightSlides(grid) {
    let i,j;
    
    for(i=0;i<4;i++){
        for(j=2;j>=0;j--) {
            if(grid[j+1] === 0) {
                grid[j+1] = grid[j];
                grid[j]=0;
            }
        }
    }
    return grid;
}
// 타일을 병합하고 빈공간을 채우기 위해 다시 호출하는 부분.
function rightCombine(grid){
    let i,j;

    for(i=0;i<4;i++){
        for(j=2;j>=0;j--){
            if(grid[i][j+1] === grid[i][j]) {
                grid[i][j+1] += grid[i][j];
                score += grid[i][j];
                grid[i][j]=0;
            }
        }
        rightSlides(grid[i]);
    }
}

//grid 를 플립하여 Up 과 Down 무브를 한번에 할수 있도록 하는 함수
function flip(){
    flipGrid = [
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0]
    ];
    for(i=0;i<4;i++){
        for(j=0;j<4;j++){
            flipGrid[j][i] = grid[i][j];
        }
    }
}
//flips grid 를 복구 하는 함수 
function reloads() {
    let i,j;
    for(i=0;i<4;i++){
        for(j=0;j<4;j++){
            grid[i][j] = flipGrid[j][i];
        }
    }
}
// 타일의 이동이 있엇는지 없었는지 감지.
function correct() { 
    let i,j,k;

    for(i=0;i<4;i++){
        for(j=0;j<4;j++){
            if(compares[i][j] !== grid[i][j])
                return true;
        }
    }
    if(len === 1) {  
        addNumber(); // len 은 전 행위의 결과를 가지고 있음으로 len 을 업데이트 시켜주기 위해 호출함.
        if(len === 0) {
            for(k=0;k<4;k++){
                movs(k);
                for(i=0;i<4;i++){
                    for(j=0;j<4;j++){
                        if(compares[i][j] !== grid[i][j])
                            break;
                    }
                } 
                for(i=0;i<4;i++) {
                    for(j=0;j<4;j++){
                        grid[i][j] = compares[i][j] ;
                    }
                    break;        
                }
            }
            if(i==3 && j==3 && k==3) {
                if(compares[i][j] == grid[i][j]) {
                    alert("YOU LOSE! ");
                    setup();
                }
            }
        }
    } else 
        return false;
}
setup();
document.onkeydown = function (event) {
    if (event.keyCode === 38 || event.keyCode === 87) {  // up 
        movs(0);
    } else if (event.keyCode === 40 || event.keyCode === 83) { // down 
        movs(1);
    } else if (event.keyCode === 39 || event.keyCode === 68) { // right
        movs(2);
    } else if (event.keyCode === 37 || event.keyCode === 65) { // left
        movs(3);
    } else if (event.keyCode === 82)
        setup();

}