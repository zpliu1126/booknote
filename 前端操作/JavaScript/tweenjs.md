

### 无限链式调用

实现书签上下移动

```javascript
var tweenDown = new TWEEN.Tween(
        {
          top: 10
        }
      )
      tweenDown.to({
        top: 15
      }, 1000).onUpdate((tween) => {
        this.$refs.Nextbutton.style.top = tween.top + "px"
        // this.$refs.Nextbutton.style.top = tween.top
      }).start()
      var tweenUp = new TWEEN.Tween(
        {
          top: 15
        }
      )
      tweenUp.to({
        top: 10
      }, 800).onUpdate((tween) => {
        this.$refs.Nextbutton.style.top = tween.top + "px"
        // this.$refs.Nextbutton.style.top = tween.top
      }).start()
      tweenDown.chain(tweenUp)
      tweenUp.chain(tweenDown)
      this.StartAnimate()
    },
    StartAnimate () {
      function animate () {
        if (TWEEN.update()) {
          requestAnimationFrame(animate)
        }
      }
      animate()
    }
```

### 参考

1.  https://github.com/tweenjs/tween.js/blob/master/docs/user_guide_zh-CN.md 