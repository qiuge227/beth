移动Web开发实践——解决position:fixed自适应BUG
======================

在移动web中使用position:fixed，会踩到很多坑，在我之前的一篇文章《[移动端web页面使用position:fixed问题总结](https://github.com/maxzhang/maxzhang.github.com/issues/2)》中已经总结了很多bug，但是在后续的开发中有关fixed的未知bug越来越多，我也在尽量的寻找解决方案。

这篇文章就来先解决一个坑，fixed元素的宽度自适应。

当横屏时，fixed元素不能自适应横屏的宽度，bug表现如下：

![fixed-bug-1](https://raw.github.com/maxzhang/maxzhang.github.com/master/articles/images/fixed-bug-1.jpg)

![fixed-bug-2](https://raw.github.com/maxzhang/maxzhang.github.com/master/articles/images/fixed-bug-2.jpg)

这个bug主要在android自带浏览器下出现，与手机型号和系统版本无关，几乎所有android都无法幸免，在不同的手机下可能表现会有一点点差异，但都是同样的bug。

导致bug的原因我不清楚，如有高人请指点。

下面这个解决方案在12款主流手机上测试通过（三星、小米、魅族、华为、中心等），如果还未完全解决可以回复这篇文章。

1. 不能将fixed元素直接声明在`<body>`下，必须在外层嵌套一个文档流容器
2. fixed元素内部必须嵌套一个`position:absolute`元素，用来装载内容，目的就是为了让内容脱离fixed文档流，屏蔽一些fixed的坑

别问我为什么，我也不知道为什么，但是这样写竟然神奇的好使了，如有高人请指点迷津。

我在下面的例子中声明了两种最常用的fixed元素：header和footer

**position fixed header**

header中我使用了float来定位左右两边的icon。右侧icon一定不能使用`position:absolute`定位，如果使用了absolute，在一些android自带浏览器下横屏时，右侧icon无法自适应到右侧，会出现与上面第二幅图中差不多的bug。

```
<header>
    <div class="fixed">
        <div class="wrap float">
            <div class="left-icon">
                <span class="glyphicon glyphicon-chevron-left"></span>
            </div>
            <h1>HEADER</h1>
            <div class="right-icon">
                <span class="glyphicon glyphicon-calendar"></span><span class="glyphicon glyphicon-list"></span>
            </div>
        </div>
    </div>
</header>
```

**position fixed footer**

footer中是一个flex的布局，'display:flex'容器一定不要直接声明到fixed元素下，必须使用'position:absolute'容器包装一层。

```
<footer>
    <div class="fixed">
        <div class="wrap flex">
            <a href="#"><span class="glyphicon glyphicon-picture"></span></a>
            <a href="#"><span class="glyphicon glyphicon-film"></span></a>
            <a href="#"><span class="glyphicon glyphicon-qrcode"></span></a>
        </div>
    </div>
</footer>
```

**解决方案DEMO：[http://jsbin.com/omaCOSir/latest](http://jsbin.com/omaCOSir/latest)**

**题外话**

一个placeholder自适应bug，页面中使用`<input>`标签并且有属性`placeholder`，在页面横屏再转回竖屏时，会导致页面无法自适应，无论是android还是ios都会中招。

解决方法是，在`<input>`外层容器中加`overflow:hidden`，这个bug我没有截图，大家可以自测。
