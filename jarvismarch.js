

let JarvisMarch = (function (){
    // let points;
    let hullPoints;
    let currHullIndex;
    let pointIndex;
    // let run;
    let bestAngle;
    let angle;
    let bestPoint;
    // let fr = 30;
    let prevPt;

    function JarvisMarch(points){
        this.points = points;
        this.numPts = points.length;
        hullPoints = [];
        //Initialize globals
        currHullIndex = 0;
        pointIndex = 0;
        bestAngle = 0;
        bestPoint = -1;

        

    }

    JarvisMarch.prototype.run =  function(){

        if(hullPoints.length==0){
            let left = leftMost();
            hullPoints.push(points[left]);
        }
        //This will draw a black line to the current best point that
        // can be added to CH
        if(bestPoint > -1){
            let p1 = hullPoints[hullPoints.length-1];
            let p2 = this.points[bestPoint];
            strokeWeight(3)
            stroke("black");
            line(p1.xCoor, p1.yCoor, p2.xCoor, p2.yCoor);
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
            prevPt = new Point(hullPoints[currHullIndex-1].xCoor, hullPoints[currHullIndex-1].yCoor);
        }

        angle = getAngle(prevPt, hullPoints[currHullIndex], this.points[pointIndex]);

        if(angle > bestAngle){
            bestAngle = angle;
            bestPoint = pointIndex;
        }
        
        pointIndex++;
        //Check we reached the end of the points list
        if(pointIndex >= this.points.length){

            //add the next best point to the boundary of the CH
            hullPoints.push(this.points[bestPoint]);

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

    JarvisMarch.prototype.displayHull = function(){
        if(hullPoints.length > 1){
            for(let i = 1; i < hullPoints.length; i++){
                let p1 = hullPoints[i-1];
                let p2 = hullPoints[i];

                strokeWeight(3);
                stroke("orange");
                line(p1.xCoor, p1.yCoor, p2.xCoor, p2.yCoor);
                stroke("#253494");
            }
        }
    }

    JarvisMarch.prototype.drawPoints = function(){
        for(let i=0; i < this.points[i]; i++){
            this.points[i].display();
        }
    } 

    /******************************
     *  Private Methods
     ******************************/

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
        stroke("#253494");
        strokeWeight(1);

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
    return JarvisMarch;
})();