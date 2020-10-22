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
        this.name = "";
        this.hp = 2;
        this.potions = 0;
        this.gold = 2;
        this.level = 1;
        this.bullets = [0,0,0,0];
        this.dead = false;
        this.clickable = false;
        this.qtdClicks = 0;

        //TODO: definir animações aqui

        //Adicionando a cena atual
        config.scene.add.existing(this);

        //física
        config.scene.physics.add.existing(this);
        //this.body.setImmovable(true);
        this.body.setSize(this.width - 80, this.height - 140);

        //permite ao jogador tocar no sprite, será usado para o modo tapper/clicker ao derrotar o inimigo
        this.setInteractive().on('pointerdown', function(pointer){
            this.tomaPorrada(pointer);
        }, this);

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
        console.log(config);
        this.setFrame(frameFinalHerois + config.frame);
        this.name = config.name;
        this.hp = config.hp;
        this.potions = 0; //TODO: pensar em alguma funcionalidade onde o inimigo pode se recuperar após ser derrotado
        this.level = this.scene.linha - 1;
        this.gold = 2 * this.level;
        this.bullets = config.atk;
    }

    getReadytoBattle(){
        this.qtdClicks = 0;
        this.clickable = false;
        this.dead = false;
        this.setVisible(true);
        this.alpha = 0;
        this.appearTween.play();
    }

    attack(){
        this.shootTimer = this.scene.time.addEvent(
            { delay: 1100 - (this.level * 100), callback: this.scene.shoot, callbackScope: this.scene, loop: true }
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

    aboutToDie(){
        this.clickable = true;
        this.dead = true;
        this.scene.player.wonBattle();
        this.shootTimer.remove(false);
        this.dieTimer = this.scene.time.addEvent(
            { delay: 2000, callback: this.die, callbackScope: this, loop: false }
        );
        console.log(this.level);
    }

    tomaPorrada(pointer){
        if (this.clickable){
            this.scene.shakenemy.shake({
                duration: 250,
                magnitude: 50
            });
            this.qtdClicks += this.scene.player.atk;
            if (this.qtdClicks > 5){
                this.gold += this.level;
                this.scene.createCoinParticle(pointer,this.level);
            }
        }
    }

    die(){
        this.scene.battlefield.stopClickerMsg();
        this.scene.shakenemy.shake({
            duration: 1500,
            magnitude: 100
        });
        this.clickable = false;
        this.scene.player.retreat();
        this.scene.player.wonBattle();
        this.disappearTween.play();
        this.scene.battleButtons.setVisible(false);
        
        console.log('got '+this.gold+' coins.');
    }

    getoutoftheRing(){
        this.setVisible(false);
    }

    pause(waitExternal){
        if (typeof waitExternal == 'undefined') waitExternal = false;
        this.shootTimer.paused = true;
        this.waitExternal = waitExternal;
    }

    resume(){
        if (this.waitExternal) return false;
        this.shootTimer.paused = false;
    }

    resumeForced(){
        this.waitExternal = false;
        this.resume();
    }
}