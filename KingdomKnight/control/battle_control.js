/**
 * Created with JetBrains WebStorm.
 * User: zkfan
 * Date: 8/26/13
 * Time: 4:36 PM
 * To change this template use File | Settings | File Templates.
 */

var Controller = {
    canvas : null,
    event_time : null,
    selected_character : null,
    target_character : null,
    event_point : null,
    selection_flag_sprite : null,
    selected_skill : null,
    AttachToCanvas : function(canvas) {
        Controller.canvas = canvas;
        canvas.addEventListener('mousedown', Controller.MouseDown, false);
        //canvas.addEventListener('mouseup', Controller.MouseUp, false);
    },
    ResetSelection : function() {
        Controller.target_character = null;
        Controller.selected_skill = null;
    },
    HandleSkillSelection : function(click_point) {
        var skills = Controller.selected_character.skills;
        for (var i = 0; i < skills.length; ++i) {
            if (skills[i].skill_button && skills[i].skill_button.Contain(click_point)) {
                if (skills[i].IsCoolDown(Controller.event_time)) {
                    if (Controller.selected_skill == skills[i]) {
                        Controller.selected_skill = null;
                    } else {
                        Controller.selected_skill = skills[i];
                    }
                }
                return true;
            }
        }
        return false;
    },
    GetClicked : function(event_point, only_controllable) {
        var new_selected_character = null;
        for (var i = 0; i < g_characters.length; ++i) {
            if (g_characters[i].destroyed || !g_characters[i].sprite) {
                continue;
            }
            if (only_controllable && !g_characters[i].controllable) {
                continue;
            }
            var sprite = g_characters[i].sprite;
            if (sprite.Contain(event_point)) {
                if (!new_selected_character || new_selected_character.sprite.y < sprite.y) {
                    new_selected_character = g_characters[i];
                }
            }
        }
        return new_selected_character;
    },
    MouseDown : function(e) {
        Controller.event_time = new Date().getTime();

        if (!Controller.selection_flag_sprite) {
            Controller.selection_flag_sprite = Sprite.Create("selected_small");
        }

        if (Controller.selected_character && Controller.selected_character.destroyed) {
            Controller.selected_character = null;
        }

        Controller.event_point = {
            x : e.pageX - Controller.canvas.offsetLeft,
            y : e.pageY - Controller.canvas.offsetTop
        };

        // Handle skill selections
        if (Controller.selected_character) {
            if (Controller.HandleSkillSelection(Controller.event_point)) {
                Controller.target_character = null;
                return;
            }
        }

        var clicked_character = Controller.GetClicked(Controller.event_point, false);

        // Handle skill releasing
        if (Controller.selected_skill) {
            if (Controller.selected_skill.IsValidTarget(Controller.selected_character, clicked_character)) {
                if (Controller.selected_skill.type == SkillType.SingleTarget ||
                    Controller.selected_skill.type == SkillType.AreaOnCharacter) {
                    Controller.target_character = clicked_character;
                } else {
                    if (clicked_character) {
                        Controller.target_character = {x : clicked_character.x, y : clicked_character.y};
                    } else {
                        Controller.target_character = {
                            x : Controller.event_point.x,
                            y : Controller.event_point.y / 0.7,
                            destroyed : false
                        }
                    }
                }
                var sprite = Sprite.Create("rally_feedback");
                sprite.SetAction("target", 1000, Controller.event_time, RepeatMode.RemainLastFrame);
                sprite.SetLocation(Controller.target_character.x, Controller.target_character.y);
                sprite.DelayDestroy(Controller.event_time + 1000);
                Controller.selected_character.Spell(Controller.selected_skill, Controller.target_character);
                Controller.selected_skill = null;
            }
            return;
        }

        Controller.target_character = null;
        if (clicked_character && clicked_character.controllable) {
            Controller.selected_character = clicked_character;
            Controller.ResetSelection();
            //Controller.selection_flag_sprite.PinTo(Controller.selected_character);
        } else {
            if (Controller.selected_character) {
                if (clicked_character && Controller.selected_character.Attack(clicked_character)) {
                    Controller.target_character = clicked_character;
                } else {
                    var target_location = {
                        x : Controller.event_point.x,
                        y : Controller.event_point.y / 0.7,
                        destroyed : false
                    }
                    Controller.selected_character.Move(target_location);

                    var sprite = Sprite.Create("rally_feedback");
                    sprite.SetAction("target", 1000, Controller.event_time, RepeatMode.RemainLastFrame);
                    sprite.SetLocation(target_location.x, target_location.y);
                    sprite.DelayDestroy(Controller.event_time + 1000);
                }
            }
        }
    }
};