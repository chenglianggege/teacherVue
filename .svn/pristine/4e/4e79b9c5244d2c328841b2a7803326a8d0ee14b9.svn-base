<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'App',
  mounted () {
    const script = document.createElement('script')
    script.src = 'https://s19.cnzz.com/z_stat.php?id=1274476785&web_id=1274476785'
    script.language = 'JavaScript'
    document.body.appendChild(script)
    this.logTrack()
  },
  watch: {
    '$route' () {
      if (window._czc) {
        let location = window.location
        let contentUrl = location.pathname + location.hash
        let refererUrl = '/'
        window._czc.push(['_trackPageview', contentUrl, refererUrl])
      }
      this.logTrack()
    }
  },
  methods: {
    logTrack (path) {
      path = path ? '/' + path : ''
      let contentUrl = window.location.pathname + window.location.hash
      if (contentUrl.indexOf('#') >= 0) {
        contentUrl = contentUrl.substr(contentUrl.indexOf('#') + 1)
      }
      if (contentUrl.indexOf('?') > 0) {
        contentUrl = contentUrl.substr(0, contentUrl.indexOf('?'))
      }
      let params = JSON.parse(localStorage.getItem('userInfo'))
      params = params || {}
      let userArea = ''
      params.province = ''
      params.city = ''
      params.area = ''
      if (params && params.hasOwnProperty('user_area') && params.user_area) {
        userArea = params.user_area.province_name + params.user_area.city_name
        userArea = userArea + (+params.user_area.area_id !== +params.user_area.city_id ? params.user_area.full_name : '')
        params.province = params.user_area.province_name
        params.city = params.user_area.city_name
        params.area = params.user_area.full_name
      }
      params.user_area = userArea
      params.contentUrl = contentUrl + path
      params.APIVersion = '0.6.0'
      params.client = 'pcweb'
      axios.get('https://365speak.cn-hangzhou.log.aliyuncs.com/logstores/teacher_client_log/track', {params: params})
    }
  }
}
</script>

<style  src="@/assets/css/common.css"></style>
<style scoped>
 #app{
   min-width: 1200px;
 }
</style>
