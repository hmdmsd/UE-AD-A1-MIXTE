# Use an official Node.js image as the base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package.json package-lock.json ./

# Install the project dependencies
RUN npm install

# Copy the rest of the application files to the container
COPY . .

# Expose port 3000 for the application
EXPOSE 3000

# Start the Next.js development server
CMD ["npm", "run", "dev"]