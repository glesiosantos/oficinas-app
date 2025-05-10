<template>
  <div class="fullscreen bg-yellow text-white text-center q-pa-md flex flex-center">
    <div>
      <div>
        <q-img src="../assets/imgs/404_vector.png"/>
      </div>

      <div class="text-h2 text-black" style="opacity:.4">
        Página não encontrada
      </div>

      <q-btn
        class="q-mt-xl"
        color="black"
        text-color="white"
        unelevated
        to="/"
        label="Go Home"
        no-caps
      />
    </div>
  </div>
</template>

<script setup>
//
</script>

<style scoped>
.error-fundo {
  background-image: url(../assets/imgs/404.png);
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
