class Messenger extends Phaser.GameObjects.Group {
    /**
     * ASSUMINDO QUE A CAIXA DE TEXTO TERÁ 320 PIXELS DE ALTURA
     */
    
    constructor (config) {
        super(config.scene);

        //mantendo referência à cena atual
        this.scene = config.scene;

        //controladores auxiliares
        this.podePassar = false;
        this.msgBuffer = [];
        this.paragrafo = 0;
        this.estaEmCena = false;
        this.callback = false;

        //Elementos gráficos
        this.msgbox = this.create(game.config.width/2,game.config.height,"txtbox").setOrigin(0.5,0);
        this.msgtxt = this.scene.add.text(40,game.config.height, "",txtStyle2).setOrigin(0,0);
        this.add(this.msgtxt);

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
            this.podePassar = true;
        }, this);
        
        this.fieldween = this.scene.tweens.add({
            targets: this.msgbox,
            y: { from: game.config.height, to: game.config.height - 320 },
            ease: 'Linear',
            duration: 250,
            repeat: 0,
            paused: true
        });

        this.fieldween.on('complete', function(tween, targets){
            this.textween.play();
        }, this);

        this.fieldweenOut = this.scene.tweens.add({
            targets: this.msgbox,
            y: { from: game.config.height - 320, to: game.config.height},
            ease: 'Linear',
            duration: 250,
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

    showMessage(msgArr,callback){
        this.setVisible(true);
        this.msgBuffer = msgArr;
        this.paragrafo = 0;
        this.callback = callback;

        this.msgbox.y = game.config.height;
        this.msgtxt.alpha = 0;
        this.msgtxt.y = game.config.height;
        this.msgtxt.text = this.msgBuffer[0][0];
        //TODO: definir o sprite do eu lirico
        console.log(this.msgBuffer[0][1]);
        this.fieldween.play();
        this.podePassar = false;
        //this.textween.play();
    }

    updateMessage(){
        if (this.podePassar){
            this.msgtxt.alpha = 0;
            this.msgtxt.y = game.config.height;
            this.paragrafo++;
            if (this.paragrafo >= this.msgBuffer.length ){
                this.closeMessage();
            }else{
                this.msgtxt.text = this.msgBuffer[this.paragrafo][0];
                console.log(this.msgBuffer[this.paragrafo][1]);
                this.podePassar = false;
                this.textween.play();
            }
        }/*else{
            this.textween.stop();            
            this.msgtxt.alpha = 1;
            this.msgtxt.y = game.config.height - 300;
            this.podePassar = true;
        }*/
    }

    closeMessage(){
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