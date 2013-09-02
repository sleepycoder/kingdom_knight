/**
 * Created with JetBrains WebStorm.
 * User: zkfan
 * Date: 8/24/13
 * Time: 10:27 AM
 * To change this template use File | Settings | File Templates.
 */
var EffectType = {
    HitPointChange : 0,
    HitPointWithTime : 2,
    Freeze : 3,
    AbilityChange : 4
}

var EffectObjectType = {
    All : 0,
    Enemy : 1,
    Alliance : 2
}

function Effect(name, source, effect_type, effect_object_type, duration, point, meta, animation) {
    this.name = name;
    this.source = source;
    this.effect_type = effect_type;
    this.effect_object_type = effect_object_type;
    this.duration = duration;
    this.point = point;
    this.meta = meta;
    this.animation = animation;
}

Effect.prototype.CanAttach = function(character) {
    return Skill.CanAffect(this.effect_object_type, this.effect_type, this.source, character);
}

function AttachedEffect(start_time, decay, releasing_effect, character) {
    this.start_time = start_time;
    this.last_time = start_time;
    this.effect = releasing_effect.effect;
    this.releasing_effect = releasing_effect;
    this.character = character;
    this.decay = decay;
    this.destroyed = false;
}

AttachedEffect.prototype.Destroy = function() {
    if (this.sprite) {
        this.sprite.Destroy();
        this.sprite = null;
    }
    this.destroyed = true;
}

AttachedEffect.prototype.Perform = function(time) {
    if (this.effect.animation && !this.sprite) {
        this.sprite = Sprite.CreateWithConfig(this.start_time, this.effect.animation);
        this.sprite.PinTo(this);
    }

    // One-time effects
    if (this.effect.effect_type == EffectType.HitPointChange) {
        this.sprite = null;  // Release sprite
        this.character.hit_point -= Utilities.Damage(
            this.effect.point * this.decay,
            this.effect.meta,
            this.character.armor,
            this.character.armor_type);
        if (this.character.hit_point <= 0) {
            this.character.hit_point = 0;
            this.character.Die(this);
        }
        this.last_time = time;
        this.Destroy();
        return;
    }

    // Continuous effects
    if (time >= this.start_time + this.effect.duration) {
        time = this.start_time + this.effect.duration;
    }

    // TODO: add more effects
    if (this.effect.effect_type == EffectType.HitPointWithTime) {
        this.character.hit_point -= Utilities.Damage(
            this.effect.point * this.decay,
            this.effect.meta,
            this.character.armor,
            this.character.armor_type) * (time - this.last_time) / this.effect.duration;
        if (this.character.hit_point <= 0) {
            this.character.hit_point = 0;
            this.character.Die(this);
        }
    }

    this.last_time = time;
    if (time >= this.start_time + this.effect.duration) {
        this.Destroy();
    }
}