/**
 * Created with JetBrains WebStorm.
 * User: zkfan
 * Date: 8/22/13
 * Time: 9:21 PM
 * To change this template use File | Settings | File Templates.
 */

var RepeatMode = {
    Repeated : 1,
    RemainLastFrame : 0
};

function Sprite(frame_set, frame_sheet_image, frame_config) {
    this.frame_set = frame_set;
    this.frame_sheet_image = frame_sheet_image;
    this.frame_config = frame_config;
    // Assumes that all frames of this sprite have the same width and height.
    this.sw = this.frame_set[0].sw;
    this.sh = this.frame_set[0].sh;
    this.x = 0;
    this.y = 0;
    this.layer = 0;
    this.action = null;
    this.angle = 0;
    this.animation_start_time = -1;
    this.animation_duration = -1;
    this.animation_repeat_mode = 0;  // 0, repeated; 1, remain last frame after finishing; 2, delete after finishing;
    this.current_action_frame_config = null;
    this.destroyed = false;
    g_sprites.push(this);
}

Sprite.Create = function(name) {
    return new Sprite(g_frame_info[name].image_set,
                      g_image_manager.GetImage(g_frame_info[name].image_sheet_file),
                      g_frame_config[name]);
}

Sprite.CreateWithConfig = function(time, animation) {
    var sprite = Sprite.Create(animation.frame_set_name);
    sprite.SetAction(
        animation.action,
        animation.duration,
        time + (animation.start ? animation.start : 0),
        animation.repeat_mode);
    if (animation.live) {
        sprite.DelayDestroy(time + animation.live);
    }
    if (animation.layer) {
        sprite.layer = animation.layer;
    }
    return sprite;
}

Sprite.prototype.SetLocation = function(x, y) {
    this.x = x;
    this.y = y * 0.7;
}

Sprite.prototype.SetLayer = function(layer) {
    this.layer = layer;
}

Sprite.prototype.SetLocation3D = function(x, y, z) {
    this.x = x;
    this.y = y * 0.7;
    this.z = z;
}

Sprite.prototype.PinTo = function(character) {
    this.pin_to = character;
}

Sprite.prototype.SetAngle = function(angle) {
    this.angle = angle;
}

Sprite.prototype.SetAction = function(action, duration, start_time, repeat_mode) {
    this.animation_start_time = start_time;
    this.animation_duration = duration;
    this.animation_repeat_mode = repeat_mode;
    this.action = action;
    this.current_action_frame_config = this.frame_config[action];
}

Sprite.prototype.SetActionWithDefaultDuration = function(action, start_time, repeat_mode) {
    this.SetAction(action, this.frame_config[action].default_duration, start_time, repeat_mode);
}

Sprite.prototype.GetWidth = function() {
    return this.current_action_frame_config.character_width ||
        this.frame_config.character_width ||
        this.sw;
}

Sprite.prototype.GetHeight = function() {
    return this.current_action_frame_config.character_height ||
        this.frame_config.character_height ||
        this.sh;
}

Sprite.prototype.Contain = function(point) {
    var width = this.GetWidth();
    var height = this.GetHeight();
    if (this.x - (width / 2) < point.x &&
        this.x + (width / 2) > point.x &&
        this.y - height <= point.y &&
        this.y + 10 >= point.y) {
        return true;
    }
    return false;
}

Sprite.prototype.Draw = function(context, time, canvas_width, canvas_height) {
    if (time < this.animation_start_time) {
        return;  // not start yet.
    }
    if (this.death_time && this.death_time <= time) {
        this.Destroy();
        return;
    }
    if (this.action == null) {
        return;  // Ignore non-action sprite
    }
    if (this.pin_to) {
        if (!this.pin_to.destroyed && this.pin_to.sprite && !this.pin_to.sprite.destroyed) {
            this.x = this.pin_to.sprite.x;
            this.y = this.pin_to.sprite.y;
        } else {
            return;  // If the object pinned to is invisible, this sprite is also invisible.
        }
    }
    var time_diff = time - this.animation_start_time;

    // Calculate the index of the frame which should be displayed.
    var current_frame_index = -1;
    if (time_diff >= this.animation_duration) {
        if (this.animation_repeat_mode == RepeatMode.RemainLastFrame) {
            current_frame_index = this.current_action_frame_config.end - 1;
        } else {
            time_diff %= this.animation_duration;
        }
    }
    if (current_frame_index == -1) {
        var frame_count = this.current_action_frame_config.end - this.current_action_frame_config.start;
        current_frame_index = ((time_diff * frame_count / this.animation_duration) >> 0) +
            this.current_action_frame_config.start;
    }
    var image_info = this.frame_set[current_frame_index];

    var x = this.x - (this.current_action_frame_config.standing_x || this.frame_config.standing_x || 0);
    var y = this.y - (this.current_action_frame_config.standing_y || this.frame_config.standing_y || 0) - (this.z || 0);
    // Don't draw it if outside the canvas
    if (x - image_info.sw / 2 > canvas_width || y - image_info.sh / 2 > canvas_height ||
        x + image_info.sw / 2 < 0 || y + image_info.sh / 2 < 0) {
        return;
    }

    if (image_info.rotated == 0 && this.angle == 0 && this.current_action_frame_config.reflection == 0) {
        context.drawImage(
            this.frame_sheet_image,
            image_info.x,
            image_info.y,
            image_info.w,
            image_info.h,
            x - image_info.sw / 2 + image_info.sx,
            y - image_info.sh / 2 + image_info.sy,
            image_info.w,
            image_info.h);
    } else {
        context.translate(x, y);
        if (this.current_action_frame_config.reflection == 1) context.scale(-1, 1);
        var angle = this.angle;
        if (image_info.rotated == 1) angle += Math.PI / 2;
        if (angle != 0) context.rotate(-angle);

        context.drawImage(
            this.frame_sheet_image,
            image_info.x,
            image_info.y,
            image_info.w,
            image_info.h,
            image_info.rotated == 0 ?
                - image_info.sw / 2 + image_info.sx :
                image_info.sh / 2 - image_info.w - image_info.sy,
            image_info.rotated == 0 ?
                - image_info.sh / 2 + image_info.sy :
                - image_info.sw / 2 + image_info.sx,
            image_info.w,
            image_info.h);

        if (angle != 0) context.rotate(angle);
        if (this.current_action_frame_config.reflection == 1) context.scale(-1, 1);
        context.translate(-x, -y);
    }
    //context.beginPath();
    //context.rect(this.x - this.GetWidth() / 2, this.y - this.GetHeight(), this.GetWidth(), this.GetHeight());
    //context.stroke();
    //context.fillStyle = "#0000FF";
    //context.fillRect(this.x - 10, this.y, 20, 4);
}

Sprite.prototype.Destroy = function() {
    /*this.frame_set = null;
    this.frame_sheet_image = null;
    this.frame_config = null;
    this.width = 0;
    this.height = 0;
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.angle = 0;
    this.animation_start_time = -1;
    this.animation_duration = -1;
    this.animation_repeated = false;
    this.current_action_frame_config = null;
    this.action = null;*/
    this.destroyed = true;
}

Sprite.prototype.DelayDestroy = function(death_time) {
    this.death_time = death_time;
}