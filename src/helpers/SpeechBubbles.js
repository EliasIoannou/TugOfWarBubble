export default {
    createSpeechBubble (x, y, width, height, quote)
    {
        var bubbleWidth = width;
        var bubbleHeight = height;
        var bubblePadding = 10;
        var arrowHeight = bubbleHeight / 4;

        var bubble = this.add.graphics({ x: x, y: y });

        //  Bubble shadow
        bubble.fillStyle(0x222222, 0.5);
        bubble.fillRoundedRect(6, 6, bubbleWidth, bubbleHeight, 16);

        //  Bubble color
        bubble.fillStyle("0xffffff", 1);
        
        //  Bubble outline line style
        bubble.lineStyle(4, 0x565656, 1);

        //  Bubble shape and outline
        bubble.strokeRoundedRect(0, 0, bubbleWidth, bubbleHeight, 16);
        bubble.fillRoundedRect(0, 0, bubbleWidth, bubbleHeight, 16);

        //  Calculate arrow coordinates
        var point1X = Math.floor(bubbleWidth / 7);
        var point1Y = bubbleHeight;
        var point2X = Math.floor((bubbleWidth / 7) * 2);
        var point2Y = bubbleHeight;
        var point3X = Math.floor(bubbleWidth / 7);
        var point3Y = Math.floor(bubbleHeight + arrowHeight);

        //  Bubble arrow shadow
        bubble.lineStyle(4, 0x222222, 0.5);
        bubble.lineBetween(point2X - 1, point2Y + 6, point3X + 2, point3Y);

        //  Bubble arrow fill
        bubble.fillTriangle(point1X, point1Y, point2X, point2Y, point3X, point3Y);
        bubble.lineStyle(2, 0x565656, 1);
        bubble.lineBetween(point2X, point2Y, point3X, point3Y);
        bubble.lineBetween(point1X, point1Y, point3X, point3Y);

        var content = this.add.text(0, 0, quote, { fontFamily: 'Arial', fontSize: 20, color: '#000000', align: 'center', wordWrap: { width: bubbleWidth - (bubblePadding * 2) } });

        var b = content.getBounds();

        content.setPosition(bubble.x + (bubbleWidth / 2) - (b.width / 2), bubble.y + (bubbleHeight / 2) - (b.height / 2));
        
        return {bubble,content};
    },

    createDialogueOptions (x, y, width, height, power, quote)
    {
        var bubbleWidth = width;
        var bubbleHeight = height;
        var bubblePadding = 10;
        var bubble = this.add.graphics({ x: x, y: y });
        //  Bubble shadow
        bubble.fillStyle(0x222222, 0.5);
        bubble.fillRoundedRect(6, 6, bubbleWidth, bubbleHeight, 16);

        //  Bubble color
        if(power!==100)
            bubble.fillStyle(0xffffff, 1);
        else
            bubble.fillStyle(0xb46cff, 1);
        '#852cff'
        //  Bubble outline line styledsd
        bubble.lineStyle(4, 0x565656, 1);

        //  Bubble shape and outline dfd
        bubble.strokeRoundedRect(0, 0, bubbleWidth, bubbleHeight, 16);
        bubble.fillRoundedRect(0, 0, bubbleWidth, bubbleHeight, 16);

        bubble.setInteractive(new Phaser.Geom.Rectangle(0, 0, width, height), Phaser.Geom.Rectangle.Contains);
        bubble.on('pointerover',()=>{
            if(power!==100)
                bubble= this.redrawDialogue(bubble,0xffe70a,x,y, bubbleWidth, bubbleHeight);
            else
                bubble= this.redrawDialogue(bubble,0x852cff,x,y, bubbleWidth, bubbleHeight);
        })
        bubble.on('pointerout',()=>{
            if(power!==100)
                bubble=this.redrawDialogue(bubble,0xffffff,x,y, bubbleWidth, bubbleHeight);
            else
                bubble= this.redrawDialogue(bubble,0xb46cff,x,y, bubbleWidth, bubbleHeight);
        })
        bubble.setDepth(1);
        var content = this.add.text(0, 0, quote, { fontFamily: 'Arial', fontSize: 20, color: '#000000', align: 'center', wordWrap: { width: bubbleWidth - (bubblePadding * 2) } });
        content.setInteractive();
        
        content.on('pointerover',()=>{
            if(power!==100)
                bubble=this.redrawDialogue(bubble,0xffe70a,x,y, bubbleWidth, bubbleHeight);
            else
                bubble= this.redrawDialogue(bubble,0x852cff,x,y, bubbleWidth, bubbleHeight);
        })
        content.on('pointerout',()=>{
            if(power!==100)
                bubble=this.redrawDialogue(bubble,0xffffff,x,y, bubbleWidth, bubbleHeight);
            else
                bubble= this.redrawDialogue(bubble,0xb46cff,x,y, bubbleWidth, bubbleHeight);
        })
       
        content.setDepth(2);
        var b = content.getBounds();

        content.setPosition(bubble.x + (bubbleWidth / 2) - (b.width / 2), bubble.y + (bubbleHeight / 2) - (b.height / 2));
        
        return {bubble,content,power};
    },
    
    redrawDialogue(bubble,color,x,y,bubbleWidth,bubbleHeight,power){
        bubble.clear();
        
        //bubble = this.add.graphics({ x: x, y: y });
        
        bubble.setDepth(1);
        bubble.fillStyle(0x222222, 0.5);
        bubble.fillRoundedRect(6, 6, bubbleWidth, bubbleHeight, 16);

        //  Bubble color
        bubble.fillStyle(color, 1);

        //  Bubble outline line style
        bubble.lineStyle(4, 0x565656, 1);

        //  Bubble shape and outline
        bubble.strokeRoundedRect(0, 0, bubbleWidth, bubbleHeight, 16);
        bubble.fillRoundedRect(0, 0, bubbleWidth, bubbleHeight, 16);
        return bubble;
    }
}