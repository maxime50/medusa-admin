# 1) Builder
##########################################################
FROM node:19-alpine AS builder
WORKDIR /app
COPY . .

# Install dependencies with the preferred package manager
RUN yarn

# Build the app
RUN yarn run build

# 2) Runner
##########################################################
# FROM node:19 AS runner
# WORKDIR /app
#
# # Create a non-root user and group to run the app
# RUN addgroup --system --gid 1001 progtech
# RUN adduser --system --uid 1001 progtech
#
# COPY --from=builder --chown=progtech:progtech /app/public .
# COPY --from=builder --chown=progtech:progtech /app/package.json .
# COPY --from=builder --chown=progtech:progtech /app/node_modules ./node_modules
#
# # Switch to the new non-root user
# USER progtech

# Startup
EXPOSE 7000
ENV NODE_ENV production
CMD ["yarn", "preview", "--host"]
