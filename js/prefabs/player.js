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
        this.paused = false;
        this.moving = false; //se true, o personagem não pode trocar a lane e nem ser atingido

        //status
        this.hp = 6;
        this.maxhp = 6;
        this.mp = 3;
        this.maxmp = 3;
        this.atk = 1;
        this.def = 0;
        this.spd = 1;
        this.gold = 0;
        this.dead = false;
        this.foundshop = false;
        this.shield = this.def;
        this.inventory = {
            "weapon": {},
            "shield": {},
            "boot": {},
            "items": {},
        };

        //mensagens tutorial
        this.bemvindo = false;
        this.encontrouEnfermaria = false;

        //incrementados ao invocar os milagres might e protect. Somem após o fim da batalha
        this.bonusatk = 0;
        this.bonusdef = 0;

        //efeitos negativos. Somem após final da batalha ou depois de um tempo
        this.cursed = 0;
        this.curse = "";
        this.curseatk = 0;
        this.cursedef = 0;
        this.cursespd = 0;

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

    savePlayerData(){
        playerdata.hp = this.hp;
        playerdata.maxhp = this.maxhp;
        playerdata.mp = this.mp;
        playerdata.maxmp = this.maxmp;
        playerdata.atk = this.atk;
        playerdata.def = this.def;
        playerdata.spd = this.spd;
        playerdata.gold = this.gold;
        playerdata.dead = this.dead;
        playerdata.foundshop = this.foundshop;
        playerdata.shield = this.shield;
        playerdata.inventory = this.inventory
        playerdata.bemvindo = this.bemvindo;
        playerdata.encontrouEnfermaria = this.encontrouEnfermaria;
    }

    loadPlayerData(){
        this.hp = playerdata.hp;
        this.maxhp = playerdata.maxhp;
        this.mp = playerdata.mp;
        this.maxmp = playerdata.maxmp;
        this.atk = playerdata.atk;
        this.def = playerdata.def;
        this.spd = playerdata.spd;
        this.gold = playerdata.gold;
        this.dead = playerdata.dead;
        this.foundshop = playerdata.foundshop;
        this.shield = playerdata.shield;
        this.inventory = playerdata.inventory
        this.bemvindo = playerdata.bemvindo;
        this.encontrouEnfermaria = playerdata.encontrouEnfermaria;
    }

    getReadytoBattle(){
        this.y = this.yInicial;
        this.x = this.startpos;
        this.lane = 0;
        this.chargingAttack = false;
        this.setVisible(true);
        this.alpha = 0;
        this.appearTween.play();
        this.recoverDefense();
    }

    heal(complete){
        if (complete){
            this.hp = this.maxhp;
        }else{
            this.hp += 9 + rollDice(6);
            if (this.hp > this.maxhp) this.hp = this.maxhp;
        }
        this.curseTimer = 0;
        this.removeStatusEffect();
    }

    playEffect(efeito){
        switch(efeito){
            case "HPMAXUP1": this.maxhp += 1; this.hp = this.maxhp; break;
            case "HPMAXUP2": this.maxhp += 2; this.hp = this.maxhp; break;
            case "MPMAXUP1": this.maxmp += 1; this.mp = this.maxmp; break;
            case "MPMAXUP2": this.maxmp += 2; this.mp = this.maxmp; break;
        }
    }

    setStatusEffect(curse){
        switch(curse){
            case 1:  //poisoned
                if (this.cursed < 1) {
                    Math.round(this.cursespd = (3 * this.spd) / 2); 
                    this.curse = "POISON";
                    this.cursed = curse;
                    this.curseTimer = 200;
                }
                break;
            case 3: //disease
                if (this.cursed < 3) {
                    this.cursespd = (3 * this.spd) - 1; this.curseatk = this.atk - 1; 
                    this.curse = "DISEASE";
                    this.cursed = curse;
                    this.curseTimer = 500;
                }
                break;
        }
    }

    removeStatusEffect(){
        this.curseatk = 0;
        this.cursedef = 0;
        this.cursespd = 0;
        this.cursed = 0;
        this.curse = "";
    }

    equipItem(item){
        //Remove os bônus do item anterior
        if (typeof this.inventory[item.type]["level"] != 'undefined'){
            this.atk -= this.inventory[item.type]["atk"];
            this.def -= this.inventory[item.type]["def"];
            this.spd -= this.inventory[item.type]["spd"];
        }

        //troca o equipamento e aplica as bonificações
        this.atk += item["atk"];
        this.def += item["def"];
        this.spd += item["spd"];
        this.scene.player.inventory[item.type] = item;
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
        this.bonusatk = 0;
        this.bonusdef = 0;
        this.curseTimer = 0;
        this.removeStatusEffect();
        this.setVisible(false);
        //TODO: fadeout?
    }

    pause(){
        //TODO: definir uma pose ao pausar
        this.paused = true;
    }

    resume(){
        this.paused = false;
    }

    recoverDefense(){
        this.shield = this.def + this.bonusdef
    }

    updatePosition(){
        if (this.paused) return false;

        this.scene.battlefield.showCurseText(this.curse,this.curseTimer);
        if (this.curseTimer > 0){
            this.curseTimer -= 1;
            if (this.curseTimer <= 0) {
                this.curseTimer = 0;
                this.removeStatusEffect();
            }
        }

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
                this.y -= (3 * this.spd) - this.cursespd;
            }
        }

        if (this.getBack) {
            this.y +=40;
            if (this.y >= this.yInicial) {
                this.y = this.yInicial;

                //Checar se o jogador vai ver se no céu tem pão
                if(this.hp > 0){
                    if (this.chargingAttack) {
                        this.getBack = false;
                        this.recoverDefense();
                    }
                }else{
                    if (this.inventory.items.POTION > 0){
                        this.inventory.items.POTION--;
                        this.scene.ressurectPlayer();
                        if (this.chargingAttack) {
                            this.getBack = false;
                            this.recoverDefense();
                        }
                    }else{
                        this.dead = true;
                        this.scene.fimDaBatalha(false);
                    }
                }
                
            }
        }
    }
}