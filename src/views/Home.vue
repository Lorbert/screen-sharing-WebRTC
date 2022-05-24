<template>
  <div class="home">
    <div class="bigbox">
      <div class="box-top">{{ start }} {{ end }}</div>
      <!-- <div class="box-videos">
        <video v-for="(item,index) in streams" :key="index" :src="item" autoplay="true" muted="false" defaultMuted="false" class="video" ></video>
      </div> -->
      <video muted="false" defaultMuted="false" class="video" ref="videos" style="width: 49%; height: 100vh; "></video>
      <video muted="false" defaultMuted="false" class="video" ref="video2" style="width: 49%; height: 100vh"></video>
    </div>
  </div>
</template>

<script>
import { IMListenerMixin } from '@/common/mixin'
export default {
  name: "Home",
  mixins: [IMListenerMixin],
  data() {
    return {
      senduid: null,
      streams: []
    };
  },
  methods: {
    async createVideo(event) {
      console.log(event, '视频流');
      if (this.$refs.videos.srcObject) {
        console.log('----------第二个投屏');
        this.$refs.video2.srcObject = event.stream;
        // await this.streams.push(event.stream);
        // this.$refs.videos.onloadedmetadata = function (e) {
        //   this.$refs.videos.play();
        // };
        this.$refs.video2.play();
      } else {
        this.$refs.videos.srcObject = event.stream;
        // await this.streams.push(event.stream);
        // this.$refs.videos.onloadedmetadata = function (e) {
        //   this.$refs.videos.play();
        // };
        this.$refs.videos.play();
      }
      // this.$refs.videos.srcObject = null;
      // this.$refs.videos.srcObject = event.stream;
      // this.$refs.videos.play();
    },
    // 接收offer后进行保存和生成answer并发回给投屏端
    async connectOffer(offer, uid) {
      await this.peerConnection.setRemoteDescription(
        new RTCSessionDescription(offer)
      );
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);
      this.sendMessage('sendAnswer', answer, uid);
    },
  },
};
</script>
<style lang="scss" scoped>
.home {
  width: 100%;
  height: 100vh;
  background: #ffffff;

  .bigbox {
    .box-top {
      position: fixed;
      width: 11rem;
      height: 2.7rem;
      left: 50%;
      top: 0;
      transform: translateX(-50%);
      z-index: 3;
      line-height: 2.7rem;
      text-align: center;
      background: rgba($color: #000000, $alpha: 0.45);
      color: #ffffff;
      font-size: 2rem;
      border-bottom-left-radius: 5px;
      border-bottom-right-radius: 5px;
    }

    .box-videos {
      display: flex;
      flex-wrap: wrap;
      width: 100%;
      height: 100%;
      justify-content: space-around;

      .video {
        min-width: 48%;
        min-height: 48%;
        max-width: 100%;
        max-height: 100%;
      }
    }
  }
}
</style>
