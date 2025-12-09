import { AxiosProxyConfig } from "axios";
import { AxiosRequestConfig } from "axios";
import axios from "axios";

export declare function get<T = any>(
  path: string,
  additionalOptions: AxiosRequestConfig | any
): ReturnType<typeof axios.get<T>>

export declare function post<T = any>(
  path: string,
  additionalOptions: AxiosRequestConfig | any
): ReturnType<typeof axios.post<T>>

export declare function setProxy(
  proxyConfig: AxiosProxyConfig,
): undefined

export declare function setClient(
  proxyConfig: typeof axios,
): undefined
