import fetch from '../../util/fetch/fetch.js'
import * as MUTATIONS from '../const/mutaions'
import * as ACTIONS from '../const/actions'

const list = new Map()
list.set(1, 2)
const state = {
  list,
  curSchema: 12
}

const mutations = {
  [MUTATIONS.SCHEMA_LIST_SAVE](state, data, start) {
    const newMap = start ? state.list : new Map()
    data.forEach(item => newMap.set(item._id, item))
    state.list = newMap
    state.curSchema = 11
    console.log('state', state.list)
  },
  [MUTATIONS.SCHEMA_LIST_UPDATE](state, data) {
    const newMap = state.list
    newMap.set(data._id, data)
    state.list = newMap
  }
}

const actions = {
  async [ACTIONS.SCHEMA_LIST_GET]({ commit }, limit = 0, start = 0) {
    const result = await fetch({
      url: '/api/schematas',
      data: {
        limit,
        start
      }
    })
    const { err, data } = result
    if(!err) {
      commit(MUTATIONS.SCHEMA_LIST_SAVE, data.list, start)
    }
    return result
  },
  /* eslint-disable no-unused-vars */
  async [ACTIONS.SCHEMA_POST]({ commit }, data) {
    const result = await fetch({
      url: '/api/schemata',
      method: 'post',
      data
    })
    return result
  },
  async [ACTIONS.SCHEMA_DELETE]({ commit }, data) {
    const result = await fetch({
      url: '/api/schemata',
      method: 'delete',
      data
    })
    return result
  },
  async [ACTIONS.SCHEMA_FIELD_POST]({ dispatch }, data) {
    const result = await fetch({
      url: '/api/schemataField',
      method: 'post',
      data
    })
    if(!result.err) {
      await dispatch(ACTIONS.SCHEMA_LIST_GET)
    }
    return result
  },
  async [ACTIONS.SCHEMA_FIELD_PUT]({ commit }, data) {
    const result = await fetch({
      url: '/api/schemataField',
      method: 'put',
      data
    })
    if(!result.err) {
      await commit(MUTATIONS.SCHEMA_LIST_UPDATE, result.data)
    }
    return result
  }
}
export default {
  state,
  mutations,
  actions
}