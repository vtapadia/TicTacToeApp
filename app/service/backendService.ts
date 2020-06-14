interface HttpResponse<T> extends Response {
  parsedBody?: T;
}

let serverBase:string ="";

export function setServerBase(baseUrl: string) {
  serverBase = baseUrl;
}

async function http<T>(
  request: RequestInfo
): Promise<HttpResponse<T>> {
  const response: HttpResponse<T> = await fetch(
    request
  );
  response.parsedBody = await response.json();
  return response;
}

export async function get<T>(
  path: string,
  args: RequestInit = { method: "get" }
): Promise<HttpResponse<T>> {
  return await http<T>(new Request(serverBase + path, args));
};

export async function post<T>(
  path: string,
  body: any,
  args: RequestInit = { 
    method: "post", 
    body: JSON.stringify(body), 
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    redirect: 'follow'
  }
): Promise<HttpResponse<T>>  {
  return await http<T>(new Request(serverBase + path, args));
};