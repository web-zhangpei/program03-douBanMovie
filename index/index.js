// index/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=654050749,1884982998&fm=27&gp=0.jpg',
      'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2765050615,204826514&fm=27&gp=0.jpg',
      'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3732984014,3687063308&fm=27&gp=0.jpg'
    ],
    in_theaters:{},
    coming_soon:{},
    top250:{},
    us_box:{},
    all_info:[{title:'正在上映',requestUrl:'in_theaters'},
      { title: '即将上映', requestUrl:'coming_soon'},
      { title: 'top250', requestUrl: 'top250' }, { title: 'us_box', requestUrl: 'us_box' }],
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000
  },
 // 请求并设缓存
  resData() {
    var promises = this.data.all_info.map(function (info) {
          var url = 'https://api.douban.com/v2/movie/' + info.requestUrl;
          // console.log(url)
         return app.wxAPI.getNetJson(url,{ count: 10 }).then((res) => {
            // app.wxAPI.setStorage(info.title, res.data)
            
            info.movies = res.data.subjects;
            // console.log(info)
            return info;
          }).catch((err) => {
            console.log(err)
          })
         })
      Promise.all(promises).then((infos) => {
        //all方法处理每个对象,把多条数据打包成一条即数组
        console.log(infos);
        wx.setStorage({
          key:'board_data',
          data:{
            all_info:infos,
            expires:Date.now() + 1000*60*60*24
          }
        })
      this.setData({
        all_info:infos
      })
      }).catch((err) => {
        console.log(err)
      });
  },
  getCache:function() {
    app.wxAPI.getStorage('board_data').then((res) => {
      // console.log('qingqiule')
      if (res.data.expires < Date.now()) {//过期重新存
        this.resData()
        // this.getCache()
      } else {
        //  console.log(res.data.all_info[3].movies[0].subject)
        this.setData({//渲染页面
          in_theaters: res.data.all_info[0].movies,
          coming_soon: res.data.all_info[1].movies,
          top250: res.data.all_info[2].movies,
          us_box: res.data.all_info[3].movies
        })

      }
    }, (err) => {
      this.resData();
      // this.getCache()
      // app.wxAPI.ge
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  // 获取缓存
      // this.resData()
      this.getCache();
 
    
  }
})