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
        this.closeCallback = false;

        //Elementos gráficos
        this.msgbox = this.create(game.config.width/2,game.config.height,"txtbox").setOrigin(0.5,0);
        this.msgtxt = this.scene.add.text(40,game.config.height - 300, "",txtStyle2).setOrigin(0,0);
        this.add(this.msgtxt);
        
        this.choicebox1 = this.create(game.config.width/2,game.config.height/2 - 100,"txtbox").setOrigin(0.5,0.5).setScale(0.75,0.25);
        this.add(this.choicebox1);
        this.choicebox2 = this.create(game.config.width/2,game.config.height/2,"txtbox").setOrigin(0.5,0.5).setScale(0.75,0.25);
        this.add(this.choicebox2);
        this.choicebox3 = this.create(game.config.width/2,game.config.height/2 + 100,"txtbox").setOrigin(0.5,0.5).setScale(0.75,0.25);
        this.add(this.choicebox3);

        
        this.choicetxt1 = this.scene.add.text(game.config.width/2,game.config.height/2 - 100, "",txtStyle2).setOrigin(0.5,0.5);
        this.add(this.choicetxt1);
        this.choicetxt2 = this.scene.add.text(game.config.width/2,game.config.height/2, "",txtStyle2).setOrigin(0.5,0.5);
        this.add(this.choicetxt2);
        this.choicetxt3 = this.scene.add.text(game.config.width/2,game.config.height/2 + 100, "",txtStyle2).setOrigin(0.5,0.5);
        this.add(this.choicetxt3);

        this.textween = this.scene.tweens.add({
            targets: this.msgtxt,
            alpha: { from: 0, to: 1 },
            //y: { from: game.config.height, to: game.config.height - 300 },
            ease: 'Linear',
            duration: 250,
            repeat: 0,
            paused: true
        });

        this.textween.on('complete', function(tween, targets){
            this.estaEmCena = true;
            this.setButtonVisibility(true,true,false);
            if (this.callback3 != false){
                this.choicebox3.setVisible(true);
                this.choicetxt3.setVisible(true);
            }
            this.prepareChoiceInteractive();
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
            //this.msgtxt.y = game.config.height;
            this.setVisible(false);
            if (typeof this.closeCallback == 'function') {
                this.closeCallback();
            }
            this.destroy();
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
        //this.msgtxt.y = game.config.height;
        this.msgtxt.text = txt;
        
        this.setButtonVisibility(false,false,false);
        this.choicetxt1.text = answersArr[0];
        this.choicetxt2.text = answersArr[1];
        this.choicetxt3.text = answersArr.length <= 2 ? '' : answersArr[2];
        
        this.fieldween.play();
        this.podePassar = false;
    }

    prepareChoiceInteractive(){
        this.choicebox1.setInteractive().on('pointerdown', function(pointer){
            this.setButtonVisibility(true,false,false);
            this.close(this.callback1);
        }, this);
        this.choicebox2.setInteractive().on('pointerdown', function(pointer){
            this.setButtonVisibility(false,true,false);
            this.close(this.callback2);
        }, this);
        this.choicebox3.setInteractive().on('pointerdown', function(pointer){
            this.setButtonVisibility(false,false,true);
            this.close(this.callback3);
        }, this);
    }

    setButtonVisibility(btn1,btn2,btn3){
        this.choicebox1.setVisible(btn1);
        this.choicetxt1.setVisible(btn1);
        this.choicebox2.setVisible(btn2);
        this.choicetxt2.setVisible(btn2);
        this.choicebox3.setVisible(btn3);
        this.choicetxt3.setVisible(btn3);
    }

    close(callback){
        this.msgtxt.alpha = 0;
        //this.msgtxt.y = game.config.height;
        this.estaEmCena = false;
        this.fieldweenOut.play();
        this.closeCallback = callback;
        this.callback1 = false;
        this.callback2 = false;
        this.callback3 = false;

        this.choicebox1.removeInteractive();
        this.choicebox2.removeInteractive();
        this.choicebox3.removeInteractive();
    }
    
}