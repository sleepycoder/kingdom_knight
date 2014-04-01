/**
 * Created with JetBrains WebStorm.
 * User: zkfan
 * Date: 8/24/13
 * Time: 3:52 PM
 * To change this template use File | Settings | File Templates.
 */

var CharacterActionType = {
  Wait:0,
  Move:1,
  Attack:2,
  Spell:3,
  Die:4
}

function CharacterAction(action_type, start_time, data, target) {
  this.action_type = action_type;
  this.start_time = start_time;
  this.last_time = start_time;
  this.data = data;
  this.target = target;
}

var CharacterCommandType = {
  Guard:0,
  Move:1,
  Attack:2,
  Spell:3,
  Die:4,
  GuardAttack:5
}

function CharacterCommand(command_type, data, target) {
  this.command_type = command_type;
  this.data = data;
  this.target = target;
}

function Character(name, animation, controllable, force, x, y, toward_left, speed, max_hit_point, armor, armor_type, main_skill, skills) {
  this.name = name;
  this.controllable = controllable;
  this.force = force;
  this.sprite = Sprite.Create(animation);
  this.sprite.SetActionWithDefaultDuration("wait_right", 0, RepeatMode.Repeated);
  this.sprite.SetLocation(x, y);
  new HitPointBar(this.sprite, this);
  this.x = x;
  this.y = y;
  this.toward_left = toward_left;
  this.speed = speed;
  this.hit_point = max_hit_point;
  this.max_hit_point = max_hit_point;
  this.armor = armor;
  this.armor_type = armor_type;
  this.effects = [];
  this.main_skill = main_skill;
  this.skills = skills;
  this.destroyed = false;
  this.action = null;
  this.commands = [new CharacterCommand(CharacterCommandType.Guard, null, null)];
  this.command_change = false;
  this.effect_attached = false;
  g_characters.push(this);
}

Character.prototype.Destroy = function () {
  this.name = null;
  if (this.sprite) {
    this.sprite.Destroy();
  }
  this.effects = null;
  this.skills = null;
  this.action = null;
  this.commands = null;
  this.destroyed = true;
}

Character.prototype.AddEffect = function (time, decay, effect) {
  this.effect_attached = true;
  this.effects.push(new AttachedEffect(time, decay, effect, this));
}

Character.prototype.Attack = function (target) {
  if (this.main_skill.IsValidTarget(this, target)) {
    this.commands = [new CharacterCommand(CharacterCommandType.Attack, null, target)];
    this.command_change = true;
    return true;
  }
  return false;
}

Character.prototype.Spell = function (skill, target) {
  var check = false;
  for (var i = 0; i < this.skills.length; ++i) {
    if (skill == this.skills[i]) {
      check = true;
    }
  }
  if (!check) {
    throw this.name + " doesn't has the skill " + skill.name;
  }
  if (skill.IsValidTarget(this, target)) {
    this.commands = [new CharacterCommand(CharacterCommandType.Spell, skill, target)];
    this.command_change = true;
    return true;
  }
  return false;
}

Character.prototype.Move = function (target) {
  this.commands = [new CharacterCommand(CharacterCommandType.Move, null, target)];
  this.command_change = true;
  return true;
}

Character.prototype.GuardAttack = function (target) {
  this.commands = [new CharacterCommand(CharacterCommandType.GuardAttack, null, target)];
  this.command_change = true;
  return true;
}

Character.prototype.GetRoughPosition = function () {
  return {x:this.x + Math.random() * 20 - 10, y:this.y + Math.random() * 20 - 10};
}

Character.prototype.FindEnemyInRange = function () {
  var target = null;
  var target_distance = 0;

  var range = this.main_skill.skill_config.range;
  var characters = g_map.GetCharacters(this, range);
  for (var i = 0; i < characters.length; ++i) {
    if (this.main_skill.IsValidTarget(this, characters[i])) {
      var temp_distance = Utilities.Distance(this, characters[i]);
      if (!target || target_distance > temp_distance) {
        target = characters[i];
        target_distance = temp_distance;
      }
    }
  }
  return target;
}

Character.prototype.FindEnemyOnAttacking = function () {
  var characters = [];
  for (var i = 0; i < this.effects.length; ++i) {
    characters.push(this.effects[i].effect.source);
  }
  var target = null;
  var target_distance = 0;
  for (var i = 0; i < characters.length; ++i) {
    if (this.main_skill.IsValidTarget(this, characters[i])) {
      var temp_distance = Utilities.Distance(this, characters[i]);
      if (!target || target_distance > temp_distance) {
        target = characters[i];
        target_distance = temp_distance;
      }
    }
  }
  return target;
}

Character.prototype.FindEnemy = function (range) {
  var characters = g_map.GetCharacters(this, range);
  var target = null;
  var target_distance = 0;
  for (var i = 0; i < characters.length; ++i) {
    if (this.main_skill.IsValidTarget(this, characters[i])) {
      var temp_distance = Utilities.Distance(this, characters[i]);
      if (!target || target_distance > temp_distance) {
        target = characters[i];
        target_distance = temp_distance;
      }
    }
  }
  return target;
}

Character.prototype.GetRange = function() {
  return this.main_skill.skill_config.range;
}

Character.prototype.Execute = function (time) {
  if (this.commands.length == 0) {
    this.commands.push(new CharacterCommand(CharacterCommandType.Guard, null, null));
  }

  var command = this.commands[this.commands.length - 1];
  if (command.command_type == CharacterCommandType.Die) {
    this.action = new CharacterAction(CharacterActionType.Die, time, command.data, command.target);
    return;
  }

  if (this.command_change) {
    /*if (this.action &&
        (this.action.action_type != CharacterActionType.Wait &&
            this.action.action_type != CharacterActionType.Move)) {
      return;
    }*/
  } else if (this.effect_attached) {
    if (this.action && this.action.action_type != CharacterActionType.Wait) {
      return;
    }
  } else {
    if (this.action != null) return;
  }

  this.command_change = false;
  this.effect_attached = false;
  var allow_distance = 0;
  var target_enemy = null;
  if (command.command_type == CharacterCommandType.Guard) {
    target_enemy = this.FindEnemyInRange() || this.FindEnemyOnAttacking();
    if (!target_enemy && this.main_skill.skill_config.range < 200) {
      target_enemy = this.FindEnemy(200);
    }
    if (target_enemy) {
      command = new CharacterCommand(CharacterCommandType.GuardAttack, null, target_enemy);
      this.commands.push(command);
    } else {
      this.action = new CharacterAction(CharacterActionType.Wait, time, 300, null);
      return;
    }
  }

  if (command.command_type == CharacterCommandType.GuardAttack) {
    if (command.target.destroyed == true) {
      this.commands.pop();
      this.Execute(time);
      return;
    }
    if (!target_enemy) target_enemy = this.FindEnemyInRange() || this.FindEnemyOnAttacking();
    if (target_enemy) {
      if (Utilities.Distance(this, target_enemy) <= this.GetRange()) {
        this.action = new CharacterAction(CharacterActionType.Attack, time, null, target_enemy);
        return;
      } else {
        if (this.commands.length == 1) {
          command = new CharacterCommand(CharacterCommandType.GuardAttack, null, target_enemy);
          this.commands.push(command);
        } else {
          command.target = target_enemy;
        }
        allow_distance = this.main_skill.skill_config.range;
      }
    }
  }

  if (command.command_type == CharacterCommandType.Attack ||
      command.command_type == CharacterCommandType.Spell) {
    if (command.target.destroyed) {
      this.commands.pop();
      this.Execute(time);
      return;
    }
    var distance = Utilities.Distance(command.target, this);
    if (command.command_type == CharacterCommandType.Attack &&
        distance <= this.main_skill.skill_config.range) {
      if (this.main_skill.IsCoolDown(time)) {
        this.action = new CharacterAction(CharacterActionType.Attack, time, null, command.target);
      } else {
        this.action = new CharacterAction(CharacterActionType.Wait, time, 100, null);
      }
      return;
    } else {
      var skill = command.data;
      if (command.command_type == CharacterCommandType.Spell && distance <= skill.skill_config.range) {
        if (skill.IsCoolDown(time)) {
          this.action = new CharacterAction(CharacterActionType.Spell, time, skill, command.target);
          this.commands.pop();
        } else {
          this.action = new CharacterAction(CharacterActionType.Wait, time, 100, null);
        }
        return;
      }
    }
    allow_distance = this.main_skill.skill_config.range;
  }

  if ((command.command_type == CharacterCommandType.Move ||
      command.command_type == CharacterCommandType.GuardAttack)
      && Utilities.Distance(this, command.target) <= 5) {
    this.commands.pop();
    this.Execute(time);
    return;
  }

  var path = g_map.PathTo(this, command.target, allow_distance);
  if (path.length == 0) {
    this.action = new CharacterAction(CharacterActionType.Wait, time, 500, null);
  } else {
    this.action = new CharacterAction(
        CharacterActionType.Move,
        time,
        path,
        command.target);
  }
}

Character.prototype.DoAction = function (time) {
  if (this.action.action_type == CharacterActionType.Wait) {
    var sprite_action = "wait_" + (this.toward_left ? "left" : "right");
    if (this.sprite.action != sprite_action) {
      this.sprite.SetActionWithDefaultDuration(sprite_action, time, RepeatMode.Repeated);
    }
    if (time >= this.action.start_time + this.action.data) {
      //time = this.action.start_time + this.action.data;
      this.action = null;
      this.Execute(time);
    }
    return;
  }

  if (this.action.action_type == CharacterActionType.Move) {
    var data = this.action.data;
    g_map.LiftCharacter(this);
    while (data.length > 0) {
      var next_position = data[data.length - 1];
      if (g_map.Occupied(next_position.x, next_position.y)) {
        this.action.data = [];
        break;
      }
      var distance = Utilities.Distance(this, next_position);
      var movement = (time - this.action.last_time) * this.speed;
      if (movement >= distance) {
        this.x = next_position.x;
        this.y = next_position.y;
        this.action.last_time += distance / this.speed;
        data.pop();
      } else {
        this.x += (next_position.x - this.x) * movement / distance;
        this.y += (next_position.y - this.y) * movement / distance;
        var sprite_action = null;
        if (!this.sprite.frame_config["move_up"]) {
          sprite_action = next_position.x > this.x ? "move_right" : "move_left";
        } else {
          if (Math.abs(next_position.x - this.x) * 2 > Math.abs(next_position.y - this.y)) {
            sprite_action = next_position.x > this.x ? "move_right" : "move_left";
          } else {
            sprite_action = next_position.y > this.y ? "move_down" : "move_up";
          }
        }
        this.toward_left = next_position.x <= this.x;
        if (this.sprite.action != sprite_action) {
          this.sprite.SetActionWithDefaultDuration(sprite_action, this.action.last_time, RepeatMode.Repeated);
        }
        // this.sprite.SetLocation(this.x, this.y);
        this.action.last_time = time;
        break;
      }
    }
    this.sprite.SetLocation(this.x, this.y);
    g_map.PutCharacter(this);
    if (data.length == 0) {
      time = this.action.last_time;
      this.action = null; // new CharacterAction(CharacterActionType.Wait, time, 300, null);
      this.Execute(time);
    }
    return;
  }

  if (this.action.action_type == CharacterActionType.Die) {
    var sprite_action = this.action.data;
    if (!sprite_action) {
      sprite_action = this.toward_left ? "die_left" : "die_right";
    }
    if (this.sprite.action.data != sprite_action) {
      this.sprite.SetActionWithDefaultDuration(
          sprite_action, this.action.start_time, RepeatMode.RemainLastFrame);
      this.sprite.DelayDestroy(this.action.start_time + 5000);
      this.sprite = null;
      this.Destroy();
      return;
    }
  }

  if (this.action.action_type == CharacterActionType.Attack ||
      this.action.action_type == CharacterActionType.Spell) {
    var skill = null;
    var sprite_action = null;
    if (this.action.action_type == CharacterActionType.Attack) {
      skill = this.main_skill;
      if (skill.owner_action) {
        sprite_action = "_" + skill.owner_action + "_";
      } else {
        sprite_action = "_attack_";
      }
    } else {
      skill = this.action.data;
      if (skill.owner_action) {
        sprite_action = "_" + skill.owner_action + "_";
      } else {
        sprite_action = "_spell_";
      }
    }
    var direction = this.action.target.x > this.x ? "right" : "left";
    this.toward_left = this.action.target.x <= this.x;
    if (time - this.action.start_time <= skill.skill_config.preparing_time) {
      if (this.sprite.action != "prepare" + sprite_action + direction) {
        this.sprite.SetAction(
            "prepare" + sprite_action + direction,
            skill.skill_config.preparing_time,
            this.action.start_time,
            RepeatMode.RemainLastFrame);
      }
    } else if (time - this.action.start_time <=
        skill.skill_config.preparing_time + skill.skill_config.finishing_time) {
      if (this.sprite.action != "finish" + sprite_action + direction) {
        this.sprite.SetAction(
            "finish" + sprite_action + direction,
            skill.skill_config.finishing_time,
            this.action.start_time + skill.skill_config.preparing_time,
            RepeatMode.RemainLastFrame);
        skill.Cast(
            time,
            this,
            this.action.target,
            this.sprite.current_action_frame_config.fire_point_height || 0,
            this.action.target.sprite && this.action.target.sprite.GetHeight ?
                this.action.target.sprite.GetHeight() / 2 : 0);
      }
    } else {
      time = this.action.start_time + skill.skill_config.preparing_time + skill.skill_config.finishing_time;
      this.action = null; // new CharacterAction(CharacterActionType.Wait, time, null, null);
      this.Execute(time);
    }
    return;
  }
}

Character.prototype.Die = function (attached_effect) {
  if (attached_effect.releasing_effect.target_range == 0) {
    this.commands = [new CharacterCommand(
        CharacterActionType.Die,
        attached_effect.effect.source.x <= this.x ? "die_left" : "die_right",
        attached_effect.effect.source)];
    this.command_change = true;
  } else {
    this.commands = [new CharacterCommand(
        CharacterActionType.Die,
        attached_effect.releasing_effect.target.x <= this.x ? "die_left" : "die_right",
        attached_effect.effect.source)];
    this.command_change = true;
  }
}