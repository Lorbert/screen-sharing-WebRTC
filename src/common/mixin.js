import IMSDK from "@cvte/message-service-sdk";
export const IMListenerMixin = {
    data() {
        return {
            uid: null,
            start: null,
            end: null,
            IMS: null,
            peerConnection: null,
        }
    },
    created() {
        this.uid = String(Math.floor(Math.random() * 1000000)).padEnd(6, '0') //生成6位随机验证码
        this.start = this.uid.slice(0, 3);
        this.end = this.uid.slice(3);
        this.initIM(this.uid)
    },
    methods: {
        /**
         * @description: 
         * @param {*} uid 自动生成的用户id
         */        
        initIM(uid) {
            const IM = new IMSDK.IM()
            IM.init({
                    domain: 'wss://mc.test.seewo.com',
                    // uid:this.uid,
                    appid: '',
                    platform: 4,
                    token: '',
                    env: '',
                    maxMessageSize: 30,
                    data: {
                        user: {
                            guest: uid,
                        }
                    }
                })
                .login()
                // 信令服务器，进行信息的交换            
                .onMessageRecv((data, ctx) => {
                    console.log('onMessageRecv --> data:')
                    console.table(data)
                    switch (data.msg_body.onName) {
                        case 'sendOffer':
                            this.rctIn()
                            if (data.from_id !== this.uid) {
                                // this.senduid = data.from_id;
                                this.connectOffer(data.msg_body.value, data.from_id)
                            } else {
                                alert('接收失败！')
                            }
                            break;
                        case 'sendAnswer':
                            this.acceptAns(data.msg_body.value)
                            break;
                        case 'addIceCandidate':
                            this.addIC(data.msg_body.value)
                            break;
                        case 'disconnect':
                            console.log('peerConnection', this.peerConnection);
                            // this.peerConnection.close();
                            break;
                    }

                    console.log('onMessageRecv --> context:')
                    console.table(ctx)
                })
                .onConnect(function (data, ctx) {
                    console.log('onConnect --> data:')
                    console.table(data)
                    console.log('onConnect --> context:')
                    console.table(ctx)
                })
                .onDisconnect(function (data, ctx) {
                    console.log('onDisconnect --> data:')
                    console.table(data)
                    console.log('onDisconnect --> context:')
                    console.table(ctx)
                })
                .onError((err) => {
                    console.log('err:', err);
                })
                .onConversationUpdate((convList, ctx) => {
                    console.log('onConversationUpdate list', convList)
                    console.log('onConversationUpdate ctx', ctx)
                })
            this.IMS = IM;
        },
        // 初始化WebRTC    
        rctIn() {
            const config = {
                configuration: {
                    offerToReceiveAudio: true,
                    offerToReceiveVideo: true,
                },
            };
            this.peerConnection = new RTCPeerConnection(config);
            // 监听视频流
            this.peerConnection.onaddstream = (event) => {
                this.createVideo(event);
            }
            // 获取网络信息，并发送给对方。
            this.peerConnection.onicecandidate = (event) => {
                console.log(event, 'onicecandidate_____________________11111111111');
                if (event.candidate && this.senduid) {
                    this.sendMessage('addIceCandidate', event.candidate, this.senduid)
                }
            };
        },
        // 使用IM提供的API进行信息的发送
        sendMessage(name, value, uid) {
            const datas = {
                target_id: uid,
                msg_type: 4,
                msg_body: {
                    onName: name,
                    value
                },
            }
            this.IMS.sendSingleMessage({
                data: datas,
                onSuccess(data) {
                    console.log(data, '成功回调');
                },
                onFail(data) {
                    console.log(data, 'fail');
                },
                onTimeout(data) {
                    console.log(data, 'timeout');
                }
            })
        },
        // 添加对方发过来的网络信息
        async addIC(candidate) {
            await this.peerConnection.addIceCandidate(candidate);
        }
    },
}