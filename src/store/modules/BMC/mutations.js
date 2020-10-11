import _ from "lodash";
const mutations = {
  // 1 不带参数的方式
  setBmcConfList(state, payload) {
    // console.log(payload);
    state.bmcConfList = payload;
  },
  setBmcFlashList(state, payload) {
    // console.log(payload);
    state.bmcFlashList = payload;
  },
  setBmcMachine(state, payload) {
    // console.log(payload);
    // state.bmcConfList = payload;
    let updateItme = state.bmcConfList[payload.id];
    updateItme.bmc_ip = payload.bmc_ip;
    updateItme.login_way_type = payload.login_way_type;
    updateItme.password = payload.password;
    updateItme.save_bmc_config = payload.save_bmc_config;
    updateItme.username = payload.username;
    // console.log(`payload.save_bmc_config =》 ${payload.save_bmc_config}`);
  },

  deleteBmcMachine(state, payload) {
    console.log(payload);
    let index = _.findIndex(state.bmcFlashList, function(machine) {
      return machine.id === payload.id;
    });
    // console.log(`deleteBmcMachine index => ${index}`);
    state.bmcFlashList.splice(index, 1);
    // console.log(state.bmcFlashList);
  },
  setBmcConfFilePath(state, payload) {
    // console.log(payload);
    state.bmcConfFilePath = payload;
  },

  setBmcImageFilePath(state, payload) {
    console.log(payload);
    state.bmcImageFilePath = payload;
  }
};

export default mutations;
