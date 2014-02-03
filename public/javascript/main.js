$(document).ready(function(){
    //Canvas stuff
    var canvas = $("#canvas")[0];
    var context = canvas.getContext("2d");
    var w = $("#canvas").width();
    var h = $("#canvas").height();
    
    //Lets save the cell width in a variable for easy control
    var cellWidth = 5;
    var direction; // direction
    var move;
    var food; // location of food
    
    //Lets create the snake now
    var snake_array; //an array of cells to make up the snake
    var smell_array; //a 2x2 array of cells with smell signal strength

    var brain = (function () {
        var my = {},
            signalStrength = 0;

        function privateMethod() {
            // ...
        }

        my.moduleProperty = 1;
        my.moduleMethod = function () {
            // ...
        };

        return my;
    }());
    
    function init()
    {
        direction = "up"; //default direction
        
        create_worm();
        create_food(); //Now we can see the food particle
        //finally lets display the score
        score = 0;
        
        //Lets move the snake now using a timer which will trigger the paint function
        //every 60ms
        if(typeof game_loop != "undefined") clearInterval(game_loop);
        game_loop = setInterval(paint, 60);
    }
    init();
    
    function create_worm()
    {
        var length = 5; //Length of the snake
        snake_array = []; //Empty array to start with
        for(var i = length-1; i>=0; i--)
        {
            //This will create a horizontal snake starting from the top left
            snake_array.push({x: ((w/cellWidth)/2) - 1 , y: (w/cellWidth) - i });
        }
    }
    
    //Lets create the food now
    function create_food()
    {
        food = {
            x: Math.round(Math.random()*(w-cellWidth)/cellWidth), 
            y: Math.round(Math.random()*(h-cellWidth)/cellWidth), 
        };
        //This will create a cell with x/y between 0-44
        //Because there are 45(450/10) positions accross the rows and columns
    }
    
    //Lets paint the snake now
    function paint()
    {
        //To avoid the snake trail we need to paint the BG on every frame
        //Lets paint the canvas now
        context.fillStyle = "white";
        context.fillRect(0, 0, w, h);
        context.strokeStyle = "black";
        context.strokeRect(0, 0, w, h);
        
        //The movement code for the snake to come here.
        //The logic is simple
        //Pop out the tail cell and place it infront of the head cell
        var nx = snake_array[0].x;
        var ny = snake_array[0].y;
        //These were the position of the head cell.
        //We will increment it to get the new head position
        //Lets add proper direction based movement now
        if(direction == "right") nx++;
        else if(direction == "left") nx--;
        else if(direction == "up") ny--;
        else if(direction == "down") ny++;
        
        //Lets add the game over clauses now
        //This will restart the game if the snake hits the wall
        //Lets add the code for body collision
        //Now if the head of the snake bumps into its body, the game will restart
        if(nx == -1 || nx == w/cellWidth || ny == -1 || ny == h/cellWidth || check_collision(nx, ny, snake_array))
        {
            //restart game
            init();
            //Lets organize the code a bit now.
            return;
        }
        
        //Lets write the code to make the snake eat the food
        //The logic is simple
        //If the new head position matches with that of the food,
        //Create a new head instead of moving the tail
        if(nx == food.x && ny == food.y)
        {
            var tail = {x: nx, y: ny};
            score++;
            //Create new food
            create_food();
        }
        else
        {
            var tail = snake_array.pop(); //pops out the last cell
            tail.x = nx; tail.y = ny;
        }
        //The snake can now eat the food.
        
        snake_array.unshift(tail); //puts back the tail as the first cell
        
        for(var i = 0; i < snake_array.length; i++)
        {
            var c = snake_array[i];
            //Lets paint 10px wide cells
            paint_cell(c.x, c.y);
        }
        
        //Lets paint the food
        paint_cell(food.x, food.y);
    }
    
    //Lets first create a generic function to paint cells
    function paint_cell(x, y)
    {
        context.fillStyle = "#737374";
        context.fillRect(x*cellWidth, y*cellWidth, cellWidth, cellWidth);
    }
    
    function check_collision(x, y, array)
    {
        //This function will check if the provided x/y coordinates exist
        //in an array of cells or not
        for(var i = 0; i < array.length; i++)
        {
            if(array[i].x == x && array[i].y == y)
             return true;
        }
        return false;
    }
    
    //Lets add the keyboard controls now
    $(document).keydown(function(e){
        var key = e.which;
        //We will add another clause to prevent reverse gear
        if(key == "37" && direction != "right") direction = "left";
        else if(key == "38" && direction != "down") direction = "up";
        else if(key == "39" && direction != "left") direction = "right";
        else if(key == "40" && direction != "up") direction = "down";
        //The snake is now keyboard controllable
    });
});