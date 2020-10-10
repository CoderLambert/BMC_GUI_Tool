<template>
  <div class="container">
    <h1>Suma</h1>
    <ul class="nav-box">
      <li
        v-for="navitme in navItmes"
        v-bind:key="navitme.id"
        class="nav-itme"
        :class="{ active: navIndex == navitme.id }"
        @click="ClickNavItme(navitme.id)"
      >
        <router-link :to="navitme.path">
          {{ navitme.name }}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "navbar",
  data() {
    return {
      navIndex: 1,
      navItmes: [
        { id: 0, name: "BMC", path: "/bmc" },
        { id: 1, name: "BIOS", path: "/" },
        { id: 2, name: "开发文档", path: "/website" }
      ]
    };
  },
  methods: {
    ClickNavItme(id) {
      this.navIndex = id;
    }
  }
};
</script>

<style lang="less" scoped>
.container {
  background: #e8f2d9;
  display: inline-flex;
  justify-content: space-between;
  // place-content: center;
  place-items: center;
  width: 100%;
  height: 50px;
  h1 {
    // text-align: center;
    color: red;
    margin-left: 20px;
    font-size: 40px;
  }
  .nav-box {
    display: flex;
    height: 50px;
    line-height: 50px;
    margin-right: 150px;

    .nav-itme {
      font-size: 18px;
      list-style: none;
      //   border: 1px solid #eee;
      &:hover {
        background: #8bbf43;
        color: white;
        cursor: pointer;
      }

      a {
        display: block;
        width: 100px;
        text-align: center;
        color: #4c4c4d;
        height: 100%;
        text-decoration: none;
      }
    }
    .active {
      background: #8bbf43;
      color: white;
      cursor: pointer;
    }
  }
}
</style>
