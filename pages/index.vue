<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12 text-center">
        <div class="form-group mt-2">
          <label>標題</label>
          <input type="email" class="form-control" v-model="model.title">
        </div>
        <div class="form-group mt-2">
          <label>內容</label>
          <Quill v-bind:value.sync="model.content"></Quill>
        </div>
        <div class="form-group mt-2">
          <label>圖片</label>
          <Cropper @crop="cropValue"></Cropper>
        </div>
        <button class="btn btn-primary" @click.prevent="handleCreate">送出</button>
      </div>

    </div>
    <div class="card mt-5">
      <div class="card-header text-center">
        Model 資料
      </div>
      <div class="card-body">
        {{ model }}
      </div>
    </div>
    <hr>

    <div class="col-md-6 offset-md-3 text-center mt-5">
      <h3 class="mt-5">所有貼文</h3>
      <div class="card mt-2" v-for="(post, index) in allPosts.data" :key="index">
        <div class="card-header text-center">
          {{ post.title }}
        </div>
        <img class="card-img-top img-fluid" :src="post.imgPath">
        <div class="card-body" v-html="post.content">
        </div>
        <div class="card-footer text-muted">
          <button class="btn" @click="removePost(post._id,$event)">
            <i class="icon-trash text-danger"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import icons from 'simple-line-icons/css/simple-line-icons.css'
import Quill from '~/components/Quill'
import Cropper from '~/components/Cropper'
import client from '~/utils/feathers-client'
export default {
  head() {
    return {
      title: '首頁'
    }
  },
  data() {
    return {
      model: {
        title: null,
        content: null,
        imgPath: null
      },
      tempImage: null
    }
  },
  components: {
    Quill,
    Cropper
  },
  async asyncData() {
    const allPosts = await client.service('posts').find({
      $sort: { createdAt: -1 }
    })
    return { allPosts }
  },
  methods: {
    async handleCreate() {
      const vm = this
      const swal = await import('sweetalert')
      const { path } = await this.uploadImage(this.tempImage)
      if (path) {
        this.model.imgPath = path
      } else {
        swal('老天鵝!', '圖片儲存失敗', 'error')
        return false
      }

      const createPost = await client.service('posts').create(this.model)
      if (createPost) {
        swal('好欸!', '儲存成功', 'success')
        this.allPosts.data.unshift(createPost)
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      } else {
        swal('老天鵝!', '儲存失敗', 'error')
        return false
      }
    },
    async uploadImage(uri) {
      return client.service('uploads').create({ uri })
    },
    cropValue(value, data) {
      this.tempImage = value
    },
    async removePost(id, event) {
      const swal = await import('sweetalert')
      const removePost = await client.service('posts').remove(id)
      if (removePost) {
        swal('刪除', '已經刪除', 'success')
        // event.target.closest('.card').remove()
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      } else {
        swal('刪除', '刪除失敗', 'error')
      }
    }
  }
}
</script>

<style lang='sass' scoped>

</style>
