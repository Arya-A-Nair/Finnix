# Use Node.js 20 as the parent image
FROM node:20-alpine

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install any needed packages specified in package.json
RUN npm install

# Bundle app source inside the docker image
COPY . .

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Set NODE_OPTIONS environment variable
ENV NODE_OPTIONS="--experimental-modules --es-module-specifier-resolution=node"

# Define the command to run your app using npm start
CMD [ "npm", "run", "start" ]