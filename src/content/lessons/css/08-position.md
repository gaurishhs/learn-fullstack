---
course: css
slug: position
title: Position
description: "Learn how to move individual elements on a web page using the CSS position property."
---

CSS positioning is about controlling the placement of elements within a web page.

With CSS positioning, you can override the normal document flow.

## The CSS position Property

The position property tells the browser how to place an element on the page.

It can be set to one of these values:

* `static` - the default. The element stays wherever it normally falls in the page
* `relative` - the element is nudged away from its normal spot
* `absolute` - the element is placed relative to a parent, and no longer takes up space in the layout
* `fixed` - the element is placed relative to the browser window, and stays there even when you scroll
* `sticky` - the element behaves normally until you scroll past it, then it locks in place

Once you pick a value, you move the element using the top, bottom, left, and right properties.

## position: static

This is the value every element starts with. 

The top, bottom, left, and right properties do nothing on a static element. It just sits in the normal page flow.

```css
div.static {
  position: static;
  border: 3px solid #73AD21;
}
```

## position: relative

Set position to relative, then use top, left, etc. to shift the element away from its usual spot.

The important part: the space the element used to take up is still reserved. Nothing else moves in to fill it, you just get an empty gap where it used to be.

```html live
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Relative Example</title>
  <style>
    .row {
      display: flex;
      gap: 10px;
      background-color: #f1f1f1;
      padding: 20px;
    }
    .box {
      background-color: #007bff;
      color: white;
      padding: 20px;
      border-radius: 5px;
    }
    .shifted {
      position: relative;
      top: 20px;
      left: 20px;
    }
  </style>
</head>
<body>

  <div class="row">
    <div class="box shifted">Shifted</div>
    <div class="box">Normal</div>
    <div class="box">Normal</div>
  </div>

</body>
</html>
```

Run this and look at the gap on the left where "Shifted" started out. The other two boxes don't shift over to close it.

## position: absolute

An absolute element is taken out of the page flow completely, so it no longer reserves any space.

It's placed using top, right, bottom, left, but measured against its nearest ancestor that has a position other than static, not against the whole page. If no ancestor has a position set, it falls back to the page itself.

Because of this, relative and absolute are almost always used as a pair. Put relative on the parent, so it becomes the anchor. Put absolute on the child, so it can be pinned to an exact spot inside that parent.

```html live
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Absolute Example</title>
  <style>
    .card {
      position: relative;
      width: 220px;
      background-color: #f1f1f1;
      border: 2px solid #ccc;
      border-radius: 8px;
      padding: 20px;
    }
    .badge {
      position: absolute;
      top: 8px;
      right: 8px;
      background-color: #22c55e;
      color: white;
      font-size: 12px;
      padding: 2px 8px;
      border-radius: 999px;
    }
  </style>
</head>
<body>

  <div class="card">
    <span class="badge">Online</span>
    <h3>Jane Doe</h3>
    <p>Full stack developer</p>
  </div>

</body>
</html>
```

The badge locks to the top right corner of the card, not the page, because the card is the nearest ancestor with a position set. Delete position: relative from .card and try it again, the badge will jump somewhere else.

## position: fixed

Fixed works like absolute, taken out of the flow, placed with top/right/bottom/left, but it's always measured against the browser window instead of a parent.

That means a fixed element stays put on screen even while the page scrolls under it. This is how a navbar stays at the top no matter how far down you scroll.

```css
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
}
```

## position: sticky

Sticky starts out behaving like relative. Once you scroll past where it would normally sit, it switches to behaving like fixed and stays on screen.

```css
.section-title {
  position: sticky;
  top: 0;
}
```

Handy for something like a heading that stays visible while you scroll through a long list under it.

## overflow

Not technically part of position, but you'll reach for it often alongside these, whenever content is bigger than the box it's sitting in.

```css
.bio {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
```

overflow can be set to:

* `visible` - default, content spills outside the box if it's too big
* `hidden` - anything that doesn't fit is cut off and hidden
* `scroll` - content is cut off, but scrollbars always show up
* `auto` - scrollbars only show up if the content actually overflows
