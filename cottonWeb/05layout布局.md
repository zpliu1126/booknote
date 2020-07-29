## layout布局

借助与router实现一个layout框架，在框架内部铺设子路由改变局部页面

整个思维图如下：

<img src="https://s1.ax1x.com/2020/07/28/akcCrt.png" alt="akcCrt.png" style="zoom:67%;" />

### 路由的设置

首先在路由进入到`/`时，将会渲染layout组件，在layout组件内部包含有一个子路由的视图

因此，在进入到layout后，如果子路由将会渲染`App-main`内的内容；

```javascript
  {
    path: '/',
    component: HomeLayout,
    redirect: '/home',
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => {
          return import('@/views/home')
        },
        meta: { title: 'cottonWeb' },
      },
    ],
  },
```

### Vue中的配置

程序根组件`App.vue`中的`router-view`用于挂载布局组件或者`404`页面组件，布局发生改变，或者刚开始进入时都会触发页面动画

```javascript
<template>
  <div id="app">
    <transition enter-active-class="animate__animated animate__fadeInUp">
      <router-view />
    </transition>
  </div>
</template>
```

layout组件配置

```javascript
<template>
  <div>
    <cotton-navbar></cotton-navbar>
    <app-main></app-main> ###这里放置一个子路由
    <cotton-footer></cotton-footer>
  </div>
</template>
```

功能页面组件配置

子路由发生改变时，将会触发动画效果

```javascript
<template>
  <div>
    <transition enter-active-class="animate__animated animate__fadeInDown">
      <router-view :key="key" />
    </transition>
  </div>
</template>
```

