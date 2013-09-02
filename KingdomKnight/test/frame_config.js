/**
 * Created with JetBrains WebStorm.
 * User: zkfan
 * Date: 8/23/13
 * Time: 2:08 PM
 * To change this template use File | Settings | File Templates.
 */


frame_config = {};
frame_config["move_right"] = {
    start : 0,
    end : 22,
    reflection : 0,
    default_duration : 800
};
frame_config["move_left"] = {
    start : 0,
    end : 22,
    reflection : 1,
    default_duration : 800
};
frame_config["move_up"] = {
    start : 22,
    end : 44,
    reflection : 0,
    default_duration : 800
};
frame_config["move_down"] = {
    start : 44,
    end : 66,
    reflection : 0,
    default_duration : 800
};
frame_config["wait_right"] = {
    start : 66,
    end : 67,
    reflection : 0,
    default_duration : 400
}
frame_config["wait_left"] = {
    start : 66,
    end : 67,
    reflection : 1,
    default_duration : 400
}
frame_config["prepare_attack_right"] = {
    start : 66,
    end : 72,
    reflection : 0,
    default_duration : 200
};
frame_config["finish_attack_right"] = {
    start : 72,
    end : 77,
    reflection : 0,
    fire_point_height : 20,
    default_duration : 300
};
frame_config["prepare_attack_left"] = {
    start : 66,
    end : 72,
    reflection : 1,
    default_duration : 200
};
frame_config["finish_attack_left"] = {
    start : 72,
    end : 77,
    reflection : 1,
    fire_point_height : 20,
    default_duration : 300
};
frame_config["die_right"] = {
    start : 98,
    end : 106,
    reflection : 0,
    default_duration : 800
};
frame_config["die_left"] = {
    start : 98,
    end : 106,
    reflection : 1,
    default_duration : 800
};
frame_config.standing_x = 0;
frame_config.standing_y = 13;
frame_config.character_height = 30;
frame_config.character_width = 30;
g_frame_config["Canibal"] = frame_config;


frame_config = {};
frame_config["move_right"] = {
    start : 0,
    end : 22,
    reflection : 0,
    default_duration : 800
};
frame_config["move_left"] = {
    start : 0,
    end : 22,
    reflection : 1,
    default_duration : 800
};
frame_config["move_up"] = {
    start : 22,
    end : 44,
    reflection : 0,
    default_duration : 800
};
frame_config["move_down"] = {
    start : 44,
    end : 66,
    reflection : 0,
    default_duration : 800
};
frame_config["wait_right"] = {
    start : 66,
    end : 69,
    reflection : 0,
    default_duration : 400
}
frame_config["wait_left"] = {
    start : 66,
    end : 69,
    reflection : 1,
    default_duration : 400
}
frame_config["prepare_attack_right"] = {
    start : 66,
    end : 79,
    reflection : 0,
    default_duration : 200
};
frame_config["finish_attack_right"] = {
    start : 79,
    end : 87,
    reflection : 0,
    fire_point_height : 20,
    default_duration : 300
};
frame_config["prepare_attack_left"] = {
    start : 66,
    end : 79,
    reflection : 1,
    default_duration : 200
};
frame_config["finish_attack_left"] = {
    start : 79,
    end : 87,
    reflection : 1,
    fire_point_height : 20,
    default_duration : 300
};
frame_config["die_right"] = {
    start : 87,
    end : 94,
    reflection : 0,
    default_duration : 800
};
frame_config["die_left"] = {
    start : 87,
    end : 94,
    reflection : 1,
    default_duration : 800
};
frame_config.standing_x = 0;
frame_config.standing_y = 23;
frame_config.character_height = 40;
frame_config.character_width = 30;
g_frame_config["CanibalShamanMagic"] = frame_config;

frame_config = {}
frame_config["move"] = {
    start : 0,
    end : 2,
    reflection : 0,
    default_duration : 200
}
frame_config["effect"] = {
    start : 2,
    end : 10,
    reflection : 0,
    default_duration : 400
}
frame_config.standing_x = 8;
frame_config.standing_y = 0;
g_frame_config["CanibalShamanMagicBolt"] = frame_config;

frame_config = {};
frame_config["move_right"] = {
    start : 1,
    end : 9,
    reflection : 0,
    default_duration : 800
};
frame_config["move_left"] = {
    start : 1,
    end : 9,
    reflection : 1,
    default_duration : 800
};
frame_config["wait_right"] = {
    start : 7,
    end : 8,
    reflection : 0,
    default_duration : 2000
}
frame_config["wait_left"] = {
    start : 7,
    end : 8,
    reflection : 1,
    default_duration : 2000
}
frame_config["prepare_attack_right"] = {
    start : 39,
    end : 46,
    reflection : 0,
    default_duration : 300
};
frame_config["finish_attack_right"] = {
    start : 46,
    end : 55,
    reflection : 0,
    fire_point_height : 55,
    default_duration : 300
};
frame_config["prepare_attack_left"] = {
    start : 39,
    end : 46,
    reflection : 1,
    default_duration : 300
};
frame_config["finish_attack_left"] = {
    start : 46,
    end : 55,
    reflection : 1,
    fire_point_height : 55,
    default_duration : 300
};
frame_config["prepare_spell_right"] = {
    start : 20,
    end : 25,
    reflection : 0,
    default_duration : 1000
};
frame_config["finish_spell_right"] = {
    start : 25,
    end : 40,
    reflection : 0,
    default_duration : 300
};
frame_config["prepare_spell_left"] = {
    start : 20,
    end : 25,
    reflection : 1,
    default_duration : 1000
};
frame_config["finish_spell_left"] = {
    start : 25,
    end : 40,
    reflection : 1,
    default_duration : 300
};
frame_config["die_right"] = {
    start : 78,
    end : 84,
    reflection : 0,
    default_duration : 800
};
frame_config["die_left"] = {
    start : 78,
    end : 84,
    reflection : 1,
    default_duration : 800
};
frame_config.standing_x = 0;
frame_config.standing_y = 55;
frame_config.character_height = 50;
frame_config.character_width = 50;
g_frame_config["hero_mage"] = frame_config;

frame_config = {}
frame_config["rain"] = {
    start : 0,
    end : 15,
    reflection : 0,
    standing_x : 0,
    standing_y : 135
}
g_frame_config["hero_mage_rain"] = frame_config;

frame_config = {}
frame_config["ground"] = {
    start : 0,
    end : 1,
    reflection : 0,
    standing_x : 0,
    standing_y : 0
}
g_frame_config["hero_mage_rain_decal"] = frame_config;

frame_config = {}
frame_config["select"] = {
    start : 0,
    end : 1,
    reflection : 0,
    standing_x : 0,
    standing_y : 0
}
g_frame_config["selected_med"] = frame_config;

frame_config = {}
frame_config["select"] = {
    start : 0,
    end : 1,
    reflection : 0,
    standing_x : 0,
    standing_y : 0
}
g_frame_config["selected_small"] = frame_config;

frame_config = {}
frame_config["target"] = {
    start : 0,
    end : 30,
    reflection : 0,
    standing_x : 0,
    standing_y : 0
}
g_frame_config["rally_feedback"] = frame_config;

frame_config = {}
frame_config["move"] = {
    start : 0,
    end : 2,
    reflection : 0,
    default_duration : 200
}
frame_config["effect"] = {
    start : 2,
    end : 6,
    reflection : 0,
    default_duration : 400
}
g_frame_config["hero_mage_bolt"] = frame_config;