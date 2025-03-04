# 1. Use an official Node.js image as the base
FROM node:18-alpine

# 2. Set the working directory inside the container
WORKDIR /app

# 3. Copy package.json and package-lock.json first (for efficient caching)
COPY package.json package-lock.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy the rest of the project files
COPY . .

# 6. Build the Next.js project
RUN npm run build

# 7. Expose the port that Next.js runs on
EXPOSE 3000

# 8. Start the Next.js server
CMD ["npm", "run", "start"]
