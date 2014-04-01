/**
 * Created with JetBrains WebStorm.
 * User: zkfan
 * Date: 8/24/13
 * Time: 8:44 PM
 * To change this template use File | Settings | File Templates.
 */

// name, speed, range, effect_range, edge_decay, duration, with_animation,
//           effect_name, effect_type, effect_with_animation, cool_down
//
/*
skill_config = {
    name : "magic_bolt",
    target_range : 0,
    edge_decay : 1,
    speed : 0.5,
    duration : 0,
    animation : "CanibalShamanMagicBolt",
    effect_name : "magic_bolt_hurt",
    effect_type : EffectType.HitPointChange,
    effect_object_type : EffectObjectType.Enemy,
    effect_duration : 0,
    effect_point : 10,
    effect_meta : AttackType.Magic,
    effect_animation : null
};
*/

var SkillType = {
    SingleTarget : 0,
    AreaOnPlace : 1,
    AreaOnCharacter : 2
}

function Skill(name) {
    this.name = name;
    this.last_spell_time = 0;
    this.skill_config = g_skill_config[name];
    if (this.skill_config.skill_button) {
        this.skill_button = new SkillButtonSprite(
            name,
            name,
            this,
            this.skill_config.skill_button.icon_set_name,
            this.skill_config.skill_button.icon_index,
            this.skill_config.skill_button.off_icon_set_name,
            this.skill_config.skill_button.off_icon_index);
    }
}

Skill.prototype.Cast = function(time, source, target, source_z, target_z) {
    this.last_spell_time = time;
    var effect = new Effect(
        this.skill_config.effect_name,
        source,
        this.skill_config.effect_type,
        this.skill_config.effect_object_type,
        this.skill_config.effect_duration,
        this.skill_config.effect_point,
        this.skill_config.effect_meta,
        this.skill_config.effect_animation);
    var releasing_effect = new ReleasingEffect(
        this.skill_config.name,
        source.x,
        source.y,
        this.skill_config.type == SkillType.AreaOnPlace ? {x : target.x, y : target.y} : target,
        this.skill_config.target_range,
        this.skill_config.edge_decay,
        this.skill_config.speed,
        time,
        this.skill_config.wait,
        this.skill_config.duration,
        effect,
        this.skill_config.move_animation,
        this.skill_config.effect_animations);
    releasing_effect.SetZ(source_z, target_z);
}

Skill.prototype.IsCoolDown = function(time) {
    return time >= this.last_spell_time + this.skill_config.cool_down;
}

Skill.prototype.GetCoolDownPercentage = function(time) {
    if (this.IsCoolDown(time)) {
        return 1;
    }
    return (time - this.last_spell_time) / this.skill_config.cool_down;
}

Skill.prototype.IsValidTarget = function(source, target) {
    return this.skill_config.type == SkillType.AreaOnPlace ||
        Skill.CanAffect(this.skill_config.effect_object_type, this.skill_config.effect_type, source, target);
}

Skill.CanAffect = function(effect_object_type, effect_type, source, target) {
    if (target.destroyed) return false;
    if (effect_object_type == EffectObjectType.All) return true;
    if (effect_object_type == EffectObjectType.Enemy && source.force != target.force) return true;
    if (effect_object_type == EffectObjectType.Alliance && source.force == target.force) {
        if ((effect_type == EffectType.HitPointChange || effect_type == EffectType.HitPointWithTime) &&
            target.hit_point != target.max_hit_point) {
            return true;
        }
    }
    return false;
}
