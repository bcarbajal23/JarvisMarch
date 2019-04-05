/**
 * Authur: Carlos Carbajal
 */
let points;
let hullPoints;
let currHullIndex ;
let pointIndex;
let run;
let bestAngle;
let angle;
let bestPoint;
let fr = 60;

function setup(){
    createCanvas(1200, 700);
    frameRate(fr);
    points = [];
    hullPoints = [];
    generatePoints();

    //Create buttons to be used.
    startPauseButton = createButton("Start/Pause");
    startPauseButton.class("btn btn-primary");
    startPauseButton.mousePressed(function(){
        run = !run;
        // console.log(run)
    });

    resetButton = createButton("Reset");
    resetButton.class("btn btn-primary");    
    resetButton.mousePressed(function(){
        points = [];
        hullPoints = [];
        currHullIndex = 0;
        pointIndex=0;
        bestAngle=0;
        angle=0;
        bestPoint = -1;
        generatePoints();

    });

    speedUpButton = createButton("Speed Up");
    speedUpButton.class("btn btn-secondary");
    speedUpButton.mousePressed(function(){
        if(fr==100){
            fr = 100;
        }else{
            fr++;
        }
        frameRate(fr);
    });

    slowdownButton = createButton("Slow Down");
    slowdownButton.class("btn btn-secondary");
    slowdownButton.mousePressed(function(){
        if(fr==10){
            fr = 0;
        }else{
            fr--;
        }
        frameRate(fr);
    });
    //Initialize globals
    currHullIndex = 0;
    pointIndex=0;
    bestAngle=0;
    angle=0;
    bestPoint = -1;
    // run = false;
}

function draw(){
    background('#ffffcc');
    
    //draw each point
    for(let i=0; i < points.length; i++){
        points[i].display();
    }
    
    //Change color of points on the convex hull boundary
    if(hullPoints.length > 1){
        for(let i=1; i < hullPoints.length; i++){
            let p1 = hullPoints[i-1];
            p1.display();
            let p2 = hullPoints[i];
            p2.display();
            strokeWeight(3);
            stroke("#225ea8");
            line(p1.xCoor, p1.yCoor, p2.xCoor, p2.yCoor);
        }
    }
    strokeWeight(1);
    //This will draw a black line to the current best point that
    // can be added to CH
    if(bestPoint >-1){
        let p1 = hullPoints[hullPoints.length-1];
        let p2 = points[bestPoint];
        stroke("black");
        line(p1.xCoor, p1.yCoor, p2.xCoor, p2.yCoor);
    }
    let prevPt;
    if(run){
        //Find the left most point
        if(hullPoints.length == 0){
            let left = leftMost(); // get left most point
            hullPoints.push(points[left]); // add it to the hull array
        }
        /**
         * Check to see if only point exists in boundary of convex hull for
         * angle check
         * 
         * If only one point is in the CH, then create a psuedopoint to check
         *      angle between first point and next
         * Else use previous point and current point to check angle with the rest of 
         *      of the points to find the next point to boundary of CH
         */
        if(currHullIndex == 0){
            prevPt = new Point(hullPoints[currHullIndex].xCoor, 0);
        }else{
            prevPt = new Point(hullPoints[currHullIndex-1].xCoor,hullPoints[currHullIndex-1].yCoor);
        }
        angle = getAngle(prevPt, hullPoints[currHullIndex], points[pointIndex])

        if(angle > bestAngle){
            bestAngle = angle;
            bestPoint = pointIndex;
        }

        pointIndex++;
        //Check we reached the end of the points list
        if(pointIndex >= points.length){
            //add the next best point to the boundary of the CH
            hullPoints.push(points[bestPoint]);
            hullPoints[currHullIndex].setColor("#225ea8");

            //If we've reached back to the starting point terminate the algorithm
            if(hullPoints[0] == hullPoints[hullPoints.length-1]){
                run = !run;
            }

            currHullIndex++;
            //Reset all globals
            pointIndex = 0;
            bestPoint = -1;
            bestAngle = 0;
        }
    }
   
}

/**
 * generatePoints()
 * 
 * Description: Autogenerate random set of points. Offsets by 10 pixels
 *          from each side of the window.
 * 
 */
function generatePoints(){
    for(let i = 0; i < 200; i++){
        points.push(new Point(random(10,1190), random(10,690)));
    }
    run = false;
}

/**
 * getAngle()
 * Description: This function finds the 
 */
function getAngle(prevPt, hullPt, nextPt){
    //Create P5 Vectors that hold points
    let vecH = createVector(hullPt.xCoor, hullPt.yCoor);
    let vecN = createVector(nextPt.xCoor, nextPt.yCoor);
    let vecP = createVector(prevPt.xCoor, prevPt.yCoor);

    //Calculate the distances between all 3 points
    let h = vecN.dist(vecP); 
    let p = vecP.dist(vecH);
    let n = vecH.dist(vecN); 

    /**
     *  Equation to find angle is from Law of Cosine
     *  
     *  c^2 = a^2 + b^2 - 2ab*cos(C)
     * 
     * Draw a line to the current being evaluted
     */
    let sum = pow(h,2) - pow(p,2) - pow(n,2);
    let val = -2 * p * n;
    let localAngle = acos(sum/val);
    stroke(0,0,255);
    line(hullPt.xCoor, hullPt.yCoor, nextPt.xCoor, nextPt.yCoor);  

    return localAngle;
}
/**
 * leftMost()
 * Description: The function finds the left most point in the set of points
 */
function leftMost(){
    let l = 0;
    for(let i =1; i < points.length; i++){
        if(points[i].xCoor < points[l].xCoor){
            l = i;
        }
    }

    points[l].setColor("#1d91c0");
    return l;
}