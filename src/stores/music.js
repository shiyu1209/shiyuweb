import { defineStore } from 'pinia'

export const useMusic = defineStore('music', {
  state:()=>({
    list:[
      {title:'在加纳共和国离婚',artist:'菲道尔,DIOR大颖',src:'/music/在加纳共和国离婚.mp3',poster:'/music/在加纳共和国离婚.jpg'},
      {title:'雨爱',artist:'杨丞琳',src:'/music/雨爱.mp3',poster:'/music/雨爱.jpg'},
      {title:'一路向北',artist:'周杰伦',src:'/music/一路向北.mp3',poster:'/music/一路向北.jpg'},
      {title:'偏向',artist:'陈子晴',src:'/music/偏向.mp3',poster:'/music/偏向.jpg'},
      {title:'租购',artist:'薛之谦',src:'/music/租购.mp3',poster:'/music/租购.jpg'}
    ],
    index:0,
    playing:false,
    volume:.7,
    currentTime:0,
    duration:0
  }),
  getters:{
    current:s=>s.list[s.index]
  },
  actions:{
    play(){this.playing=true},
    pause(){this.playing=false},
    toggle(){this.playing?this.pause():this.play()},
    next(){this.index=(this.index+1)%this.list.length},
    prev(){this.index=(this.index-1+this.list.length)%this.list.length},
    seek(p){const a=document.querySelector('audio');if(a)a.currentTime=p*a.duration}
  }
})