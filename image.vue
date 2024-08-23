<template>
  <div>
    <div id="container"></div>
    <div id="hiContainer"></div>
    <input name="text" id="text" @focus="last" ref="textInput" />
    <div id="buttons">
      <button id="save" v-on:click="down">Save as image</button>
    </div>
    <img v-if="s" :src="s" />
  </div>
</template>
<style>
#hiContainer {
  display: none;
  visibility: hidden;
}
/* #container {
  display: none;
  visibility: hidden;
} */
</style>
<script>
import Konva from "konva";
export default {
  name: "ImageCom",
  data() {
    return {
      stage: null,
      s: null,
    };
  },
  mounted() {
    this.drawImage();
    // this.drawC();
  },
  methods: {
    last(event) {
      // this.$refs.textInput.focus();
      // // eslint-disable-next-line no-console
      // console.log(event);
      // // eslint-disable-next-line no-console
      // console.log(event.target.value);
      const v = event.target.value;
      const sP = v.length;
      this.$nextTick(() => {
        event.target.value = "";
        event.target.value = v;
        event.target.focus();
        event.target.setSelectionRange(sP-1, sP);
      });

      // // eslint-disable-next-line no-console
      // console.log(sP);

      // event.target.setSelectionRange(sP, sP+1)
    },
    draw() {
      // 限制拖动范围示例
      var width = window.innerWidth;
      var height = window.innerHeight;

      var stage = new Konva.Stage({
        container: "container",
        width: width,
        height: height,
      });

      var layer = new Konva.Layer();

      var group = new Konva.Group({
        x: 30 + 10,
        y: 50 + 10,
        draggable: true,
        // stroke: "grey",
        // strokeWidth: 1,
        // dash: [2, 2],
      });

      var blueGroupBox = new Konva.Rect({
        x: 30,
        y: 50,
        width: 1000,
        height: 500,
        draggable: false,
        stroke: "grey",
        strokeWidth: 1,
        dash: [2, 2],
      });

      const strip = new Konva.Rect({
        width: 40,
        height: 20,
        fill: "green",
        name: "samplingStrip",
      });
      const boundingBox = strip.getClientRect({ relativeTo: group });
      const box = new Konva.Rect({
        x: boundingBox.x - 10,
        y: boundingBox.y - 10,
        width: boundingBox.width + 20,
        height: boundingBox.height + 20,
        stroke: "grey",
        strokeWidth: 1,
        dash: [2, 2],
      });
      group.add(box);
      group.add(strip);

      layer.on("dragmove", () => {
        // top
        group.y(Math.max(group.y(), 50 - 20));
        // left
        group.x(Math.max(group.x(), 30 - 40));
        // buttom
        group.y(Math.min(group.y(), 550 - 20));
        // right
        group.x(Math.min(group.x(), 1030 - 40));
      });

      stage.on("mouseup", (target) => {
        const x = target.evt.x;
        const y = target.evt.y;

        const top = Math.max(y, 50 - 20);
        const left = Math.max(x, 30 - 40);
        const buttom = Math.min(y, 550 - 20);
        const right = Math.min(x, 1030 - 40);

        if (y < top) {
          group.y(top);
        } else if (y > buttom) {
          group.y(buttom);
        } else {
          group.y(y);
        }

        if (x < left) {
          group.x(left);
        } else if (x > right) {
          group.x(right);
        } else {
          group.x(x);
        }
      });

      layer.add(blueGroupBox);
      layer.add(group);

      stage.add(layer);
    },
    down() {
      const dataURL = this.stage.toDataURL();

      this.drawC(dataURL).then((es) => {
        // const dataURL2 = this.stage2.toDataURL();
        this.s = es;
        this.downloadURI(es, "sdaf.jpg");
      });
    },
    downloadURI(uri, name) {
      const link = document.createElement("a");
      link.download = name;
      link.href = uri;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      // delete link;
    },
    drawC(dataURL) {
      const stage2 = new Konva.Stage({
        container: "hiContainer",
        width: 438,
        height: 300,
      });

      const layer = new Konva.Layer();
      stage2.add(layer);

      const imageObj = new Image();
      const point = new Konva.Circle({
        x: 30,
        y: 30,
        fill: "red",
        stroke: "black",
        strokeWidth: 4,
        radius: 50,
      });

      return new Promise((resolve, reject) => {
        try {
          imageObj.onload = () => {
            const img = new Konva.Image({
              x: 0,
              y: 0,
              image: imageObj,
              width: 438,
              height: 300,
            });
            layer.add(img);
            layer.add(point);
            layer.batchDraw();
            const s = stage2.toDataURL();
            resolve(s);
          };
          imageObj.src = dataURL;
        } catch (err) {
          reject(reject);
        }
      });
    },
    drawImage() {
      // 438 300

      this.stage = new Konva.Stage({
        container: "container",
        width: 1024,
        height: 768,
      });
      // this.stage.scale({ x: 0.5, y: 0.5 });

      const layer = new Konva.Layer();
      this.stage.add(layer);
      // const point = new Konva.Circle({
      //   x: 30,
      //   y: 30,
      //   fill: 'red',
      //   stroke: 'black',
      //   strokeWidth: 4,
      //   radius: 10
      // });
      const imageObj = new Image();
      imageObj.onload = () => {
        const img = new Konva.Image({
          x: 0,
          y: 0,
          image: imageObj,
          width: 1024,
          height: 768,
        });
        layer.add(img);
        // layer.add(point);
      };

      imageObj.src = "../darth-vader.jpg";
    },
  },
  watch: {},
  created() {},
};
</script>

<style>
body {
  margin: 0;
  padding: 0;
}
</style>
