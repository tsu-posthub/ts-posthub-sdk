import axios, { AxiosHeaders } from "axios";
import type { AxiosInstance, AxiosRequestConfig } from "axios";
import { API_BASE_URL } from "../config.js";

export class ApiClient {
  private token?: string;
  private instance: AxiosInstance;

  constructor(token?: string) {
    this.token = token ?? "";

    this.instance = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.instance.interceptors.request.use(config => {
      const headers = config.headers instanceof AxiosHeaders
        ? config.headers
        : new AxiosHeaders(config.headers);

      if (this.token) {
        headers.set("Authorization", `Bearer ${this.token}`);
      }

      config.headers = headers;
      return config;
    });
  }

  setToken(token: string) {
    this.token = token;
  }

  async request<T>(endpoint: string, options: AxiosRequestConfig = {}): Promise<T> {
    try {
      const response = await this.instance.request<T>({
        url: endpoint,
        ...options,
      });
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(`${error.response.status} ${error.response.statusText}`);
      } else {
        throw new Error(`${error.message}`);
      }
    }
  }
}
