/**
 * Created with JetBrains WebStorm.
 * User: zkfan
 * Date: 8/23/13
 * Time: 8:33 PM
 * To change this template use File | Settings | File Templates.
 */
function Unit(name, x, y) {
    this.x = x;
    this.y = y;
    this.sprite = Sprite.Create(name);
}

Unit.Distance = function(a, b) {
    return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
}

