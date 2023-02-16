 import Phaser from "phaser";
import SpeechBubbles from "../helpers/SpeechBubbles";
import HealthBar from "../hud/Healthbar";
import initAnims from '../anims'

class Play extends Phaser.Scene{

    constructor(config){
        super('Play')
        Object.assign(this,SpeechBubbles);
        this.config = config;
        
        this.speechBubbleEnemyX = 590; 
        this.speechBubbleAllyX = 100; 
        
        this.index = 0;
        this.timer = 0;
        this.animationTimer = 0;

        this.switchDir = false;

        this.speechBubblesEnemy = ['You are the definition of worthlessness.','How can you even look yourself in the mirror?','I am certain it is not a pretty picture.','Have you seen Jessica? \nShe has a new boyfriend again. \n\nYet... you are alone.',
            'Oh surprise surprise, here come the waterworks again. Why are you even crying you are doing nothing to improve your situation.','There are people suffering from deadly diseases and hunger and you are crying for meaningless stuff.',
            'You are suffering from what exactly? Not being hot enough? Not being liked enough? Not being PERFECT ENOUGH?','Oh cry me a river, rocket science is not simple. This however, is. \nI have been with you since that day Riley called you fat in front of your friends in Middle School.',
            'Do you remember that day?\nOf course you do.','You started watching what you ate in front of people. Feeling weird everytime you opened your mouth because someone might mention something.'
        ];
        this.speechBubblesAlly = [];
        this.randomInsults = 
            ['You suck!','You are worthless.','You like pineapple on pizza, pathetic.', 'You look ugly.',
                'You have no personality.','Life without you will continue the same.','Nobody loves you.',
                'You look fat.','Deep down you know that Jacob wanted to just use you.'];
        this.genericAnswers = ['That is not true!','I am worth it, shut up!','You are completely right.']
        this.catchphrases = ['You will never defeat me!',"I am unstoppable! You won't win this!","*smirks* Look at you trying to win this. Spoiler alert: You can't"]

        this.optionsForAlly = [];

        this.pauseConv = false;

        this.player =null;
        this.enemy=null;
        this.startRotation = false;
        this.startRotationEnemy = false;
        this.enemyDefeated = false;

        this.animationScore=0;
        this.doOnce = false;
        this.score = 0;
        this.totalScore = 0;
        this.index = 0;
        this.stopMovingEnemy=false;
        this.stopMovingPlayer=false;
        this.currentPhase=1;
        
        this.spawnSpeed= 900;
        this.changeAmount =50;
        this.minimum =400;
        this.amountToChange=10;
        this.currentAmount=1;
        this.fill=null;
        this.bar=null;
        
        this.hint=null;
        this.edgePlayer=null;
        this.edgeEnemy=null;
        
        this.startedChaosMode = false;
        this.startTweenAnim=false;
        this.upDownTween=null;
        this.upDownTween2=null;
    }
    
    create () {
        this.add.image(400, 300, 'sky').setDepth(-10).setScale(1.4);
        this.groupChaosBubbles = this.add.group();
        this.groupChaosContent = this.add.group();
        //this.createPowerBar();
        // this.createConversationBubbles();
        // this.createBtn();
        //
        // this.createOptionBubbles();
        //this.scoreDisplay = new HealthBar(this,10,10,2,this.score);
        //this.ropes = this.createRope();
        this.createGround();
        this.createPlayer();
        this.createCollisionsWithEdge();
        initAnims(this.anims);
        
        //const rope = this.add.rope(50,50,'rope',null,12);
        let rand = Math.round(Math.random()*(this.randomInsults.length-1));
        //this.createBubblePhase2(this.randomInsults[rand]);
        this.time.delayedCall(2000,()=>{
            this.createBubblePhase1(this.speechBubblesEnemy[this.index]);
        })
        
        
    }
    createPowerBar(){
        let initialScale = 0.1;
        if(this.fill) return;
        this.fill=this.add.image(600, 100, 'fill').setScale(initialScale)
        
        
        this.bar=this.add.image(600, 100, 'bar').setScale(initialScale);
        
        let body=this.add.image(520, 100, 'body').setScale(initialScale).setOrigin(0.2,0.5);
        body.setInteractive();
        
        body.on('pointerup',()=>{
            if(this.score>=this.fill.width){
                this.totalScore+=this.score;
                this.score=0;
                this.animationScore=0;
                this.fill.setCrop(0,0, this.score,this.fill.height);
                if(this.currentPhase===2) {
                    this.createSpecialBubble("NOW YOU MADE ME MAD!!", 1000, false);
                    this.startedChaosMode = true;
                    this.time.delayedCall(2000, () => {
                        this.upDownTween.stop(0);
                        this.upDownTween2.stop(0);
                        this.startTweenAnim=false;
                        this.startChaosMode();
                    })
                }else if(this.currentPhase===3){
                    this.upDownTween.stop(0);
                    this.upDownTween2.stop(0);
                    this.startTweenAnim=false;
                    this.startChaosMode();
                }
                
            }
        })
        let goUp=0;
        //in update!
        // if(fill.width<goup) return;

        this.fill.setCrop(0,0,0,this.fill.height);
        this.bar.setCrop(0,0,0,this.bar.height);
        let rotationAmount=0;
        this.events.addListener("update", (time, delta) => {
            rotationAmount += 0.8 * delta;

            // Keep the rotation amount between 0 and 360
            if (rotationAmount <= 360) {
                //rotationAmount -= 360;
                this.fill.setRotation(Phaser.Math.DegToRad(rotationAmount));
                body.setRotation(Phaser.Math.DegToRad(rotationAmount));
                this.bar.setRotation(Phaser.Math.DegToRad(rotationAmount));
            }else{
                this.fill.setRotation(Phaser.Math.DegToRad(0));
                body.setRotation(Phaser.Math.DegToRad(0));
                this.bar.setRotation(Phaser.Math.DegToRad(0));
                if(this.bar.width<goUp) return;
                goUp+=delta*0.4;
                this.bar.setCrop(0,0,goUp,this.bar.height);
            }

            
            
            if(initialScale>=1) return;
            initialScale+=delta*0.002;
            this.fill.setScale(initialScale);
            body.setScale(initialScale);
            this.bar.setScale(initialScale);
            
            
        });
        
        
    }
    createCollisionsWithEdge(){
         this.edgePlayer=this.physics.add.sprite(490,450,'end')
            .setAlpha(0)
            .setSize(50,200)
             .setImmovable(true)
            .setOrigin(0.5,1);
         this.edgeEnemy=this.physics.add.sprite(800,450,'end')
            .setAlpha(0)
            .setSize(50,200)
             .setImmovable(true)
            .setOrigin(0.5,1);
        
        
    }
    createSpecialBubble(quote,timeToDestroy,pull=true){
        let bubble = this.add.image(this.enemy.x-128, this.enemy.y-400, 'bubble').setOrigin(0);
        let bubbleHeight = 180;
        let bubblePadding = 15;
        bubble.setInteractive();
        let content = this.add.text(0, 0, quote, { fontFamily: 'Arial', fontSize: 20, color: '#000000', align: 'center', wordWrap: { width: bubble.width - (bubblePadding * 2) } });
        let b = content.getBounds();
        content.setPosition(bubble.x + (bubble.width / 2) - (b.width / 2), bubble.y + (bubbleHeight / 2) - (b.height / 2));
        let ignoreDelayedSpawn = false;
        bubble.on("pointerup",()=>{
            bubble.destroy();
            content.destroy();
            ignoreDelayedSpawn = true;
            if(pull){
                
                this.player.body.setVelocityX(-438);
                this.enemy.body.setVelocityX(-438); 
            }
            this.time.delayedCall(500, () => {
                if(pull) {
                    this.player.body.setVelocityX(0);
                    this.enemy.body.setVelocityX(0);
                }
                this.time.delayedCall(2000, () => {
                    this.startPhase2();
                    this.createPowerBar();
                })
            })
            
            
            
            //this.createBubblePhase1("Bubble2")
        })
        this.time.delayedCall(timeToDestroy,()=>{
            if(ignoreDelayedSpawn) return;
            bubble.destroy();
            content.destroy();
            if(pull) {
                this.player.body.setVelocityX(-438);
                this.enemy.body.setVelocityX(-438);
            }
            
            this.time.delayedCall(500, () => {
                if(pull) {
                    this.player.body.setVelocityX(0);
                    this.enemy.body.setVelocityX(0);
                }
                this.time.delayedCall(2000, () => {
                    this.startPhase2();
                    this.createPowerBar();
                })
            })
        })
    }
    startPhase2(){
        this.index=0;
        if(!this.startedChaosMode)
            this.currentPhase=2;
        this.time.delayedCall(1000,()=>{
            this.createBubblePhase1(this.speechBubblesEnemy[this.index]);
            this.time.delayedCall(1000,()=>{
                if(!this.hint)
                    this.hint = this.add.text(this.config.width/3, 20, "Smash the bubbles", { fontFamily: 'Arial', fontSize: 42, color: '#000000', align: 'center'});
            })
        })
        
    }
    startChaosMode(){
        
        if(this.currentPhase===2)
            this.createBubblePhase2(this.generateRandomInsult());
        else if(this.currentPhase===3){
            this.startedChaosMode=false;
            this.createSpecialBubble("huff, huff, huff, you'll...never win",2500,false)
            this.groupChaosBubbles.children.iterate(item=>{
                
                item.setActive(false).setVisible(false);
            }) 
            this.groupChaosContent.children.iterate(item=>{
                item.setActive(false).setVisible(false);
            })
            this.time.delayedCall(3000,()=>{
                this.time.delayedCall(2000,()=>{
                    this.hint.destroy();
                    this.hint = this.add.text(this.config.width/3, 20, "Maybe it's time to...", { fontFamily: 'Arial', fontSize: 42, color: '#000000', align: 'center'});
                    //Create let go button here.
                })
                this.startedChaosMode=true;
                this.createBubblePhase2(this.generateRandomInsult());
            })
        }
        
        this.currentPhase=3;
    }
    createBubblePhase1(quote, timeToDestroy = 4000){
        if(!this.speechBubblesEnemy[this.index] || this.startedChaosMode) return;
        
        let bubble = this.add.image(this.enemy.x-128, this.enemy.y-400, 'bubble').setOrigin(0);
        
        if(!this.stopMovingPlayer && !this.stopMovingEnemy) {
            this.player.body.setVelocityX(73);
            this.enemy.body.setVelocityX(73);
            this.time.delayedCall(500, () => {
                this.player.body.setVelocityX(0);
                this.enemy.body.setVelocityX(0);
                bubble.setInteractive();
                bubble.input.hitArea.setTo(3,15,240,150);
            })
        }
        // listen for a click event on the bubble
        let bubbleHeight = 180;
        let bubblePadding = 15;
        let content = this.add.text(0, 0, quote, { fontFamily: 'Arial', fontSize: 20, color: '#000000', align: 'center', wordWrap: { width: bubble.width - (bubblePadding * 2) } });
        //content.setOrigin(0.5);
        let b = content.getBounds();
        
        
        
        content.setPosition(bubble.x + (bubble.width / 2) - (b.width / 2), bubble.y + (bubbleHeight / 2) - (b.height / 2));
        let ignoreDelayedSpawn = false;
        bubble.on("pointerup",()=>{
            if(this.startedChaosMode) return;
            ignoreDelayedSpawn=true;
            let plusText;
            if(this.currentPhase===2) {
                let rand = Math.round(Math.random()*4)+5;
                plusText = this.add.text(0, 0, "+"+rand, {
                    fontFamily: 'Arial',
                    fontSize: 48,
                    color: '#67ff00',
                    align: 'center',
                    wordWrap: {width: bubble.width - (bubblePadding * 2)}
                });

                let b = plusText.getBounds();

                plusText.setPosition(bubble.x + (bubble.width / 2) - (b.width / 2), bubble.y + ((bubbleHeight) / 2) - (b.height / 2));
                plusText.y += 80;
                this.events.addListener("update", (time, delta) => {
                    plusText.y -= 4;
                });
                this.score+=rand*5;
                
                
                
            }
            this.player.body.setVelocityX(-20);
            this.enemy.body.setVelocityX(-20);
            this.time.delayedCall(400, () => {
                this.player.body.setVelocityX(0);
                this.enemy.body.setVelocityX(0);
            })
            bubble.destroy();
            content.destroy();
            this.time.delayedCall(500,()=>{
                this.continueConv();
                if(this.currentPhase===2)
                    plusText.destroy();
            })
            
            //this.createBubblePhase1("Bubble2")
        })
        this.time.delayedCall(timeToDestroy,()=>{
            bubble.destroy();
            content.destroy();
            this.time.delayedCall(1000,()=>{
                if(!ignoreDelayedSpawn){
                    this.continueConv();
                }
               
            })
            
        })
    }
    continueConv(){
        let specialTextCreation = false;
        
        if(this.stopMovingPlayer)
            specialTextCreation=true;
        
        if(!specialTextCreation){
            this.index++;
            this.createBubblePhase1(this.speechBubblesEnemy[this.index])
        }else{
            this.createSpecialBubble("I AM NOT DONE WITH YOU YET!",4000);
            specialTextCreation = false;
        }
        
    }
    createBubblePhase2(quote){
        if(!this.startedChaosMode) return;
        // create a random position for the bubble
        let x = Math.random() * (this.config.width-300);
        let y = Math.random() * (this.config.height-300);
        
        
        // create the bubble sprite
        let bubble = this.add.image(x, y, 'bubbleNoArrow').setOrigin(0);

        // set the bubble to be interactive
        bubble.setInteractive();
        bubble.input.hitArea.setTo(3,15,240,150);
        this.player.body.setVelocityX(40);
        this.enemy.body.setVelocityX(40);
        this.time.delayedCall(100, () => {
            this.player.body.setVelocityX(0);
            this.enemy.body.setVelocityX(0);
        })
        // listen for a click event on the bubble
        let bubbleHeight = 180;
        let bubblePadding = 15;
        let content = this.add.text(0, 0, quote, { fontFamily: 'Arial', fontSize: 20, color: '#000000', align: 'center', wordWrap: { width: bubble.width - (bubblePadding * 2) } });
        //content.setOrigin(0.5);
        let b = content.getBounds();

        content.setPosition(bubble.x + (bubble.width / 2) - (b.width / 2), bubble.y + (bubbleHeight / 2) - (b.height / 2));
        bubble.on("pointerup",()=>{
            bubble.destroy();
            content.destroy();
            let plusText;
            
            let rand = Math.round(Math.random() * 4) + 5;
            plusText = this.add.text(0, 0, "+" + rand, {
                fontFamily: 'Arial',
                fontSize: 48,
                color: '#67ff00',
                align: 'center',
                wordWrap: {width: bubble.width - (bubblePadding * 2)}
            });

            let b = plusText.getBounds();

            plusText.setPosition(bubble.x + (bubble.width / 2) - (b.width / 2), bubble.y + ((bubbleHeight) / 2) - (b.height / 2));
            plusText.y += 80;
            this.events.addListener("update", (time, delta) => {
                plusText.y -= 4;
            });
            this.score+= rand*5;
            this.time.delayedCall(500,()=>{
                plusText.destroy();
            })
            this.player.body.setVelocityX(-40);
            this.enemy.body.setVelocityX(-40);
            this.time.delayedCall(100, () => {
                this.player.body.setVelocityX(0);
                this.enemy.body.setVelocityX(0);
            })
        })
        this.time.delayedCall(this.spawnSpeed,()=>{
            let rand = Math.round(Math.random()*(this.randomInsults.length-1));
            this.createBubblePhase2(this.randomInsults[rand]);
            console.log(" "+this.currentAmount)
            //Reduce speed
            if(this.spawnSpeed>this.minimum){
                if(this.amountToChange>=this.currentAmount)
                    this.currentAmount++;
                else{
                    this.spawnSpeed-=this.changeAmount;
                    this.amountToChange*=2;
                    this.currentAmount=0;
                }
            }
                
        })
        this.groupChaosBubbles.add(bubble);
        this.groupChaosContent.add(content);
    }
    

    createPlayer(){
        this.player =this.physics.add.sprite(this.config.width*1.5/8,  this.config.height*7.33/10, 'girl').setOrigin(0.5);
        this.enemy= this.physics.add.sprite(this.config.width*5.5/8,  this.config.height*7.33/10, 'girl').setFlipX(true).setTint(0xFF0000).setDepth(20).setOrigin(0.5);
        this.player.body.setSize(30,128);
        this.enemy.body.setSize(30,128);
    }
    // createRespond(){
    //     this.respondButton = this.createDialogueOptions(225,500,400,80,100,'Respond');
    //     this.respondButton.content.setStyle({fontSize: '48px'})
    //     this.respondButton.content.x = 150+this.letgoText.content.width;
    //     this.respondButton.content.y -= 15;
    //    
    //     this.respondButton.content.on('pointerover',()=>{
    //         this.respondButton.content.setStyle({fill: '#d000ff'});
    //     })
    //     this.respondButton.content.on('pointerout',()=>{
    //         this.respondButton.content.setStyle({fill: '#0'});
    //     })
    //     this.respondButton.content.on('pointerup',()=>{
    //         //Alternative behavior:
    //         // let rocket = this.physics.add.sprite(400, 300, 'rocket').setDepth(4);
    //         // rocket.setVelocityX(20);
    //         // this.time.delayedCall(2000,()=>{
    //         //     rocket.destroy();
    //         //     this.createSpeechBubble(this.speechBubbleEnemyX,50, 200,200,'AAAAAAAAA\nAAAAAAAAA\n\nYOU %@@#$%%&^@');
    //         //     this.startRotationEnemy=true;
    //         //     this.enemy.body.setVelocity(150,-250);
    //         //     this.letgoText.bubble.setVisible(false).setActive(false);
    //         //     this.letgoText.content.setVisible(false).setActive(false);
    //         // })
    //         //this.openExternalLink('https://www.betterhelp.com/');
    //         this.respondButton.bubble.visible=false;
    //         this.respondButton.content.visible=false;
    //         this.pauseConv=false;
    //         this.timer=4;
    //     })
    // }
    // createBtn(){
    //     this.letgoText = this.createDialogueOptions(225,500,400,80,100,'LET GO');
    //     this.letgoText.content.setStyle({fontSize: '48px'})
    //     this.letgoText.content.x = 150+this.letgoText.content.width;
    //     this.letgoText.content.y -= 15;
    //
    //     this.letgoText.bubble.visible=false;
    //     this.letgoText.content.visible=false;
    //     this.letgoText.content.on('pointerover',()=>{
    //         this.letgoText.content.setStyle({fill: '#d000ff'});
    //     })
    //     this.letgoText.content.on('pointerout',()=>{
    //         this.letgoText.content.setStyle({fill: '#0'});
    //     })
    //     this.letgoText.content.on('pointerup',()=>{
    //         //Alternative behavior:
    //         // let rocket = this.physics.add.sprite(400, 300, 'rocket').setDepth(4);
    //         // rocket.setVelocityX(20);
    //         // this.time.delayedCall(2000,()=>{
    //         //     rocket.destroy();
    //         //     this.createSpeechBubble(this.speechBubbleEnemyX,50, 200,200,'AAAAAAAAA\nAAAAAAAAA\n\nYOU %@@#$%%&^@');
    //         //     this.startRotationEnemy=true;
    //         //     this.enemy.body.setVelocity(150,-250);
    //         //     this.letgoText.bubble.setVisible(false).setActive(false);
    //         //     this.letgoText.content.setVisible(false).setActive(false);
    //         // })
    //         //this.openExternalLink('https://www.betterhelp.com/');
    //         this.letgoText.bubble.visible=false;
    //         this.letgoText.content.visible=false;
    //         this.enemyDefeated=true;
    //         this.enemy.play('girl-let-go',true);
    //         this.player.stop(null,true);
    //         this.player.setTexture('girlLetGo');
    //         this.ropes.forEach(rope=>{
    //             rope.setGravityY(200);
    //         })
    //     })
    // }
    // openExternalLink (url)
    // {
    //     var s = window.open(url, '_blank');
    //
    //     if (s && s.focus)
    //     {
    //         s.focus();
    //     }
    //     else if (!s)
    //     {
    //         window.location.href = url;
    //     }
    // }

    createRope(){
        let ropes =[];
        let distance = 0;
        for(let i=0; i<9; i++){
            ropes.push(this.physics.add.sprite((this.config.width*0.5/6)+distance, this.config.height*7.65/10, 'rope'));
            
            distance+=96;
        }
        
        
        return ropes;
    }
    
    createGround(){
        let ground =[];
        let distance = -20;
        ground.push(this.add.image(distance, 0, 'groundBigger').setOrigin(0).setDepth(-1));
        distance+=40;
        ground.push(this.add.image(distance, 0, 'groundBigger').setOrigin(0).setDepth(-1).setFlipX(true));
        
    }
    
    generateRandomInsult(){
        let rand = Math.floor(Math.random()*((this.randomInsults.length-1)-0+1)+0);
        return this.randomInsults[rand];
    }

    generateCatchPhrase(){
        let rand = Math.floor(Math.random()*((this.catchphrases.length-1)-0+1)+0);
        return this.catchphrases[rand];
        
    }
    handleScore(points){
        this.score+=points;
        if(this.score<=0)
            this.score=0;
        if(this.score>=83)
            this.score=83;
        this.scoreDisplay.change(this.score);

    }
    createUpDownTween(image, duration) {
        this.startTweenAnim=true;
        return this.tweens.add({
            targets: image,
            y: '-=8',
            ease: 'Sine.easeInOut',
            duration: duration,
            yoyo: true,
            repeat: -1
        });
    }
    update(time,delta){
        if(!this.pauseConv)
            this.timer+=delta/1000;
        this.animationTimer+=delta/1000;

        this.stopMovingEnemy= this.physics.overlap(this.enemy,this.edgeEnemy);
        this.stopMovingPlayer= this.physics.overlap(this.player,this.edgePlayer);

        if(this.fill){
          
            if(this.score> this.animationScore){
                
                this.animationScore+=delta*0.1;
                this.fill.setCrop(0,0, this.animationScore,this.fill.height);
            }
            if(this.animationScore>=this.fill.width){
                if(!this.startTweenAnim){
                    this.upDownTween=this.createUpDownTween(this.fill,200);
                    this.upDownTween2=this.createUpDownTween(this.bar,200);
                }
            }
            
        }
            


        if(this.animationTimer>=.5){
            this.animationTimer=0;
            this.switchDir = !this.switchDir;
        }
        if(this.startRotation)
            this.player.angle-=.727*delta;
        if(this.startRotationEnemy)
            this.enemy.angle+=30;
        //this.handleHealth(delta);
        // if(this.enemy.x<550.0 && !this.doOnce){
        //     this.pauseConv=true;
        //     this.timer=4;
        //     this.doOnce=true;
        //     let conv=this.createSpeechBubble(this.speechBubbleEnemyX,50, 200,200,this.generateCatchPhrase());
        //     this.time.delayedCall(3000,()=>{
        //         this.player.setVelocityX(100);
        //         this.enemy.setVelocityX(100);
        //         this.time.delayedCall(500,()=>{
        //             this.player.setVelocityX(0);
        //             this.enemy.setVelocityX(0);
        //             this.doOnce=false;
        //             this.pauseConv=false;
        //             conv.bubble.visible=false;
        //             conv.content.visible=false;
        //         })
        //     })
        // }else{
        //     //this.handleSpeech(this.timer);
        // }
        

        if(!this.enemyDefeated)
            this.player.play('girl-pulling',true);

        if(time/1000>3&&!this.enemyDefeated)
            this.enemy.play('girl-pulling',true);

        // this.ropes.forEach(rope => {
        //     rope.setX(rope.x -100);

        // });

    }

    // createConversationBubbles(){
    //     if(this.index>0) {
    //         this.speechBubblesEnemy.forEach(bub => {
    //             bub.bubble.visible = false;
    //             bub.content.visible = false;
    //         });
    //         this.speechBubblesAlly.forEach(bub => {
    //             bub.bubble.visible = false;
    //             bub.content.visible = false;
    //         });
    //     }
    //     this.speechBubblesEnemy[0] = this.createSpeechBubble(this.speechBubbleEnemyX,50, 200,200,'You are the definition of worthlessness.');
    //     this.speechBubblesEnemy[1] = this.createSpeechBubble(this.speechBubbleEnemyX,50, 200,200,'How can you even look yourself in the mirror?');
    //     this.speechBubblesEnemy[2] = this.createSpeechBubble(this.speechBubbleEnemyX,50, 200,200,'I am certain it is not a pretty picture.');
    //     this.speechBubblesEnemy[3] = this.createSpeechBubble(this.speechBubbleEnemyX,50, 200,200,'Have you seen Jessica? \nShe has a new boyfriend again. \n\nYet... you are alone.');
    //     this.speechBubblesEnemy[4] = this.createSpeechBubble(this.speechBubbleEnemyX,50, 200,200,'Oh surprise surprise, here come the waterworks again. Why are you even crying you are doing nothing to improve your situation.');
    //     this.speechBubblesEnemy[5] = this.createSpeechBubble(this.speechBubbleEnemyX,50, 200,200,'There are people suffering from deadly diseases and hunger and you are crying for meaningless stuff.');
    //     this.speechBubblesEnemy[6] = this.createSpeechBubble(this.speechBubbleEnemyX,50, 200,200,'Suffering from what exactly? Not being hot enough? Not being liked enough? Not being PERFECT ENOUGH?');
    //     this.speechBubblesEnemy[7] = this.createSpeechBubble(this.speechBubbleEnemyX,50, 200,240,'Oh cry me a river, rocket science is not simple. This however, is. \nI have been with you since that day Riley called you fat in front of your friends in Middle School.');
    //     this.speechBubblesEnemy[8] = this.createSpeechBubble(this.speechBubbleEnemyX,50, 200,200,'Do you remember that day?');
    //     this.speechBubblesEnemy[9] = this.createSpeechBubble(this.speechBubbleEnemyX,50, 200,200,'You started watching what you ate in front of people. Feeling weird everytime you opened your mouth because someone might mention something.');
    //     this.speechBubblesEnemy[10] = this.createSpeechBubble(this.speechBubbleEnemyX,50, 200,200,'Its been 10 years since then. Nothing has changed. Still scared of eating even though you have nobody judging you, well asides from me of course.');
    //     this.speechBubblesEnemy[11] = this.createSpeechBubble(this.speechBubbleEnemyX,50, 200,200,'Kind of ironic. Begging yourself to stop telling you the things you do not want to hear.');
    //     this.speechBubblesEnemy[12] = this.createSpeechBubble(this.speechBubbleEnemyX,50, 200,200,this.generateRandomInsult());
    //     for(let i=13; i<43;i++){
    //         this.speechBubblesEnemy[i] = this.createSpeechBubble(this.speechBubbleEnemyX,50, 200,200,this.generateRandomInsult());
    //     }
    //
    //    
    //     // this.speechBubblesAlly[5] = this.createSpeechBubble(this.speechBubbleAllyX,50, 200,200,'SHUT UP!! It is not meaningless to me, I am suffering too.');
    //     // this.speechBubblesAlly[6] = this.createSpeechBubble(this.speechBubbleAllyX,50, 200,200,'It....it..its not that simple.. I am...');
    //     // this.speechBubblesAlly[8] = this.createSpeechBubble(this.speechBubbleAllyX,50, 200,50,'I..*sniffles* I do.');
    //     // this.speechBubblesAlly[10] = this.createSpeechBubble(this.speechBubbleAllyX,50, 200,70,'Please... stop this. STOP THIS!! I AM BEGGING YOU.');
    //
    //     this.speechBubblesEnemy.forEach(bub => {
    //         bub.bubble.visible = false;
    //         bub.content.visible = false;
    //     });
    //     this.speechBubblesAlly.forEach(bub => {
    //         bub.bubble.visible = false;
    //         bub.content.visible = false;
    //     });
    //     if(this.index===0){
    //         this.speechBubblesEnemy[0].bubble.visible = true;
    //         this.speechBubblesEnemy[0].content.visible = true;
    //     }
    //    
    //    
    //    
    // }
    //
    // createOptionBubbles(){
    //     // this.optionsForAlly[2] = {option1: this.createDialogueOptions(this.speechBubbleAllyX+200,200, this.optionsForAllyWidth,this.optionsForAllyHeight,60,'Do not talk to me like that.'),option2: this.createDialogueOptions(this.speechBubbleAllyX+200,260, this.optionsForAllyWidth,this.optionsForAllyHeight,15,'Fuck off buddy.'),option3: this.createDialogueOptions(this.speechBubbleAllyX+200,320, this.optionsForAllyWidth,this.optionsForAllyHeight,-10,'You are right I suck.')}
    //     // this.optionsForAlly[4] = {option1: this.createDialogueOptions(this.speechBubbleAllyX+200,200, this.optionsForAllyWidth,this.optionsForAllyHeight,10,'Cray Cray.'),option2: this.createDialogueOptions(this.speechBubbleAllyX+200,260, this.optionsForAllyWidth,this.optionsForAllyHeight,20,'Fuck off dude.'),option3: this.createDialogueOptions(this.speechBubbleAllyX+200,320, this.optionsForAllyWidth,this.optionsForAllyHeight,-10,'You are right I suck.')}
    //     // this.optionsForAlly[7] = {option1: this.createDialogueOptions(this.speechBubbleAllyX+200,200, this.optionsForAllyWidth,this.optionsForAllyHeight,20,'GenericGood1'),option2: this.createDialogueOptions(this.speechBubbleAllyX+200,260, this.optionsForAllyWidth,this.optionsForAllyHeight,10,'GenericGood2'),option3: this.createDialogueOptions(this.speechBubbleAllyX+200,320, this.optionsForAllyWidth,this.optionsForAllyHeight,-10,'GenericBad1')}
    //     // this.optionsForAlly[9] = {option1: this.createDialogueOptions(this.speechBubbleAllyX+200,200, this.optionsForAllyWidth,this.optionsForAllyHeight,20,'GenericGood1'),option2: this.createDialogueOptions(this.speechBubbleAllyX+200,260, this.optionsForAllyWidth,this.optionsForAllyHeight,10,'GenericGood2'),option3: this.createDialogueOptions(this.speechBubbleAllyX+200,320, this.optionsForAllyWidth,this.optionsForAllyHeight,-10,'GenericBad1')}
    //     this.optionsForAlly[12] = {option1: this.createDialogueOptions(this.speechBubbleAllyX+200,200, this.optionsForAllyWidth,this.optionsForAllyHeight,20,this.genericAnswers[0]),option2: this.createDialogueOptions(this.speechBubbleAllyX+200,260, this.optionsForAllyWidth,this.optionsForAllyHeight,10,this.genericAnswers[1]),option3: this.createDialogueOptions(this.speechBubbleAllyX+200,320, this.optionsForAllyWidth,this.optionsForAllyHeight,-10,this.genericAnswers[2])}
    //     for(let i=13; i<42;i++) {
    //        
    //         this.optionsForAlly[i] = {option1: this.createDialogueOptions(this.speechBubbleAllyX+200,200, this.optionsForAllyWidth,this.optionsForAllyHeight,20,this.genericAnswers[0]),option2: this.createDialogueOptions(this.speechBubbleAllyX+200,260, this.optionsForAllyWidth,this.optionsForAllyHeight,10,this.genericAnswers[1]),option3: this.createDialogueOptions(this.speechBubbleAllyX+200,320, this.optionsForAllyWidth,this.optionsForAllyHeight,-10,this.genericAnswers[2])}
    //
    //     }
    //    
    //     let optionsForAlly = this.optionsForAlly;
    //     for (const item in optionsForAlly) {
    //         const itemObj = optionsForAlly[item];
    //         for (const item2 in itemObj) {
    //                 itemObj[item2].bubble.visible = false;
    //                 itemObj[item2].content.visible = false;
    //         }
    //     }
    //    
    // }
    
    

    

    // handleSpeech(timer){
    //     if(this.enemyDefeated){
    //         this.speechBubblesEnemy.forEach(bub => {
    //             bub.bubble.visible = false;
    //             bub.content.visible = false;
    //         });
    //         this.speechBubblesAlly.forEach(bub => {
    //             bub.bubble.visible = false;
    //             bub.content.visible = false;
    //         });
    //         let optionsForAlly = this.optionsForAlly;
    //         for (const item in optionsForAlly) {
    //             const itemObj = optionsForAlly[item];
    //             for (const item2 in itemObj) {
    //                 itemObj[item2].bubble.visible = false;
    //                 itemObj[item2].content.visible = false;
    //             }
    //         }
    //         return;
    //     } 
    //     if(this.timer>=6 && this.speechBubblesEnemy.length-1!==this.index){
    //         if(this.pauseConv){
    //             // this.pauseConv=false;
    //             // this.index++;
    //             // this.timer=0;
    //         }else if(!this.pauseConv){
    //             this.index++;
    //             this.timer=0;
    //             if(this.player.x<220.0 && this.enemy.x>550.0)
    //                 this.player.body.setVelocityX(7);
    //             if(this.enemy.x>550.0 && this.player.x<220.0)
    //                 this.enemy.body.setVelocityX(7);
    //             this.handleScore(-3);
    //             this.time.delayedCall(500,()=>{
    //                 this.player.body.setVelocityX(0);
    //                 this.enemy.body.setVelocityX(0);
    //                 console.log("Player x "+this.player.x+ " Enemy x "+this.enemy.x)
    //             })
    //         }
    //        
    //        
    //         this.speechBubblesEnemy[this.index-1].bubble.visible = false;
    //         this.speechBubblesEnemy[this.index-1].content.visible = false;
    //         this.speechBubblesEnemy[this.index].bubble.visible = true;
    //         this.speechBubblesEnemy[this.index].content.visible = true;
    //         if(this.speechBubblesAlly[this.index]){
    //             //this.pauseConv=true;
    //            
    //             this.time.delayedCall(1000,()=>{
    //                 if(this.speechBubblesAlly[this.index]) {
    //                     this.speechBubblesAlly[this.index].bubble.visible = true;
    //                     this.speechBubblesAlly[this.index].content.visible = true;
    //                 }
    //                
    //             })
    //            
    //         }
    //         if(this.speechBubblesAlly[this.index-1]){
    //             this.speechBubblesAlly[this.index-1].bubble.visible = false;
    //             this.speechBubblesAlly[this.index-1].content.visible = false;
    //         }
    //
    //      
    //        
    //         //Display the options.
    //         let optionsForAlly = this.optionsForAlly[this.index];
    //        
    //         if(optionsForAlly && !this.optionsForAlly[this.index].option1.bubble.visible){
    //             //Waiting for input from user.
    //             this.pauseConv=true;
    //             for(const item in optionsForAlly){
    //                 const itemObj = optionsForAlly[item];
    //                 for (const item2 in itemObj) {
    //                     if(item2!=="power")
    //                         itemObj[item2].visible = true;
    //                     if(item2==="content"){
    //                         itemObj[item2].on('pointerover',()=>{
    //                             itemObj[item2].setStyle({fill: '#308fef'});
    //                         })
    //                
    //                         itemObj[item2].on('pointerout',()=>{
    //                             itemObj[item2].setStyle({fill: '#0'});
    //                         })
    //                         itemObj[item2].on('pointerup',()=>{
    //                             this.pauseConv=false;
    //                             this.timer=3;
    //                             itemObj[item2].setStyle({fill: '#308fef'});
    //                             itemObj[item2].off('pointerup');
    //                             itemObj[item2].off('pointerover');
    //                             itemObj[item2].off('pointerout');
    //                             let option = item;
    //
    //                             this.handleScore(itemObj["power"]);
    //                            
    //                             this.time.delayedCall(2000,()=>{
    //                                 itemObj["bubble"].visible = false;
    //                                 itemObj["content"].visible = false;
    //                                 itemObj["bubble"].clear();
    //                             })
    //                             for(const item in optionsForAlly){
    //                                 const itemObj = optionsForAlly[item];
    //                                 for (const item2 in itemObj) {
    //                                     if(item2!=="power" && item!==option){
    //                                         itemObj[item2].visible = false;
    //                                        
    //                                         itemObj[item2].off('pointerout');
    //                                         itemObj[item2].off('pointerover');
    //                                     }
    //                                        
    //                                 }
    //                             }
    //                            
    //                            
    //                             let damage = null;
    //                            
    //                            
    //                             //textBG.strokeRoundedRect(0, 0, 20, 20, 16);
    //                            
    //                            
    //                             if(itemObj["power"]>0){
    //                                 if(this.player.x<220.0 && this.enemy.x>550.0)
    //                                     this.player.body.setVelocityX(-itemObj["power"]*2);
    //                                 if(this.enemy.x>550.0 && this.player.x<220.0)
    //                                     this.enemy.body.setVelocityX(-itemObj["power"]*2);
    //                                 this.time.delayedCall(500,()=>{
    //                                     this.player.body.setVelocityX(0);
    //                                     this.enemy.body.setVelocityX(0);
    //                                    
    //                                     this.createConversationBubbles();
    //                                 })
    //                                 damage = this.add.text(0,0, "+"+itemObj["power"], {
    //                                     fontStyle: 'bold',
    //                                     fontSize: '28px',
    //                                     fill: '#03fc52'
    //                                   }).setOrigin(0.5).setVisible(false).setActive(false);
    //                                
    //                             }else{
    //                                 this.player.body.setVelocityX(-itemObj["power"]*2);
    //                                 this.enemy.body.setVelocityX(-itemObj["power"]*2);
    //                                
    //                                 this.time.delayedCall(500,()=>{
    //                                     this.player.body.setVelocityX(0);
    //                                     this.enemy.body.setVelocityX(0);
    //                                     this.createConversationBubbles();
    //                                 })
    //                                 damage = this.add.text(0,0, itemObj["power"], {
    //                                     fontStyle: 'bold',
    //                                     fontSize: '28px',
    //                                     fill: '#FF0000'
    //                                   }).setOrigin(0.5).setVisible(false).setActive(false);
    //                             }
    //                             let textBG = this.add.graphics({ x: itemObj["bubble"].x+this.optionsForAllyWidth, y: itemObj["bubble"].y+this.optionsForAllyHeight/2 }).setVisible(false).setActive(false);
    //                             let heightOffset = 10;
    //                             textBG.fillStyle(0xffffff, 1);
    //                             textBG.fillRect(0, 0, damage.width,damage.height-heightOffset);
    //                             textBG.fillRect(0, 0, 52,52-heightOffset);
    //                             textBG.lineStyle(4, 0x565656, 1);
    //                             textBG.strokeRect(0,0,52,52-heightOffset);
    //                            
    //                             let points = [ itemObj["bubble"].x+this.optionsForAllyWidth+35, itemObj["bubble"].y+this.optionsForAllyHeight/2, 450, 40,110,100,100,25];
    //
    //                             let curve = new Phaser.Curves.Spline(points);
    //                             //THE FOLLOWING IS FOR DEBUGGING PURPOSES
    //                             // let graphics = this.add.graphics();
    //                             //
    //                             //
    //                             // graphics.lineStyle(1, 0xffffff, 1);
    //                             //
    //                             // curve.draw(graphics, 64);
    //                             //
    //                             // graphics.fillStyle(0x00ff00, 1);
    //                             //
    //                             // for (let i = 0; i < points.length; i++)
    //                             // {
    //                             //     graphics.fillCircle(points[i].x, points[i].y, 4);
    //                             // }
    //                             let rt =this.add.renderTexture(0,0,800,600);
    //                             let rtBG =this.add.renderTexture(0,0,800,600);
    //                             rtBG.draw(textBG,400,300).setVisible(false).setActive(false);
    //                             rt.draw(damage,400,300).setVisible(false).setActive(false);
    //                            
    //                            
    //                             let rtFollow =this.add.follower(curve,itemObj["bubble"].x+this.optionsForAllyWidth+35, itemObj["bubble"].y+this.optionsForAllyHeight/2+4,rt.texture).setDepth(5);
    //                             let rtFollowBG =this.add.follower(curve,itemObj["bubble"].x+this.optionsForAllyWidth+8, itemObj["bubble"].y+(this.optionsForAllyHeight/2)-18,rtBG.texture).setDepth(4);
    //                            
    //                             this.time.delayedCall(1000,()=>{
    //                                 rtFollow.startFollow(1500);
    //                                 rtFollowBG.startFollow(1500);
    //                             })
    //                             this.time.delayedCall(2600,()=>{
    //                                 rtFollow.destroy();
    //                                 rtFollowBG.destroy();
    //                             })
    //
    //                             //Create let go button
    //                             if(this.score>=80){
    //                                 this.time.delayedCall(1000,()=>{
    //                                     if(this.letgoText){
    //                                         this.letgoText.bubble.setVisible(true);
    //                                         this.letgoText.content.setVisible(true);
    //                                     }
    //                                 })
    //                             }else{
    //                                 if(this.letgoText){
    //                                     this.letgoText.bubble.setVisible(false);
    //                                     this.letgoText.content.setVisible(false);
    //                                 }
    //                                    
    //                             }
    //                                
    //                            
    //                             console.log("CLicked with power: "+itemObj["power"]);
    //                             console.log("Score: "+this.score);
    //                         })
    //                     } 
    //                 }
    //             }
    //            
    //         }
    //         //Remove the options.
    //         // optionsForAlly = this.optionsForAlly[this.index-1];
    //         // if(optionsForAlly){
    //            
    //         //     for(const item in optionsForAlly){
    //         //         const itemObj = optionsForAlly[item];
    //         //         for (const item2 in itemObj) {
    //         //             if(item2!="power")
    //         //                 itemObj[item2].visible = false;
    //         //         }
    //         //     }
    //            
    //         // }
    //
    //        
    //     }
    // }
    //

    


    

}
export default Play;