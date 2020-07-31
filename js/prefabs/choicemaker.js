class ChoiceMaker extends Phaser.GameObjects.Group {
    /**
     * ASSUMINDO QUE A CAIXA DE TEXTO TERÁ 320 PIXELS DE ALTURA
     */
    
    constructor (config) {
        super(config.scene);

        //mantendo referência à cena atual
        this.scene = config.scene;

        //controladores auxiliares
        this.estaEmCena = false;
        this.callback1 = false;
        this.callback2 = false;
        this.callback3 = false;

        //Elementos gráficos
        this.msgbox = this.create(game.config.width/2,game.config.height,"txtbox").setOrigin(0.5,0);
        this.msgtxt = this.scene.add.text(40,game.config.height, "",txtStyle2).setOrigin(0,0);
        this.add(this.msgtxt);
        
        this.choicebox1 = this.create(game.config.width/2,game.config.height/2,"txtbox").setOrigin(0.5,0.5).setScale(0.75,0.25);
        this.add(this.choicebox1);

        this.textween = this.scene.tweens.add({
            targets: this.msgtxt,
            alpha: { from: 0, to: 1 },
            y: { from: game.config.height, to: game.config.height - 300 },
            ease: 'Linear',
            duration: 500,
            repeat: 0,
            paused: true
        });

        this.textween.on('complete', function(tween, targets){
            this.estaEmCena = true;
            this.choicebox1.setVisible(true);
        }, this);
        
        this.fieldween = this.scene.tweens.add({
            targets: this.msgbox,
            y: { from: game.config.height, to: game.config.height - 320 },
            ease: 'Back',
            duration: 1000,
            repeat: 0,
            paused: true
        });

        this.fieldween.on('complete', function(tween, targets){
            this.textween.play();
        }, this);

        this.fieldweenOut = this.scene.tweens.add({
            targets: this.msgbox,
            y: { from: game.config.height - 320, to: game.config.height},
            ease: 'Back',
            duration: 1000,
            repeat: 0,
            paused: true
        });

        this.fieldweenOut.on('complete', function(tween, targets){
            this.msgtxt.y = game.config.height;
            this.setVisible(false);
        }, this);
        
        //Adicionando à cena atual
        config.scene.add.existing(this);
        config.scene.physics.add.existing(this);

        this.setVisible(false);
    }

    showQuestion(txt,answersArr,callback1,callback2,callback3){
        this.setVisible(true);
        this.paragrafo = 0;
        this.callback1 = callback1;
        this.callback2 = callback2;
        this.callback3 = typeof callback3 == 'undefined' ? false : callback3;

        this.msgbox.y = game.config.height;
        this.msgtxt.alpha = 0;
        this.msgtxt.y = game.config.height;
        this.msgtxt.text = txt;

        console.log(answersArr);
        this.choicebox1.setVisible(false);
        
        this.fieldween.play();
        this.podePassar = false;
    }

    /*updateMessage(){
        if (this.podePassar){
            this.msgtxt.alpha = 0;
            this.msgtxt.y = game.config.height;
            this.paragrafo++;
            if (this.paragrafo >= this.msgBuffer.length ){
                this.closeMessage();
            }else{
                this.msgtxt.text = this.msgBuffer[this.paragrafo];
                this.podePassar = false;
                this.textween.play();
            }
        }
    }*/

    close(){
        this.msgtxt.alpha = 0;
        this.msgtxt.y = game.config.height;
        this.estaEmCena = false;
        this.fieldweenOut.play();
        if (typeof this.callback == 'function') {
            this.callback();
        }
        this.callback = false;
    }
    
}