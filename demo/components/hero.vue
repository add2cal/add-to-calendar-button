<script setup lang="ts">
import StatsBar from "@/components/statsBar.vue";
import StatsBarPlaceholder from "@/components/placeholders/statsBarPlaceholder.vue";
import NavigationBar from "@/components/menu/navigationBar.vue";
import Logo from "@/components/logos/logoMain.vue";
import { ArrowDownIcon } from '@heroicons/vue/24/solid';

const localePath = useLocalePath();
</script>

<template>
  <div class="hero-container">
    <div class="container flex justify-between">
      <div class="-mt-1 w-auto max-w-[150px] grow">
        <Logo class="force-light" />
      </div>
      <NavigationBar />
    </div>
    <div class="container">
      <div class="relative z-20">
        <div class="absolute left-0 top-0 m-auto grid w-full grid-cols-1 justify-items-center pb-20 pt-20 xs:py-24 md:py-28 lg:grid-cols-2 lg:py-16">
          <div class="grid grid-cols-1 justify-items-center pb-5 md:grid-cols-2 lg:grid-cols-1 lg:py-20">
            <div class="max-w-[400px] self-center pb-14 md:pb-0 lg:pb-16">
              <h1 class="text-white drop-shadow-lg">
                <span class="hidden xs:block">{{ $t('content.home.header_prefix') }}</span>
                <span class="hidden xs:block">Add to Calendar Button</span>
                <span class="block text-5xl leading-[3.8rem] xs:hidden">{{ $t('content.home.header_slogan') }}</span>
              </h1>
              <h2 class="mt-5 hidden text-2xl italic text-white opacity-70 xs:block sm:text-3xl">{{ $t('content.home.header_slogan') }}</h2>
            </div>
            <div class="grid max-w-[400px] grid-cols-1 justify-items-center gap-6 self-center xs:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
              <div class="hidden xs:block">
                <NuxtLink :to="{path: localePath('index'), hash: '#installation'}" class="button-secondary order-first w-40 text-white md:order-last lg:order-first">{{ $t('labels.getStarted') }}</NuxtLink>
              </div>
              <div>
                <NuxtLink :to="{path: localePath('index'), hash: '#demo'}" class="button-primary-animated order-first w-40 text-white md:order-last lg:order-first">{{ $t('labels.demo') }} <ArrowDownIcon class="-mt-1 ml-2 inline-block h-4 w-4 xs:hidden" aria-hidden="true" /></NuxtLink>
              </div>
            </div>
          </div>
          <div class="hidden self-center p-14 lg:block xl:p-10">
            <nuxt-img sizes="500px xl:600px" alt="Add to Calendar Button" width="1000" height="791" src="/assets/img/combo.webp" />
          </div>
        </div>
      </div>
      <div class="relative z-10 flex justify-end overflow-hidden">
        <div class="w-full max-w-full pt-64 opacity-10 dark:opacity-[0.05] xs:pt-48 sm:pt-28 md:max-w-[450px] md:pt-28 lg:max-w-[600px] lg:pt-32 xl:max-w-[750px] xl:pt-12">
          <svg version="1.1" style="width:100%; height:auto; min-height:300px;" viewBox="0 0 808 572" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <g transform="translate(-186.89 -51.542)" opacity=".62861">
              <path
                d="m956.09 362.62-5.7578-0.089-0.0869 5.6256-4.2688-0.0659 0.0869-5.6256-5.7247-0.0885 0.0625-4.0369 5.7247 0.0885 0.0869-5.6256 4.2688 0.0659-0.0869 5.6256 5.7577 0.089zm-568.03-42.116-5.0115-2.8364-2.7712 4.8964-3.7155-2.1028 2.7712-4.8965-4.9827-2.8201 1.9887-3.5136 4.9827 2.8201 2.7712-4.8965 3.7155 2.1029-2.7712 4.8965 5.0114 2.8363zm193.89 238.55-5.5656 1.4778 1.444 5.4378-4.1263 1.0957-1.444-5.4378-5.5336 1.4694-1.0361-3.9022 5.5336-1.4694-1.444-5.4378 4.1263-1.0957 1.444 5.4378 5.5655-1.4778zm-273.05-496.64-5.7306-0.56507-0.5521 5.5991-4.2487-0.41893 0.5521-5.5991-5.6977-0.56185 0.3962-4.0179 5.6977 0.56183 0.5521-5.5991 4.2487 0.41895-0.5521 5.5991 5.7306 0.56507zm43.961 288.42-12.626-1.1837-1.1566 12.336-9.3606-0.87755 1.1564-12.336-12.553-1.1769 0.82988-8.8521 12.553 1.1769 1.1565-12.336 9.3607 0.87758-1.1566 12.336 12.626 1.1837zm277.25-58.253-20.522 2.0946 2.0465 20.051-15.215 1.5529-2.0466-20.051-20.405 2.0825-1.4686-14.389 20.405-2.0826-2.0465-20.051 15.216-1.5529 2.0464 20.052 20.522-2.0946zm-80.505-194.83-20.132-4.5019-4.3985 19.67-14.926-3.3377 4.3985-19.67-20.016-4.476 3.1563-14.115 20.016 4.476 4.3986-19.67 14.926 3.3377-4.3987 19.67 20.132 4.5018zm445.03 78.533-12.41 1.3007 1.2709 12.126-9.2011 0.96433-1.2709-12.126-12.339 1.2932-0.9119-8.7012 12.339-1.2932-1.2708-12.126 9.2011-0.96435 1.2707 12.126 12.41-1.3007zm-495.83 189.65-12.41 1.3007 1.2709 12.126-9.2011 0.96433-1.2709-12.126-12.339 1.2932-0.9119-8.7012 12.339-1.2932-1.2708-12.126 9.2011-0.96435 1.2707 12.126 12.41-1.3007zm460.37 157.8-12.41 1.3007 1.2709 12.126-9.2011 0.96433-1.2709-12.126-12.339 1.2932-0.9119-8.7012 12.339-1.2932-1.2708-12.126 9.2011-0.96435 1.2707 12.126 12.41-1.3007zm-579.31-389.27-12.41 1.3007 1.2709 12.126-9.2011 0.96433-1.2709-12.126-12.339 1.2932-0.9119-8.7012 12.339-1.2932-1.2708-12.126 9.2011-0.96435 1.2707 12.126 12.41-1.3007zm-158.86 339.68-12.467-0.52987-0.5177 12.181-9.2432-0.39285 0.5177-12.181-12.395-0.52683 0.3715-8.741 12.396 0.52683 0.5177-12.181 9.2431 0.39284-0.5177 12.181 12.467 0.52985zm655.8-314.87-12.467-0.52987-0.5177 12.181-9.2432-0.39285 0.5177-12.181-12.395-0.52683 0.3715-8.741 12.396 0.52683 0.5177-12.181 9.2431 0.39284-0.5177 12.181 12.467 0.52985zm-461.57 301.53-12.467-0.52987-0.5177 12.181-9.2432-0.39285 0.5177-12.181-12.395-0.52683 0.3715-8.741 12.396 0.52683 0.5177-12.181 9.2431 0.39284-0.5177 12.181 12.467 0.52985zm-3.733 106.75-38.791-9.0683-8.8601 37.901-28.76-6.7233 8.8601-37.901-38.569-9.0162 6.3581-27.198 38.569 9.0162 8.8601-37.901 28.76 6.7233-8.8604 37.901 38.791 9.0683zm142.21-146.3-20.077-3.445-3.3659 19.616-14.885-2.5541 3.3659-19.616-19.962-3.4252 2.4154-14.076 19.962 3.4252 3.3659-19.616 14.885 2.5541-3.366 19.616 20.077 3.445zm-37.07-198.36-40.422 6.6066 6.4551 39.494-29.969 4.8982-6.4551-39.494-40.19 6.5688-4.6321-28.341 40.19-6.5687-6.455-39.494 29.969-4.8982 6.455 39.494 40.422-6.6067zm-250.09 6.4834-5.5656 1.4778 1.444 5.4378-4.1263 1.0957-1.444-5.4378-5.5336 1.4694-1.0361-3.9022 5.5336-1.4694-1.444-5.4378 4.1263-1.0957 1.444 5.4378 5.5655-1.4778zm604.81 359.8-5.5656 1.4778 1.444 5.4378-4.1263 1.0957-1.444-5.4378-5.5336 1.4694-1.0361-3.9022 5.5336-1.4694-1.444-5.4378 4.1263-1.0957 1.444 5.4378 5.5655-1.4778zm-175.34-527.04-5.7306-0.56507-0.5521 5.5991-4.2487-0.41893 0.5521-5.5991-5.6977-0.56185 0.3962-4.0179 5.6977 0.56183 0.5521-5.5991 4.2487 0.41895-0.5521 5.5991 5.7306 0.56507zm-37.515 281.21-12.202 3.451 3.3717 11.922-9.0468 2.5586-3.3719-11.922-12.132 3.4311-2.4196-8.5554 12.132-3.4312-3.3718-11.922 9.0469-2.5586 3.3717 11.922 12.202-3.451zm276.52-56.814-19.85 5.614 5.4851 19.395-14.717 4.1622-5.4852-19.395-19.736 5.5817-3.9361-13.918 19.736-5.5817-5.4851-19.395 14.717-4.1622 5.485 19.395 19.85-5.614zm-80.817-189.78-20.132-4.5019-4.3985 19.67-14.926-3.3377 4.3985-19.67-20.016-4.476 3.1563-14.115 20.016 4.476 4.3986-19.67 14.926 3.3377-4.3987 19.67 20.132 4.5018zm-169.75 36.711-12.41 1.3007 1.2709 12.126-9.2011 0.96433-1.2709-12.126-12.339 1.2932-0.9119-8.7012 12.339-1.2932-1.2708-12.126 9.2011-0.96435 1.2707 12.126 12.41-1.3007zm35.38 326.34-12.467-0.52987-0.5177 12.181-9.2432-0.39285 0.5177-12.181-12.395-0.52683 0.3715-8.741 12.396 0.52683 0.5177-12.181 9.2431 0.39284-0.5177 12.181 12.467 0.52985zm2.4325 76.091-37.639 13.051 12.751 36.775-27.906 9.676-12.751-36.775-37.423 12.976-9.1503-26.389 37.423-12.976-12.751-36.775 27.906-9.676 12.751 36.775 37.639-13.051zm-288.03 75.575-11.983-0.57918-0.56588 11.708-8.8843-0.42941 0.56587-11.708-11.914-0.57586 0.40609-8.4016 11.914 0.57586 0.56588-11.708 8.8843 0.42941-0.56594 11.708 11.983 0.57916zm417.56-152.85-20.077-3.445-3.3659 19.616-14.885-2.5541 3.3659-19.616-19.962-3.4252 2.4154-14.076 19.962 3.4252 3.3659-19.616 14.885 2.5541-3.366 19.616 20.077 3.445zm-91.574-149.39-40.791-3.6942-3.6094 39.855-30.243-2.7389 3.6094-39.855-40.557-3.673 2.5902-28.6 40.557 3.673 3.6095-39.855 30.243 2.7389-3.6095 39.855 40.791 3.6942z"
                fill="#fff"
              />
            </g>
          </svg>
        </div>
      </div>
    </div>
    <div>
      <ClientOnly>
        <StatsBar />
        <template #fallback>
          <StatsBarPlaceholder />
        </template>
      </ClientOnly>
    </div>
  </div>
  <div :class="view.atTopOfPage ? 'top-[-80px]' : 'top-0'" class="fixed z-50 w-full bg-gradient-to-tr from-primary to-primary-light py-3 shadow-xl transition-all dark:from-primary-darkest dark:to-primary-darker lg:hidden">
    <div class="container flex justify-between">
      <div class="-ml-3 -mt-1 w-auto max-w-[100px] grow xl:ml-0">
        <Logo variation="mobile-small" class="force-light" />
      </div>
      <NavigationBar />
    </div>
  </div>
</template>

<script lang="ts">
export default {
  data () {
    return {
      view: {
        atTopOfPage: true
      }
    }
  },
  beforeMount () {
    window.addEventListener('scroll', this.handleScroll);
  },
  methods: {
    handleScroll(){
      if (window.pageYOffset > 500) {
        if (this.view.atTopOfPage) this.view.atTopOfPage = false
      } else {
        if (!this.view.atTopOfPage) this.view.atTopOfPage = true
      }
    }
  }
};
</script>

<style scoped>
.hero-container {
  border-bottom-right-radius: 90% 10%;
  border-bottom-left-radius: 90% 10%;
  @apply w-full bg-gradient-to-tr from-primary from-40% to-primary-light pt-5 shadow-2xl dark:from-primary-darkest dark:to-primary-darker sm:rounded-b-none sm:shadow-none;
}
</style>
