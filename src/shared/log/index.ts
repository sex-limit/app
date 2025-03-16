import { client } from "@/api"

export const reportLog = (params: { eventName: string, params: any }) => {
  client({
    method: 'POST',
    url: '/report/log',
    data: params
  })
}