移动Web单页应用开发实践——实现Pull to Request（上/下拉请求操作）
==========================

在之前的一篇文章《[移动Web单页应用开发实践——页面结构化](https://github.com/maxzhang/maxzhang.github.com/issues/8)》已经介绍了与移动web开发相关的页面结构化技术，这篇文章将为大家分享单页应用开发中的另一个技术Pull to Request。

在单页应用开发中，无论是页面结构化，还是Pull to Request，都离不开一个技术——页面局部滚动。当下的移动web技术，主要使用下面两种方式实现局部区域的滚动：

* 基于[IScroll](https://github.com/cubiq/iscroll)组件，也有很多团队自己实现类似的组件，实现原理大都一样。
* 使用浏览器原生支持```overflow: scroll```，在iOS下使用```-webkit-overflow-scrolling: touch;```实现惯性滚动。

## IScroll实现

关于IScroll，大约半年前的一篇文章中 https://github.com/maxzhang/maxzhang.github.com/issues/1 ，对IScroll的观点是建议大家尽量少的使用，现在这个趋势在慢慢的发生变化。第一，1年前的操作系统还是以Android2.x为主，现在新上市的都是Android4.x，很多老的手机也会提示升级4.x。第二，移动浏览器的更新频次特别的快，比如UC浏览器，半年前还是7.x和8.x，现在已经更新到9.x。操作系统和浏览器的升级对于兼容性与性能方面都有很可观的提升。虽然没有使用工具做测试，但是一个很直观的使用感受就是，早些时候使用iScroll4写的程序，在相同的测试机（升级过浏览器）下跑，运行效率有明显的提升。IScroll正在开发最新的5.x，虽然没有正式发布，从源码上看，整体设计比4.x高了不止一个档次，有兴趣的同学可以去阅读对比。

下面这个例子是我使用IScroll5，实现的Pull to Request，在官方的例子库中还没有提供支持Pull to Request的接口，现在IScroll的接口还不是很完善，也有很多bug。猛戳例子：http://jsbin.com/AtIGeKe/latest

在这个例子中，与4.x的pull-to-request例子最大的一个实现区别是```topOffset```参数与Event接口。

在4.x中是使用```topOffset```参数设置顶部偏移值，而5.x中top offset这个值是在```wrapper```对的样式中设定，这个设计十分巧妙。

另一个就是事件回调，4.x的事件函数都是已参数形式传入，5.x使用```on()```接口实现事件监听。

下面是IScroll4 pull-to-request的例子： http://lab.cubiq.org/iscroll/examples/pull-to-refresh/ ，大家可以自行对比。

## 原生支持```overflow: scroll```

```-webkit-overflow-scrolling: touch;```是iOS5时候提供的一个特性，支持局部区域的快速滚动、惯性滚动和回弹效果。有兴趣了解的可以参考这篇文章： http://blog.csdn.net/hursing/article/details/9186199

```-webkit-overflow-scrolling: touch;```并不被Android支持，所以Android下局部滚动会卡卡的。可以在Android浏览器下运行下面这段代码，会输出false：

```
!!('WebkitOverflowScrolling' in document.documentElement.style)
```

```overflow: scroll```的兼容性会有点问题，Android3+才支持。使用```overflow: scroll```实现多视图布局的原理与IScroll是一样的，给内容外层容器加下面的样式就可以了：

```
.wrapper {
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}
```

Pull to Request与IScroll的实现就会有区别，为此我开发了一个组件dragloader.js，帮助原生局部滚动下实现Pull to Request，项目地址：https://github.com/maxzhang/dragloader

猛戳例子：http://jsbin.com/UGajALA/latest

## 总结

在做单页应用开发式，无法避免多视图结构，必然会有单视图的局部滚动和Pull to Request的需求，对于上面两种实现技术，都各有优缺点，大家可以对应自己的项目综合评估，然后决定使用哪种实现。
