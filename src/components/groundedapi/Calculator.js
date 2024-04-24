import CREATURES from "./data/creatures.json"

class Calculator {
    // creatureName       Creature name
    // creature           Creature JSON obj
    // weaponName         Weapon name
    // weaponInfo         Weapon JSON obj
    // weaponLevel        Weapon level
    // baseDamage         Average weapon damage
    // critChance         Critical hit chance from debuffs
    // critMulti          Critical hit multiplier from debuffs
    // difficultyMulti    World difficulty multiplier
    // attackDamageMulti  Attack damage multiplier from debuffs (trinkets, status effects, etc)
    // enemyDefense       Defense of the creature

    constructor(difficulty, creature, weapon, level) {
        this.difficultyMulti = difficulty === "Mild"   ? 0.80 :
                               difficulty === "Medium" ? 1.0  :
                               difficulty === "Whoa"   ? 1.25 : 0.0
        this.creatureName = creature
        this.creature = CREATURES[creature]
        this.weaponName = weapon.name
        this.weaponInfo = weapon
        this.weaponLevel = level
        this.baseDamage = this.weaponInfo["AVG DMG (combo)"]
        this.weaponType = this.weaponInfo["WPN Type"]
        this.critChance = 0.01
        this.critMulti = 1.7
        this.attackDamageMulti = 1.0
        this.enemyDefense = this.creature["Defense"]
    }

    getWeaponLevelMulti() {
        if (this.weaponType === "Bomb, Explosive") return 1.0
        return this.weaponLevel > 5 ?
            (0.1 * (this.weaponLevel - 5)) + 1.25 : // 10% per level if mighty path chosen after level 5
            (0.05 * this.weaponLevel) + 1           // 5% per level if candy path chosen after level 5
    }

    getResistanceLevelMulti() {
        let dmgType1 = this.weaponInfo["DMG Type 1"]
        let dmgType2 = this.weaponInfo["DMG Type 2"]

        if (this.weaponLevel > 5 && this.getBestUpgrade() !== "Mighty") {
            if (dmgType1 === "General") {
                dmgType1 = this.getBestUpgrade()
            } else {
                dmgType2 = this.getBestUpgrade()
            }
        }
        const primaryDmgMulti = this.creature[dmgType1] || 1
        const secondaryDmgMulti = dmgType2 ? this.creature[dmgType2] : 1
        return this.creature["All Resist"] * primaryDmgMulti * secondaryDmgMulti
    }

    getDamagePerHit() {
        const weaponDamage = this.baseDamage * (1 - this.critChance) + this.baseDamage * this.critChance * this.critMulti
        const multipliers = this.getWeaponLevelMulti() * this.difficultyMulti * this.attackDamageMulti
        const modifiedBaseDamage = weaponDamage * multipliers
        const fullDamage = (modifiedBaseDamage - this.enemyDefense) * this.getResistanceLevelMulti()
        const minDamage = modifiedBaseDamage * 0.25
        return Math.max(fullDamage, minDamage)
    }

    getBestUpgrade() {
        if (this.weaponLevel < 6) return "Default"
        if (this.weaponInfo["Mighty Only"]) return "Mighty"
        const candyTypes = ["Sour", "Salty", "Spicy", "Fresh"]
        return candyTypes.reduce((a, b) => this.creature[a] > this.creature[b] ? a : b)
    }

    getStaminaToKill() {
        return (this.creature["Health"] / this.getDamagePerHit()) * this.weaponInfo["Stamina"]
    }

    getTimeToKill() {
        return (this.creature["Health"] / this.getDamagePerHit()) * this.weaponInfo["Attack time (s)"]
    }

    getHitsToKill() {
        return this.creature["Health"] / this.getDamagePerHit()
    }

    getDamageToStaminaRatio() {
        return this.getDamagePerSecond() / this.getStaminaToKill()
    }

    getDamagePerSecond() {
        return this.getDamagePerHit() / this.weaponInfo["Attack time (s)"]
    }


    // setMutations(mutations) {
    //     for (const { name, level = 1 } of mutations) {
    //         const mutationLevel = level - 1;
    //         const mutationInfo = MUTATIONS[name]
    //         for (const { restricted_to, type, effects } of mutationInfo.effect_data) {
    //             if (this.weaponInfo["WPN Type"] !== restricted_to) continue;
    //             if (type === "resistance_multiplier") this.resistanceMulti *= effects[mutationLevel];
    //             if (type === "attack_multiplier") this.attackDamageMulti *= effects[mutationLevel];
    //             if (type === "attack_add") { /* this counts as a seperate attack, handle later */ }
    //         }
    //     }
    // }
    // setArmor(armor) {  }
    // setConsumables(consumables) { }
    // setTrinket(trinket) { }

}

export default Calculator