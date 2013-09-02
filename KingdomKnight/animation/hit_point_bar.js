/**
 * Created with JetBrains WebStorm.
 * User: zkfan
 * Date: 8/25/13
 * Time: 9:17 PM
 * To change this template use File | Settings | File Templates.
 */

function HitPointBar(sprite, character) {
    this.sprite = sprite;
    this.character = character;
    this.destroyed = false;
    this.layer = 0;
    g_sprites.push(this);
}

HitPointBar.prototype.Destroy = function() {
    this.sprite = null;
    this.character = null;
    this.destroyed = true;
}

HitPointBar.prototype.Update = function() {
    if (this.sprite.destroyed || this.character.destroyed) {
        this.Destroy();
        return;
    }
    this.x = this.sprite.x;
    this.y = this.sprite.y;
    this.z = this.sprite.z;
}

HitPointBar.prototype.Draw = function(context, time, canvas_width, canvas_height) {
    // Filter it out if outside the canvas
    this.Update();
    if (!this.destroyed) {
        /*context.beginPath();
        context.rect(this.sprite.x - this.sprite.width / 6 - 1,
                     this.sprite.y - this.sprite.height - 1,
                     this.sprite.width / 3 + 2,
                     5);
        context.stroke();*/
        var percentage = this.character.hit_point / this.character.max_hit_point;
        if (percentage == 1 && Controller.selected_character != this.character &&
            Controller.target_character != this.character) {
            return;
        }
        var w = this.sprite.GetWidth();
        var h = this.sprite.GetHeight();
        var x = this.sprite.x;
        var y = this.sprite.y - h - 10;
        var t = 2 * w / 3;
        if (percentage > 0.5) {
            context.fillStyle = "#00FF33";
        } else {
            context.fillStyle = "#FFFF00";
        }
        context.fillRect(x - w / 3, y, t * percentage, 3);
        if (percentage != 1) {
            context.fillStyle = "#FF0000";
            context.fillRect(x - w / 3 + t * percentage, y, t * (1 - percentage), 3);
        }
    }
}