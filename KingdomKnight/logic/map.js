/**
 * Created with JetBrains WebStorm.
 * User: zkfan
 * Date: 8/23/13
 * Time: 8:33 PM
 * To change this template use File | Settings | File Templates.
 */

function Map(width, height, grid_size) {
    this.grid_size = grid_size;
    this.build_grids = {};
    this.character_grids = {};
    this.n = ((width / grid_size) >> 0);
    this.m = ((height / grid_size) >> 0);
}

Map.DeltaX = [0, 0, 1, -1, 1, 1, -1, -1];
Map.DeltaY = [1, -1, 0, 0, 1, -1, 1, -1];

function Point(x, y) {
    this.x = x;
    this.y = y;
}

Map.prototype.RefillCharacters = function() {
    this.character_grids = {}
    for (var i = 0; i < g_characters.length; ++i) {
        var a = (g_characters[i].x / this.grid_size) >> 0;
        var b = (g_characters[i].y / this.grid_size) >> 0;
        this.character_grids[a * 1000 + b] = g_characters[i];
    }
}

Map.prototype.Occupied = function(x, y) {
    return this.GridOccupied((x / this.grid_size) >> 0, (y / this.grid_size) >> 0);
}

Map.prototype.GridOccupied = function(a, b) {
    return this.character_grids[a * 1000 + b];
}

Map.prototype.LiftCharacter = function(character) {
    var a = (character.x / this.grid_size) >> 0;
    var b = (character.y / this.grid_size) >> 0;
    this.character_grids[a * 1000 + b] = null;
}

Map.prototype.PutCharacter = function(character) {
    var a = (character.x / this.grid_size) >> 0;
    var b = (character.y / this.grid_size) >> 0;
    this.character_grids[a * 1000 + b] = character;
}

Map.prototype.GetCharacters = function(o, r) {
    var left = ((o.x - r) / this.grid_size) >> 0;
    var right = ((o.x + r) / this.grid_size) >> 0;
    var up = ((o.y - r) / this.grid_size) >> 0;
    var down = ((o.y + r) / this.grid_size) >> 0;
    var ans = [];
    for (var i = left; i <= right; ++i) {
        for (var j = up; j <= down; ++j) {
            var character = this.character_grids[i * 1000 + j];
            if (character && Utilities.Distance(character, o) <= r) {
                ans.push(character);
            }
        }
    }
    return ans;
}

Map.prototype.PathTo = function(source, target, allow_distance) {
    var distance = Utilities.Distance(source, target);
    if (distance <= allow_distance) {
        return [];
    }

    var sa = (source.x / this.grid_size) >> 0;
    var sb = (source.y / this.grid_size) >> 0;
    var ta = (target.x / this.grid_size) >> 0;
    var tb = (target.y / this.grid_size) >> 0;
    if (sa == ta && sb == tb) {
        return [new Point(target.x, target.y)];
    }

    // Try to use simple method.
    var simple_path_works = true;
    var delta_x = this.grid_size / distance * (target.x - source.x);
    var delta_y = this.grid_size / distance * (target.y - source.y);
    var movement = this.grid_size;
    var step = 1;
    var x = source.x + delta_x;
    var y = source.y + delta_y;
    var path = [];
    while (step < 5) {
        if (movement + allow_distance > distance) {
            // 1e-3 to avoid round errors.
            var over = movement + allow_distance - distance - 1e-3;
            x -= over / this.grid_size * delta_x;
            y -= over / this.grid_size * delta_y;
        }
        var a = (x / this.grid_size) >> 0;
        var b = (y / this.grid_size) >> 0;
        if ((a != sa || b != sb) && this.GridOccupied(a, b)) {
            simple_path_works = false;
            break;
        }
        path.push(new Point(x, y));
        if (movement + allow_distance > distance) {
            break;
        }
        x += delta_x;
        y += delta_y;
        movement += this.grid_size;
        ++step;
    }
    if (simple_path_works) {
        return path.reverse(); //[Map.ToPoint(source.x + delta_x, source.y + delta_y)];
    }

    // Using complex method
    var source_key = (sa << 16) | sb;
    var best_key = source_key;
    var found = false;
    var best_dis = distance;
    var grid_level = 0;

    var q = [];
    var path_dict = {};
    var q_head = 0;
    q.push(best_key);
    q.push(-1);

    while (q_head != q.length && !found) {
        if ((grid_level >= 4 && best_dis < distance) || grid_level >= 8) break;

        if (q[q_head] == -1) {
            ++q_head;
            ++grid_level;
            q.push(-1);
            continue;
        }
        var position = q[q_head];
        var a = position >> 16;
        var b = position & 65535;
        ++q_head;
        for (var i = 0; i < 8; ++i) {
            var new_a = a + Map.DeltaX[i];
            var new_b = b + Map.DeltaY[i];
            if (0 <= new_a && new_a <= this.n && 0 <= new_b && new_b <= this.m && !this.GridOccupied(new_a, new_b)) {
                var key = (new_a << 16) | new_b;
                if (path_dict[key]) continue;
                path_dict[key] = position;
                if (new_a == ta && new_b == tb) {
                    best_key = key;
                    found = true;
                    break;
                }
                var temp_dis = Utilities.Distance(
                    new Point((new_a + 0.5) * this.grid_size, (new_b + 0.5) * this.grid_size),
                    target);
                if (best_dis >= temp_dis) {
                    best_dis = temp_dis;
                    best_key = key;
                }
                if (temp_dis >= allow_distance) {
                    q.push(key);
                }
            }
        }
    }

    path = [];
    if (found) {
        path.push(new Point(target.x, target.y));
        best_key = path_dict[best_key];
    }
    while (best_key != source_key) {
        path.push(new Point(((best_key >> 16) + 0.5) * this.grid_size, ((best_key & 65535) + 0.5) * this.grid_size));
        best_key = path_dict[best_key];
    }
    if (path.length > 5) {
        path = path.slice(path.length - 5);
    }
    return path;
    /*
    var distance = Utilities.Distance(source, target);
    var length = 20 + 20 * Math.random();
    if (distance <= length) {
        return [target];
    } else {
        return [
            {
                x : source.x + length / distance * (target.x - source.x) + (source.force == 0 ? 0 : Math.random() * 40 - 20),
                y : source.y + length / distance * (target.y - source.y) + (source.force == 0 ? 0 : Math.random() * 40 - 20)
            }];
    } */
}