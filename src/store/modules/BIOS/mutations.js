const mutations = {
    // 1 不带参数的方式
    setBiosConfList (state, payload) {
        console.log(payload);
        state.biosConfList = payload
    },

    setBiosConfFilePath (state, payload) {
        console.log(payload);
        state.biosConfFilePath = payload
    },

    setBiosImageFilePath (state, payload) {
        console.log(payload);
        state.biosImageFilePath = payload
    },

}

export default mutations