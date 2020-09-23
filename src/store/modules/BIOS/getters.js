const getters = {
  biosConfListText: state => {
    return JSON.stringify(state.biosConfList, null, 2);
  },

  biosConfListForUpdate: state => {
    let json_data = state.biosConfList;
    // console.log(json_data)
    let target = json_data;
    if (json_data !== null) {
      target = json_data.map(function(itme,index) {
        itme.imageUpdateStates = "connect";
        itme.id = index;
        return itme;
      });
    }
    return target;
  }
};

export default getters;
