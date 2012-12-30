var Taka={};Taka.utils={};Taka.core={};Taka.assets={};Taka.levels={};Taka.ordnance={};Taka.effects={};Taka.vehicles={};Taka.vehicles.formations={};Taka.extend=function(dest,source){if(!dest||!source)return;for(var proto in source.prototype)dest.prototype[proto]=source.prototype[proto];dest.prototype.Super=source};Taka.start=function(canvas,callback){Taka.core.Timer.start(canvas,callback);document.onkeyup=Taka.core.Control.keyUp;document.onkeydown=Taka.core.Control.keyDown};
Taka.stop=function(){Taka.core.Timer.stop();document.onkeyup=null;document.onkeydown=null};Taka.gameOver=function(){Taka.stop()};var Taka=Taka?Taka:{};
Taka.utils.BoxUtil={Top:function(box){return box.y},Bottom:function(box){return box.y+box.height},Left:function(box){return box.x},Right:function(box){return box.x+box.width},Center:function(box){return{x:box.x+box.width/2,y:box.y+box.height/2}},TopLeft:function(box){return{x:box.x,y:box.y}},TopRight:function(box){return{x:box.x+box.width,y:box.y}},BottomLeft:function(box){return{x:box.x,y:box.y+box.height}},BottomRight:function(box){return{x:box.x+box.width,y:box.y+box.height}},Intersect:function(box1,
box2){return!(this.Top(box1)>this.Bottom(box2)||this.Bottom(box1)<this.Top(box2)||this.Left(box1)>this.Right(box2)||this.Right(box1)<this.Left(box2))}};var Taka=Taka?Taka:{};Taka.core.Config={fps:60,buttons:{up:38,down:40,left:37,right:39,fire:32,pause:27}};var Taka=Taka?Taka:{};
Taka.core.Control=function(){return{keyDown:function(e){var code=window.event?window.event.keyCode:e.which;switch(code){case Taka.core.Config.buttons.up:Taka.core.Engine.Player().moveUp=true;break;case Taka.core.Config.buttons.down:Taka.core.Engine.Player().moveDown=true;break;case Taka.core.Config.buttons.left:Taka.core.Engine.Player().moveLeft=true;break;case Taka.core.Config.buttons.right:Taka.core.Engine.Player().moveRight=true;break;case Taka.core.Config.buttons.fire:Taka.core.Engine.Player().fire=true;
break;case Taka.core.Config.buttons.pause:Taka.core.Engine.Pause();break}},keyUp:function(e){var code=window.event?window.event.keyCode:e.which;switch(code){case Taka.core.Config.buttons.up:Taka.core.Engine.Player().moveUp=false;break;case Taka.core.Config.buttons.down:Taka.core.Engine.Player().moveDown=false;break;case Taka.core.Config.buttons.left:Taka.core.Engine.Player().moveLeft=false;break;case Taka.core.Config.buttons.right:Taka.core.Engine.Player().moveRight=false;break;case Taka.core.Config.buttons.fire:Taka.core.Engine.Player().fire=
false;break}}}}();var Taka=Taka?Taka:{};
Taka.core.Engine=function(){var _screenWidth=0;var _screenHeight=0;var _level=null;var _player=null;var _enemies=[];var _formations=[];var _eBullets=[];var _pBullets=[];var _effects=[];var _lastFPSUpdate=new Date;var _framesAtLastFPSUpdate=0;var _fps=0;var _paused=false;var _updatePlayer=function(){if(!_player)return;_player.update();var newX=_player.x+_player.velX;var newY=_player.y+_player.velY;if(newX<=_screenWidth-_player.width&&newX>=0)_player.x=newX;if(newY<=_screenHeight-_player.height&&newY>=
0)_player.y=newY;var now=(new Date).getTime();if(_player.fire&&now-_player.firedLast>_player.fireFreq){_pBullets.push(_player.getBullet());_player.firedLast=now}};var _updateBullets=function(){var bullet;var i;for(i=_pBullets.length-1;i>=0;i--){bullet=_pBullets[i];bullet.updateVelocity();bullet.x+=bullet.velX;bullet.y+=bullet.velY;if(bullet.x>_screenWidth||bullet.x<-bullet.width||bullet.y>_screenHeight||bullet.y<-bullet.height){_pBullets.splice(i,1);continue}}for(i=_eBullets.length-1;i>=0;i--){bullet=
_eBullets[i];bullet.updateVelocity();bullet.x+=bullet.velX;bullet.y+=bullet.velY;if(bullet.x>_screenWidth||bullet.x<-bullet.width||bullet.y>_screenHeight||bullet.y<-bullet.height){_eBullets.splice(i,1);continue}}bullet=null};var _updateEnemies=function(){var enemy;for(var i=_enemies.length-1;i>=0;i--){enemy=_enemies[i];enemy.update();enemy.x+=enemy.velX;enemy.y+=enemy.velY;if(enemy.y>_screenHeight){_enemies.splice(i,1);continue}if(enemy.fire){_eBullets.push(enemy.getBullet());enemy.firedLast=(new Date).getTime();
enemy.fire=false}}enemy=null};var _updateFormations=function(frame){var formation;for(var i=_formations.length-1;i>=0;i--){formation=_formations[i];formation.update(frame)}formation=null};var _updateEffects=function(){var effect;for(var i=_effects.length-1;i>=0;i--){effect=_effects[i];if(effect.finished)_effects.splice(i,1)}};var _doCollisions=function(){var i;var ii;var enemy;var bullet;var center;for(i=_enemies.length-1;i>=0;i--){enemy=_enemies[i];for(ii=_pBullets.length-1;ii>=0;ii--){bullet=_pBullets[ii];
if(Taka.utils.BoxUtil.Intersect(enemy,bullet)){enemy.hit(bullet.damage);_pBullets.splice(ii,1);if(enemy.dead()){_enemies.splice(i,1);center=Taka.utils.BoxUtil.Center(enemy);_effects.push(new Taka.effects.ExplosionEffect(center.x,center.y))}}}}for(i=_eBullets.length-1;i>=0;i--){bullet=_eBullets[i];if(Taka.utils.BoxUtil.Intersect(_player,bullet)){_eBullets.splice(i,1);_player.hit(bullet.damage);center=Taka.utils.BoxUtil.Center(_player);_effects.push(new Taka.effects.ExplosionEffect(center.x,center.y));
if(_player.dead())Taka.gameOver()}}};var _updateLevel=function(frame){_level.update(frame)};var _updateStats=function(frame){var now=new Date;var sinceLastUpdate=now.getTime()-_lastFPSUpdate.getTime();if(sinceLastUpdate>1E3){_fps=(frame-_framesAtLastFPSUpdate)*(sinceLastUpdate/1E3);_fps=Math.round(_fps*100)/100;_framesAtLastFPSUpdate=frame;_lastFPSUpdate=now}};var _timePaused=null;return{Update:function(frame){_updateLevel(frame);_updatePlayer();_updateBullets();_updateEnemies(frame);_updateFormations(frame);
_doCollisions();_updateEffects();_updateStats(frame)},setGameDimensions:function(width,height){_screenWidth=width;_screenHeight=height},Level:function(level){if(level)_level=level;return _level},Player:function(player){if(player)_player=player;return _player},PlayerBullets:function(){return _pBullets},EnemyBullets:function(){return _eBullets},Enemies:function(){return _enemies},Effects:function(){return _effects},addEnemy:function(enemy){_enemies.push(enemy)},addFormation:function(formation){_formations.push(formation)},
FPS:function(){return _fps},Pause:function(){_paused=!_paused;if(_paused){_timePaused=(new Date).getTime();Taka.core.Timer.stop()}else Taka.core.Timer.start(Taka.core.Renderer.getCanvas())},isPaused:function(){return _paused}}}();var Taka=Taka?Taka:{};
Taka.core.Renderer=function(){var _canvas=null;var _context=null;var _canvasWidth=0;var _canvasHeight=0;return{getCanvas:function(){return _canvas},setCanvas:function(canvas){_canvas=canvas;_context=canvas.getContext("2d");_canvasWidth=canvas.width;_canvasHeight=canvas.height;Taka.core.Engine.setGameDimensions(canvas.width,canvas.height)},Render:function(){var i;_context.clearRect(0,0,_canvasWidth,_canvasHeight);_context.fillStyle="#ACE2F3";_context.fillRect(0,0,_canvasWidth,_canvasHeight);var player=
Taka.core.Engine.Player();_context.drawImage(player.getSprite(),player.x,player.y);var enemies=Taka.core.Engine.Enemies();var enemy;for(i=enemies.length-1;i>=0;i--){enemy=enemies[i];_context.drawImage(enemy.getSprite(),enemy.x,enemy.y)}var bullets=Taka.core.Engine.PlayerBullets();var bullet;for(i=bullets.length-1;i>=0;i--){bullet=bullets[i];_context.drawImage(bullet.getSprite(),bullet.x,bullet.y)}bullets=Taka.core.Engine.EnemyBullets();for(i=bullets.length-1;i>=0;i--){bullet=bullets[i];_context.drawImage(bullet.getSprite(),
bullet.x,bullet.y)}var effects=Taka.core.Engine.Effects();var effect;for(i=effects.length-1;i>=0;i--){effect=effects[i];_context.drawImage(effect.getSprite(),effect.x,effect.y)}}}}();var Taka=Taka?Taka:{};Taka.core.Timer=function(){var _run=false;var _interval=1E3/Taka.core.Config.fps;var _frame=0;var _callback=null;function _tick(){if(_run){_frame++;if(_callback)_callback();Taka.core.Engine.Update(_frame);Taka.core.Renderer.Render(_frame);setTimeout(_tick,_interval)}}return{start:function(canvas,callback){_run=true;Taka.core.Renderer.setCanvas(canvas);if(callback)_callback=callback;_tick()},stop:function(){_run=false},frame:function(){return _frame}}}();var Taka=Taka?Taka:{};
Taka.assets.Cache=function(){var _sprites={};var _keys=[];return{spriteCount:function(){return _keys.length},addSprite:function(sprite,key){_sprites[key]=sprite;_keys.push(key)},removeSprite:function(key){var index=_keys.indexOf(key);if(index===-1)return;_sprites[key]=null;delete _sprites[key];_keys.splice(index,1)},hasSprite:function(key){return _sprites.hasOwnProperty(key)},fetchSprite:function(key){if(!_sprites.hasOwnProperty(key))return null;return _sprites[key]},clear:function(){for(var i=_keys.length-
1;i>=0;i--)_sprites[_keys[i]]=null;_sprites={};_keys=[]}}}();var Taka=Taka?Taka:{};Taka.assets.Assets=function(){var _cache=Taka.assets.Cache;return{load:function(key,path){var sprite=_cache.fetchSprite(key);if(sprite===null){sprite=new Image;sprite.src=path;_cache.addSprite(sprite,key)}return sprite}}}();var Taka=Taka?Taka:{};
(function(){Taka.vehicles.Vehicle=function(sprite,width,height,x,y,speed,life,fireFreq){this.sprite=sprite;this.width=width;this.height=height;this.x=x;this.y=y;this.speed=speed;this.life=life;this.fireFreq=fireFreq;this.firedLast=(new Date).getTime();this.moveUp=false;this.moveDown=false;this.moveLeft=false;this.moveRight=false;this.fire=false;this.velX=0;this.velY=0};Taka.vehicles.Vehicle.prototype={update:function(){this._updateVelocity()},_updateVelocity:function(){this.velX=this.velY=0;if(this.moveUp)this.velY=
-this.speed;if(this.moveDown)this.velY=this.speed;if(this.moveLeft)this.velX=-this.speed;if(this.moveRight)this.velX=this.speed},getVelocity:function(){return{x:this.velX,y:this.velY}},setPos:function(x,y){this.x=x;this.y=y},getPos:function(){return{x:this.x,y:this.y}},getSprite:function(){return this.sprite},_getBullet:function(Type){return new Type(this.x+this.width/2,this.y)},hit:function(damage){this.life-=damage},dead:function(){return this.life<=0}}})();var Taka=Taka?Taka:{};(function(){Taka.vehicles.PlayerVehicle=function(x,y){var sprite=Taka.assets.Assets.load("Player","src/main/resources/vehicles/Player.png");var width=59;var height=43;var speed=3;var life=5;var fireFreq=300;this.Super(sprite,width,height,x,y,speed,life,fireFreq)};Taka.extend(Taka.vehicles.PlayerVehicle,Taka.vehicles.Vehicle);Taka.vehicles.PlayerVehicle.prototype.getBullet=function(){return this._getBullet(Taka.ordnance.PlayerBullet)}})();var Taka=Taka?Taka:{};
(function(){Taka.vehicles.DroneVehicle=function(x,y,velX,velY){var sprite=Taka.assets.Assets.load("Drone","src/main/resources/vehicles/Drone.png");var width=32;var height=31;var speed=2;var life=1;var fireFreq=3600;this.Super(sprite,width,height,x,y,speed,life,fireFreq);this.velX=velX;this.velY=velY};Taka.extend(Taka.vehicles.DroneVehicle,Taka.vehicles.Vehicle);Taka.vehicles.DroneVehicle.prototype.update=function(){if((new Date).getTime()-this.firedLast>this.fireFreq)this.fire=true};Taka.vehicles.DroneVehicle.prototype.getBullet=
function(){return new Taka.ordnance.SmallBullet(this.x+this.width/2,this.y+this.height)}})();var Taka=Taka?Taka:{};(function(){Taka.vehicles.formations.Formation=function(shipType,startFrame,x,y){this.shipType=shipType;this.startFrame=startFrame;this.x=x;this.y=y};Taka.vehicles.formations.Formation.prototype.update=function(frame){throw new Error("Taka.vehicles.formations.Formation.prototype.update should be implemented in derived classes");}})();var Taka=Taka?Taka:{};
(function(){Taka.vehicles.formations.A5Formation=function(shipType,startFrame,x,y){this.Super(shipType,startFrame,x,y)};Taka.extend(Taka.vehicles.formations.A5Formation,Taka.vehicles.formations.Formation);Taka.vehicles.formations.A5Formation.prototype.update=function(frame){if(frame===this.startFrame){Taka.core.Engine.addEnemy(new this.shipType(this.x,-60,-1,2));Taka.core.Engine.addEnemy(new this.shipType(this.x-30,-40,-1,2));Taka.core.Engine.addEnemy(new this.shipType(this.x+30,-40,-1,2));Taka.core.Engine.addEnemy(new this.shipType(this.x-
60,-20,-1,2));Taka.core.Engine.addEnemy(new this.shipType(this.x+60,-20,-1,2))}}})();var Taka=Taka?Taka:{};
(function(){Taka.vehicles.formations.V5Formation=function(shipType,startFrame,x,y){this.Super(shipType,startFrame,x,y)};Taka.extend(Taka.vehicles.formations.V5Formation,Taka.vehicles.formations.Formation);Taka.vehicles.formations.V5Formation.prototype.update=function(frame){if(frame===this.startFrame){Taka.core.Engine.addEnemy(new this.shipType(this.x,-20,0.5,1));Taka.core.Engine.addEnemy(new this.shipType(this.x-30,-40,0.5,1));Taka.core.Engine.addEnemy(new this.shipType(this.x+30,-40,0.5,1));Taka.core.Engine.addEnemy(new this.shipType(this.x-
60,-60,0.5,1));Taka.core.Engine.addEnemy(new this.shipType(this.x+60,-60,0.5,1))}}})();var Taka=Taka?Taka:{};
(function(){Taka.ordnance.Bullet=function(sprite,width,height,x,y,speed,damage){this.sprite=sprite;this.width=width;this.height=height;this.x=x;this.y=y;this.speed=speed;this.damage=damage;this.moveUp=false;this.moveDown=false;this.moveLeft=false;this.moveRight=false;this.velX=0;this.velY=0};Taka.ordnance.Bullet.prototype={updateVelocity:function(){this.velX=this.velY=0;if(this.moveUp)this.velY=-this.speed;if(this.moveDown)this.velY=this.speed;if(this.moveLeft)this.velX=-this.speed;if(this.moveRight)this.velX=
this.speed},getVelocity:function(){return{x:this.velX,y:this.velY}},setPos:function(x,y){this.x=x;this.y=y},getPos:function(){return{x:this.x,y:this.y}},getSprite:function(){return this.sprite}}})();var Taka=Taka?Taka:{};(function(){Taka.ordnance.PlayerBullet=function(x,y){var sprite=Taka.assets.Assets.load("PlayerBullet","src/main/resources/ordnance/PlayerBullet.png");var width=17;var height=16;var speed=6;x-=9;var damage=1;this.Super(sprite,width,height,x,y,speed,damage);this.moveUp=true};Taka.extend(Taka.ordnance.PlayerBullet,Taka.ordnance.Bullet)})();var Taka=Taka?Taka:{};(function(){Taka.ordnance.SmallBullet=function(x,y){var sprite=Taka.assets.Assets.load("SmallBullet","src/main/resources/ordnance/SmallBullet.png");var width=17;var height=16;var speed=4;x-=9;var damage=1;this.Super(sprite,width,height,x,y,speed,damage);this.moveDown=true};Taka.extend(Taka.ordnance.SmallBullet,Taka.ordnance.Bullet)})();var Taka=Taka?Taka:{};Taka.effects.Effect=function(sprites,width,height,x,y,velX,velY){this.sprites=sprites;this.width=width;this.height=height;this.x=x-width/2;this.y=y-height/2;this.velX=velX;this.velY=velY;this.finished=false;this.frame=-1};
Taka.effects.Effect.prototype={getVelocity:function(){return{x:this.velX,y:this.velY}},setPos:function(x,y){this.x=x;this.y=y},getPos:function(){return{x:this.x,y:this.y}},getSprite:function(){this.frame++;if(this.frame===this.sprites.length-1)this.finished=true;return this.sprites[this.frame]}};var Taka=Taka?Taka:{};(function(){Taka.effects.ExplosionEffect=function(x,y,velX,velY){var sprites=[];for(var i=0;i<7;i++)sprites[i]=Taka.assets.Assets.load("ExplosionEffect"+i,"src/main/resources/effects/explosion-0"+i+".png");var width=60;var height=60;this.Super(sprites,width,height,x,y,velX,velY)};Taka.extend(Taka.effects.ExplosionEffect,Taka.effects.Effect)})();var Taka=Taka?Taka:{};(function(){Taka.levels.Level=function(){this.nextTrigger=this.triggers[0];this.nextTriggerNum=0};Taka.levels.Level.prototype={triggers:[],nextTrigger:null,nextTriggerNum:null,update:function(frameNum){if(!this.nextTrigger)return;if(frameNum===this.nextTrigger.frame){this.nextTrigger.execute();this.nextTriggerNum++;this.nextTrigger=this.triggers[this.nextTriggerNum]}}}})();var Taka=Taka?Taka:{};
(function(){Taka.levels.TestLevel=function(){this.setTriggers();this.Super()};Taka.extend(Taka.levels.TestLevel,Taka.levels.Level);Taka.levels.TestLevel.prototype.setTriggers=function(){this.triggers=[{frame:100,execute:function(){Taka.core.Engine.addFormation(new Taka.vehicles.formations.V5Formation(Taka.vehicles.DroneVehicle,100,100,0))}},{frame:300,execute:function(){Taka.core.Engine.addEnemy(new Taka.vehicles.DroneVehicle(150,0,1,2))}},{frame:350,execute:function(){Taka.core.Engine.addFormation(new Taka.vehicles.formations.A5Formation(Taka.vehicles.DroneVehicle,350,
300,0))}}]}})();