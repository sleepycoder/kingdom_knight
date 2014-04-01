/**
 * Created with JetBrains WebStorm.
 * User: zkfan
 * Date: 8/24/13
 * Time: 9:43 AM
 * To change this template use File | Settings | File Templates.
 */
g_frame_info = {};
g_frame_config = {};
var g_image_manager = null;
g_sprites = [];
g_releasing_effects = [];
g_characters = [];
var g_map = null;
g_skill_config = {};

function GlobalInit(width, height) {
    g_image_manager = new ImageManager("./frames");
    g_map = new Map(width, height / 0.7, 25);
}