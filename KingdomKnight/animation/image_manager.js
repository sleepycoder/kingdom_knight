/**
 * Created with JetBrains WebStorm.
 * User: zkfan
 * Date: 8/23/13
 * Time: 8:40 PM
 * To change this template use File | Settings | File Templates.
 */
function ImageManager(image_root) {
    this.image_mapping = {};
    this.image_root = image_root;
    this.loaded = 0;
    this.image_count = 0;
}

ImageManager.prototype.AsyncLoadImages = function(image_files, callback) {
    this.image_count += image_files.length;
    var _this = this;
    for (var i = 0; i < image_files.length; ++i) {
        var image = new Image();
        this.image_mapping[image_files[i]] = image;
        image.src = this.image_root + '/' + image_files[i] + '.png';
        image.onload = function() {
            _this.loaded += 1;
            if (_this.loaded == _this.image_count) {
                callback();
            }
        }
    }
}

ImageManager.prototype.GetImage = function(image_file) {
    return this.image_mapping[image_file];
}
