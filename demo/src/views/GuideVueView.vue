<script setup lang="ts">
import CodeBlock from "@/components/CodeBlock.vue";
</script>

<template>
  use as usual, but optimize with if you use in-browser compilation:
  <CodeBlock language="javascript"
    >app.config.compilerOptions.isCustomElement = (tag) =>
    tag.includes('-')</CodeBlock
  >

  if you use build tools go for the following Vite Config setup:
  <CodeBlock language="javascript" class="line-numbers">
<pre>// vite.config.js
import vue from '@vitejs/plugin-vue'

export default {
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // treat all tags with a dash as custom elements
          isCustomElement: (tag) => tag.includes('-')
        }
      }
    })
  ]
}</pre></CodeBlock>

  Example vue cli config:
  <CodeBlock language="javascript" class="line-numbers">
    <pre>// vue.config.js
module.exports = {
  chainWebpack: config => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap(options => ({
        ...options,
        compilerOptions: {
          // treat any tag that starts with add- as custom elements
          isCustomElement: tag => tag.startsWith('add-')
        }
      }))
  }
}</pre></CodeBlock>

  Mind the specialties when passing DOM properties! Only strings for objects and
  arrays. Boolean is ok. v-bind as option:
  <CodeBlock>
    <pre>&lt;my-element :user.prop="{ name: 'jack' }"&gt;&lt;/my-element&gt;

&lt;!-- shorthand equivalent --&gt;
&lt;my-element .user="{ name: 'jack' }"&gt;&lt;/my-element&gt;</pre></CodeBlock>

  See official documentation at
  https://vuejs.org/guide/extras/web-components.html
</template>
