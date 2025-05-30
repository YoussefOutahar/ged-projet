# Use an official Node.js runtime as the base image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install project dependencies
RUN npm install --froce

# Copy the rest of your application code
COPY . .

# Build the production-ready application
RUN npm run build

RUN mkdir -p /app/tmp && chmod 777 /app/tmp

# Expose the port that your Next.js app will run on
EXPOSE 3000

USER root
CMD ["npm", "start"]
