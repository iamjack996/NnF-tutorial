
<template>
  <div>
    <div class="quill-editor" :content="content" @change="onEditorChange($event)" v-quill:myQuillEditor="editorOption">
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      content: '',
      editorOption: {
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ header: 1 }, { header: 2 }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ script: 'sub' }, { script: 'super' }],
            [{ indent: '-1' }, { indent: '+1' }],
            [{ direction: 'rtl' }],
            [{ size: ['small', false, 'large', 'huge'] }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ font: [] }],
            [{ color: [] }, { background: [] }],
            [{ align: [] }],
            ['clean'],
            ['link', 'image', 'video']
          ],
          syntax: {
            highlight: text => hljs.highlightAuto(text).value
          }
        }
      }
    }
  },
  mounted() {
    this.content = this.olddata
  },
  methods: {
    onEditorChange({ editor, html, text }) {
      this.$emit('update:value', html)
    }
  }
}
</script>

<style lang="scss">
@import 'quill/dist/quill.core.css';
@import 'quill/dist/quill.snow.css';
@import 'quill/dist/quill.bubble.css';
.ql-container,
.quill-editor {
  height: 300px;
  background-color: #fff;
}
</style>