export const messages = {
  getMassRejudgeAlert: (...args) => {
    return `Không có submissions nào để Rejudge.`
  },
  getMassRejudgeConfirm: (...args) => {
    return `Yêu cầu này sẽ Rejudge lại ${args[0]} submission(s). Bạn có chắc chắn không?`
  },

  toast: {
    rejudging: {
      getOK: (...args) => {return "OK Rejudging..."},
      getErr: (...args) => { return `Cannot rejudge. (${args[0]})` },
    }
  },
};

export const values = {
  refetchDisableDuration: 2000,
}
