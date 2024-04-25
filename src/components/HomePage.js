import { useEffect, useMemo, useState } from "react"
import GroundedAPI from "./groundedapi/GroundedAPI"
import CREATURES from "./groundedapi/data/creatures.json"

const calc = new GroundedAPI()

const HomePage = () => {
    const [selectedCreature, setSelectedCreature] = useState("Mosquito")
    const [weaponData, setWeaponData] = useState([])
    const [options, setOptions] = useState({
        weaponLevel: 0,
        tierLimit: 2,
        oneHandedOnly: false,
        twoHandedOnly: false,
        sortType: "Highest DPS"
    })

    useEffect(() => {
        calc.setCreature(selectedCreature)
            .setWeaponLevel(options.weaponLevel)
            .setWeaponFilter({
                tierLimit: options.tierLimit,
                oneHandedOnly: options.oneHandedOnly,
                twoHandedOnly: options.twoHandedOnly
            })
            .generateWeaponList()

        switch (options.sortType) {
            case "DamageToStamina": calc.sortHighestDamageToStamina(); break
            case "StaminaToKill": calc.sortLowestStaminaToKill(); break
            default:
            case "HighestDPS": calc.sortByHighestDPS(); break
        }
        setWeaponData(calc.weaponList)

    }, [selectedCreature, options])

    const weaponList = useMemo(() => {
        return weaponData.map(weapon => {
            return (
                <tr key={weapon.name}>
                    <td><img className="weapon-icon" src={`${process.env.PUBLIC_URL}/images/${weapon.icon}`} alt={weapon.name}/></td>
                    <td>{weapon.name}</td>
                    <td>{weapon.bestUpgrade}</td>
                    <td>{weapon.damagePerSecond.toFixed(1)}</td>
                    {/* <td>{weapon.resMulti.toFixed(5)}</td> */}
                    <td>{weapon.timeToKill.toFixed(1)}</td>
                    <td>{weapon.staminaToKill.toFixed(1)}</td>
                    <td>{Math.ceil(weapon.hitsToKill)}</td>
                    <td>{weapon.damageToStaminaRatio.toFixed(2)}</td>
                </tr>
            )
        })
    }, [weaponData])

    const handleCreatureChange = (event) => {
        setSelectedCreature(event.target.value)
    }

    const handleOptionChange = (e) => {
        setOptions(options => ({
            ...options,
            [e.target.id]: e.target.value
        }))
    }

    return (
        <div className="grid-container">
            <div className="grid-x grid-padding-x grid-padding-y align-center">
                <div className="small-10 medium-10 large-10">
                    <div className="card page-card">
                        <div className="card-section">

                            <h2 className="title-header text-center">Grounded Calculator</h2>
                            <p className="text-center">Created by Root, datamining by samjviana, SeanP, and blahable.</p>
                            <p className="text-center"><small>Numbers may be inaccurate until confirmation of the new 1.4 changes. Unfinished as of Apr. 24</small></p>
                            <div className="divider" />

                            <label className="float-left filters-text">Weapon Level</label>
                            <select id="weaponLevel" className="options-dropdown" onChange={handleOptionChange}>
                                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((level) => <option value={`${level}`}>{level}</option>)}
                            </select>

                            <label className="float-left filters-text">Tier Limit</label>
                            <select id="tierLimit" className="options-dropdown" onChange={handleOptionChange}>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                            </select>
                            <label className="float-left filters-text">Sort Type</label>
                            <select id="sortType" className="options-dropdown" onChange={handleOptionChange}>
                                <option value="HighestDPS">Highest DPS</option>
                                <option value="StaminaToKill">Lowest Stamina to Kill</option>
                                <option value="DamageToStamina">Highest Damage to Stamina</option>
                            </select>

                            <label className="float-left filters-text">Creature</label>
                            <select className="options-dropdown" value={selectedCreature} onChange={handleCreatureChange}>
                                {Object.keys(CREATURES).map(creature => (
                                    <option key={creature} value={creature}>{creature}</option>
                                ))}
                            </select>
                            <div className="divider" />

                            <div className="grid-x align-center">
                                <table className="calculator-table">
                                    <thead>
                                        <tr>
                                            <th width="50">Icon</th>
                                            <th width="150">Name</th>
                                            <th width="120">Best Upgrade</th>
                                            <th width="70">DPS</th>
                                            {/* <th>Res Multi</th> */}
                                            <th width="70">TTK</th>
                                            <th width="70">Stamina TK</th>
                                            <th width="70">Hits TK</th>
                                            <th width="70">Dmg/Stm ratio</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {weaponList}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default HomePage