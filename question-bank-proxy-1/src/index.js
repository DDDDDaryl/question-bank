/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
	async fetch(request, env, ctx) {
		const url = new URL(request.url)
		const targetUrl = new URL('https://question-bank-vert.vercel.app' + url.pathname + url.search)
		
		// 处理 CORS 预检请求
		if (request.method === 'OPTIONS') {
			return new Response(null, {
				headers: {
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
					'Access-Control-Allow-Headers': 'Content-Type, Authorization',
					'Access-Control-Max-Age': '86400',
				},
			})
		}
		
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
};
