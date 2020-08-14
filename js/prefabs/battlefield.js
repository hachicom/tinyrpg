class Battlefield extends Phaser.GameObjects.Group {
    constructor (config) {
        super(config.scene);

        //mantendo referência à cena atual
        this.scene = config.scene;

        //this.setActors(config.player,config.enemy);

        //Elementos gráficos
        this.field = this.create(game.config.width/2,100,"battlefield").setOrigin(0.5,0);
        this.msgcenter = this.scene.add.text(game.config.width/2,game.config.height/2, "Click to Start Battle",txtStyle1).setOrigin(0.5,0.5);
        this.add(this.msgcenter);
        this.msgcenter.setVisible(false);
        this.msgcenter.setDepth(10);

        this.textween = this.scene.tweens.add({
            targets: this.msgcenter,
            alpha: { from: 0, to: 1 },
            ease: 'Linear',
            duration: 500,
            repeat: -1,
            paused: true,
            yoyo: true
        });

        this.miracletween = this.scene.tweens.add({
            targets: this.msgcenter,
            alpha: { from: 0, to: 1 },
            y: { from: game.config.height, to: game.config.height/2 },
            ease: 'Linear',
            duration: 500,
            repeat: 0,
            paused: true
        });
        
        this.fieldween = this.scene.tweens.add({
            targets: this.field,
            y: { from: game.config.height, to: 100 },
            ease: 'Bounce',
            duration: 1000,
            repeat: 0,
            paused: true
        });

        this.fieldween.on('complete', function(tween, targets){
            this.msgcenter.setVisible(true);
            this.textween.seek(0);
            this.textween.play();
            this.modo = 'inicio';
            this.scene.player.getReadytoBattle();
            this.scene.enemy.getReadytoBattle();
        }, this);

        this.fieldweenOut = this.scene.tweens.add({
            targets: this.field,
            y: { from: 100, to: game.config.height},
            ease: 'Bounce',
            duration: 1000,
            repeat: 0,
            paused: true
        });

        this.fieldweenOut.on('complete', function(tween, targets){
            this.msgcenter.setVisible(false);
            this.modo = 'criado';
            this.setVisible(false);
        }, this);

        this.modo = 'criado'; //criado,inicio,jogando,fim
        
        //Adicionando à cena atual
        config.scene.add.existing(this);
        config.scene.physics.add.existing(this);

        this.setVisible(false);
    }

    showBattlefield(){
        this.setVisible(true);
        this.field.y = game.config.height;
        this.msgcenter.alpha = 0;
        this.msgcenter.text = this.scene.txtDB["CLICKTOSTARTBATTLE"];
        this.fieldween.play();
    }

    startBattle(){
        this.textween.stop();
        this.msgcenter.setVisible(false);
        this.scene.battleButtons.setVisible(true);
        this.modo = 'jogando';
    }

    showVictoryMsg(){
        this.msgcenter.text = this.scene.txtDB["YOUWIN"];
        this.msgcenter.setVisible(true);
        this.msgcenter.alpha = 0;
        this.textween.restart();
    }

    showMiracleText(txt){
        this.msgcenter.text = txt;
        this.msgcenter.setVisible(true);
        this.msgcenter.alpha = 0;
        this.miracletween.play();
    }

    hideMiracleText(){
        this.msgcenter.text = "";
        this.msgcenter.setVisible(false);
    }

    hideBattlefield(){
        this.textween.stop();
        this.msgcenter.setVisible(false);
        this.scene.player.getoutoftheRing();
        this.scene.enemy.getoutoftheRing();
        this.fieldweenOut.play();
    }
    
}