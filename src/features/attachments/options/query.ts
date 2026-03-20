import { API } from "../constants";
import { ODATA_SERVICE } from "@/app-constant";
import { axiosInstance } from "@/libs/axios-instance";
import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import type { AttachmentListParams, AttachmentListResponse } from "../types";

export function getAttachmentsQueryOptions(params: AttachmentListParams) {
  return queryOptions({
    queryKey: ["attachments", params],
    queryFn: () => {
      const res = axiosInstance.get<AttachmentListResponse>(
        `${ODATA_SERVICE.ATTACHMENT}/${API.endpoint}`,
        {
          params,
        },
      );
      return res;
    },
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });
}
