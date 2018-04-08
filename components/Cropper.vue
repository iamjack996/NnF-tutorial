<template>
  <div class="vue-component-cropper">
    <img v-if="newImage" :src="newImage" class="img-thumbnail rounded preview-photo mr-4 mb-4" alt="預覽圖片" />
    <b-btn @click="handleSelectImage" variant="primary">
      選擇圖片
    </b-btn>
    <input type="file" accept="image/*" class="d-none" @change="handleImageChange" ref="file" />
    <input type="hidden" :name="name" :value="value" />
    <!-- Modal -->
    <b-modal ref="fileModal" title="裁切圖片" ok-disabled cancel-disabled hide-footer>
      <NoSSR>
        <vue-cropper ref="cropper" :guides="true" :view-mode="2" drag-mode="crop" :auto-crop-area="1" :min-container-width="468" :min-container-height="300" :background="true" :src="value" alt="裁切照片" v-model="value" :aspectRatio="aspectRatio" :img-style="{ 'width': '400px', 'height': '300px','border': '100px solid black'}">
        </vue-cropper>
      </NoSSR>
      <div class="modal-footer">
        <b-btn @click="rotate" :disabled="disabled">旋轉</b-btn>
        <b-btn @click="crop" variant="success" :disabled="disabled">儲存</b-btn>
      </div>
    </b-modal>
  </div>
</template>

<script type="text/javascript">
import NoSSR from 'vue-no-ssr'
import client from '~/utils/feathers-client'

export default {
  props: {
    value: { type: String },
    name: { type: String, default: 'name' },
    cropWidth: { type: [Number, String] },
    cropHeight: { type: [Number, String] },
    disabled: { type: Boolean },
    previewImg: null
  },
  components: {
    NoSSR
  },
  mounted() {
    this.newImage = this.previewImg
  },
  computed: {
    aspectRatio() {
      return Number(1000 / 1000)
    }
  },
  data() {
    return {
      newImage: null
    }
  },
  methods: {
    showModal() {
      this.$refs.fileModal.show()
    },
    hideModal() {
      this.$refs.fileModal.hide()
    },
    handleSelectImage() {
      this.$refs.file.click()
    },
    handleImageChange(e) {
      const file = e.target.files[0]

      if (!file.type.includes('image/')) {
        alert('Please select an image file')
        return
      }

      if (typeof FileReader === 'function') {
        const reader = new FileReader()

        reader.onload = event => {
          this.$refs.cropper.replace(event.target.result)
          this.$refs.fileModal.show()
        }

        reader.readAsDataURL(file)
        e.target.value = ''
      } else {
        alert('Sorry, FileReader API not supported')
      }
    },
    rotate() {
      this.$refs.cropper.rotate(90)
    },
    async crop() {
      const { cropWidth, cropHeight } = this
      this.$refs.fileModal.hide()
      const dataURL = this.$refs.cropper
        .getCroppedCanvas({ width: cropWidth, height: cropHeight })
        .toDataURL()

      this.newImage = dataURL
      this.$emit('crop', dataURL)
    }
  }
}
</script>

<style lang="scss">
.preview-photo {
  padding: 8px 8px;
  width: 300px;
  max-width: 200px;
  max-height: 200px;
}
</style>