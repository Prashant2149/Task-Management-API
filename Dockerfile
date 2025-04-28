# Use official Node.js image as the base image
FROM node:16

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) into the container
COPY package*.json ./

# Install the app dependencies
RUN npm install

# Copy the rest of the app into the container
COPY . .

# Expose the application port (3000 or whichever port your app uses)
EXPOSE 3000

# Start the Node.js app
CMD ["npm", "start"]