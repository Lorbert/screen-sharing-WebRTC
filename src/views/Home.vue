<template>
  <div class="home">
    <div class="bigbox">
      <div class="box-top">{{ start }} {{ end }}</div>
      <div ref="videos" class="box-videos">
        <!-- <video v-for="(item,index) in streams" :key="index" autoplay muted="false" defaultMuted="false" class="video" ></video> -->
      </div>
      <!-- <video muted="false" autoplay defaultMuted="false" class="video" :hre ref="videos" style="width: 49%; height: 100vh; "></video>
      <video muted="false" autoplay defaultMuted="false" class="video" ref="video2" style="width: 49%; height: 100vh"></video> -->
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
      streams: [],
      stream1: null,
      id: 0
    };
  },
  methods: {
    createVideo(event) {
      console.log(event, '视频流');
      let videos = this.$refs.videos;
      let video = document.createElement('video');
      const streamid = event.stream.id.slice(0,6);
      video.id = streamid;
      if (this.id >= 2) {
        video.style = 'width: 50%;height: 49.8%;border: 1px solid pink;box-sizing:border-box';
      } else {
        video.style = 'min-width: 50%;min-height: 49.8%;flex: 1;border: 1px solid pink;box-sizing:border-box';
      }
      this.id++;
      video.muted = 'muted';
      video.autoplay = 'autoplay';
      video.srcObject = event.stream;
      console.log(videos, '+++++++++++++++++++++++++');
      videos.append(video);
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
    removeDom(streamid) {
      let video = document.getElementById(streamid);
      let videos = this.$refs.videos;
      videos.removeChild(video);
      this.id--;
      if (this.id == 2) {
        videos.children[0].style = "min-width: 50%;min-height: 49.8%;flex: 1;border: 1px solid pink;box-sizing:border-box"
        videos.children[1].style = "min-width: 50%;min-height: 49.8%;flex: 1;border: 1px solid pink;box-sizing:border-box"
      }
    }
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
      z-index: 2;
      width: 100%;
      height: 100%;
      justify-content: space-around;
    }
  }
}

.video {
  min-width: 50%;
  min-height: 49.8%;
  flex: 1;
  border: 1px solid pink;
  box-sizing: border-box
}
</style>
