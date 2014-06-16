(function(window) {

    var col = 30, row = 30;
    var maxgray = 0, mingray = 255; // 最大、最小灰度值

    $('.pattern').width(col * 20).height(row * 20);

    function loadImage(imageSrc) {
        var imageObj = new Image();
        imageObj.onload = function () {
            // 生成离屏画布
            var offcanvas = document.createElement('canvas');
            var imgw, imgh, i, j; // 缩放后的图片尺寸
            
            if (col / row > imageObj.width / imageObj.height) { // 如果画布比图片宽，则以高度为准进行放缩
                imgw = Math.floor(imageObj.width / imageObj.height * row);
                imgh = row;
            } else { // 否则以宽度为准进行放缩
                imgw = col;
                imgh = Math.floor(imageObj.height / imageObj.width * col);
            }

            offcanvas.width = imgw;
            offcanvas.height = imgh;
            var offctx = offcanvas.getContext('2d');
            offctx.drawImage(this, 0, 0, imgw, imgh);

            // 高斯模糊
            stackBlurCanvasRGB(offcanvas, 0, 0, imgw, imgh, 1);

            var imgdata = offctx.getImageData(0, 0, imgw, imgh);

            // 返回数组初始化为全黑
            var returndata = [];
            for (i = 0; i < row; i++) {
                returndata[i] = [];
                for (var j = 0; j < col; j++) {
                    returndata[i][j] = 255;
                }
            }

            // 设置开始节点
            var startcol = Math.floor((col - imgw) / 2);
            var startrow = Math.floor((row - imgh) / 2);

            for (i = 0; i < imgh; i++) {
                for (j = 0; j < imgw; j++) {
                    var cursor = (i * imgw + j) * 4;
                    var gray = imgdata.data[cursor] * .3 + imgdata.data[cursor + 1] * .59 + imgdata.data[cursor + 2] * .11; // 取灰度
                    if (gray > maxgray) maxgray = gray;
                    if (gray < mingray) mingray = gray;
                    returndata[i + startrow][j + startcol] = gray;
                }
            }
            drawPattern(returndata);
        };
        imageObj.src = imageSrc;
    }


    function drawPattern(imgdata) {
        var html = [];
        for (var i = 0; i < row; i++) {
            for (var j = 0; j < col; j++) {
                var gray = (imgdata[i][j] - mingray) / (maxgray - mingray); // 以最大和最小灰度为界，计算出相对灰度
                var extra;
                switch (Math.ceil(gray * 5)) {
                case 0:
                    extra = 'white';
                    break;
                case 1:
                    extra = 'tiny';
                    break;
                case 2:
                    extra = 'small';
                    break;
                case 3:
                    extra = 'medium';
                    break;
                default:
                    extra = '';
                    break;
                }
                html.push('<div class="cell ', extra,'" style="left:', j * 20, 'px;top:', i * 20, 'px;"><div class="corner"></div></div>');
            }
        }
        $('.pattern').html(html.join('')).show();

        for (var i = 0; i < row; i++) {
            for (var j = 0; j < col; j++) {
                (function(i, j) {
                    setTimeout(function() {
                        $('.pattern :nth-child(' + (i * col + j + 1) + ')').addClass('flash');
                    }, i * 1 + j * 2);
                }(i, j));
            }
        }
    }


    $('.opts').on('click', 'button', function(e) {
        loadImage('images/' + $(e.currentTarget).attr('data-src'));
    });
    $('.opts input[type="file"]').on('change', function(e) {
        var file = this.files[0];
        if (!/image\/\w+/.test(file.type)) {
            alert("你选择的不是图片文件！");
            return false;
        }
        var imgreader = new FileReader();
        imgreader.readAsDataURL(file);
        imgreader.onload = function(e) {
            loadImage(this.result);
        }
    });

    loadImage('images/apple.jpg');

}(window));
