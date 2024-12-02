export { default } from "next-auth/middleware"

export const config = { matcher: ["/chat/:path*", "/chat-history/:path*", "/dashboard/:path*"] };