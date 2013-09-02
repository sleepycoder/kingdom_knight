/**
 * Created with JetBrains WebStorm.
 * User: zkfan
 * Date: 8/23/13
 * Time: 10:05 AM
 * To change this template use File | Settings | File Templates.
 */

function Board(context, canvas_width, canvas_height) {
    this.context = context;
    this.canvas_width = canvas_width;
    this.canvas_height = canvas_height;
}

Board.prototype.SortAndRemoveDestroyed = function() {
    Utilities.RemoveDestroyedOnes(g_sprites);
    g_sprites.sort(
        function(a, b){
            return (a.layer > b.layer ||
                    (a.layer == b.layer && (a.y > b.y || (a.y == b.y && a.id > b.id)))) ? 1 : -1;
        }
    );
}

Board.prototype.DrawSkillButtons = function(time) {
    if (!Controller.selected_character || Controller.selected_character.destroyed) {
        return;
    }
    var skills = Controller.selected_character.skills;
    var main_skill = Controller.selected_character.main_skill;
    var x = this.canvas_width - 100;
    var y = this.canvas_height - 100;
    if (main_skill && main_skill.skill_button) {
        main_skill.skill_button.SetLocation(x, y);
        main_skill.skill_button.SetSize(60, 60);
        main_skill.skill_button.Draw(this.context, time, this.canvas_width, this.canvas_height);
        x -= 100;
    }
    for (var i = 0; i < skills.length; ++i) {
        if (skills[i].skill_button) {
            skills[i].skill_button.SetLocation(x, y);
            skills[i].skill_button.SetSize(60, 60);
            skills[i].skill_button.Draw(this.context, time, this.canvas_width, this.canvas_height);
            x -= 100;
        }
    }
}

Board.prototype.Draw = function(time) {
    this.context.clearRect(0, 0, this.canvas_width, this.canvas_height);

    if (Controller.selected_character && !Controller.selected_character.destroyed &&
        Controller.selected_character.sprite) {

        this.context.scale(1, 0.5);
        if (time % 1000 < 500) {
            this.context.strokeStyle = "#00FF00";
            this.context.lineWidth = 2;

            this.context.beginPath();
            this.context.arc(
                Controller.selected_character.sprite.x,
                Controller.selected_character.sprite.y * 2,
                Controller.selected_character.sprite.GetWidth() / 2 + 5,
                0,
                Math.PI * 2,
                true);
            this.context.stroke();
        } else {
            this.context.beginPath();
            this.context.lineWidth = 2;
            this.context.strokeStyle = "#00FF00";
            this.context.arc(
                Controller.selected_character.sprite.x,
                Controller.selected_character.sprite.y * 2,
                Controller.selected_character.sprite.GetWidth() / 2 + 6,
                0,
                Math.PI * 2,
                true);
            this.context.stroke();
        }
        this.context.scale(1, 2);
    }

    if (Controller.selection_flag_sprite) {
        if (Controller.target_character && !Controller.target_character.destroyed &&
            time <= Controller.event_time + 1000 && (((time - Controller.event_time) / 250) >> 0) % 2 == 0) {
            Controller.selection_flag_sprite.SetLocation(Controller.target_character.x,
                                                         Controller.target_character.y);
            Controller.selection_flag_sprite.SetAction("select", 1000, 1, RepeatMode.RemainLastFrame);
        } else {
            Controller.selection_flag_sprite.action = null;
        }
    }

    /*if (time < Controller.event_time + 2000) {
        if (Controller.selection_flag_sprite &&
            Controller.selected_character && !Controller.selected_character.destroyed &&
            Controller.selected_character.command && Controller.selected_character.command.target) {
            this.context.strokeStyle = "#00FF00";
            this.context.lineWidth = 1
            var x = Controller.selected_character.x;
            var y = Controller.selected_character.y;
            var distance = Utilities.Distance(
                Controller.selected_character,
                Controller.selected_character.command.target);
            var ax = (Controller.selected_character.command.target.x - Controller.selected_character.x) / distance;
            var ay = (Controller.selected_character.command.target.y - Controller.selected_character.y) / distance;
            this.context.beginPath();
            var solid = true;
            var length = 0;
            while (length < distance) {
                var segment = 6;
                if (segment + length > distance) segment = distance - length;
                if (solid && length >= 10 && distance - length >= 10) {
                    this.context.moveTo(x, y);
                    x += ax * segment;
                    y += ay * segment;
                    this.context.lineTo(x, y);
                    solid = false;
                } else {
                    x += ax * segment;
                    y += ay * segment;
                    solid = true;
                }
                length += segment;
            }
            this.context.stroke();
        }
    }*/

    this.SortAndRemoveDestroyed();
    for (var i = 0; i < g_sprites.length; ++i) {
        g_sprites[i].id = i;
        g_sprites[i].Draw(this.context, time, this.canvas_width, this.canvas_height);
        //this.context.fillText(i + "", g_sprites[i].x - 20, g_sprites[i].y);
    }
    this.DrawSkillButtons(time);

    this.context.fillStyle = "#000000";
    this.context.fillText(
        "character:" + g_characters.length + ", sprite:" + g_sprites.length +
            ", releasing_effect:" + g_releasing_effects.length,
        10,
        10);
    if (this.start_time) {
        this.frame_count += 1;
        this.context.fillText(
            "FPS : " + ((this.frame_count * 1000 / (time - this.start_time)) >> 0),
            10,
            20);
    } else {
        this.start_time = time;
        this.frame_count = 0;
    }

}