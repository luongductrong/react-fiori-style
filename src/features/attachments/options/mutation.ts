import { mutationOptions } from "@tanstack/react-query";
import { axiosInstance } from "@/libs/axios-instance";
import { ODATA_SERVICE } from "@/app-constant";
import { MUTATION_API } from "../constants";
import type { RollbackVersionPayload } from "../types";
import { fetchCsrfToken, getCsrfToken } from "@/libs/helpers";

type RollbackParams = {
  fileId: string;
  onSuccess?: () => void;
  onError?: (_error: Error) => void;
};

export function rollbackVersionMutationOptions({
  fileId,
  onSuccess,
  onError,
}: RollbackParams) {
  return mutationOptions({
    mutationKey: ["attachments", fileId, "rollback-version"],
    mutationFn: async (payload: RollbackVersionPayload) => {
      let token = getCsrfToken();

      if (!token) {
        await fetchCsrfToken();
        token = getCsrfToken();
      }

      const res = await axiosInstance.patch<unknown>(
        `${ODATA_SERVICE.ATTACHMENT}${MUTATION_API.rollbackVersion(fileId)}`,
        payload,
        {
          headers: {
            "accept-language": "en",
            ...(token ? { "x-csrf-token": token } : {}),
          },
        },
      );
      return res;
    },
    onSuccess,
    onError,
  });
}
