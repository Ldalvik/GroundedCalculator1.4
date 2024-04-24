import Calculator from './Calculator';
import WEAPONS from "./data/weapons.json"
import { BLACKLIST } from "./Types"

export default class GroundedAPI {
    // creature          The creature to compare weapons against
    // difficulty        The current difficulty you are on
    // weaponLevel       The upgrade level you want to compare with
    // weaponFilter {  
    //    tierLimit:     Only shows weapons at that tier and below
    //    twoHandedOnly: Only shows two-handed weapons
    //    oneHandedOnly: Only shows one-handed weapons
    // }
    // weaponList        List of calculated weapon vs. creature values

    constructor() {
        this.creature = "Aphid"
        this.difficulty = "Mild"
        this.weaponLevel = 0
        this.weaponFilter = {
            tierLimit: 1,
            twoHandedOnly: false,
            oneHandedOnly: false
            // rangedType: ALL,
            // swimmingType: ALL
        }
        // this.mutations = []
        // this.armor = {
        //     head: { name: NONE },
        //     chest: { name: NONE },
        //     legs: { name: NONE }
        // }
        // this.consumables = []
        // this.trinket = NONE
        this.weaponList = []
    }

    generateWeaponList() {
        /* Weapon filters
            - blacklist: items that should not be on the calculator
            - tierLimit: 0-4, limits what weapon tiers should be shown
            - weaponType: Removes "None" and "Unknown" type weapons.
                          "None" are not weapons and "Unknown" are new 1.4 weapons (fixed soon)
            - oneOrTwoHanded: allows you to show only one-handed or two-handed weapons. Both cannot be true.
        */
        const blacklist = (weapon) => !BLACKLIST.includes(weapon.name)
        const tierLimit = (weapon) => weapon.tier <= this.weaponFilter.tierLimit
        const weaponType = (weapon) => weapon["WPN Type"] !== "None" && weapon["WPN Type"] !== "Unknown"
        const oneOrTwoHanded = (weapon) => (!this.weaponFilter.oneHandedOnly || weapon.two_handed) &&  
                                           (!this.weaponFilter.twoHandedOnly || !weapon.two_handed)
        
        const filtered = WEAPONS.filter(weapon => 
            blacklist(weapon) && 
            tierLimit(weapon) &&
            weaponType(weapon) &&
            oneOrTwoHanded(weapon)             
        )

        this.weaponList = filtered.map(weapon => {
            const calc = new Calculator(this.difficulty, this.creature, weapon, this.weaponLevel)
            //    .setMutations(this.mutations)
            //    .setConsumables(this.consumables)
            //    .setArmor(this.armor)
            //    .setTrinket(this.trinket)
            return {
                icon: weapon.icon,
                name: weapon.name,
                bestUpgrade: calc.getBestUpgrade(),
                damagePerSecond: calc.getDamagePerSecond(),
                resMulti: calc.getResistanceLevelMulti(),
                timeToKill: calc.getTimeToKill(),
                staminaToKill: calc.getStaminaToKill(),
                hitsToKill: calc.getHitsToKill(),
                damageToStaminaRatio: calc.getDamageToStaminaRatio(),
            }
        })
        // this.weaponList.filter((weapon) => this.getIsValid(weapon.damagePerSecond) || this.getIsValid(weapon.staminaToKill))
        return this
    }
    
    // getIsValid(value) {
    //     return typeof value === 'number' || isNaN(value) || value === Infinity || value === 0
    // }
    
    // Essentially the same results as lowestStaminaToKill..? Test this
    sortHighestDamageToStamina() {
        this.weaponList.sort((a, b) => (b.damagePerSecond / b.staminaToKill) - (a.damagePerSecond / a.staminaToKill))
        return this
    }

    sortLowestStaminaToKill() {
        this.weaponList.sort((a, b) => a.staminaToKill - b.staminaToKill)
        return this
    }

    sortByHighestDPS() {
        this.weaponList.sort((a, b) => b.damagePerSecond - a.damagePerSecond)
        return this
    }

    setCreature(creature) {
        this.creature = creature
        return this
    }

    setWeaponFilter(filter) {
        this.weaponFilter = { ...this.weaponFilter, ...filter }
        return this
    }
    
    setWeaponLevel(level) {
        this.weaponLevel = level
        return this
    }

    
    // addMutation(mutation, level) {
    //     if (this.mutations.length === 5) {
    //         throw Error("Maximum active mutations cannot be greater than 5")
    //     } else this.mutations.push({ name: mutation, level: level })
    //     return this
    // }

    // setArmor(armor) {
    //     this.armor = armor
    //     return this
    // }

    // setTrinket(trinket) {
    //     this.trinket = trinket
    //     return this
    // }

    // addConsumable(consumable) {
    //     this.consumables.push(consumable)
    //     return this
    // }
}