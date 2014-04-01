/**
 * Created with JetBrains WebStorm.
 * User: zkfan
 * Date: 8/24/13
 * Time: 5:18 PM
 * To change this template use File | Settings | File Templates.
 */

function CalculateDecay(edge_decay, position, center, range) {
    return edge_decay + (1 - Utilities.Distance(position, center) / range) * (1 - edge_decay);
}

function ReleasingEffect(name, x, y, target, target_range, decay, releasing_speed, start_time, wait, duration, effect,
                         move_animation, effect_animations) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.z = 0;
    this.target_z = 0;
    this.random_x = 8 - Math.random() * 8;
    this.random_y = 8 - Math.random() * 8;
    this.target = target;
    this.target_range = target_range;
    this.decay = decay;
    this.releasing_speed = releasing_speed;
    this.start_time = start_time;
    this.last_time = start_time;
    this.effect_time = 0;
    this.take_effect = false;
    this.wait = wait;
    this.duration = duration;
    this.effect = effect;
    this.destroyed = false;
    this.move_animation = move_animation;
    this.effect_animations = effect_animations;
    g_releasing_effects.push(this);
}

ReleasingEffect.prototype.Destroy = function() {
    if (this.move_sprite) {
        this.move_sprite.Destroy();
        this.move_sprite = null;
    }
    /*this.name = null;
    this.type = null;
    this.x = 0;
    this.y = 0;
    this.target = null;
    this.target_range = 0;
    this.decay = 0;
    this.v = 0;
    this.last_time = 0;
    this.effect_time = 0;
    this.take_effect = false;
    this.duration = 0;
    this.effect = null;*/
    this.destroyed = true;
}

ReleasingEffect.prototype.AttachAreaEffect = function(time, dwell_time, character) {
    for (var i = 0; i < character.effects.length; ++i) {
        if (character.effects[i].source == this && character.effects[i].name == this.effect.name) {
            return;  // duplicated
        }
    }

    if (this.effect.effect_type == EffectType.HitPointChange) {
        if (this.decay == 1) {
            character.AddEffect(time, dwell_time / this.duration, this);
        } else {
            character.AddEffect(
                time,
                dwell_time / this.duration * CalculateDecay(this.decay, character, this.target, this.target_range),
                this);
        }
    } else {
        character.AddEffect(time, 1, this);
    }
}

ReleasingEffect.prototype.Do = function(time) {
    if (!this.take_effect) {
        if (this.releasing_speed == 0) {
            this.take_effect = true;
            this.effect_time = this.start_time;
            this.x = this.target.x;
            this.y = this.target.y;
        } else {
            var distance = Utilities.Distance3D(this, this.target, this.z, this.target_z);
            var movement = this.releasing_speed * (time - this.last_time);
            if (distance <= movement) {
                // It should take effect.
                this.take_effect = true;
                this.effect_time = this.last_time + distance / this.releasing_speed;
                this.x = this.target.x;
                this.y = this.target.y;
                this.z = this.target_z;
            } else {
                if (this.move_animation && !this.move_sprite) {
                    this.move_sprite = Sprite.Create(this.move_animation.frame_set_name);
                    this.move_sprite.SetAction(this.move_animation.action,
                                               this.move_animation.duration ?
                                                   this.move_animation.duration :
                                                   distance / this.releasing_speed,
                                               this.start_time,
                                               this.move_animation.repeat_mode);
                }
                var ratio = movement / distance;
                this.x += ratio * (this.target.x - this.x);
                this.y += ratio * (this.target.y - this.y);
                this.z += ratio * (this.target_z - this.z);
                this.last_time = time;
                if (this.move_sprite) {
                    this.move_sprite.SetLocation3D(this.x, this.y, this.z);
                    this.move_sprite.SetAngle(
                        Math.atan2(this.target.x - this.x, (this.target.y - this.y) * 0.7 - this.target_z + this.z) -
                            Math.PI/2);
                }
                return;
            }
        }
    }
    if (this.move_sprite) {
        this.move_sprite.Destroy();
        this.move_sprite = null;
    }
    if (this.effect_animations) {
        if (!this.effect_sprites) {
            this.effect_sprites = [];
            for (var i = 0; i < this.effect_animations.length; ++i) {
                this.effect_sprites.push(Sprite.CreateWithConfig(this.effect_time, this.effect_animations[i]));
            }
        }
        for (var i = 0; i < this.effect_animations.length; ++i) {
            this.effect_sprites[i].SetLocation3D(this.target.x + this.random_x, this.target.y + this.random_y, this.z);
        }
    }

    // Single target
    if (this.target_range == 0) {
        if (this.effect.CanAttach(this.target)) {
            this.target.AddEffect(time, 1, this);
        }
        this.Destroy();
        return;
    }

    // Area target
    if (time >= this.effect_time + (this.wait || 0)) {
        var characters = g_map.GetCharacters(this.target, this.target_range);
        for (var i = 0; i < characters.length; ++i) {
            if (this.effect.CanAttach(characters[i])) {
                this.AttachAreaEffect(time,
                                      Math.min(time, this.effect_time + (this.wait || 0) + this.duration) -
                                          Math.max(this.last_time, this.effect_time + (this.wait || 0)),
                                      characters[i]);
            }
        }
    }
    if (time >= this.effect_time + (this.wait || 0) + this.duration) {
        this.Destroy();
        return;
    }
    this.last_time = time;
}

ReleasingEffect.prototype.SetZ = function(source_z, target_z) {
    this.z = source_z;
    this.target_z = target_z;
}
