#
# Build Production Artifacts
# ==========================================
#
# this first step takes in the source files and build the artifacts
# (basicall all that need to be installed or transpiled).
#
# We do install the NPM dependencies twice so to copy over to the
# production image only what is strictly needed to execute our app.
#
# NPM Install is the first step so to exploit Docker's cache mechanism
# and speed up the building process. We will re-install from NPM only
# if we touch the `package.json` file. Which doesn't happen so often.
#

FROM node:12.13-alpine AS builder

# NPM Install Dependencies
WORKDIR /usr/src/app-build
ADD package.json /usr/src/app-build
ADD package-lock.json /usr/src/app-build
RUN npm install --production
RUN npm prune --production




#
# Runner Image
# ==========================================
#
# In this step we start over with a fresh image and copy only what is
# strictly necessary in order to run a production build.
#
# The idea is to keep this image as small as possible.
#

FROM node:12.13-alpine AS runner

# Copy project specific assets:
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app-build/node_modules ./node_modules
ADD src /usr/src/app

# Default environment configuration:
EXPOSE 8080
ENV NODE_ENV=production

WORKDIR /usr/src/app
CMD node index.js
