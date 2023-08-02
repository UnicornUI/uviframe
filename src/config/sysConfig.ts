export interface BmodItem {
  name: string;
  enable: boolean;
}
export interface SysConfig {
  baseUrl: string;
  // 主机地址和监听端口
  bmodNames: BmodItem[]
}

const sysConfig: SysConfig = {
  baseUrl: "http://localhost:8000/api/v1/public",
  bmodNames: [{
    name: "blog",
    enable: true,
  }],
}

export default sysConfig;
