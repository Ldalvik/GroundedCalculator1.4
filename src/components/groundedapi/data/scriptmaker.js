const fs = require("fs")

console.log("start")

let weapons = {}
try {
    weapons = JSON.parse(fs.readFileSync("src/components/groundedapi/data/weapons.json"));
} catch (error) {
    console.error(`Error reading file: ${error.message}`);
}

let weapons_old = {}
try {
    weapons_old = JSON.parse(fs.readFileSync("src/components/groundedapi/data/weapons_old.json"));
} catch (error) {
    console.error(`Error reading file: ${error.message}`);
}

let newWeapons = []
for (const key in weapons) {
    if (weapons.hasOwnProperty(key)) {
        const weapon = weapons[key]

        let dmg1 = ""
        let dmg2 = ""
        let avg = 0

        const words = weapon.attacks[0].damage_type.name.split(/(?=[A-Z])/);
        dmg1 = words.slice(1).join("") || ""
        dmg2 = words[0]

        if(dmg1 === ""){
             dmg1 = dmg2
             dmg2 = ""
        }
        if (weapon.attacks.length === 3) {
            avg = (weapon.attacks[0].damage +
                   weapon.attacks[1].damage +
                  (weapon.attacks[2].damage * 1.25)) / 3
        } else {
            avg = weapon.average_damage
        }

        let atktime = 69420
        let mightyonly = false
        let wpntype = "Unknown"

        const weapon_old = weapons_old[weapon.name]
        if (weapon_old) {
            atktime = weapon_old["Attack time (s)"]
            mightyonly = weapon_old["Mighty Only"]
            wpntype = weapon_old["WPN Type"]
        }

        newWeapons.push({
            "key": key, 
            "name": weapon.name,
            "icon": weapon.icon,
            "tier": weapon.tier,
            "DMG Type 1": dmg1,
            "DMG Type 2": dmg2,
            "AVG DMG (combo)": Math.round(avg * 10.0) / 10.0,
            "Damage": weapon.attacks[0].damage,
            "WPN Type": wpntype,
            "Attack time (s)": atktime,
            "Stamina": weapon.average_stamina_cost,
            "Mighty Only": mightyonly
        })
    }
}

// console.log(newWeapons)
try {
    fs.writeFileSync("newweapons.json", JSON.stringify(newWeapons));
} catch (error) {
    console.error(`Error writing file: ${error.message}`);
}
