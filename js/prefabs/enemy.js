class Enemy extends Phaser.GameObjects.Sprite {
    constructor(config) {
        super(config.scene, config.x, config.y, "characters", 16).setOrigin(0.5,0.5);
        //this.scale = 0.5;

        //mantendo referência à cena atual
        this.scene = config.scene;

        //animação
        this.shootpositions = [(game.config.width/2) - 80,(game.config.width/2) + 80];
        this.lastLane = 2;
        this.laneRepeat = 0;;

        //status
        this.hp = 2;
        this.potions = 0;
        this.gold = 2;
        this.level = 1;

        //TODO: definir animações aqui

        //Adicionando a cena atual
        config.scene.add.existing(this);

        //física
        config.scene.physics.add.existing(this);
        //this.body.setImmovable(true);
        this.body.setSize(this.width - 80, this.height - 140);

        //começa invisível, sendo chamado apenas na hora da batalha
        this.setVisible(false);
        
        this.appearTween = this.scene.tweens.add({
            targets: this,
            alpha: { from: 0, to: 1 },
            ease: 'Linear',
            duration: 500,
            repeat: 0,
            paused: true
        });

        this.disappearTween = this.scene.tweens.add({
            targets: this,
            alpha: { from: 1, to: 0 },
            ease: 'Linear',
            duration: 2000,
            repeat: 0,
            paused: true
        });

        this.disappearTween.on('complete', function(tween, targets){
            this.scene.fimDaBatalha(true);
        }, this);
    }

    defineEnemy(config){
        //TODO: definir frame e status através dos dados via json
    }

    getReadytoBattle(){
        this.setVisible(true);
        this.alpha = 0;
        this.appearTween.play();
    }

    attack(){
        this.shootTimer = this.scene.time.addEvent(
            { delay: 600 - (this.level * 100), callback: this.scene.shoot, callbackScope: this.scene, loop: true }
        );
        this.scene.shoot();
    }

    defineShootLane(){
        let lane = rollDice(2) - 1;
        if (lane == this.lastLane){
            this.laneRepeat++;
            if (this.laneRepeat > 2){
                lane = lane == 0 ? 1 : 0
                this.laneRepeat = 0;
            }
        }else{
            this.lastLane = lane;
            this.laneRepeat = 0;
        }

        return this.shootpositions[lane];
    }

    die(){
        this.shootTimer.remove(false);
        this.disappearTween.play();
    }

    getoutoftheRing(){
        this.setVisible(false);
        //TODO: fadeout?
    }
}