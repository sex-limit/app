type DouyinLoginScope = 'user_info';

interface DouyinLoginResponse {
  /**
   * token 凭证
   */
  code: string;
}

export interface DouyinModuleInterface {
  /**
   * 初始化
   * @param clientKey {string} 抖音开放平台申请的 clientKey
   */
  init(clientKey: string): void;
  /**
   * 登录
   * @param scope {DouyinLoginScope} 抖音开放平台申请的 scope
   */
  login(scope: DouyinLoginScope): Promise<DouyinLoginResponse>;
}
