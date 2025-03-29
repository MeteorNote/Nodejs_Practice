/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images:{
    domains: ["www.gravatar.com", "localhost", "ec2-54-188-124-131.us-west-2.compute.amazonaws.com"]
  }
}

module.exports = nextConfig
