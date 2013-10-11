移动Web单页应用开发实践——页面结构化
===============================

## 1. 前言
在开发面向现代智能手机的移动Web应用的时候，无法避免一个事实，就是需要开发单页应用(Single Page WebApp)。对于不同的系统需求，单页应用的粒度会不同，可能是整个系统都使用一个页面装载，也可能是按模块分为独立页面装载。在开发单页应用时第一个要处理的问题就是页面结构化，由于多个功能集中在一个页面呈现，就必然需要考虑如何实现多个视图布局？如何实现视图之间动画切换？等问题。

下面我就来讲述下[手机搜狐](http://m.sohu.com)前端团队在单页应用开发的页面结构化上做过的一些尝试与努力。

## 2. 页面视图
在讲页面结构化之前需要先理解视图的概念，视图是单页应用开发中最常见的模块，通常在一个单页应用中，会有多个视图存在，每一个视图都可以处理一部分业务功能，所有视图的功能集就是单页应用所能处理业务的最大能力。下面介绍几种单页应用中最常出现的几种视图。

### 2.1 单视图层
三段式结构是单视图的一种最基本布局方式，如下图：

![structure-1](https://raw.github.com/maxzhang/maxzhang.github.com/master/articles/images/structure-1.png)

单视图并不一定都有head或foot，所以Header、Footer使用虚线来表示。多数应用中还会有导航条（Navigatior），但一般情况下导航条会被计算为Header或Content的一部分，而不会独立存在。

### 2.2 侧边栏
侧边栏是一种特殊的视图，在不显示时，当前视图是盖在侧边栏至上的，当它被呼出时，视图一部分滑出屏幕外，侧边栏才被显示出来，它的高度等于页面可视区域的高度。

显示前：

![structure-2](https://raw.github.com/maxzhang/maxzhang.github.com/master/articles/images/structure-2.png)

显示后：

![structure-3](https://raw.github.com/maxzhang/maxzhang.github.com/master/articles/images/structure-3.png)

### 2.3 封面图
封面图与侧边栏类似，也是一个特殊的视图。封面图一般会在页面初始时候出现，而后消失，消失之后就不再出现。它的视图层级是最高的，并且完全覆盖于其他页面元素，它的高度会大于或等于可视区域的高度。

![structure-4](https://raw.github.com/maxzhang/maxzhang.github.com/master/articles/images/structure-4.png)

## 3 多视图布局
单页应用中第一个要思考的问题就是：如何实现多视图的布局？通常我们会将视图的定位设置为```position:absolute```，这是一种简单又实用的方法。在一个时间节点上，页面可视区域只能有一个可见的当前视图，虚线表示其他视图，在页面可视区域之外不可见（```display:none```），如下图：

![structure-5](https://raw.github.com/maxzhang/maxzhang.github.com/master/articles/images/structure-5.png)

使用伪代码表示：

```
<style type="text/css">
    .view {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 99;
        display: none;
        width: 100%;
        height: 100%;
    }
    .current {
        z-index: 100;
        display: block;
    }
</style>
<div class="view current"></div>
<div class="view"></div>
```

此时，我们需要思考另一个问题：如何实现当前视图的Content区域内容滚动？视图的样式高度设置为```height:100%```，将视图高度设定为一屏高的目的是为了方便实现视图动画切换的效果（视图动画切换会在后面详细的讲）。但这样做会导致另一个问题，高度为一屏高意味着浏览器滚动条失效，无法使用浏览器滚动条滚动页面。

### 3.1 基于iScroll的多视图布局
现在比较流行的一种解决方案是使用[iScroll](http://cubiq.org/iscroll-4)组件实现固定区域滚动，这样就能解决Content区域的滚动问题，在手机搜狐的早期项目也是这么做的。此外，使用iScroll还额外带来了一些好处，如：

* Header区域能固定在页面顶部，不会因为Content区域滚动导致Header被顶上去；
* 单视图的高度控制在一屏高，这样有利于实现视图之间的动画切换；

对于这种结构的应用，在使用视图切换的时候就非常好做，使用CSS3的transition来完成动画切换，如下图：

![structure-6](https://raw.github.com/maxzhang/maxzhang.github.com/master/articles/images/structure-6.png)

使用伪代码表示：

```
<style type="text/css">
    .current.out {
        -webkit-transition: -webkit-transform 400ms;
        -webkit-transform: translate3d(-100%,0,0);
    }
    .next {
        display: block;
        -webkit-transform: translate3d(100%,0,0);
    }
    .next.in{
        -webkit-transition: -webkit-transform 400ms;
        -webkit-transform: translate3d(0,0,0);
    }
</style>
<div class="view current out"></div>
<div class="view next in"></div>
```

视图切换的动画效果可以根据业务需求定制，比如：由左向右滑动、由右向左、由上到下、右下到上等都是可以的。在完成切换动画时，再将next视图的状态设置为current，如下：

```
<div class="view"></div>
<div class="view current"></div>
```

下图是项目中使用的一个由下往上动画切换效果：

![structure-7](https://raw.github.com/maxzhang/maxzhang.github.com/master/articles/images/structure-7.gif)

### 3.2 iScroll页面结构下的侧边栏
使用iScroll的页面结构，无论是侧边栏还是封面图都非常好实现，看伪代码：

侧边栏，默认状态

```
<style type="text/css">
    .sidebar {
        z-index: 50;
        display: block;
        width: 80%;
    }
    .sidebar.show + .current {
        -webkit-transition: -webkit-transform 400ms;
        -webkit-transform: translate3d(80%,0,0);
    }
    .sidebar.hide + .current {
        -webkit-transition: -webkit-transform 400ms;
        -webkit-transform: translate3d(0,0,0);
    }
</style>
<div class="view sidebar"></div>
<div class="view current"></div>
```

侧边栏显示时

```
<div class="view sidebar show"></div>
<div class="view current"></div>
```

侧边栏隐藏时，当hide动画结束之后，移除hide样式

```
<div class="view sidebar hide"></div>
<div class="view current"></div>
```

### 3.3 iScroll页面结构下的封面图
封面图的实现与侧边栏差不多。

封面图，默认状态

```
<style type="text/css">
    .cover {
        z-index: 200;
        display: block;
        visibility: hidden;
        opacity: 0;
    }
    .cover.show {
        visibility: visible;
        -webkit-transition: opacity 400ms;
        opacity: 1;
    }
    .cover.hide {
        visibility: visible;
        -webkit-transition: opacity 400ms;
        opacity: 0;
    }
</style>
<div class="view cover"></div>
<div class="view current"></div>
```

封面图显示时

```
<div class="view cover show"></div>
<div class="view current"></div>
```

封面图隐藏时，当hide动画结束之后，移除hide样式

```
<div class="view cover hide"></div>
<div class="view current"></div>
```

在项目中的实现效果：

![structure-8](https://raw.github.com/maxzhang/maxzhang.github.com/master/articles/images/structure-8.gif)

### 3.4 iScroll对内容刷新的支持
对于Content区域的内容刷新iScroll也有很好的支持，可以直接参见iScroll提供的例子：[http://lab.cubiq.org/iscroll/examples/pull-to-refresh/](http://lab.cubiq.org/iscroll/examples/pull-to-refresh/)

![structure-9](https://raw.github.com/maxzhang/maxzhang.github.com/master/articles/images/structure-9.png)

**Note：**iScroll目前已经更新到了5.0的版本，大家可以关注Github项目[https://github.com/cubiq/iscroll/](https://github.com/cubiq/iscroll/)

## 4. 多视图布局，新的探索
对于单页应用来说，iScroll确实是一个非常优秀的解决方案，但是iScroll缺有一个最大的缺陷——慢，滚动的性能与浏览器原生实现相比，在低端的移动设备上有明显卡顿，这点我在另一片博文中也提到过《[移动Web产品前端开发口诀——“快”](https://github.com/maxzhang/maxzhang.github.com/issues/1)》。

**Note：**目前有一个新的趋势，浏览器经过一两年的发展，Android下已经优化的相当不错，iScroll在一些较低端的移动设备上，性能表现得比以前要好非常多，比如小米1，早期的米1还在运行UC7.x的版本时，iScroll明显的卡，现在在UC9.x下，iScroll也能运行得比较流畅了。

### 4.1 Fixed+原生Scroll
在此之下，我们也做了一些新的尝试，第一尝试就是放弃使用iScroll组件。放弃之后遇到的第一个问题，如何使Header固定位置在顶部？由此，我们使用了原生的CSS特性```position:fixed```，如下图：

![structure-10](https://raw.github.com/maxzhang/maxzhang.github.com/master/articles/images/structure-10.gif)

Fixed在一些移动设备浏览器上有兼容问题，我找到了一种能检测浏览器是否支持position:fixed的方法，这个也发一篇博文《[移动Web开发，4行代码检测浏览器是否支持position:fixed](https://github.com/maxzhang/maxzhang.github.com/issues/7)》，在检测到浏览器不支持fixed时，可以使用absolute作为替代方案，监听window的scroll事件，每次scroll动作结束时，重新计算一次Header的top值，将其定位到页面顶部。

有关```position:fixed```的bug在另一篇博文中《[移动端web页面使用position:fixed问题总结](https://github.com/maxzhang/maxzhang.github.com/issues/2)》也有总结。

另外强调一点，不要在Fixed区域中直接使用input或textarea元素。在fixed元素中的input获取焦点之后，弹出软键盘会带来很多额外的问题，如：

* 在iOS下软键盘弹出，fixed定位会出问题；
* 在Android下软件盘弹出，可能会导致输入区域被遮挡；

点击input弹出一个新视图来完成后续输入，是一种比较好的解决方案，下图是一个基于iScroll的页面结构实现：

![structure-11](https://raw.github.com/maxzhang/maxzhang.github.com/master/articles/images/structure-11.gif)

### 4.2 原生Scroll下的视图切换
使用了原生Scroll之后，带来最大的改变是视图切换动画的变化。使用iScroll的页面结构，视图的高度固定，并且是```position:absolute```定位，所以非常容易做视图切换。

换成原生Scroll之后，想使用一个比较缓和的动画过渡效果是非常困难的，可选的动画效果十分有限，经过了很多试验之后，最后选择使用淡入-淡出的动画效果，这是一种折中的方法。最初在完成这种动画实现的时候，编码的方法比较简单，就是将当前视图淡出，下一视图淡入，如下图：

![structure-12](https://raw.github.com/maxzhang/maxzhang.github.com/master/articles/images/structure-12.gif)

后来在做了更多尝试之后，开发出了一种兼容更强的淡入-淡出动画过渡。技术要点就是使用一个幕布层（mask）实现淡入效果，在mask完成淡入之后，再完成实际的视图的切换，操作步骤大致如下：

* 创建一个幕布层```<div class="mask"></div>```，mask为```position:absolute```定位，初始为透明状态，背景设置为白色或其他颜色，并使mask盖在当前视图上面；
* mask使用transition实现```opacity:1```的动画过渡，当完成动画时，mask将会把当前视图完全遮住；
* 最后，直接将当前视图隐藏，将下一视图显示既可；
* 完成所有动作之后，隐藏mask；

效果图：

![structure-13](https://raw.github.com/maxzhang/maxzhang.github.com/master/articles/images/structure-13.gif)

### 4.3 原生Scroll页面结构下的侧边栏
侧边栏的结构也变得复杂了一些，使用原生Scroll之后，body的高度会被内容区域撑到很高，但侧边栏还是必须保证一屏高。所以我在侧边栏显示时，将html与body的高度控制为一屏高，这样可以防止页面被滚动。使用伪代码表示：

侧边栏，默认状态

```
<html class="frame">
<head>
<style type="text/css">
    .frame {
        height: 100%;
    }
    .sidebar {
        background-color: red;
        position: absolute;
        z-index: 50;
        width: 80%;
        height: 100%;
    }
    .scroller {
        background-color: green;
        position: relative;
        z-index: 100;
        height: 2000px;
    }
    .sidebar-show body, .sidebar-hide body {
        height: 100%;
    }
    .sidebar-show .scroller {
        overflow: hidden;
        height: 100%;
        -webkit-transition: -webkit-transform 400ms;
        -webkit-transform: translate3d(80%,0,0);
    }
    .sidebar-hide .scroller {
        overflow: hidden;
        height: 100%;
        -webkit-transition: -webkit-transform 400ms;
        -webkit-transform: translate3d(0,0,0);
    }
</style>
</head>
<body>
<div class="sidebar"></div>
<div class="scroller"></div>
</body>
</html>
```

侧边栏显示时，在html元素上增加一个样式sidebar-show

```
<html class="frame sidebar-show">
```

侧边栏隐藏时，将html元素上的样式替换成sidebar-hide，当hide动画结束之后，移除hide样式

```
<html class="frame sidebar-hide">
```

在项目中的实际效果：

![structure-14](https://raw.github.com/maxzhang/maxzhang.github.com/master/articles/images/structure-14.gif)

另外，将侧边栏设置为```position:fixed```定位会是另一种实现思路。

### 4.4 原生Scroll页面结构下的封面图
封面图的实现与侧边栏差不多，使用伪代码表示：

封面图，默认为显示状态

```
<html class="frame cover-show">
<head>
<style type="text/css">
    .frame, .frame body {
        height: 100%;
    }
    .cover {
        background-color: red;
        position: absolute;
        z-index: 200;
        width: 100%;
        height: 100%;
    }
    .scroller {
        background-color: green;
        position: relative;
        z-index: 100;
        height: 2000px;
    }
    .cover-show body, .cover-hide body {
        height: 100%;
    }
    .cover-show .scroller {
        overflow: hidden;
        height: 100%;
    }
    .cover-hide .cover {
        -webkit-transition: opacity 400ms;
        opacity: 0;
    }
</style>
</head>
<body>
<div class="cover"></div>
<div class="scroller"></div>
</body>
</html>
```

封面图隐藏时，将html元素上的样式替换成cover-hide，当hide动画结束之后，移除hide样式

```
<html class="frame cover-hide">
```

项目中的应用：

![structure-15](https://raw.github.com/maxzhang/maxzhang.github.com/master/articles/images/structure-15.gif)

### 4.5 原生Scroll页面结构下，内容刷新的实现
一般情况下，我们会页面底部放一个加载更多的按钮，让用户点击按钮加载下一页内容，如下图：

![structure-16](https://raw.github.com/maxzhang/maxzhang.github.com/master/articles/images/structure-16.png)

又或者，监听window的scroll事件，当页面发生滚动时，监测是否滚动到页面底部，自动加载下一页内容。这两种方式都能很好的解决加载下一页的业务需求，但是对于加载最新或刷新的操作只能在页面中放置一个刷新按钮来完成业务需求。

对于Pull Up/Down Request的操作，在原生Scroll下，几乎是无法实现的。但我依然希望能找到一种方法，实现Pull Request操作。

现在我正在研究一种模拟Pull操作的解决方案，已经有了一个雏形，并实现了一些功能。下面这个示例中没有使用任何的iScroll技术，完全使用原生Scroll实现页面滚动，并且滚动到页面底部后可以完成Pull Up操作，如下图：

![structure-17](https://raw.github.com/maxzhang/maxzhang.github.com/master/articles/images/structure-17.gif)

这个技术的实现原理并不复杂，就是在页面滚动到底部时，创建一个空白层，模拟Pull Up手势拖动页面的效果。

![structure-18](https://raw.github.com/maxzhang/maxzhang.github.com/master/articles/images/structure-18.gif)

我后面会封装成一个组件放在GitHub上分享给大家。

## 5 结束语
手机搜狐目前还是一个年轻的前端团队，在手机搜狐的一年半时间，积累和很多有关移动端Web开发的经验，写这篇文章希望能将自己在移动Web方面的一些经验分享给大家，同时，也希望能有更多的移动Web开发者能互相交流。

**Note：文章中的伪代码也许并不能完全运行正确，只是提供一种参考和思路，实际处理过程远比伪代码要复杂得多。**
