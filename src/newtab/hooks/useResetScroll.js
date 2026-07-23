import React from "react";

/**
 * 把 overflow: hidden 的容器的滚动位置强制锁在 0。
 *
 * overflow: hidden 只能阻止用户滚动，阻止不了程序滚动：
 * 编辑器聚焦时 ProseMirror 的 scrollRectIntoView 会从光标节点逐层往上
 * 给每个祖先加 scrollTop / scrollLeft（不判断 overflow）。
 * 一旦便签落在可视区外被聚焦，首屏容器就会被滚走，
 * 又因为没有滚动条，用户滚不回来，整个布局会一直错位。
 */
export default function useResetScroll(ref) {
  React.useEffect(() => {
    const el = ref?.current;
    if (!el) {
      return;
    }
    const reset = () => {
      if (el.scrollTop !== 0) {
        el.scrollTop = 0;
      }
      if (el.scrollLeft !== 0) {
        el.scrollLeft = 0;
      }
    };
    // scroll 事件不冒泡，只会收到该元素自身的滚动
    el.addEventListener("scroll", reset, { passive: true });
    reset();
    return () => {
      el.removeEventListener("scroll", reset);
    };
  }, [ref]);
}
