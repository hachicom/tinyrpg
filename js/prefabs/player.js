class Player extends Phaser.GameObjects.Sprite {
    constructor(config) {
        super(config.scene, config.x, config.y, "characters", 4).setOrigin(0.5,0);
        this.scale = 0.5;

        //animação
        this.positions = [(game.config.width/2) - 80,(game.config.width/2) + 80];
        this.nextpos = this.x;
        this.startpos = this.x;
        this.lane = 0;
        this.chargingAttack = false;
        this.getBack = false;
        this.yInicial = 1000;

        //status
        this.hp = 6;
        this.maxhp = 6;
        this.mp = 3;
        this.maxmp = 3;
        this.atk = 1;
        this.def = 1;
        this.spd = 1;
        this.potions = 0;
        this.gold = 0;
        this.moving = false; //se true, o personagem não pode trocar a lane e nem ser atingido
        this.dead = false;

        //TODO: definir animações aqui

        //Adicionando a cena atual
        config.scene.add.existing(this);

        //Física
        config.scene.physics.world.enableBody(this);       
        this.body.setSize(this.width - 120, this.height - 80);

        //começa invisível, sendo chamado apenas na hora da batalha
        this.setVisible(false);
        
        this.appearTween = config.scene.tweens.add({
            targets: this,
            alpha: { from: 0, to: 1 },
            ease: 'Linear',
            duration: 500,
            repeat: 0,
            paused: true
        });
    }

    getReadytoBattle(){
        this.y = this.yInicial;
        this.x = this.startpos;
        this.lane = 0;
        this.chargingAttack = false;
        this.setVisible(true);
        this.alpha = 0;
        this.appearTween.play();
    }

    charge(){
        this.chargingAttack = true;
    }

    retreat(){
        this.getBack = true;
    }

    changeLane(pointer){
        if (!this.chargingAttack) return false;
        if (this.moving == false){
            this.lane ++;
            //if (pointer.leftButtonDown()){
            if (this.lane > 1){
                this.lane = 0;
            }
            this.nextpos = this.positions[this.lane];
            this.moving = true;
        }
    }

    wonBattle(){
        this.chargingAttack = false;
    }

    getoutoftheRing(){
        this.setVisible(false);
        //TODO: fadeout?
    }

    updatePosition(){
        if (this.moving == true){
            if(this.x<this.nextpos) {
                this.x+=20;
                if(this.x>=this.nextpos) {
                    this.x=this.nextpos;
                    this.moving = false;
                }
            }else if(this.x>this.nextpos){
                this.x-=20;
                if(this.x<=this.nextpos) {
                    this.x=this.nextpos;
                    this.moving = false;
                }
            }
        }

        if (this.chargingAttack) {
            if (!this.getBack) {
                this.y -= 3 * this.spd;
            }
        }

        if (this.getBack) {
            this.y +=40;
            if (this.y >= this.yInicial) {
                this.y = this.yInicial;

                //Checar se o jogador vai ver se no céu tem pão
                if(this.hp > 0){
                    if (this.chargingAttack) this.getBack = false;
                }else{
                    this.dead = true;
                    this.scene.fimDaBatalha(false);
                }
                
            }
        }
    }
}