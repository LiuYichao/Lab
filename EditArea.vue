<template>
  <ModalCom v-bind:open="visible">
    <div class="page flex-col">
      <div class="section_10 flex-col">
        <div class="box_2 flex-col">
          <div class="section_22 flex-row">
            <div class="block_3 flex-col"></div>
            <span class="text_22">{{ $t("Edit.EditTakeArea") }}</span>
            <img
              class="label_2"
              referrerpolicy="no-referrer"
              @click="close"
              src="./assets/img/editClose.png"
            />
          </div>
          <div class="section_23 flex-row justify-between">
            <div class="group_8 flex-row">
              <div id="container"></div>
            </div>
            <div class="group_32 flex-col">
              <div class="group_33 flex-row justify-between">
                <div class="box_5 flex-col"></div>
                <span class="text_34">{{ $t("Edit.TakeArea") }}</span>
              </div>
              <div class="tips">
                <div class="group_34 flex-row">
                  <img
                    class="thumbnail_2"
                    referrerpolicy="no-referrer"
                    src="./assets/img/point.png"
                  />
                  <span class="text_35">{{ $t("Edit.Tips") }}</span>
                </div>
                <div class="group_35 flex-row justify-between">
                  <span class="text_36"
                    >{{ $t("Edit.SamplingLength") }}(mm)：</span
                  >
                  <div class="text-wrapper_9 flex-col">
                    <input class="input" v-model="width" />
                  </div>
                </div>
                <div class="group_36 flex-row">
                  <span class="text_38"
                    >{{ $t("Edit.SamplingWidth") }}(mm)：</span
                  >
                  <div class="text-wrapper_10 flex-col">
                    <input class="input" v-model="height" />
                  </div>
                </div>
              </div>
              <div class="text-wrapper_11 flex-col" @click="closeDone">
                <span class="text_40">{{ $t("Buttons.editDone") }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ModalCom>
</template>
<script>
import ModalCom from "../modal/Modal.vue";
import { getNeedleTube } from "../../common/NeedleTube.js";
import {
  getScale,
  drawSamplingStrip,
  calcSampling,
  calcPunctureHeight,
  calcPunctureDepth,
  drawVaildReact,
  getVaildCoor,
  calcSamplingByHegiht,
  translate2OrginCoordinate,
  translate2EditCoordinate,
  getPixelByMM,
} from "../../common/EditAreaUtil.js";

import Konva from "konva";
import { mapState } from "vuex";
import html2canvas from "html2canvas";

export default {
  name: "EditArea",
  components: {
    ModalCom,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["closeModal"],
  data() {
    return {
      width: 22,
      height: 0.5,
      sampling: {},
      scale: {},
      stage: null,
    };
  },
  computed: {
    ...mapState({
      patient: (state) => state.patient.currentPatient,
      currentPunctureImage: (state) => state.patient.currentPunctureImage,
      currentPuncture: (state) => state.patient.currentPuncture,
    }),
  },
  mounted() {},
  watch: {
    width: function () {
      this.loadImage();
    },
    height: function () {
      this.loadImage();
    },
    currentPunctureImage: function () {
      this.loadImage();
    },
    currentPuncture: {
      handler: function () {
        if (this.currentPuncture && this.currentPuncture.reportDetail) {
          this.width = this.currentPuncture.reportDetail.SamplingLength;
          this.height = this.currentPuncture.reportDetail.SamplingWidth;
        }
        // this.currentPuncture.reportDetail?.SamplingLength ?? 22,
        // this.currentPuncture.reportDetail?.SamplingWidth ?? 0.5,
      },
      immediate: true,
    },
  },
  methods: {
    close() {
      this.$emit("closeModal");
    },
    closeDone() {
      this.createReportDetail().then((reportDetail) => {
        this.$store.dispatch("patient/updateCurrentPunctureResport", {
          ...reportDetail,
        });
        this.$store.dispatch(
          "patient/updatePunctureList",
          this.currentPuncture
        );
        this.$emit("closeModal");
      });
    },

    loadImage() {
      const imageWidth = 911;
      const imageHeight = 683;

      this.stage = new Konva.Stage({
        container: "container",
        width: imageWidth,
        height: imageHeight,
      });

      const layer = new Konva.Layer();

      this.stage.add(layer);

      const isDone = this.currentPuncture.reportDetail.NeedleTube !== "";
      const scale = getScale(
        {
          width: this.currentPuncture.USSnapPathWidth,
          height: this.currentPuncture.USSnapPathHeight,
        },
        {
          width: imageWidth,
          height: imageHeight,
        }
      );
      this.scale = scale;

      const axisRatio = {
        xAxisRatio: this.currentPuncture.USSnapZoomxAxisRatio,
        yAxisRatio: this.currentPuncture.USSnapZoomyAxisRatio,
      };

      const editAreaSize = { width: imageWidth, height: imageHeight };

      // const stripMM = isDone ?
      //   {
      //     width: this.currentPuncture.reportDetail.SamplingLength,
      //     height: this.currentPuncture.reportDetail.SamplingWidth,
      //   } :
      //   { width: this.width, height: this.height, }

      const stripMM = { width: this.width, height: this.height };

      const samplingStrip = drawSamplingStrip(
        stripMM,
        editAreaSize,
        scale,
        axisRatio
      );

      // const vaildCoor = getVaildCoor(this.patient)
      // const poly = drawVaildReact(vaildCoor, scale.widthScale, scale.heightScale)

      const { USSnapCutX3, USSnapCutY3 } = this.currentPuncture;
      const USSnapCut = translate2EditCoordinate(
        { x: USSnapCutX3, y: USSnapCutY3 },
        scale
      );

      const { USSnapCropX, USSnapCropY } = this.currentPuncture;
      const Crop = translate2EditCoordinate(
        { x: USSnapCropX, y: USSnapCropY },
        scale
      );

      const strip = translate2EditCoordinate(
        {
          x: getPixelByMM(stripMM.width, axisRatio.xAxisRatio),
          y: getPixelByMM(stripMM.height, axisRatio.yAxisRatio),
        },
        scale
      );

      samplingStrip.on("dragmove", () => {
        // top
        samplingStrip.y(Math.max(samplingStrip.y(), Crop.y - strip.y));
        // left
        samplingStrip.x(Math.max(samplingStrip.x(), Crop.x - strip.x));
        // buttom
        samplingStrip.y(Math.min(samplingStrip.y(), USSnapCut.y - strip.y));
        // right
        samplingStrip.x(Math.min(samplingStrip.x(), USSnapCut.x - strip.x));
      });

      const imageObj = new Image();
      imageObj.onload = () => {
        const iamge = new Konva.Image({
          x: 0,
          y: 0,
          image: imageObj,
          width: imageWidth,
          height: imageHeight,
        });

        if (isDone) {
          const {
            PunctureHeight,
            PunctureDepth,
            SamplingLength,
            SamplingWidth,
          } = this.currentPuncture.reportDetail;
          const { USSnapCutX3, USSnapCutY3 } = this.currentPuncture;
          const stripSize = {
            width: SamplingLength,
            height: SamplingWidth,
          };
          const stripCoor = translate2EditCoordinate(
            calcSamplingByHegiht(
              PunctureHeight,
              PunctureDepth,
              stripSize,
              USSnapCutX3,
              USSnapCutY3,
              axisRatio
            ),
            scale
          );

          samplingStrip.setAttr("x", stripCoor.x);
          samplingStrip.setAttr("y", stripCoor.y);
        }

        layer.add(iamge);
        // layer.add(poly);
        // layer.add(circle);
        // layer.add(circle2);
        layer.add(samplingStrip);

        layer.batchDraw();
      };

      imageObj.src = this.currentPunctureImage;

      layer.on("dragend", (e) => {
        const target = e.target;
        this.sampling.x = target.attrs.x;
        this.sampling.y = target.attrs.y;
      });

      layer.on("mouseup", (e) => {
        const evt = e.evt;
        const x = evt.layerX;
        const y = evt.layerY;

        const topY = Math.max(y, Crop.y - strip.y);
        const leftX = Math.max(x, Crop.x - strip.x);
        const rigthX = Math.min(x, USSnapCut.x - strip.x);
        const buttomY = Math.min(y, USSnapCut.y - strip.y);

        if (y < topY) {
          samplingStrip.y(topY);
        } else if (y > buttomY) {
          samplingStrip.y(buttomY);
        } else {
          samplingStrip.y(y);
        }

        if (x < leftX) {
          group.x(leftX);
        } else if (x > rigthX) {
          group.x(rigthX);
        } else {
          group.x(x);
        }

        this.sampling.x = samplingStrip.x;
        this.sampling.y = samplingStrip.y;
      });
    },
    async createReportDetail() {
      const { xAxisRatio, yAxisRatio } = this.patient;

      const axisRatio = {
        xAxisRatio: xAxisRatio,
        yAxisRatio: yAxisRatio,
      };

      const sampling = calcSampling(
        this.sampling,
        this.scale,
        { width: this.width, height: this.height },
        axisRatio
      );

      const { USSnapCutX3, USSnapCutY3 } = this.currentPuncture;
      const height = calcPunctureHeight(sampling, axisRatio, USSnapCutY3);
      const depth = calcPunctureDepth(sampling, axisRatio, USSnapCutX3);

      const needleTube = getNeedleTube(this.patient, height);
      // console.log('针道', needleTube)
      const content = document.querySelector("#container");
      const canvas = await html2canvas(content);
      const imageData = canvas.toDataURL("image/png");

      return {
        PunctureId: this.currentPuncture.PunctureId
          ? this.currentPuncture.PunctureId
          : this.currentPuncture.PunctureRecordId,
        PuncturePlanId: this.currentPuncture.PuncturePlanId,
        RecordDate: this.currentPuncture.RecordDate,
        PunctureType: this.currentPuncture.PunctureType,
        Location: this.currentPuncture.Location,
        PunctureAngle: this.currentPuncture.PunctureAngle,
        Gleason: this.currentPuncture.Gleason,
        NeedleTube: needleTube, // 针道
        PunctureHeight: Number(height.toFixed(1)), // 穿刺高度（mm）
        PunctureDepth: Number(depth.toFixed(1)), // 穿刺深度（mm）
        SamplingLength: this.width, // 取样条长度
        SamplingWidth: this.height, //取样条宽度
        imageData: imageData,
      };
    },
  },
};
</script>
<style scoped lang="scss" src="./assets/index.scss" />
