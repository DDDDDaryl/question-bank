export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    const targetUrl = new URL('https://question-bank-vert.vercel.app' + url.pathname + url.search)
    
    // 创建新的请求，保持原始请求的方法、头部和正文
    let modifiedRequest = new Request(targetUrl, {
      method: request.method,
      headers: request.headers,
      body: request.body,
      redirect: 'follow'
    })
    
    try {
      // 发送请求到目标服务器
      let response = await fetch(modifiedRequest)
      
      // 创建新的响应，添加必要的头部
      let newResponse = new Response(response.body, response)
      
      // 添加 CORS 头部，允许所有来源访问
      newResponse.headers.set('Access-Control-Allow-Origin', '*')
      newResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
      newResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
      
      // 添加缓存控制头部
      newResponse.headers.set('Cache-Control', 'public, max-age=3600')
      
      return newResponse
    } catch (error) {
      // 错误处理
      return new Response(`代理请求失败: ${error.message}`, { 
        status: 500,
        headers: {
          'Content-Type': 'text/plain;charset=UTF-8',
          'Access-Control-Allow-Origin': '*'
        }
      })
    }
  }
} 