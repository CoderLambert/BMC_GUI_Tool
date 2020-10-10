const getters = {
  bmcConfListText: state => {
    return JSON.stringify(state.bmcConfList, null, 2);
  },

  bmcConfListForUpdate: state => {
    let json_data = state.bmcConfList;
    // console.log(json_data)
    let target = json_data;
    if (json_data !== null) {
      target = json_data.map(function(itme, index) {
        itme.imageUpdateStates = "connect";
        itme.id = index;
        return itme;
      });
    }
    return target;
  }
};

export default getters;
