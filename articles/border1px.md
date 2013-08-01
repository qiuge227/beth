使用border-image实现类iOS7的1px底边
===================

iOS7已经发布有一段时间，扁平化设计风格有很多值得称赞的地方，其中有很多设计细节都是值得研究的。

首先，来看下面iOS设置的截图中的border：

<img width="320" src="images/ios7_settings.png" />

从上面的截图可以看到iOS7的设计是非常精细的，border是一根非常细的线。这篇文章介绍如何实现iOS7的border效果。

在看下面的内容之前，需要先了解devicePixelRatio和border-image，不熟悉的同学请自行脑补：

* [设备像素比devicePixelRatio简单介绍](http://www.zhangxinxu.com/wordpress/2012/08/window-devicepixelratio/)
* [CSS3 border-image详解、应用及jQuery插件](http://www.zhangxinxu.com/wordpress/?p=518)


### `border`属性实现效果

我们在实现border时通常都是使用`border`属性，如下：
```

```

显示效果对比：

![border对比效果]()

很显然，在移动设备上，`border`无法达到我们想要的效果。这是因为devicePixelRatio特性导致，iPhone的devicePixelRatio==2，`border: 1px solid`描述的是设备独立像素，被放大到物理像素2px显示，所以border在iPhone上就显得较粗。

### 使用`border-image`属性实现


