import { RTCSessionDescription } from "react-native-webrtc";

export async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retries: number = 3,
  backoff: number = 1000
): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      // Attempt the fetch request
      const response = await fetch(url, options);

      // If the response is ok (status in the range 200-299), return it
      if (response.ok) {
        return response;
      } else {
        throw new Error(`Request failed with status ${response.status}`);
      }
    } catch (error) {
      // If this was the last attempt, rethrow the error
      if (i === retries - 1) {
        let msg = "Unknown";

        if (error instanceof Error) {
          msg = error.message;
        }

        throw new Error(`Fetch failed after ${retries} attempts: ${msg}`);
      }

      // Otherwise, wait for the backoff time before retrying
      await new Promise((resolve) => setTimeout(resolve, backoff));

      // Exponentially increase the backoff time
      backoff *= 2;
    }
  }

  // This line should never be reached, but TypeScript requires a return type
  throw new Error("Unexpected error");
}

export function isAValidRTCSessionDescription(
  obj: unknown
): obj is RTCSessionDescription {
  // Check if the object is non-null and of type 'object'
  if (obj && typeof obj === "object") {
    const rtcObj = obj as Partial<RTCSessionDescription>;

    // Check if 'type' exists and is one of the valid values
    const isValidType =
      rtcObj.type === "offer" ||
      rtcObj.type === "answer" ||
      rtcObj.type === "rollback";

    // Check if 'sdp' exists and is a string
    const isValidSdp =
      rtcObj.sdp === undefined || typeof rtcObj.sdp === "string";

    return isValidType && isValidSdp;
  }

  return false;
}
