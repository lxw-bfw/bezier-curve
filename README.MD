<!--
 * @Description: 
 * @version: 
 * @Author: lxw
 * @Date: 2020-02-20 22:46:01
 * @LastEditors: lxw
 * @LastEditTime: 2020-02-21 21:07:40
 -->
### svg 贝塞尔曲线绘制
1. 波浪效果
2. 曲线的动态演示

### 简单的功能业务架构

```js
 dom层封装对象与数据封装对象进行一一映射
 数据修改 -> 调用inti()进行重新绘制
 Object：circles
 Objcet: svgData     
```    

### 踩坑
1. 元素获取和绑定事件
   - 首先保证dom元素加载完毕才可以正确的为其绑定事件，这不用说
   - 操作svg里面的相关元素，我确实是保证了dom元素正确获取，但是此时通过任何方法为其内部元素绑定事件后都是无效的，原因如下
     1. css 伪元素实现两条横竖线相交时，宽度高度否负值了百分百，导致遮住了svg，即使给svg单独设置层级，svg层级仍然处于伪元素下方
     2. 解决了问题1，点击仍然无效，注意了dom元素加载完毕，却忽略了svg内部形状的位置和大小都是通过js 提供函数进行初始化的，所以事件绑定势必要在其初始化完毕之后，由于初始化位置不是异步任务，所以直接把注册事件放到init()后面即可解决。

### 元素移动
- 构造带定位的盒子（棋盘）
- 相对于棋盘的移动，涉及鼠标offsetX、offsetY属性，坐标位置(offsetX,offsetY)

### 移动算法思路
```js
 /**
       *   思路：
       *        初始化：path四个点的位置，小球初始化的原点坐标取决于初始化赋值的path四个点位置；
       *         element2.node.setAttribute('cx', element.x - circleRadios)
                element2.node.setAttribute('cy', element.y)

       *        svg内部小球的移动取决于原点(x,y)，点击小球后鼠标移动其中鼠标相对于盒子(svg布局棋盘)的x
       *        y坐标可以通过offsetX、offsetY来获取：ps：鼠标的offsetX、offsetY虽然是相对于带有定位盒子的x、y坐标，但是不包括padding部分
       *    
       *       根据初始化小球原点位置与path初始化四个点的x、y位置计算公式，反推path的四个点的新x、y坐标      
       *          pathData[key].x =  pathData[key].x + (x - (parseInt(element.node.getAttribute('cx'))))
                  pathData[key].y =  pathData[key].y + (y - (parseInt(element.node.getAttribute('cy'))))
       * 
       * */
```

### 优化体验
1. 为了防止鼠标移动过快，导致鼠标移动出circle：即circle随鼠标移动，但是由于鼠标移动过快导致circle原点坐标修改后重新绘制的位置更新跟不上鼠标的速度，最终导致鼠标与circle脱离，此时circle仍然处于移动状态
```js
// 触发移出事件后，判断是否是仍处于移动状态以及是否是移除circle的外部，如果满足条件的话，获取鼠标相对位置，继续使用更新算法更新位置
svgWrap.onmousemove = function (ev) {
    // 如果isBOl为ture，显然是鼠标移动太快，以及移出了当前的circle
    if (moveBol && ev.target.nodeName === 'svg') {
        ev = ev || window.event
        let x = ev.offsetX
        let y = ev.offsetY
        console.log(x,y)
        pathData[moveOutSign].x = pathData[moveOutSign].x + (x - (parseInt(circles[moveOutSign].node.getAttribute('cx'))))
        pathData[moveOutSign].y = pathData[moveOutSign].y + (y - (parseInt(circles[moveOutSign].node.getAttribute('cy'))))
        init()
    }
}
```

