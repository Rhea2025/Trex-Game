var trex, trexAnimation, ground, groundAnimation, cloud, invisiableGround, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6, ObstacleGroup, CloudGroup, score, gameState, PLAY = 1, STOP = 0, gameOver, restart, trexCollided;

function preload(){
  trexAnimation = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  
  trexCollided = loadAnimation("trex_collided.png");
  
  groundAnimation = loadImage("ground2.png");
  
  cloudAnimation = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  gameState = PLAY;
  
  gameOver = loadImage("gameOver.png");
  restart = loadImage("restart.png");
  
}

function setup() {
  
  createCanvas(600, 200);
  
  //create a trex sprite
  trex = createSprite(30,180,20,50);
  trex.addAnimation("trexF1", trexAnimation);
  trex.addAnimation("trexCollided", trexCollided); 
  trex.scale = 0.4;
  trex.debug = true;
  trex.setCollider("circle", 0, 0, 40);
  
  ground = createSprite(200, 180);
  ground.addImage(groundAnimation);
  
  invisibleGround = createSprite(200,195,400,5);
  invisibleGround.visible = false;
  
  ObstacleGroup = new Group();
  CloudGroup = new Group();
  
  gameOverObject = createSprite(290, 150);
  gameOverObject.addImage(gameOver);
  restartObject = createSprite(290, 75);
  restartObject.addImage(restart);
  
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (World.frameCount % 80 === 0) {
    var cloud = createSprite(600,320,40,10);
    cloud.y = random(80, 120);
    cloud.addImage(cloudAnimation);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 210;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    CloudGroup.add(cloud);
  }
}

function spawnObstacles() {
  if(World.frameCount % 60 === 0) {
    var obstacle = createSprite(600,165,10,40);
    obstacle.velocityX = -6;
    
    //generate random obstacles
    var obstacleRandom = Math.round(random(1,6));
    
    ObstacleGroup.add(obstacle);
    
    switch(obstacleRandom) {
      case 1:
        obstacle.addImage(obstacle1);
        break;
      case 2:
        obstacle.addImage(obstacle2);
        break;
      case 3:
        obstacle.addImage(obstacle3);
        break;
      case 4:
        obstacle.addImage(obstacle4);
        break;
      case 5:
        obstacle.addImage(obstacle5);
        break;
      case 6:
        obstacle.addImage(obstacle6);
        break;
        
      default:
        break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 120;
    
  }
}

function reset() {
  gameState = PLAY;
  ObstacleGroup.destroyEach();
  CloudGroup.destroyEach();
  trex.changeAnimation("trexF1", trexAnimation);
  score = 0;
}

function draw() {
 
  background("White");
  
  //stop trex from falling down
  trex.collide(invisibleGround);
 
  if(gameState === PLAY) {
    
    gameOverObject.visible = false;
    restartObject.visible = false;
    
    ground.velocityX = -6;
    
    if (ground.x < 0){
      ground.x = ground.width / 2;
    }
  
    //jump when the space key is pressed
    if(keyDown("space") && trex.y >= 159){
      trex.velocityY = -10;
    }
  
    //add gravity
    trex.velocityY = trex.velocityY + 0.8;
  
    if(ObstacleGroup.isTouching(trex)) {
      gameState = STOP;
    }
  
    spawnClouds();
  
    spawnObstacles();
  }
  
  else if(gameState === STOP){
    gameOverObject.visible = true;
    gameOverObject.scale = 0.5;
    restartObject.visible = true;
    restartObject.scale = 0.5;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    ObstacleGroup.setVelocityXEach(0);
    CloudGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("trexCollided", trexCollided);
    
    //set lifetime of the game objects so that they       are never destroyed
    ObstacleGroup.setLifetimeEach(-1);
    CloudGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restartObject)) {
       reset();
    }
    
  }
  
  drawSprites();
}
