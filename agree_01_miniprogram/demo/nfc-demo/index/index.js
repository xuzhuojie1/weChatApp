const app = getApp()

Page({
  nfc: null,

  onLoad: function () {
    const nfc = wx.getNFCAdapter()
    this.nfc = nfc
    const that = this

    function discoverHandler(res) {
      console.log("res: ", res)
      if (res.techs.includes(nfc.tech.ndef)) {
        console.log(res.messages)
        if (res.messages) {
          let cordsArray = res.messages[0].records;
          let payl = ""
          cordsArray.find(item => {
            let mypayload = that.byteToString(new Uint8Array(item.payload));
            console.log("mypayload->:", mypayload);
            let id = that.byteToString(new Uint8Array(item.id));
            console.log("id->:", id);
            let type1 = that.byteToString(new Uint8Array(item.type));
            console.log("type1->:", type1);
            // this.read.id = that.byteToString(new Uint8Array(item.id));
            // this.read.type = that.byteToString(new Uint8Array(item.type));
            that.myShowModal(mypayload.slice(3))
          });
          console.log("payl:", payl);
        }
        // const ndef = nfc.getNdef()
        // ndef.onNdefMessage(message => {
        //   console.log("messsage:", message);
        // })
        // ndef.writeNdefMessage({
        //   uris: [''],
        //   complete(res) {
        //     console.log('res:', res)
        //   }
        // })
        return
      }

      if (res.techs.includes(nfc.tech.nfcA)) {
        const nfcA = nfc.getNFCA()
        nfcA.transceive({
          data: new ArrayBuffer(0),
          complete(res) {
            console.log('res:', res)
          }
        })
        return
      }
    }

    nfc.onDiscovered(discoverHandler)
    nfc.startDiscovery({
      fail(err) {
        console.log('failed to discover:', err)
      }
    })
  },

  onHide() {
    if (this.nfc) {
      this.nfc.stopDiscovery()
    }
  },

  nfc_func: function() {


    const nfc = wx.getNFCAdapter()
    this.nfc = nfc
    let _this = this


    function discoverHandler(res) {
        const data = new Uint8Array(res.id)
        let str = ""
        data.forEach(e => {
            let item = e.toString(16)
            if (item.length == 1) {
                item = '0' + item
            }
            item = item.toUpperCase()
            str += item
        })
        _this.setData({
            newCardCode: str
        })
        // ???????????????uint8?????????
        // var uint8_msg = new Uint8Array(res.payload);
        // // ??????????????????
        // var decodedString = String.fromCharCode.apply(null, uint8_msg);
        wx.showModal({
          title: '??????',
          content: str + "||" + JSON.stringify(res),
          success (res1) {
            if (res1.confirm) {
              console.log('??????????????????')
            } else if (res1.cancel) {
              console.log('??????????????????')
            }
          }
        })
    }

    nfc.startDiscovery({
        success(res) {
            wx.showToast({
                title: 'NFC????????????????????????',
                icon: 'none'
            })
            nfc.onDiscovered(discoverHandler)
        },
        fail(err) {if(!err.errCode){
              wx.showToast({
                title: '?????????NFC??????????????????!',
                icon: 'none'
              })
              return
            }
            wx.showModal({
              title: '??????',
              content: JSON.stringify(err),
              success (res1) {
                if (res1.confirm) {
                  console.log('??????????????????')
                } else if (res1.cancel) {
                  console.log('??????????????????')
                }
              }
            })
          
            switch (err.errCode) {
                case 13000:
                  wx.showToast({
                    title: '???????????????NFC!',
                    icon: 'none'
                  })
                  break;
                case 13001:
                  wx.showToast({
                    title: '??????NFC???????????????!',
                    icon: 'none'
                  })
                  break;
                case 13019:
                  wx.showToast({
                    title: '???????????????!',
                    icon: 'none'
                  })
                  break;
                case 13010:
                  wx.showToast({
                    title: '????????????!',
                    icon: 'none'
                  })
                  break;
              }
        }
    })
},

  nfc_func1: function(){
    // 1?????????NFCAdapter????????????
    let NFCAdapter = wx.getNFCAdapter();
    // 2???????????????NFC??????
    NFCAdapter.startDiscovery({
      success: res => {
        this.title = '???????????????????????????NFC';
        console.log(res);
        this.myShowModal(JSON.stringify(res))
      },
      fail: error => {
        this.title = '????????????';
        console.error(error);
        this.myShowModal(JSON.stringify(error))
      },
      complete: res => {
        console.log(res);
        this.myShowModal(JSON.stringify(res))
      }
    });
    // 3??????????????????????????????
    this.myShowModal(JSON.stringify("111"));
    NFCAdapter.onDiscovered(callback => {
      // 4?????????????????????????????????????????????????????????callback ?????????????????????????????????
      this.myShowModal(JSON.stringify("222"));
      let aid = parseInt(this.ab2hex(callback.id), 16);
      if (callback.messages) {
        this.myShowModal(JSON.stringify("333"));
        let cordsArray = callback.messages[0].records;
        this.myShowModal(JSON.stringify("444"));
        let payl = ""
        cordsArray.find(item => {
          this.read.payload = this.byteToString(new Uint8Array(item.payload));
          payl = this.byteToString(new Uint8Array(item.payload))
          this.read.id = this.byteToString(new Uint8Array(item.id));
          this.read.type = this.byteToString(new Uint8Array(item.type));
        });
        this.myShowModal(JSON.stringify("555"));
        console.log("payl:", payl);
        this.myShowModal(JSON.stringify(payl));
        this.myShowModal(JSON.stringify("666"));
      }else{
        this.myShowModal("callback.message ?????????");
      }
    });
    

  },
    /**
   * ????????????????????????
   * @param {Object} arr
   */
  byteToString: function(arr) {
    if (typeof arr === 'string') {
      return arr;
    }
    var str = '',
      _arr = arr;
    for (var i = 0; i < _arr.length; i++) {
      var one = _arr[i].toString(2),
        v = one.match(/^1+?(?=0)/);
      if (v && one.length == 8) {
        var bytesLength = v[0].length;
        var store = _arr[i].toString(2).slice(7 - bytesLength);
        for (var st = 1; st < bytesLength; st++) {
          store += _arr[st + i].toString(2).slice(2);
        }
        str += String.fromCharCode(parseInt(store, 2));
        i += bytesLength - 1;
      } else {
        str += String.fromCharCode(_arr[i]);
      }
    }
    return str;
  },
  /**
   * ???????????????aid???
   * @param {Object} buffer
   */
  ab2hex: function(buffer) {
    var hexArr = Array.prototype.map.call(
      new Uint8Array(buffer),

      function(bit) {
        return ('00' + bit.toString(16)).slice(-2);
      }
    );
    return hexArr.join('');
  },


  myShowModal: function(message){
    wx.showModal({
      title: '??????',
      content: message,
      success (res1) {
        if (res1.confirm) {
          console.log('??????????????????')
        } else if (res1.cancel) {
          console.log('??????????????????')
        }
      }
    })
  },

  //   ??????nfc version 3 
  nfc_func2: function(){
    // 1?????????NFCAdapter????????????
    let NFCAdapter = wx.getNFCAdapter();
    // // ?????? NDEF ??????
    // ndef.onNdefMessage(callback => {
    //   console.log(callback)
    // });
    // if (res.techs.includes(nfc.tech.ndef)) {
    //   console.log(res.messages)
    //   const ndef = nfc.getNdef()
    //   ndef.writeNdefMessage({
    //     uris: [''],
    //     complete(res) {
    //       console.log('res:', res)
    //     }
    //   })
    //   return
    // }

    // if (res.techs.includes(nfc.tech.nfcA)) {
    //   const nfcA = nfc.getNFCA()
    //   nfcA.transceive({
    //     data: new ArrayBuffer(0),
    //     complete(res) {
    //       console.log('res:', res)
    //     }
    //   })
    //   return
    // }
  },
})
