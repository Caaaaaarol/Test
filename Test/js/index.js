window.addEventListener('DOMContentLoaded', function () {
 
             /* 轮播图开始 */

  var slider = document.querySelector('.slider') // 获取装轮播图的大盒子
  var slider_bar = slider.querySelector('.slider_bar') // 获取装轮播图的ol
  var square = slider.querySelector('.slider_square') // 获取装方形小按钮的ol
  var prev = document.querySelector('.prev') // 获取轮播图右侧按钮
  var next = document.querySelector('.next') // 获取轮播图左侧按钮
  var sliderWidth = slider.clientWidth // 获取轮播图盒子宽度
  var num = 0 // 声明两个变量用于控制按钮点击次数  num变量控制左右按钮点击变化
  var squareNum = 0 // squareNum变量控制方形小按钮同步点击变化

  // 左右按钮的出现跟隐藏
  slider.addEventListener('mouseenter', function () {
    prev.style.display = 'block'
    next.style.display = 'block'
    // 鼠标点进轮播图 清空自动播放
    clearInterval(autoPlay)
    autoPlay = null
  })
  slider.addEventListener('mouseleave', function () {
    prev.style.display = 'none'
    next.style.display = 'none'
    // 鼠标离开轮播图 开启自动播放
    autoPlay = setInterval(function () {
      next.click()
    }, 3000)
  })

  // 根据轮播图的数量生成下面的方形小按钮
  for (var i = 0; i < slider_bar.children.length; i++) {
    var li = document.createElement('li')
    // 给方形小按钮设置索引号，用于计算动画移动距离
    li.setAttribute('index', i)
    square.appendChild(li)

    // 方形小按钮点击后样式变化
    li.addEventListener('click', function () {
      for (var i = 0; i < square.children.length; i++) {
        square.children[i].classList.remove('selected')
      }
      this.classList.add('selected')
      var index = this.getAttribute('index')
      // 点击方形小按钮后将索引号同步给另外两个的按钮变量
      num = squareNum = index
      // 图片轮播运动
      animate(slider_bar, -index * sliderWidth)
    })
  }
      //给点击的方形小按钮添加样式
  square.children[0].classList.add('selected')

  //克隆第一张轮播图放到最后用于无缝滚动使用
  var firstImg = slider_bar.children[0].cloneNode(true)
  slider_bar.appendChild(firstImg)

  // 轮播图右侧按钮
  next.addEventListener('click', function () {
    // 右侧按钮点击次数限制
    if (num == slider_bar.children.length - 1) {
      slider_bar.style.left = 0
      num = 0
    }
    num++
    animate(slider_bar, -num * sliderWidth)
    squareNum++
    // 方形小按钮变化次数限制
    if (squareNum == square.children.length) {
      squareNum = 0
    }
    squareChange()
  })

  // 轮播图左侧按钮
  prev.addEventListener('click', function () {
      // 左侧按钮点击次数限制 
    if (num == 0) {
      num = slider_bar.children.length - 1
      slider_bar.style.left = -num * sliderWidth + 'px'
    }
    num--
    animate(slider_bar, -num * sliderWidth)
    squareNum--
    // 方形小按钮变化次数限制
    if (squareNum < 0) {
      squareNum = square.children.length - 1
    }
    squareChange()
  })

  // 用计时器控制轮播图自动播放
  var autoPlay = setInterval(function () {
    next.click()
  }, 3000)

  /* 导航条滑块 */
  var nav_marker = document.querySelector('.nav_marker') // 获取导航条滑块
  var nav_li = document.querySelector('.nav').querySelectorAll('li') // 
  var selected = 0 // 声明变量记录导航条点击位置
  for (var i = 0; i < nav_li.length; i++) {
    nav_li[i].addEventListener('mouseenter', function () {
      animate(nav_marker, this.offsetLeft)
    })

    nav_li[i].addEventListener('mouseleave', function () {
      animate(nav_marker, selected)
    })

    nav_li[i].addEventListener('click', function () {
      animate(nav_marker, this.offsetLeft)
      selected = this.offsetLeft
    })
  }

  // 封装动画运动函数
  function animate(obj, target) {
    clearInterval(obj.timer)
    obj.timer = setInterval(function () {
      var step = (target - obj.offsetLeft) / 10
      step = step > 0 ? Math.ceil(step) : Math.floor(step)
      if (obj.offsetLeft == target) {
        clearInterval(obj.timer)
      }
      obj.style.left = obj.offsetLeft + step + 'px'
    }, 20)
  }

  // 封装方形小按钮点击样式变化函数
  function squareChange() {
    for (var i = 0; i < square.children.length; i++) {
      square.children[i].classList.remove('selected')
    }
    square.children[squareNum].classList.add('selected')
  }

  // 封装XMLget函数
  function getData(url, callback) {
    var xhr = new XMLHttpRequest()
    xhr.open('get', url)
    xhr.send()
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        callback(JSON.parse(xhr.responseText))
      }
    }
  }
  /*  echarts */
  //  曲线图
  var chart_line = echarts.init(document.querySelector('.line'))
  getData('https://edu.telking.com/api/?type=month', function (data) {
    // 曲线图设置
    chart_line.setOption({
      tooltip: {},
      title: {
        left: 'center',
        text: '曲线图数据展示',
        padding: [30, 0, 0, 0],
      },
      grid: {
        top: '25%',
        bottom: '10%',
        right: '5%',
        left: '10%',
      },
      xAxis: {
        type: 'category',
        data: data.data.xAxis,
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
      },
      yAxis: {
        type: 'value',
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          formatter: '{value} 人',
        },
        splitLine: {
          lineStyle: {
            type: 'dashed',
          },
          show: true,
        },
      },
      series: [
        {
          data: data.data.series,
          type: 'line',
          label: {
            show: true,
            position: 'top',
            color: '#4587f0',
          },
          itemStyle: {
            color: 'rgba(4, 159, 255, 1)',
          },
          smooth: 0.3,
          areaStyle: {
            color: '#f3f7fe',
          },
        },
      ],
    })
  })

  // 饼图和柱状图
  var chart_pie = echarts.init(document.querySelector('.pie'))
  var chart_bar = echarts.init(document.querySelector('.bar'))
  getData('https://edu.telking.com/api/?type=week', function (data) {
    var name = data.data.xAxis
    var value = data.data.series
    var arr = []
    var obj
    for (var i = 0; i < name.length; i++) {
      obj = {}
      obj.value = value[i]
      obj.name = name[i]
      arr.push(obj)
    }
    // 饼图设置
    chart_pie.setOption({
      title: {
        text: '饼状图数据展示',
        left: 'center',
        padding: [30, 0, 0, 0],
      },
      tooltip: {
        trigger: 'item',
      },
      series: [
        {
          type: 'pie',
          radius: '50%',
          data: arr,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    })
    // 柱状设置
    chart_bar.setOption({
      tooltip: {},
      title: {
        left: 'center',
        text: '柱状图数据展示',
        padding: [30, 0, 0, 0],
      },
      grid: {
        top: '25%',
        bottom: '10%',
        right: '5%',
        left: '10%',
      },
      xAxis: {
        type: 'category',
        data: name,
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
      },
      yAxis: {
        type: 'value',
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          lineStyle: {
            type: 'dashed',
          },
          show: true,
        },
      },
      series: [
        {
          data: value,
          type: 'bar',
          itemStyle: {
            color: 'rgba(69, 135, 240, 1)',
          },
        },
      ],
    })
  })
})
