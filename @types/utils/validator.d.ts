// 用户注册参数
export interface userRegisterData {
  nickname: string;
  phoneNumber: string;
  password: string;
}

// 用户登录参数
export interface authLoginData {
  phoneNumber: string;
  password: string;
}

// 话题创建参数
export interface topicCreateData {
  topicName: string;
  topicPic: string;
  topicIntroduction: string;
}

// 问题创建参数
export interface questionCreateData {
  title: string;
  descriptions: string;
}

export interface answerCreateData {
  content: string;
}

export interface commentCreateData {
  content: string;
}
