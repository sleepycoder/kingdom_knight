/**
 * Created with JetBrains WebStorm.
 * User: zkfan
 * Date: 8/27/13
 * Time: 9:13 PM
 * To change this template use File | Settings | File Templates.
 */

function SkillButtonSprite(
    skill_name, description, skill, icon_set_name, icon_index, off_icon_set_name, off_icon_index) {
    this.icon_frame_info = g_frame_info[icon_set_name].image_set[icon_index];
    this.off_icon_frame_info = g_frame_info[off_icon_set_name].image_set[off_icon_index];
    this.icon_sheet_image = g_image_manager.GetImage(g_frame_info[icon_set_name].image_sheet_file);
    this.off_icon_sheet_image = g_image_manager.GetImage(g_frame_info[off_icon_set_name].image_sheet_file);
    this.skill_name = skill_name;
    this.description = description;
    this.skill = skill;
    this.destroyed = false;
}

SkillButtonSprite.SetBorder = function(
    icon_set_name, border_index, selected_icon_set_name, selected_border_index) {
    SkillButtonSprite.icon_border_info = g_frame_info[icon_set_name].image_set[border_index];
    SkillButtonSprite.selected_icon_border_info = g_frame_info[selected_icon_set_name].image_set[selected_border_index];
    SkillButtonSprite.icon_border_sheet_image = g_image_manager.GetImage(g_frame_info[icon_set_name].image_sheet_file);
    SkillButtonSprite.selected_icon_border_sheet_image =
        g_image_manager.GetImage(g_frame_info[selected_icon_set_name].image_sheet_file);
}

SkillButtonSprite.prototype.SetLocation = function(x, y) {
    this.x = x;
    this.y = y;
}

SkillButtonSprite.prototype.SetSize = function(width, height) {
    this.width = width;
    this.height = height;
}

SkillButtonSprite.prototype.Destroy = function() {
    this.destroyed = true;
}

SkillButtonSprite.prototype.Contain = function(point) {
    if (this.x  < point.x &&
        this.x + this.width > point.x &&
        this.y  < point.y &&
        this.y + this.height > point.y) {
        return true;
    }
    return false;
}

SkillButtonSprite.prototype.Draw = function(context, time, canvas_width, canvas_height) {
    if (this.destroyed) {
        return;
    }

    var percentage = this.skill.GetCoolDownPercentage(time);
    if (percentage == 1) {
        context.drawImage(
            this.icon_sheet_image,
            this.icon_frame_info.x,
            this.icon_frame_info.y,
            this.icon_frame_info.w,
            this.icon_frame_info.h,
            this.x,  // ignore sx and sy
            this.y,  //
            this.width,
            this.height);
        if (Controller.selected_skill != this.skill) {
            /*context.drawImage(
                SkillButtonSprite.icon_border_sheet_image,
                SkillButtonSprite.icon_border_info.x,
                SkillButtonSprite.icon_border_info.y,
                SkillButtonSprite.icon_border_info.w,
                SkillButtonSprite.icon_border_info.h,
                this.x - 2,  // ignore sx and sy
                this.y - 2,  //
                this.width + 4,
                this.height + 4);*/
        } else {
            context.drawImage(
                SkillButtonSprite.selected_icon_border_sheet_image,
                SkillButtonSprite.selected_icon_border_info.x,
                SkillButtonSprite.selected_icon_border_info.y,
                SkillButtonSprite.selected_icon_border_info.w,
                SkillButtonSprite.selected_icon_border_info.h,
                this.x,  // ignore sx and sy
                this.y,  //
                this.width,
                this.height);
        }
    } else {
        context.drawImage(
            this.icon_sheet_image,
            this.icon_frame_info.x,
            this.icon_frame_info.y,
            this.icon_frame_info.w,
            this.icon_frame_info.h,
            this.x,  // ignore sx and sy
            this.y,  //
            this.width,
            this.height);
        //var image_data = context.getImageData(this.x, this.y, this.width, this.height * percentage);
        context.drawImage(
            this.off_icon_sheet_image,
            this.off_icon_frame_info.x,
            this.off_icon_frame_info.y + this.off_icon_frame_info.h * percentage,
            this.off_icon_frame_info.w,
            this.off_icon_frame_info.h * (1 - percentage),
            this.x,  // ignore sx and sy
            this.y + this.height * percentage,  //
            this.width,
            this.height * (1 - percentage));
        //context.putImageData(image_data, this.x, this.y);
        /**/
    }
}