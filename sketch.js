/**
 * Authur: Carlos Carbajal
 */
let points;
let hullPoints;

let fr = 60;

function setup(){
    createCanvas(1200, 700);
    frameRate(fr);
    points = generatePoints();
    hullPoints = new JarvisMarch(points);
    

    //Create buttons to be used.
    setUpButtons();
}

function draw(){
    background('#ffffcc');
    
    //draw each point
    for(let i=0; i < points.length; i++){
        points[i].display();
    }
    
    strokeWeight(1);

    if(run){
        hullPoints.run();
    }
    hullPoints.displayHull();   
}

/**
 * generatePoints()
 * 
 * Description: Autogenerate random set of points. Offsets by 10 pixels
 *          from each side of the window.
 * 
 */
function generatePoints(){
    let results = [];
    for(let i = 0; i < 300; i++){
        results.push(new Point(random(10,1190), random(10,690)));
    }
    run = false;
    return results;
}

function setUpButtons(){
    startPauseButton = createButton("Start/Pause");
    startPauseButton.class("btn btn-primary");
    startPauseButton.mousePressed(function(){
        run = !run;
    });

    resetButton = createButton("Reset");
    resetButton.class("btn btn-primary");    
    resetButton.mousePressed(function(){
        points = [];
        hullPoints = [];
        
        points = generatePoints();
        hullPoints = new JarvisMarch(points);

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
}