<template>
    <div class="room">
        <div class="box" v-if="!isvideo">
            <div class="box-top">欢迎来到投屏小组</div>
            <div class="room-input">
                <input class="input" type="text" v-model="senduid" placeholder="请输入投屏码" />
                <button class="room-btn" @click="join">投屏</button>
            </div>
        </div>
        <div><video v-show="isvideo" ref="video" style="width:100%; height: 100vh;"></video></div>
    </div>
</template>

<script>
import { IMListenerMixin } from '@/common/mixin'
export default {
    name: "Room",
    mixins: [IMListenerMixin],
    data() {
        return {
            senduid: null,
            isvideo: false,
        }
    },
    methods: {
        // 投屏功能
        join() {
            console.log('++++++++', this.IMS);
            const _this = this;
            this.IMS.getLoginPlatform({
                data: { uid: this.senduid },
                onSuccess(data) {
                    console.log(data);
                    if (data.code == 0 && data.platforms) {
                        _this.shareVideo()
                    } else {
                        alert('未存在此大板！')
                    }
                },
                onFail(data) {
                    console.log(data);
                },
                onTimeout() {
                    console.log('查询超时！');
                }
            })

        },
        async shareVideo() {
            this.rctIn()
            if (
                navigator &&
                navigator.mediaDevices &&
                navigator.mediaDevices.getDisplayMedia
            ) {
                await navigator.mediaDevices.getDisplayMedia({
                    video: true,
                    audio: true,
                }).then(mediaStream => {
                    this.transferStream = mediaStream;
                    mediaStream.oninactive = (event) => {
                        console.log('mediaStream oninactive------------------',event.target.id)
                        this.isvideo = false;
                        const streamid = event.target.id.slice(0,6);
                        this.sendMessage('disconnect', streamid, this.senduid);
                        this.senduid = null;
                    }
                })
                console.log(this.transferStream, "mediaStream");
                this.peerConnection.addStream(this.transferStream);
                this.$refs.video.srcObject = this.transferStream;
                this.$refs.video.play();
                if (this.transferStream) {
                    this.isvideo = true
                    const offer = await this.peerConnection.createOffer({
                        RTCRtpTransceiver: 1,
                    });
                    await this.peerConnection.setLocalDescription(offer);
                    this.sendMessage("sendOffer", offer, this.senduid);
                } else {
                    this.isvideo = false
                }
            } else {
                alert("该浏览器不支持屏幕共享");
            }
        },
        // 接收大半端发回的answer
        async acceptAns(answer) {
            const remoteDesc = new RTCSessionDescription(answer);
            await this.peerConnection.setRemoteDescription(remoteDesc);
        },
    }
};
</script>

<style lang="scss" scoped>
.room {
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;

    .box {
        width: 36rem;
        height: 21rem;
        border: 1px solid #cccccc;
        border-radius: 8px;

        .box-top {
            width: 100%;
            height: 5rem;
            background: #3a74f6;
            color: #ffffff;
            font-size: 2rem;
            text-align: center;
            line-height: 5rem;
            border-radius: 6px;
            border: 1px solid #3a74f6;
        }

        .room-input {
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;

            .input {
                border: 1px solid #3a74f6;
                height: 3rem;
                width: 20rem;
                font-size: 2rem;
                margin: 1.5rem;
                line-height: 3rem;
            }

            .room-btn {
                width: 10rem;
                height: 3rem;
                font-size: 1.5rem;
                line-height: 3rem;
                background: #4f84f7;
                color: #ffffff;
            }
        }
    }
}
</style>