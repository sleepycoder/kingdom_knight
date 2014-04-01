/**
 * Created with JetBrains WebStorm.
 * User: zkfan
 * Date: 8/24/13
 * Time: 11:33 AM
 * To change this template use File | Settings | File Templates.
 */
var ArmorType = {
    Normal : 0,
        Magic : 1,
        Heavy : 2,
        Fortified : 3
};

var AttackType = {
    Normal : 0,
        Magic : 1,
        Piercing : 2,
        Siege : 3,
        Direct : 4
};

// attack to armor
var DamageFactor = [
    // Normal attack
    [  1,   1, 1/2, 1/2],
    // Magic attack
    [  1, 1/2,   1, 1/2],
    // Piercing attack
    [3/2,   2, 1/3, 1/4],
    // Siege attack
    [1/6, 1/4,   2,   4],
    // Direct attack
    [  1,   1,   1,   1]
];

var Utilities = {
    Damage : function(attack, attack_type, armor, armor_type) {
        return attack * (1 - (armor * 0.06) / (armor * 0.06 + 1)) * DamageFactor[attack_type][armor_type];
    },

    Distance : function(a, b) {
        return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
    },

    Distance3D : function(a, b, a_z, b_z) {
        return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y) + (a_z - b_z) * (a_z - b_z));
    },

    RemoveDestroyedOnes : function(array) {
        for (var i = 0; i < array.length; ++i) {
            if (array[i].destroyed) {
                array[i] = array[array.length - 1];
                array.pop();
                --i;
            }
        }
    },

    RemoveDestroyedOldOnes : function(array, time) {
      for (var i = 0; i < array.length; ++i) {
        if (array[i].destroyed && array[i].last_time < time) {
          array[i] = array[array.length - 1];
          array.pop();
          --i;
        }
      }
    }
};