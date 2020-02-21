/**
    * 
    * ** 整体简单架构:dom层封装对象与数据封装对象进行映射
    * ** 数据修改 -> inti()重新绘制
    * ** Object：circles
    * ** Objcet: svgData
    * 
    * 
**/


const svgBesizer = document.getElementById('besizer-svg');
const svgPath = svgBesizer.querySelector('path')
const svgPolygon = svgBesizer.querySelector('polygon')
const svgWrap = document.getElementById('grid')
const coordinate = document.getElementById('coordinate-show')
const circleRadios = parseInt(svgBesizer.querySelector('#point-start').getAttribute('r'))


// move的点，move后改变各个点的坐标位置
const circles = {
    point0: {
        type: 'start',
        node: svgBesizer.querySelector('#point-start'),//曲线起始点
    },
    point1: {
        type: 'controler1',
        node: svgBesizer.querySelector('#point-controle1'),
    },
    point2: {
        type: 'controler2',
        node: svgBesizer.querySelector('#point-controle2'),
    },
    point3: {
        type: 'end',
        node: svgBesizer.querySelector('#point-end'),// 曲线终点
    },
}
// 各个点的坐标为数据保存对象
let pathData = {
    point0: {
        other: 'M',//指令
        x: 120,
        y: 200
    },
    point1: {
        other: 'C',//指令
        x: 250,
        y: 330
    },
    point2: {
        x: 250,
        y: 70
    },
    point3: {
        x: 380,
        y: 200
    }
}

/**
 * @name: 
 * @description: 格局初始数据，初始化相关位置
 * @msg: 
 * @param {type} 
 * @return: 
 */
function init() {
    // 遍历数组，创建path 的 d属性、还有polygon的points属性字符串属性值
    let d = ''
    let points = ''
    for (const key in pathData) {
        if (pathData.hasOwnProperty(key)) {
            const element = pathData[key]
            const element2 = circles[key]
            // 属性值之间可以完全使用空格隔开，比如：M 70 80 C 80 89
            if (element.other) {
                d += `${element.other} ${element.x} ${element.y} `
            } else {
                d += `${element.x} ${element.y} `
            }
            if (element2.type === 'start') {
                element2.node.setAttribute('cx', element.x - circleRadios)
                element2.node.setAttribute('cy', element.y)
            } else if (element2.type === 'end') {
                element2.node.setAttribute('cx', element.x + circleRadios)
                element2.node.setAttribute('cy', element.y)
            } else if (element2.type === 'controler1') {
                element2.node.setAttribute('cy', element.y + circleRadios)
                element2.node.setAttribute('cx', element.x)
            } else if (element2.type === 'controler2') {
                element2.node.setAttribute('cy', element.y - circleRadios)
                element2.node.setAttribute('cx', element.x)
            }
            points += `${element.x},${element.y} `

        }
    }
    svgPath.setAttribute('d', d)
    svgPolygon.setAttribute('points', points)
    coordinate.textContent = d

}

// 初始化svg内部元素位置和大小
init()

// 内部元素的事件注册和处理程序

// 起点小球随鼠标移动
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
let moveBol = false
let moveOutSign = '' 
for (const key in circles) {
    if (circles.hasOwnProperty(key)) {
        const element = circles[key];
        element.node.onmousedown = function (event) {
            moveBol = true //70 200
            moveOutSign = key // 保存当前正在移动的那个circle dom对象
            // console.log(event.pageX)
            // console.log(event.offsetX)
            // console.log(svgWrap.offsetTop)
        }
        element.node.onmouseup = function () {
            moveBol = false
        }
        element.node.onmousemove = function (ev) {
            if (moveBol) {
                ev = ev || window.event
                let x = ev.offsetX
                let y = ev.offsetY
                pathData[key].x = pathData[key].x + (x - (parseInt(element.node.getAttribute('cx'))))
                pathData[key].y = pathData[key].y + (y - (parseInt(element.node.getAttribute('cy'))))
                init()
            }

        }

    }
}
// 为了防止鼠标移动过快，导致数鼠标移动出circle：即circle原点坐标修改后重新绘制的位置更新跟不上鼠标的速度
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



