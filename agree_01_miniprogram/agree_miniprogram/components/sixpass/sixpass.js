// components/sixpass/sixpass.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
 
  },
 
  /**
   * 组件的初始数据
   */
  data: {
    rpx_height: 100,
    rpx_width: 600,
    background_color: "#FFFFFF",
    allinputF1:true,
    inputArr:[],
    inputStr:'',
    focusF:[],
    allinput:'',
  },
 
  /**
   * 组件的方法列表
   */
  methods: {
    passInput(e){
      var that = this;
      var value = e.detail.value;
      var num = e.detail.cursor-1;
    //   this.triggerEvent("passInput", this.data)
      var inputArr = [];
      for(let i=0;i<=num;i++){
        inputArr.push(value.substring(i,i+1))
      }
      if(inputArr.length>=6){
        that.setData({
          inputSrr:value,
          inputArr:inputArr,
          allinput:value,
        })
        console.log('密码输入完成 '+inputArr)
      }else{
        that.setData({
          inputSrr:value,
          inputArr:inputArr,
          allinput:''
        })
      }
      this.triggerEvent("passInput", this.data)
    },
    allInputBtn(e){
      var that = this;
      var index = e.target.dataset.index;
      var focusF = http.forC(that.data.focusF);
      var inputArr = that.data.inputArr;
      var value = e.detail.value
      if(inputArr[index]){
        inputArr[index] = '';
        focusF[index] = '1';
      }else{
        inputArr[index] = value;
        focusF[index+1] = '1';
      }
      that.setData({focusF:focusF,inputArr:inputArr})
    },
    // 点击关闭密码框
    hideBox(){
      this.setData({allinputF1:false})
    },
    show(){
      this.setData({allinputF1:true})
    },
    focusInput(){
      console.log(this.data.inputStr)
      this.setData({allinputF1:true})
    },
    // 通过方法设置密码的宽高
    setWidthHeight(data){
      console.log(data)
      let width = data["width"]
      let height = data["height"]
      this.setData({
        rpx_width: width,
        rpx_height: height
      })
    },
    // 通过方法设置背景颜色
    setBackgroundColor(color){
      this.setData({
        background_color: color
      })
    },
    // 通过方法填充所有密码
    setAllData(data){
        // console.log("将所有数据设置为：", data)
        this.allinput = data
        this.inputArr = []
        for(let i = 0; i < data.length; i++){
            this.inputArr.push(data[i])
        }
        this.setData({
            allinput: this.allinput,
            inputArr: this.inputArr
        })
        console.log(`设置后数据：allinput = ${this.allinput}, inputarr = ${this.inputArr}`)
    }
  }
})
