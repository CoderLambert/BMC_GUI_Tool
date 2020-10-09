const mutations = {
  // 1 不带参数的方式
  setBiosConfList(state, payload) {
    console.log(payload);
    state.biosConfList = payload;
  },
  setBiosFlashList(state, payload) {
    console.log(payload);
    state.biosFlashList = payload;
  },
  setBiosMachine(state, payload) {
    console.log(payload);
    // state.biosConfList = payload;
    let updateItme = state.biosConfList[payload.id];
    updateItme.bmc_ip = payload.bmc_ip;
    updateItme.login_way_type = payload.login_way_type;
    updateItme.password = payload.password;
    updateItme.save_bios_config = payload.save_bios_config;
    updateItme.username = payload.username;
    console.log(`payload.save_bios_config =》 ${payload.save_bios_config}`)
  },

  deleteBiosMachine(state,payload) {
    console.log(payload)
    state.biosConfList.splice(payload.id,1);
    console.log(state.biosConfList)
  },
  setBiosConfFilePath(state, payload) {
    console.log(payload);
    state.biosConfFilePath = payload;
  },

  setBiosImageFilePath(state, payload) {
    console.log(payload);
    state.biosImageFilePath = payload;
  }
};

export default mutations;
