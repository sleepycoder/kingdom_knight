/**
 * Created with JetBrains WebStorm.
 * User: zkfan
 * Date: 8/25/13
 * Time: 4:24 PM
 * To change this template use File | Settings | File Templates.
 */

skill_config = {
    name : "canibal_attack",
    type : SkillType.SingleTarget,
    target_range : 0,
    range : 40,
    edge_decay : 1,
    speed : 0,
    cool_down : 1000,
    preparing_time : 300,
    finishing_time : 300,
    effect_name : "canibal_attack",
    effect_type : EffectType.HitPointChange,
    effect_object_type : EffectObjectType.Enemy,
    effect_duration : 0,
    effect_point : 30,
    effect_meta : AttackType.Normal
};

g_skill_config["canibal_attack"] = skill_config;

skill_config = {
    name : "magic_bolt",
    type : SkillType.SingleTarget,
    target_range : 0,
    range : 200,
    edge_decay : 1,
    speed : 0.7,
    move_animation : {
        frame_set_name : "CanibalShamanMagicBolt",
        action : "move",
        repeat_mode : RepeatMode.RemainLastFrame
    },
    effect_animations : [
        {
            frame_set_name : "CanibalShamanMagicBolt",
            action : "effect",
            start : 0,
            duration : 500,
            live : 500,
            repeat_mode : RepeatMode.RemainLastFrame
        }
    ],
    cool_down : 1000,
    preparing_time : 300,
    finishing_time : 300,
    effect_name : "magic_bolt_hurt",
    effect_type : EffectType.HitPointChange,
    effect_object_type : EffectObjectType.Enemy,
    effect_duration : 0,
    effect_point : 20,
    effect_meta : AttackType.Magic,
    effect_animation : null
};

g_skill_config["magic_bolt"] = skill_config;

skill_config = {
    name : "mage_bolt",
    type : SkillType.AreaOnCharacter,
    target_range : 20,
    range : 300,
    edge_decay : 1,
    speed : 1,
    duration : 10,
    move_animation : {
        frame_set_name : "hero_mage_bolt",
        action : "move",
        repeat_mode : RepeatMode.RemainLastFrame
    },
    effect_animations : [
        {
            frame_set_name : "hero_mage_bolt",
            action : "effect",
            start : 0,
            duration : 500,
            live : 500,
            repeat_mode : RepeatMode.RemainLastFrame
        }
    ],
    cool_down : 1500,
    preparing_time : 400,
    finishing_time : 200,
    effect_name : "mage_bolt_hurt",
    effect_type : EffectType.HitPointChange,
    effect_object_type : EffectObjectType.Enemy,
    effect_duration : 0,
    effect_point : 50,
    effect_meta : AttackType.Magic,
    effect_animation : null
};

g_skill_config["mage_bolt"] = skill_config;

skill_config = {
    name : "mage_rain",
    type : SkillType.AreaOnPlace,
    skill_button : {
        icon_set_name : "upgrades_icons",
        icon_index : 11,
        off_icon_set_name :  "upgrades_icons_off",
        off_icon_index : 11
    },
    target_range : 75,
    range : 400,
    edge_decay : 0.5,
    speed : 0,
    wait : 1600,
    duration : 100,
    effect_animations : [
        {
            frame_set_name : "hero_mage_rain_decal",
            action : "ground",
            start : 0,
            duration : 2000,
            live : 2000,
            repeat_mode : RepeatMode.RemainLastFrame,
            layer : -1
        },
        {
            frame_set_name : "hero_mage_rain",
            action : "rain",
            start : 1000,
            duration : 700,
            live : 1700,
            repeat_mode : RepeatMode.RemainLastFrame
        }
    ],
    owner_action : "spell",
    cool_down : 4000,
    preparing_time : 300,
    finishing_time : 500,
    effect_name : "mage_rain_hurt",
    effect_type : EffectType.HitPointChange,
    effect_object_type : EffectObjectType.Enemy,
    effect_duration : 0,
    effect_point : 100,
    effect_meta : AttackType.Magic,
    effect_animation : null
};

g_skill_config["mage_rain"] = skill_config;