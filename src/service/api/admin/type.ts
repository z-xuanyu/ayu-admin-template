export interface AddAdminParams {
  // 昵称
  name: string;

  // 登录账号
  email: string;

  // 手机号码
  phone: string;

  // 登录密码
  password?: string;

  // 头像
  avatar: string;

  // 性别
  gender: number;
}

export interface UpdateAdminParams extends AddAdminParams {
  _id?: string;
}
