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

        this.speechBubblesEnemy = [];
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

        this.optionsForAllyWidth = 200;
        this.optionsForAllyHeight = 50;
        this.letgoText = null;
        this.respondButton = null;
        this.createRespondOnce = false;
        this.doOnce = false;
        
        this.score = 0;
        this.phase2Index = 11;
        
        
    }
    
    create () {
        this.add.image(400, 300, 'sky').setDepth(-10);
        
        this.createConversationBubbles();
        this.createBtn();
        
        this.createOptionBubbles();
        this.scoreDisplay = new HealthBar(this,10,10,2,this.score);
        this.ropes = this.createRope();
        this.createGround();
        this.createPlayer();
        initAnims(this.anims);
        
        //const rope = this.add.rope(50,50,'rope',null,12);
    }

    createPlayer(){
        this.player =this.physics.add.sprite(this.config.width*1.3/8,  this.config.height*6.82/10, 'girl').setOrigin(0.5);
        this.enemy= this.physics.add.sprite(this.config.width*6.1/8,  this.config.height*6.82/10, 'girl').setFlipX(true).setTint(0xFF0000).setDepth(20).setOrigin(0.5);
        
    }
    createRespond(){
        this.respondButton = this.createDialogueOptions(225,500,400,80,100,'Respond');
        this.respondButton.content.setStyle({fontSize: '48px'})
        this.respondButton.content.x = 150+this.letgoText.content.width;
        this.respondButton.content.y -= 15;
        
        this.respondButton.content.on('pointerover',()=>{
            this.respondButton.content.setStyle({fill: '#d000ff'});
        })
        this.respondButton.content.on('pointerout',()=>{
            this.respondButton.content.setStyle({fill: '#0'});
        })
        this.respondButton.content.on('pointerup',()=>{
            //Alternative behavior:
            // let rocket = this.physics.add.sprite(400, 300, 'rocket').setDepth(4);
            // rocket.setVelocityX(20);
            // this.time.delayedCall(2000,()=>{
            //     rocket.destroy();
            //     this.createSpeechBubble(this.speechBubbleEnemyX,50, 200,200,'AAAAAAAAA\nAAAAAAAAA\n\nYOU %@@#$%%&^@');
            //     this.startRotationEnemy=true;
            //     this.enemy.body.setVelocity(150,-250);
            //     this.letgoText.bubble.setVisible(false).setActive(false);
            //     this.letgoText.content.setVisible(false).setActive(false);
            // })
            //this.openExternalLink('https://www.betterhelp.com/');
            this.respondButton.bubble.visible=false;
            this.respondButton.content.visible=false;
            this.pauseConv=false;
            this.timer=4;
        })
    }
    createBtn(){
        this.letgoText = this.createDialogueOptions(225,500,400,80,100,'LET GO');
        this.letgoText.content.setStyle({fontSize: '48px'})
        this.letgoText.content.x = 150+this.letgoText.content.width;
        this.letgoText.content.y -= 15;

        this.letgoText.bubble.visible=false;
        this.letgoText.content.visible=false;
        this.letgoText.content.on('pointerover',()=>{
            this.letgoText.content.setStyle({fill: '#d000ff'});
        })
        this.letgoText.content.on('pointerout',()=>{
            this.letgoText.content.setStyle({fill: '#0'});
        })
        this.letgoText.content.on('pointerup',()=>{
            //Alternative behavior:
            // let rocket = this.physics.add.sprite(400, 300, 'rocket').setDepth(4);
            // rocket.setVelocityX(20);
            // this.time.delayedCall(2000,()=>{
            //     rocket.destroy();
            //     this.createSpeechBubble(this.speechBubbleEnemyX,50, 200,200,'AAAAAAAAA\nAAAAAAAAA\n\nYOU %@@#$%%&^@');
            //     this.startRotationEnemy=true;
            //     this.enemy.body.setVelocity(150,-250);
            //     this.letgoText.bubble.setVisible(false).setActive(false);
            //     this.letgoText.content.setVisible(false).setActive(false);
            // })
            //this.openExternalLink('https://www.betterhelp.com/');
            this.letgoText.bubble.visible=false;
            this.letgoText.content.visible=false;
            this.enemyDefeated=true;
            this.enemy.play('girl-let-go',true);
            this.player.stop(null,true);
            this.player.setTexture('girlLetGo');
            this.ropes.forEach(rope=>{
                rope.setGravityY(200);
            })
        })
    }
    openExternalLink (url)
    {
        var s = window.open(url, '_blank');

        if (s && s.focus)
        {
            s.focus();
        }
        else if (!s)
        {
            window.location.href = url;
        }
    }

    createRope(){
        let ropes =[];
        let distance = 0;
        for(let i=0; i<6; i++){
            ropes.push(this.physics.add.sprite((this.config.width*1/6)+distance, this.config.height*7.01/10, 'rope'));
            
            distance+=96;
        }
        
        
        return ropes;
    }
    
    createGround(){
        let ground =[];
        let distance = 0;
        for(let i=0; i<6; i++){
            if(i===1)
                ground.push(this.add.image(distance, this.config.height, 'groundEdge').setOrigin(1).setDepth(-1));
            else if(i===2)
                console.log("hi");
            else if(i===3)
                ground.push(this.add.image(distance, this.config.height, 'groundEdge').setOrigin(1).setDepth(-1).setFlipX(true));
            else
                ground.push(this.add.image(distance, this.config.height, 'groundEdge').setOrigin(1).setDepth(-1));
            distance+=256;
        }
    }
    
    generateRandomInsult(){
        let rand = Math.floor(Math.random()*((this.randomInsults.length-1)-0+1)+0);
        return this.randomInsults[rand];
    }

    generateCatchPhrase(){
        let rand = Math.floor(Math.random()*((this.catchphrases.length-1)-0+1)+0);
        return this.catchphrases[rand];
    }

    createConversationBubbles(){
        if(this.index>0) {
            this.speechBubblesEnemy.forEach(bub => {
                bub.bubble.visible = false;
                bub.content.visible = false;
            });
            this.speechBubblesAlly.forEach(bub => {
                bub.bubble.visible = false;
                bub.content.visible = false;
            });
        }
        this.speechBubblesEnemy[0] = this.createSpeechBubble(this.speechBubbleEnemyX,50, 200,200,'You are the definition of worthlessness.');
        this.speechBubblesEnemy[1] = this.createSpeechBubble(this.speechBubbleEnemyX,50, 200,200,'How can you even look yourself in the mirror?');
        this.speechBubblesEnemy[2] = this.createSpeechBubble(this.speechBubbleEnemyX,50, 200,200,'I am certain it is not a pretty picture.');
        this.speechBubblesEnemy[3] = this.createSpeechBubble(this.speechBubbleEnemyX,50, 200,200,'Have you seen Jessica? \nShe has a new boyfriend again. \n\nYet... you are alone.');
        this.speechBubblesEnemy[4] = this.createSpeechBubble(this.speechBubbleEnemyX,50, 200,200,'Oh surprise surprise, here come the waterworks again. Why are you even crying you are doing nothing to improve your situation.');
        this.speechBubblesEnemy[5] = this.createSpeechBubble(this.speechBubbleEnemyX,50, 200,200,'There are people suffering from deadly diseases and hunger and you are crying for meaningless stuff.');
        this.speechBubblesEnemy[6] = this.createSpeechBubble(this.speechBubbleEnemyX,50, 200,200,'Suffering from what exactly? Not being hot enough? Not being liked enough? Not being PERFECT ENOUGH?');
        this.speechBubblesEnemy[7] = this.createSpeechBubble(this.speechBubbleEnemyX,50, 200,240,'Oh cry me a river, rocket science is not simple. This however, is. \nI have been with you since that day Riley called you fat in front of your friends in Middle School.');
        this.speechBubblesEnemy[8] = this.createSpeechBubble(this.speechBubbleEnemyX,50, 200,200,'Do you remember that day?');
        this.speechBubblesEnemy[9] = this.createSpeechBubble(this.speechBubbleEnemyX,50, 200,200,'You started watching what you ate in front of people. Feeling weird everytime you opened your mouth because someone might mention something.');
        this.speechBubblesEnemy[10] = this.createSpeechBubble(this.speechBubbleEnemyX,50, 200,200,'Its been 10 years since then. Nothing has changed. Still scared of eating even though you have nobody judging you, well asides from me of course.');
        this.speechBubblesEnemy[11] = this.createSpeechBubble(this.speechBubbleEnemyX,50, 200,200,'Kind of ironic. Begging yourself to stop telling you the things you do not want to hear.');
        this.speechBubblesEnemy[12] = this.createSpeechBubble(this.speechBubbleEnemyX,50, 200,200,this.generateRandomInsult());
        for(let i=13; i<43;i++){
            this.speechBubblesEnemy[i] = this.createSpeechBubble(this.speechBubbleEnemyX,50, 200,200,this.generateRandomInsult());
        }

        
        // this.speechBubblesAlly[5] = this.createSpeechBubble(this.speechBubbleAllyX,50, 200,200,'SHUT UP!! It is not meaningless to me, I am suffering too.');
        // this.speechBubblesAlly[6] = this.createSpeechBubble(this.speechBubbleAllyX,50, 200,200,'It....it..its not that simple.. I am...');
        // this.speechBubblesAlly[8] = this.createSpeechBubble(this.speechBubbleAllyX,50, 200,50,'I..*sniffles* I do.');
        // this.speechBubblesAlly[10] = this.createSpeechBubble(this.speechBubbleAllyX,50, 200,70,'Please... stop this. STOP THIS!! I AM BEGGING YOU.');

        this.speechBubblesEnemy.forEach(bub => {
            bub.bubble.visible = false;
            bub.content.visible = false;
        });
        this.speechBubblesAlly.forEach(bub => {
            bub.bubble.visible = false;
            bub.content.visible = false;
        });
        if(this.index===0){
            this.speechBubblesEnemy[0].bubble.visible = true;
            this.speechBubblesEnemy[0].content.visible = true;
        }
        
        
        
    }

    createOptionBubbles(){
        // this.optionsForAlly[2] = {option1: this.createDialogueOptions(this.speechBubbleAllyX+200,200, this.optionsForAllyWidth,this.optionsForAllyHeight,60,'Do not talk to me like that.'),option2: this.createDialogueOptions(this.speechBubbleAllyX+200,260, this.optionsForAllyWidth,this.optionsForAllyHeight,15,'Fuck off buddy.'),option3: this.createDialogueOptions(this.speechBubbleAllyX+200,320, this.optionsForAllyWidth,this.optionsForAllyHeight,-10,'You are right I suck.')}
        // this.optionsForAlly[4] = {option1: this.createDialogueOptions(this.speechBubbleAllyX+200,200, this.optionsForAllyWidth,this.optionsForAllyHeight,10,'Cray Cray.'),option2: this.createDialogueOptions(this.speechBubbleAllyX+200,260, this.optionsForAllyWidth,this.optionsForAllyHeight,20,'Fuck off dude.'),option3: this.createDialogueOptions(this.speechBubbleAllyX+200,320, this.optionsForAllyWidth,this.optionsForAllyHeight,-10,'You are right I suck.')}
        // this.optionsForAlly[7] = {option1: this.createDialogueOptions(this.speechBubbleAllyX+200,200, this.optionsForAllyWidth,this.optionsForAllyHeight,20,'GenericGood1'),option2: this.createDialogueOptions(this.speechBubbleAllyX+200,260, this.optionsForAllyWidth,this.optionsForAllyHeight,10,'GenericGood2'),option3: this.createDialogueOptions(this.speechBubbleAllyX+200,320, this.optionsForAllyWidth,this.optionsForAllyHeight,-10,'GenericBad1')}
        // this.optionsForAlly[9] = {option1: this.createDialogueOptions(this.speechBubbleAllyX+200,200, this.optionsForAllyWidth,this.optionsForAllyHeight,20,'GenericGood1'),option2: this.createDialogueOptions(this.speechBubbleAllyX+200,260, this.optionsForAllyWidth,this.optionsForAllyHeight,10,'GenericGood2'),option3: this.createDialogueOptions(this.speechBubbleAllyX+200,320, this.optionsForAllyWidth,this.optionsForAllyHeight,-10,'GenericBad1')}
        this.optionsForAlly[12] = {option1: this.createDialogueOptions(this.speechBubbleAllyX+200,200, this.optionsForAllyWidth,this.optionsForAllyHeight,20,this.genericAnswers[0]),option2: this.createDialogueOptions(this.speechBubbleAllyX+200,260, this.optionsForAllyWidth,this.optionsForAllyHeight,10,this.genericAnswers[1]),option3: this.createDialogueOptions(this.speechBubbleAllyX+200,320, this.optionsForAllyWidth,this.optionsForAllyHeight,-10,this.genericAnswers[2])}
        for(let i=13; i<42;i++) {
            
            this.optionsForAlly[i] = {option1: this.createDialogueOptions(this.speechBubbleAllyX+200,200, this.optionsForAllyWidth,this.optionsForAllyHeight,20,this.genericAnswers[0]),option2: this.createDialogueOptions(this.speechBubbleAllyX+200,260, this.optionsForAllyWidth,this.optionsForAllyHeight,10,this.genericAnswers[1]),option3: this.createDialogueOptions(this.speechBubbleAllyX+200,320, this.optionsForAllyWidth,this.optionsForAllyHeight,-10,this.genericAnswers[2])}

        }
        
        let optionsForAlly = this.optionsForAlly;
        for (const item in optionsForAlly) {
            const itemObj = optionsForAlly[item];
            for (const item2 in itemObj) {
                    itemObj[item2].bubble.visible = false;
                    itemObj[item2].content.visible = false;
            }
        }
        
    }
    
    

    handleScore(points){
        this.score+=points;
        if(this.score<=0)
            this.score=0;
        if(this.score>=83)
            this.score=83;
        this.scoreDisplay.change(this.score);
        
    }

    handleSpeech(timer){
        if(this.enemyDefeated){
            this.speechBubblesEnemy.forEach(bub => {
                bub.bubble.visible = false;
                bub.content.visible = false;
            });
            this.speechBubblesAlly.forEach(bub => {
                bub.bubble.visible = false;
                bub.content.visible = false;
            });
            let optionsForAlly = this.optionsForAlly;
            for (const item in optionsForAlly) {
                const itemObj = optionsForAlly[item];
                for (const item2 in itemObj) {
                    itemObj[item2].bubble.visible = false;
                    itemObj[item2].content.visible = false;
                }
            }
            return;
        } 
        if(this.timer>=6 && this.speechBubblesEnemy.length-1!==this.index){
            if(this.pauseConv){
                // this.pauseConv=false;
                // this.index++;
                // this.timer=0;
            }else if(!this.pauseConv){
                this.index++;
                this.timer=0;
                if(this.player.x<220.0 && this.enemy.x>550.0)
                    this.player.body.setVelocityX(7);
                if(this.enemy.x>550.0 && this.player.x<220.0)
                    this.enemy.body.setVelocityX(7);
                this.handleScore(-3);
                this.time.delayedCall(500,()=>{
                    this.player.body.setVelocityX(0);
                    this.enemy.body.setVelocityX(0);
                    console.log("Player x "+this.player.x+ " Enemy x "+this.enemy.x)
                })
            }
            
            
            this.speechBubblesEnemy[this.index-1].bubble.visible = false;
            this.speechBubblesEnemy[this.index-1].content.visible = false;
            this.speechBubblesEnemy[this.index].bubble.visible = true;
            this.speechBubblesEnemy[this.index].content.visible = true;
            if(this.speechBubblesAlly[this.index]){
                //this.pauseConv=true;
                
                this.time.delayedCall(1000,()=>{
                    if(this.speechBubblesAlly[this.index]) {
                        this.speechBubblesAlly[this.index].bubble.visible = true;
                        this.speechBubblesAlly[this.index].content.visible = true;
                    }
                    
                })
                
            }
            if(this.speechBubblesAlly[this.index-1]){
                this.speechBubblesAlly[this.index-1].bubble.visible = false;
                this.speechBubblesAlly[this.index-1].content.visible = false;
            }

          
            
            //Display the options.
            let optionsForAlly = this.optionsForAlly[this.index];
            
            if(optionsForAlly && !this.optionsForAlly[this.index].option1.bubble.visible){
                //Waiting for input from user.
                this.pauseConv=true;
                for(const item in optionsForAlly){
                    const itemObj = optionsForAlly[item];
                    for (const item2 in itemObj) {
                        if(item2!=="power")
                            itemObj[item2].visible = true;
                        if(item2==="content"){
                            itemObj[item2].on('pointerover',()=>{
                                itemObj[item2].setStyle({fill: '#308fef'});
                            })
                    
                            itemObj[item2].on('pointerout',()=>{
                                itemObj[item2].setStyle({fill: '#0'});
                            })
                            itemObj[item2].on('pointerup',()=>{
                                this.pauseConv=false;
                                this.timer=3;
                                itemObj[item2].setStyle({fill: '#308fef'});
                                itemObj[item2].off('pointerup');
                                itemObj[item2].off('pointerover');
                                itemObj[item2].off('pointerout');
                                let option = item;

                                this.handleScore(itemObj["power"]);
                                
                                this.time.delayedCall(2000,()=>{
                                    itemObj["bubble"].visible = false;
                                    itemObj["content"].visible = false;
                                    itemObj["bubble"].clear();
                                })
                                for(const item in optionsForAlly){
                                    const itemObj = optionsForAlly[item];
                                    for (const item2 in itemObj) {
                                        if(item2!=="power" && item!==option){
                                            itemObj[item2].visible = false;
                                            
                                            itemObj[item2].off('pointerout');
                                            itemObj[item2].off('pointerover');
                                        }
                                            
                                    }
                                }
                                
                                
                                let damage = null;
                                
                                
                                //textBG.strokeRoundedRect(0, 0, 20, 20, 16);
                                
                                
                                if(itemObj["power"]>0){
                                    if(this.player.x<220.0 && this.enemy.x>550.0)
                                        this.player.body.setVelocityX(-itemObj["power"]*2);
                                    if(this.enemy.x>550.0 && this.player.x<220.0)
                                        this.enemy.body.setVelocityX(-itemObj["power"]*2);
                                    this.time.delayedCall(500,()=>{
                                        this.player.body.setVelocityX(0);
                                        this.enemy.body.setVelocityX(0);
                                        
                                        this.createConversationBubbles();
                                    })
                                    damage = this.add.text(0,0, "+"+itemObj["power"], {
                                        fontStyle: 'bold',
                                        fontSize: '28px',
                                        fill: '#03fc52'
                                      }).setOrigin(0.5).setVisible(false).setActive(false);
                                    
                                }else{
                                    this.player.body.setVelocityX(-itemObj["power"]*2);
                                    this.enemy.body.setVelocityX(-itemObj["power"]*2);
                                    
                                    this.time.delayedCall(500,()=>{
                                        this.player.body.setVelocityX(0);
                                        this.enemy.body.setVelocityX(0);
                                        this.createConversationBubbles();
                                    })
                                    damage = this.add.text(0,0, itemObj["power"], {
                                        fontStyle: 'bold',
                                        fontSize: '28px',
                                        fill: '#FF0000'
                                      }).setOrigin(0.5).setVisible(false).setActive(false);
                                }
                                let textBG = this.add.graphics({ x: itemObj["bubble"].x+this.optionsForAllyWidth, y: itemObj["bubble"].y+this.optionsForAllyHeight/2 }).setVisible(false).setActive(false);
                                let heightOffset = 10;
                                textBG.fillStyle(0xffffff, 1);
                                textBG.fillRect(0, 0, damage.width,damage.height-heightOffset);
                                textBG.fillRect(0, 0, 52,52-heightOffset);
                                textBG.lineStyle(4, 0x565656, 1);
                                textBG.strokeRect(0,0,52,52-heightOffset);
                                
                                let points = [ itemObj["bubble"].x+this.optionsForAllyWidth+35, itemObj["bubble"].y+this.optionsForAllyHeight/2, 450, 40,110,100,100,25];

                                let curve = new Phaser.Curves.Spline(points);
                                //THE FOLLOWING IS FOR DEBUGGING PURPOSES
                                // let graphics = this.add.graphics();
                                //
                                //
                                // graphics.lineStyle(1, 0xffffff, 1);
                                //
                                // curve.draw(graphics, 64);
                                //
                                // graphics.fillStyle(0x00ff00, 1);
                                //
                                // for (let i = 0; i < points.length; i++)
                                // {
                                //     graphics.fillCircle(points[i].x, points[i].y, 4);
                                // }
                                let rt =this.add.renderTexture(0,0,800,600);
                                let rtBG =this.add.renderTexture(0,0,800,600);
                                rtBG.draw(textBG,400,300).setVisible(false).setActive(false);
                                rt.draw(damage,400,300).setVisible(false).setActive(false);
                                
                                
                                let rtFollow =this.add.follower(curve,itemObj["bubble"].x+this.optionsForAllyWidth+35, itemObj["bubble"].y+this.optionsForAllyHeight/2+4,rt.texture).setDepth(5);
                                let rtFollowBG =this.add.follower(curve,itemObj["bubble"].x+this.optionsForAllyWidth+8, itemObj["bubble"].y+(this.optionsForAllyHeight/2)-18,rtBG.texture).setDepth(4);
                                
                                this.time.delayedCall(1000,()=>{
                                    rtFollow.startFollow(1500);
                                    rtFollowBG.startFollow(1500);
                                })
                                this.time.delayedCall(2600,()=>{
                                    rtFollow.destroy();
                                    rtFollowBG.destroy();
                                })

                                //Create let go button
                                if(this.score>=80){
                                    this.time.delayedCall(1000,()=>{
                                        if(this.letgoText){
                                            this.letgoText.bubble.setVisible(true);
                                            this.letgoText.content.setVisible(true);
                                        }
                                    })
                                }else{
                                    if(this.letgoText){
                                        this.letgoText.bubble.setVisible(false);
                                        this.letgoText.content.setVisible(false);
                                    }
                                        
                                }
                                    
                                
                                console.log("CLicked with power: "+itemObj["power"]);
                                console.log("Score: "+this.score);
                            })
                        } 
                    }
                }
                
            }
            //Remove the options.
            // optionsForAlly = this.optionsForAlly[this.index-1];
            // if(optionsForAlly){
                
            //     for(const item in optionsForAlly){
            //         const itemObj = optionsForAlly[item];
            //         for (const item2 in itemObj) {
            //             if(item2!="power")
            //                 itemObj[item2].visible = false;
            //         }
            //     }
                
            // }

            
        }
    }

    handleRopeAnims(){
        // if(this.switchDir){
        //     this.ropes.forEach(rope => {
        //         rope.setX(rope.x -.2);
        //     });
        // }  
        // else{
        //     this.ropes.forEach(rope => {
        //         rope.setX(rope.x +.2);
        //     });
        // }
    }

    update(time,delta){
        if(!this.pauseConv)
            this.timer+=delta/1000;
        this.animationTimer+=delta/1000;
        
        if(this.index===this.phase2Index && !this.createRespondOnce){
            this.createRespondOnce=true;
            this.pauseConv=true;
            this.time.delayedCall(3000,()=>{
                this.createRespond();
            })
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
        if(this.enemy.x<550.0 && !this.doOnce){
            this.pauseConv=true;
            this.timer=4;
            this.doOnce=true;
            let conv=this.createSpeechBubble(this.speechBubbleEnemyX,50, 200,200,this.generateCatchPhrase());
            this.time.delayedCall(3000,()=>{
                this.player.setVelocityX(100);
                this.enemy.setVelocityX(100);
                this.time.delayedCall(500,()=>{
                    this.player.setVelocityX(0);
                    this.enemy.setVelocityX(0);
                    this.doOnce=false;
                    this.pauseConv=false;
                    conv.bubble.visible=false;
                    conv.content.visible=false;
                })
            })
        }else{
            this.handleSpeech(this.timer);
        }
        

        this.handleRopeAnims();
        
        if(!this.enemyDefeated)
            this.player.play('girl-pulling',true);
        
        if(time/1000>3&&!this.enemyDefeated)
            this.enemy.play('girl-pulling',true);
        
        // this.ropes.forEach(rope => {
        //     rope.setX(rope.x -100);
            
        // });
        
    }


    

}
export default Play;