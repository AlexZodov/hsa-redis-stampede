# hsa-redis-stampede

## How to start
1. Clone the repo to local machine
2. Head to `./server` on local machine and run `npm install` (required once to create node_modules folder before it will be projected to inner docker container filesystem)
3. Head to root of the cloned repo
4. Create actual `.env` file from `.env.dist` in the `./server` folder
5. Provide values for redis host and port (if not changed - take from .env.dist)
6. Run `docker-compose up -d`

## How to test
1. Probabilistic stampede (As expiration time (ttl) is close to 0 - more "positive" probability for randomizer)
   1. Run script siege/test-probabilistic.sh
   2. After finish head to `GET localhost:9999/api/v1/unit-1/probabilistic/metrics`
   3. ```
      {
         "result": {
            "hits": 80938,
            "misses": 0
         }
      }
2. Change-lock stampede (if key missing - execute 3 attempts with delay of 50 ms, on each attempt check additional cache key for locking changing to this exact value, if no lock key or last attempt - refresh target value, as successful hit - register only first attempt hit)
   1. Run script siege/test-change-lock.sh
   2. After finish head to `GET localhost:9999/api/v1/unit-1/change-lock/metrics`
   3. ```
      {
         "result": 
         {
            "hits": 16337,
            "misses": 10
         }
      }
      
      